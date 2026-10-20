import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Direction B cards: pure white, big radii, and a hard offset shadow that acts
 * as the edge. In light mode --cet-card-edge is transparent (the shadow is the
 * outline); in dark mode it becomes a 1px border so the card still reads.
 */

/** Standard card — 28px radius, hard offset shadow. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-card-edge bg-surface shadow-hard",
        className,
      )}
      {...props}
    />
  );
}

/** Hero card — 32px radius, roomier padding. */
export function CardLarge({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card-lg border border-card-edge bg-surface shadow-hard",
        className,
      )}
      {...props}
    />
  );
}

/** Interactive card — same edge, smaller offset, presses down when held. */
export function PressableCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { as?: "div" | "button" }) {
  return (
    <div
      className={cn(
        "tap cursor-pointer rounded-card border border-card-edge bg-surface shadow-hard-sm",
        "hover:shadow-hard active:shadow-press-ink-sm",
        className,
      )}
      {...props}
    />
  );
}

/** Circular accent sticker that bleeds off an edge. */
export function DecoBlock({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("sticker size-16 bg-lavender", className)}
    />
  );
}

export function CardHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-3 px-5 pt-5", className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
        <h2 className="truncate text-section font-black tracking-[-0.02em]">{title}</h2>
      </div>
      {action}
    </div>
  );
}
