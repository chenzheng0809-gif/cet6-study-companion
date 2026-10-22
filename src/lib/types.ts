/** Domain types. Kept free of any storage import so logic stays testable. */

import type { DateKey } from "./date";

export type { DateKey };

export type TargetScorePreset = 425 | 500 | 550 | "custom";
export type Cet6History = "none" | "taken";
export type ThemeMode = "light" | "dark" | "system";

/** 单词朗读口音。这本词库标的是英式音标，但六级听力录音以美音为主，默认跟听力走。 */
export type SpeechAccent = "en-GB" | "en-US";

/**
 * Profile 只收四类事实：四级成绩、六级历史、目标分、考试场次，外加可选的自评薄弱项。
 *
 * 这里**没有**「每周可投入时间」和「学习档位」—— 填一个时间预算，
 * 系统就等于给学生派了一个必须兑现的债，没做到就会有压力。
 * 现在改成：系统给建议，做多少、做多久都是学生自己的事。
 *
 * `weakAreas` 是学生自己说的，是依据不是事实，只用来给推荐微调权重。
 */
export interface Profile {
  id: "me";
  nickname: string;
  major: string;
  cet4Score: number | null;
  cet6History: Cet6History;
  cet6PastScore: number | null;
  targetScore: number;
  targetPreset: TargetScorePreset;
  /** 考试场次（上半年 / 下半年），决定备考窗口有多长 */
  examSessionId: string;
  examDate: DateKey;
  /** 自评薄弱项，可留空 */
  weakAreas: string[];
  createdAt: number;
  updatedAt: number;
}

export type TaskType =
  | "vocab"
  | "intensive-listen"
  | "listening-paper"
  | "reading-paper"
  | "translation"
  | "writing"
  | "sentence"
  | "review"
  | "skill-card"
  | "custom";

/**
 * 本周推荐的一组目标。
 *
 * **不绑定任何日期。** 一周有七天，人不是每天都能学、系统也不该假装能算准哪天有空。
 * 所以 WeeklyPlan 只说「这一周建议做这几件事」，什么时候做、做几件，由学生自己决定。
 *
 * 周末自然归档：没做完的直接带走，不追责、不结转、不显示「未完成 N 项」。
 */
export interface WeeklyPlan {
  id: string;
  /** 该周周一 */
  weekStart: DateKey;
  /** 生成时所处的阶段，来自 Study Journey */
  stageId: string;
  stageName: string;
  /** 一句话说明：这份推荐是根据什么来的 */
  rationale: string;
  goals: WeeklyGoalItem[];
  /** 学生是否确认过；false 表示系统刚推出来还没人看过 */
  accepted: boolean;
  archived: boolean;
  createdAt: number;
}

/** 一项具体建议。 */
export interface WeeklyGoalItem {
  id: string;
  title: string;
  type: TaskType;
  detail: string;
  /** 训练量（模块）。只用于内部计数，UI 不换算成时间 */
  units: number;
  /** 真题类指向真实题段 id */
  paperId?: string;
  paperUnitId?: string;
  examPart?: string;
  /**
   * **推荐依据**，一句人话。
   * 「距考 47 天 · 听力练了 2 段，这一阶段建议 7 段」
   *
   * 这条是硬要求：推不出来依据的东西就不该推。
   */
  basis: string;
  done: boolean;
  completedAt?: number;
  source: "system" | "student";
  /** 组内顺序。不参与任何"哪天该做"的语义，只是列表的展示次序。 */
  sortKey?: number;
}

/** 计划调整记录，只追加不改写。 */
export interface PlanChange {
  id: string;
  scope: "accept" | "adjust" | "ignore" | "complete" | "offsite";
  summary: string;
  details: string[];
  createdAt: number;
}

/**
 * 学习记录 —— **整个 App 唯一的「我做了 X」**。
 *
 * Today's Focus、Daily Habits、Practice 自主练习、每周推荐目标、站外补录，
 * 全部写进这一张表。这样日历、连续天数、周报只有一份真相，
 * 不会出现「自主练习做了但统计没算」的重复计数。
 */
export type LogSource =
  /** 来自首页的 Today's Focus */
  | "focus"
  /** 来自 Daily Habits（单词 / 精听） */
  | "habit"
  /** 来自 Practice 自主练习入口 */
  | "practice"
  /** 来自每周推荐目标里的一项 */
  | "weekly-goal"
  /** 学生自己补录的站外学习 */
  | "offsite";

export interface StudyLog {
  id: string;
  date: DateKey;
  /** 记的是模块数，不是分钟 */
  units: number;
  title: string;
  detail?: string;
  source: LogSource;
  /** 从周目标里来时，指回那一项 */
  goalItemId?: string;
  paperId?: string;
  paperUnitId?: string;
  examPart?: string;
  type?: TaskType;
  createdAt: number;
}

export interface Settings {
  id: "app";
  theme: ThemeMode;
  remindersEnabled: boolean;
  reminderTime: string;
  /** 主动暂停：暂停期间不新增任务欠账 */
  paused: boolean;
  /**
   * 单词朗读口音：默认跟六级听力录音走（美音），
   * 词库标的是英式音标，想跟音标对上可以切成英音。
   */
  speechAccent?: SpeechAccent;
  onboarded: boolean;
  updatedAt: number;
}

/** 真题作答记录：一套卷一份，逐题保存用户真实选择与用时 */
export interface PaperAttempt {
  id: string;
  paperId: string;
  /** 题号 -> 用户选择的字母 */
  answers: Record<number, string>;
  /** 题号 -> 该题实际用时（秒） */
  seconds: Record<number, number>;
  /** 已点开过解析的题号 */
  revealed: number[];
  /** 已完成的模块 id（听力单元 / 阅读题段 / 写作 / 翻译） */
  finishedUnits: string[];
  /** 学生自己写的草稿：key 为 "writing" | "translation" */
  drafts: Record<string, string>;
  /**
   * 学生自己标的词性：选词填空做题时，key 是词库字母（A–O），
   * value 是学生自己判定的词性（n. / v. / adj. / adv.）。
   *
   * 这是**学生自己写的**，不是答案键里的词性 —— 做题时界面上不给现成词性，
   * 交卷后拿它跟解析册的词性对一下，才知道自己标对没有。
   */
  posMarks: Record<string, string>;
  /**
   * 每个 Part 一份考场计时，跨题段共享。
   * key = "listening" | "reading" | "writing" | "translation"
   * limitSec 来自试卷 Directions 的官方时长；elapsedSec 是交卷时真实用掉的秒数。
   */
  sessions: Record<
    string,
    {
      part: string;
      limitSec: number;
      startedAt: number;
      submittedAt?: number;
      elapsedSec?: number;
    }
  >;
  updatedAt: number;
}

/**
 * 学生自己攒的生词。
 *
 * 词条来源必须是真实做过的题目 —— 听力原文句、题干、选项、阅读原文。
 * `sourceRef` 记下它是从哪一套卷的哪一题来的，这样复习时能一键跳回原处，
 * 而不是只留一个孤零零的单词。
 */
export interface VocabEntry {
  id: string;
  /** 用户自己录的词形（保留原始大小写与连字符） */
  word: string;
  /** 自己补的中文释义，可留空 */
  meaning?: string;
  /** 自己的例句或记忆备注，可留空 */
  note?: string;
  /**
   * 来源是真题还是核心词库。旧记录没有这个字段，读侧一律归一成 "paper"。
   * 词库来源没有题号也没有句子 id，出处只作展示，**不可点**。
   */
  sourceKind: VocabSourceKind;
  sourcePaperId: string;
  /** 来源题目在卷面上的题号；来自原文句子或词库时为 undefined */
  sourceQuestionNo?: number;
  /** 来源句子 id（听力原文） */
  sourceSentenceId?: string;
  sourceLabel: string;
  createdAt: number;
  /** 复习轮次，每复习一次 +1 */
  reviewCount: number;
  lastReviewedAt?: number;
}

export type VocabSourceKind = "paper" | "wordbook";

export interface BackupFile {
  app: "cet6-study-companion";
  version: 5;
  exportedAt: string;
  profile: Profile | null;
  /** 当前周的推荐目标 */
  weeklyPlans: WeeklyPlan[];
  /** 全部学习记录 */
  logs: StudyLog[];
  settings: Settings | null;
  paperAttempts: PaperAttempt[];
  vocab: VocabEntry[];
  changes?: PlanChange[];
}
