"use client";

import { Collapsible, LockedPanel, PartSessionBar } from "@/components/paper/exam-shell";
import { usePaperAttempt } from "@/components/paper/use-attempt";
import { partLimitSec } from "@/lib/papers/exam-clock";
import type { Paper, WritingTask } from "@/lib/papers/types";

/**
 * 写作 Part 的全部内容：计时条 + 题面 + 草稿 + 交卷后才解锁的审题与范文。
 *
 * 考场时长取自 EXAM_PART_LIMIT（试卷 Directions 上的官方 30 分钟），不在这里写死。
 * 外层容器负责 px-5 的留白。
 */
export function WritingTaskSegment({
  paper,
  writing,
  headingLevel = 2,
}: {
  paper: Paper;
  writing: WritingTask;
  /** 深链页传 1，滑动浏览里嵌在 Part 里传 2 */
  headingLevel?: 1 | 2;
}) {
  const { drafts, sessionOf, isSubmitted, setDraft, startSession, submitSession, reset } =
    usePaperAttempt(paper.id);

  const Title = headingLevel === 1 ? "h1" : "h2";
  const session = sessionOf("writing");
  const submitted = isSubmitted("writing");
  const draft = drafts.writing ?? "";
  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const inRange = words >= writing.minWords && words <= writing.maxWords;

  const restart = async () => {
    await reset();
    window.location.reload();
  };

  return (
    <>
      <div className="pt-[max(16px,env(safe-area-inset-top))]">
        <p className="eyebrow text-fg-muted">Part I · Writing</p>
        <Title className="mt-1 text-section font-black tracking-[-0.02em]">Writing</Title>
      </div>

      <div className="mt-2">
        <PartSessionBar
          part="writing"
          session={session}
          answered={0}
          total={0}
          showCount={false}
          onStart={() => startSession("writing", partLimitSec("writing"))}
          onSubmit={() => submitSession("writing")}
          onRestart={restart}
        />

        <section className="rounded-card bg-surface p-4 shadow-hard-sm">
          <p className="eyebrow text-fg-muted">
            PROMPT · {writing.minWords}–{writing.maxWords} WORDS
          </p>
          <p className="mt-2 text-body leading-relaxed font-bold">{writing.prompt}</p>
        </section>

        <section className="mt-3 rounded-card bg-surface p-4 shadow-hard">
          <div className="flex items-center justify-between gap-2">
            <p className="eyebrow text-fg-muted">YOUR DRAFT</p>
            <span
              className={
                "num rounded-pill px-2.5 py-1 text-caption font-black " +
                (words === 0
                  ? "bg-surface-2 text-fg-muted"
                  : inRange
                    ? "bg-mint text-mint-fg"
                    : "bg-coral text-coral-fg")
              }
            >
              {words} 词
            </span>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft("writing", e.target.value)}
            placeholder="在这里写。"
            className="mt-3 max-h-[42vh] min-h-[30vh] w-full resize-none overflow-y-auto rounded-row bg-surface-2 p-4 text-body leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-fg"
          />
          {words > 0 && !inRange ? (
            <p className="num mt-2 text-caption text-coral-fg">
              {words < writing.minWords
                ? `还差 ${writing.minWords - words} 词到下限`
                : `超了 ${words - writing.maxWords} 词，阅卷会扣分`}
            </p>
          ) : null}
        </section>

        {!submitted ? (
          <div className="mt-3">
            <LockedPanel title="审题和范文还没解锁" onSubmit={() => submitSession("writing")} />
          </div>
        ) : (
          <>
            <Collapsible className="mt-4" title="审题" hint="这道题在考什么">
              <p className="text-label leading-relaxed">{writing.brief}</p>
            </Collapsible>

            {writing.notes?.length ? (
              <Collapsible className="mt-3" title="表达升级" hint={`${writing.notes.length} 条`}>
                <dl className="grid gap-1.5">
                  {writing.notes.map((n) => (
                    <div key={n.en} className="flex flex-wrap gap-x-2 text-label">
                      <dt className="font-bold">{n.en}</dt>
                      <dd className="text-fg-muted">{n.zh}</dd>
                    </div>
                  ))}
                </dl>
              </Collapsible>
            ) : null}

            <Collapsible className="mt-3" title="参考范文" hint="先自己写完再看">
              <div className="grid gap-3">
                {writing.sampleEssay.split(/\n\s*\n/).map((p, i) => (
                  <p key={i} className="text-body leading-[1.75]">
                    {p}
                  </p>
                ))}
              </div>
            </Collapsible>

            {writing.comments?.length ? (
              <Collapsible className="mt-3" title="点评" hint={`${writing.comments.length} 条`}>
                <ol className="grid gap-2">
                  {writing.comments.map((c, i) => (
                    <li key={i} className="text-label leading-relaxed">
                      {i + 1}. {c}
                    </li>
                  ))}
                </ol>
              </Collapsible>
            ) : null}

            {writing.sampleTranslation ? (
              <Collapsible className="mt-3" title="范文译文">
                <div className="grid gap-3">
                  {writing.sampleTranslation.split(/\n\s*\n/).map((p, i) => (
                    <p key={i} className="text-body leading-[1.75] text-fg-muted">
                      {p}
                    </p>
                  ))}
                </div>
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
