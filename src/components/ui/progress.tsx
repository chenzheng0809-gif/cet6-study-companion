import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------ progress bar */

export function ProgressBar({
  value,
  className,
  tone = "lime",
  label,
  fillClass,
}: {
  /** 0..1 */
  value: number;
  className?: string;
  tone?: "lime" | "ink" | "soft";
  label?: string;
  /** Escape hatch for bars sitting on a saturated accent block. */
  fillClass?: string;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const fill =
    fillClass ?? (tone === "lime" ? "bg-primary" : tone === "ink" ? "bg-fg" : "bg-decor");
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-label={label}
      className={cn("h-2.5 w-full overflow-hidden rounded-pill bg-surface-3", className)}
    >
      <div
        className={cn("h-full rounded-pill transition-[width] duration-500 ease-out-quart", fill)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ----------------------------------------------------------- progress ring */

export function ProgressRing({
  value,
  size = 56,
  stroke = 6,
  className,
  trackClass = "text-decor",
  progressClass = "text-fg",
  children,
}: {
  /** 0..1 */
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  trackClass?: string;
  progressClass?: string;
  children?: ReactNode;
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className={cn("fill-none", trackClass)}
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className={cn("fill-none transition-[stroke-dashoffset] duration-500 ease-out-quart", progressClass)}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
        />
      </svg>
      {children ? (
        <span className="absolute inset-0 flex items-center justify-center">{children}</span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ stat */

export function StatBlock({
  value,
  label,
  unit,
  tone = "default",
  className,
}: {
  value: ReactNode;
  label: string;
  unit?: string;
  tone?: "default" | "primary" | "mint" | "lavender";
  className?: string;
}) {
  const tones = {
    default: "text-fg",
    primary: "text-primary-fg",
    mint: "text-mint-fg",
    lavender: "text-lavender-fg",
  } as const;
  return (
    <div className={cn("min-w-0", className)}>
      <div className={cn("num flex items-baseline gap-1 text-[30px] leading-none", tones[tone])}>
        {value}
        {unit ? <span className="text-[13px] font-black">{unit}</span> : null}
      </div>
      <p className="mt-1.5 text-caption font-bold text-fg-muted">{label}</p>
    </div>
  );
}
