"use client";

/**
 * 我的 —— 档案、设置、数据。
 *
 * 这一页只摆**事实**，不摆评价：
 * 报过的成绩、定的考期、标的弱项，都是你自己填的，原样显示。
 * 刻意不放"能力表现""进度评估"这类东西 ——
 * 四级分换不出六级水平，系统凭什么替你评估？
 */

import { useState } from "react";
import { CalendarDays, Settings as SettingsIcon, Target } from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardLarge } from "@/components/ui/card";
import { Chip } from "@/components/ui/choice";
import { PageSkeleton } from "@/components/ui/skeleton";
import { SettingsSheet } from "@/components/settings-sheet";
import { formatFullDate, todayKey } from "@/lib/date";
import { daysUntilExam } from "@/lib/journey";
import { WEAK_AREAS } from "@/lib/journey";
import { BOTTOM_LINE } from "@/lib/copy";
import { useRequireProfile } from "@/hooks/use-study";

export default function MePage() {
  const { profile, loaded } = useRequireProfile();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!loaded || !profile) {
    return (
      <AppShell>
        <PageSkeleton />
      </AppShell>
    );
  }

  const daysLeft = daysUntilExam(profile.examDate, todayKey());
  const weakLabels = profile.weakAreas
    .map((w) => WEAK_AREAS.find((a) => a.value === w)?.label ?? w)
    .join("、");

  return (
    <AppShell>
      <div className="color-field px-5 pt-[max(20px,env(safe-area-inset-top))] pb-9">
        <span aria-hidden className="sticker -top-12 -right-10 size-40 bg-lavender" />
        <p className="eyebrow-field relative">Me</p>
        <h1 className="relative mt-3 text-title font-black tracking-[-0.03em] text-primary-fg">
          你的档案。
        </h1>
      </div>

      <div className="space-y-3 px-5 pt-6 pb-9">
        <CardLarge className="rotate-tilt-a p-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" strokeWidth={2.6} />
            <span className="text-[15px] font-black">考试</span>
            {daysLeft !== null ? (
              <span className="num ml-auto text-caption font-bold text-fg-muted">
                {daysLeft >= 0 ? `还有 ${daysLeft} 天` : "已过考期"}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-[15px] font-black tracking-[-0.02em]">
            {formatFullDate(profile.examDate)}
          </p>
        </CardLarge>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Target className="size-4 shrink-0" strokeWidth={2.6} />
            <span className="text-[15px] font-black">成绩</span>
          </div>
          <dl className="mt-3 space-y-2">
            <Row label="四级总分" value={profile.cet4Score === null ? "没填" : `${profile.cet4Score} 分`} />
            <Row
              label="六级经历"
              value={
                profile.cet6History === "taken"
                  ? `考过${profile.cet6PastScore === null ? "" : `，${profile.cet6PastScore} 分`}`
                  : "没考过"
              }
            />
            <Row label="六级目标" value={`${profile.targetScore} 分`} />
          </dl>
          <p className="mt-3 text-caption text-fg-subtle">{BOTTOM_LINE.score}</p>
        </Card>

        <Card className="p-4">
          <p className="eyebrow">你标的弱项</p>
          <p className="mt-1.5 text-[15px] leading-relaxed font-black">
            {weakLabels || "还没标"}
          </p>
          {weakLabels ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {profile.weakAreas.map((w) => (
                <Chip key={w} tone="lavender">
                  {WEAK_AREAS.find((a) => a.value === w)?.label ?? w}
                </Chip>
              ))}
            </div>
          ) : null}
        </Card>

        <Button
          block
          size="lg"
          leadingIcon={<SettingsIcon className="size-[18px]" />}
          onClick={() => setSettingsOpen(true)}
        >
          主题与数据备份
        </Button>

        <p className="px-1 text-center text-caption text-fg-subtle">{BOTTOM_LINE.privacy}</p>
      </div>

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-caption text-fg-muted">{label}</dt>
      <dd className="num text-[15px] font-black">{value}</dd>
    </div>
  );
}
