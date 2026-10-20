"use client";

import { use } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { PaperHeader } from "@/components/paper/paper-header";
import { scoreOf, usePaperAttempt } from "@/components/paper/use-attempt";
import { getPaper } from "@/lib/papers";
import { PaperBrowser } from "@/components/paper/paper-browser";

export default function PaperPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = use(params);
  const paper = getPaper(paperId);
  const { attempt, reset } = usePaperAttempt(paperId);

  if (!paper) {
    return (
      <AppShell>
        <PaperHeader eyebrow="PAPER BANK" title="没找到这套卷" href="/papers" />
        <div className="px-5">
          <EmptyState
            title="这套真题还没入库"
            description="只进了 2025.12 第一套，其他场次还在整理。"
          />
        </div>
      </AppShell>
    );
  }

  const answers = attempt?.answers ?? {};
  const score = scoreOf(paper, answers);

  return (
    <AppShell>
      <PaperHeader eyebrow="PAPER" title={paper.titleEn} href="/papers" />

      <div className="px-5">
        <div className="rotate-[-0.5deg] rounded-card bg-lavender p-5 text-on-accent shadow-hard">
          <p className="eyebrow">YOUR SCORE</p>
          <p className="num mt-2 text-[44px] leading-none font-black tracking-[-0.03em]">
            {score.correct}
            <span className="text-on-accent/40"> / {score.total}</span>
          </p>
          <p className="mt-2 text-label">
            已答 {score.answered} / {score.total} 题 · 分数只存在这台设备上
          </p>
          {attempt && attempt.updatedAt > 0 ? (
            <button
              type="button"
              onClick={reset}
              className="tap mt-4 rounded-btn border-2 border-dashed border-fg/30 px-4 py-2 text-caption font-bold"
            >
              清空本套作答
            </button>
          ) : null}
        </div>
      </div>

      {/*
        往下就是全部内容：四个 Part 左右滑，听力与阅读再按 Section、题段滑。
        每个 Part 的开考 / 交卷状态由它自己面板里的计时条负责。
      */}
      <div className="px-5 pt-6">
        <PaperBrowser paper={paper} />
      </div>

      <div className="h-8" />
    </AppShell>
  );
}
