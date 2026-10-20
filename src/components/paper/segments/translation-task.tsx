"use client";

import { Collapsible, LockedPanel, PartSessionBar } from "@/components/paper/exam-shell";
import { usePaperAttempt } from "@/components/paper/use-attempt";
import { partLimitSec } from "@/lib/papers/exam-clock";
import type { Paper, TranslationTask } from "@/lib/papers/types";

/**
 * 翻译 Part 的全部内容：计时条 + 汉语原文 + 草稿 + 交卷后才解锁的参考译文与译点精析。
 *
 * 考场时长取自 EXAM_PART_LIMIT（试卷 Directions 上的官方 30 分钟），不在这里写死。
 * 外层容器负责 px-5 的留白。
 */
export function TranslationTaskSegment({
  paper,
  translation,
  headingLevel = 2,
}: {
  paper: Paper;
  translation: TranslationTask;
  /** 深链页传 1，滑动浏览里嵌在 Part 里传 2 */
  headingLevel?: 1 | 2;
}) {
  const { drafts, sessionOf, isSubmitted, setDraft, startSession, submitSession, reset } =
    usePaperAttempt(paper.id);

  const Title = headingLevel === 1 ? "h1" : "h2";
  const session = sessionOf("translation");
  const submitted = isSubmitted("translation");
  const draft = drafts.translation ?? "";
  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  const restart = async () => {
    await reset();
    window.location.reload();
  };

  return (
    <>
      <div className="pt-[max(16px,env(safe-area-inset-top))]">
        <p className="eyebrow text-fg-muted">Part IV · Translation</p>
        <Title className="mt-1 text-section font-black tracking-[-0.02em]">Chinese to English</Title>
      </div>

      <div className="mt-2">
        <PartSessionBar
          part="translation"
          session={session}
          answered={0}
          total={0}
          showCount={false}
          onStart={() => startSession("translation", partLimitSec("translation"))}
          onSubmit={() => submitSession("translation")}
          onRestart={restart}
        />

        <section className="rounded-card bg-surface p-4 shadow-hard-sm">
          <p className="eyebrow text-fg-muted">SOURCE · 逐句译</p>
          <div className="scroll-fade mt-2 max-h-[26vh] overflow-y-auto overscroll-contain text-body leading-[1.9]">
            {translation.zh}
          </div>
        </section>

        <section className="mt-3 rounded-card bg-surface p-4 shadow-hard">
          <div className="flex items-center justify-between gap-2">
            <p className="eyebrow text-fg-muted">YOUR TRANSLATION</p>
            <span
              className={
                "num rounded-pill px-2.5 py-1 text-caption font-black " +
                (words === 0 ? "bg-surface-2 text-fg-muted" : "bg-primary text-on-accent")
              }
            >
              {words} 词
            </span>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft("translation", e.target.value)}
            placeholder="写英文译文。"
            className="mt-3 max-h-[38vh] min-h-[28vh] w-full resize-none overflow-y-auto rounded-row bg-surface-2 p-4 text-body leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-fg"
          />
        </section>

        {!submitted ? (
          <div className="mt-3">
            <LockedPanel title="参考译文还没解锁" onSubmit={() => submitSession("translation")} />
          </div>
        ) : (
          <>
            <Collapsible className="mt-4" title="参考译文" hint="逐句对一下" defaultOpen>
              <p className="text-body leading-[1.75]">{translation.reference}</p>
            </Collapsible>

            {translation.points?.length ? (
              <Collapsible className="mt-3" title="译点精析" hint={`${translation.points.length} 条`}>
                <ol className="grid gap-2">
                  {translation.points.map((p, i) => (
                    <li key={i} className="text-label leading-relaxed">
                      {i + 1}. {p}
                    </li>
                  ))}
                </ol>
              </Collapsible>
            ) : null}

            {translation.notes?.length ? (
              <Collapsible className="mt-3" title="难词译法" hint={`${translation.notes.length} 条`}>
                <dl className="grid gap-1.5">
                  {translation.notes.map((n) => (
                    <div key={n.en} className="flex flex-wrap gap-x-2 text-label">
                      <dt className="font-bold">{n.en}</dt>
                      <dd className="text-fg-muted">{n.zh}</dd>
                    </div>
                  ))}
                </dl>
              </Collapsible>
            ) : null}

            <p className="num mt-4 text-center text-caption text-fg-subtle">
              {words} 词 · 已存到本机
            </p>
          </>
        )}

        <div className="h-6" />
      </div>
    </>
  );
}
