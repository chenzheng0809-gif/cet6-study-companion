import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  eyebrow,
  title,
  description,
  right,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex items-start justify-between gap-3 px-5 pt-[max(20px,env(safe-area-inset-top))] pb-5",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h1 className="text-title font-black tracking-[-0.03em]">{title}</h1>
        {description ? (
          <p className="mt-1.5 text-label text-fg-muted">{description}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0 pt-1">{right}</div> : null}
    </header>
  );
}
