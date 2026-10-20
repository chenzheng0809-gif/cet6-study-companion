"use client";

/**
 * 首页。
 *
 * 整页只回答一个问题：**现在打开，我该做哪一件事？**
 *
 * 所以上面那一大块是 Today's Focus —— 一项，不是十条。
 * 下面一行是 Daily Habits（单词 / 精听），它们是习惯不是任务：
 * 不做不欠账、不进任何"应该完成"的统计，只是顺手能点到的入口。
 *
 * 没有进度条、没有"今日完成 2/5"、没有欠账提示。
 * 现在没有排给学生的日程，所以也就没有"该完成"这个概念。
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  BookMarked,
  Check,
  ChevronRight,
  Flame,
  Headphones,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardLarge } from "@/components/ui/card";
import { Chip } from "@/components/ui/choice";
import { Field, TextInput } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { OffsiteSheet } from "@/components/today/offsite-sheet";
import { BottomLineLyric, Mood, StreakMood } from "@/components/mood/mood-line";
import { logStudy } from "@/lib/repo";
import { WEAK_AREA_LABEL, type WeakArea } from "@/lib/journey";
import type { FocusCandidate } from "@/hooks/use-study";
import { greeting, useRequireProfile, useTodayData } from "@/hooks/use-study";
import { taskTypeMeta } from "@/lib/journey-types";

export default function TodayPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, loaded } = useRequireProfile();
  const data = useTodayData();
  const [offsiteOpen, setOffsiteOpen] = useState(false);
  const [lightOpen, setLightOpen] = useState(false);

  if (!loaded || !profile || !data) {
    return (
      <AppShell>
        <PageSkeleton />
      </AppShell>
    );
  }

  const { focus, focusOptions, shuffle, todayLogs, habits, week, streak, stage, daysLeft } =
    data;
  const hello = greeting();

  async function startFocus(candidate: FocusCandidate | undefined) {
    if (!candidate) return;
    if (candidate.paperUnitId) {
      router.push(`/papers/2025-12-set1?unit=${candidate.paperUnitId}`);
      return;
    }
    if (candidate.type === "vocab") {
      router.push("/vocab");
      return;
    }
    if (candidate.type === "intensive-listen") {
      router.push(`/papers/2025-12-set1?unit=l-r1`);
      return;
    }
    router.push("/practice");
  }

  async function finishFocus(candidate: FocusCandidate | undefined) {
    if (!candidate) return;
    await logStudy({
      title: candidate.title,
      type: candidate.type,
      source: candidate.from === "weekly-goal" ? "weekly-goal" : candidate.from === "habit" ? "habit" : "practice",
      goalItemId: candidate.id.startsWith("goal-") ? candidate.id.slice(5) : undefined,
      paperId: candidate.paperId,
      paperUnitId: candidate.paperUnitId,
      examPart: candidate.examPart,
    });
    toast({ title: "记下了" });
  }

  const meta = focus ? taskTypeMeta(focus.type) : null;

  return (
    <AppShell>
      <div className="color-field px-5 pt-[max(20px,env(safe-area-inset-top))] pb-9">
        <span aria-hidden className="sticker -top-12 -right-10 size-40 bg-lavender" />
        <span aria-hidden className="sticker right-28 -bottom-14 size-28 bg-coral" />

        <p className="eyebrow-field relative">{hello.en}</p>
        <h1 className="relative mt-3 text-title font-black tracking-[-0.03em] text-primary-fg">
          {hello.zh}
        </h1>
        <p className="relative mt-2 text-caption text-fg-muted">
          {stage.name}
          {daysLeft !== null ? ` · 距考试 ${daysLeft} 天` : " · 还没定考期"}
          {streak > 0 ? ` · 连续 ${streak} 天` : ""}
        </p>
      </div>

      <div className="space-y-3 px-5 pt-6 pb-9">
        {/* ---------------------------------------------- Today's Focus */}
        {focus ? (
          <CardLarge className="rotate-tilt-a p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="eyebrow">Today&apos;s Focus</p>
              {meta && meta.label !== focus.title ? <Chip tone="primary">{meta.label}</Chip> : null}
            </div>

            <h2 className="mt-3 text-[26px] leading-tight font-black tracking-[-0.03em]">
              {focus.title}
            </h2>
            {focus.basis ? (
              <p className="mt-2 rounded-row bg-surface-2 p-2.5 text-caption leading-relaxed text-fg-muted">
                <span className="font-black">为什么是这个 · </span>
                {focus.basis}
              </p>
            ) : (
              <p className="mt-2 text-caption leading-relaxed text-fg-muted">{focus.hint}</p>
            )}

            <div className="mt-4 space-y-2">
              <Button block onClick={() => void startFocus(focus)} leadingIcon={<ArrowUpRight className="size-4" />}>
                开始训练
              </Button>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 whitespace-nowrap"
                  onClick={() => void finishFocus(focus)}
                  leadingIcon={<Check className="size-4" />}
                >
                  记一笔
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 whitespace-nowrap"
                  onClick={() => {
                    // 「换一项」只换掉眼前这一项显示的内容，不动今天已经做了什么
                    if (focusOptions.length > 1) shuffle();
                    else toast({ title: "就这一个了", description: "想练别的去 Practice 挑。", tone: "info" });
                  }}
                  leadingIcon={<RefreshCw className="size-4" />}
                >
                  换一项
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 whitespace-nowrap"
                  onClick={() => setLightOpen(true)}
                  leadingIcon={<Sparkles className="size-4" />}
                >
                  轻松学
                </Button>
              </div>
            </div>
          </CardLarge>
        ) : null}

        {/* ---------------------------------------------- Daily Habits */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="eyebrow">Daily Habits</p>
            <button
              type="button"
              onClick={() => setOffsiteOpen(true)}
              className="tap flex items-center gap-1 rounded-pill bg-surface-2 px-3 py-1.5 text-caption font-black"
            >
              <Plus className="size-3.5" strokeWidth={3} />
              站外记录
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            <HabitRow
              done={habits.vocab}
              title="单词"
              icon={<BookMarked className="size-4" strokeWidth={2.6} />}
              onOpen={() => router.push("/vocab")}
              onLog={() => void logStudy({ title: "单词", type: "vocab", source: "habit" })}
            />
            <HabitRow
              done={habits.listening}
              title="精听"
              icon={<Headphones className="size-4" strokeWidth={2.6} />}
              onOpen={() => router.push("/papers/2025-12-set1?unit=l-r1")}
              onLog={() =>
                void logStudy({ title: "精听", type: "intensive-listen", source: "habit" })
              }
            />
          </ul>
          {todayLogs.length > 0 ? (
            <BottomLineLyric which="habit" className="mt-2.5" />
          ) : null}
        </Card>

        {/* ---------------------------------------------- 今天做了什么 */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="eyebrow">今天做了什么</p>
            <span className="num text-caption text-fg-muted">{todayLogs.length} 条</span>
          </div>
          {todayLogs.length === 0 ? (
            <div className="mt-2">
              <Mood scene="return" />
            </div>
          ) : (
            <ul className="mt-2.5 space-y-1.5">
              {todayLogs.map((l) => (
                <li key={l.id} className="flex items-center gap-2 text-[13px]">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-fg">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{l.title}</span>
                  <span className="text-caption text-fg-subtle">
                    {sourceLabel(l.source)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* ---------------------------------------------- 本周 */}
        <CardLarge className="rotate-tilt-c bg-lavender p-5 text-on-accent">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-black">这周</p>
              <p className="num mt-1 text-[34px] leading-none font-black tracking-[-0.03em]">
                {week.studyDays}
                <span className="text-[15px] opacity-70"> 天有记录</span>
              </p>
            </div>
            {streak > 0 ? (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-on-accent px-3 py-1.5 text-[12px] font-bold text-lavender">
                <Flame className="size-3.5" /> 连续 {streak} 天
              </span>
            ) : null}
          </div>
          <StreakMood
            streak={streak}
            engagedToday={todayLogs.length > 0}
            tone="onAccent"
            className="mt-3 opacity-90"
          />

          <div className="mt-4 flex items-center justify-between text-caption font-bold opacity-80">
            <span>
              本周推荐 {data.plan?.goals.length ?? 0} 项 · 完成{" "}
              {data.plan?.goals.filter((g) => g.done).length ?? 0} 项
            </span>
            <button
              type="button"
              onClick={() => router.push("/plan")}
              className="tap flex items-center gap-1 underline underline-offset-2"
            >
              看看这周 <ChevronRight className="size-3.5" />
            </button>
          </div>
        </CardLarge>

        {profile.weakAreas.length > 0 ? (
          <Card className="p-3.5">
            <p className="text-caption text-fg-muted">
              你标的弱项：
              {profile.weakAreas
                .map((w) => WEAK_AREA_LABEL[w as WeakArea] ?? w)
                .join("、")}
            </p>
          </Card>
        ) : null}

      </div>

      <OffsiteSheet open={offsiteOpen} onClose={() => setOffsiteOpen(false)} />

      <Sheet
        open={lightOpen}
        onClose={() => setLightOpen(false)}
        eyebrow="Light Mode"
        title="今天轻松学"
        footer={
          <Button
            className="w-full"
            onClick={async () => {
              await logStudy({ title: "轻松学", source: "offsite", detail: "首页 · 今天轻松学" });
              setLightOpen(false);
              toast({ title: "接上了", tone: "success" });
            }}
          >
            就这样，做了一件
          </Button>
        }
      >
        <Field label="想做什么都行">
          <TextInput placeholder="比如：读了一篇外刊" maxLength={40} />
        </Field>
      </Sheet>
    </AppShell>
  );
}

function HabitRow({
  done,
  title,
  hint,
  icon,
  onOpen,
  onLog,
}: {
  done: boolean;
  title: string;
  /** 没有就不显示那行副标题 —— 少一句是一句 */
  hint?: string;
  icon: React.ReactNode;
  onOpen: () => void;
  onLog: () => void;
}) {
  return (
    <li className="flex items-center gap-2.5 rounded-row bg-surface-2 p-3">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-full ${
          done ? "bg-primary text-primary-fg" : "bg-surface text-fg-muted"
        }`}
      >
        {done ? <Check className="size-4" strokeWidth={3} /> : icon}
      </span>
      <button type="button" onClick={onOpen} className="tap min-w-0 flex-1 text-left">
        <span className={`block text-[14px] font-black ${done ? "line-through opacity-60" : ""}`}>
          {title}
        </span>
        {done || hint ? (
          <span className="block text-caption text-fg-muted">{done ? "今天做过了" : hint}</span>
        ) : null}
      </button>
      {!done ? (
        <button
          type="button"
          onClick={onLog}
          className="tap shrink-0 rounded-pill bg-surface px-3 py-1.5 text-caption font-black"
        >
          记一笔
        </button>
      ) : null}
    </li>
  );
}

function sourceLabel(source: string): string {
  switch (source) {
    case "focus":
      return "今日推荐";
    case "habit":
      return "习惯";
    case "practice":
      return "自主练习";
    case "weekly-goal":
      return "本周目标";
    default:
      return "站外";
  }
}

export { Target };
