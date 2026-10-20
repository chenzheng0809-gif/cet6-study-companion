/**
 * Local-date helpers. Every date in the app is a plain "YYYY-MM-DD" key in the
 * student's own timezone — never a UTC timestamp — so a task always lands on the
 * day the student actually did it.
 */

export type DateKey = string; // YYYY-MM-DD

const WEEKDAY_LABELS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"] as const;

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function toKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromKey(key: DateKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function todayKey(): DateKey {
  return toKey(new Date());
}

export function addDays(key: DateKey, days: number): DateKey {
  const d = fromKey(key);
  d.setDate(d.getDate() + days);
  return toKey(d);
}

/** 0 = Monday … 6 = Sunday */
export function dayIndex(key: DateKey): number {
  const js = fromKey(key).getDay();
  return (js + 6) % 7;
}

export function startOfWeek(key: DateKey): DateKey {
  return addDays(key, -dayIndex(key));
}

export function endOfWeek(key: DateKey): DateKey {
  return addDays(startOfWeek(key), 6);
}

export function weekdayLabel(key: DateKey): string {
  return WEEKDAY_LABELS[dayIndex(key)];
}

export function weekdayShort(key: DateKey): string {
  return weekdayLabel(key).replace("周", "");
}

export function formatMonthDay(key: DateKey): string {
  const d = fromKey(key);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatFullDate(key: DateKey): string {
  const d = fromKey(key);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export function daysBetween(from: DateKey, to: DateKey): number {
  const ms = fromKey(to).getTime() - fromKey(from).getTime();
  return Math.round(ms / 86400000);
}

export function isPast(key: DateKey, reference: DateKey = todayKey()): boolean {
  return daysBetween(key, reference) > 0;
}

export function isToday(key: DateKey): boolean {
  return key === todayKey();
}

export function rangeKeys(start: DateKey, end: DateKey): DateKey[] {
  const out: DateKey[] = [];
  let cursor = start;
  let guard = 0;
  while (daysBetween(cursor, end) >= 0 && guard < 400) {
    out.push(cursor);
    cursor = addDays(cursor, 1);
    guard += 1;
  }
  return out;
}

export function weekKeys(anyKey: DateKey = todayKey()): DateKey[] {
  const start = startOfWeek(anyKey);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** Minutes → "25 分钟" / "1 小时 10 分" */


export function uid(prefix = "id"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}_${rand}`;
}

export function monthKey(key: DateKey): string {
  return key.slice(0, 7);
}

export function startOfMonthKey(year: number, month: number): DateKey {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

export function endOfMonthKey(year: number, month: number): DateKey {
  return `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;
}

export function addMonths(key: DateKey, delta: number): DateKey {
  const d = fromKey(key);
  const next = new Date(d.getFullYear(), d.getMonth() + delta, 1);
  return toKey(next);
}
