"use client";

/**
 * 学习记录日历。
 *
 * 这一页只回答一个问题：**我到底练过什么**。
 * 所以它只读 `logs`，一个格子亮不亮只取决于那天有没有真实记录，
 * 不看计划、不看档位、不看任何"本该完成"的东西。
 *
 * 刻意删掉的三样东西：
 *   · 计划完成率 —— 没有排给学生的日程，就没有应完成这个分母，算出来也是假的
 *   · 休息日     —— 不再让用户为"哪天空着"额外做一次决定
 *   · 缺卡       —— 哪天没记录就是哪天没记录，写成"缺卡"是在给平淡的一天加罪名
 *
 * 没记录的那天是空白的，不是红色的。
 */

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { Card, CardLarge } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/feedback";
import { PageSkeleton } from "@/components/ui/skeleton";
import {
  addDays,
  dayIndex,
  endOfMonthKey,
  formatMonthDay,
  startOfMonthKey,
  todayKey,
  weekdayLabel,
  type DateKey,
} from "@/lib/date";
import { currentStreak, dayStat, monthStat, totalStudyDays, type DayStat } from "@/lib/stats";
import { BottomLineLyric, Mood } from "@/components/mood/mood-line";
import { useAllLogs, useRequireProfile } from "@/hooks/use-study";
import type { LogSource, StudyLog } from "@/lib/types";
import { cn } from "@/lib/cn";

const WEEK_HEAD = ["一", "二", "三", "四", "五", "六", "日"];

/** 五种来源都是"我练了"，只是入口不同，所以语气保持一致 */
const SOURCE_LABEL: Record<LogSource, string> = {
  focus: "首页推荐",
  habit: "每日习惯",
  practice: "自主练习",
  "weekly-goal": "本周目标",
  offsite: "站外补记",
};

// 空数组必须是模块级常量：每次渲染新建一个会让下游 useMemo 一直失效
const NO_LOGS: StudyLog[] = [];

export default function CalendarPage() {
  const { profile, loaded } = useRequireProfile();
  const logs = useAllLogs() ?? NO_LOGS;
  const today = todayKey();
  const [cursor, setCursor] = useState(() => ({
    year: Number(today.slice(0, 4)),
    month: Number(today.slice(5, 7)),
  }));
  const [picked, setPicked] = useState<DateKey | null>(null);

  const monthStart = startOfMonthKey(cursor.year, cursor.month);
  const monthEnd = endOfMonthKey(cursor.year, cursor.month);

  // 月视图靠前后补空格对齐星期，补出来的日子不属于本月，用 inMonth 区分
  const gridStart = addDays(monthStart, -dayIndex(monthStart));
  const cells = useMemo(() => {
    const out: { date: DateKey; inMonth: boolean }[] = [];
    for (let i = 0; i < 42; i += 1) {
      const date = addDays(gridStart, i);
      out.push({ date, inMonth: date >= monthStart && date <= monthEnd });
      if (i >= 34 && date >= monthEnd) break;
    }
    return out;
  }, [gridStart, monthEnd, monthStart]);

  const stats = useMemo(
    () => monthStat(logs, cursor.year, cursor.month, today),
    [logs, cursor, today],
  );
  const streak = useMemo(() => currentStreak(logs, today), [logs, today]);
  const allTime = useMemo(() => totalStudyDays(logs), [logs]);

  const cellStat = useMemo(() => {
    const map = new Map<DateKey, DayStat>();
    for (const cell of cells) {
      if (cell.inMonth) map.set(cell.date, dayStat(logs, cell.date, today));
    }
    return map;
  }, [cells, logs, today]);

  if (!loaded || !profile) {
    return (
      <AppShell>
        <PageSkeleton />
      </AppShell>
    );
  }

  const monthLabel = `${cursor.year} 年 ${cursor.month} 月`;
  const thisMonth = cursor.year === Number(today.slice(0, 4)) && cursor.month === Number(today.slice(5, 7));
  const canGoNext = cursor.year < Number(today.slice(0, 4)) ||
    (cursor.year === Number(today.slice(0, 4)) && cursor.month < Number(today.slice(5, 7)));

  return (
    <AppShell>
      <div className="px-5 pt-[max(20px,env(safe-area-inset-top))] pb-9">
        <span aria-hidden className="sticker -top-10 -right-8 size-32 bg-mint" />
        <p className="eyebrow-field relative">Records</p>
        <h1 className="relative mt-3 text-title font-black tracking-[-0.03em] text-primary-fg">
          你练过的，都在上面。
        </h1>

        <CardLarge className="rotate-tilt-a mt-6 p-5">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="本月练习" value={stats.studyDays} unit="天" hint="有记录的天数" />
            <Stat label="连续" value={streak} unit="天" hint="今天没练也不会清零" />
            <Stat label="累计" value={allTime} unit="天" hint="从开始到现在" />
          </div>
          {stats.entries > 0 ? (
            <p className="mt-3 text-caption text-fg-muted">
              这个月记了 {stats.entries} 笔，合计 {stats.units} 个训练模块。
            </p>
          ) : null}
        </CardLarge>

        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="上个月"
              onClick={() =>
                setCursor((c) =>
                  c.month === 1 ? { year: c.year - 1, month: 12 } : { year: c.year, month: c.month - 1 },
                )
              }
              className="tap grid size-10 place-items-center rounded-full bg-surface-2"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-[16px] font-black">{monthLabel}</span>
            <button
              type="button"
              aria-label="下个月"
              disabled={!canGoNext}
              onClick={() =>
                setCursor((c) =>
                  c.month === 12 ? { year: c.year + 1, month: 1 } : { year: c.year, month: c.month + 1 },
                )
              }
              className="tap grid size-10 place-items-center rounded-full bg-surface-2 disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1">
            {WEEK_HEAD.map((w) => (
              <div key={w} className="py-1 text-center text-caption text-fg-subtle">
                {w}
              </div>
            ))}
            {cells.map((cell) => {
              const stat = cellStat.get(cell.date);
              const entries = stat?.entries ?? 0;
              const isFuture = cell.date > today;
              const pickedThis = picked === cell.date;
              return (
                <button
                  key={cell.date}
                  type="button"
                  onClick={() => setPicked(cell.date)}
                  aria-label={`${formatMonthDay(cell.date)} ${entries > 0 ? `${entries} 条记录` : "没有记录"}`}
                  aria-pressed={pickedThis}
                  className={cn(
                    "tap relative flex aspect-square flex-col items-center justify-center rounded-row text-[13px] font-bold",
                    !cell.inMonth && "opacity-25",
                    entries > 0 && "bg-primary text-primary-fg",
                    entries === 0 && !isFuture && cell.inMonth && "bg-surface-2/50 text-fg-muted",
                    isFuture && "bg-transparent text-fg-subtle",
                    cell.date === today && "ring-2 ring-coral",
                    pickedThis && "ring-2 ring-fg",
                  )}
                >
                  <span className="num">{Number(cell.date.slice(8, 10))}</span>
                  {entries > 0 ? (
                    <span className="num text-[9px] leading-none opacity-70">{entries}</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-caption text-fg-muted">
            <Legend tone="bg-primary text-primary-fg">有记录</Legend>
            <Legend tone="bg-surface-2/50">没记录</Legend>
            <Legend tone="bg-transparent ring-1 ring-border">还没到</Legend>
          </div>
        </Card>

        {stats.entries === 0 && stats.quietDays > 0 && !thisMonth && !picked ? (
          <>
            <Mood scene="night" className="mb-3" />
            <EmptyState
            title={`${cursor.month} 月没有记录`}
            description="这个月还没练过。"
          />
          </>
        ) : null}

        {picked ? <PickedDay date={picked} logs={logs} /> : null}
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: number;
  unit: string;
  hint: string;
}) {
  return (
    <div>
      <p className="text-caption text-fg-muted">{label}</p>
      <p className="num mt-1 text-[28px] leading-none font-black">
        {value}
        <span className="text-[13px] font-bold">{unit}</span>
      </p>
      <p className="mt-1 text-caption text-fg-subtle">{hint}</p>
    </div>
  );
}

function Legend({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-3 rounded-[4px]", tone)} />
      {children}
    </span>
  );
}

function PickedDay({ date, logs }: { date: DateKey; logs: StudyLog[] }) {
  const dayLogs = logs.filter((l) => l.date === date).sort((a, b) => a.createdAt - b.createdAt);

  return (
    <Card className="mt-4 p-4">
      <p className="text-[15px] font-black">
        {formatMonthDay(date)} {weekdayLabel(date)}
        {date === todayKey() ? " · 今天" : ""}
      </p>

      {dayLogs.length === 0 ? (
        <BottomLineLyric which="missed" className="mt-2" />
      ) : (
        <ul className="mt-3 space-y-2">
          {dayLogs.map((log) => (
            <li key={log.id} className="flex items-start gap-2.5">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-black text-primary-fg">
                ✓
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[14px] font-black">{log.title}</span>
                  <span className="text-caption text-fg-subtle">{SOURCE_LABEL[log.source]}</span>
                </span>
                {log.detail ? (
                  <span className="mt-0.5 block text-caption leading-relaxed text-fg-muted">
                    {log.detail}
                  </span>
                ) : null}
              </span>
              {log.units > 0 ? (
                <span className="num shrink-0 text-caption font-bold text-fg-muted">
                  {log.units} 模块
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export { Flame };
