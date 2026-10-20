import type { ListeningUnit, Paper, Question, ReadingSection } from "./types";
import {
  LISTENING_QUESTIONS,
  LISTENING_UNITS,
} from "./2025-12-set1.listening";
import {
  READING_QUESTIONS,
  READING_SECTIONS,
} from "./2025-12-set1.reading";
import { TRANSLATION, WRITING } from "./2025-12-set1.writing";
import {
  LISTENING_QUESTIONS as LQ_2406_SET1,
  LISTENING_UNITS as LU_2406_SET1,
} from "./2024-06-set1.listening";
import {
  READING_QUESTIONS as RQ_2406_SET1,
  READING_SECTIONS as RS_2406_SET1,
} from "./2024-06-set1.reading";
import {
  TRANSLATION as T_2406_SET1,
  WRITING as W_2406_SET1,
} from "./2024-06-set1.writing";
import {
  LISTENING_QUESTIONS as LQ_2406_SET2,
  LISTENING_UNITS as LU_2406_SET2,
} from "./2024-06-set2.listening";
import {
  READING_QUESTIONS as RQ_2406_SET2,
  READING_SECTIONS as RS_2406_SET2,
} from "./2024-06-set2.reading";
import {
  TRANSLATION as T_2406_SET2,
  WRITING as W_2406_SET2,
} from "./2024-06-set2.writing";
import {
  READING_QUESTIONS as RQ_2406_SET3,
  READING_SECTIONS as RS_2406_SET3,
} from "./2024-06-set3.reading";
import {
  TRANSLATION as T_2406_SET3,
  WRITING as W_2406_SET3,
} from "./2024-06-set3.writing";

/**
 * 2025.12 第一套
 *
 * 音频窗口来自对用户提供的 MP3 的静音分析（scripts/build-paper-timing 思路）：
 * 六级的答题停顿稳定在 13.3–13.7 秒，全卷检出 7 组，组数分别为 4/4/3/4/3/3/4，
 * 合计 25 题，与卷面 25 道听力题一一对应 —— 这构成了单元边界可信的交叉验证。
 * 因此下列 window 是真实检测值。
 *
 * 逐句时间戳尚未经过强制对齐验证，transcript 句子不携带 start/end，
 * UI 不得显示逐句切片播放。
 */
const PAPER_2025_12_SET_1: Paper = {
  id: "2025-12-set1",
  title: "2025 年 12 月 · 第一套",
  titleEn: "CET-6 · Dec 2025 · Paper One",
  examDate: "2025-12-19",
  setNumber: 1,
  timing: {
    audioPath: "/audio/cet6-2025-12-set1-listening.mp3",
    durationSec: 1546.24,
    method:
      "静音能量分析：20ms 帧 RMS，-46 dBFS 为静音阈值，桥接 0.3s 以下间隙；识别出 7 组 13.3–13.7s 的答题停顿（4/4/3/4/3/3/4 段 = 25 题），与卷面题量一致。逐段转写核对确认：每段单元在音频里的构成是 原文/对话 → “Questions N to M are based on …” → 各题英文题干 + 每题之间的答题停顿，因此单元的完整可播区间一直盖到最后一个题号的停顿结束。",
    sentenceLevelVerified: false,
    note: "单元级音频窗口为实测值；逐句时间戳尚未强制对齐，本套暂不提供逐句切片播放。",
  },
  listeningUnits: LISTENING_UNITS,
  readingSections: READING_SECTIONS,
  questions: [...LISTENING_QUESTIONS, ...READING_QUESTIONS],
  writing: WRITING,
  translation: TRANSLATION,
  sources: {
    paper: "《2025年12月英语六级真题第1套》PDF（用户提供）",
    answer: "《2025年12月英语六级解析第1套》PDF（用户提供）",
    explain: "《2025年12月英语六级解析第1套》PDF（用户提供）",
    transcript: "《2025年12月英语六级解析第1套》PDF（用户提供）",
    evidenceVerbatim: false,
  },
  stats: { listening: 25, reading: 30, writing: 1, translation: 1 },
};

/**
 * 2024.06 三套
 *
 * 卷面、选项、阅读原文、写作题面、翻译原文来自三份真题 PDF；
 * 答案、参考范文、参考译文来自三份「答案速查」PDF。
 *
 * 这三套没有解析册：逐题解析与原文依据句由本项目依据真题原文撰写，
 * 依据句逐字取自原文（scripts/build-2024-06-papers.py 生成前逐条校验过）。
 *
 * 听力窗口来自对用户提供的 MP3 的静音分析：答题停顿稳定在 13.2–14.7 秒，
 * 全卷检出 25 个，分组 4/4/3/4/3/3/4，与卷面「1-4 / 5-8 / 9-11 / 12-15 /
 * 16-18 / 19-21 / 22-25」一一对应。
 *
 * 官方第三套真题不提供听力：卷面写着「由于多题多卷，官方第三套真题的听力试题
 * 与第二套真题的一致，只是选项顺序不同，因此，本套试卷不再提供听力部分」。
 * 所以第三套只有阅读、写作、翻译，不硬造一套听力出来。
 */
const PAPER_2024_06_SET_1: Paper = {
  id: "2024-06-set1",
  title: "2024 年 06 月 · 第一套",
  titleEn: "CET-6 · Jun 2024 · Paper One",
  examDate: "2024-06-15",
  setNumber: 1,
  sources: {
    paper: "《2024年06月大学英语六级考试真题（第1套）》PDF（用户提供）",
    answer: "《2024年06月六级考试真题答案速查（第1套）》PDF（用户提供）",
    explain: "本套没有解析册；逐题解析与原文依据句由本项目依据真题原文撰写",
    transcript: "《2024年6月六级真题（第1套）》录音的机器转写（listen_audio）",
    evidenceVerbatim: true,
  },
  timing: {
    audioPath: "/audio/cet6-2024-06-set1-listening.mp3",
    durationSec: 1650.78,
    method:
      "静音能量分析：20ms 帧 RMS，-46 dBFS 为静音阈值，桥接 0.3s 以下间隙；识别出 25 个 13.3–14.7s 的答题停顿，分组 4/4/3/4/3/3/4，与卷面「1-4 / 5-8 / 9-11 / 12-15 / 16-18 / 19-21 / 22-25」一一对应。逐段转写核对确认：每段单元的构成是 原文/对话 → “Questions N to M are based on …” → 各题英文题干 + 每题之间的答题停顿，因此单元的完整可播区间一直盖到最后一个题号的停顿结束。",
    sentenceLevelVerified: false,
    note: "单元级音频窗口为实测值；逐句时间戳尚未强制对齐，本套暂不提供逐句切片播放。原始录音是 32 kHz / 96 kbps 的 MP3，Chrome 播不动，已按 44.1 kHz / 128 kbps 重新编码（scripts/encode-listening-mp3.py），窗口时间点一个没动。",
  },
  listeningUnits: LU_2406_SET1,
  readingSections: RS_2406_SET1,
  questions: [...LQ_2406_SET1, ...RQ_2406_SET1],
  writing: W_2406_SET1,
  translation: T_2406_SET1,
  stats: { listening: 25, reading: 30, writing: 1, translation: 1 },
};

const PAPER_2024_06_SET_2: Paper = {
  id: "2024-06-set2",
  title: "2024 年 06 月 · 第二套",
  titleEn: "CET-6 · Jun 2024 · Paper Two",
  examDate: "2024-06-15",
  setNumber: 2,
  sources: {
    paper: "《2024年06月大学英语六级考试真题（第2套）》PDF（用户提供）",
    answer: "《2024年06月六级考试真题答案速查（第2套）》PDF（用户提供）",
    explain: "本套没有解析册；逐题解析与原文依据句由本项目依据真题原文撰写",
    transcript: "《2024年6月六级真题（第2套）》录音的机器转写（listen_audio）",
    evidenceVerbatim: true,
  },
  timing: {
    audioPath: "/audio/cet6-2024-06-set2-listening.mp3",
    durationSec: 1562.75,
    method:
      "静音能量分析：20ms 帧 RMS，-46 dBFS 为静音阈值，桥接 0.3s 以下间隙；识别出 25 个 13.2–13.8s 的答题停顿，分组 4/4/3/4/3/3/4，与卷面「1-4 / 5-8 / 9-11 / 12-15 / 16-18 / 19-21 / 22-25」一一对应。逐段转写核对确认：每段单元的构成是 原文/对话 → “Questions N to M are based on …” → 各题英文题干 + 每题之间的答题停顿，因此单元的完整可播区间一直盖到最后一个题号的停顿结束。",
    sentenceLevelVerified: false,
    note: "单元级音频窗口为实测值；逐句时间戳尚未强制对齐，本套暂不提供逐句切片播放。原始录音是 32 kHz / 96 kbps 的 MP3，Chrome 播不动，已按 44.1 kHz / 128 kbps 重新编码（scripts/encode-listening-mp3.py），窗口时间点一个没动。",
  },
  listeningUnits: LU_2406_SET2,
  readingSections: RS_2406_SET2,
  questions: [...LQ_2406_SET2, ...RQ_2406_SET2],
  writing: W_2406_SET2,
  translation: T_2406_SET2,
  stats: { listening: 25, reading: 30, writing: 1, translation: 1 },
};

const PAPER_2024_06_SET_3: Paper = {
  id: "2024-06-set3",
  title: "2024 年 06 月 · 第三套",
  titleEn: "CET-6 · Jun 2024 · Paper Three",
  examDate: "2024-06-15",
  setNumber: 3,
  sources: {
    paper: "《2024年06月大学英语六级考试真题（第3套）》PDF（用户提供）",
    answer: "《2024年06月六级考试真题答案速查（第3套）》PDF（用户提供）",
    explain: "本套没有解析册；逐题解析与原文依据句由本项目依据真题原文撰写",
    evidenceVerbatim: true,
  },
  listeningUnits: [],
  readingSections: RS_2406_SET3,
  questions: [...RQ_2406_SET3],
  writing: W_2406_SET3,
  translation: T_2406_SET3,
  stats: { listening: 0, reading: 30, writing: 1, translation: 1 },
};

export const PAPERS: Paper[] = [
  PAPER_2025_12_SET_1,
  PAPER_2024_06_SET_1,
  PAPER_2024_06_SET_2,
  PAPER_2024_06_SET_3,
];

export function getPaper(id: string): Paper | undefined {
  return PAPERS.find((p) => p.id === id);
}

export function getQuestions(paper: Paper, unitId: string): Question[] {
  return paper.questions.filter((q) => q.unitId === unitId);
}

export function getQuestion(paper: Paper, n: number): Question | undefined {
  return paper.questions.find((q) => q.n === n);
}

export function getListeningUnit(paper: Paper, unitId: string): ListeningUnit | undefined {
  return paper.listeningUnits.find((u) => u.id === unitId);
}

export function getReadingSection(paper: Paper, sectionId: string): ReadingSection | undefined {
  return paper.readingSections.find((s) => s.id === sectionId);
}

/**
 * 阅读题段的英文标题：只按题型给，不另抄一份题名。
 *
 * 卷面本来就只印 "Section A" / "Section C · Passage One"，
 * 中文那份「选词填空 · 40 岁后开始运动还来得及吗」是整理时加的说明，
 * 当标题反而把题目讲没了 —— 标题就应该是题型本身。
 */
const READING_KIND_TITLE: Record<ReadingSection["kind"], string> = {
  bank: "Banked Cloze",
  matching: "Matching",
  detail: "Reading Comprehension",
};

export function readingKindTitle(kind: ReadingSection["kind"]): string {
  return READING_KIND_TITLE[kind];
}

/** 长篇阅读/选词填空的作答选项由 section 结构生成，不在每道题里重复存一份 */
export type ParagraphLabel =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H"
  | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P";

export function matchingOptionKeys(section: ReadingSection): ParagraphLabel[] {
  if (section.kind !== "matching" || !section.paragraphs) return [];
  return section.paragraphs.map((p) => p.label as ParagraphLabel);
}

/** 某道听力题在原文中的定位句（解析册用 [n] 标注，真实存在） */
export function locateSentences(unit: ListeningUnit, questionNo: number): string[] {
  return unit.transcript.filter((s) => s.marks?.includes(questionNo)).map((s) => s.en);
}

/**
 * 一个听力单元的完整可播区间。
 *
 * 音频里每段单元的真实构成是：
 *   原文/对话 → "Questions N to M are based on …" → 各题的英文题干 + 每题约 13.5s 的答题停顿
 * 只放到原文结束（window.endSec）的话，每段就只播到第一题就停，
 * 后面几题的题干没人播 —— 而做题界面按考场规矩又不显示题干。
 * 所以完整区间必须一直盖到最后一个题号的停顿结束。
 */
export function unitAudioRange(unit: ListeningUnit): { startSec: number; endSec: number } {
  return {
    startSec: unit.window.startSec,
    endSec: unit.stemsWindow?.endSec ?? unit.window.endSec,
  };
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * 某个题号的真题页面地址。
 * 从题库里按题号反查所属题段，不猜 —— 猜出来的链接会跳到错的段落。
 */
export function questionHref(paperId: string, questionNo: number): string {
  const paper = getPaper(paperId);
  const q = paper?.questions.find((item) => item.n === questionNo);
  if (!paper || !q) return `/papers/${paperId}`;

  if (paper.writing && questionNo === 0) return `/papers/${paperId}/writing`;

  const isListening = paper.listeningUnits.some((u) => u.id === q.unitId);
  if (isListening) return `/papers/${paperId}/listening/${q.unitId}`;
  if (paper.readingSections.some((s) => s.id === q.unitId)) {
    return `/papers/${paperId}/reading/${q.unitId}`;
  }
  return `/papers/${paperId}`;
}

/** 某句听力原文所在的题段地址。 */
export function sentenceHref(paperId: string, sentenceId: string): string {
  const paper = getPaper(paperId);
  const unit = paper?.listeningUnits.find((u) =>
    u.transcript.some((s) => s.id === sentenceId),
  );
  if (!unit) return `/papers/${paperId}`;
  return `/papers/${paperId}/listening/${unit.id}`;
}

export * from "./types";
