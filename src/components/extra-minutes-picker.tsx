"use client";

import { cn } from "@/lib/cn";

const OPTIONS = [0, 5, 10, 15, 20, 30];

/**
 * 额外加练 — the one control that can push a week past its budget. Values go
 * high enough that the over-budget warning is genuinely reachable, so the app
 * never shows a warning it cannot trigger.
 */
export function ExtraMinutesPicker({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (minutes: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {OPTIONS.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={cn(
              "tap h-11 rounded-pill text-[13px] font-black tracking-[-0.01em]",
              active
                ? "bg-primary text-primary-fg shadow-press-lime-sm"
                : "border-2 border-border bg-surface text-fg shadow-hard-sm hover:shadow-hard",
            )}
          >
            {option === 0 ? "不加练" : `+${option}`}
          </button>
        );
      })}
    </div>
  );
}
