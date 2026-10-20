/**
 * 核心词库的查询层。
 *
 * 数据本身在 `wordbooks.data.ts`（自动生成，勿手改），这里只放查询与派生。
 *
 * 为什么书里的 374 条**不直接进**生词本：生词本是"我自己不认识的词"的笔记本，
 * 全灌进去就等于一本词典，复习时根本分不出哪些是真欠的。所以书里的内容是一层
 * **可搜的词库**，看到不会的再一键收进生词本。
 */

import {
  WORDBOOK_TOPICS,
  WORDBOOK_UNITS,
  type DetailItem,
  type Marked,
  type SynonymItem,
  type SynonymTerm,
  type WordExample,
  type WordbookEntry,
  type WordbookGroup,
  type WordbookTopic,
} from "./wordbooks.data";

export type {
  DetailItem,
  Marked,
  SynonymItem,
  SynonymTerm,
  WordExample,
  WordbookEntry,
  WordbookGroup,
  WordbookTopic,
};
export { WORDBOOK_TOPICS, WORDBOOK_UNITS };

export interface WordbookUnit {
  unitNo: number;
  unitName: string;
  count: number;
  /** 本应用写的导读；原书没有这段文字 */
  intro: string;
}

export function wordbookUnitList(): WordbookUnit[] {
  const map = new Map<number, WordbookUnit>();
  for (const entry of WORDBOOK_UNITS) {
    const hit = map.get(entry.unitNo);
    if (hit) hit.count += 1;
    else
      map.set(entry.unitNo, {
        unitNo: entry.unitNo,
        unitName: entry.unitName,
        count: 1,
        intro: entry.unitIntro ?? "",
      });
  }
  return [...map.values()].sort((a, b) => a.unitNo - b.unitNo);
}

export function unitEntries(unitNo: number): WordbookEntry[] {
  return WORDBOOK_UNITS.filter((e) => e.unitNo === unitNo);
}

/** 词库里一共有多少个词条 / 多少条同义替换。 */
export const WORDBOOK_WORD_COUNT = WORDBOOK_UNITS.length;
export const WORDBOOK_ITEM_COUNT = WORDBOOK_TOPICS.reduce(
  (sum, topic) => sum + topic.groups.reduce((g, group) => g + group.items.length, 0),
  0,
);

function includesCI(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle);
}

export function searchWords(query: string, unitNo: number | null): WordbookEntry[] {
  const q = query.trim().toLowerCase();
  return WORDBOOK_UNITS.filter((entry) => {
    if (unitNo !== null && entry.unitNo !== unitNo) return false;
    if (!q) return true;
    if (includesCI(entry.word, q)) return true;
    if (entry.senses.some((s) => includesCI(s.meaning, q))) return true;
    // 词表现在是带音标和中文的详解条目，词形和释义都要能搜到
    return [...entry.derivatives, ...entry.synonyms, ...entry.phrases].some(
      (item) =>
        includesCI(item.term, q) ||
        item.senses.some((sense) => includesCI(sense.meaning, q)),
    );
  });
}

/** 在专题里搜同义替换项。返回命中的条目，保留其所属分组方便渲染。 */
export function searchTopicItems(
  query: string,
  topicNo: number | null,
): { topic: WordbookTopic; groupName: string; item: SynonymItem }[] {
  const q = query.trim().toLowerCase();
  const hits: { topic: WordbookTopic; groupName: string; item: SynonymItem }[] = [];
  for (const topic of WORDBOOK_TOPICS) {
    if (topicNo !== null && topic.topicNo !== topicNo) continue;
    for (const group of topic.groups) {
      for (const item of group.items) {
        if (!q) {
          hits.push({ topic, groupName: group.groupName, item });
          continue;
        }
        const matched =
          includesCI(item.meaning, q) ||
          item.senses.some((s) => includesCI(s.meaning, q)) ||
          item.terms.some((t) => includesCI(t.term, q) || includesCI(t.zh, q));
        if (matched) hits.push({ topic, groupName: group.groupName, item });
      }
    }
  }
  return hits;
}

/* --------------------------------------------------------- 下册：按专题进入 */

/**
 * 专题分览卡片。一张卡 = 一个专题，进去之后才看到分组和条目。
 *
 * 下册本来就是「点开一个专题 → 看一组同义替换」的查阅结构，平铺成一张长列表
 * 反而不好用：专题 4/5 各有 100 条，混在一起没法看。
 */
export interface WordbookTopicCard {
  topic: WordbookTopic;
  itemCount: number;
  exampleCount: number;
  /** 原书重点标黄（同义替换）的表达个数 */
  markedCount: number;
  /** 配了真题例句的条目个数 */
  withExampleCount: number;
  groups: WordbookGroup[];
  preview: SynonymTerm[];
}

export function topicCards(): WordbookTopicCard[] {
  return WORDBOOK_TOPICS.map((topic) => {
    const items = topic.groups.flatMap((g) => g.items);
    const terms = items.flatMap((it) => it.terms);
    return {
      topic,
      itemCount: items.length,
      exampleCount: items.reduce((n, it) => n + (it.examples?.length ?? 0), 0),
      markedCount: terms.filter((t) => t.mark).length,
      withExampleCount: items.filter((it) => (it.examples?.length ?? 0) > 0).length,
      groups: topic.groups,
      preview: terms.slice(0, 6),
    };
  });
}

/* ------------------------------------------------- 同义替换：把例句变成题 */

export interface SynonymQuiz {
  /** 稳定 id：同一份数据每次生成同一个，选项顺序才不会每次刷新都变 */
  id: string;
  /** 挖掉高亮片段后的句子 */
  prompt: string;
  answer: string;
  /** 干扰项 + 正确答案，按稳定顺序打散 */
  options: string[];
  /** 答完给的中文，学生自己比对这个空到底替换了什么 */
  translation: string;
  translationHL?: Marked[];
  /** 例句出处，如 `2023 年六级仔细阅读` */
  source: string;
  /** 提示这一空来自哪个词 */
  origin: string;
}

const TRAILING_PUNCT = /[.,;:!?)”"…]+$/;

/**
 * 把一条例句变成同义替换题：挖掉书上标黄的那一段，让学生在同义词里挑一个填回去。
 *
 * 干扰项只从**同一条同义链 / 同一个词的词表**里取，而且必须和答案形状一致
 * （单词对单词、短语对短语）。拿 `undergraduate` 去当 `tax cuts` 的选项，
 * 猜中不难但也学不到东西。
 */
function shapeOf(text: string): "word" | "phrase" | null {
  const t = text.trim();
  if (!/^[A-Za-z][A-Za-z'’\-]*(?:[ ]+[A-Za-z][A-Za-z'’\-]*)*$/.test(t)) return null;
  return t.includes(" ") ? "phrase" : "word";
}

function firstMarked(segs: Marked[] | undefined): { index: number; text: string } | null {
  if (!segs) return null;
  for (let i = 0; i < segs.length; i += 1) {
    if (segs[i].mark && segs[i].text.trim().length >= 2) return { index: i, text: segs[i].text };
  }
  return null;
}

/** 稳定散列：只为了让正确答案的下标在不同题之间变化，不参与判题逻辑。 */
function hashOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function makeQuiz(
  id: string,
  ex: WordExample,
  pool: string[],
  origin: string,
): SynonymQuiz | null {
  const hit = firstMarked(ex.sentenceHL);
  if (!hit) return null;
  const answer = hit.text.replace(TRAILING_PUNCT, "").trim();
  if (answer.length < 2) return null;
  const shape = shapeOf(answer);
  if (!shape) return null;

  const low = answer.toLowerCase();
  const seen = new Set([low]);
  const distractors: string[] = [];
  for (const raw of pool) {
    const cand = raw.trim();
    if (!cand || cand.length > answer.length + 18) continue;
    if (shapeOf(cand) !== shape) continue;
    const k = cand.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    distractors.push(cand);
    if (distractors.length === 3) break;
  }
  if (distractors.length < 2) return null;

  // 四个选项，按 id 的散列把正确答案转到不同位置，避免背「第几个」。
  const options = [...distractors];
  options.splice(hashOf(id) % (options.length + 1), 0, answer);

  const prompt =
    ex.sentenceHL!.slice(0, hit.index).map((s) => s.text).join("").replace(TRAILING_PUNCT, "").trimEnd() +
    " ____ " +
    ex.sentenceHL!.slice(hit.index + 1).map((s) => s.text).join("").trimStart();

  return {
    id,
    prompt,
    answer,
    options,
    translation: ex.translation,
    translationHL: ex.translationHL,
    source: ex.source,
    origin,
  };
}

/** 全书能出题的同义替换题。顺序 = 词库顺序，固定。 */
export function buildSynonymQuizzes(): SynonymQuiz[] {
  const out: SynonymQuiz[] = [];

  for (const entry of WORDBOOK_UNITS) {
    const pool = [
      ...entry.synonyms.map((i) => i.term),
      ...entry.derivatives.map((i) => i.term),
      ...entry.phrases.map((i) => i.term),
      ...entry.antonyms.map((i) => i.term),
    ];
    for (const [i, ex] of entry.examples.entries()) {
      const quiz = makeQuiz(`u${entry.unitNo}-${entry.word}-${i}`, ex, pool, entry.word);
      if (quiz) out.push(quiz);
    }
  }

  for (const topic of WORDBOOK_TOPICS) {
    for (const group of topic.groups) {
      for (const [gi, item] of group.items.entries()) {
        // 同义链里的其他词就是最好的干扰项：它们本身就是同义替换关系
        const pool = item.terms.map((t) => t.term);
        for (const [i, ex] of (item.examples ?? []).entries()) {
          const origin = item.terms.map((t) => t.term).slice(0, 3).join(" / ");
          const quiz = makeQuiz(`t${topic.topicNo}-${gi}-${i}`, ex, pool, origin);
          if (quiz) out.push(quiz);
        }
      }
    }
  }
  return out;
}

/** 这个词有没有例句 —— 翻卡上决定要不要显示例区块。 */
export function entryExamples(entry: WordbookEntry): WordExample[] {
  return entry.examples ?? [];
}

/** 收进生词本时预填的释义：优先第一个词性的中文。 */
export function entryMeaning(entry: WordbookEntry): string {
  return entry.senses.map((s) => `${s.pos}${s.meaning}`).join(" / ");
}

/** 词库来源在生词本里显示的出处。不是真题，所以不可点。 */
export function entrySourceLabel(entry: WordbookEntry): string {
  return `核心词汇 · Unit ${entry.unitNo} ${entry.unitName}`;
}
