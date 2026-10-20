"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronDown, Lock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { clock, EXAM_PART_LIMIT, remainingSec, type ExamPart, type ExamSession } from "@/lib/papers/exam-clock";
import { AudioWindow } from "./parts";

export { AudioWindow };

/* ------------------------------------------------------------- 考场倒计时 */

/**
 * 顶部常驻的考场计时条，四个 Part 共用。
 * 时长是试卷 Directions 里的官方数字，不是估的；
 * 剩余时间来自用户真实的开考时刻，交卷后记录真实用掉的秒数。
 */
export function PartSessionBar({
  part,
  session,
  answered,
  total,
  onStart,
  onSubmit,
  onRestart,
  showCount = true,
}: {
  part: ExamPart;
  session?: ExamSession;
  answered: number;
  total: number;
  onStart: () => void;
  onSubmit: () => void;
  onRestart: () => void;
  /** 写作 / 翻译没有"答对几题"，这一段可以直接不显示 */
  showCount?: boolean;
}) {
  const [now, setNow] = useState(() => Date.now());
  const running = !!session && !session.submittedAt;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  const limit = EXAM_PART_LIMIT[part];
  const left = remainingSec(session, now);
  const expired = running && (left ?? 0) <= 0;

  return (
    <div className="sticky top-0 z-30 -mx-5 mb-3 border-b-2 border-border bg-surface px-5 py-2.5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-fg-muted">{limit.en}</p>
          <p className="num mt-0.5 truncate text-caption font-bold text-fg-muted">
            考场 {limit.minutes} 分钟
            {showCount ? ` · 已答 ${answered}/${total}` : ""}
          </p>
        </div>

        {!session ? (
          <button
            type="button"
            onClick={onStart}
            className="tap shrink-0 rounded-btn bg-primary px-4 py-2.5 text-label font-black shadow-press-lime"
          >
            开考
          </button>
        ) : session.submittedAt ? (
          <button
            type="button"
            onClick={onRestart}
            className="tap inline-flex shrink-0 items-center gap-1 rounded-btn border-2 border-dashed border-fg/30 px-3 py-2 text-caption font-bold"
          >
            <RotateCcw className="size-3.5" strokeWidth={3} />
            重考
          </button>
        ) : (
          <>
            <span
              className={cn(
                "num shrink-0 rounded-btn px-2.5 py-2 text-label font-black tabular-nums",
                (left ?? 0) <= 60 ? "bg-coral text-coral-fg" : "bg-fg text-bg",
              )}
            >
              {clock(left ?? 0)}
            </span>
            <button
              type="button"
              onClick={onSubmit}
              className="tap shrink-0 rounded-btn bg-surface-2 px-3.5 py-2.5 text-label font-black"
            >
              交卷
            </button>
          </>
        )}
      </div>

      {expired ? (
        <p className="mt-1.5 rounded-row bg-coral-soft px-3 py-1.5 text-caption font-bold text-coral-fg">
          时间到，可以交卷了。
        </p>
      ) : session?.submittedAt ? (
        <p className="num mt-1.5 text-caption text-fg-subtle">
          已交卷 · 实际用了 {elapsedLabel(session.elapsedSec ?? 0)}
          {(() => {
            const savedSec = session.limitSec - (session.elapsedSec ?? session.limitSec);
            // 不足一分钟的差额不拿"分钟"去凑，否则会出现"用了 1 分钟，
            // 比考场少 30 分钟"这种自相矛盾的话
            return savedSec >= 60 ? ` · 比考场少 ${Math.floor(savedSec / 60)} 分钟` : "";
          })()}
        </p>
      ) : null}
    </div>
  );
}

/** 已用时长的诚实表述：一分钟以内给秒数，不硬凑成"1 分钟"。 */
function elapsedLabel(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  if (s < 60) return `${s} 秒`;
  return `${Math.floor(s / 60)} 分 ${String(s % 60).padStart(2, "0")} 秒`;
}

/* ------------------------------------------------------------- 折叠区块 */

export function Collapsible({
  title,
  hint,
  children,
  defaultOpen = false,
  dense = false,
  className = "",
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  dense?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={cn("rounded-row bg-surface-2", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "tap flex w-full items-center gap-3 text-left",
          dense ? "px-4 py-2.5" : "px-4 py-3.5",
        )}
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-label font-black">{title}</span>
          {hint ? <span className="mt-0.5 block truncate text-caption text-fg-muted">{hint}</span> : null}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform duration-200", open && "rotate-180")}
          strokeWidth={3}
        />
      </button>
      {open ? <div className={cn(dense ? "px-4 pb-3" : "px-4 pb-4")}>{children}</div> : null}
    </section>
  );
}

/* -------------------------------------------------------- 交卷前的锁定态 */

export function LockedPanel({ title, onSubmit }: { title: string; onSubmit: () => void }) {
  return (
    <div className="rounded-card border-2 border-dashed border-fg/25 bg-surface-2 p-5 text-center">
      <span className="mx-auto grid size-11 place-items-center rounded-full bg-surface">
        <Lock className="size-4" strokeWidth={3} />
      </span>
      <p className="mt-3 text-label font-black">{title}</p>
      <button
        type="button"
        onClick={onSubmit}
        className="tap mt-4 w-full rounded-btn bg-primary py-3 text-label font-black shadow-press-lime"
      >
        交卷，看解析
      </button>
    </div>
  );
}
