"use client";

import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Headphones, Pause, Play, RotateCcw, Square } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/papers";
import type { AnswerKey, Choice, Question, ReadingSection } from "@/lib/papers/types";

/* ------------------------------------------------------------ audio window */

/** 倍速档：慢一点听清 / 原速 / 快一点对答案。学生自己选，不替他决定。 */
const PLAYBACK_RATES = [0.8, 1, 1.5] as const;

/**
 * 播放器对外的动作。
 *
 * 听力题按考场规矩是不显示题干的，做题时想再听一次某一道题的题干，
 * 就得让播放器能只播那一小段 —— 整段从头听是找不到的。
 */
export interface AudioWindowHandle {
  /** 只播这一段，播完自动停 */
  playRange: (startSec: number, endSec: number, label?: string) => void;
  /** 退出聚焦，回到整段 */
  clearFocus: () => void;
}

export function AudioWindow({
  src,
  startSec,
  endSec,
  label,
  ref,
  onFocusEnd,
}: {
  src: string;
  startSec: number;
  endSec: number;
  label: string;
  ref?: React.Ref<AudioWindowHandle>;
  /** 聚焦区间播完时通知外面（题卡上"正在重听"的状态要跟着收） */
  onFocusEnd?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  /** 拖动中：用 ref 存，pointermove 里读到的必须是当下的值，不能是渲染那一刻的旧值 */
  const draggingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(startSec);
  const [rate, setRate] = useState<number>(1);
  const [dragging, setDragging] = useState(false);
  /** 正在重听的那一小段。非空时只播这一段，轨道上用一条带标出来。 */
  const [focus, setFocus] = useState<{ startSec: number; endSec: number; label: string } | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      /* 有聚焦就播到聚焦的尾巴，没有就播到整段的尾巴 */
      const stopAt = focus ? focus.endSec : endSec;
      if (el.currentTime >= stopAt) {
        el.pause();
        const backTo = focus ? focus.startSec : startSec;
        el.currentTime = backTo;
        setPlaying(false);
        setPos(backTo);
        if (focus) {
          setFocus(null);
          onFocusEnd?.();
        }
        return;
      }
      setPos(el.currentTime);
    };
    const onEnd = () => {
      const backTo = focus ? focus.startSec : startSec;
      el.currentTime = backTo;
      setPlaying(false);
      setPos(backTo);
      if (focus) {
        setFocus(null);
        onFocusEnd?.();
      }
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnd);
    };
  }, [endSec, startSec, focus, onFocusEnd]);

  /* 倍速：改的是播放器自己，播放途中改立刻生效 */
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = rate;
  }, [rate]);

  /**
   * 只播这一段。
   *
   * 全部在事件回调里做（不是 effect 里），所以不会踩"effect 里同步 setState"那条线。
   */
  const playRange = (from: number, to: number, text?: string) => {
    const el = audioRef.current;
    if (!el) return;
    setFocus({ startSec: from, endSec: to, label: text ?? "" });
    el.currentTime = from;
    setPos(from);
    void el.play();
    setPlaying(true);
  };

  const clearFocus = () => setFocus(null);

  useImperativeHandle(
    ref,
    () => ({
      playRange,
      clearFocus,
    }),
    [],
  );

  const play = async () => {
    const el = audioRef.current;
    if (!el) return;
    const from = focus ? focus.startSec : startSec;
    const until = focus ? focus.endSec : endSec;
    if (el.currentTime < from || el.currentTime >= until) el.currentTime = from;
    await el.play();
    setPlaying(true);
  };

  const stop = () => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = startSec;
    setPos(startSec);
    setPlaying(false);
    setFocus(null);
  };

  /** 跳到本段里的某个时间点。 */
  const seekTo = (t: number) => {
    const el = audioRef.current;
    if (!el) return;
    const clamped = Math.max(startSec, Math.min(endSec, t));
    el.currentTime = clamped;
    setPos(clamped);
  };

  /** 轨道上的横坐标 → 本段里的时间点 */
  const ratioAt = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setDragging(true);
    seekTo(startSec + ratioAt(e.clientX) * (endSec - startSec));
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    seekTo(startSec + ratioAt(e.clientX) * (endSec - startSec));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  /** 键盘也能拖：左右键在本段里前后走 5 秒，按住 Shift 走 15 秒。 */
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      seekTo(pos - step);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      seekTo(pos + step);
    } else if (e.key === "Home") {
      e.preventDefault();
      seekTo(startSec);
    } else if (e.key === "End") {
      e.preventDefault();
      seekTo(endSec);
    }
  };

  const pct = Math.max(0, Math.min(1, (pos - startSec) / (endSec - startSec)));
  const span = Math.max(1, endSec - startSec);
  /** 聚焦区间在轨道上的位置：正在重听的那一小段用高亮笔标出来 */
  const focusPct = focus
    ? {
        left: Math.max(0, Math.min(100, ((focus.startSec - startSec) / span) * 100)),
        width: Math.max(1, Math.min(100, ((focus.endSec - focus.startSec) / span) * 100)),
      }
    : null;

  return (
    <div className="rounded-card bg-surface p-5 shadow-hard">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow text-fg-muted">LISTENING</p>
          <p className="mt-1 truncate text-label font-bold">{label}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => (playing ? stop() : play())}
            className={cn(
              "tap grid size-12 place-items-center rounded-btn bg-primary text-on-accent shadow-hard-sm",
            )}
            aria-label={playing ? "停止" : focus ? "重听这一小段" : "播放本段"}
          >
            {playing ? <Pause className="size-5" strokeWidth={3} /> : <Play className="size-5" strokeWidth={3} />}
          </button>
          <button
            type="button"
            onClick={stop}
            className="tap grid size-12 place-items-center rounded-btn bg-surface-2 text-fg"
            aria-label="重置到本段开头"
          >
            <Square className="size-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* 正在重听哪一道题，得说清楚 —— 不然学生不知道自己在听什么 */}
      {focus ? (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-row bg-marker px-3 py-2">
          <p className="num truncate text-caption font-black text-marker-fg">
            正在重听{focus.label || "这一段"} · {formatTime(focus.startSec)} – {formatTime(focus.endSec)}
          </p>
          <button
            type="button"
            onClick={clearFocus}
            className="tap shrink-0 text-caption font-black text-marker-fg underline underline-offset-4"
          >
            退出
          </button>
        </div>
      ) : null}

      {/*
        进度条可以直接拖：解析的时候反复回听某一句是最常见的动作，
        只能听不能定位就没法用。轨道是 slider，键盘也能走。
      */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="本段播放进度"
        aria-valuemin={Math.round(startSec)}
        aria-valuemax={Math.round(endSec)}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={formatTime(pos)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="relative mt-4 h-5 w-full touch-none select-none"
      >
        <div className="absolute inset-x-0 top-1 h-3 overflow-hidden rounded-pill bg-surface-3">
          <div
            className={cn("h-full bg-primary", dragging ? "" : "transition-[width] duration-150")}
            style={{ width: `${pct * 100}%` }}
          />
          {/*
            正在重听的那一小段。
            一道题的题干只有 3–6 秒，整段却有三四分钟 —— 按比例画出来只有 2% 宽，
            等于看不见。所以给它一个最小宽度并压一道黑边，窄也看得出是个记号。
          */}
          {focusPct ? (
            <div
              aria-hidden
              className="absolute inset-y-0 min-w-[8px] border-2 border-fg bg-marker"
              style={{ left: `${focusPct.left}%`, width: `${focusPct.width}%` }}
            />
          ) : null}
        </div>
        <div
          aria-hidden
          className="absolute top-0 size-5 -translate-x-1/2 rounded-full bg-primary shadow-hard-sm"
          style={{ left: `${pct * 100}%` }}
        />
      </div>

      <div className="num mt-2 flex items-center justify-between gap-3 text-caption font-bold text-fg-muted">
        <span>{formatTime(pos)}</span>
        <span>本段 {formatTime(startSec)} – {formatTime(endSec)}</span>
      </div>

      <div className="mt-3 flex items-center gap-1.5" role="group" aria-label="播放速度">
        <span className="eyebrow mr-1 text-fg-muted">速度</span>
        {PLAYBACK_RATES.map((r) => (
          <button
            key={r}
            type="button"
            data-rate={r}
            onClick={() => setRate(r)}
            aria-pressed={rate === r}
            className={cn(
              "tap num rounded-pill px-2.5 py-1 text-eyebrow font-black",
              rate === r ? "bg-primary text-on-accent" : "bg-surface-2 text-fg-muted",
            )}
          >
            {r === 1 ? "原速" : `${r}×`}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- options */

export function OptionRow({
  choice,
  state,
  onPick,
  hideChinese = false,
}: {
  choice: Choice;
  state: "idle" | "picked" | "right" | "wrong";
  onPick: () => void;
  hideChinese?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "tap flex w-full items-start gap-3 rounded-row border-2 px-4 py-3 text-left",
        state === "idle" && "border-transparent bg-surface-2",
        state === "picked" && "border-fg bg-primary-soft",
        state === "right" && "border-fg bg-mint-soft",
        state === "wrong" && "border-fg bg-coral-soft",
      )}
    >
      <span
        className={cn(
          "num mt-px grid size-7 shrink-0 place-items-center rounded-pill text-caption font-black",
          state === "idle" && "bg-surface text-fg-muted",
          (state === "picked" || state === "right" || state === "wrong") && "bg-fg text-bg",
        )}
      >
        {choice.key}
      </span>
      <span className="min-w-0 flex-1">
        {choice.en ? (
          <span className="block text-body leading-relaxed">{choice.en}</span>
        ) : null}
        {choice.zh && !hideChinese ? (
          <span className={cn("block text-label", choice.en ? "mt-1 text-fg-muted" : "")}>
            {choice.zh}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function CompactOption({
  label,
  sub,
  state,
  onPick,
}: {
  label: string;
  sub?: string;
  state: "idle" | "picked" | "right" | "wrong";
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={cn(
        "tap rounded-row border-2 px-3 py-2.5 text-left",
        state === "idle" && "border-transparent bg-surface-2",
        state === "picked" && "border-fg bg-primary-soft",
        state === "right" && "border-fg bg-mint-soft",
        state === "wrong" && "border-fg bg-coral-soft",
      )}
    >
      <span className="num block text-body font-black">{label}</span>
      {sub ? <span className="mt-0.5 block text-caption text-fg-muted">{sub}</span> : null}
    </button>
  );
}

/* --------------------------------------------------------------- question */

export function QuestionBlock({
  q,
  answer,
  revealed,
  onAnswer,
  onReveal,
  options,
  lockReveal = false,
  hideChinese = false,
  hideStem = false,
  collapseExplain = false,
  onReplay,
  replayActive = false,
}: {
  q: Question;
  answer?: string;
  revealed: boolean;
  onAnswer: (key: string) => void;
  onReveal: () => void;
  options: { key: AnswerKey; en?: string; zh?: string }[];
  /** 沉浸模式：不给"看解析"按钮，解析只能通过交卷解锁 */
  lockReveal?: boolean;
  /** 沉浸模式：题干译文和中文选项一起隐藏，做题全程只给英文 */
  hideChinese?: boolean;
  /**
   * 听力用：不显示题干，只留四个选项。
   * 这是真实的练法 —— 先扫选项知道要听什么，再听，比边听边看长句有效得多。
   * 前提是每道听力题都必须有选项，否则藏掉题干就变成没法做的题。
   */
  hideStem?: boolean;
  /** 中文解析先收起来，想看再点 */
  collapseExplain?: boolean;
  /**
   * 听力用：只重听这一道题的题干。
   * 题干是按考场规矩藏起来的，学生想回头再听一次那道题，
   * 没有这个入口就只能整段从头听 —— 那等于没有。
   */
  onReplay?: () => void;
  /** 这一题是不是正在重听 */
  replayActive?: boolean;
}) {
  const [showExplain, setShowExplain] = useState(false);

  return (
    <div className="rounded-card bg-surface p-5 shadow-hard-sm">
      <div className="flex items-start gap-3">
        <span className="num grid size-8 shrink-0 place-items-center rounded-pill bg-fg text-caption font-black text-bg">
          {q.n}
        </span>
        <div className="min-w-0 flex-1">
          {hideStem ? (
            <p className="text-caption font-bold text-fg-muted">
              只看选项，听音频作答。
            </p>
          ) : (
            <p className="text-body leading-relaxed font-bold">{q.stem}</p>
          )}
          {!hideStem && q.stemZh && !hideChinese ? (
            <p className="mt-1 text-label text-fg-muted">{q.stemZh}</p>
          ) : null}
          {onReplay ? (
            <button
              type="button"
              onClick={onReplay}
              aria-pressed={replayActive}
              aria-label={`重听第 ${q.n} 题的题干`}
              className={cn(
                "tap mt-2 inline-flex items-center gap-1.5 rounded-pill border-2 px-2.5 py-1 text-caption font-bold",
                replayActive
                  ? "border-marker bg-marker text-marker-fg"
                  : "border-fg/20 bg-surface-2 text-fg-muted",
              )}
            >
              <Headphones className="size-3.5" strokeWidth={3} />
              重听本题
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {options.map((o) => {
          const isAnswer = o.key === q.answer;
          const isPicked = answer === o.key;
          const state: "idle" | "picked" | "right" | "wrong" = !revealed
            ? isPicked
              ? "picked"
              : "idle"
            : isAnswer
              ? "right"
              : isPicked
                ? "wrong"
                : "idle";
          return (
            <OptionRow
              key={o.key}
              choice={o}
              state={state}
              hideChinese={hideChinese}
              onPick={() => onAnswer(o.key)}
            />
          );
        })}
      </div>

      {!revealed && !lockReveal ? (
        <button
          type="button"
          onClick={onReveal}
          className="tap mt-4 w-full rounded-btn border-2 border-dashed border-fg/25 bg-surface-2 py-2.5 text-label font-bold"
        >
          看解析
        </button>
      ) : revealed ? (
        <div className="mt-4 rounded-row bg-surface-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-pill bg-fg px-3 py-1 text-caption font-black text-bg">
              正确答案 {q.answer}
            </span>
            {answer === q.answer ? (
              <span className="rounded-pill bg-mint px-3 py-1 text-caption font-bold">你答对了</span>
            ) : answer ? (
              <span className="rounded-pill bg-coral px-3 py-1 text-caption font-bold">
                你选了 {answer}
              </span>
            ) : (
              <span className="rounded-pill bg-surface-3 px-3 py-1 text-caption font-bold text-fg-muted">
                还没作答
              </span>
            )}
          </div>
          {q.evidence ? (
            <p className="mt-3 border-l-4 border-fg pl-3 text-label leading-relaxed text-fg-muted">
              {q.evidence}
            </p>
          ) : null}

          {collapseExplain && !showExplain ? (
            <button
              type="button"
              onClick={() => setShowExplain(true)}
              className="tap mt-3 w-full rounded-btn border-2 border-dashed border-fg/25 py-2.5 text-label font-bold"
            >
              看中文解析
            </button>
          ) : (
            <>
              <p className="mt-3 text-label leading-relaxed">{q.explain}</p>
              {collapseExplain ? (
                <button
                  type="button"
                  onClick={() => setShowExplain(false)}
                  className="tap mt-3 text-caption font-bold text-fg-muted underline underline-offset-4"
                >
                  收起中文
                </button>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------- section option lists */

export function sectionOptions(section: ReadingSection): { key: AnswerKey; en?: string; zh?: string }[] {
  if (section.kind === "bank") {
    return (section.bank ?? []).map((b) => ({ key: b.key, en: b.word, zh: b.pos }));
  }
  if (section.kind === "matching") {
    return (section.paragraphs ?? []).map((p) => ({ key: p.label as AnswerKey }));
  }
  return [];
}

export function ResetRow({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="tap inline-flex items-center gap-2 rounded-btn border-2 border-dashed border-fg/25 px-4 py-2 text-caption font-bold"
    >
      <RotateCcw className="size-3.5" strokeWidth={3} />
      清空本套作答
    </button>
  );
}
