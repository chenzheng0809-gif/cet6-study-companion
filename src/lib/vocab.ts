import type { VocabEntry } from "./types";

export function normWord(word: string): string {
  return word.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * 同一条生词被再次记录时怎么处理。
 *
 * 生词本最怕的是同一个词散落好几条 —— 复习的时候根本没法用。
 * 所以重复记同一个词只**补空缺**，不覆盖学生已经写下的释义和备注：
 * 这是学生的笔记，不是系统可以随手改写的内容。
 */
export function mergeVocabEntry(existing: VocabEntry, incoming: VocabEntry): VocabEntry {
  return {
    ...existing,
    meaning: existing.meaning?.trim() ? existing.meaning : incoming.meaning,
    note: existing.note?.trim() ? existing.note : incoming.note,
    // 出处保留最早记的那次，再记一次不代表它来自别的地方
    sourcePaperId: existing.sourcePaperId,
    sourceQuestionNo: existing.sourceQuestionNo,
    sourceSentenceId: existing.sourceSentenceId,
    sourceLabel: existing.sourceLabel,
    createdAt: existing.createdAt,
  };
}
