/**
 * 真题数据完整性校验
 *
 * 这些断言的作用是：任何一道题的答案、任何一个音频窗口、任何一处"定位句"
 * 都必须能在数据里自洽对应，不允许出现编造的题号、越界的时间戳或答案缺失。
 */
import {
  getPaper,
  getListeningUnit,
  getReadingSection,
  locateSentences,
  matchingOptionKeys,
  PAPERS,
  unitAudioRange,
} from "../src/lib/papers";
import { EXAM_PART_LIMIT } from "../src/lib/papers/exam-clock";
import type { Paper, Question } from "../src/lib/papers/types";

let passed = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail?: string) {
  if (ok) passed++;
  else failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
}

/** 2025.12 第一套官方答案（取自解析册，人工核对） */
const OFFICIAL_KEY: Record<number, string> = {
  1: "A", 2: "D", 3: "C", 4: "A", 5: "B", 6: "B", 7: "D", 8: "C", 9: "D", 10: "A",
  11: "C", 12: "A", 13: "B", 14: "B", 15: "D", 16: "B", 17: "A", 18: "D", 19: "C", 20: "B",
  21: "D", 22: "C", 23: "A", 24: "C", 25: "D",
  26: "H", 27: "J", 28: "G", 29: "C", 30: "E", 31: "F", 32: "D", 33: "K", 34: "L", 35: "A",
  36: "C", 37: "H", 38: "D", 39: "L", 40: "A", 41: "F", 42: "M", 43: "J", 44: "O", 45: "G",
  46: "D", 47: "A", 48: "D", 49: "B", 50: "B",
  51: "C", 52: "A", 53: "C", 54: "D", 55: "B",
};

function verifyPaper(paper: Paper) {
  // ---- 题型与题量 ----
  check(`${paper.id} 听力 25 题`, paper.stats.listening === 25);
  check(`${paper.id} 阅读 30 题`, paper.stats.reading === 30);
  check(`${paper.id} 共 55 题`, paper.questions.length === 55, `实际 ${paper.questions.length}`);

  const ns = paper.questions.map((q) => q.n).sort((a, b) => a - b);
  const expected = Array.from({ length: 55 }, (_, i) => i + 1);
  check(`${paper.id} 题号连续 1..55`, ns.every((n, i) => n === expected[i]));

  // ---- 答案与官方一致 ----
  for (const q of paper.questions) {
    check(`${paper.id} Q${q.n} 答案 = ${OFFICIAL_KEY[q.n]}`, q.answer === OFFICIAL_KEY[q.n], `实际 ${q.answer}`);
  }

  // ---- 每题都有解析，且不是空壳 ----
  for (const q of paper.questions) {
    check(`${paper.id} Q${q.n} 有解析`, q.explain.trim().length >= 20, `长度 ${q.explain.length}`);
  }

  // ---- 听力 ----
  const duration = paper.timing?.durationSec ?? 0;
  check(`${paper.id} 音频时长 > 20 分钟`, duration > 1200, `${duration}s`);
  check(`${paper.id} 逐句时间戳未谎称已验证`, paper.timing?.sentenceLevelVerified === false);

  let prevEnd = -1;
  const unitQuestionTotal: number[] = [];
  for (const unit of paper.listeningUnits) {
    const w = unit.window;
    check(`${unit.id} 窗口在音频内`, w.startSec >= 0 && w.endSec <= duration + 1, JSON.stringify(w));
    check(`${unit.id} 窗口顺序递增`, w.startSec > prevEnd, `start ${w.startSec} vs prevEnd ${prevEnd}`);
    check(`${unit.id} 窗口有正时长`, w.endSec - w.startSec > 30, `${(w.endSec - w.startSec).toFixed(1)}s`);
    prevEnd = w.endSec;

    const [lo, hi] = unit.questionRange;
    const count = hi - lo + 1;
    unitQuestionTotal.push(count);

    const qs = paper.questions.filter((q) => q.n >= lo && q.n <= hi);
    check(`${unit.id} 题量匹配 questionRange`, qs.length === count, `${qs.length} vs ${count}`);
    check(`${unit.id} 题号连续`, qs.every((q, i) => q.n === lo + i));

    // 听力选项必须完整 A/B/C/D
    for (const q of qs) {
      check(`${unit.id} Q${q.n} 四选项齐全`,
        (q.options?.length ?? 0) === 4 && ["A", "B", "C", "D"].every((k) => (q.options ?? []).some((o) => o.key === k)));
    }

    // 原文标记必须落在本单元题号范围内
    for (const s of unit.transcript) {
      for (const m of s.marks ?? []) {
        check(`${unit.id} ${s.id} 标记 [${m}] 在本题段内`, m >= lo && m <= hi, `题段 ${lo}-${hi}`);
      }
      // 未验证的逐句时间戳必须为空，不能编造
      check(`${unit.id} ${s.id} 未携带未经验证的时间戳`,
        s.startSec == null && s.endSec == null);
    }

    // 每道题都必须至少有一个真实定位句
    for (const q of qs) {
      check(`${unit.id} Q${q.n} 有原文定位句`, locateSentences(unit, q.n).length > 0);
    }

    // 题干播报窗口：音频里每段单元的构成是
    //   原文 → "Questions N to M are based on …" → 各题英文题干 + 每题约 13.5s 的答题停顿
    // 曾经把「答题停顿的起点」当成单元终点，于是每段只播到第一题就停，
    // 后面几题的题干从来没人播 —— 而做题界面按考场规矩不显示题干。
    const sw = unit.stemsWindow;
    check(`${unit.id} 有题干播报窗口`, !!sw);
    if (sw) {
      check(`${unit.id} 题干窗口紧接原文结尾`, sw.startSec === unit.window.endSec,
        `stems.start ${sw.startSec} vs window.end ${unit.window.endSec}`);
      check(`${unit.id} 题干窗口在音频内且有正时长`,
        sw.endSec <= duration + 1 && sw.endSec > sw.startSec, JSON.stringify(sw));

      // 剩下的每一题都必须在题干窗口里被读出来
      const expectedStems = Array.from({ length: count - 1 }, (_, i) => lo + 1 + i);
      check(`${unit.id} 题干窗口覆盖剩余全部题号`,
        JSON.stringify(sw.questions) === JSON.stringify(expectedStems),
        `${JSON.stringify(sw.questions)} vs ${JSON.stringify(expectedStems)}`);

      // 题干窗口的时长构成：每题 13.5s 停顿 + (count-1) 段约 5s 的题干朗读
      const per = (sw.endSec - sw.startSec) / count;
      check(`${unit.id} 停顿/题 ≈ 13.5s停顿+报题`, per > 16 && per < 19, `${per.toFixed(2)}s`);
    }

    // 本段的完整可播区间必须越过原文结尾，盖到最后一个题号的停顿结束
    const range = unitAudioRange(unit);
    check(`${unit.id} 可播区间盖到最后一题`,
      range.startSec === unit.window.startSec && range.endSec > unit.window.endSec,
      JSON.stringify(range));
  }
  check("7 段听力", paper.listeningUnits.length === 7, `${paper.listeningUnits.length}`);
  check(
    "听写段数 4/4/3/4/3/3/4 = 25 题",
    unitQuestionTotal.join("/") === "4/4/3/4/3/3/4",
    unitQuestionTotal.join("/")
  );

  // ---- 7 段的可播区间必须首尾相接，不重不漏 ----
  // 重了会重复听，漏了会断档；两段之间留缝的话，学生听到的是被剪过的音频。
  const ranges = paper.listeningUnits.map((u) => unitAudioRange(u));
  let cursor = ranges[0].startSec;
  for (let i = 0; i < ranges.length; i += 1) {
    check(
      `第 ${i + 1} 段可播区间与上一段相接`,
      Math.abs(ranges[i].startSec - cursor) < 0.01,
      `${ranges[i].startSec} vs ${cursor}`
    );
    cursor = ranges[i].endSec;
  }
  const playableSec = cursor - ranges[0].startSec;
  check("听力可播总时长 > 20 分钟", playableSec > 1200, `${playableSec.toFixed(1)}s`);
  check(
    "听力可播总时长不超考场听力时长",
    playableSec <= EXAM_PART_LIMIT.listening.minutes * 60,
    `${playableSec.toFixed(1)}s vs ${EXAM_PART_LIMIT.listening.minutes * 60}s`
  );
  // 全卷 25 道题：每段第一题的题干在原文末尾，其余都在题干窗口里
  const stemTotal = paper.listeningUnits.reduce(
    (n, u) => n + (u.stemsWindow?.questions.length ?? 0),
    0
  );
  const questionTotal = paper.listeningUnits.reduce(
    (n, u) => n + (u.questionRange[1] - u.questionRange[0] + 1),
    0
  );
  check(
    "每段第一题在原文末尾被读出，其余题在题干窗口",
    stemTotal + paper.listeningUnits.length === questionTotal,
    `${stemTotal} + ${paper.listeningUnits.length} vs ${questionTotal}`
  );

  // ---- 阅读 ----
  const sections = paper.readingSections;
  check(`${paper.id} 4 个阅读题型`, sections.length === 4, `${sections.length}`);
  const readingQuestionTotal: number[] = [];
  for (const sec of sections) {
    const [lo, hi] = sec.questionRange;
    readingQuestionTotal.push(hi - lo + 1);
    const qs = paper.questions.filter((q) => q.n >= lo && q.n <= hi);
    check(`${sec.id} 题量匹配`, qs.length === hi - lo + 1);

    if (sec.kind === "bank") {
      check(`${sec.id} 有词库 15 项`, sec.bank?.length === 15, `${sec.bank?.length}`);
      const bankKeys = new Set(sec.bank?.map((b) => b.key));
      for (const q of qs) {
        check(`${sec.id} Q${q.n} 答案在词库中`, bankKeys.has(q.answer as never), q.answer);
      }
      // 原文必须真的留了 10 个空
      const blanks = (sec.paragraphs?.[0].en.match(/\{\{\d+\}\}/g) ?? []).length;
      check(`${sec.id} 原文含 10 个空`, blanks === 10, `${blanks}`);
    }
    if (sec.kind === "matching") {
      const keys = matchingOptionKeys(sec);
      check(`${sec.id} 段落 A–P 齐全`, keys.length === 16, `${keys.length}`);
      for (const q of qs) {
        check(`${sec.id} Q${q.n} 答案在 A–P 中`, keys.includes(q.answer), q.answer);
      }
      check(`${sec.id} 译文段落数 = 段落数`, sec.translation?.length === sec.paragraphs?.length);
    }
    if (sec.kind === "detail") {
      for (const q of qs) {
        check(`${sec.id} Q${q.n} 四选项齐全`,
          (q.options?.length ?? 0) === 4 && ["A", "B", "C", "D"].every((k) => (q.options ?? []).some((o) => o.key === k)));
      }
    }
    check(`${sec.id} 有全文译文`, (sec.translation?.length ?? 0) > 0);
  }
  check(
    "阅读题量 10/10/5/5 = 30 题",
    readingQuestionTotal.join("/") === "10/10/5/5",
    readingQuestionTotal.join("/")
  );

  // ---- 写作 / 翻译 ----
  check(`${paper.id} 有写作`, !!paper.writing);
  check(`${paper.id} 有范文`, (paper.writing?.sampleEssay.split(/\s+/).length ?? 0) > 100);
  check(`${paper.id} 有范文译文`, (paper.writing?.sampleTranslation?.length ?? 0) > 100);
  check(`${paper.id} 范文开头与题目一致`,
    !!paper.writing && paper.writing.sampleEssay.startsWith(paper.writing.prompt));
  check(`${paper.id} 有翻译题`, (paper.translation?.zh.length ?? 0) > 50);
  check(`${paper.id} 有参考译文`, (paper.translation?.reference.length ?? 0) > 200);
  check(`${paper.id} 有译点精析`, (paper.translation?.points?.length ?? 0) >= 5);

  // ---- 单题解析不能重复占位 ----
  const explains = paper.questions.map((q) => q.explain);
  check(`${paper.id} 解析文本无空缺`, explains.every((e) => e.trim().length > 0));
}

// ---- registry ----
check("PAPERS 至少 1 套", PAPERS.length >= 1);
check("paper id 唯一", new Set(PAPERS.map((p) => p.id)).size === PAPERS.length);

for (const paper of PAPERS) {
  verifyPaper(paper);
}

// ---- 反向可达性 ----
const p = getPaper("2025-12-set1");
check("getPaper 能取到", !!p);
if (p) {
  check("getListeningUnit 能取到", !!getListeningUnit(p, "l-r2"));
  check("getReadingSection 能取到", !!getReadingSection(p, "r-b"));
  check("Q55 定位正确", p.questions.find((q) => q.n === 55)?.answer === "B");
  const dupIds = new Set<string>();
  let dup = false;
  for (const u of p.listeningUnits) for (const s of u.transcript) {
    if (dupIds.has(s.id)) dup = true;
    dupIds.add(s.id);
  }
  check("原文句 id 唯一", !dup, `共 ${dupIds.size} 句`);
}

// ---- 汇总 ----
console.log(`\n真题数据校验：${passed} 项通过，${failures.length} 项失败`);
if (failures.length) {
  for (const f of failures.slice(0, 60)) console.log(`  ✗ ${f}`);
  if (failures.length > 60) console.log(`  … 另有 ${failures.length - 60} 项`);
  process.exit(1);
}
console.log("全部通过 ✓\n");

export type { Question };
