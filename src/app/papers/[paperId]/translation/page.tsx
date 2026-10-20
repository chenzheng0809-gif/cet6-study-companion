"use client";

import { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { getPaper } from "@/lib/papers";
import { TranslationTaskSegment } from "@/components/paper/segments/translation-task";

export default function TranslationPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = use(params);
  const paper = getPaper(paperId);

  if (!paper?.translation) {
    return (
      <AppShell>
        <Link href="/papers" className="block px-5 pt-[max(16px,env(safe-area-inset-top))]">
          <p className="eyebrow text-fg-muted">TRANSLATION</p>
          <h1 className="mt-1 text-section font-black">没有翻译题</h1>
        </Link>
        <div className="px-5">
          <EmptyState title="这套卷没有翻译部分" description="换一套试试。" />
        </div>
      </AppShell>
    );
  }

  // 内容本体在 segments/translation-task 里，真题页的左右滑动用的是同一份。
  return (
    <AppShell>
      <div className="px-5">
        <TranslationTaskSegment paper={paper} translation={paper.translation} headingLevel={1} />
      </div>
    </AppShell>
  );
}
