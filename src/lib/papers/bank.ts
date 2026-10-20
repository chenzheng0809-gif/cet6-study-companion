/**
 * 选词填空的词性工具。
 *
 * 选词填空（banked cloze）公认的做法是三步走，顺序不能颠倒：
 *
 *   1. **先标词性** —— 拿到 15 个备选词先按 n. / v. / adj. / adv. 分四类。
 *      这一步不需要认识单词，光看后缀（-tion 名词、-ly 副词、-able 形容词）
 *      就能把每一空的候选从 15 个砍到三五个。
 *   2. **看语法定范围** —— 冠词/形容词之后要名词，情态动词/主语之后要动词，
 *      系动词之后要形容词或名词，修饰动词形容词要用副词。词性对不上直接划掉。
 *   3. **看语境定答案** —— 剩下的几个再看转折/因果/并列连接词和固定搭配。
 *
 * 这一轮把它拆成两件事，两边用的词性**不是同一份**：
 *
 *   · **做题时不给词性**。题面上一旦写好 n. / v.，第一步就白给了，等于
 *     把答案的分布直接递到学生手里。所以做题阶段只给一支笔：学生自己
 *     给每个备选词标词性，标的是他自己的判断。
 *   · **交卷后才给词性**。解析按「词性 → 语法 → 语境」三步给，第一步的
 *     词性来自解析册，同时把学生自己标的和解析册的并排摆出来。
 *
 * 解析册那一份全部来自真题解析册里已有的字段，没有一条是这里现编的：
 *   · 词性来自 `ReadingSection.bank[].pos`；
 *   · 语法和语境来自 `Question.explain`，解析册本来就写成「语法判断 / 语义判断」两段。
 * 学生自己标的那一份是学生写的，这里只负责存取和比对。
 */

import type { AnswerKey, ReadingSection } from "./types";

/** 四类基础词性，顺序固定：题面按这个顺序念，学生也按这个顺序扫。 */
export const POS_ORDER = ["n.", "v.", "adj.", "adv."] as const;

export type Pos = (typeof POS_ORDER)[number] | string;

export interface BankWord {
  key: AnswerKey;
  word: string;
  pos?: string;
  zh?: string;
}

/** 一个词性分组：这一类里有哪几个备选词。 */
export interface PosGroup {
  pos: string;
  words: BankWord[];
}

/**
 * 学生自己标的词性：key 是词库字母（A–O），value 是学生判定的词性。
 * 存的是学生写的判断，不是解析册的答案。
 */
export type PosMarks = Record<string, string>;

/** 学生标了几个词 —— 词库区的那句「你标了 5/15」。 */
export function markedCount(bank: BankWord[], marks: PosMarks): number {
  return bank.filter((b) => marks[b.key]).length;
}

/**
 * 词库按词性分组。
 *
 * 解析册的 `pos` 只写了 `n.` `v.` `adj.` `adv.` 四种，但这只是**首要词性** ——
 * `drop` 标成 `n.` 可它也能当动词。分组只用来做「缩小候选」这一步，
 * 所以刻意只按标注分组，不去猜一词多性：猜错一次比不给更糟。
 * 解析册标了什么就是什么，没标的不补。
 */
export function posGroups(section: ReadingSection): PosGroup[] {
  const bank = (section.bank ?? []) as BankWord[];
  const groups = new Map<string, BankWord[]>();
  for (const b of bank) {
    const pos = b.pos?.trim();
    // 没标词性的不硬塞进某一类 —— 那等于替解析册编词性
    if (!pos) continue;
    const list = groups.get(pos);
    if (list) list.push(b);
    else groups.set(pos, [b]);
  }
  return [...groups.entries()]
    .map(([pos, words]) => ({ pos, words }))
    .sort((a, b) => {
      const ia = POS_ORDER.indexOf(a.pos as (typeof POS_ORDER)[number]);
      const ib = POS_ORDER.indexOf(b.pos as (typeof POS_ORDER)[number]);
      if (ia === -1 && ib === -1) return a.pos.localeCompare(b.pos);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
}

/** 词库里某个键的词；键不存在返回 undefined（不猜）。 */
export function posOf(section: ReadingSection, key: string | undefined): string | undefined {
  if (!key) return undefined;
  return (section.bank ?? []).find((b) => b.key === key)?.pos;
}

/** 与某个键**同词性**的其他备选词 —— 第一步收窄之后真正要对比的那几个。 */
export function samePosSiblings(section: ReadingSection, key: string): BankWord[] {
  const pos = posOf(section, key);
  if (!pos) return [];
  return ((section.bank ?? []) as BankWord[]).filter((b) => b.pos === pos && b.key !== key);
}

/**
 * 把解析册的一段解析切成「语法」和「语境」两截。
 *
 * 解析册本来就把每道题写成 `语法判断：…… 语义判断：……`，这里只是把这两段
 * 拆出来分开展示，前面再由界面补上「词性」那一段（词性来自 `bank[].pos`）。
 * 拆不出来就原样返回，绝不替它编内容。
 */
export function splitExplain(explain: string): { grammar: string; context: string } {
  const g = explain.indexOf("语法判断");
  const s = explain.indexOf("语义判断");
  if (g === -1) return { grammar: "", context: explain.trim() };

  const grammar = explain.slice(g, s > g ? s : undefined);
  const context = s > g ? explain.slice(s) : "";
  const strip = (t: string) =>
    t
      .replace(/^(语法判断|语义判断)\s*[：:]?\s*/, "")
      .replace(/[。.]\s*$/, "")
      .trim();

  return { grammar: strip(grammar), context: strip(context) };
}
