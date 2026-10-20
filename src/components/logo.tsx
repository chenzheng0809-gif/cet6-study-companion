import { cn } from "@/lib/cn";

/** Wordmark: a lime sticker tile carrying "6", hard offset shadow. */
export function Logo({
  size = "md",
  className,
  showWordmark = true,
  tone = "default",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  showWordmark?: boolean;
  /** `onAccent` for the lime colour field, where default ink would vanish. */
  tone?: "default" | "onAccent";
}) {
  const tile = {
    sm: "size-8 text-[16px] rounded-[10px]",
    md: "size-10 text-[20px] rounded-[12px]",
    lg: "size-12 text-[24px] rounded-[14px]",
  }[size];

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "num inline-flex shrink-0 items-center justify-center bg-primary font-black text-primary-fg shadow-hard-sm",
          tile,
        )}
      >
        6
      </span>
      {showWordmark ? (
        <span className="min-w-0">
          <span
            className={cn(
              "block truncate text-[13px] leading-tight font-black tracking-[-0.02em]",
              tone === "onAccent" ? "text-on-accent" : "text-fg",
            )}
          >
            CET-6 Study Companion
          </span>
          <span
            className={cn(
              "block text-[10px] leading-tight font-black tracking-[0.16em] uppercase",
              tone === "onAccent" ? "text-on-accent/70" : "text-fg-muted",
            )}
          >
            六级备考督学
          </span>
        </span>
      ) : null}
    </span>
  );
}
