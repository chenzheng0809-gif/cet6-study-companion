import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/* --------------------------------------------------------------- small chip */

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "lavender" | "mint" | "coral" | "ink";
  className?: string;
}) {
  const tones = {
    neutral: "bg-surface-2 text-fg-muted",
    primary: "bg-primary text-primary-fg",
    lavender: "bg-lavender-soft text-lavender-fg",
    mint: "bg-mint text-mint-fg",
    coral: "bg-coral-soft text-coral-fg",
    ink: "bg-fg text-bg",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 rounded-pill px-2.5 text-caption font-bold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------- large choice card */

/** Big selectable card used for target score, study level, exam session. */
export function ChoiceCard({
  selected,
  title,
  description,
  meta,
  accent = "lime",
  onSelect,
  className,
  badge,
}: {
  selected: boolean;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  accent?: "lime" | "lavender" | "mint";
  onSelect: () => void;
  className?: string;
  badge?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "tap group relative flex w-full items-center gap-4 rounded-card bg-surface p-4 text-left",
        selected
          ? "border-2 border-border shadow-hard"
          : "border-2 border-border shadow-hard-sm hover:shadow-hard active:shadow-press-ink-sm",
        className,
      )}
    >
      {selected ? (
        <span
          aria-hidden
          className={cn(
            "absolute top-5 bottom-5 -left-[3px] w-1.5 rounded-full",
            accent === "lime" && "bg-primary",
            accent === "lavender" && "bg-lavender",
            accent === "mint" && "bg-mint",
          )}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn("text-[17px] font-black tracking-[-0.02em]", !selected && "text-fg-muted")}>
            {title}
          </span>
          {badge}
        </div>
        {description ? (
          <p className="mt-1 text-caption text-fg-muted">{description}</p>
        ) : null}
      </div>

      {meta ? <div className="shrink-0 text-right">{meta}</div> : null}

      <span
        aria-hidden
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          selected ? "bg-primary text-primary-fg" : "border-2 border-decor bg-surface",
        )}
      >
        {selected ? <Check className="size-4" strokeWidth={3.5} /> : null}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------- radio rows */

/** Compact two-option row (e.g. 没考过 / 考过). */
export function RadioRow({
  selected,
  title,
  description,
  onSelect,
}: {
  selected: boolean;
  title: string;
  description?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "tap flex flex-1 flex-col gap-1 rounded-row border-2 p-4 text-left",
        selected
          ? "border-border bg-primary-soft shadow-hard"
          : "border-border bg-surface shadow-hard-sm hover:shadow-hard active:shadow-press-ink-sm",
      )}
    >
      <span className="text-[15px] font-black tracking-[-0.02em]">{title}</span>
      <span className="text-caption text-fg-muted">{description}</span>
    </button>
  );
}

/* --------------------------------------------------------------- segmented */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1.5 rounded-pill bg-surface-2 p-1.5", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "tap h-10 flex-1 rounded-pill text-[13px] font-black tracking-[-0.01em]",
              active
                ? "bg-surface text-fg shadow-hard-sm"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
