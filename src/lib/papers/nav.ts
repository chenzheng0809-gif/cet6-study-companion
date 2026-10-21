import { EXAM_PART_LIMIT, type ExamPart } from "./exam-clock";
import type { ListeningUnit, Paper, ReadingSection } from "./types";

/**
 * 真题页的两层导航模型：Part → Section → 题段。
 *
 * 这里只回答「怎么切分」，不碰 UI，也不改数据本身：
 * - 题号范围一律来自 unit / section 自己的 questionRange；
 * - 写作和翻译没有题号，就老实留 null —— 不编一个 0–0 出来；
 * - 段落标题取自数据里的 label，不新造一套说法。
 */

/**
 * 浏览顺序：听力 → 阅读 → 写作 → 翻译。
 *
 * 注意这和考场顺序（exam-clock 里的 PART_ORDER = 写作/听力/阅读/翻译）不是一回事：
 * 考场顺序是卷面的 Part I–IV，出处是试卷；浏览顺序是刷题的常规起手式，
 * 先听先读再落笔。Part 的官方编号仍然由 EXAM_PART_LIMIT[part].en 带出来，不受影响。
 */
export const NAV_PART_ORDER: ExamPart[] = ["listening", "reading", "writing", "translation"];

export interface NavUnit {
  /** 听力/阅读是 unit id；写作与翻译就用自己的 Part 名 */
  id: string;
  part: ExamPart;
  /** 所属 Section：听力/阅读是 A / B / C，写作翻译各占一个 */
  sectionKey: string;
  sectionLabel: string;
  /** 题段标题（英文卷面名）："Section A" / "Conversation One" */
  label: string;
  /** 题号范围；写作与翻译没有题号，必须是 null */
  questionRange: [number, number] | null;
  /** 在整个 Part 里的第几段（从 0 开始），用来算「本 Part 2/7」这种进度 */
  unitIndexInPart: number;
}

export interface NavSection {
  key: string;
  label: string;
  units: NavUnit[];
}

export interface NavPart {
  part: ExamPart;
  sections: NavSection[];
  /** 按浏览顺序摊平的题段，索引 = 某个题段在该 Part 里的位置 */
  units: NavUnit[];
  unitCount: number;
}

/**
 * 听力的 Section 判定。
 *
 * 分组依据是数据里的 section 字段 —— 那是卷面印的 Section 字母：
 *   Section A 两段长对话（Q1–8）
 *   Section B 两篇短文（Q9–15）
 *   Section C 三段讲座（Q16–25）
 *
 * 以前这里是按题段标题的前缀猜的（Recording→A / Conversation→B / Passage→C），
 * 猜反了：浏览顺序会变成 Q16→Q1→Q9，跟卷面完全对不上。
 * 所以归属写进数据，标题前缀只用来显示这一段是什么类型。
 */
const LISTENING_TYPE_NAME: Record<string, string> = {
  conversation: "Conversations",
  passage: "Passages",
  recording: "Recordings",
  news: "News",
  lecture: "Recordings",
  talk: "Recordings",
};

/** 中文题型名：段标题的首个词就是题型 */
const LISTENING_TYPE_ZH: Record<string, string> = {
  conversation: "对话",
  passage: "短文",
  recording: "讲座",
  lecture: "讲座",
  talk: "讲座",
  news: "新闻",
};

/**
 * 一套卷子的听力有哪几类、几段。
 *
 * 入口上的提示语不能写死：轮换到别的卷子以后，题型顺序和段数都会变，
 * 写死的话就跟卷面对不上了。顺序按 Section 排（卷面印的顺序）。
 */
export function listeningSummary(paper: Paper): string {
  const names: string[] = [];
  const ordered = [...paper.listeningUnits].sort((a, b) => a.section.localeCompare(b.section));
  for (const unit of ordered) {
    const head = (unit.label.split(/[\s·—-]+/)[0] ?? "").toLowerCase();
    const zh = LISTENING_TYPE_ZH[head];
    if (zh && !names.includes(zh)) names.push(zh);
  }
  const kinds = names.length > 0 ? names.join(" / ") : "听力";
  return `${kinds} · ${paper.listeningUnits.length} 段`;
}

function listeningSection(unit: ListeningUnit): { key: string; label: string } {
  const head = (unit.label.split(/[\s·—-]+/)[0] ?? "").toLowerCase();
  const type = LISTENING_TYPE_NAME[head];
  return {
    key: unit.section,
    label: type ? `Section ${unit.section} · ${type}` : `Section ${unit.section}`,
  };
}

/**
 * 阅读的 Section 判定。
 *
 * label 里本来就写着 "Section A" / "Section C · Passage One"，
 * 取首字母当分组键；取不到就退回题型（选词填空 A / 长篇匹配 B / 仔细阅读 C）。
 */
function readingSection(section: ReadingSection): { key: string; label: string } {
  const letter = section.label.match(/^Section\s+([A-Za-z])/)?.[1];
  if (letter) {
    const key = letter.toUpperCase();
    return { key, label: `Section ${key}` };
  }
  const byKind: Record<ReadingSection["kind"], string> = {
    bank: "A",
    matching: "B",
    detail: "C",
  };
  const key = byKind[section.kind];
  return { key, label: `Section ${key}` };
}

function listeningUnit(unit: ListeningUnit): NavUnit {
  const section = listeningSection(unit);
  return {
    id: unit.id,
    part: "listening",
    sectionKey: section.key,
    sectionLabel: section.label,
    label: unit.label,
    questionRange: unit.questionRange,
    // 真正在 Part 里的位置由 groupSections 按浏览顺序统一编号
    unitIndexInPart: -1,
  };
}

function readingUnit(section: ReadingSection): NavUnit {
  const group = readingSection(section);
  return {
    id: section.id,
    part: "reading",
    sectionKey: group.key,
    sectionLabel: group.label,
    label: section.label,
    questionRange: section.questionRange,
    unitIndexInPart: -1,
  };
}

/** 写作 / 翻译：整个 Part 就是一段，没有 Section 也没有题号。 */
function soloUnit(part: "writing" | "translation"): NavUnit {
  const limit = EXAM_PART_LIMIT[part];
  return {
    id: part,
    part,
    sectionKey: part,
    sectionLabel: limit.en,
    label: limit.en,
    questionRange: null,
    unitIndexInPart: -1,
  };
}

/**
 * 把若干题段按 sectionKey 归组。
 *
 * Section 按卷面自己的字母排序（A → B → C），不按数据里出现的先后 ——
 * 真题的音频顺序和题号顺序本来就不一致（Section A 的新闻题号在最后），
 * 浏览器按 A/B/C 走才和卷面一致。归组后摊平成一条浏览序列，
 * 翻页动画才能跨 Section 边界接得上。
 */
function groupSections(units: NavUnit[], part: ExamPart): NavPart {
  const sections: NavSection[] = [];
  for (const unit of units) {
    let section = sections.find((s) => s.key === unit.sectionKey);
    if (!section) {
      section = { key: unit.sectionKey, label: unit.sectionLabel, units: [] };
      sections.push(section);
    }
    section.units.push(unit);
  }

  const ordered = sections
    .map((section, i) => ({ section, i }))
    .sort((a, b) => {
      const ra = sectionRank(a.section.key);
      const rb = sectionRank(b.section.key);
      if (ra !== rb) return ra - rb;
      // 单字母 Section 按字母排（A → B → C），其余保持数据里的先后
      if (ra === 0) return a.section.key < b.section.key ? -1 : a.section.key > b.section.key ? 1 : 0;
      return a.i - b.i;
    })
    .map((entry) => entry.section);

  // 按浏览顺序统一编号。unitIndexInPart 就地写在 section 里的同一批对象上，
  // 这样 Section 内的题段和摊平后的序列指向同一份数据，不会各说各话。
  const flat: NavUnit[] = [];
  for (const section of ordered) {
    for (const unit of section.units) {
      unit.unitIndexInPart = flat.length;
      flat.push(unit);
    }
  }

  return { part, sections: ordered, units: flat, unitCount: flat.length };
}

/** 单字母 Section（A/B/C）排在前面按字母走，其余保持数据里的先后。 */
function sectionRank(key: string): number {
  return /^[A-Z]$/.test(key) ? 0 : 1;
}

/**
 * 由试卷数据推出浏览用的两层结构。
 * 这套卷没有听力或没有写作题时，对应的 Part 直接不出现，不会留一个空 Part。
 */
export function buildPaperNav(paper: {
  listeningUnits: ListeningUnit[];
  readingSections: ReadingSection[];
  writing?: unknown;
  translation?: unknown;
}): NavPart[] {
  const parts: NavPart[] = [];

  if (paper.listeningUnits.length > 0) {
    parts.push(
      groupSections(
        paper.listeningUnits.map(listeningUnit),
        "listening",
      ),
    );
  }
  if (paper.readingSections.length > 0) {
    parts.push(
      groupSections(
        paper.readingSections.map(readingUnit),
        "reading",
      ),
    );
  }
  if (paper.writing) parts.push(groupSections([soloUnit("writing")], "writing"));
  if (paper.translation) {
    parts.push(groupSections([soloUnit("translation")], "translation"));
  }

  return parts;
}

/**
 * 在一个 Part 内部走一步：先在当前 Section 内挪题段，走到头就换 Section，
 * 首尾都不越界（返回 null 表示这一步无处可去）。
 */
export function stepInPart(
  part: NavPart,
  sectionIndex: number,
  unitIndex: number,
  dir: 1 | -1,
): { sectionIndex: number; unitIndex: number } | null {
  const section = part.sections[sectionIndex];
  if (!section) return null;

  if (dir === 1) {
    if (unitIndex + 1 < section.units.length) {
      return { sectionIndex, unitIndex: unitIndex + 1 };
    }
    const next = part.sections[sectionIndex + 1];
    return next ? { sectionIndex: sectionIndex + 1, unitIndex: 0 } : null;
  }

  if (unitIndex > 0) return { sectionIndex, unitIndex: unitIndex - 1 };
  const prev = part.sections[sectionIndex - 1];
  return prev ? { sectionIndex: sectionIndex - 1, unitIndex: prev.units.length - 1 } : null;
}
