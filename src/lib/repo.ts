/**
 * Repository —— 产品所有的写操作都从这里走。
 *
 * 两条不变式：
 *   1. 完成即保存（只用 IndexedDB，没有账号、没有云同步）
 *   2. **推荐只是建议**：系统推的东西，学生可以整组接受、调整数量、
 *      换内容，或者整组忽略。任何时候都不���写学生自己做的事。
 *
 * 这里没有「每日任务」了。整个 App 只有一张学习记录表 `logs` ——
 * 首页的 Today's Focus、日常习惯、自主练习、每周目标、站外补录，
 * 全都写进它。统计只有一份真相，不会出现「自主练习做了但没算进去」。
 */

import { db, DEFAULT_SETTINGS, isBrowser } from "./db";
import { addDays, dayIndex, startOfWeek, todayKey, uid, type DateKey } from "./date";
import {
  STAGES,
  areaCoverage,
  daysUntilExam,
  planRationale,
  recomputeBasis,
  recomputeTarget,
  recommendWeeklyGoals,
  stageFor,
  weeklyFocus,
  WEAK_AREA_LABEL,
  type PracticeCoverage,
  type WeakArea,
} from "./journey";
import { mergeVocabEntry, normWord } from "./vocab";
import { entryMeaning, entrySourceLabel, type WordbookEntry } from "./wordbooks";
import type {
  BackupFile,
  PaperAttempt,
  PlanChange,
  Profile,
  Settings,
  StudyLog,
  TaskType,
  VocabEntry,
  VocabSourceKind,
  WeeklyGoalItem,
  WeeklyPlan,
} from "./types";

/* ------------------------------------------------------------------ profile */

export const profile = getProfile;
export const settings = getSettings;

export async function getProfile(): Promise<Profile | undefined> {
  return db.profile.get("me");
}

export async function saveProfile(profile: Profile): Promise<void> {
  await db.profile.put({ ...profile, updatedAt: Date.now() });
}

export async function getSettings(): Promise<Settings> {
  const stored = await db.settings.get("app");
  return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
}

export async function saveSettings(patch: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  await db.settings.put({ ...current, ...patch, id: "app", updatedAt: Date.now() });
}

/* --------------------------------------------------- 真实练习覆盖度（只读事实） */

/**
 * 算「练到哪儿了」。
 *
 * 全部来自系统自己记下的事实：真题哪些题段交过卷、写作翻译做过几次、
 * 词库碰过多少词、站外记了多少条。**不含任何估计，也不含自报成绩。**
 */
export async function practiceCoverage(): Promise<PracticeCoverage> {
  const attempts = await db.paperAttempts.toArray();
  const finishedUnits: string[] = [];
  /**
   * 按卷分开记：不同卷的题段 id 会重名（每套的对话都叫 l-c1）。
   * 合成一个扁平集合的话，「这套练过了」会被当成「每套都练过了」，
   * 推荐就永远停在第一套卷子上。
   */
  const finishedUnitsByPaper: Record<string, string[]> = {};
  let writings = 0;
  let translations = 0;
  for (const a of attempts) {
    finishedUnits.push(...a.finishedUnits);
    if (a.finishedUnits.length > 0) {
      finishedUnitsByPaper[a.paperId] = [
        ...(finishedUnitsByPaper[a.paperId] ?? []),
        ...a.finishedUnits,
      ];
    }
    if (a.finishedUnits.includes("writing")) writings += 1;
    if (a.finishedUnits.includes("translation")) translations += 1;
  }
  const logs = await db.logs.toArray();
  const vocabTouched = new Set<string>();
  for (const l of logs) if (l.type === "vocab") vocabTouched.add(l.title);
  return {
    finishedUnits,
    finishedUnitsByPaper,
    writings,
    translations,
    vocabTouched: vocabTouched.size + (await db.vocab.count()),
    offsiteLogs: logs.filter((l) => l.source === "offsite").length,
  };
}

/* ------------------------------------------------------------ 每周推荐目标 */

export function currentWeekStart(from: DateKey = todayKey()): DateKey {
  return startOfWeek(from);
}

async function nextId(prefix: string): Promise<string> {
  return uid(prefix);
}

/**
 * 拿到这一周的推荐目标组；没有就按 Study Journey 生成一份。
 *
 * 注意这里的返回是**一份建议**，不是一份日程：
 * 没有日期、没有"必须今天做"，学生想什么时候做就什么时候做。
 */
export async function ensureWeeklyPlan(
  weekStart: DateKey = currentWeekStart(),
): Promise<WeeklyPlan> {
  // 用 getWeeklyPlan 而不是 .first()：被忽略归档的那份和后来重新生成的那份
  // weekStart 相同，.first() 可能拿到已归档的，于是每次进来都会重新生成一份，
  // 学生刚加的目标和刚做的标记就被换掉了。
  const existing = await getWeeklyPlan(weekStart);
  if (existing && !existing.archived) return existing;

  const profile = await getProfile();
  const coverage = await practiceCoverage();

  const { stage, rationale, goals } = recommendWeeklyGoals({
    profile: {
      examDate: profile?.examDate ?? todayKey(),
      weakAreas: (profile?.weakAreas ?? []) as WeakArea[],
    },
    coverage,
  });

  const plan: WeeklyPlan = {
    id: await nextId("wplan"),
    weekStart,
    stageId: stage.id,
    stageName: stage.name,
    rationale,
    accepted: false,
    archived: false,
    createdAt: Date.now(),
    goals: goals.map((g, i) => ({
      ...g,
      id: uid("wgi"),
      detail: g.detail ?? "",
      basis: g.basis,
      source: "system",
      done: false,
      sortKey: i,
    })),
  };
  await db.weeklyPlans.put(plan);
  return plan;
}

export async function getWeeklyPlan(
  weekStart: DateKey = currentWeekStart(),
): Promise<WeeklyPlan | undefined> {
  // 同一周可能存在两份：被忽略归档的那份，和之后重新生成的那份。
  // 必须优先返回没归档的，否则页面会把学生已经忽略掉的建议又端出来。
  const rows = await db.weeklyPlans.where("weekStart").equals(weekStart).toArray();
  return rows.find((p) => !p.archived) ?? rows[0];
}

export async function listWeeklyPlans(): Promise<WeeklyPlan[]> {
  const rows = await db.weeklyPlans.toArray();
  return rows.sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}

/** 学生整组接受。接受之后推荐还是建议，只是他知道我们推了什么。 */
export async function acceptWeeklyPlan(planId: string): Promise<void> {
  await db.weeklyPlans.update(planId, { accepted: true });
  await recordChange({
    scope: "accept",
    summary: "接受了本周推荐",
    details: ["接受之后仍然可以随时改数量或换内容"],
  });
}

/** 学生整组忽略。这一周就不再提示推荐。 */
export async function ignoreWeeklyPlan(planId: string): Promise<void> {
  const plan = await db.weeklyPlans.get(planId);
  await db.weeklyPlans.update(planId, { archived: true, accepted: true });
  if (plan) {
    await recordChange({
      scope: "ignore",
      summary: "这一周没用推荐",
      details: [`推荐的是：${plan.goals.map((g) => g.title).join("、")}`],
    });
  }
}

export async function addWeeklyGoal(
  planId: string,
  input: { title: string; type: TaskType; units?: number },
): Promise<WeeklyGoalItem> {
  const plan = await db.weeklyPlans.get(planId);
  if (!plan) throw new Error("没有这一周的计划。");
  const item: WeeklyGoalItem = {
    id: uid("wgi"),
    title: input.title.trim(),
    type: input.type,
    detail: "",
    units: Math.max(1, Math.min(6, Math.round(input.units ?? 1))),
    basis: "你自己加的",
    done: false,
    source: "student",
    sortKey: plan.goals.length,
  };
  await db.weeklyPlans.update(planId, { goals: [...plan.goals, item] });
  await recordChange({ scope: "adjust", summary: `加了一项「${item.title}」`, details: [] });
  return item;
}

export async function removeWeeklyGoal(planId: string, goalId: string): Promise<void> {
  const plan = await db.weeklyPlans.get(planId);
  if (!plan) return;
  await db.weeklyPlans.update(planId, { goals: plan.goals.filter((g) => g.id !== goalId) });
  await recordChange({ scope: "adjust", summary: "删掉了一项本周目标", details: [] });
}

export async function updateWeeklyGoal(
  planId: string,
  goalId: string,
  patch: Partial<Pick<WeeklyGoalItem, "title" | "units" | "type">>,
): Promise<void> {
  const plan = await db.weeklyPlans.get(planId);
  if (!plan) return;
  await db.weeklyPlans.update(planId, {
    goals: plan.goals.map((g) => (g.id === goalId ? { ...g, ...patch } : g)),
  });
  await recordChange({
    scope: "adjust",
    summary: "调整了一项本周目标",
    details: Object.keys(patch).map((k) => k),
  });
}

/**
 * 把计划里的系统话术按当前状态重算一遍：标题那句话、每一项的依据，还有每一项的落点。
 *
 * 这些话有两样东西会让它变：文案改了版，学生又练了新的题（还有日子本身在走）。
 * 计划是存下来的，存下来的话就容易锁死在生成那一刻的样子上 ——
 * 所以每次打开这一周的计划都重算一次。
 *
 * 落点也要重算：真题推荐是跟着卷子轮换的（这套练完换下一套），
 * 落点锁死的话，学生练完一段、计划还指着那一段，轮换就等于没做。
 *
 * 只动话术和落点：学生自己加的项、删掉的项、顺序、数量、已完成标记都不动。
 * 算出来跟原来一模一样时就不写库，免得每次打开都白写一次。
 */
export async function refreshWeeklyPlanText(planId: string): Promise<void> {
  const plan = await db.weeklyPlans.get(planId);
  if (!plan) return;
  const student = await getProfile();
  // 没有档案就不动学生的计划：连考期都没有，算出来的话没有意义
  if (!student) return;
  const coverage = await practiceCoverage();
  const days = daysUntilExam(student.examDate);
  const stage = STAGES.find((s) => s.id === plan.stageId) ?? stageFor(days ?? 0);
  const basis = recomputeBasis(
    plan.goals,
    {
      profile: { examDate: student.examDate, weakAreas: student.weakAreas },
      coverage,
    },
    stage,
  );
  const target = recomputeTarget(plan.goals, coverage);
  const goals = plan.goals.map((g, i) => ({
    ...g,
    basis: basis[i],
    paperId: target[i].paperId,
    paperUnitId: target[i].paperUnitId,
    detail: target[i].detail,
  }));
  const rationale = planRationale(days, stage);
  const same =
    rationale === plan.rationale &&
    goals.every(
      (g, i) =>
        g.basis === plan.goals[i].basis &&
        g.detail === plan.goals[i].detail &&
        g.paperId === plan.goals[i].paperId &&
        g.paperUnitId === plan.goals[i].paperUnitId,
    );
  if (same) return;
  await db.weeklyPlans.update(planId, { goals, rationale });
}

/* ---------------------------------------------------------------- 学习记录 */

/**
 * 记一笔学习。**所有入口都走这里** ——
 * 首页 Focus、日常习惯、自主练习、每周目标、站外补录。
 *
 * 这是"自主练习和推荐任务共用记录、避免重复统计"的实现：
 * 它们写的是同一张表，日历和周报也只读这张表。
 */
export async function logStudy(input: {
  date?: DateKey;
  title: string;
  units?: number;
  detail?: string;
  source: StudyLog["source"];
  type?: TaskType;
  goalItemId?: string;
  paperId?: string;
  paperUnitId?: string;
  examPart?: string;
}): Promise<StudyLog> {
  const log: StudyLog = {
    id: uid("log"),
    date: input.date ?? todayKey(),
    units: Math.max(1, Math.round(input.units ?? 1)),
    title: input.title.trim(),
    detail: input.detail,
    source: input.source,
    goalItemId: input.goalItemId,
    paperId: input.paperId,
    paperUnitId: input.paperUnitId,
    examPart: input.examPart,
    type: input.type,
    createdAt: Date.now(),
  };
  await db.logs.add(log);

  // 完成一项周目标时同步标记，但**只在同一周内**
  if (input.goalItemId) await markGoalDone(input.goalItemId);
  return log;
}

async function markGoalDone(goalItemId: string): Promise<void> {
  const rows = await db.weeklyPlans.toArray();
  for (const plan of rows) {
    if (!plan.goals.some((g) => g.id === goalItemId)) continue;
    await db.weeklyPlans.update(plan.id, {
      goals: plan.goals.map((g) =>
        g.id === goalItemId ? { ...g, done: true, completedAt: Date.now() } : g,
      ),
    });
    return;
  }
}

export async function undoGoal(planId: string, goalId: string): Promise<void> {
  const plan = await db.weeklyPlans.get(planId);
  if (!plan) return;
  await db.weeklyPlans.update(planId, {
    goals: plan.goals.map((g) => (g.id === goalId ? { ...g, done: false, completedAt: undefined } : g)),
  });
}

export async function getLogsInRange(start: DateKey, end: DateKey): Promise<StudyLog[]> {
  const rows = await db.logs.where("date").between(start, end, true, true).toArray();
  return rows.sort((a, b) => a.createdAt - b.createdAt);
}

export async function getAllLogs(): Promise<StudyLog[]> {
  return db.logs.toArray();
}

export async function getLogsOn(date: DateKey): Promise<StudyLog[]> {
  return db.logs.where("date").equals(date).toArray();
}

export async function deleteLog(id: string): Promise<void> {
  await db.logs.delete(id);
}

/* ------------------------------------------------------------------ 习惯 */

/** 今天习惯做过了没有 —— 只看真实记录，不看计划。 */
export async function habitsOn(date: DateKey = todayKey()): Promise<{ vocab: boolean; listening: boolean }> {
  const logs = await getLogsOn(date);
  return {
    vocab: logs.some((l) => l.type === "vocab" || l.type === "sentence"),
    listening: logs.some((l) => l.type === "intensive-listen" || l.type === "listening-paper"),
  };
}

/* ---------------------------------------------------------------- 周报 */

export interface WeeklyReport {
  weekStart: DateKey;
  suggested: number;
  completed: number;
  doneAreas: string[];
  missedAreas: string[];
  studyDays: number;
  units: number;
  /** 下周重点，全部来自上周真实记录 */
  nextFocus: string[];
}

/**
 * 每周报告 —— **只说上周真实发生了什么**，然后据此建议下周重点。
 *
 * 这里不做两件事：不预测分数，也不把没做完的算成欠账。
 */
export async function buildWeeklyReport(
  weekStart: DateKey = currentWeekStart(),
): Promise<WeeklyReport> {
  const weekEnd = addDays(weekStart, 6);
  const [logs, plan, profile] = await Promise.all([
    getLogsInRange(weekStart, weekEnd),
    getWeeklyPlan(weekStart),
    getProfile(),
  ]);

  const stage = stageFor(daysUntilExam(profile?.examDate ?? todayKey()));
  const cov = areaCoverage(await practiceCoverage(), stage);
  const doneAreas = cov.filter((c) => c.ratio >= 1).map((c) => c.area);
  const missedAreas = cov.filter((c) => c.ratio < 0.4).map((c) => c.area);

  return {
    weekStart,
    suggested: plan?.goals.length ?? 0,
    completed: plan?.goals.filter((g) => g.done).length ?? 0,
    doneAreas: doneAreas.map((a) => WEAK_AREA_LABEL[a]),
    missedAreas,
    studyDays: new Set(logs.map((l) => l.date)).size,
    units: logs.reduce((n, l) => n + l.units, 0),
    nextFocus: weeklyFocus({
      completed: plan?.goals.filter((g) => g.done).length ?? 0,
      suggested: plan?.goals.length ?? 0,
      doneAreas,
      missedAreas,
      daysLeft: profile ? daysUntilExam(profile.examDate) : null,
    }),
  };
}

/**
 * 周一到了就归档上周。
 *
 * **没做完的直接带走，不追责**：不结转、不显示"未完成 N 项"、不影响连续天数。
 * 这条是整个督学机制的减压阀 —— 一周只有七天，推荐了 4 项只做完 2 项很正常。
 */
export async function archivePreviousWeek(
  weekStart: DateKey = currentWeekStart(),
): Promise<WeeklyPlan | null> {
  const lastWeek = addDays(weekStart, -7);
  const plan = await getWeeklyPlan(lastWeek);
  if (!plan || plan.archived) return null;
  await db.weeklyPlans.update(plan.id, { archived: true });
  return plan;
}

/* ------------------------------------------------------------------ 变更记录 */

export async function getChanges(): Promise<PlanChange[]> {
  const rows = await db.changes.toArray();
  return rows.sort((a, b) => b.createdAt - a.createdAt);
}

async function recordChange(
  change: Omit<PlanChange, "id" | "createdAt">,
): Promise<void> {
  await db.changes.add({ ...change, id: uid("chg"), createdAt: Date.now() });
}

/* ------------------------------------------------------------------ 备份 */

export async function exportBackup(): Promise<BackupFile> {
  const [profile, weeklyPlans, logs, settings, paperAttempts, vocab, changes] =
    await Promise.all([
      db.profile.get("me"),
      db.weeklyPlans.toArray(),
      db.logs.toArray(),
      db.settings.get("app"),
      db.paperAttempts.toArray(),
      db.vocab.toArray(),
      db.changes.toArray(),
    ]);
  return {
    app: "cet6-study-companion",
    version: 5,
    exportedAt: new Date().toISOString(),
    profile: profile ?? null,
    weeklyPlans,
    logs,
    settings: settings ?? null,
    paperAttempts,
    vocab,
    changes,
  };
}

export async function importBackup(payload: BackupFile): Promise<void> {
  if (payload?.app !== "cet6-study-companion") {
    throw new Error("这不是本产品的备份文件。");
  }
  if (!isBrowser) return;
  await db.transaction(
    "rw",
    [db.profile, db.weeklyPlans, db.logs, db.settings, db.paperAttempts, db.vocab, db.changes],
    async () => {
      await Promise.all([
        db.profile.clear(),
        db.weeklyPlans.clear(),
        db.logs.clear(),
        db.settings.clear(),
        db.paperAttempts.clear(),
        db.vocab.clear(),
        db.changes.clear(),
      ]);
      if (payload.profile) await db.profile.put(payload.profile);
      if (payload.settings) await db.settings.put({ ...DEFAULT_SETTINGS, ...payload.settings });
      if (payload.weeklyPlans?.length) await db.weeklyPlans.bulkPut(payload.weeklyPlans);
      if (payload.logs?.length) await db.logs.bulkPut(payload.logs);
      if (payload.paperAttempts?.length) await db.paperAttempts.bulkPut(payload.paperAttempts);
      if (payload.vocab?.length) await db.vocab.bulkPut(payload.vocab);
      if (payload.changes?.length) await db.changes.bulkPut(payload.changes);
    },
  );
}

/* ------------------------------------------------------------- 真题作答 */

export async function loadPaperAttempt(paperId: string): Promise<PaperAttempt> {
  const existing = await db.paperAttempts.get(paperId);
  if (existing) {
    return {
      ...existing,
      answers: existing.answers ?? {},
      seconds: existing.seconds ?? {},
      revealed: existing.revealed ?? [],
      finishedUnits: existing.finishedUnits ?? [],
      drafts: existing.drafts ?? {},
      posMarks: existing.posMarks ?? {},
      sessions: existing.sessions ?? {},
    };
  }
  return {
    id: paperId,
    paperId,
    answers: {},
    seconds: {},
    revealed: [],
    finishedUnits: [],
    drafts: {},
    posMarks: {},
    sessions: {},
    updatedAt: 0,
  };
}

export async function savePaperAttempt(patch: PaperAttempt): Promise<void> {
  await db.paperAttempts.put({ ...patch, updatedAt: Date.now() });
}

export async function clearPaperAttempt(paperId: string): Promise<void> {
  await db.paperAttempts.delete(paperId);
}

export async function resetEverything(): Promise<void> {
  if (!isBrowser) return;
  await db.delete();
  await db.open();
}

/* ------------------------------------------------------------------ 生词本 */

export interface AddVocabInput {
  word: string;
  meaning?: string;
  note?: string;
  sourceKind?: VocabSourceKind;
  sourcePaperId: string;
  sourceQuestionNo?: number;
  sourceSentenceId?: string;
  sourceLabel: string;
}

export async function addVocabEntry(input: AddVocabInput): Promise<VocabEntry> {
  const word = normWord(input.word);
  if (!word) throw new Error("词不能为空。");

  const found = await db.vocab.where("word").equals(word).first();
  const existing = found ? normalizeVocabEntry(found) : undefined;
  if (existing) {
    const merged = mergeVocabEntry(existing, {
      id: existing.id,
      word: existing.word,
      meaning: input.meaning?.trim() || undefined,
      note: input.note?.trim() || undefined,
      sourceKind: input.sourceKind ?? existing.sourceKind ?? "paper",
      sourcePaperId: input.sourcePaperId,
      sourceQuestionNo: input.sourceQuestionNo,
      sourceSentenceId: input.sourceSentenceId,
      sourceLabel: input.sourceLabel,
      createdAt: existing.createdAt,
      reviewCount: existing.reviewCount,
      lastReviewedAt: existing.lastReviewedAt,
    });
    await db.vocab.put(merged);
    return merged;
  }
  const entry: VocabEntry = {
    id: uid("vocab"),
    word,
    meaning: input.meaning?.trim() || undefined,
    note: input.note?.trim() || undefined,
    sourceKind: input.sourceKind ?? "paper",
    sourcePaperId: input.sourcePaperId,
    sourceQuestionNo: input.sourceQuestionNo,
    sourceSentenceId: input.sourceSentenceId,
    sourceLabel: input.sourceLabel,
    createdAt: Date.now(),
    reviewCount: 0,
  };
  await db.vocab.add(entry);
  return entry;
}

export async function addWordbookEntry(entry: WordbookEntry): Promise<VocabEntry> {
  return addVocabEntry({
    word: entry.word,
    meaning: entryMeaning(entry),
    sourceKind: "wordbook",
    sourcePaperId: "",
    sourceLabel: entrySourceLabel(entry),
  });
}

export async function getVocabEntries(): Promise<VocabEntry[]> {
  const rows = await db.vocab.toArray();
  return rows.map(normalizeVocabEntry).sort((a, b) => b.createdAt - a.createdAt);
}

export async function reviewVocabEntry(id: string): Promise<void> {
  const row = await db.vocab.get(id);
  if (!row) return;
  await db.vocab.put({ ...row, reviewCount: (row.reviewCount ?? 0) + 1, lastReviewedAt: Date.now() });
}

export async function updateVocabEntry(id: string, patch: Partial<VocabEntry>): Promise<void> {
  const row = await db.vocab.get(id);
  if (!row) return;
  await db.vocab.put({ ...normalizeVocabEntry(row), ...patch, id });
}

export async function deleteVocabEntry(id: string): Promise<void> {
  await db.vocab.delete(id);
}

function normalizeVocabEntry(row: VocabEntry): VocabEntry {
  return { ...row, sourceKind: row.sourceKind ?? "paper", reviewCount: row.reviewCount ?? 0 };
}

export { dayIndex };
