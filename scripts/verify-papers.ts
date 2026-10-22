/**
 * 真题数据完整性校验
 *
 * 这些断言的作用是：任何一道题的答案、任何一个音频窗口、任何一处"定位句"
 * 都必须能在数据里自洽对应，不允许出现编造的题号、越界的时间戳或答案缺失。
 *
 * 最要紧的一条是「依据句必须是原文的逐字子串」：
 * 解析里引用的每一句原文都要能在这一套的转写或阅读原文里原样找到，
 * 差一个标点、换一套措辞都不算数 —— 这是防编造的最后一道机械闸门。
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

/** 归一空白后再比子串：原文里的换行、连续空格不该影响"是不是同一句话" */
function norm(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/**
 * 各套卷子的官方答案。
 *
 * 2025.12 第一套取自《2025年12月英语六级解析第1套》；
 * 2024.06 三套取自《2024年06月六级考试真题答案速查（第1/2/3套）》。
 * 都是真实来源，逐题核对过。
 */
const OFFICIAL_KEYS: Record<string, Record<number, string>> = {
  "2025-12-set1": {
    1: "A", 2: "D", 3: "C", 4: "A", 5: "B", 6: "B", 7: "D", 8: "C", 9: "D", 10: "A",
    11: "C", 12: "A", 13: "B", 14: "B", 15: "D", 16: "B", 17: "A", 18: "D", 19: "C", 20: "B",
    21: "D", 22: "C", 23: "A", 24: "C", 25: "D",
    26: "H", 27: "J", 28: "G", 29: "C", 30: "E", 31: "F", 32: "D", 33: "K", 34: "L", 35: "A",
    36: "C", 37: "H", 38: "D", 39: "L", 40: "A", 41: "F", 42: "M", 43: "J", 44: "O", 45: "G",
    46: "D", 47: "A", 48: "D", 49: "B", 50: "B",
    51: "C", 52: "A", 53: "C", 54: "D", 55: "B",
  },
  "2024-06-set1": {
    1: "B", 2: "A", 3: "C", 4: "C", 5: "A", 6: "B", 7: "A", 8: "D", 9: "A", 10: "B", 11: "B", 12: "D", 13: "C", 14: "C", 15: "D", 16: "A", 17: "C", 18: "B", 19: "A", 20: "B", 21: "D", 22: "D", 23: "A", 24: "D", 25: "C", 26: "A", 27: "I", 28: "B", 29: "D", 30: "C", 31: "O", 32: "M", 33: "L", 34: "E", 35: "N", 36: "C", 37: "H", 38: "B", 39: "K", 40: "I", 41: "D", 42: "N", 43: "J", 44: "E", 45: "O", 46: "B", 47: "D", 48: "A", 49: "D", 50: "C", 51: "D", 52: "C", 53: "A", 54: "B", 55: "A",
  },
  "2024-06-set2": {
    1: "A", 2: "B", 3: "D", 4: "A", 5: "D", 6: "C", 7: "D", 8: "A", 9: "A", 10: "D", 11: "B", 12: "B", 13: "C", 14: "D", 15: "C", 16: "D", 17: "A", 18: "C", 19: "C", 20: "B", 21: "C", 22: "B", 23: "B", 24: "A", 25: "D", 26: "I", 27: "O", 28: "H", 29: "E", 30: "G", 31: "N", 32: "A", 33: "F", 34: "J", 35: "D", 36: "D", 37: "I", 38: "A", 39: "K", 40: "H", 41: "F", 42: "J", 43: "L", 44: "G", 45: "K", 46: "B", 47: "C", 48: "A", 49: "A", 50: "D", 51: "C", 52: "D", 53: "B", 54: "D", 55: "A",
  },
  // 官方第三套不提供听力：卷面写着「由于多题多卷，官方第三套真题的听力试题
  // 与第二套真题的一致，只是选项顺序不同，因此，本套试卷不再提供听力部分」。
  "2024-06-set3": {
    26: "C", 27: "H", 28: "M", 29: "F", 30: "N", 31: "O", 32: "E", 33: "A", 34: "G", 35: "B", 36: "D", 37: "H", 38: "N", 39: "F", 40: "B", 41: "K", 42: "E", 43: "I", 44: "C", 45: "L", 46: "A", 47: "B", 48: "B", 49: "C", 50: "D", 51: "A", 52: "D", 53: "B", 54: "D", 55: "C",
  },
};

/** 这套卷子的听力题号范围（没有听力就是空） */
function listeningNos(paper: Paper): number[] {
  return paper.questions.filter((q) => q.n <= 25).map((q) => q.n);
}

function verifyPaper(paper: Paper) {
  const official = OFFICIAL_KEYS[paper.id];
  check(`${paper.id} 有官方答案表`, !!official);
  if (!official) return;

  // ---- 出处必须写清楚 ----
  check(`${paper.id} 写了材料出处`, !!paper.sources);
  check(`${paper.id} 出处含卷面`, (paper.sources?.paper?.length ?? 0) > 0);
  check(`${paper.id} 出处含答案`, (paper.sources?.answer?.length ?? 0) > 0);
  check(`${paper.id} 出处含解析`, (paper.sources?.explain?.length ?? 0) > 0);

  // ---- 题型与题量 ----
  const listenList = listeningNos(paper);
  const readList = paper.questions.filter((q) => q.n >= 26).map((q) => q.n);
  const expectListen = listenList.length ? range(1, 25) : [];
  check(
    `${paper.id} 听力题号连续`,
    listenList.join(",") === expectListen.join(","),
    listenList.join(","),
  );
  check(`${paper.id} 阅读题号连续 26–55`, readList.join(",") === range(26, 55).join(","));
  check(`${paper.id} 阅读 30 题`, readList.length === 30, `${readList.length}`);
  check(
    `${paper.id} 题量 = 听力 + 阅读`,
    paper.questions.length === listenList.length + readList.length,
    `${paper.questions.length}`,
  );
  check(
    `${paper.id} stats 与实际题量一致`,
    paper.stats.listening === listenList.length && paper.stats.reading === readList.length,
    JSON.stringify(paper.stats),
  );

  // ---- 答案与官方一致 ----
  for (const q of paper.questions) {
    check(`${paper.id} Q${q.n} 答案 = ${official[q.n]}`, q.answer === official[q.n], `实际 ${q.answer}`);
  }

  // ---- 每题都有解析，且不是空壳 ----
  for (const q of paper.questions) {
    check(`${paper.id} Q${q.n} 有解析`, q.explain.trim().length >= 20, `长度 ${q.explain.length}`);
  }

  // ---- 听力 ----
  const duration = paper.timing?.durationSec ?? 0;
  if (paper.listeningUnits.length > 0) {
    check(`${paper.id} 有音频`, !!paper.timing);
    check(`${paper.id} 音频时长 > 20 分钟`, duration > 1200, `${duration}s`);
    check(`${paper.id} 逐句时间戳未谎称已验证`, paper.timing?.sentenceLevelVerified === false);
  } else {
    // 没有听力的卷子（例如官方第三套）不能有音频信息，也不能有听力题
    check(`${paper.id} 无听力卷不带音频信息`, !paper.timing);
    check(`${paper.id} 无听力卷没有听力题`, listenList.length === 0);
  }

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

    // Section 字母必须和这一段是什么对得上：
    // 六级听力是 A 两段对话 / B 两篇短文 / C 三段讲座
    const head = (unit.label.split(/[\s·—-]+/)[0] ?? "").toLowerCase();
    const expectedSection = head === "conversation" ? "A" : head === "passage" ? "B" : head === "recording" ? "C" : null;
    check(
      `${unit.id} Section 字母与题型一致`,
      expectedSection === null || unit.section === expectedSection,
      `${unit.section} vs ${expectedSection}`,
    );

    const qs = paper.questions.filter((q) => q.n >= lo && q.n <= hi);
    check(`${unit.id} 题量匹配 questionRange`, qs.length === count, `${qs.length} vs ${count}`);
    check(`${unit.id} 题号连续`, qs.every((q, i) => q.n === lo + i));

    // 听力选项必须完整 A/B/C/D
    for (const q of qs) {
      check(`${unit.id} Q${q.n} 四选项齐全`,
        (q.options?.length ?? 0) === 4 && ["A", "B", "C", "D"].every((k) => (q.options ?? []).some((o) => o.key === k)));
    }

    // 2024 年起六级卷面不印听力题干，题干只在录音里念出来 —— 题干必须是录音里的问句
    for (const q of qs) {
      check(`${unit.id} Q${q.n} 题干来自录音（问句）`,
        q.stem.trim().length > 10 && q.stem.trim().endsWith("?"),
        q.stem.slice(0, 40));
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
      const expectedStems = range(lo + 1, hi);
      check(`${unit.id} 题干窗口覆盖剩余全部题号`,
        JSON.stringify(sw.questions) === JSON.stringify(expectedStems),
        `${JSON.stringify(sw.questions)} vs ${JSON.stringify(expectedStems)}`);

      // 题干窗口的时长构成：每题 13.5s 停顿 + (count-1) 段约 5s 的题干朗读
      const per = (sw.endSec - sw.startSec) / count;
      check(`${unit.id} 停顿/题 ≈ 13.5s停顿+报题`, per > 16 && per < 21, `${per.toFixed(2)}s`);
    }

    // 本段的完整可播区间必须越过原文结尾，盖到最后一个题号的停顿结束
    const range_ = unitAudioRange(unit);
    check(`${unit.id} 可播区间盖到最后一题`,
      range_.startSec === unit.window.startSec && range_.endSec > unit.window.endSec,
      JSON.stringify(range_));

    // ---- 逐题题干区间（"重听本题"的依据）----
    // 听力卷面不印题干，学生做完想回头再听某一道题，界面上得给得出入口；
    // 给得出入口就得知道这段声音在音频的哪儿。这个区间必须是实测值，
    // 而且必须落在这段的可播区间里 —— 越界就播不出来。
    const qw = unit.questionWindows ?? [];
    check(`${unit.id} 有逐题题干区间`, qw.length > 0);
    check(`${unit.id} 逐题区间覆盖本段全部题`,
      qw.length === count && qw.every((w, i) => w.n === lo + i),
      `${qw.length} vs ${count}`);
    let prevWindowEnd = -1;
    for (const win of qw) {
      check(`${unit.id} Q${win.n} 题干区间在可播区间内`,
        win.startSec >= range_.startSec && win.endSec <= range_.endSec + 0.01,
        `${win.startSec}–${win.endSec} vs ${range_.startSec}–${range_.endSec}`);
      check(`${unit.id} Q${win.n} 题干区间有正时长`, win.endSec > win.startSec,
        `${(win.endSec - win.startSec).toFixed(2)}s`);
      check(`${unit.id} Q${win.n} 题干区间不与上一题重叠`, win.startSec > prevWindowEnd,
        `${win.startSec} vs prevEnd ${prevWindowEnd}`);
      prevWindowEnd = win.endSec;
    }
    // 题干之间那段是答题停顿（考场里给你时间答题），不能短到几乎没有
    for (let i = 1; i < qw.length; i += 1) {
      const gap = qw[i].startSec - qw[i - 1].endSec;
      check(`${unit.id} Q${qw[i].n} 前面有答题停顿`, gap > 5, `${gap.toFixed(2)}s`);
    }
  }

  if (paper.listeningUnits.length > 0) {
    check(`${paper.id} 听力题量 = 各段之和`,
      unitQuestionTotal.reduce((a, b) => a + b, 0) === listenList.length,
      `${unitQuestionTotal.join("/")} vs ${listenList.length}`);

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
    check(`${paper.id} 听力可播总时长 > 20 分钟`, playableSec > 1200, `${playableSec.toFixed(1)}s`);
    check(
      `${paper.id} 听力可播总时长不超考场听力时长`,
      playableSec <= EXAM_PART_LIMIT.listening.minutes * 60,
      `${playableSec.toFixed(1)}s vs ${EXAM_PART_LIMIT.listening.minutes * 60}s`
    );
    // 全卷听力题：每段第一题的题干在原文末尾，其余都在题干窗口里
    const stemTotal = paper.listeningUnits.reduce(
      (n, u) => n + (u.stemsWindow?.questions.length ?? 0),
      0
    );
    check(
      `${paper.id} 每段第一题在原文末尾被读出，其余题在题干窗口`,
      stemTotal + paper.listeningUnits.length === listenList.length,
      `${stemTotal} + ${paper.listeningUnits.length} vs ${listenList.length}`
    );

    // ---- 全卷每一道听力题都得有可重听的区间 ----
    // 只要有一道题缺区间，那道题的"重听本题"就是死按钮 ——
    // 宁可整道功能不上，也不能留一个按了没反应的按钮。
    const windowTotal = paper.listeningUnits.reduce(
      (n, u) => n + (u.questionWindows?.length ?? 0),
      0
    );
    check(
      `${paper.id} 每道听力题都有可重听区间`,
      windowTotal === listenList.length,
      `${windowTotal} vs ${listenList.length}`
    );
  }

  // ---- 阅读 ----
  const sections = paper.readingSections;
  const readingQuestionTotal: number[] = [];
  for (const sec of sections) {
    const [lo, hi] = sec.questionRange;
    readingQuestionTotal.push(hi - lo + 1);
    const qs = paper.questions.filter((q) => q.n >= lo && q.n <= hi);
    check(`${sec.id} 题量匹配`, qs.length === hi - lo + 1);

    if (sec.kind === "bank") {
      check(`${sec.id} 有词库 15 项`, sec.bank?.length === 15, `${sec.bank?.length}`);
      const bankKeys = new Set(sec.bank?.map((b) => b.key));
      check(`${sec.id} 词库字母 A–O`, bankKeys.size === 15 && bankKeys.has("A") && bankKeys.has("O"));
      for (const q of qs) {
        check(`${sec.id} Q${q.n} 答案在词库中`, bankKeys.has(q.answer as never), q.answer);
      }
      // 原文必须真的留了 10 个空
      const blanks = (sec.paragraphs?.[0].en.match(/\{\{\d+\}\}/g) ?? []).length;
      check(`${sec.id} 原文含 10 个空`, blanks === 10, `${blanks}`);
      // 选词填空的解析按「语法判断 / 语义判断」两段走，界面才拆得出三步
      for (const q of qs) {
        check(`${sec.id} Q${q.n} 解析分语法/语境两段`,
          q.explain.includes("语法判断") && q.explain.includes("语义判断"));
      }
    }
    if (sec.kind === "matching") {
      const keys = matchingOptionKeys(sec);
      const labels = (sec.paragraphs ?? []).map((p) => p.label);
      check(`${sec.id} 段落标签从 A 起连续`,
        labels.length > 0 &&
        labels.every((l, i) => l === String.fromCharCode(65 + i)),
        labels.join(","));
      check(`${sec.id} 段落数 = 选项数`, keys.length === labels.length);
      for (const q of qs) {
        check(`${sec.id} Q${q.n} 答案在段落标签中`, keys.includes(q.answer), q.answer);
      }
    }
    if (sec.kind === "detail") {
      for (const q of qs) {
        check(`${sec.id} Q${q.n} 四选项齐全`,
          (q.options?.length ?? 0) === 4 && ["A", "B", "C", "D"].every((k) => (q.options ?? []).some((o) => o.key === k)));
      }
    }
    // 有全文译文的题段，译文必须和段落数对得上；没有就不硬凑
    if (sec.translation) {
      check(`${sec.id} 译文段落数 = 段落数`, sec.translation.length === sec.paragraphs?.length);
    }
  }
  check(
    `${paper.id} 阅读题量 = 各题段之和`,
    readingQuestionTotal.reduce((a, b) => a + b, 0) === 30,
    readingQuestionTotal.join("/"),
  );

  // ---- 依据句必须是原文的逐字子串（防编造的最后一道闸门）----
  // 只有「依据句由本项目依据所持原文撰写」的卷子适用：
  // 解析册的引文用的是解析册自己的措辞，有时跨句摘编，那套材料手上没有原文可比。
  const verbatim = paper.sources?.evidenceVerbatim === true;
  for (const q of paper.questions) {
    const evidence = q.evidence?.trim();
    if (!evidence) continue; // 没有依据句的题不强制
    if (!verbatim) {
      check(`${paper.id} Q${q.n} 有依据句`, evidence.length > 0);
      continue;
    }
    let pools: string[] = [];
    if (q.n <= 25) {
      const unit = paper.listeningUnits.find((u) => u.questionRange[0] <= q.n && q.n <= u.questionRange[1]);
      pools = (unit?.transcript ?? []).map((s) => s.en);
    } else {
      const sec = paper.readingSections.find((s) => s.questionRange[0] <= q.n && q.n <= s.questionRange[1]);
      if (sec?.kind === "bank") {
        pools = [sec.paragraphs?.[0].en ?? ""];
        check(`${q.n} 选词填空依据句含空标记`, evidence.includes(`{{${q.n}}}`), evidence.slice(0, 50));
      } else if (sec?.kind === "matching") {
        const para = sec.paragraphs?.find((p) => p.label === q.answer);
        pools = [para?.en ?? ""];
      } else {
        pools = (sec?.paragraphs ?? []).map((p) => p.en);
      }
    }
    const hit = pools.some((p) => norm(p).includes(norm(evidence)));
    check(`${paper.id} Q${q.n} 依据句是原文逐字子串`, hit, evidence.slice(0, 60));
  }

  // ---- 卷面文字不能混进别的板块 ----
  // 真题 PDF 里「上一段的最后一个选项」和「下一段 Section 的 Directions」是挨着的，
  // 解析脚本一不留神就把 Directions 一起抓进选项里 —— 屏幕上会直接出现一整段
  // 考试说明，学生看到的选项是坏的。卷面文字的长度也该有个上限。
  for (const q of paper.questions) {
    check(`${paper.id} Q${q.n} 题干无 Directions 残留`, !/Directions\s*:/i.test(q.stem), q.stem.slice(0, 60));
    for (const o of q.options ?? []) {
      const en = o.en ?? "";
      check(`${paper.id} Q${q.n} 选项 ${o.key} 无 Directions 残留`, !/Directions\s*:/i.test(en), en.slice(0, 60));
      check(`${paper.id} Q${q.n} 选项 ${o.key} 长度合理`, en.length <= 200, `${en.length}`);
      // 选项要有中文译文：解析页给的是「原文选项 + 中文」，没有译文就只剩一串英文
      check(`${paper.id} Q${q.n} 选项 ${o.key} 有中文译文`, (o.zh?.trim().length ?? 0) > 0);
    }
  }

  // ---- 生词 / 标注里的词必须出自原文 ----
  // 生词表、表达升级、难词译法都是从原文里挑出来的词，不许凭空生造。
  // 但词条写的是词典里的词形，原文里出现的往往是变形：
  //   bury one's head in the sand ↔ keep our heads buried in the sand
  //   allot ↔ allotting、pass ↔ passed、plunge into ↔ plunging into
  // 所以两边都展开成一组可能的词形，取交集才算对上。
  function stems(w: string): Set<string> {
    const base = w.toLowerCase();
    const out = new Set<string>([base]);
    const add = (s: string) => {
      if (s) out.add(s);
    };
    if (base.endsWith("ies")) add(base.slice(0, -3) + "y");
    if (base.endsWith("ied")) add(base.slice(0, -3) + "y");
    if (base.endsWith("ing")) add(base.slice(0, -3));
    if (base.endsWith("ed")) add(base.slice(0, -2));
    if (base.endsWith("es")) add(base.slice(0, -2));
    if (base.endsWith("s") && !base.endsWith("ss")) add(base.slice(0, -1));
    /* 双写辅音：allotting → allot */
    for (const s of [...out]) {
      if (/([bdfglmnprt])\1$/.test(s) && s.length >= 3) add(s.slice(0, -1));
    }
    /* 词尾 e 和 y：plunge → plung、bury → buri */
    for (const s of [...out]) {
      if (s.endsWith("e")) add(s.slice(0, -1));
      if (s.endsWith("y")) add(s.slice(0, -1) + "i");
    }
    return out;
  }
  const headMatch = (needle: string, pool: string) => {
    const head = (needle.match(/[A-Za-z]+/)?.[0] ?? "").toLowerCase();
    if (!head) return false;
    const want = stems(head);
    const words = norm(pool).toLowerCase().match(/[a-z]+/g) ?? [];
    return words.some((w) => {
      const got = stems(w);
      for (const v of want) if (got.has(v)) return true;
      return false;
    });
  };

  for (const u of paper.listeningUnits) {
    const pool = u.transcript.map((s) => s.en).join(" ");
    check(`${paper.id} ${u.id} 有生词`, (u.notes?.length ?? 0) >= 4, `${u.notes?.length ?? 0}`);
    for (const n of u.notes ?? []) {
      check(`${paper.id} ${u.id} 生词 "${n.en}" 出自原文`, headMatch(n.en, pool), n.en);
    }
  }
  for (const sec of paper.readingSections) {
    const pool = (sec.paragraphs ?? []).map((p) => p.en).join(" ");
    check(`${paper.id} ${sec.id} 有参考译文`, (sec.translation?.length ?? 0) > 0, `${sec.translation?.length ?? 0}`);
    check(`${paper.id} ${sec.id} 有重难点词`, (sec.notes?.length ?? 0) >= 5, `${sec.notes?.length ?? 0}`);
    for (const n of sec.notes ?? []) {
      check(`${paper.id} ${sec.id} 重难点词 "${n.en}" 出自原文`, headMatch(n.en, pool), n.en);
    }
  }

  // ---- 题干中文：听力题和仔细阅读题必须有；选词填空题的题干是 {{26}} 占位符，不能有 ----
  for (const q of paper.questions) {
    if (q.n <= 25) {
      check(`${paper.id} Q${q.n} 听力题有题干中文`, (q.stemZh?.trim().length ?? 0) > 0);
    } else {
      const sec = paper.readingSections.find((s) => s.questionRange[0] <= q.n && q.n <= s.questionRange[1]);
      if (sec?.kind === "detail") {
        check(`${paper.id} Q${q.n} 仔细阅读题有题干中文`, (q.stemZh?.trim().length ?? 0) > 0);
      }
      if (sec?.kind === "bank") {
        check(`${paper.id} Q${q.n} 选词填空无题干中文`, !q.stemZh, q.stemZh ?? "");
      }
    }
  }

  // ---- 写作 / 翻译 ----
  check(`${paper.id} 有写作`, !!paper.writing);
  check(`${paper.id} 有范文`, (paper.writing?.sampleEssay.split(/\s+/).length ?? 0) > 100);
  check(`${paper.id} 有审题说明`, (paper.writing?.brief?.length ?? 0) > 40);
  check(`${paper.id} 范文开头与题目一致`,
    !!paper.writing && paper.writing.sampleEssay.startsWith(paper.writing.prompt));
  check(`${paper.id} 有翻译题`, (paper.translation?.zh.length ?? 0) > 150);
  check(`${paper.id} 有参考译文`, (paper.translation?.reference.length ?? 0) > 200);
  // 交卷后放出来的东西要全：点评、表达升级、范文译文、译点精析、难词译法
  check(`${paper.id} 写作有点评`, (paper.writing?.comments?.length ?? 0) >= 3, `${paper.writing?.comments?.length ?? 0}`);
  check(`${paper.id} 写作有表达升级`, (paper.writing?.notes?.length ?? 0) >= 5, `${paper.writing?.notes?.length ?? 0}`);
  check(`${paper.id} 写作有范文译文`, (paper.writing?.sampleTranslation?.length ?? 0) > 100, `${paper.writing?.sampleTranslation?.length ?? 0}`);
  for (const n of paper.writing?.notes ?? []) {
    check(`${paper.id} 表达升级 "${n.en}" 出自范文`, headMatch(n.en, paper.writing?.sampleEssay ?? ""), n.en);
  }
  check(`${paper.id} 翻译有译点精析`, (paper.translation?.points?.length ?? 0) >= 5, `${paper.translation?.points?.length ?? 0}`);
  check(`${paper.id} 翻译有难词译法`, (paper.translation?.notes?.length ?? 0) >= 8, `${paper.translation?.notes?.length ?? 0}`);
  for (const n of paper.translation?.notes ?? []) {
    check(`${paper.id} 难词译法 "${n.en}" 出自参考译文`, headMatch(n.en, paper.translation?.reference ?? ""), n.en);
  }

  // ---- 单题解析不能重复占位 ----
  const explains = paper.questions.map((q) => q.explain);
  check(`${paper.id} 解析文本无空缺`, explains.every((e) => e.trim().length > 0));
}

// ---- registry ----
check("PAPERS 至少 1 套", PAPERS.length >= 1);
check("paper id 唯一", new Set(PAPERS.map((p) => p.id)).size === PAPERS.length);
check("每套卷子都有官方答案表", PAPERS.every((p) => !!OFFICIAL_KEYS[p.id]));

for (const paper of PAPERS) {
  verifyPaper(paper);
}

// ---- 反向可达性 ----
for (const paper of PAPERS) {
  const p = getPaper(paper.id);
  check(`${paper.id} getPaper 能取到`, !!p);
  if (!p) continue;
  if (p.listeningUnits.length > 0) {
    check(`${paper.id} getListeningUnit 能取到`, !!getListeningUnit(p, p.listeningUnits[0].id));
    check(`${paper.id} 末段能取到`, !!getListeningUnit(p, p.listeningUnits[p.listeningUnits.length - 1].id));
  }
  check(`${paper.id} getReadingSection 能取到`, !!getReadingSection(p, "r-b"));
  check(`${paper.id} Q55 答案正确`,
    p.questions.find((q) => q.n === 55)?.answer === OFFICIAL_KEYS[paper.id][55]);
  const dupIds = new Set<string>();
  let dup = false;
  for (const u of p.listeningUnits) for (const s of u.transcript) {
    if (dupIds.has(s.id)) dup = true;
    dupIds.add(s.id);
  }
  check(`${paper.id} 原文句 id 唯一`, !dup, `共 ${dupIds.size} 句`);
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
