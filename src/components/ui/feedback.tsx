import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Stepper({
  step,
  total,
  className,
}: {
  /** 1-based */
  step: number;
  total: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="eyebrow shrink-0">
        STEP {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <div className="flex flex-1 gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-pill",
              i < step ? "bg-primary shadow-hard-sm" : "bg-surface-3",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border-2 border-dashed border-border bg-surface px-6 py-10 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="sticker relative mb-3 grid size-12 place-items-center rounded-full bg-primary text-primary-fg shadow-hard-sm">
          {icon}
        </span>
      ) : null}
      <p className="text-[17px] font-black tracking-[-0.02em]">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-[280px] text-caption leading-relaxed text-fg-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
