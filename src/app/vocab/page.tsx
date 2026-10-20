"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowRight, BookMarked, Check, Pencil, RotateCcw, Search, Trash2 } from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Segmented } from "@/components/ui/choice";
import { EmptyState } from "@/components/ui/feedback";
import { PageHeader } from "@/components/ui/page-header";
import { Sheet } from "@/components/ui/sheet";
import { Field, TextInput } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { WordbookBrowser } from "@/components/vocab/wordbook-browser";
import { questionHref, sentenceHref } from "@/lib/papers";
import {
  deleteVocabEntry,
  getVocabEntries,
  reviewVocabEntry,
  updateVocabEntry,
} from "@/lib/repo";
import { cn } from "@/lib/cn";
import type { VocabEntry } from "@/lib/types";

type View = "mine" | "book";

export default function VocabPage() {
  const entries = useLiveQuery(() => getVocabEntries(), []);
  const [view, setView] = useState<View>("mine");
  const [query, setQuery] = useState("");
  const [onlyNew, setOnlyNew] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [editing, setEditing] = useState<VocabEntry | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const filtered = useMemo(() => {
    const list = entries ?? [];
    const q = query.trim().toLowerCase();
    return list.filter((e) => {
      if (onlyNew && e.reviewCount > 0) return false;
      if (!q) return true;
      return (
        e.word.toLowerCase().includes(q) ||
        (e.meaning ?? "").toLowerCase().includes(q) ||
        (e.note ?? "").toLowerCase().includes(q)
      );
    });
  }, [entries, query, onlyNew]);

  const total = entries?.length ?? 0;
  const reviewed = (entries ?? []).filter((e) => e.reviewCount > 0).length;

  async function handleDelete(entry: VocabEntry) {
    await deleteVocabEntry(entry.id);
    toast({ title: `移掉了 ${entry.word}`, tone: "info" });
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Vocabulary" title="生词本" />

      <div className="space-y-4 px-5">
        <Segmented<View>
          options={[
            { value: "mine", label: "我的生词" },
            { value: "book", label: "核心词库" },
          ]}
          value={view}
          onChange={setView}
        />

        {view === "book" ? (
          <WordbookBrowser />
        ) : (
          <>
        <Card className="rotate-tilt-a p-4">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="num text-[34px] leading-none font-black tracking-[-0.03em]">{total}</p>
              <p className="mt-1 text-caption font-bold text-fg-muted">
                个词 · 复习过 {reviewed} 个
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              disabled={total === 0}
              leadingIcon={<BookMarked className="size-4" />}
              onClick={() => setReviewing(true)}
            >
              复习一轮
            </Button>
          </div>
        </Card>

        <Field>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-muted"
              strokeWidth={2.6}
            />
            <TextInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜单词、释义或备注"
              className="pl-11"
            />
          </div>
        </Field>

        <div className="flex gap-2">
          <FilterChip active={!onlyNew} onClick={() => setOnlyNew(false)}>
            全部 {total}
          </FilterChip>
          <FilterChip active={onlyNew} onClick={() => setOnlyNew(true)}>
            没复习过 {total - reviewed}
          </FilterChip>
        </div>

        {entries === undefined ? null : filtered.length === 0 ? (
          <EmptyState
            title={total === 0 ? "还没有记过生词" : "没有匹配的词"}
            description={
              total === 0
                ? "在原文里点一个词就能存下来。"
                : "换个关键词，或者关掉筛选看看。"
            }
            action={
              total === 0 ? (
                <Button size="sm" variant="secondary" onClick={() => router.push("/papers")}>
                  去真题库
                </Button>
              ) : undefined
            }
          />
        ) : (
          <ul className="space-y-3">
            {filtered.map((entry) => (
              <VocabCard
                key={entry.id}
                entry={entry}
                onReview={() => void reviewVocabEntry(entry.id)}
                onEdit={() => setEditing(entry)}
                onDelete={() => void handleDelete(entry)}
              />
            ))}
          </ul>
        )}
          </>
        )}
      </div>

      {reviewing ? (
        <ReviewRunner
          entries={filtered.length > 0 ? filtered : []}
          onClose={() => setReviewing(false)}
        />
      ) : null}

      <EditSheet entry={editing} onClose={() => setEditing(null)} />
    </AppShell>
  );
}

/* ------------------------------------------------------------------ cards */

function VocabCard({
  entry,
  onReview,
  onEdit,
  onDelete,
}: {
  entry: VocabEntry;
  onReview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  // 词库来源没有题号也没有句子 id，出处只作展示，**不可点** ——
  // 硬凑一个 /papers/wordbook 链接只会跳到一个 404。
  const href =
    entry.sourceKind === "wordbook"
      ? null
      : entry.sourceSentenceId
        ? sentenceHref(entry.sourcePaperId, entry.sourceSentenceId)
        : entry.sourceQuestionNo
          ? questionHref(entry.sourcePaperId, entry.sourceQuestionNo)
          : `/papers/${entry.sourcePaperId}`;

  return (
    <li>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[17px] leading-snug font-black tracking-[-0.02em]">{entry.word}</p>
            {entry.meaning ? (
              <p className="mt-1 text-label text-fg-muted">{entry.meaning}</p>
            ) : null}
            {entry.note ? (
              <p className="mt-1.5 rounded-row bg-surface-2 px-3 py-2 text-caption leading-relaxed">
                {entry.note}
              </p>
            ) : null}
            {href ? (
              <Link
                href={href}
                className="tap mt-2 inline-flex items-center gap-1 text-caption font-bold text-fg-muted"
              >
                <span className="truncate">{entry.sourceLabel}</span>
                <ArrowRight className="size-3 shrink-0" />
              </Link>
            ) : (
              <p className="mt-2 inline-flex items-center gap-1 text-caption font-bold text-fg-subtle">
                <span className="truncate">{entry.sourceLabel}</span>
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <span className="num block rounded-pill bg-surface-2 px-2.5 py-1 text-caption font-black text-fg-muted">
              {entry.reviewCount} 次
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" leadingIcon={<Check className="size-3.5" />} onClick={onReview}>
            复习一次
          </Button>
          <Button size="sm" variant="soft" leadingIcon={<Pencil className="size-3.5" />} onClick={onEdit}>
            改释义
          </Button>
          <Button size="sm" variant="soft" leadingIcon={<Trash2 className="size-3.5" />} onClick={onDelete}>
            移除
          </Button>
        </div>
      </Card>
    </li>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "tap rounded-pill px-3.5 py-1.5 text-caption font-black",
        active ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg-muted",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------ review mode */

/**
 * 复习一轮：一张一张过，自己先回想，回想完了再翻面。
 * 不做打分、不做艾宾浩斯 —— 那些在没有真实复习数据之前都是装饰。
 */
function ReviewRunner({ entries, onClose }: { entries: VocabEntry[]; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState<string[]>([]);

  if (entries.length === 0) {
    return (
      <Sheet open onClose={onClose} eyebrow="Review" title="还没有可复习的词" description="先去记几个吧" footer={
        <Button block size="lg" onClick={onClose}>
          知道了
        </Button>
      }>
        <div className="pb-4" />
      </Sheet>
    );
  }

  const entry = entries[Math.min(index, entries.length - 1)];
  const finished = done.length >= entries.length;

  async function mark() {
    await reviewVocabEntry(entry.id);
    setDone((prev) => [...prev, entry.id]);
    setFlipped(false);
    setIndex((v) => v + 1);
  }

  return (
    <Sheet
      open
      onClose={onClose}
      eyebrow="Review"
      title={finished ? "这一轮过完了" : `第 ${Math.min(index + 1, entries.length)} / ${entries.length}`}
      description={finished ? "想再来一轮就再点一次复习。" : "先自己回想，再翻面看释义。"}
      footer={
        finished ? (
          <div className="space-y-3">
            <Button block size="lg" onClick={() => { setDone([]); setIndex(0); }}>
              <RotateCcw className="mr-2 size-[17px]" />
              再来一轮
            </Button>
            <Button block variant="soft" size="md" onClick={onClose}>
              收工
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button block size="lg" onClick={() => void mark()}>
              想起来了
            </Button>
            <Button block variant="soft" size="md" onClick={() => setFlipped(true)}>
              没想起来，看释义
            </Button>
          </div>
        )
      }
    >
      <div className="pb-2">
        <Card className="min-h-[180px] p-6 text-center">
          <p className="text-[30px] leading-tight font-black tracking-[-0.03em]">{entry.word}</p>
          {flipped ? (
            <div className="mt-5 space-y-2">
              {entry.meaning ? <p className="text-body leading-relaxed">{entry.meaning}</p> : null}
              {entry.note ? (
                <p className="text-caption leading-relaxed text-fg-muted">{entry.note}</p>
              ) : null}
              <p className="text-caption text-fg-subtle">{entry.sourceLabel}</p>
            </div>
          ) : null}
        </Card>
      </div>
    </Sheet>
  );
}

/* --------------------------------------------------------------- edit sheet */

function EditSheet({ entry, onClose }: { entry: VocabEntry | null; onClose: () => void }) {
  const [meaning, setMeaning] = useState("");
  const [note, setNote] = useState("");
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  if (entry && loadedFor !== entry.id) {
    setLoadedFor(entry.id);
    setMeaning(entry.meaning ?? "");
    setNote(entry.note ?? "");
  }

  if (!entry) return null;

  return (
    <Sheet
      open
      onClose={() => {
        setLoadedFor(null);
        onClose();
      }}
      eyebrow={entry.word}
      title="改释义"
      footer={
        <Button
          block
          size="lg"
          onClick={async () => {
            await updateVocabEntry(entry.id, { meaning, note });
            setLoadedFor(null);
            onClose();
          }}
        >
          保存
        </Button>
      }
    >
      <div className="space-y-4 pb-2">
        <label className="block">
          <span className="eyebrow mb-2 block text-fg-muted">释义</span>
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            className="w-full rounded-row bg-surface-2 px-4 py-3 text-label outline-none focus-visible:ring-2 focus-visible:ring-fg"
          />
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block text-fg-muted">备注</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-row bg-surface-2 px-4 py-3 text-label leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-fg"
          />
        </label>
      </div>
    </Sheet>
  );
}
