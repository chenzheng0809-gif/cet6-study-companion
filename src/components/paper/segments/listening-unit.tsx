"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { getListeningUnit, unitAudioRange, formatTime } from "@/lib/papers";
import { partLimitSec, unitsOfPart } from "@/lib/papers/exam-clock";
import type { ListeningUnit, Paper } from "@/lib/papers/types";
import { AudioWindow, Collapsible, LockedPanel, PartSessionBar, type AudioWindowHandle } from "@/components/paper/exam-shell";
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
  const { answers, revealed, sessionOf, isSubmitted, setAnswer, revealMany, startSession, submitSession, finishUnit, reset } =
    usePaperAttempt(paper.id);
  const [vocabSeed, setVocabSeed] = useState<VocabSeed | null>(null);
  /** 播放器：重听某道题时要命令它跳到那一小段 */
  const audioRef = useRef<AudioWindowHandle | null>(null);
  /** 正在重听哪一道题 */
  const [replaying, setReplaying] = useState<number | null>(null);
  /** 最后放过的那一道 —— 放过就能一键再听一次 */
  const [played, setPlayed] = useState<number | null>(null);
  /** 正在重听的是哪一道。事件回调里读它，不能靠 setState 的 updater。 */
  const replayingRef = useRef<number | null>(null);

  const questions = useMemo(
    () =>
      paper.questions.filter(
        (q) => q.n >= unit.questionRange[0] && q.n <= unit.questionRange[1],
      ),
    [paper, unit],
  );

  /** 本段的完整可播区间：原文 + 全部题号播报 + 答题停顿 */
  const audioRange = unitAudioRange(unit);

  /** 每一道题的题干在音频里的区间（真实检测值，没有这一项就没有重听入口） */
  const windows = useMemo(() => {
    const map = new Map<number, { startSec: number; endSec: number }>();
    for (const w of unit.questionWindows ?? []) map.set(w.n, w);
    return map;
  }, [unit]);

  /** 播放器放完这一小段，题卡上的"正在重听"要跟着收，并且记住放过哪一道 */
  const clearReplay = useCallback(() => {
    setPlayed(replayingRef.current);
    replayingRef.current = null;
    setReplaying(null);
  }, []);

  /** 只重听这一道题的题干 */
  const replay = (n: number) => {
    const w = windows.get(n);
    if (!w) return;
    replayingRef.current = n;
    setReplaying(n);
    audioRef.current?.playRange(w.startSec, w.endSec, `第 ${n} 题`);
  };

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
    /* 这一段练完了 —— 真题推荐靠这个换到下一段 / 下一套 */
    await finishUnit(unit.id);
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
          ref={audioRef}
          src={paper.timing.audioPath}
          /* 播到最后一个题号的停顿结束，不停在第一题 */
          startSec={audioRange.startSec}
          endSec={audioRange.endSec}
          label={unit.label}
          onFocusEnd={clearReplay}
        />

        <div className="mt-3 grid gap-3">
          {questions.map((q) => {
            const w = windows.get(q.n);
            return (
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
                /* 中文解析默认展开，太长了可以自己收起 */
                collapseExplain
                /* 题干藏起来了，得给一个单独重听它的入口 */
                onReplay={w ? () => replay(q.n) : undefined}
                replayActive={replaying === q.n}
                replayPlayed={replaying !== q.n && played === q.n}
                /* 落点标出来：点之前就知道会跳到哪一秒 */
                replayAt={w ? formatTime(w.startSec) : undefined}
                replayRange={w ? `${formatTime(w.startSec)} – ${formatTime(w.endSec)}` : undefined}
              />
            );
          })}
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
