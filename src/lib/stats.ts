/**
 * 统计 —— **只读学习记录表**，不做任何推断。
 *
 * 这里有三条底线，改产品定位的时候最容易踩：
 *
 * 1. 一天算不算"学了"，只看 `logs` 里有没有当天的真实记录。
 *    没记录就是没学，不猜、不补。
 * 2. 不预测六级分数。四级分和六级分之间没有可靠换算关系，
 *    所以任何"按你的四级分预计你能考多少"都是编的，一律不做。
 * 3. 不统计"应完成vs实际完成"。没有排给学生的日程，
 *    也就没有欠账 —— 完成率这个概念在这里被整个删掉了。
 *
 * 首页和日历只问三个问题：今天做了什么、这周做了什么、连续多少天。
 */

import { addDays, daysBetween, startOfWeek, todayKey, type DateKey } from "./date";
import type { StudyLog } from "./types";

export interface DayStat {
  date: DateKey;
  /** 当天真实记录条数 */
  entries: number;
  units: number;
  isToday: boolean;
  isFuture: boolean;
  /** 当天做了哪些事，标题去重 */
  titles: string[];
}

export function dayStat(logs: StudyLog[], date: DateKey, reference: DateKey = todayKey()): DayStat {
  const dayLogs = logs.filter((l) => l.date === date);
  return {
    date,
    entries: dayLogs.length,
    units: dayLogs.reduce((n, l) => n + l.units, 0),
    isToday: date === reference,
    isFuture: daysBetween(date, reference) < 0,
    titles: [...new Set(dayLogs.map((l) => l.title))],
  };
}

export interface WeekStat {
  weekStart: DateKey;
  days: DayStat[];
  /** 本周有记录的天数 */
  studyDays: number;
  units: number;
  entries: number;
  /** 按类型分组，用于周报里说"这周练了什么" */
  byType: { type: string; count: number }[];
}

/**
 * 本周概览。
 *
 * 注意这里**没有 completion / plannedDays**：
 * 没有排给学生的日程，就没有"应完成"这个分母。
 */
export function weekStat(
  logs: StudyLog[],
  anchor: DateKey = todayKey(),
): WeekStat {
  const weekStart = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => dayStat(logs, addDays(weekStart, i), anchor));
  const inWeek = logs.filter((l) => l.date >= weekStart && l.date <= addDays(weekStart, 6));

  const counts = new Map<string, number>();
  for (const l of inWeek) {
    const key = l.type ?? l.source;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return {
    weekStart,
    days,
    studyDays: days.filter((d) => !d.isFuture && d.entries > 0).length,
    units: inWeek.reduce((n, l) => n + l.units, 0),
    entries: inWeek.length,
    byType: [...counts.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count),
  };
}

/**
 * 连续学习天数。
 *
 * 只数"有真实记录的天"。今天还没开始不会打断昨天的连续 ——
 * 学生是晚上十点打开App的人，不能因为"今天还没学"就把连击清零。
 */
export function currentStreak(
  logs: StudyLog[],
  reference: DateKey = todayKey(),
): number {
  const days = new Set(logs.map((l) => l.date));
  let cursor = reference;
  let streak = 0;
  if (!days.has(cursor)) cursor = addDays(cursor, -1);
  while (days.has(cursor) && streak < 9999) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function totalStudyDays(logs: StudyLog[]): number {
  return new Set(logs.map((l) => l.date)).size;
}

export function hasActivity(logs: StudyLog[], date: DateKey): boolean {
  return logs.some((l) => l.date === date);
}

/** 月视图：每天的记录数，供日历画格子。 */
export function monthGrid(
  logs: StudyLog[],
  year: number,
  month: number,
  reference: DateKey = todayKey(),
): Map<DateKey, DayStat> {
  const days = new Date(year, month, 0).getDate();
  const map = new Map<DateKey, DayStat>();
  for (let d = 1; d <= days; d += 1) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    map.set(key, dayStat(logs, key, reference));
  }
  return map;
}

export interface MonthStat {
  studyDays: number;
  units: number;
  entries: number;
  /** 哪几天完全没记录 —— 只作描述，不说成"缺卡" */
  quietDays: number;
}

export function monthStat(
  logs: StudyLog[],
  year: number,
  month: number,
  reference: DateKey = todayKey(),
): MonthStat {
  const grid = monthGrid(logs, year, month, reference);
  const rows = [...grid.values()].filter((d) => !d.isFuture);
  return {
    studyDays: rows.filter((d) => d.entries > 0).length,
    units: rows.reduce((n, d) => n + d.units, 0),
    entries: rows.reduce((n, d) => n + d.entries, 0),
    quietDays: rows.filter((d) => d.entries === 0).length,
  };
}
