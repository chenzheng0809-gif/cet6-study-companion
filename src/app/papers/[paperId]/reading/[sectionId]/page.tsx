"use client";

import { use } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { getPaper, getReadingSection } from "@/lib/papers";
import { PaperHeader } from "@/components/paper/paper-header";
import { ReadingSectionSegment } from "@/components/paper/segments/reading-section";

export default function ReadingSectionPage({
  params,
}: {
  params: Promise<{ paperId: string; sectionId: string }>;
}) {
  const { paperId, sectionId } = use(params);
  const paper = getPaper(paperId);
  const section = paper ? getReadingSection(paper, sectionId) : undefined;

  if (!paper || !section) {
    return (
      <AppShell>
        <PaperHeader eyebrow="READING" title="找不到这个题段" href="/papers" />
        <div className="px-5">
          <EmptyState title="这个题段还没入库" description="换一段试试。" />
        </div>
      </AppShell>
    );
  }

  // 内容本体在 segments/reading-section 里，真题页的左右滑动用的是同一份。
  return (
    <AppShell>
      <div className="px-5">
        <ReadingSectionSegment paper={paper} section={section} headingLevel={1} />
      </div>
    </AppShell>
  );
}
