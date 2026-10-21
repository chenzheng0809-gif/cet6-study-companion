/**
 * Study Journey —— 备考路线的阶段划分与推荐引擎。
 *
 * 这里最要紧的一条是**依据**。推荐不能是拍脑袋排出来的清单，
 * 所以每一项建议都必须能指回一个具体事实，三种事实按可信度排：
 *
 *   1. 距考试还有多少天  —— 唯一完全客观的变量，来自 profile 里的考试日期
 *   2. 真实练习覆盖度    —— 系统自己记的：哪套真题的哪几段做过、单词过了多少
 *   3. 学生自评薄弱项    —— 学生说的，是依据不是事实，只用来微调、不用来定阶段
 *
 * 学生自报的成绩（四级分 / 六级历史 / 目标分）**不参与任何分层**。
 * 它既不能换算出当前水平，也不允许被折算成六级预测分 ——
 * 四级 550 分并不意味着六级 500 分，这件事没有可靠依据。
 *
 * 推荐结果永远只是建议：学生可以整组接受、改数量、换内容，或者整组忽略。
 */

import { addDays, todayKey, type DateKey } from "./date";
import {
  getListeningUnit,
  getPaper,
  getReadingSection,
  PAPERS,
  readingKindTitle,
} from "./papers";
import type { Paper } from "./papers/types";
import type { Profile, TaskType, WeeklyGoalItem } from "./types";

/* ------------------------------------------------------------------ 薄弱项 */

export type WeakArea =
  | "listening"
  | "reading"
  | "writing"
  | "translation"
  | "vocabulary"
  | "speed";

export const WEAK_AREAS: { value: WeakArea; label: string; hint: string }[] = [
  { value: "listening", label: "听力", hint: "听不懂、抓不住关键信息" },
  { value: "reading", label: "阅读", hint: "读得慢或选错" },
  { value: "writing", label: "写作", hint: "写不出、写完没话说" },
  { value: "translation", label: "翻译", hint: "中国式英语、表达不地道" },
  { value: "vocabulary", label: "词汇", hint: "单词记不住" },
  { value: "speed", label: "速度", hint: "来不及做完" },
];

export const WEAK_AREA_LABEL: Record<WeakArea, string> = Object.fromEntries(
  WEAK_AREAS.map((w) => [w.value, w.label]),
) as Record<WeakArea, string>;

/* ------------------------------------------------------------------ 阶段 */

export interface JourneyStage {
  id: StageId;
  name: string;
  en: string;
  /** 距考天数区间，左闭右开；Infinity 表示「还没定考期」 */
  from: number;
  to: number;
  /** 这个阶段在做什么 —— 写给用户看，不是内部代号 */
  intent: string;
}

export type StageId = "explore" | "foundation" | "papers" | "sprint" | "final";

/**
 * 阶段只按「距考天数」划分。
 *
 * 刻意不给每个阶段规定训练内容 —— 训练内容由覆盖度和薄弱项决定，
 * 阶段只决定**节奏**：还有 100 天和还有 10 天，应该做的量根本不是一回事。
 */
export const STAGES: JourneyStage[] = [
  {
    id: "explore",
    name: "还没定考期",
    en: "GETTING ORIENTED",
    from: Infinity,
    to: Infinity,
    intent: "先不定日程。你想练什么就练什么，熟悉一下这里都有什么。",
  },
  {
    id: "foundation",
    name: "打底期",
    en: "FOUNDATION",
    from: 61,
    to: Infinity,
    intent: "离考试还早。这一段的目标是习惯和题型认知 —— 每天碰一点真题，把它拆开看。",
  },
  {
    id: "papers",
    name: "真题期",
    en: "PAPER PHASE",
    from: 31,
    to: 61,
    intent: "以成套真题为主。练的不只是题，还有一整套的节奏和顺序。",
  },
  {
    id: "sprint",
    name: "冲刺期",
    en: "SPRINT",
    from: 8,
    to: 31,
    intent: "查漏为主。反复回看做错的地方，把不熟的补熟。",
  },
  {
    id: "final",
    name: "考前一周",
    en: "FINAL WEEK",
    from: 0,
    to: 8,
    intent: "不再开新题。保温 —— 保持手感，把状态调到考试那天。",
  },
];

export function stageFor(daysToExam: number | null): JourneyStage {
  if (daysToExam === null) return STAGES[0];
  for (const stage of STAGES) {
    if (daysToExam >= stage.from && daysToExam < stage.to) return stage;
  }
  return STAGES[STAGES.length - 1];
}

export function daysUntilExam(examDate: DateKey, from: DateKey = todayKey()): number | null {
  const ms = new Date(`${examDate}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime();
  if (!Number.isFinite(ms)) return null;
  return Math.round(ms / 86400000);
}

/* -------------------------------------------------------------- 覆盖度 */

/** 真题里四个部分，现在练到哪儿了。全部来自真实记录。 */
export interface PracticeCoverage {
  /** 已交卷并做完题段的题段 id 集合 */
  finishedUnits: string[];
  /**
   * 各套卷子分别做完的题段。
   *
   * 必须按卷分开记：不同卷的题段 id 会重名（每套的对话都叫 `l-c1`），
   * 只看一个扁平的 id 集合，「这套练过了」就会被误当成「每套都练过了」，
   * 推荐也就永远不会换到下一套卷子。
   */
  finishedUnitsByPaper: Record<string, string[]>;
  /** 已完成的写作次数 */
  writings: number;
  /** 已完成的翻译次数 */
  translations: number;
  /** 累计背过的词条数（来自词库 / 生词本的真实计数） */
  vocabTouched: number;
  /** 站外记录条数 */
  offsiteLogs: number;
}

export interface AreaCoverage {
  area: WeakArea;
  done: number;
  /** 建议这一段至少要有的量 —— 依据来自阶段，不是随机 */
  suggested: number;
  ratio: number;
}

/**
 * 四个考试板块各自「练了多少 / 这一段该练多少」。
 *
 * `suggested` 按阶段给出，不按学生自评 —— 自评只用来加权重，不用来定标准。
 */
export function areaCoverage(coverage: PracticeCoverage, stage: JourneyStage): AreaCoverage[] {
  const has = (prefix: string) => coverage.finishedUnits.filter((u) => u.startsWith(prefix)).length;

  const targets: Record<StageId, { l: number; r: number; w: number; t: number }> = {
    explore: { l: 0, r: 0, w: 0, t: 0 },
    /* 打底期现在独占 61 天以上的整段准备期，所以沿用原来建构期的量 */
    foundation: { l: 7, r: 7, w: 2, t: 2 },
    papers: { l: 10, r: 10, w: 3, t: 3 },
    sprint: { l: 14, r: 14, w: 5, t: 4 },
    final: { l: 14, r: 14, w: 6, t: 5 },
  };
  const t = targets[stage.id];

  const mk = (area: WeakArea, done: number, suggested: number): AreaCoverage => ({
    area,
    done,
    suggested,
    ratio: suggested === 0 ? 1 : Math.min(1, done / suggested),
  });

  return [
    mk("listening", has("l-"), t.l),
    mk("reading", has("r-"), t.r),
    mk("writing", coverage.writings, t.w),
    mk("translation", coverage.translations, t.t),
  ];
}

/* -------------------------------------------------------------- 推荐 */

/** 能对应到真题题段的四个考试板块。vocabulary / speed 没有题段，不走这条路。 */
export type PaperArea = "listening" | "reading" | "writing" | "translation";

/** 每个板块用什么量词：听力按「篇」，阅读按「段」，写作和翻译按「次」。 */
const AREA_UNIT: Record<PaperArea, string> = {
  listening: "篇",
  reading: "段",
  writing: "次",
  translation: "次",
};

/** 弱项尾巴：学生自己标的 */
const TAIL_SELF = "你标记为弱项。";
/** 弱项尾巴：系统看出来的 */
const TAIL_THIN = "此项较为薄弱。";

/**
 * 一条建议的「依据」长什么样。
 *
 * 句式固定成三段，三种事实按可信度从前往后排：
 *
 *   「距考 61 天，已练 0 篇。结合剩余备考时间，建议本周练习 7 篇。」
 *
 * 建议量是**这一阶段该练的量减去已经练过的量**：
 * 还没练过是 7 篇，已经练了 3 篇就只剩 4 篇 —— 练过的不能算进建议里。
 *
 * 尾巴最多一条，不叠加：学生自己标过的写「你标记为弱项」，
 * 系统看出来的写「此项较为薄弱。」
 */
function basisFor(input: {
  days: number | null;
  done: number;
  suggested: number;
  unit: string;
  tail?: string;
}): string {
  const { days, done, suggested, unit } = input;
  const tail = input.tail ?? "";
  if (days === null) {
    return `还没定考期，暂不安排量。已练 ${done} ${unit}，想练就练。${tail}`;
  }
  const remaining = suggested - done;
  if (remaining <= 0) {
    return `距考 ${days} 天，已练 ${done} ${unit}。这一阶段建议的 ${suggested} ${unit}已经练够了，想练就多练。${tail}`;
  }
  return `距考 ${days} 天，已练 ${done} ${unit}。结合剩余备考时间，建议本周练习 ${remaining} ${unit}。${tail}`;
}

/** 词汇条的依据。词汇不按「篇 / 段 / 次」计，只说过没过、看了多少。 */
function vocabBasis(days: number | null, touched: number): string {
  if (days === null) {
    return touched > 0
      ? `还没定考期，暂不安排量。已看过 ${touched} 个词条，想翻就翻。`
      : "还没定考期，暂不安排量。词汇想翻就翻。";
  }
  const head =
    touched > 0 ? `距考 ${days} 天，已看过 ${touched} 个词条。` : `距考 ${days} 天，词汇尚未开始。`;
  return `${head}结合剩余备考时间，建议过完一轮核心词汇。`;
}

/** 目标项属于哪一块：examPart 是考试板块，vocab 单独算。 */
function goalArea(item: { type: TaskType; examPart?: string }): WeakArea | "vocab" | null {
  if (item.type === "vocab") return "vocab";
  const part = item.examPart;
  if (
    part === "listening" ||
    part === "reading" ||
    part === "writing" ||
    part === "translation"
  ) {
    return part;
  }
  return null;
}

/**
 * 计划标题那句话：离考试还有多少天 · 现在是哪个阶段。
 *
 * 单独抽出来是因为它跟依据一样是**会过期的系统话术** ——
 * 存下来的计划每过一天就旧一天，打开时得按今天重算。
 */
export function planRationale(days: number | null, stage: JourneyStage): string {
  return days === null ? "还没定考期，先给你几项想练的" : `距考试 ${days} 天 · ${stage.name}`;
}

/**
 * 重算一组目标项的依据。
 *
 * 依据是系统的话，有两样东西会让它变：文案改了版，学生又练了新的题。
 * 计划是存下来的，存下来的话就容易锁死在一句旧话上 ——
 * 所以旧计划在打开时按同一套规则重算一遍，
 * 跟生成新推荐走的是同一段代码，两处不会写出两样话。
 *
 * 学生自己加的项不动（basis 写死「你自己加的」），顺序、数量、已完成标记也不动。
 */
export function recomputeBasis(
  items: WeeklyGoalItem[],
  input: RecommendInput,
  stage: JourneyStage,
): string[] {
  const days = daysUntilExam(input.profile.examDate, input.today);
  const weak = new Set(input.profile.weakAreas ?? []);
  const areas = areaCoverage(input.coverage, stage);
  const byArea = new Map(areas.map((a) => [a.area, a]));

  // 弱项尾巴：跟生成推荐时同一套规则 —— 最多一条，学生标过的优先
  const thinnest = items
    .map((g) => goalArea(g))
    .filter((a): a is PaperArea => a !== null && a !== "vocab" && !weak.has(a))
    .map((a) => byArea.get(a))
    .find((a): a is AreaCoverage => a !== undefined && a.ratio < 1);

  return items.map((g) => {
    if (g.source !== "system") return g.basis;
    const area = goalArea(g);
    if (area === "vocab") {
      return (
        vocabBasis(days, input.coverage.vocabTouched) + (weak.has("vocabulary") ? TAIL_SELF : "")
      );
    }
    if (!area || area === "vocabulary" || area === "speed") return g.basis;
    const cov = byArea.get(area);
    if (!cov) return g.basis;
    const tail = weak.has(area)
      ? TAIL_SELF
      : thinnest && thinnest.area === area
        ? TAIL_THIN
        : "";
    return basisFor({
      days,
      done: cov.done,
      suggested: cov.suggested,
      unit: AREA_UNIT[area],
      tail,
    });
  });
}

/**
 * 题段的标题直接来自真题数据本身，不另抄一份 ——
 * 抄一份就等于给了一个会漂移的副本，题段改名时推荐语不会跟着变。
 *
 * 用英文那份：题目标题一律英文，中文只留在译文和解析里。
 */
export function practiceUnitLabel(paperId: string, unitId: string | undefined): string {
  if (!unitId) return "";
  const paper = getPaper(paperId);
  if (!paper) return "";
  const unit = getListeningUnit(paper, unitId);
  if (unit) return unit.label;
  const section = getReadingSection(paper, unitId);
  return section ? readingKindTitle(section.kind) : "";
}

/* ------------------------------------------------------- 下一段该练哪套卷 */

/** 一次练习的落点：哪套卷子的哪一段。 */
export interface PracticeTarget {
  paperId: string;
  /** 听力 / 阅读是题段 id；写作 / 翻译是 "writing" / "translation" */
  unitId: string;
  /** 给学生看的一行：卷子 + 题段 */
  label: string;
}

/** 这套卷子在这个板块上有哪些可练的段落（题段 id）。没有就是没有，不编。 */
function unitsOfArea(paper: Paper, area: PaperArea): string[] {
  if (area === "listening") return paper.listeningUnits.map((u) => u.id);
  if (area === "reading") return paper.readingSections.map((s) => s.id);
  if (area === "writing") return paper.writing ? ["writing"] : [];
  if (area === "translation") return paper.translation ? ["translation"] : [];
  return [];
}

/**
 * 某个板块下一段该练什么。
 *
 * **按卷推进**：先把手上这套的该板块练完，再换下一套 ——
 * 一套卷子的听力连着做完，才接近考场里连着做一整套的节奏。
 * 卷的顺序是考试时间从新到旧（题库注册表 `PAPERS` 的顺序）。
 *
 * 落点一律来自真题数据本身：哪套卷子有这个板块、这个板块有几段，
 * 都数得出来，不在这里另抄一份。官方第三套没有听力，
 * 听力这一栏就自动跳过它，不会推荐一个不存在的段落。
 */
export function nextPracticeTarget(
  area: PaperArea,
  coverage: PracticeCoverage,
): PracticeTarget | null {
  /** 这个板块全练完的卷子：所有卷子都练完时才回来看它 */
  const exhausted: PracticeTarget[] = [];

  for (const paper of PAPERS) {
    const units = unitsOfArea(paper, area);
    if (units.length === 0) continue;
    const done = new Set(coverage.finishedUnitsByPaper[paper.id] ?? []);
    const unitId = units.find((u) => !done.has(u));
    if (unitId) {
      // 第一个还有没练过的题段的卷子 —— 这就是下一段该练的
      return { paperId: paper.id, unitId, label: practiceTargetLabel(paper, unitId) };
    }
    exhausted.push({
      paperId: paper.id,
      unitId: units[0],
      label: practiceTargetLabel(paper, units[0]),
    });
  }

  // 每个卷子这个板块都练完了：回到第一套的第一段（复习）
  return exhausted[0] ?? null;
}

/** 落点的一行字：卷子 + 题段名。卷名不能省 —— 不同卷的题段名会重名。 */
export function practiceTargetLabel(paper: Paper, unitId: string): string {
  const unit = getListeningUnit(paper, unitId);
  if (unit) return `${paper.shortEn} · ${unit.label}`;
  const section = getReadingSection(paper, unitId);
  if (section) return `${paper.shortEn} · ${readingKindTitle(section.kind)}`;
  return paper.shortEn;
}

/** 落点的那一行字。跟推荐生成时同一套写法 —— 两边不是一套规则就会写出不一样的字。 */
function targetDetail(area: PaperArea, target: PracticeTarget): string {
  if (area === "writing" || area === "translation") {
    const hint = area === "writing" ? "审题 + 写完对一遍范文" : "先自己译，再看参考译文";
    return `${target.label} · ${hint}`;
  }
  return target.label;
}

/**
 * 落点也跟着当前状态重算。
 *
 * 真题推荐是跟着卷子轮换的：这套练完换下一套。落点要是写进计划时就锁死，
 * 学生练完一段、计划还指着那一段 —— 轮换等于没做。
 * 所以跟 basis 一起重算：只动系统给的落点，学生自己加的项不动。
 */
export function recomputeTarget(
  items: Pick<WeeklyGoalItem, "type" | "examPart" | "source" | "paperId" | "paperUnitId" | "detail">[],
  coverage: PracticeCoverage,
): { paperId?: string; paperUnitId?: string; detail: string }[] {
  /** 同一个板块只算一次落点：推荐目标组里一个板块只有一项 */
  const cache = new Map<PaperArea, PracticeTarget | null>();
  const targetOf = (area: PaperArea) => {
    if (!cache.has(area)) cache.set(area, nextPracticeTarget(area, coverage));
    return cache.get(area) ?? null;
  };

  return items.map((g) => {
    const keep = { paperId: g.paperId, paperUnitId: g.paperUnitId, detail: g.detail };
    if (g.source !== "system") return keep;
    const area = goalArea(g);
    if (area === null || area === "vocab" || area === "vocabulary" || area === "speed") {
      return keep;
    }
    const target = targetOf(area as PaperArea);
    if (!target) return keep;
    return {
      paperId: target.paperId,
      paperUnitId: target.unitId,
      detail: targetDetail(area as PaperArea, target),
    };
  });
}

export interface RecommendInput {
  profile: Pick<Profile, "examDate" | "weakAreas">;
  coverage: PracticeCoverage;
  today?: DateKey;
  /** 学生上周已经接受并完成过的东西，用来避免重复推荐同一项 */
  recentlyDone?: TaskType[];
}

/**
 * 生成本周的推荐目标组。
 *
 * 三步，每一步都能说清理由：
 *   1. 覆盖度最低的考试板块先排（这是「练得不够」的事实）
 *   2. 学生自评薄弱的板块往前挪一位（这是「他自己说的」，只做微调）
 *   3. 阶段决定总量与节奏
 *
 * 返回的每一项都带 `basis` —— 一句人话，学生能看懂为什么推这个。
 */
export function recommendWeeklyGoals(input: RecommendInput): {
  stage: JourneyStage;
  rationale: string;
  goals: Omit<WeeklyGoalItem, "id" | "done">[];
} {
  const today = input.today ?? todayKey();
  const days = daysUntilExam(input.profile.examDate, today);
  const stage = stageFor(days);
  const areas = areaCoverage(input.coverage, stage);
  const weak = new Set(input.profile.weakAreas ?? []);

  /*
   * 排序依据：覆盖度低的优先；学生自评薄弱的**往前挪一位**。
   *
   * 只挪一位，不插队到最前面 —— 自评是依据不是命令，
   * 挪到第一位就等于让它替学生定了顺序，那不叫微调。
   */
  const ranked = [...areas].sort((a, b) => a.ratio - b.ratio);
  for (let i = ranked.length - 1; i >= 1; i -= 1) {
    if (!weak.has(ranked[i].area)) continue;
    const prev = ranked[i - 1];
    ranked[i - 1] = ranked[i];
    ranked[i] = prev;
    i -= 1; // 挪过的这一块别再挪第二次
  }

  const count = stage.id === "explore" ? 3 : stage.id === "final" ? 2 : 4;
  const goals: Omit<WeeklyGoalItem, "id" | "done">[] = [];

  // 能推荐真题的板块：题库里真有这个板块的段落才推
  const PAPER_AREAS: PaperArea[] = ["listening", "reading", "writing", "translation"];
  const picked = ranked.filter((a) => PAPER_AREAS.includes(a.area as PaperArea)).slice(0, count);

  /*
   * 弱项尾巴最多一条，不叠加：
   *   学生自己标过的 → 「你标记为弱项。」（他自己说的，比系统的判断准）
   *   没标过的那几块里练得最少的一块 → 「此项较为薄弱。」（系统看出来的）
   */
  const thinnest = picked.find((a) => !weak.has(a.area) && a.ratio < 1);
  const tailFor = (area: WeakArea): string => {
    if (weak.has(area)) return TAIL_SELF;
    if (thinnest && thinnest.area === area) return TAIL_THIN;
    return "";
  };

  // vocabulary / speed 不是题段类目标：词汇在最后单独垫底，speed 只能进 WeeklyGoalItem 的 detail
  for (const area of picked) {
    const paperArea = area.area as PaperArea;
    const unit = AREA_UNIT[paperArea];
    const tail = tailFor(paperArea);
    // 落点跟着真题库轮换：这套练完换下一套，不锁死在第一套上
    const target = nextPracticeTarget(paperArea, input.coverage);
    if (!target) continue;

    if (paperArea === "writing" || paperArea === "translation") {
      goals.push({
        title: paperArea === "writing" ? "写作一篇" : "翻译一段",
        detail: targetDetail(paperArea, target),
        type: paperArea,
        units: 1,
        paperId: target.paperId,
        paperUnitId: target.unitId,
        examPart: paperArea,
        basis: basisFor({
          days,
          done: area.done,
          suggested: area.suggested,
          unit,
          tail,
        }),
        source: "system",
      });
      continue;
    }

    goals.push({
      title: paperArea === "listening" ? "听力真题" : "阅读真题",
      detail: target.label,
      type: paperArea === "listening" ? "listening-paper" : "reading-paper",
      units: 1,
      paperId: target.paperId,
      paperUnitId: target.unitId,
      examPart: paperArea,
      basis: basisFor({
        days,
        done: area.done,
        suggested: area.suggested,
        unit,
        tail,
      }),
      source: "system",
    });
  }

  // 词汇永远垫底，不是缺口就是习惯
  if (stage.id !== "explore") {
    goals.push({
      title: "核心词汇过一轮",
      detail: "上下册词库随便翻，看到眼熟的就收进生词本",
      type: "vocab",
      units: 1,
      basis: vocabBasis(days, input.coverage.vocabTouched) + (weak.has("vocabulary") ? TAIL_SELF : ""),
      source: "system",
    });
  }

  const headline = planRationale(days, stage);

  return { stage, rationale: headline, goals: goals.slice(0, count + 1) };
}

/**
 * 下周重点：只根据刚回顾完的那一周真实发生的事说，不预测分数。
 *
 * 注意措辞：这里描述的是**被回顾的那一周**，`buildWeeklyReport()` 传进来的
 * 是当前这一周，所以正文说「这周」，而结论说「下周」——
 * 早先写成「上周」会让人以为读的是上周的数据，其实数字是这周的。
 *
 * 也注意**不重复**：建议数、完成数、距考天数、阶段意图，周报卡片的表头和
 * 页面顶部的横幅已经在说了，这里再说一遍就成了复读。只补表头没说过的部分。
 */
export function weeklyFocus(previous: {
  completed: number;
  suggested: number;
  doneAreas: string[];
  missedAreas: string[];
  daysLeft: number | null;
}): string[] {
  const out: string[] = [];
  for (const a of previous.missedAreas) {
    out.push(`${WEAK_AREA_LABEL[a as WeakArea] ?? a} 这周没碰，下周先补一项。`);
  }
  if (out.length === 0) {
    if (previous.suggested > 0 && previous.completed >= previous.suggested) {
      out.push("这周推荐的都练完了。");
    } else {
      out.push("下周想练什么你自己定。");
    }
  }
  return out;
}

/** 今天轻松学：只给一件最小的、随时能开始的事。 */
export function lightSuggestion(input: {
  coverage: PracticeCoverage;
  habitsToday: { vocab: boolean; listening: boolean };
}): { title: string; hint: string; action: "vocab" | "habit-listen" | "practice" } {
  if (!input.habitsToday.vocab) {
    return {
      title: "过 10 个词",
      hint: "核心词库随便翻一翻，看到眼熟的就收进生词本。",
      action: "vocab",
    };
  }
  if (!input.habitsToday.listening) {
    return {
      title: "精听一小段",
      hint: "挑一题段，听完看原文，不用全对。",
      action: "habit-listen",
    };
  }
  return {
    title: `来一题${
      input.coverage.finishedUnits.length > 0 ? "没做过的题" : "真题"
    }`,
    hint: "不想算今天的学习进度也行，做完随手记一笔。",
    action: "practice",
  };
}

export { addDays };
