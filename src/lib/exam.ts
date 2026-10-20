/**
 * CET-6 exam sessions.
 *
 * CET-6 is normally held on a Saturday in mid-June and mid-December. The exact
 * date is only announced each year by 全国大学英语四、六级考试委员会, so we
 * generate an estimate (the Saturday nearest the 15th) and always let the
 * student correct it. We never present the estimate as an official date.
 */

import { fromKey, toKey, todayKey, type DateKey } from "./date";

export interface ExamSession {
  id: string;
  label: string;
  /** estimated date, YYYY-MM-DD */
  date: DateKey;
  isEstimate: true;
}

/** Saturday nearest the 15th of the given month. */
function saturdayNearestMidMonth(year: number, month: number): DateKey {
  const fifteenth = new Date(year, month - 1, 15);
  const js = fifteenth.getDay();
  const offset = js === 6 ? 0 : js < 6 ? 6 - js : js - 6;
  fifteenth.setDate(15 + offset);
  return toKey(fifteenth);
}

function session(year: number, month: number): ExamSession {
  return {
    id: `${year}-${pad2(month)}`,
    label: `${year} 年 ${month} 月`,
    date: saturdayNearestMidMonth(year, month),
    isEstimate: true,
  };
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/** Upcoming sessions only: this year's and next year's June + December. */
export function upcomingSessions(reference: DateKey = todayKey()): ExamSession[] {
  const year = fromKey(reference).getFullYear();
  const candidates = [
    session(year, 6),
    session(year, 12),
    session(year + 1, 6),
    session(year + 1, 12),
  ];
  return candidates.filter((s) => fromKey(s.date) >= fromKey(reference));
}

export function defaultSession(reference: DateKey = todayKey()): ExamSession {
  const upcoming = upcomingSessions(reference);
  return upcoming[0] ?? session(fromKey(reference).getFullYear() + 2, 6);
}

export function findSession(id: string): ExamSession | undefined {
  const [year, month] = id.split("-").map(Number);
  if (!year || !month) return undefined;
  return session(year, month);
}

export interface Countdown {
  days: number;
  label: string;
  isPast: boolean;
}

/** Dynamic countdown — always derived from the exam date, never hard-coded. */
export function countdownTo(examDate: DateKey, reference: DateKey = todayKey()): Countdown {
  const target = fromKey(examDate);
  const today = fromKey(reference);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const days = Math.round((end.getTime() - start.getTime()) / 86400000);

  if (days > 0) {
    return { days, label: "天后开考", isPast: false };
  }
  if (days === 0) {
    return { days: 0, label: "就是今天", isPast: false };
  }
  const weeks = Math.ceil(Math.abs(days) / 7);
  return { days, label: `天前已结束 · 已复习 ${weeks} 周`, isPast: true };
}
