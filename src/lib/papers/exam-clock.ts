import type { Paper } from "./types";

/**
 * 考场时长
 *
 * 这四个数字直接来自试卷卷面每个 Part 的 Directions 标题，不是估的：
 *   "Part I Writing (30 minutes)"
 *   "Part II Listening Comprehension (30 minutes)"
 *   "Part III Reading Comprehension (40 minutes)"
 *   "Part IV Translation (30 minutes)"
 * 全卷 130 分钟。
 */
export type ExamPart = "writing" | "listening" | "reading" | "translation";

export const PART_ORDER: ExamPart[] = ["writing", "listening", "reading", "translation"];

export const EXAM_PART_LIMIT: Record<ExamPart, { minutes: number; label: string; en: string }> = {
  writing: { minutes: 30, label: "写作", en: "Part I · Writing" },
  listening: { minutes: 30, label: "听力", en: "Part II · Listening" },
  reading: { minutes: 40, label: "阅读", en: "Part III · Reading" },
  translation: { minutes: 30, label: "翻译", en: "Part IV · Translation" },
};

export function partLimitSec(part: ExamPart): number {
  return EXAM_PART_LIMIT[part].minutes * 60;
}

export function partOfUnit(paper: Paper, unitId: string): ExamPart {
  if (paper.listeningUnits.some((u) => u.id === unitId)) return "listening";
  if (paper.readingSections.some((s) => s.id === unitId)) return "reading";
  return unitId === "writing" ? "writing" : "translation";
}

export function unitsOfPart(paper: Paper, part: ExamPart): string[] {
  if (part === "listening") return paper.listeningUnits.map((u) => u.id);
  if (part === "reading") return paper.readingSections.map((s) => s.id);
  return [part];
}

/** mm:ss */
export function clock(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** 人话版时长，例如 "40 分钟" */
export function minutesLabel(sec: number): string {
  return `${Math.round(sec / 60)} 分钟`;
}

export interface ExamSession {
  part: ExamPart;
  limitSec: number;
  startedAt: number;
  /** 交卷时刻 */
  submittedAt?: number;
  /** 交卷时记录的真实用时（秒）—— 不是计划时长，是真的花了多久 */
  elapsedSec?: number;
}

export function remainingSec(session: ExamSession | undefined, now: number): number | null {
  if (!session) return null;
  const endsAtMs = session.startedAt + session.limitSec * 1000;
  const reference = session.submittedAt ?? now;
  return Math.max(0, (endsAtMs - reference) / 1000);
}
