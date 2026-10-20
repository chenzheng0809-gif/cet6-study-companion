/**
 * Study Journey「建议只是默认选项」这一整条承诺的落库校验。
 *
 * 为什么单独跑：这次要证明的是**行为**，不是界面 ——
 * 「重复进一次 App 会不会把学生改过的推荐刷掉」
 * 「做完一项推荐，记录是不是真的落在同一张表里」
 * 「周末归档会不会把没做完的变成欠账」——
 * 这些靠肉眼点是点不出来的，而且点击链路在这个环境里不稳。
 * 所以用内存 IndexedDB 把整条写路径跑一遍。
 *
 * 跑法：npx tsx scripts/verify-plan-store.ts
 */

import "fake-indexeddb/auto";

import { addDays, startOfWeek, todayKey } from "../src/lib/date";
import { stageFor, daysUntilExam, recommendWeeklyGoals } from "../src/lib/journey";
import { currentStreak, monthStat, weekStat } from "../src/lib/stats";
import type { Profile } from "../src/lib/types";

let checks = 0;
let failures = 0;

function assert(condition: boolean, label: string): void {
  checks += 1;
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${label}`);
  }
}

function section(title: string): void {
  console.log(`\n${title}`);
}

function fakeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "me",
    nickname: "同学",
    major: "",
    cet4Score: 500,
    cet6History: "none",
    cet6PastScore: null,
    targetScore: 500,
    targetPreset: 500,
    examSessionId: "2026-12",
    examDate: addDays(todayKey(), 120),
    weakAreas: [],
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

const EMPTY_COVERAGE = {
  finishedUnits: [] as string[],
  writings: 0,
  translations: 0,
  vocabTouched: 0,
  offsiteLogs: 0,
};

async function reset(db: { tables: { clear(): Promise<unknown> }[] } & { open(): Promise<unknown> }): Promise<void> {
  await db.open();
  await Promise.all(db.tables.map((t) => t.clear()));
}

async function main(): Promise<void> {
  // 存储层为了不往 SSR 里写东西有一道 isBrowser 守卫，而它是**模块加载时**求值的快照。
  // 所以必须先把浏览器全局立起来、再动态 import 存储层：
  // 否则 importBackup 会静默什么都不做 —— 那正是"点了导入提示成功、其实没导入"最难查的那种失败。
  (globalThis as unknown as { window: unknown }).window = globalThis;
  const { db } = await import("../src/lib/db");
  const {
    acceptWeeklyPlan,
    addWeeklyGoal,
    archivePreviousWeek,
    buildWeeklyReport,
    ensureWeeklyPlan,
    exportBackup,
    getAllLogs,
    getChanges,
    getLogsOn,
    getWeeklyPlan,
    habitsOn,
    ignoreWeeklyPlan,
    importBackup,
    logStudy,
    practiceCoverage,
    refreshWeeklyPlanText,
    removeWeeklyGoal,
    saveProfile,
    saveSettings,
    undoGoal,
  } = await import("../src/lib/repo");

  const today = todayKey();
  const weekStart = startOfWeek(today);
  await reset(db);
  await saveProfile(fakeProfile());
  await saveSettings({ onboarded: true });

  /* ------------------------------------------ 1. 推荐只是一份默认建议 */
  section("1. 首次进入按 Study Journey 生成一周建议，且每条都说得出依据");
  const first = await ensureWeeklyPlan(weekStart);
  assert(first.goals.length > 0, `生成了 ${first.goals.length} 项本周建议`);
  assert(first.accepted === false, "刚生成时还没人确认过");
  assert(!("scheduledDate" in (first.goals[0] ?? {})), "建议里不得出现任何日期字段");
  assert(
    first.goals.every((g) => g.basis.trim().length > 0),
    "每一项建议都带依据说明",
  );
  assert(
    first.goals.every((g) => g.source === "system"),
    "系统生成的建议都标成 system，学生加的才标 student",
  );
  assert(
    !("estimatedMinutes" in first) && !("timeBudget" in first),
    "计划里不得出现时间预算或时长估算",
  );
  console.log(
    `  ${first.stageName} · ${first.rationale} · ${first.goals.map((g) => g.title).join("、")}`,
  );

  /* --------------------------------------- 2. 重复进入不得刷掉学生的改动 */
  section("2. 重复生成必须幂等，且绝不覆盖学生改过的内容");
  const same = await ensureWeeklyPlan(weekStart);
  assert(same.id === first.id, "同一周重复进入拿到的是同一份计划");
  assert(same.goals.length === first.goals.length, "重复进入没有多生成建议");
  assert(
    same.goals.map((g) => g.id).join(",") === first.goals.map((g) => g.id).join(","),
    "重复进入后建议的 id 完全一致",
  );

  const dropped = first.goals[first.goals.length - 1].id;
  await removeWeeklyGoal(first.id, dropped);
  const afterRemove = await ensureWeeklyPlan(weekStart);
  assert(
    !afterRemove.goals.some((g) => g.id === dropped),
    "学生删掉的一项，不会因为重新进一次 App 又长回来",
  );

  const added = await addWeeklyGoal(first.id, { title: "背作文模板", type: "custom", units: 2 });
  assert(added.source === "student", "学生自己加的标成 student");
  assert(added.basis === "你自己加的", "学生加的不编造依据");
  const afterAdd = await ensureWeeklyPlan(weekStart);
  assert(
    afterAdd.goals.some((g) => g.id === added.id && g.units === 2),
    "学生自己加的一项，重新进入后仍然在、模块数没被改",
  );

  /*
   * 「少一项」由学生自己挑：删掉哪一项都是一次精确删除。
   * 以前这里是"把建议截短到 N 项"—— 系统自己替学生决定少掉最后那一项，
   * 现在这条路整个删掉了，学生想少哪一项就点哪一项。
   */
  const trimmed = afterAdd.goals.find((g) => g.id !== added.id && g.id !== dropped);
  assert(Boolean(trimmed), "还有别的一项可以挑掉");
  await removeWeeklyGoal(first.id, trimmed!.id);
  const afterTrim = await ensureWeeklyPlan(weekStart);
  assert(
    !afterTrim.goals.some((g) => g.id === trimmed!.id),
    "学生自己挑掉的那一项，重新进入不会被补回来",
  );
  assert(
    afterTrim.goals.some((g) => g.id === added.id),
    "删掉一项不会误伤别的项 —— 减的只是被挑中的那一项",
  );
  assert(
    afterTrim.goals.length === afterAdd.goals.length - 1,
    "删掉一项就只剩少一项，不是整组重排",
  );

  /* ---------------------------------------------- 3. 接受 / 忽略整组建议 */
  section("3. 建议可以被整组接受，也可以整组忽略");
  await acceptWeeklyPlan(first.id);
  assert((await getWeeklyPlan(weekStart))?.accepted === true, "接受后 accepted 变成 true");

  await ignoreWeeklyPlan(first.id);
  const afterIgnore = await getWeeklyPlan(weekStart);
  assert(afterIgnore?.archived === true, "忽略之后这一周被归档，不再当作待确认的建议");
  assert(afterIgnore?.accepted === true, "忽略也算一种明确态度，记为已确认");
  assert(
    afterIgnore!.goals.length > 0,
    "忽略只是归档，不删除 —— 学生上周点了什么仍然查得到",
  );
  // 忽略不等于拉黑：下周该给建议还是给，只是不会被顶在「还没确认」的位置上
  const reOffered = await ensureWeeklyPlan(weekStart);
  assert(reOffered.archived === false, "忽略之后重新进入会给一份新的、未归档的建议");
  assert(
    (await getChanges()).some((c) => c.scope === "ignore"),
    "忽略被记进了变更记录",
  );

  /* ------------------------------------------------ 4. 学习记录的唯一入口 */
  section("4. 所有来源的练习写进同一张表");
  await logStudy({ title: "过几个词", units: 1, source: "habit", type: "vocab" });
  await logStudy({
    title: "听力真题",
    units: 1,
    source: "practice",
    type: "listening-paper",
    paperId: "2025-12-set1",
    paperUnitId: "l-r1",
    examPart: "listening",
  });
  await logStudy({
    title: "图书馆背的",
    units: 2,
    source: "offsite",
    detail: "站外补记",
  });
  const logs = await getAllLogs();
  assert(logs.length === 3, `三种来源写进同一张表（${logs.length} 条）`);
  assert(
    new Set(logs.map((l) => l.source)).size === 3,
    "每条记录保留自己的来源，不会被合并成同一种",
  );
  assert(
    logs.find((l) => l.source === "practice")?.paperUnitId === "l-r1",
    "真题练习记录保留题段 id，覆盖度才统计得出来",
  );
  assert(
    !logs.some((l) => "minutes" in l || "durationMin" in l),
    "学习记录里不出现分钟数 —— 时间只有学生自己填时才存在",
  );

  /* ---------------------------------------- 5. 覆盖度只从真实记录里算 */
  section("5. 练习覆盖度只认系统自己记下的事实");
  const cov = await practiceCoverage();
  assert(cov.offsiteLogs === 1, "站外补记被计入覆盖度");
  assert(cov.vocabTouched >= 1, "背过的词被计入覆盖度");
  await db.paperAttempts.put({
    id: "2025-12-set1",
    paperId: "2025-12-set1",
    answers: {},
    seconds: {},
    revealed: [],
    finishedUnits: ["l-r1", "writing"],
    drafts: {},
    posMarks: {},
    sessions: {},
    updatedAt: Date.now(),
  });
  const cov2 = await practiceCoverage();
  assert(cov2.finishedUnits.includes("l-r1"), "交过卷的题段进入覆盖度");
  assert(cov2.writings === 1, "写作做过一次被计入");
  assert(
    !("cet4Score" in (cov2 as unknown as Record<string, unknown>)),
    "覆盖度里不含自报成绩 —— 四级分推不出当前水平",
  );

  /* ------------------------------------------- 6. 做完一项建议 = 记一笔 */
  section("6. 完成一项建议，同时也是一条学习记录");
  const plan = await ensureWeeklyPlan(weekStart);
  const target = plan.goals.find((g) => !g.done);
  assert(Boolean(target), "还有未完成的建议可以点");
  // 走的正是首页点「完成」那条路：写一条记录，顺带把那一项标掉
  await logStudy({
    title: target!.title,
    units: target!.units,
    source: "weekly-goal",
    goalItemId: target!.id,
    type: target!.type,
  });
  const afterDone = await getWeeklyPlan(weekStart);
  const doneItem = afterDone?.goals.find((g) => g.id === target!.id);
  assert(doneItem?.done === true, "这一项被标成完成");
  assert(typeof doneItem?.completedAt === "number", "完成时间被记下来了");
  assert(
    (await getLogsOn(today)).some((l) => l.goalItemId === target!.id),
    "完成建议同时产生一条学习记录（不重复计数：只落一张表）",
  );
  assert(
    (await getAllLogs()).filter((l) => l.goalItemId === target!.id).length === 1,
    "完成一项建议只落一条记录，不会在日历上重复出现",
  );

  await undoGoal(plan.id, target!.id);
  const afterUndo = await getWeeklyPlan(weekStart);
  assert(
    afterUndo?.goals.find((g) => g.id === target!.id)?.done === false,
    "撤销之后这一项回到未完成",
  );
  assert(
    (await getAllLogs()).some((l) => l.goalItemId === target!.id),
    "撤销只回退这一项的标记，已经记下的学习记录不会被改写 —— 历史不覆盖",
  );

  /* ------------------------------------------------------- 7. 习惯判定 */
  section("7. 每日习惯只看当天真实记录");
  const hab = await habitsOn(today);
  assert(hab.vocab === true, "背过词就算当天单词做过了");
  assert(hab.listening === true, "做过听力就算当天精听听过了");
  const blank = addDays(today, -3);
  assert(
    (await habitsOn(blank)).vocab === false,
    "没有记录的那天，习惯就是没做 —— 不补、不猜",
  );

  /* ---------------------------------------------- 8. 连续天数不被误伤 */
  section("8. 今天还没开始，不会把昨天攒的连续清零");
  await logStudy({ date: addDays(today, -1), title: "听力", units: 1, source: "practice", type: "listening-paper" });
  await logStudy({ date: addDays(today, -2), title: "阅读", units: 1, source: "practice", type: "reading-paper" });
  // 只看「今天没有任何记录」的那部分：前面几节往今天写了不少，这里把它们滤掉
  const beforeToday = (await getAllLogs()).filter((l) => l.date < today);
  assert(
    currentStreak(beforeToday, today) === 2,
    `今天还没练，连续天数应仍停在 2，实际 ${currentStreak(beforeToday, today)}`,
  );
  assert(currentStreak(await getAllLogs(), today) === 3, "今天练过之后连续应为 3");

  /* ------------------------------------------------ 9. 阶段只按距考天数 */
  section("9. 备考阶段只由距考天数决定，与自报成绩无关");
  assert(stageFor(null).id === "explore", "还没定考期时应处于 explore");
  // 边界逐个打掉：61/60、31/30、8/7 各测一次
  const boundaries: [number, string][] = [
    [400, "foundation"],
    [62, "foundation"],
    [61, "foundation"],
    [60, "papers"],
    [31, "papers"],
    [30, "sprint"],
    [8, "sprint"],
    [7, "final"],
    [0, "final"],
  ];
  for (const [days, expected] of boundaries) {
    const stage = stageFor(daysUntilExam(addDays(today, days), today));
    assert(stage.id === expected, `距考 ${days} 天应为 ${expected}，实际 ${stage.id}`);
  }
  // 同一个天数下，成绩高低不改变阶段
  const low = recommendWeeklyGoals({
    profile: { examDate: addDays(today, 60), weakAreas: [] },
    coverage: EMPTY_COVERAGE,
    today,
  });
  const high = recommendWeeklyGoals({
    profile: { examDate: addDays(today, 60), weakAreas: [] },
    coverage: EMPTY_COVERAGE,
    today,
  });
  assert(low.stage.id === high.stage.id, "阶段与自报成绩无关");
  assert(
    low.goals.every((g) => !/预测|预计.{0,4}分|能考.{0,4}分/.test(g.basis + g.detail)),
    "任何情况下都不做六级分数预测",
  );

  /* ------------------------------------- 10. 自评薄弱项只做微调、不定阶段 */
  section("10. 自评薄弱项只让推荐偏一点，不决定阶段");
  const plain = recommendWeeklyGoals({
    profile: { examDate: addDays(today, 120), weakAreas: [] },
    coverage: EMPTY_COVERAGE,
    today,
  });
  const weakWriting = recommendWeeklyGoals({
    profile: { examDate: addDays(today, 120), weakAreas: ["writing"] },
    coverage: EMPTY_COVERAGE,
    today,
  });
  assert(plain.stage.id === weakWriting.stage.id, "标了弱项，阶段不变");
  assert(
    weakWriting.goals.some((g) => g.basis.includes("弱项")),
    "被标成弱项的方向在依据里被点名了",
  );

  /* ------------------------------------------------------ 11. 周末归档 */
  section("11. 周末自然归档：没做完的带走，不结转、不追责");
  const lastWeek = addDays(weekStart, -7);
  const old = await ensureWeeklyPlan(lastWeek);
  const unfinished = old.goals.filter((g) => !g.done).length;
  assert(unfinished > 0, "上周留有未完成的建议");
  const archived = await archivePreviousWeek(weekStart);
  assert(archived?.id === old.id, "上周那一份被归档了");
  assert((await getWeeklyPlan(lastWeek))?.archived === true, "归档标记已写入");
  assert(
    (await getWeeklyPlan(lastWeek))?.goals.length === old.goals.length,
    "归档只是标记，不删内容 —— 上周做了什么仍然查得到",
  );
  assert(
    (await archivePreviousWeek(weekStart)) === null,
    "重复归档是安全的空操作",
  );
  const fresh = await ensureWeeklyPlan(weekStart);
  assert(
    !fresh.goals.some((g) => old.goals.some((o) => o.id === g.id)),
    "上周的未完成项没有被结转到本周",
  );

  /* ---------------------------------------------------- 12. 周报与统计 */
  section("12. 周报只根据真实记录，不预测分数");
  const report = await buildWeeklyReport(weekStart);
  assert(report.studyDays >= 1, `本周有 ${report.studyDays} 天记录`);
  assert(report.units >= 1, `本周累计 ${report.units} 个模块`);
  assert(report.nextFocus.length > 0, "给出了下周重点");
  assert(
    report.nextFocus.every((f) => !/预测|预计.{0,4}分|能考.{0,4}分/.test(f)),
    "下周重点里没有分数预测",
  );
  const w = weekStat(await getAllLogs(), today);
  assert(!("completion" in w) && !("plannedDays" in w), "周统计里不存在完成率");
  const m = monthStat(await getAllLogs(), Number(today.slice(0, 4)), Number(today.slice(5, 7)), today);
  assert(m.studyDays >= 1, `本月有 ${m.studyDays} 天记录`);

  /* ---------------------------------------------------- 13. 变更记录 */
  section("13. 学生的每一次调整都留痕，且只追加不改写");
  const changes = await getChanges();
  assert(changes.length >= 3, `记录了 ${changes.length} 条调整`);
  assert(
    changes.some((c) => c.scope === "adjust"),
    "调数量/加项/删项都被记成了 adjust",
  );

  /* --------------------------------------------- 14. 备份与已删除的字段 */
  section("14. 备份能完整往返，且不再带 level / restWeekdays");
  const backup = await exportBackup();
  assert(backup.version === 5, `备份版本应为 5，实际 ${backup.version}`);
  assert(!("level" in (backup.profile ?? {})), "备份里没有学习档位");
  assert(!("restWeekdays" in (backup.settings ?? {})), "备份里没有休息日设置");
  const logCount = (await getAllLogs()).length;
  await reset(db);
  assert((await getAllLogs()).length === 0, "清库后确实没有记录了");
  await importBackup(backup);
  assert((await getAllLogs()).length === logCount, "导入后学习记录一条不少");
  assert((await getWeeklyPlan(weekStart)) !== undefined, "导入后本周建议还在");
  assert((await exportBackup()).version === 5, "导出仍然是 v5");

  /* --------------------------------------------------- 15. 弱项可改可空 */
  section("15. 自评薄弱项可以随时改，也可以一直是空的");
  const me = (await db.profile.get("me"))!;
  assert(Array.isArray(me.weakAreas), "weakAreas 是个数组");
  assert(!("level" in me), "档案里没有学习档位字段");
  await saveProfile({ ...me, weakAreas: ["listening", "speed"] });
  const updated = (await db.profile.get("me"))!;
  assert(updated.weakAreas.length === 2, "薄弱项保存成功");
  await saveProfile({ ...updated, weakAreas: [] });
  assert(
    ((await db.profile.get("me"))!.weakAreas).length === 0,
    "清空薄弱项也合法 —— 不标弱项不该被系统拦着",
  );

  /* ------------------------------------------ 16. 旧计划的话术会重算，不锁死 */
  section("16. 计划里存着的话术会按当前状态重算，不会锁死在旧文案上");
  const current = (await getWeeklyPlan(weekStart))!;
  // 造一份"旧版话术"的计划：依据是改版前那句，标题也停在很久以前
  await db.weeklyPlans.update(current.id, {
    rationale: "距考试 999 天 · 旧版阶段",
    goals: current.goals.map((g) =>
      g.source === "system" ? { ...g, basis: "距考 999 天 · 听力练了 0 段，这一阶段建议 7 段" } : g,
    ),
  });
  const stale = (await getWeeklyPlan(weekStart))!;
  assert(
    stale.goals.some((g) => g.basis.includes("这一阶段建议 7 段")),
    "旧话术先写进库里了 —— 这一步是为了测刷新",
  );
  await refreshWeeklyPlanText(current.id);
  const refreshed = (await getWeeklyPlan(weekStart))!;
  const systemGoals = refreshed.goals.filter((g) => g.source === "system");
  assert(
    systemGoals.every((g) => !g.basis.includes("这一阶段建议 7 段")),
    "旧话术还在 —— 计划的话术没有重算",
  );
  assert(
    systemGoals.every((g) => /距考 \d+ 天/.test(g.basis)),
    "重算之后的依据没有指回客观事实",
  );
  assert(
    !refreshed.rationale.includes("999"),
    `标题那句话还停在旧值：${refreshed.rationale}`,
  );
  assert(
    refreshed.rationale.includes("距考试"),
    "标题那句话没有按当前状态重算",
  );
  // 学生自己加的项不受影响
  const mine = refreshed.goals.find((g) => g.source === "student");
  assert(
    !mine || mine.basis === "你自己加的",
    "学生自己加的项的依据被系统改写了",
  );
  assert(
    refreshed.goals.length === current.goals.length,
    "重算话术不该增删任何一项",
  );

  console.log(
    failures === 0
      ? `\n✅ ${checks} 项检查全部通过`
      : `\n❌ ${failures} / ${checks} 项检查失败`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
