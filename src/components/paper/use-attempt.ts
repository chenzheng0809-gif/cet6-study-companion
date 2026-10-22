"use client";

import { useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { clearPaperAttempt, savePaperAttempt } from "@/lib/repo";
import type { PaperAttempt } from "@/lib/types";
import { partLimitSec, type ExamPart, type ExamSession } from "@/lib/papers/exam-clock";

/**
 * 补齐旧版本记录缺的字段。
 *
 * IndexedDB 里的作答记录是历史写入的：字段是后来才加的（sessions 是第三轮
 * 才有的）。直接读会拿到 undefined，读 undefined.sessions 就崩。
 * 所以每次读出来都过一次这个函数，缺什么补什么，已有的一律不动 ——
 * 学生的真实作答和真实计时绝不能被"补默认值"覆盖掉。
 */
function normalizeAttempt(raw: PaperAttempt | undefined, paperId: string): PaperAttempt | null {
  if (!raw) return null;
  return {
    ...raw,
    paperId: raw.paperId ?? paperId,
    answers: raw.answers ?? {},
    seconds: raw.seconds ?? {},
    revealed: Array.isArray(raw.revealed) ? raw.revealed : [],
    finishedUnits: Array.isArray(raw.finishedUnits) ? raw.finishedUnits : [],
    drafts: raw.drafts ?? {},
    posMarks: raw.posMarks ?? {},
    sessions: raw.sessions ?? {},
  };
}

/** 一份全新的空白作答记录。 */
export function emptyAttempt(paperId: string): PaperAttempt {
  return {
    id: paperId,
    paperId,
    answers: {},
    seconds: {},
    revealed: [],
    finishedUnits: [],
    drafts: {},
    posMarks: {},
    sessions: {},
    updatedAt: 0,
  };
}

/**
 * 真题作答状态：每套卷一份，存在 IndexedDB，刷新不丢。
 * 没有任何 mock —— 这里记的就是用户真实点过的选项、真实写下的草稿、
 * 以及交卷那一刻真实花掉的秒数。
 */
export function usePaperAttempt(paperId: string) {
  const attempt = useLiveQuery(
    async () => normalizeAttempt(await db.paperAttempts.get(paperId), paperId),
    [paperId],
  );

  /**
   * 改一次作答记录。
   *
   * 读和写必须在**同一个读写事务**里。
   * 之前是「先 get 再 put」两个独立事务：两次改挨得近的时候（比如连着标两个词的
   * 词性），后一次读到的还是改动前的旧记录，写回去就把前一次覆盖掉了 ——
   * 学生标的词性会莫名其妙少一个。现在整段放进一个事务，后一次一定读到前一次的结果。
   */
  const update = useCallback(
    async (patch: Partial<PaperAttempt> | ((a: PaperAttempt) => Partial<PaperAttempt>)) => {
      await db.transaction("rw", db.paperAttempts, async () => {
        const stored = await db.paperAttempts.get(paperId);
        const base = normalizeAttempt(stored, paperId) ?? emptyAttempt(paperId);
        await savePaperAttempt({
          ...base,
          ...(typeof patch === "function" ? patch(base) : patch),
        });
      });
    },
    [paperId],
  );

  const setAnswer = useCallback(
    (n: number, key: string) => update((a) => ({ answers: { ...a.answers, [n]: key } })),
    [update],
  );

  /** 把某一空退回空着（选词填空里点一下已经填好的空格就是删掉它）。 */
  const clearAnswer = useCallback(
    (n: number) =>
      update((a) => {
        if (!(n in a.answers)) return a;
        const answers = { ...a.answers };
        delete answers[n];
        return { answers };
      }),
    [update],
  );

  /**
   * 选词填空：词库里的选项只能用一次。
   *
   * 所以往某一空填某个键时，先把同一个键从原来占着的那一空里摘掉，
   * 不然同一个字母会同时占住两个空，判分和「只能用一次」都对不上。
   */
  const placeAnswer = useCallback(
    (n: number, key: string) =>
      update((a) => {
        const answers: Record<number, string> = {};
        for (const [k, v] of Object.entries(a.answers)) {
          const num = Number(k);
          if (num !== n && v === key) continue;
          answers[num] = v;
        }
        answers[n] = key;
        return { answers };
      }),
    [update],
  );

  const addSeconds = useCallback(
    (n: number, sec: number) =>
      update((a) => ({ seconds: { ...a.seconds, [n]: (a.seconds[n] ?? 0) + Math.round(sec) } })),
    [update],
  );

  const reveal = useCallback(
    (n: number) => update((a) => (a.revealed.includes(n) ? a : { revealed: [...a.revealed, n] })),
    [update],
  );

  /** 交卷后一次性解锁该 Part 的全部解析 */
  const revealMany = useCallback(
    (ns: number[]) =>
      update((a) => ({
        revealed: Array.from(new Set([...a.revealed, ...ns])),
      })),
    [update],
  );

  const finishUnit = useCallback(
    (unitId: string) =>
      update((a) =>
        a.finishedUnits.includes(unitId) ? a : { finishedUnits: [...a.finishedUnits, unitId] },
      ),
    [update],
  );

  const setDraft = useCallback(
    (key: string, text: string) => update((a) => ({ drafts: { ...a.drafts, [key]: text } })),
    [update],
  );

  /**
   * 选词填空：学生自己给某个备选词标词性。
   *
   * pos 传 null 就是取消标注。标完的词性存在作答记录里，刷新不丢，
   * 交卷后能拿它跟解析册的词性对一下。
   */
  const markPos = useCallback(
    (key: string, pos: string | null) =>
      update((a) => {
        const posMarks = { ...(a.posMarks ?? {}) };
        if (pos === null) delete posMarks[key];
        else posMarks[key] = pos;
        return { posMarks };
      }),
    [update],
  );

  /** 开考：只记录起点，不猜任何时长。limitSec 由调用方传入官方考场时长。 */
  const startSession = useCallback(
    (part: ExamPart, limitSec: number) =>
      update((a) => {
        if (a.sessions[part]) return a;
        return {
          sessions: {
            ...a.sessions,
            [part]: { part, limitSec, startedAt: Date.now() },
          },
        };
      }),
    [update],
  );

  /**
   * 交卷：记录真实用掉的秒数。
   *
   * 没开考就直接交卷（学生是冲着「看解析」来的，不一定先按开考）也必须算成交卷：
   * 之前这里直接 return，session 根本没建起来，`isSubmitted` 一直是 false ——
   * 解析已经解开了，「原文和解析还没解锁」那块却还杵在页面上。
   */
  const submitSession = useCallback(
    (part: ExamPart) =>
      update((a) => {
        const s = a.sessions[part];
        if (s?.submittedAt) return a;
        const submittedAt = Date.now();
        // 没有开考记录就用这一刻当起点：已用时间记 0，不假装他考过多久
        const base = s ?? { part, limitSec: partLimitSec(part), startedAt: submittedAt };
        return {
          sessions: {
            ...a.sessions,
            [part]: {
              ...base,
              submittedAt,
              elapsedSec: Math.round((submittedAt - base.startedAt) / 1000),
            },
          },
        };
      }),
    [update],
  );

  const reset = useCallback(() => clearPaperAttempt(paperId), [paperId]);

  const sessions = attempt?.sessions ?? {};

  return {
    attempt: attempt ?? null,
    ready: attempt !== undefined,
    answers: attempt?.answers ?? {},
    revealed: attempt?.revealed ?? [],
    drafts: attempt?.drafts ?? {},
    /** 学生自己标的词性：key 是词库字母 */
    posMarks: attempt?.posMarks ?? {},
    sessionOf: (part: ExamPart): ExamSession | undefined =>
      sessions[part] as ExamSession | undefined,
    /** 该 Part 是否已交卷（交卷前锁住解析与中文） */
    isSubmitted: (part: ExamPart) => Boolean(sessions[part]?.submittedAt),
    setAnswer,
    clearAnswer,
    placeAnswer,
    addSeconds,
    reveal,
    revealMany,
    finishUnit,
    setDraft,
    markPos,
    startSession,
    submitSession,
    reset,
  };
}

export function scoreOf(
  paper: { questions: { n: number; answer: string }[] },
  answers: Record<number, string>,
): { answered: number; correct: number; total: number } {
  const total = paper.questions.length;
  let answered = 0;
  let correct = 0;
  for (const q of paper.questions) {
    const given = answers[q.n];
    if (!given) continue;
    answered++;
    if (given === q.answer) correct++;
  }
  return { answered, correct, total };
}
