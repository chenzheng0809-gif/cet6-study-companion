import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** 真题模块内部的二级页头：返回 + 大标题，带 B 风格的硬阴影。 */
export function PaperHeader({
  eyebrow,
  title,
  subtitle,
  href,
  right,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: ReactNode;
  href: string;
  right?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="px-5 pt-[max(20px,env(safe-area-inset-top))] pb-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={href}
            className="tap inline-flex items-center gap-1.5 rounded-btn bg-surface px-3 py-1.5 text-caption font-bold shadow-hard-sm"
          >
            <ArrowLeft className="size-3.5" strokeWidth={3} />
            返回
          </Link>
          <p className="eyebrow mt-4 text-fg-muted">{eyebrow}</p>
          <h1 className="mt-1.5 text-title font-black tracking-[-0.03em]">{title}</h1>
          {subtitle ? <div className="mt-1.5 text-label text-fg-muted">{subtitle}</div> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </header>
  );
}

export function PaperSticker({
  children,
  tone = "lavender",
  className = "",
}: {
  children: ReactNode;
  tone?: "lavender" | "coral" | "mint" | "primary";
  className?: string;
}) {
  const toneClass = {
    lavender: "bg-lavender text-on-accent",
    coral: "bg-coral text-coral-fg",
    mint: "bg-mint text-mint-fg",
    primary: "bg-primary text-on-accent",
  }[tone];
  return (
    <span
      className={`grid size-[86px] -rotate-6 place-items-center rounded-full text-center text-caption leading-tight font-black shadow-hard ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
}
