import Link from "next/link";
import { ArrowRight, Headphones, PenLine, ScrollText, Languages } from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { PAPERS } from "@/lib/papers";
import type { Paper } from "@/lib/papers/types";

export const metadata = { title: "真题库 · CET-6 Study Companion" };

/**
 * 每套卷子有哪几个 Part、各有多少内容 —— 全从数据里数，不写死。
 *
 * 官方第三套真题不提供听力（卷面自己写着的），所以那一套的听力那一格
 * 直接不出现，不能硬写成「25 题」。
 */
function partsOf(paper: Paper): { icon: typeof Headphones; name: string; note: string }[] {
  const parts: { icon: typeof Headphones; name: string; note: string }[] = [];

  if (paper.stats.listening > 0) {
    parts.push({
      icon: Headphones,
      name: "Listening",
      note: `${paper.stats.listening} 题 · ${paper.listeningUnits.length} 段原文`,
    });
  }
  if (paper.stats.reading > 0) {
    parts.push({
      icon: ScrollText,
      name: "Reading",
      note: `${paper.stats.reading} 题 · ${paper.readingSections.length} 个题段`,
    });
  }
  if (paper.writing) {
    parts.push({
      icon: PenLine,
      name: "Writing",
      note: paper.writing.comments ? "1 篇 · 含范文点评" : "1 篇 · 含参考范文",
    });
  }
  if (paper.translation) {
    parts.push({
      icon: Languages,
      name: "Translation",
      note: paper.translation.points ? "1 段 · 含译点精析" : "1 段 · 含参考译文",
    });
  }
  return parts;
}

export default function PapersPage() {
  return (
    <AppShell>
      <div className="px-5 pt-[max(20px,env(safe-area-inset-top))] pb-8">
        <p className="eyebrow text-fg-muted">PAPER BANK</p>
        <h1 className="mt-2 text-title font-black tracking-[-0.03em]">真题库</h1>
        <p className="mt-2 text-body text-fg-muted">
          整套卷面、逐题解析和原文依据都在这儿。不是题库，是原卷。
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
                {partsOf(paper).map((p) => (
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
