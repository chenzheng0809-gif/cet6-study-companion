"use client";

import { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { getPaper } from "@/lib/papers";
import { WritingTaskSegment } from "@/components/paper/segments/writing-task";

export default function WritingPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = use(params);
  const paper = getPaper(paperId);

  if (!paper?.writing) {
    return (
      <AppShell>
        <PaperHeaderFallback href="/papers" title="没有写作题" eyebrow="WRITING" />
        <div className="px-5">
          <EmptyState title="这套卷没有写作部分" description="换一套试试。" />
        </div>
      </AppShell>
    );
  }

  // 内容本体在 segments/writing-task 里，真题页的左右滑动用的是同一份。
  return (
    <AppShell>
      <div className="px-5">
        <WritingTaskSegment paper={paper} writing={paper.writing} headingLevel={1} />
      </div>
    </AppShell>
  );
}

function PaperHeaderFallback({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <Link href={href} className="block px-5 pt-[max(16px,env(safe-area-inset-top))]">
      <p className="eyebrow text-fg-muted">{eyebrow}</p>
      <h1 className="mt-1 text-section font-black">{title}</h1>
    </Link>
  );
}
