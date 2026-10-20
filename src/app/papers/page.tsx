import Link from "next/link";
import { ArrowRight, Headphones, PenLine, ScrollText, Languages } from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { PAPERS } from "@/lib/papers";

export const metadata = { title: "真题库 · CET-6 Study Companion" };

const PARTS = [
  { icon: Headphones, name: "Listening", note: "25 题 · 7 段原文" },
  { icon: ScrollText, name: "Reading", note: "30 题 · 4 个题段" },
  { icon: PenLine, name: "Writing", note: "1 篇 · 含范文点评" },
  { icon: Languages, name: "Translation", note: "1 段 · 含译点精析" },
];

export default function PapersPage() {
  return (
    <AppShell>
      <div className="px-5 pt-[max(20px,env(safe-area-inset-top))] pb-8">
        <p className="eyebrow text-fg-muted">PAPER BANK</p>
        <h1 className="mt-2 text-title font-black tracking-[-0.03em]">真题库</h1>
        <p className="mt-2 text-body text-fg-muted">
          整套卷面、听力原文、逐题解析和全文译文都在这儿。不是题库，是原卷。
        </p>

        <div className="mt-6 grid gap-4">
          {PAPERS.map((paper, i) => (
            <Link
              key={paper.id}
              href={`/papers/${paper.id}`}
              className="tap block rotate-[0.4deg] rounded-card bg-surface p-5 shadow-hard"
              style={{ transform: `rotate(${i % 2 === 0 ? "0.5deg" : "-0.4deg"})` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="rounded-pill bg-fg px-3 py-1 text-eyebrow font-black text-bg">
                    CET-6
                  </span>
                  <p className="mt-3 text-section font-black tracking-[-0.02em]">{paper.titleEn}</p>
                </div>
                <ArrowRight className="mt-1 size-5 shrink-0" strokeWidth={3} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {PARTS.map((p) => (
                  <span
                    key={p.name}
                    className="rounded-pill bg-surface-2 px-3 py-1 text-caption font-bold"
                  >
                    {p.name} {p.note}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
