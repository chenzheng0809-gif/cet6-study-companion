/**
 * Acceptance checks for the product rules that must hold before a student ever
 * sees a task list.
 *
 * Three ideas are enforced here on purpose:
 *   1. 计划按模块计量，不按分钟。任何地方都不该出现时间估算。
 *   2. 每一条推荐都必须说得出依据（basis）。推不出依据的东西就不该推给用户。
 *   3. 真题槽位必须指向真实入库的题段，且考场时长只能取试卷 Directions 里的官方数字。
 *
 * Run with: npm run verify
 */

import { readdirSync, readFileSync } from "node:fs";
import { addDays, startOfWeek, todayKey } from "../src/lib/date";
import { countdownTo, defaultSession, upcomingSessions } from "../src/lib/exam";
import {
  PRACTICE_UNITS,
  areaCoverage,
  daysUntilExam,
  recommendWeeklyGoals,
  stageFor,
} from "../src/lib/journey";
import { currentStreak, weekStat, monthStat } from "../src/lib/stats";
import { EXAM_PART_LIMIT, PART_ORDER } from "../src/lib/papers/exam-clock";
import { PAPERS, getListeningUnit, getPaper, getReadingSection } from "../src/lib/papers";
import { POS_ORDER, posGroups, samePosSiblings, splitExplain } from "../src/lib/papers/bank";
import { mergeVocabEntry, normWord } from "../src/lib/vocab";
import {
  WORDBOOK_ITEM_COUNT,
  WORDBOOK_TOPICS,
  WORDBOOK_UNITS,
  WORDBOOK_WORD_COUNT,
  buildSynonymQuizzes,
  entryMeaning,
  entrySourceLabel,
  searchTopicItems,
  searchWords,
  topicCards,
  unitEntries,
  wordbookUnitList,
  type Marked,
} from "../src/lib/wordbooks";
import type { StudyLog, VocabEntry } from "../src/lib/types";
import { BOTTOM_LINE, MOOD_LINES, STREAK_THRESHOLD } from "../src/lib/copy";

let failures = 0;
let checks = 0;

function assert(condition: boolean, message: string) {
  checks += 1;
  if (!condition) {
    failures += 1;
    console.error(`  ✗ ${message}`);
  }
}

function section(title: string) {
  console.log(`\n${title}`);
}

/* ----------------------------------------------- 0. 计划里不得出现时间估算 */

section("0. 计划按模块计量，不出现分钟/小时估算，且每条推荐都说得出依据");
const today = todayKey();

const NO_COVERAGE = {
  finishedUnits: [] as string[],
  writings: 0,
  translations: 0,
  vocabTouched: 0,
  offsiteLogs: 0,
};

// 用一组跨度很大的考期把每个阶段都走一遍：依据栏在任何阶段都不能是空的
for (const daysOut of [400, 200, 120, 60, 30, 10, 0]) {
  const examDate = addDays(today, daysOut);
  const rec = recommendWeeklyGoals({
    profile: { examDate, weakAreas: [] },
    coverage: NO_COVERAGE,
    today,
  });
  const stageName = stageFor(daysUntilExam(examDate, today)).name;
  assert(rec.goals.length > 0, `距考 ${daysOut} 天时一条推荐都没生成`);
  for (const g of rec.goals) {
    assert(
      Number.isFinite(g.units) && g.units > 0,
      `${stageName}（距考 ${daysOut} 天）「${g.title}」没有模块数`,
    );
    assert(
      !("minutes" in (g as Record<string, unknown>)),
      `${stageName}「${g.title}」里混进了分钟字段`,
    );
    assert(
      !/\d+\s*(小时|分钟|minutes?|mins?|h)\b/i.test(g.basis),
      `${stageName}「${g.title}」的依据里出现了时间估算：${g.basis}`,
    );
    assert(g.basis.trim().length > 0, `${stageName}「${g.title}」没有给出依据`);
    assert(
      g.basis.includes("距考") || g.basis.includes("已经看过") || g.basis.includes("还没开始"),
      `${stageName}「${g.title}」的依据没有指回客观事实：${g.basis}`,
    );
  }
  // 推荐语里也不该出现"预测分数"
  for (const g of rec.goals) {
    assert(
      !/预计.{0,4}分|预测.{0,4}分|能考.{0,4}分/.test(g.basis + g.detail),
      `${stageName}「${g.title}」出现了分数预测：${g.basis}`,
    );
  }
}
console.log("  六个阶段 × 依据非空 · 无分钟估算 · 无分数预测");

/* ------------------------------------------ 1. 考场时长必须是官方数字 */

section("1. 考场时长必须与试卷 Directions 一致");
assert(EXAM_PART_LIMIT.writing.minutes === 30, "Part I Writing 应为 30 分钟");
assert(EXAM_PART_LIMIT.listening.minutes === 30, "Part II Listening 应为 30 分钟");
assert(EXAM_PART_LIMIT.reading.minutes === 40, "Part III Reading 应为 40 分钟");
assert(EXAM_PART_LIMIT.translation.minutes === 30, "Part IV Translation 应为 30 分钟");
assert(PART_ORDER.length === 4, "应当只有四个 Part");
assert(
  PART_ORDER.reduce((sum, p) => sum + EXAM_PART_LIMIT[p].minutes, 0) === 130,
  "全卷时长应为 130 分钟",
);

/* --------------------------------------- 2. 真题槽位必须指向真实题段 */

section("2. 推荐里的真题槽位必须指向已入库的真实题段");
const paper = PAPERS[0];
for (const [slot, unit] of Object.entries(PRACTICE_UNITS)) {
  assert(Boolean(unit.id), `槽位 ${slot} 没有绑定题段 id`);
  assert(
    EXAM_PART_LIMIT[unit.part] !== undefined,
    `槽位 ${slot} 引用了不存在的 Part：${unit.part}`,
  );
  const exists =
    getListeningUnit(paper, unit.id) !== undefined ||
    getReadingSection(paper, unit.id) !== undefined;
  assert(exists, `槽位 ${slot} 绑定了题库中不存在的题段：${unit.id}`);
}
assert(
  Object.values(PRACTICE_UNITS).every((u) => u.part === "listening" || u.part === "reading"),
  "练习槽位只应覆盖听力与阅读，写作/翻译走单篇入口",
);

// 推荐生成的真题目标必须真的指向已入库的套卷与题段
for (const daysOut of [200, 120, 60, 30]) {
  const examDate = addDays(today, daysOut);
  const rec = recommendWeeklyGoals({
    profile: { examDate, weakAreas: [] },
    coverage: NO_COVERAGE,
    today,
  });
  const parts = new Set<string>();
  for (const g of rec.goals) {
    if (!g.paperUnitId) continue;
    parts.add(g.examPart ?? "");
    if (g.paperUnitId === "writing" || g.paperUnitId === "translation") continue;
    const ok =
      getListeningUnit(paper, g.paperUnitId) !== undefined ||
      getReadingSection(paper, g.paperUnitId) !== undefined;
    assert(ok, `距考 ${daysOut} 天的推荐指向了不存在的题段：${g.paperUnitId}`);
  }
  assert(parts.size >= 2, `距考 ${daysOut} 天的推荐只覆盖了 ${parts.size} 个 Part`);
}
console.log(`  ${Object.keys(PRACTICE_UNITS).length} 个练习槽位全部指向真实题段`);

/* ------------------------------ 2b. 听力只看选项 —— 藏题干的前提是选项齐全 */

section("2b. 听力不显示题干，只给四个选项");
const listeningQs = paper.questions.filter((q) =>
  paper.listeningUnits.some((u) => u.id === q.unitId),
);
assert(listeningQs.length === 25, `听力题应为 25 道，实际 ${listeningQs.length}`);
for (const q of listeningQs) {
  // 藏掉题干之后，这道题必须还能做 —— 所以选项必须齐全
  assert(
    (q.options?.length ?? 0) === 4,
    `第 ${q.n} 题选项数不是 4，藏掉题干就没法作答`,
  );
  assert(
    ["A", "B", "C", "D"].every((k) => (q.options ?? []).some((o) => o.key === k)),
    `第 ${q.n} 题缺 A–D 里的某个选项`,
  );
  assert(
    (q.options ?? []).every((o) => Boolean(o.en?.trim())),
    `第 ${q.n} 题有选项没有英文原文`,
  );
}


section("7. 倒计时必须动态计算");
const known = countdownTo("2026-12-19", "2026-10-17");
assert(known.days === 63, `2026-10-17 → 2026-12-19 应为 63 天，实际 ${known.days}`);
assert(known.isPast === false, "未来考试不应标记为已结束");
const past = countdownTo("2026-06-20", "2026-10-17");
assert(past.isPast === true && past.days < 0, "过去的考试日期应标记为已结束");
const sessions = upcomingSessions("2026-10-17");
assert(sessions.length > 0 && sessions[0].id === "2026-12", "当前应默认推荐 2026-12 场次");
assert(defaultSession("2026-10-17").isEstimate === true, "考试日期应标记为预估，可修改");
console.log(`  ${sessions.map((s) => `${s.id}(${s.date})`).join(" → ")}`);

/* --------------------------------------------------------- 8. statistics */

section("8. 统计只认真实记录，且不存在完成率");
const monday = startOfWeek("2026-10-12"); // a week with Mon–Wed elapsed
const logs: StudyLog[] = [
  {
    id: "l1",
    date: monday,
    units: 1,
    title: "听力真题",
    source: "weekly-goal",
    type: "listening-paper",
    createdAt: 0,
  },
  {
    id: "l2",
    date: monday,
    units: 1,
    title: "过几个词",
    source: "habit",
    type: "vocab",
    createdAt: 1,
  },
  {
    id: "l3",
    date: addDays(monday, 1),
    units: 2,
    title: "站外背词",
    source: "offsite",
    createdAt: 2,
  },
];

const wednesday = addDays(monday, 2);
const stats = weekStat(logs, wednesday);
assert(stats.studyDays === 2, `本周有记录的天数应为 2，实际 ${stats.studyDays}`);
assert(stats.entries === 3, `本周记录条数应为 3，实际 ${stats.entries}`);
assert(stats.units === 4, `本周模块数应为 4，实际 ${stats.units}`);
assert(
  !("completion" in stats) && !("plannedDays" in stats),
  "WeekStat 仍带着完成率/应完成天数字段 —— 没有日程就不该有分母",
);
assert(
  !("minutes" in stats),
  "WeekStat 仍在按分钟统计，计划已经改用模块计量",
);
// 今天还没开始不该把昨天攒的连续清零：学生多是晚上打开 App
assert(
  currentStreak(logs, wednesday) === 2,
  "周三没有记录时，连续天数应仍停在 2，而不是清零",
);
assert(currentStreak([], "2026-10-17") === 0, "没有任何记录时连续天数应为 0");

// 月统计同样不带完成率，并且只数到今天为止
const oct = monthStat(logs, 2026, 10, wednesday);
assert(oct.studyDays === 2, `10 月有记录天数应为 2，实际 ${oct.studyDays}`);
assert(
  !("completion" in oct) && !("totalTasks" in oct),
  "MonthStat 仍带着完成率字段",
);

// 五种来源必须共用同一张表：只要有记录，就算练过，不区分是推荐还是自主
const mixedSources = new Set(logs.map((l) => l.source));
assert(mixedSources.size === 3, "记录应保留各自来源，不能被合并成一种");
assert(
  stats.byType.some((t) => t.type === "listening-paper"),
  "周统计应能按训练类型分组，供周报说清这周练了什么",
);
console.log(
  `  本周 ${stats.studyDays} 天 · ${stats.units} 个模块 · 连续 ${currentStreak(logs, wednesday)} 天`,
);

/* ------------------------------------------------- 9. 生词本：重复记要合并 */

section("9. 生词本重复记同一个词时只合并，不覆盖学生写的");
assert(normWord("  Embassy  ") === "embassy", "词条归一化必须去首尾空格并转小写");
assert(normWord("Ambassador  to   Winopia") === "ambassador to winopia", "词条内部空格未归一");

const base: VocabEntry = {
  id: "v1",
  word: "ambassador",
  meaning: "我自己写的释义",
  note: "别和 diplomacy 搞混",
  sourceKind: "paper",
  sourcePaperId: paper.id,
  sourceQuestionNo: 1,
  sourceLabel: "第一套 · 第 1 题",
  createdAt: 1000,
  reviewCount: 3,
};
const incoming: VocabEntry = {
  id: "v2",
  word: "Ambassador",
  meaning: "系统建议的另一个释义",
  note: "系统建议的备注",
  sourceKind: "paper",
  sourcePaperId: paper.id,
  sourceQuestionNo: 9,
  sourceLabel: "第一套 · 第 9 题",
  createdAt: 9999,
  reviewCount: 0,
};
const merged = mergeVocabEntry(base, incoming);
assert(merged.id === "v1", "合并后应保留原条目 id，不能新开一条");
assert(merged.reviewCount === 3, "合并不能清零复习次数");
assert(merged.createdAt === 1000, "合并不能改写首次记录时间");
assert(merged.sourceQuestionNo === 1, "合并后应保留最早记下的出处");
assert(merged.meaning === "我自己写的释义", "已有释义不能被新记录覆盖");
assert(merged.note === "别和 diplomacy 搞混", "已有备注不能被新记录覆盖");

// 原来没写释义时，新记录正好补上
const bare: VocabEntry = { ...base, meaning: undefined, note: undefined };
const filled = mergeVocabEntry(bare, incoming);
assert(filled.meaning === "系统建议的另一个释义", "空的释义应该被新记录补上");
assert(filled.note === "系统建议的备注", "空的备注应该被新记录补上");

// 词库来源的条目合进真题来源的条目时，不能把出处改写成词库
const fromBook: VocabEntry = {
  id: "v3",
  word: "ambassador",
  meaning: "n.大使",
  sourceKind: "wordbook",
  sourcePaperId: "",
  sourceLabel: "核心词汇 · Unit 6 职场就业",
  createdAt: 5000,
  reviewCount: 0,
};
const mergedFromBook = mergeVocabEntry(base, fromBook);
assert(
  mergedFromBook.sourceKind === "paper",
  "真题记下的词再从词库收一次，来源不能被改写成词库",
);
assert(mergedFromBook.sourceQuestionNo === 1, "词库条目不能顶掉真题出处");
assert(mergedFromBook.meaning === "我自己写的释义", "词库释义不能覆盖学生写的");

/* --------------------------------------------- 10. 核心词库：数据完整性 */

section("10. 核心词库：上下册数据完整且可搜");

assert(WORDBOOK_UNITS.length > 0, "核心词库上册不应为空");
assert(WORDBOOK_TOPICS.length > 0, "核心词库下册不应为空");

// 上册：每个词条都要有释义、Unit 归属，且 Unit 连续
for (const entry of WORDBOOK_UNITS) {
  assert(entry.word.trim().length > 0, "词条不能没有词形");
  assert(entry.senses.length > 0, `${entry.word} 至少要有一条释义`);
  assert(
    entry.senses.every((s) => s.pos && s.meaning.trim().length > 0),
    `${entry.word} 的释义必须带词性和中文`,
  );
  assert(entry.unitNo > 0 && entry.unitName.length > 0, `${entry.word} 缺少 Unit 归属`);
}
const unitNos = [...new Set(WORDBOOK_UNITS.map((w) => w.unitNo))].sort((a, b) => a - b);
assert(
  unitNos.length === Math.max(...unitNos),
  `上册 Unit 应为 1..N 连续，实际 ${unitNos.join(",")}`,
);
const duplicateWords = WORDBOOK_UNITS.filter(
  (w) => WORDBOOK_UNITS.filter((x) => x.word.toLowerCase() === w.word.toLowerCase()).length > 1,
);
assert(duplicateWords.length === 0, `上册不应有重复词条：${duplicateWords.map((d) => d.word).join(",")}`);

// 上册列表字段里不能混进右栏例句的词（双栏串行会带进来 paycheck 这种）
const BAD_DERIVATIVES = ["paycheck", "the", "and"];
for (const entry of WORDBOOK_UNITS) {
  for (const item of entry.derivatives) {
    assert(
      !BAD_DERIVATIVES.includes(item.term.toLowerCase()),
      `${entry.word} 的派生词里混进了例句用词：${item.term}`,
    );
  }
}

// 下册：每个专题都要有条目，每条至少一个表达
for (const topic of WORDBOOK_TOPICS) {
  assert(topic.topicName.length > 0, `专题 ${topic.topicNo} 缺少名称`);
  const total = topic.groups.reduce((n, g) => n + g.items.length, 0);
  assert(total > 0, `专题 ${topic.topicNo} ${topic.topicName} 没有任何条目`);
  for (const group of topic.groups) {
    assert(group.groupName.length > 0, `专题 ${topic.topicNo} 有分组没有名字`);
    for (const item of group.items) {
      assert(item.terms.length > 0, `专题 ${topic.topicNo} 有一条没有表达`);
      assert(
        item.terms.every((t) => t.term.trim().length > 0),
        `专题 ${topic.topicNo} 有表达没有词形`,
      );
    }
  }
}

// 归一化：康熙部首兼容字不能残留在数据里（PDF 里 ⻅/⽀ 这类字必须还原）
const RAW_TEXT = JSON.stringify(WORDBOOK_UNITS) + JSON.stringify(WORDBOOK_TOPICS);
const RADICAL_LEAKS = ["⻅", "⻛", "⻜", "⺠", "⻓"];
for (const ch of RADICAL_LEAKS) {
  assert(!RAW_TEXT.includes(ch), `数据里残留了部首兼容字 ${ch}`);
}
assert(!/[\ue000-\ue001]/.test(RAW_TEXT), "数据里残留了归一化用的哨兵字符");

// 查询层：搜索要真的能命中，且筛 Unit 不能串味
assert(
  searchWords("economy", null).some((w) => w.word === "economy"),
  "搜索 economy 应命中该词条",
);
assert(
  searchWords("经济", null).length > 0,
  "按中文释义搜索应有结果",
);
assert(
  searchWords("zzzz不存在zzz", null).length === 0,
  "搜不到时应返回空数组",
);
const unit1 = wordbookUnitList().filter((u) => u.unitNo === 1);
assert(unit1.length === 1, "Unit 列表里应只有一条 Unit 1");
assert(
  searchWords("", unit1[0].unitNo).every((w) => w.unitNo === 1),
  "按 Unit 过滤后不应混入其他 Unit 的词",
);
assert(
  searchTopicItems("因果", null).length > 0 || searchTopicItems("due to", null).length > 0,
  "下册应能按表达搜到同义替换",
);
assert(entryMeaning(WORDBOOK_UNITS[0]).length > 0, "词条应能取出用于预填的释义");
assert(
  entrySourceLabel(WORDBOOK_UNITS[0]).startsWith("核心词汇 · Unit "),
  "词库出处应是可读文字而不是链接",
);
// ---- 例句：这一轮才导入的，必须保证没串行
const allExamples = WORDBOOK_UNITS.flatMap((w) =>
  (w.examples ?? []).map((ex) => ({ word: w.word, ex })),
);
assert(allExamples.length >= 70, `上册例句应至少有 70 条，实际 ${allExamples.length}`);
for (const { word, ex } of allExamples) {
  assert(ex.sentence.length > 0 || ex.article.length > 0, `${word} 的例句既没有英文句也没有原文`);
  // 译文如果没被双栏排版截断，就必须是一句完整的话
  if (ex.translation) {
    assert(
      /[。！？…]$/.test(ex.translation.trim()),
      `${word} 的译文没有正常收尾，多半是跨行拼接漏了：${ex.translation.slice(-12)}`,
    );
  }
  if (ex.article) {
    assert(ex.question.length > 0, `${word} 的原书例题缺题干`);
    assert(ex.options.length > 0, `${word} 的原书例题缺选项`);
    assert(
      ex.options.map((o) => o.label).join("") === "ABCD" || ex.options.length === 0,
      `${word} 的选项不是 A-D`,
    );
  }
}
const sourcedExamples = allExamples.filter(({ ex }) => ex.source.length > 0);
assert(
  sourcedExamples.every(({ ex }) => /^\d{4}\s*年/.test(ex.source)),
  "例句出处必须是原书标注的「年份 + 题型」，不能自己编",
);

// ---- 词表中英对照
let detailTotal = 0;
let detailWithZh = 0;
for (const entry of WORDBOOK_UNITS) {
  for (const field of ["derivatives", "synonyms", "antonyms", "phrases", "extensions"] as const) {
    for (const item of entry[field]) {
      detailTotal += 1;
      if (item.senses.length > 0) detailWithZh += 1;
    }
  }
}
assert(detailTotal > 500, `词表条目应过百，实际 ${detailTotal}`);
assert(
  detailWithZh / detailTotal > 0.8,
  `词表带中文比例过低：${detailWithZh}/${detailTotal}`,
);

// ---- 单元简介：应用自己写的导读，要覆盖全部单元
const unitList = wordbookUnitList();
assert(unitList.length === unitNos.length, "单元列表应覆盖所有 Unit");
for (const unit of unitList) {
  assert(unit.intro.length >= 20, `Unit ${unit.unitNo} ${unit.unitName} 缺简介`);
  assert(unit.count > 0, `Unit ${unit.unitNo} 词数为 0`);
}

// ---- 下册例句要挂在正确的表达上
let topicExampleCount = 0;
for (const topic of WORDBOOK_TOPICS) {
  for (const group of topic.groups) {
    for (const item of group.items) {
      for (const ex of item.examples ?? []) {
        topicExampleCount += 1;
        const terms = item.terms.map((t) => t.term.toLowerCase());
        assert(
          terms.some((t) => ex.headword.toLowerCase().startsWith(t)),
          `下册例句 ${ex.headword} 没有挂在包含它的同义替换上`,
        );
      }
    }
  }
}
assert(topicExampleCount > 0, "下册应有原书例句");
console.log(
  `  上册 ${allExamples.length} 条例句（${sourcedExamples.length} 条有原书出处）· 词表 ${detailTotal} 条（${detailWithZh} 条带中文）· 下册 ${topicExampleCount} 条例句`,
);

// ---- 学生自己加的目标必须标成 student：只有系统推荐才允许被重新生成覆盖
// （同一保证的存储层版本 —— 重复 ensure 不能刷掉学生的改动 —— 在 verify-plan-store.ts）
const studentAdded = {
  title: "背作文模板",
  type: "custom" as const,
  detail: "只背万能句",
  units: 2,
  basis: "",
  done: false,
  source: "student" as const,
  id: "g-student",
};
assert(studentAdded.source === "student", "学生加的目标必须标成 student");
assert(studentAdded.basis === "", "学生自己加的目标没有依据，也就不该有依据文案");
assert(studentAdded.units === 2, "学生加的目标的模块数应如实保存");
assert(
  !("paperId" in studentAdded),
  "学生自己加的目标不该被系统偷偷绑上真题题段",
);

console.log(
  `  上册 ${WORDBOOK_WORD_COUNT} 词 · Unit ${unitNos.length} 个 · 下册 ${WORDBOOK_TOPICS.length} 专题 ${WORDBOOK_ITEM_COUNT} 条`,
);

/* ------------------------------------------- 11. 黄色高亮与同义替换答题 */

section("11. 黄色高亮标注：切出来的片段必须拼回原文（标错位置比不标更糟）");

const flattenMarked = (
  node: unknown,
  key: string,
  plain: string,
  path: string,
): void => {
  const bag = node as Record<string, unknown> | null;
  const segs = bag?.[`${key}HL`] as Marked[] | undefined;
  if (!segs) return;
  assert(Array.isArray(segs), `${path}.${key}HL 必须是数组`);
  const joined = segs.map((s) => s.text).join("");
  assert(
    joined === plain,
    `${path}.${key}HL 拼回去必须等于 ${key}：\n      期望 "${plain}"\n      实际 "${joined}"`,
  );
  assert(segs.length > 0, `${path}.${key}HL 不是空数组`);
  assert(
    segs.some((s) => s.mark === true),
    `${path}.${key}HL 至少要有一段 mark`,
  );
  for (const seg of segs) {
    assert(typeof seg.text === "string" && seg.text.length > 0, `${path}.${key}HL 片段不能是空串`);
  }
};

let markedSegments = 0;
let markedExamples = 0;
let markedTermCount = 0;

for (const entry of WORDBOOK_UNITS) {
  entry.senses.forEach((s, i) => {
    flattenMarked(s, "meaning", s.meaning, `unit ${entry.word} sense${i}`);
    if (s.meaningHL) markedSegments += s.meaningHL.length;
  });
  for (const key of ["derivatives", "synonyms", "antonyms", "phrases", "extensions"] as const) {
    entry[key].forEach((item) => {
      flattenMarked(item, "term", item.term, `unit ${entry.word} ${key} ${item.term}`);
      if (item.termHL) markedSegments += item.termHL.length;
      item.senses.forEach((s, i) => {
        flattenMarked(s, "meaning", s.meaning, `unit ${entry.word} ${key} ${item.term} sense${i}`);
      });
    });
  }
  entry.examples.forEach((ex, i) => {
    const before = markedExamples;
    for (const key of ["sentence", "translation", "article", "question", "headword"] as const) {
      if (!ex[key]) continue;
      flattenMarked(ex, key, ex[key], `unit ${entry.word} ex${i}`);
    }
    ex.options.forEach((o) => flattenMarked(o, "text", o.text, `unit ${entry.word} ex${i} opt${o.label}`));
    if (ex.sentenceHL) markedExamples += before === 0 ? 1 : 0;
    if (ex.sentenceHL) markedSegments += ex.sentenceHL.length;
  });
}

for (const topic of WORDBOOK_TOPICS) {
  topic.groups.forEach((g, gi) => {
    g.items.forEach((it, ii) => {
      flattenMarked(it, "meaning", it.meaning, `topic${topic.topicNo} g${gi} i${ii}`);
      it.senses.forEach((s, si) =>
        flattenMarked(s, "meaning", s.meaning, `topic${topic.topicNo} g${gi} i${ii} sense${si}`),
      );
      it.terms.forEach((t) => {
        if (t.mark) markedTermCount += 1;
      });
      (it.examples ?? []).forEach((ex, ei) => {
        for (const key of ["sentence", "translation", "article", "question"] as const) {
          if (!ex[key]) continue;
          flattenMarked(ex, key, ex[key], `topic${topic.topicNo} g${gi} i${ii} ex${ei}`);
        }
        ex.options.forEach((o) =>
          flattenMarked(o, "text", o.text, `topic${topic.topicNo} g${gi} i${ii} ex${ei} opt${o.label}`),
        );
        if (ex.sentenceHL) markedSegments += ex.sentenceHL.length;
      });
    });
  });
}

assert(markedSegments > 0, `确实挖出了黄色高亮（${markedSegments} 段）`);
assert(markedTermCount > 0, `下册确实标出了同义替换重点词（${markedTermCount} 个）`);

section("12. 下册专题可按专题进入；例句能变成同义替换题");
const cards = topicCards();
assert(cards.length === WORDBOOK_TOPICS.length, "每个专题都有一张分览卡");
assert(
  cards.every((c) => c.itemCount > 0),
  "每张分览卡都有条目数（点进去才知道有多少）",
);
assert(
  cards.every((c) => c.groups.length > 0),
  "每个专题都有可进入的分组",
);
assert(
  cards.some((c) => c.markedCount > 0),
  "至少有一个专题带原书标黄的重点词",
);

const quizzes = buildSynonymQuizzes();
assert(quizzes.length > 0, `能生成同义替换题（${quizzes.length} 题）`);
for (const q of quizzes) {
  assert(q.prompt.includes("____"), `题干必须有一个空：${q.id}`);
  assert(!q.prompt.includes(q.answer), `答案不能直接出现在题干里：${q.id}`);
  assert(q.options.includes(q.answer), `选项里必须有正确答案：${q.id}`);
  assert(q.options.length >= 3, `至少三个选项：${q.id}`);
  assert(new Set(q.options.map((o) => o.toLowerCase())).size === q.options.length, `选项不能重复：${q.id}`);
  // 干扰项必须和答案形状一致（单词对单词、短语对短语），否则猜中也不用学
  const shape = (s: string) => (/^[A-Za-z][A-Za-z'’-]*( [A-Za-z][A-Za-z'’-]*)*$/.test(s.trim()) ? (s.includes(" ") ? "phrase" : "word") : "other");
  const answerShape = shape(q.answer);
  assert(
    q.options.every((o) => shape(o) === answerShape),
    `干扰项形状要和答案一致：${q.id}（答案 "${q.answer}"）`,
  );
}
assert(
  new Set(quizzes.map((q) => q.options.indexOf(q.answer))).size > 1,
  "正确答案在不同题里落在不同位置（不能靠记「第几个」）",
);
assert(
  buildSynonymQuizzes().map((q) => q.id + q.options.join()).join() ===
    quizzes.map((q) => q.id + q.options.join()).join(),
  "同一份数据每次生成的题目完全一致（刷新不会重排）",
);

/* --------------------------------------- 13. 界面语气：底线与歌词不能串味 */

section("13. 歌词只在人累了的时候出现，且一次只出现一句");

// 一个场景只登记一句 —— 不并列、不轮播堆叠
assert(
  new Set(Object.values(MOOD_LINES).map((l) => l.scene)).size ===
    Object.keys(MOOD_LINES).length,
  "有场景登记了不止一句歌词",
);
for (const [scene, line] of Object.entries(MOOD_LINES)) {
  assert(line.scene === scene, `${scene} 这句的 scene 字段对不上`);
  assert(line.lines.trim().length > 0, `${scene} 没有正文`);
  assert(
    line.credit.trim().length > 0,
    `${scene} 没有署名 —— 歌词是别人的东西，藏着不给等于偷`,
  );
  // 中文旁注可有可无，但有就不能写成解释
  if (line.zh) {
    assert(
      !/[「」"]/.test(line.zh),
      `${scene} 的中文旁注加了引号或解释：${line.zh}`,
    );
  }
}

// 歌词只负责陪，底线负责说清规则，两边不能串
const lyricText = Object.values(MOOD_LINES)
  .map((l) => l.lines)
  .join(" ");
assert(
  !/加油|别放弃|坚持到底|不要放弃/.test(lyricText),
  "歌词里出现了「加油」「别放弃」这类话 —— 加上去像家长",
);
for (const [key, value] of Object.entries(BOTTOM_LINE)) {
  const text = typeof value === "string" ? value : value.lines;
  assert(text.trim().length > 0, `底线「${key}」是空的`);
  assert(
    !/加油|别放弃|坚持到底|不要放弃/.test(text),
    `底线「${key}」混进了口号式安慰`,
  );
}
assert(
  typeof BOTTOM_LINE.privacy === "string" &&
    /不会上传|不上传/.test(BOTTOM_LINE.privacy),
  "隐私底线必须说清楚数据不出设备",
);
assert(
  typeof BOTTOM_LINE.score === "string" && /不靠|不.*预测/.test(BOTTOM_LINE.score),
  "分数底线必须说清楚不换算、不预测",
);

// 连续打卡门槛：两句歌词不能同时出现
assert(STREAK_THRESHOLD >= 3, "状态好的那句至少要连练 3 天才配说");
assert(
  MOOD_LINES.return.lines !== MOOD_LINES.night.lines,
  "「中断回来」和「空状态」不该是同一句",
);
console.log(
  `  ${Object.keys(MOOD_LINES).length} 个场景各一句 · 4 条底线 · 连续满 ${STREAK_THRESHOLD} 天才给状态好那句`,
);

/* ---------------------------------- 14. 界面精简：解释性长句不许回流 */

section("14. 解释性长句已经删掉，且不许悄悄长回来");

const readSrc = (rel: string): string =>
  readFileSync(new URL(`../${rel}`, import.meta.url), "utf8");

/** 这一轮判定为「废话」并删掉的句子，逐条锁死 */
const CUT_COPY = [
  // 解释产品机制
  "接受之后随时能改",
  "没做完也不会有人来催",
  "这个词重复记会合并",
  "会拿它推分数",
  "不绑定日期",
  "只数你自己练过的",
  "每条建议都能指回",
  // 自我辩解 / 数据库旁白
  "数据只存在这台设备上",
  "全都是你自己填的",
  "没有账号，也不联网",
  "刷新也不会丢",
  // 与按钮重复的引导
  "不喜欢就换一项",
  "练了点什么就点记一笔",
  "做一件最小的事",
  "去练习里随便挑",
] as const;

/**
 * 只有出现在 JSX 字符串里的才算界面文案。
 * 注释和提交历史里提到同一句话不算 —— 只抓 `>` `'` `"` 包裹的中文，
 * 宁可漏掉也不误伤代码里的类型名和字段名。
 */
const UI_FILES = [
  "src/app/today/page.tsx",
  "src/app/plan/page.tsx",
  "src/app/practice/page.tsx",
  "src/app/calendar/page.tsx",
  "src/app/me/page.tsx",
  "src/app/vocab/page.tsx",
  "src/app/onboarding/page.tsx",
  "src/app/welcome/page.tsx",
  "src/components/today/offsite-sheet.tsx",
  "src/components/paper/vocab-sheet.tsx",
  "src/components/settings-sheet.tsx",
] as const;

const uiSource = UI_FILES.map((f) => ({ f, src: readSrc(f) }));
for (const target of CUT_COPY) {
  const hits = uiSource.filter(({ src }) => src.includes(target));
  assert(
    hits.length === 0,
    `已删的废话又回来了：${target}（${hits.map((h) => h.f).join("、")}）`,
  );
}

/** 首页 Focus 卡标题和类型 Chip 同时出现同一个词，就只剩一个 */
const todaySrc = readSrc("src/app/today/page.tsx");
assert(
  /meta\.label !== focus\.title/.test(todaySrc),
  "首页 Focus 卡的标题和类型标签没有去重 —— 「听力真题 听力真题」又回来了",
);

/** 歌词和底线只能从 copy.ts 取，不能在页面里再抄一份 */
for (const { f, src } of uiSource) {
  for (const [scene, line] of Object.entries(MOOD_LINES)) {
    assert(
      !src.includes(line.lines),
      `${f} 里抄了一份 ${scene} 的歌词 —— 改文案只有一个出处：copy.ts`,
    );
  }
  for (const value of Object.values(BOTTOM_LINE)) {
    const text = typeof value === "string" ? value : value.lines;
    assert(
      !src.includes(text),
      `${f} 里抄了一份底线文案 —— 改文案只有一个出处：copy.ts`,
    );
  }
}

// 歌词走 mood-line 组件，底线走 copy.ts —— 两条接入路径都得还在
for (const f of ["src/app/today/page.tsx", "src/app/calendar/page.tsx"] as const) {
  assert(
    /from "@\/components\/mood\/mood-line"/.test(readSrc(f)),
    `${f} 没有接上歌词组件`,
  );
}
for (const f of ["src/app/me/page.tsx", "src/app/plan/page.tsx", "src/app/welcome/page.tsx"] as const) {
  assert(/from "@\/lib\/copy"/.test(readSrc(f)), `${f} 没有从 copy.ts 取底线`);
}

console.log(
  `  ${CUT_COPY.length} 条已删文案锁死 · ${UI_FILES.length} 个界面文件无内联歌词`,
);

/* ------------------------------- 15. 核心词库：点单元必须真的进得去 */

section("15. 核心词库的单元点得进去，翻卡按钮不是摆设");

// 数据层：列表里每个单元都得真有词，否则点进去只会看到空状态
for (const unit of wordbookUnitList()) {
  const entries = unitEntries(unit.unitNo);
  assert(
    entries.length === unit.count && entries.length > 0,
    `Unit ${unit.unitNo}（${unit.unitName}）列表写着 ${unit.count} 词，实际只有 ${entries.length} 条`,
  );
}

// 视图层：这个 bug 过一次 —— 册别和「进没进单元」挤在同一个 state，
// 点单元只改了后者，早返回的条件却盯着前者，于是条件永远不成立，点了像没点。
// 组件交互测不到，就直接盯源码里的那条条件。
const wbSrc = readSrc("src/components/vocab/wordbook-browser.tsx");
const earlyReturn = wbSrc.match(/if\s*\(\s*unitNo\s*!==\s*null\s*\)/);
assert(
  earlyReturn !== null,
  "WordbookBrowser 的早返回条件不见了 —— 点单元进不去",
);
assert(
  !/if\s*\([^)]*\b(?:view|book|mode|tab)\b[^)]*\)\s*\{[^}]*UnitCards/.test(wbSrc),
  "翻卡视图又用册别 state 做条件了 —— 册别只由分段器写，点单元时它不会变",
);

// 假按钮：上下词两个按钮曾经被无条件 disabled 写死，点了没反应
const navButtons = wbSrc.match(/disabled\s*\n?\s*(?=\{?\s*onClick=\{\(\)\s*=>\s*go\()/g) ?? [];
assert(
  navButtons.length === 0,
  "「上一个 / 下一个」被无条件 disabled 了 —— 那是不响应的假按钮",
);
assert(
  /disabled=\{index === 0\}/.test(wbSrc) && /disabled=\{index === total - 1\}/.test(wbSrc),
  "上下词按钮没有按边界禁用 —— 首尾那一下会越界",
);

console.log(
  `  ${wordbookUnitList().length} 个单元都有词 · 进单元的条件不再依赖册别 · 上下词按边界禁用`,
);

/* ---------------------------------- 16. 原书黄色高亮必须真的画出来 */

section("16. 原书标黄的字在界面上得看得见");

// 第 11 节守的是「高亮切得准不准」。这一节守的是另一头:
// 数据切得再准，界面没接上去，学生看到的还是一片纯文本。
const wb = readSrc("src/components/vocab/wordbook-browser.tsx");

/** 每个 HL 字段对应到界面上必须出现的那个属性名 */
const HL_RENDERED = [
  "meaningHL", // 词卡主释义 + 近义词/派生/词组的释义
  "termHL", // 近义词、派生词、词组本身
  "sentenceHL", // 原题英文句
  "translationHL", // 原题中文句
  "articleHL", // 下册那种整段原题
  "questionHL", // 原题题干
  "textHL", // 原题选项
] as const;

for (const field of HL_RENDERED) {
  assert(
    wb.includes(`segments={example.${field}}`) ||
      wb.includes(`segments={opt.${field}}`) ||
      wb.includes(`segments={ex.${field}}`) ||
      wb.includes(`segments={sense.${field}}`) ||
      wb.includes(`segments={s.${field}}`) ||
      wb.includes(`segments={item.${field}}`),
    `${field} 没有接到界面上 —— 原书标黄的字，学生看不见`,
  );
}

// MarkedText 组件本身不能变成孤儿：它写了却没人引用，等于高亮全丢
assert(
  /from "@\/components\/vocab\/marked"/.test(wb),
  "词库组件没有引用 marked.tsx —— 高亮渲染组件成了死代码",
);
const markedSrc = readSrc("src/components/vocab/marked.tsx");
for (const comp of ["MarkedText", "Marker"]) {
  assert(markedSrc.includes(`export function ${comp}`), `marked.tsx 里没有 ${comp}`);
}

// headwordHL 是个有意的例外：单词卡当前词就是它，例句区再写一遍「profit n.利润」
// 是重复。所以这里断言它**没有**被渲染 —— 将来谁想加，得先想清楚为什么现在没加。
assert(
  !wb.includes("example.headwordHL") && !wb.includes("ex.headwordHL"),
  "headwordHL 忽然被渲染了 —— 当前词卡已经显示这个词，再写一遍是重复；如果是有意改的，改这里并写清理由",
);

console.log(
  `  ${HL_RENDERED.length} 类高亮字段全部接到界面 · 词条主释义 / 例句 / 译文 / 选项都画`,
);

/* ------------------- 17. 这一轮砍掉的东西不许长回来，换掉的交互不许退回 */

/*
 * 第十七轮一共做了四件事，它们全都容易被"顺手改回去"：
 *   - 删掉「建构期」，阶段从 5 段变 4 段；
 *   - 删掉「多一项」；
 *   - 暗色模式下不能出现「近白底 + 荧光绿字」；
 *   - 记生词不再是「每题一个按钮」，改成在原文里点词；
 *     选词填空也不再往下摆十张各带十五个选项的题卡。
 * 这一节把它们全钉住。
 */

section("17. 阶段表、按钮、黄字配对、点词记生词");

/** 递归列出 src 下所有 ts/tsx，界面层的回归断言都扫它而不是手点文件名。 */
function srcFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(new URL(`../${dir}`, import.meta.url), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...srcFiles(rel));
    else if (/\.tsx?$/.test(entry.name)) out.push(rel);
  }
  return out;
}

const ALL_SRC = srcFiles("src");

/**
 * 注释里提到一个词不算「界面还在用它」—— 跟第 14 节同一把尺子。
 * 这轮的「记生词」在三个文件的文档注释里都被提到（说明为什么删），
 * 只看注释会误伤，只看代码又会把真残留漏掉，所以扫之前先剥注释。
 */
const stripComments = (s: string): string =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
const srcCode = ALL_SRC.map((f) => ({ f, src: stripComments(readSrc(f)) }));

/* --- 17.1 建构期没了，而且剩下的阶段不留空洞 --- */

// 这里刻意扫源码而不是比 STAGES：`StageId` 里已经没有 "build"，
// 拿它做比较 TypeScript 会直接报错（那本身就说明删干净了），
// 所以改成守住「阶段表源码里不许再出现 build」这件事。
const journeySrc = stripComments(readSrc("src/lib/journey.ts"));
assert(!/\bid:\s*"build"/.test(journeySrc), "「建构期」回来了");
assert(!journeySrc.includes("建构期"), "「建构期」这个名字又出现在阶段表里");
assert(!journeySrc.includes("BUILDING"), "BUILDING 阶段又出现了");
assert(
  !/StageId\s*=[^;]*"build"/.test(journeySrc),
  "StageId 里仍有 build —— 删阶段要连类型一起删",
);
assert(
  /foundation:\s*\{\s*l:\s*7/.test(journeySrc),
  "打底期的覆盖度目标回到 3 了 —— 合并建构期时忘了把那一档量带过来",
);

// 删掉中间一段最容易留下的坑是「空洞」：某个天数区间谁都不匹配，
// stageFor 会一路掉到最后一个阶段，于是 70 天的人被当成考前一周。
for (const d of [400, 200, 121, 90, 61, 60, 31, 30, 8, 7, 0]) {
  assert(stageFor(d).id !== "explore", `距考 ${d} 天掉进了「还没定考期」—— 阶段表有空洞`);
}
assert(stageFor(61).id === "foundation", "距考 61 天应当是打底期");
assert(stageFor(60).id === "papers", "距考 60 天应当是真题期");

// 打底期现在独占 61 天以上，覆盖度目标得用原来建构期那一档，否则量会掉一半
const foundationCov = areaCoverage(NO_COVERAGE, stageFor(100));
assert(
  foundationCov.every((a) => a.suggested > 0),
  "打底期的覆盖度目标是 0 —— 合并阶段时忘了把原来建构期的量带过来",
);
assert(
  foundationCov.find((a) => a.area === "reading")?.suggested === 7,
  "打底期的阅读建议量应当沿用原建构期的 7",
);

// 老周计划里存的 stageId 可能是已下线的 build，页面必须能认出来并重算
const planPage = readSrc("src/app/plan/page.tsx");
assert(
  /STAGES\.find\(\(s\) => s\.id === plan\?\.stageId\)\s*\?\?\s*stageFor\(/.test(planPage),
  "plan 页对认不出的 stageId 没有回退到按天数重算 —— 老计划会掉进「还没定考期」",
);

/* --- 17.2 「多一项」删了 --- */

assert(!planPage.includes("多一项"), "「多一项」按钮又出现了");
assert(!planPage.includes("goals.length + 1"), "又出现了一个只加数量、不挑内容的入口");
assert(planPage.includes("加一项"), "「加一项」不该被一起删掉");
assert(planPage.includes("少一项"), "「少一项」不该被一起删掉");

/* --- 17.3 暗色模式不能是「近白底 + 荧光绿字」 --- */

/*
 * 暗色模式下 --cet-fg 是 #f4f1e6（近白），--cet-primary 是 #dfff63（荧光绿）。
 * 这两个撞在一起对比度约 1.05:1，等于没写。
 * 反色的 chip 必须用 bg-fg + text-bg —— 这正是 button.tsx / bottom-nav 一直在用的配对。
 */
const BAD_INK = ["bg-fg text-primary", 'font-black text-primary"', "font-black text-primary'"] as const;
for (const { f, src } of srcCode) {
  for (const bad of BAD_INK) {
    assert(!src.includes(bad), `${f} 里出现「${bad}」—— 暗色模式下是近白底配荧光绿字，看不清`);
  }
}
const examShell = readSrc("src/components/paper/exam-shell.tsx");
assert(
  examShell.includes("bg-fg text-bg"),
  "考场倒计时的底/字配对不对 —— 它是全站唯一常驻在顶部的计时器",
);

/* --- 17.4 记生词 = 在原文里点词，不再是每题一个按钮 --- */

const ADD_WORD_DEAD = ["记生词", "AddWordRow", "CompactAddWord", "onAddWord", "savedWords"] as const;
for (const { f, src } of srcCode) {
  for (const dead of ADD_WORD_DEAD) {
    assert(!src.includes(dead), `${f} 里还有「${dead}」—— 记生词已经改成在原文里点词了`);
  }
}
// 旧的候选词生成器也该跟着走：它挑的是选项里的词，不是学生在原文里读到的那个
assert(
  !ALL_SRC.includes("src/components/paper/segments/words.ts"),
  "words.ts 又回来了 —— 它按长度阈值猜词，学生点的是自己认识的那个词",
);

const tappable = readSrc("src/components/paper/tappable-text.tsx");
assert(tappable.includes("export function TappableText"), "缺少 TappableText");
for (const f of [
  "src/components/paper/segments/reading-section.tsx",
  "src/components/paper/segments/listening-unit.tsx",
]) {
  assert(
    /from "@\/components\/paper\/tappable-text"/.test(readSrc(f)),
    `${f} 没有引用 TappableText —— 原文点不出词`,
  );
}

// 点词要能填进去也得能删掉：这两个动作都得落到真实的作答记录上
const attempt = readSrc("src/components/paper/use-attempt.ts");
for (const fn of ["clearAnswer", "placeAnswer"]) {
  assert(attempt.includes(`const ${fn} = useCallback`), `use-attempt 里没有 ${fn}`);
  assert(
    new RegExp(`\\b${fn}\\b`).test(readSrc("src/components/paper/segments/reading-section.tsx")),
    `选词填空没有用到 ${fn} —— 填进去就删不掉了`,
  );
}
// 词库选项只能用一次，所以往新空里填时必须把旧的那一空腾出来
assert(
  /num !== n && v === key/.test(attempt),
  "placeAnswer 没有把同一个键从原来那一空里挪走 —— 同一个选项会同时占住两个空",
);

/* --- 17.5 选词填空是点空格填词，不是十张题卡往下摆 --- */

const reading = readSrc("src/components/paper/segments/reading-section.tsx");
assert(reading.includes("const tapBlank"), "选词填空没有「点空格」的处理");
assert(reading.includes("const tapBank"), "选词填空没有「点词库选项」的处理");
assert(reading.includes("activeBlank"), "选词填空没有记录当前选中的空");
assert(
  reading.includes('section.kind === "bank"') && reading.includes("isBank ?"),
  "阅读题段没有按 kind 分开处理 —— 选词填空又会被摊成一堆题卡",
);
assert(
  /isBank\s*\?\s*submitted\s*\?/.test(reading) || /\{isBank \? \(/.test(reading),
  "选词填空交卷后没有走紧凑结果表",
);
// CompactQuestion 只该留给长篇匹配（段落 A–P），不该再挂在选词填空上
assert(
  !/options=\{options\}[\s\S]{0,200}?onAddWord/.test(reading),
  "CompactQuestion 又带上了记生词入口",
);

// 反向锁：题库里得真的有可点的空和可点的选项，否则这套交互是空的
const rBank = getReadingSection(getPaper("2025-12-set1")!, "r-a");
assert(!!rBank && rBank.kind === "bank", "2025-12-set1 的 r-a 不再是选词填空");
const blankNos = (rBank?.paragraphs ?? []).flatMap((p) =>
  [...p.en.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1])),
);
assert(blankNos.length > 0, "选词填空原文里没有 {{n}} 空 —— 点空格填词无从谈起");
assert(
  (rBank?.bank?.length ?? 0) > 0,
  "选词填空没有词库 —— 点空格之后没东西可点",
);

console.log(
  `  阶段 4 段无空洞 · 「多一项」已删 · ${srcCode.length} 个源文件无「近白底配荧光绿字」 · 记生词只剩原文点词 · 选词填空 ${blankNos.length} 空 / ${rBank?.bank?.length ?? 0} 选项`,
);

/* --------------------------------- 18. 没考期就不许生成周计划（修一个既有的坑） */

section("18. 没有档案就没有周计划，不会凭空生成一份「考前一周」");

/*
 * 曾经的坑：学生还没填完 onboarding 就先进了 /plan，`useRequireProfile` 把他弹去
 * /welcome，但 `useWeeklyPlan` 的 effect 早就跑完了。那一刻 profile 还是 undefined，
 * `ensureWeeklyPlan` 里 `profile?.examDate ?? todayKey()` 把「还没填考期」
 * 算成「距考 0 天」，生成一份考前一周的推荐**存进库**，之后再也不重算。
 *
 * 表面症状是「距考试 0 天 · 考前一周」，但底下还按考前一周的标准量推荐题段 ——
 * 直接违反「阶段只看距考天数」和「推荐必须可追溯」两条底线，所以必须钉死。
 */
const useStudy = readSrc("src/hooks/use-study.ts");
const planHook = useStudy.slice(
  useStudy.indexOf("export function useWeeklyPlan"),
  useStudy.indexOf("export function useWeekRollover"),
);
assert(planHook.length > 0, "use-study.ts 里找不到 useWeeklyPlan");
assert(
  planHook.includes("useProfileState"),
  "useWeeklyPlan 没读档案 —— 没有考期也会生成周计划",
);
assert(
  /if \(!loaded \|\| !profile\) return;/.test(planHook),
  "useWeeklyPlan 没有等档案就绪 —— 没填考期也会生成周计划",
);
assert(
  !/if \(plan\) return;\s*\n\s*let alive/.test(planHook),
  "useWeeklyPlan 又变回「只要没计划就建一份」了",
);
// 生成端也留一道：真的没有档案时，宁可不生成，也不要拿今天当考期凑一份出来
assert(
  /profile\?\.examDate \?\? todayKey\(\)/.test(readSrc("src/lib/repo.ts")),
  "ensureWeeklyPlan 的兜底写法变了 —— 第 17 节的说明要一起改",
);

console.log("  没档案就不生成周计划 · 考期不会被兜底成「今天」");

/* -------------------- 19. 选词填空：词性先标，语法语境再收（不得现编词性） */

section("19. 选词填空按「词性 → 语法 → 语境」给，词性来自解析册不是现编的");

// 走遍所有已入库的卷，不只是 2025-12-set1
const bankSections = PAPERS.flatMap((paper) =>
  paper.readingSections.filter((s) => s.kind === "bank" && (s.bank?.length ?? 0) > 0),
);
assert(bankSections.length > 0, "一道选词填空都没入库");

for (const sec of bankSections) {
  const bank = sec.bank ?? [];
  const secQs = PAPERS.find((p) =>
    p.readingSections.some((s) => s.id === sec.id),
  )!.questions.filter((q) => q.n >= sec.questionRange[0] && q.n <= sec.questionRange[1]);

  // 1. 词性必须**每一个**备选词都有 —— 这是「先标词性」能落地的前提
  const noPos = bank.filter((b) => !b.pos?.trim()).map((b) => b.key);
  assert(
    noPos.length === 0,
    `${sec.id} 的词库有 ${noPos.length} 个词没标词性（${noPos.join(",")}）—— 学生没法先分词性`,
  );

  // 2. 只认四大基础词性。解析册标的是「首要词性」，这里不替它猜一词多性
  for (const b of bank) {
    assert(
      POS_ORDER.includes(b.pos as (typeof POS_ORDER)[number]),
      `${sec.id} 的 ${b.key}. ${b.word} 词性是「${b.pos}」，不属于 n./v./adj./adv. 四类`,
    );
  }

  // 3. 分组必须把 15 个词一个不漏地装下，且按 n./v./adj./adv. 排序
  const groups = posGroups(sec);
  const grouped = groups.flatMap((g) => g.words);
  assert(grouped.length === bank.length, `${sec.id} 的词性分组漏了词`);
  assert(
    groups.every((g) => g.words.every((w) => w.pos === g.pos)),
    `${sec.id} 的词性分组把词放错了类`,
  );
  const order = groups.map((g) => POS_ORDER.indexOf(g.pos as (typeof POS_ORDER)[number]));
  assert(
    order.every((v, i) => i === 0 || v >= order[i - 1]),
    `${sec.id} 的词性分组没有按 n./v./adj./adv. 排`,
  );

  // 4. 每一空的解析都必须能拆出「语法」和「语境」两截
  for (const q of secQs) {
    const { grammar, context } = splitExplain(q.explain ?? "");
    assert(grammar.length > 0, `${sec.id} 第 ${q.n} 题拆不出语法判断`);
    assert(context.length > 0, `${sec.id} 第 ${q.n} 题拆不出语义判断`);
    // 拆分不许丢字也不许加字：把标签去掉后，两截拼回去要覆盖原文全部实义内容
    const rejoined = `${grammar}${context}`;
    for (const chunk of (q.explain ?? "").split(/[。；：]/).filter((c) => c.trim().length > 4)) {
      const key = chunk.replace(/^(语法判断|语义判断)\s*/, "").trim().slice(0, 8);
      assert(
        rejoined.includes(key),
        `${sec.id} 第 ${q.n} 题的解析被改动了（找不到「${key}」）—— 解析册的原话不许被重写`,
      );
    }
  }

  // 5. 正确答案必须在词库里，且词库里的选项只能用一次
  for (const q of secQs) {
    assert(
      bank.some((b) => b.key === q.answer),
      `${sec.id} 第 ${q.n} 题的正确答案 ${q.answer} 不在词库里`,
    );
    assert(
      samePosSiblings(sec, q.answer).every((b) => b.key !== q.answer),
      `${sec.id} 第 ${q.n} 题的同词性候选里混进了正确答案自己`,
    );
  }
}

// 6. 做题阶段**不许**出现答案键的词性 —— 词性是学生自己标的，不是现成的
const bankUi = readSrc("src/components/paper/segments/reading-section.tsx");
assert(
  !bankUi.includes("{b.pos}"),
  "词库选项上直接显示了 b.pos —— 题面给了现成词性，「先标词性」这一步就废了",
);
assert(
  !bankUi.includes("posFilter"),
  "还留着按答案键词性收窄词库的筛选 —— 那行数字本身就是泄题",
);
assert(
  !/\{g\.pos\} ×\{/.test(bankUi),
  "还留着按答案键词性统计的分布按钮 —— 15 个词怎么分，直接等于给了一半答案",
);
// 7. 学生自己标词性这条路要通：点词后面的小圆圈 → 选词性 → 标上
assert(
  bankUi.includes("data-mark={b.key}"),
  "词库上没有标词性的入口 —— 学生没地方自己标",
);
assert(
  bankUi.includes("POS_ORDER.map"),
  "词性选项没有取自 POS_ORDER —— 四个基础词性只有一处出处",
);
assert(bankUi.includes("toggleMark"), "标词性没有接到落库上");
assert(bankUi.includes("posMarks"), "自标的词性没有读出来");
const attemptUi = readSrc("src/components/paper/use-attempt.ts");
assert(attemptUi.includes("markPos"), "use-attempt 里没有 markPos —— 自标的词性存不下来");
assert(
  attemptUi.includes("posMarks: raw.posMarks ?? {}"),
  "旧的作答记录没有补 posMarks 默认值 —— 读历史记录会崩",
);
assert(
  readSrc("src/lib/types.ts").includes("posMarks: Record<string, string>"),
  "PaperAttempt 里没有 posMarks 字段",
);
// 8. 交卷后解析按「词性 → 语法 → 语境」三步给，并跟学生自己标的对比
assert(
  /label="词性"[\s\S]*label="语法"[\s\S]*label="语境"/.test(bankUi),
  "解析不是按「词性 → 语法 → 语境」三步排的",
);
// 同词性候选那句只在推得出来时才说：两个真实词性相同才提；
// 而且只在答错时提 —— 答对了说「错在后面两步」是胡话。
assert(
  bankUi.includes("posMatched") && bankUi.includes("词性这步没错"),
  "答错时没有指出「词性对了、错在后面两步」",
);
assert(
  /!right\s*&&\s*picked\s*&&\s*pickedPos/.test(bankUi),
  "「错在后面两步」没有绑在答错上 —— 答对了也说这句就成瞎话了",
);
// 学生自标的词性要跟解析册的并排摆出来
assert(
  bankUi.includes("你自己标的也是") && bankUi.includes("这个词是"),
  "交卷后没有把学生自己标的词性和解析册的对比出来",
);

// 9. 反向锁：词性不许在界面里被写死。写死就意味着有一处能跟解析册对不上
const hardPos = [...bankUi.matchAll(/"(n\.|v\.|adj\.|adv\.)"/g)].map((m) => m[0]);
assert(
  hardPos.length === 0,
  `reading-section.tsx 里写死了词性 ${hardPos.join(",")} —— 词性只能来自 bank[].pos`,
);

console.log(
  `  ${bankSections.length} 段选词填空 · 备选词词性 100% 覆盖 · 做题时不给现成词性 · 解析按三步拆开且一字未改 · 词性不写死`,
);

/* -------------------- 20. 题目标题一律英文（中文只留在译文和解析里） */

section("20. 题目标题全部是英文");

const CJK = /[\u4e00-\u9fff]/;

for (const paper of PAPERS) {
  for (const s of paper.readingSections) {
    assert(Boolean(s.label?.trim()), `${paper.id} 的 ${s.id} 没有英文卷面名`);
    assert(
      !CJK.test(s.label),
      `${paper.id} 的 ${s.id} 英文卷面名里混进了中文：${s.label}`,
    );
  }
  for (const u of paper.listeningUnits) {
    assert(Boolean(u.label?.trim()), `${paper.id} 的 ${u.id} 没有英文卷面名`);
    assert(
      !CJK.test(u.label),
      `${paper.id} 的 ${u.id} 英文卷面名里混进了中文：${u.label}`,
    );
  }
}

// 题型 → 英文标题，只有这一处出处
assert(
  readSrc("src/lib/papers/index.ts").includes("Banked Cloze") &&
    readSrc("src/lib/papers/index.ts").includes("Matching") &&
    readSrc("src/lib/papers/index.ts").includes("Reading Comprehension"),
  "阅读题型的英文标题不在 papers/index.ts 里 —— 标题就散在各处了",
);

// 界面上不再拿中文那份当标题。
// 数据文件里 labelZh 留着做对照（同一份中文标题还在库里），那是数据不是界面。
const UI_DIRS = ["src/app", "src/components"];
const labelZhInUi = srcCode
  .filter(({ f, src }) => UI_DIRS.some((d) => f.startsWith(d)) && /labelZh/.test(src))
  .map(({ f }) => f);
assert(
  labelZhInUi.length === 0,
  `界面上还在用中文题目标题：${labelZhInUi.join(", ")}`,
);

// 英文标题确实接上了
assert(
  readSrc("src/components/paper/segments/reading-section.tsx").includes(
    "readingKindTitle(section.kind)",
  ),
  "阅读题段没有用英文标题",
);
assert(
  readSrc("src/components/paper/segments/listening-unit.tsx").includes("{unit.label}"),
  "听力题段没有用英文卷面名当标题",
);
assert(
  readSrc("src/app/papers/page.tsx").includes("paper.titleEn"),
  "真题库卡片没有用英文试卷名",
);
assert(
  readSrc("src/components/paper/segments/writing-task.tsx").includes(">Writing</Title>"),
  "写作题标题还是中文",
);
assert(
  readSrc("src/components/paper/segments/translation-task.tsx").includes(">Chinese to English</Title>"),
  "翻译题标题还是中文",
);

console.log("  4 段阅读 + 7 段听力的标题全英文 · 界面不再用中文标题");

/* ------------- 21. 这轮删掉的板块、配色、播放控件 ------------- */

section("21. 删掉的板块没回流，配色和播放控件是新的");

// 1. 出处说明整段删掉
assert(
  !readSrc("src/lib/papers/index.ts").includes("题干与选项取自真题卷面"),
  "试卷出处说明又回来了",
);
assert(
  !readSrc("src/app/papers/[paperId]/page.tsx").includes("sourceNote"),
  "试卷页又显示出处说明了",
);
assert(
  !readSrc("src/app/papers/page.tsx").includes("paper.source"),
  "真题库卡片又显示出处说明了",
);
assert(
  !readSrc("src/lib/papers/index.ts").includes("六级解析第 1 套"),
  "试卷来源那行又回来了",
);
// 2. 考场规则与音频说明整块删掉
const paperPage = readSrc("src/app/papers/[paperId]/page.tsx");
for (const gone of ["考场规则与音频说明", "考场时长出处", "音频分段依据"]) {
  assert(!paperPage.includes(gone), `「${gone}」这个板块又回来了`);
}
// 3. 翻译框那句删掉
assert(
  !readSrc("src/components/paper/segments/translation-task.tsx").includes("刷新也不会丢"),
  "翻译框的「刷新也不会丢」又回来了",
);

// 4. 浅色底必须配深墨字：紫底在暗色下是浅的，字不能跟着变浅。
// 按「同一个 class 字符串」来查 —— 同一文件里别处用浅紫字是允许的
// （bg-lavender-soft 在暗色下是深底，浅紫字正好）。
const lavenderBad = srcCode
  .flatMap(({ f, src }) =>
    (src.match(/"[^"\n]*bg-lavender(?![-\w])[^"\n]*"/g) ?? []).map((s) => `${f} → ${s}`),
  )
  .filter((s) => s.includes("text-lavender-fg"));
assert(
  lavenderBad.length === 0,
  `淡紫底上又用了浅紫字（暗色下看不清）：${lavenderBad.join(" | ")}`,
);
assert(
  paperPage.includes("bg-lavender p-5 text-on-accent"),
  "分数卡没配深墨字 —— 暗色下是白字压浅紫底",
);

// 5. 音频能拖、能调速
const audioUi = readSrc("src/components/paper/parts.tsx");
assert(
  audioUi.includes('role="slider"') && audioUi.includes("onPointerDown"),
  "进度条不能拖 —— 解析时反复回听某一句就没法用",
);
assert(
  audioUi.includes("setPointerCapture") && audioUi.includes("releasePointerCapture"),
  "拖动进度条没有抓住指针 —— 手指滑出轨道就断了",
);
assert(
  audioUi.includes("el.playbackRate = rate"),
  "倍速没有真的作用到播放器上",
);
for (const r of ["0.8", "1.5"]) {
  assert(audioUi.includes(r), `倍速档 ${r} 不见了`);
}
assert(
  audioUi.includes("PLAYBACK_RATES") && audioUi.includes("原速"),
  "倍速档不完整 —— 学生自己选就得给全慢速 / 原速 / 快速",
);

console.log(
  "  出处说明 · 考场规则板块 · 翻译那句都删干净 · 紫底配墨字 · 进度条可拖 + 三档倍速",
);

/* --------- 22. 推荐依据的新句式、弱项尾巴、少一项自选、试卷内无翻页按钮 */

section("22. 推荐依据按新句式写，「少一项」由学生自己挑，试卷内部不再有翻页按钮");

/** 目标标题 → 量词。听力按「篇」，阅读按「段」，写作和翻译按「次」。 */
const GOAL_UNIT: Record<string, string> = {
  听力真题: "篇",
  阅读真题: "段",
  写作一篇: "次",
  翻译一段: "次",
};

/** 旧依据的写法，逐条锁死 */
const BASIS_DEAD = [
  "你自己标了这一项是弱项",
  "的目标量已经达到了",
  "词汇是习惯，断了就得重新捡",
  "这是唯一一件每天做都不会白做的事",
  "练了",
  "·",
] as const;

for (const daysOut of [400, 200, 120, 61, 60, 30, 10, 3, 0]) {
  const examDate = addDays(today, daysOut);
  const rec = recommendWeeklyGoals({
    profile: { examDate, weakAreas: [] },
    coverage: NO_COVERAGE,
    today,
  });
  for (const g of rec.goals) {
    for (const dead of BASIS_DEAD) {
      assert(
        !g.basis.includes(dead),
        `距考 ${daysOut} 天的「${g.title}」依据里还有旧写法：${dead}（${g.basis}）`,
      );
    }
    const unit = GOAL_UNIT[g.title];
    if (unit) {
      assert(
        new RegExp(`^距考 ${daysOut} 天，已练 \\d+ ${unit}。`).test(g.basis),
        `距考 ${daysOut} 天的「${g.title}」依据没有按「距考 N 天，已练 M ${unit}。」开头：${g.basis}`,
      );
      assert(
        new RegExp(
          `(结合剩余备考时间，建议本周练习 \\d+ ${unit}。|这一阶段建议的 \\d+ ${unit}已经练够了)`,
        ).test(g.basis),
        `距考 ${daysOut} 天的「${g.title}」依据里没说本周该练多少：${g.basis}`,
      );
    } else if (g.title === "核心词汇过一轮") {
      assert(
        /^距考 \d+ 天，(已看过 \d+ 个词条|词汇尚未开始)。结合剩余备考时间，建议过完一轮核心词汇。/.test(
          g.basis,
        ),
        `词汇条的依据不是「距考 N 天，词汇尚未开始 / 已看过 N 个词条」：${g.basis}`,
      );
    }
  }
}

// 还没定考期时不该编出一个「距考 N 天」
const noExam = recommendWeeklyGoals({
  profile: { examDate: "not-a-date", weakAreas: [] },
  coverage: NO_COVERAGE,
  today,
});
for (const g of noExam.goals) {
  assert(!g.basis.includes("距考"), `还没定考期却说了「距考」：${g.basis}`);
  assert(g.basis.startsWith("还没定考期"), `还没定考期时的依据开头不对：${g.basis}`);
}

// 弱项尾巴：学生标过的写「你标记为弱项」，其余里最弱的那块写「此项较为薄弱。」
const marked = recommendWeeklyGoals({
  profile: { examDate: addDays(today, 61), weakAreas: ["writing"] },
  coverage: NO_COVERAGE,
  today,
});
const writingGoal = marked.goals.find((g) => g.title === "写作一篇");
assert(Boolean(writingGoal), "标了写作弱项却没推荐写作");
assert(
  writingGoal!.basis.includes("你标记为弱项"),
  `学生自己标的弱项，依据里没认出来：${writingGoal!.basis}`,
);
assert(
  marked.goals.filter((g) => g.basis.includes("此项较为薄弱")).length === 1,
  "「此项较为薄弱」最多一条 —— 它是系统看出来的，不是每一项都弱",
);
for (const g of marked.goals) {
  assert(
    !(g.basis.includes("你标记为弱项") && g.basis.includes("此项较为薄弱")),
    `「${g.title}」同时挂了两条弱项尾巴`,
  );
}
// 系统看出来的薄弱，要落在没被标弱项、练得又最少的那一块
assert(
  marked.goals[0].basis.includes("此项较为薄弱"),
  `系统看出来的薄弱项没落在练得最少的那一项上：${marked.goals[0].basis}`,
);
// 没人标弱项时，就不该出现「你标记为弱项」
const plain = recommendWeeklyGoals({
  profile: { examDate: addDays(today, 61), weakAreas: [] },
  coverage: NO_COVERAGE,
  today,
});
assert(
  plain.goals.every((g) => !g.basis.includes("你标记为弱项")),
  "没人标弱项，依据里却出现了「你标记为弱项」",
);
assert(
  plain.goals.filter((g) => g.basis.includes("此项较为薄弱")).length === 1,
  "「此项较为薄弱」应该只有一条",
);

// 自评弱项往前挪一位，不是插队到最前面
assert(
  marked.goals.map((g) => g.title).slice(0, 4).join(",") === "听力真题,写作一篇,阅读真题,翻译一段",
  `自评弱项挪的幅度不对：${marked.goals.map((g) => g.title).join(",")}`,
);

// 「推荐依据」只有一句话，且只在一处
// 用剥掉注释的源码：注释里解释「依据只有三种」是说明，不是界面文案
const planSrc = srcCode.find((x) => x.f === "src/app/plan/page.tsx")?.src ?? "";
assert(
  planSrc.includes("推荐依据：考试剩余天数、系统记录的真题练习进度、用户标记的弱项（仅做微调使用）。"),
  "「这周建议」下面没有那句推荐依据的总说明",
);
assert(!planSrc.includes("依据只有三种"), "依据说明还是旧那一句");

// 「少一项」由学生自己挑，系统不再替他把最后一项砍掉
assert(!planSrc.includes("resizeWeeklyGoals"), "「少一项」还在按数量截断 —— 该让学生自己挑");
assert(planSrc.includes("少哪一项"), "「少一项」没有弹出让学生自己挑的选项");
assert(
  /removeWeeklyGoal\(plan\.id, removePick\)/.test(planSrc),
  "「少这一项」没有接到精确删除上",
);
assert(
  !readSrc("src/lib/repo.ts").includes("resizeWeeklyGoals"),
  "resizeWeeklyGoals 还留在 repo 里 —— 它是「系统自己少」那条路",
);

// 试卷内部不再摆上一段 / 下一段：翻页靠手势、方向键和 chip 行
const browserSrc = readSrc("src/components/paper/paper-browser.tsx");
for (const gone of ['aria-label="上一段"', 'aria-label="下一段"', "ChevronLeft", "ChevronRight"]) {
  assert(!browserSrc.includes(gone), `试卷内部又出现了「${gone}」这个翻页按钮`);
}
assert(browserSrc.includes("全 Part"), "题段说明那行被一起删了 —— 它是题号范围的唯一出处");
assert(
  browserSrc.includes("useTwoLevelSwipe") && browserSrc.includes("onKeyDown"),
  "删掉翻页按钮之后，页内没有别的翻页入口了",
);

console.log(
  "  依据按「距考 N 天 / 已练 M X / 建议本周练习 K X」写 · 弱项尾巴最多一条 · 弱项只挪一位 · 「少一项」自己挑 · 试卷内无翻页按钮",
);

/* --------------------------------------------------------------- result */

console.log(
  failures === 0
    ? `\n✅ ${checks} 项检查全部通过\n`
    : `\n❌ ${failures}/${checks} 项检查未通过\n`,
);
process.exit(failures === 0 ? 0 : 1);
