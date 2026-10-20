"use client";

import { cn } from "@/lib/cn";

const OPTIONS = [0, 1, 2, 3, 4];

/**
 * 额外加练 —— 唯一能把一周排爆的开关，所以给到足够高，
 * 让"超额度"的提示是真的能被触发出来的，而不是摆设。
 *
 * 单位是模块，不是分钟：加练本身没有被可信的时长依据，
 * 编一个"加练多少分钟"出来只会让计划看着比实际更精确。
 */
export function ExtraUnitsPicker({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (units: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-5 gap-2", className)}>
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
            {option === 0 ? "不加" : `+${option}`}
          </button>
        );
      })}
    </div>
  );
}
