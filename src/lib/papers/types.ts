/**
 * 真题数据模型
 *
 * 设计原则：
 * 1. 只承载"确实存在"的内容。任何一段原文、答案、解析都必须在数据里有出处标记。
 * 2. 时间戳只允许来自真实音频分析（见 2025-12-set1 的 timingProvenance），
 *    没有经过验证的逐句时间戳一律为 null，UI 必须据此降级，不得编造。
 */

export type OptionKey = "A" | "B" | "C" | "D";

/**
 * 答案字母。选词填空的词库到 O，长篇阅读的段落标签到 P，
 * 所以答案域比普通四选一宽。
 */
export type AnswerKey =
  | OptionKey
  | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P";

export interface Choice {
  key: AnswerKey;
  /** 英文选项原文（真题卷面） */
  en?: string;
  /** 中文选项译文（解析册） */
  zh?: string;
}

export type PaperPart = "writing" | "listening" | "reading" | "translation";

export interface Question {
  /** 卷面题号，如 1 / 26 / 46 */
  n: number;
  /** 所属题组 unit id（听力）或 section id（阅读） */
  unitId: string;
  /** 题干（英文） */
  stem: string;
  /** 题干中文（解析册给出时才有） */
  stemZh?: string;
  options?: Choice[];
  answer: AnswerKey;
  /** 解析册给出的定位线索 */
  locate?: string;
  /** 解析册给出的解析 */
  explain: string;
  /** 原文依据句（来自解析册引文） */
  evidence?: string;
}

/** 听力原文的一个句级片段。start/end 未经音频对齐时为 null。 */
export interface TranscriptSentence {
  id: string;
  speaker?: "M" | "W" | "N";
  en: string;
  /** 该句之前/之内出现的题号标记，来自解析册原文的 [n] */
  marks?: number[];
  startSec?: number | null;
  endSec?: number | null;
}

export interface ListeningUnit {
  id: string;
  /** "Conversation One" / "Passage Two" / "Recording Three" */
  label: string;
  labelZh: string;
  questionRange: [number, number];
  /**
   * 本单元的原文/对话在音频里的位置（真实检测值）。
   * 到 endSec 为止只包含原文、题号提示和第一题的题干 —— 不含后面的题干。
   */
  window: { startSec: number; endSec: number };
  /**
   * 剩余题目的英文题干播报区间（含每题之间的答题停顿）（真实检测值）。
   *
   * 音频里每段单元的真实构成是：
   *   原文/对话 → "Questions N to M are based on …" → 各题英文题干 + 每题约 13.5s 的答题停顿
   * 所以一段单元的完整可播区间是 window.startSec → stemsWindow.endSec，
   * 只放到 window.endSec 的话每段就只播到第一题就停。
   */
  stemsWindow?: {
    startSec: number;
    endSec: number;
    /** 在这段里被读出来的题号（第一题的题干在 window 末尾，不在这里面） */
    questions: number[];
  };
  transcript: TranscriptSentence[];
  /** 单元内出现的生词/短语标注（来自解析册） */
  notes?: VocabNote[];
}

export interface VocabNote {
  en: string;
  zh: string;
  /** pos 等词性标注 */
  pos?: string;
}

export interface ReadingSection {
  id: string;
  label: string;
  labelZh: string;
  /** A = 选词填空 / B = 长篇阅读 / C1|C2 = 仔细阅读 */
  kind: "bank" | "matching" | "detail";
  questionRange: [number, number];
  /** 原文段落。A/B 类用带 label 的段落，C 类用整篇 */
  paragraphs?: { label: string; en: string; zh?: string }[];
  /** 选词填空的词库 */
  bank?: { key: AnswerKey; word: string; pos?: string; zh?: string }[];
  /** 解析册给出的全文译文（按段落） */
  translation?: { label: string; zh: string }[];
  notes?: VocabNote[];
}

export interface WritingTask {
  prompt: string;
  /** 要求字数 */
  minWords: number;
  maxWords: number;
  /** 解析册「审题」 */
  brief: string;
  /** 解析册「参考范文」 */
  sampleEssay: string;
  /** 解析册「范文译文」 */
  sampleTranslation?: string;
  /** 解析册「点评」分条 */
  comments?: string[];
  /** 全文用词/句式标注 */
  notes?: VocabNote[];
}

export interface TranslationTask {
  zh: string;
  /** 解析册「参考译文」 */
  reference: string;
  /** 解析册「译点精析」分条 */
  points?: string[];
  notes?: VocabNote[];
}

export interface PaperTimingProvenance {
  /** 音频文件相对 public 的路径 */
  audioPath: string;
  /** 音频总时长 */
  durationSec: number;
  /** 单元窗口是怎么来的 */
  method: string;
  /** 逐句时间戳是否经过验证 */
  sentenceLevelVerified: boolean;
  /** 未验证时的说明，UI 必须展示 */
  note?: string;
}

export interface Paper {
  id: string;
  /** "2025.12 第一套" */
  title: string;
  titleEn: string;
  /** ISO 日期 2025-12-19 */
  examDate: string;
  /** 场次序号：1 */
  setNumber: number;
  timing?: PaperTimingProvenance;
  listeningUnits: ListeningUnit[];
  readingSections: ReadingSection[];
  questions: Question[];
  writing?: WritingTask;
  translation?: TranslationTask;
  /** 全卷自检统计，运行时校验 */
  stats: {
    listening: number;
    reading: number;
    writing: number;
    translation: number;
  };
}
