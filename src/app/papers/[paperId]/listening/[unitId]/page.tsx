"use client";

import { use } from "react";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/feedback";
import { getListeningUnit, getPaper } from "@/lib/papers";
import { PaperHeader } from "@/components/paper/paper-header";
import { ListeningUnitSegment } from "@/components/paper/segments/listening-unit";

export default function ListeningUnitPage({
  params,
}: {
  params: Promise<{ paperId: string; unitId: string }>;
}) {
  const { paperId, unitId } = use(params);
  const paper = getPaper(paperId);
  const unit = paper ? getListeningUnit(paper, unitId) : undefined;

  if (!paper || !unit || !paper.timing) {
    return (
      <AppShell>
        <PaperHeader eyebrow="LISTENING" title="找不到这段听力" href="/papers" />
        <div className="px-5">
          <EmptyState title="这段还没入库" description="换一段试试。" />
        </div>
      </AppShell>
    );
  }

  // 内容本体在 segments/listening-unit 里，真题页的左右滑动用的是同一份。
  return (
    <AppShell>
      <div className="px-5">
        <ListeningUnitSegment paper={paper} unit={unit} headingLevel={1} />
      </div>
    </AppShell>
  );
}
