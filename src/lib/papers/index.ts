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

/**
 * 2025.12 第一套
 *
 * 音频窗口来自对用户提供的 MP3 的静音分析（scripts/build-paper-timing 思路）：
 * 六级的答题/听写停顿稳定在 13.3–13.7 秒，全卷检出 7 组，组数分别为 4/4/3/4/3/3/4，
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
      "静音能量分析：20ms 帧 RMS，-46 dBFS 为静音阈值，桥接 0.3s 以下间隙；识别出 7 组 13.3–13.7s 的听写停顿（4/4/3/4/3/3/4 段 = 25 题），与卷面题量一致，停顿起点即单元终点。",
    sentenceLevelVerified: false,
    note: "单元级音频窗口为实测值；逐句时间戳尚未强制对齐，本套暂不提供逐句切片播放。",
  },
  listeningUnits: LISTENING_UNITS,
  readingSections: READING_SECTIONS,
  questions: [...LISTENING_QUESTIONS, ...READING_QUESTIONS],
  writing: WRITING,
  translation: TRANSLATION,
  stats: { listening: 25, reading: 30, writing: 1, translation: 1 },
};

export const PAPERS: Paper[] = [PAPER_2025_12_SET_1];

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
