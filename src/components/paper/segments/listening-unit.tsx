"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { getListeningUnit } from "@/lib/papers";
import { partLimitSec, unitsOfPart } from "@/lib/papers/exam-clock";
import type { ListeningUnit, Paper } from "@/lib/papers/types";
import { AudioWindow, Collapsible, LockedPanel, PartSessionBar } from "@/components/paper/exam-shell";
import { QuestionBlock } from "@/components/paper/parts";
import { TappableText } from "@/components/paper/tappable-text";
import { VocabSheet, type VocabSeed } from "@/components/paper/vocab-sheet";
import { usePaperAttempt } from "@/components/paper/use-attempt";

/**
 * 一段听力题的全部内容：计时条 + 音频窗口 + 逐题作答 + 交卷后才解锁的东西。
 *
 * 独立成组件是为了让两种入口共用同一份实现：
 * 老的深链 /papers/{paperId}/listening/{unitId} 和真题页里的左右滑动都走它，
 * 沉浸锁、计时刻度、原文展示一个都不会走样。
 * 外层容器负责 px-5 的留白。
 */
export function ListeningUnitSegment({
  paper,
  unit,
  headingLevel = 2,
  showSiblings = true,
}: {
  paper: Paper;
  unit: ListeningUnit;
  /** 深链页传 1，滑动浏览里嵌在 Part 里传 2 */
  headingLevel?: 1 | 2;
  /** 滑动浏览里已经有 chip 行做跳转，不用再塞一份"其他段" */
  showSiblings?: boolean;
}) {
  const { answers, revealed, sessionOf, isSubmitted, setAnswer, revealMany, startSession, submitSession, reset } =
    usePaperAttempt(paper.id);
  const [vocabSeed, setVocabSeed] = useState<VocabSeed | null>(null);

  const questions = useMemo(
    () =>
      paper.questions.filter(
        (q) => q.n >= unit.questionRange[0] && q.n <= unit.questionRange[1],
      ),
    [paper, unit],
  );

  if (!paper.timing) return null;

  const Title = headingLevel === 1 ? "h1" : "h2";
  const session = sessionOf("listening");
  const submitted = isSubmitted("listening");
  const questionNos = questions.map((q) => q.n);
  const answeredCount = questions.filter((q) => answers[q.n]).length;
  const correct = questions.filter((q) => answers[q.n] && answers[q.n] === q.answer).length;

  /** 交卷 = 解锁：一次开考记录里所有题的解析 */
  const submit = async () => {
    await submitSession("listening");
    await revealMany(questionNos);
  };

  const restart = async () => {
    await reset();
    window.location.reload();
  };

  const others = showSiblings
    ? unitsOfPart(paper, "listening").filter((id) => id !== unit.id)
    : [];

  /** 在原文里点到哪个词就收哪个词。 */
  const openWord = (word: string) =>
    setVocabSeed({
      word,
      sourcePaperId: paper.id,
      sourceLabel: `${paper.titleEn} · ${unit.label}`,
      sourceHref: `/papers/${paper.id}/listening/${unit.id}`,
    });

  return (
    <>
      <div className="pt-[max(16px,env(safe-area-inset-top))]">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-fg-muted">
              第 {unit.questionRange[0]}–{unit.questionRange[1]} 题
            </p>
            <Title className="mt-1 text-section font-black tracking-[-0.02em]">{unit.label}</Title>
          </div>
          {submitted ? (
            <span className="num shrink-0 rounded-pill bg-primary px-2.5 py-1 text-caption font-black shadow-hard-sm">
              {correct}/{questions.length}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-2">
        <PartSessionBar
          part="listening"
          session={session}
          answered={answeredCount}
          total={questions.length}
          onStart={() => startSession("listening", partLimitSec("listening"))}
          onSubmit={submit}
          onRestart={restart}
        />

        <AudioWindow
          src={paper.timing.audioPath}
          startSec={unit.window.startSec}
          endSec={unit.window.endSec}
          label={unit.label}
        />

        <div className="mt-3 grid gap-3">
          {questions.map((q) => (
            <QuestionBlock
              key={q.n}
              q={q}
              answer={answers[q.n]}
              revealed={revealed.includes(q.n)}
              onAnswer={(key) => setAnswer(q.n, key)}
              onReveal={() => revealMany([q.n])}
              options={q.options ?? []}
              lockReveal={!submitted}
              hideChinese={!submitted}
              /* 听力不显示题干：先扫选项知道要听什么，再听 */
              hideStem
              /* 中文解析先收起来，想看再点 */
              collapseExplain
            />
          ))}
        </div>

        {!submitted ? (
          <div className="mt-3">
            <LockedPanel title="原文和解析还没解锁" onSubmit={submit} />
          </div>
        ) : (
          <>
            <Collapsible
              className="mt-4"
              title="听力原文"
              hint={`${unit.transcript.length} 句 · 带数字的是那题的原句`}
              defaultOpen
            >
              <div className="grid gap-2">
                {unit.transcript.map((s) => {
                  const mark = s.marks?.find(
                    (m) => m >= unit.questionRange[0] && m <= unit.questionRange[1],
                  );
                  return (
                    <div key={s.id} className="rounded-row bg-surface px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        {s.speaker ? (
                          <span
                            className={cn(
                              "mt-px grid size-5 shrink-0 place-items-center rounded-pill text-eyebrow font-black",
                              s.speaker === "W"
                                ? "bg-coral text-coral-fg"
                                : "bg-lavender text-on-accent",
                            )}
                          >
                            {s.speaker}
                          </span>
                        ) : null}
                        <p className="min-w-0 flex-1 text-label leading-relaxed">
                          <TappableText text={s.en} onWord={openWord} />
                        </p>
                        {mark ? (
                          <span className="num shrink-0 rounded-pill bg-fg px-2 py-0.5 text-eyebrow font-black text-bg">
                            {mark}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Collapsible>

            {unit.notes?.length ? (
              <Collapsible className="mt-3" title="这一段的生词" hint={`${unit.notes.length} 个`}>
                <dl className="grid gap-1.5">
                  {unit.notes.map((n) => (
                    <div key={n.en} className="flex flex-wrap items-baseline gap-x-2 text-label">
                      <dt className="font-bold">{n.en}</dt>
                      <dd className="text-fg-muted">{n.zh}</dd>
                    </div>
                  ))}
                </dl>
              </Collapsible>
            ) : null}

            {others.length ? (
              <Collapsible className="mt-3" title="这一 Part 的其他段" hint="连着做完更接近考场" dense>
                <div className="grid gap-1.5">
                  {others.map((id) => {
                    const u = getListeningUnit(paper, id);
                    if (!u) return null;
                    return (
                      <a
                        key={id}
                        href={`/papers/${paper.id}/listening/${id}`}
                        className="tap flex items-center gap-2 rounded-row bg-surface px-3 py-2.5"
                      >
                        <span className="num shrink-0 rounded-pill bg-fg px-2 py-0.5 text-eyebrow font-black text-bg">
                          {u.questionRange[0]}–{u.questionRange[1]}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-label font-bold">{u.label}</span>
                      </a>
                    );
                  })}
                </div>
              </Collapsible>
            ) : null}

            <p className="num mt-4 text-center text-caption text-fg-subtle">
              答对 {correct}/{questions.length} · 已看解析{" "}
              {revealed.filter((n) => questionNos.includes(n)).length}/{questions.length}
            </p>
          </>
        )}

        <div className="h-6" />
      </div>

      <VocabSheet seed={vocabSeed} open={Boolean(vocabSeed)} onClose={() => setVocabSeed(null)} />
    </>
  );
}
