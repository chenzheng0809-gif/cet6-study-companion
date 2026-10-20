"use client";

/**
 * 核心词库。
 *
 * 形态参照不背单词 / 墨墨：**先按单元分览，再一屏一个词地过**，
 * 左右滑动换词，中文可以整块藏起来，最后一键把不认识的收进生词本。
 *
 * 上下册是参考书不是"我的欠账"，所以默认落在生词本那边 ——
 * 只有你主动点开词库时才是背词模式。
 */

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowLeft,
  BookMarked,
  Check,
  ChevronDown,
  Languages,
  Search,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip, Segmented } from "@/components/ui/choice";
import { Collapsible } from "@/components/paper/exam-shell";
import { Field, TextInput } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/feedback";
import { useToast } from "@/components/ui/toast";
import { MarkedText } from "@/components/vocab/marked";
import { addWordbookEntry, getVocabEntries } from "@/lib/repo";
import { normWord } from "@/lib/vocab";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import {
  WORDBOOK_ITEM_COUNT,
  WORDBOOK_TOPICS,
  WORDBOOK_WORD_COUNT,
  entryExamples,
  searchTopicItems,
  unitEntries,
  wordbookUnitList,
  type DetailItem,
  type WordbookEntry,
} from "@/lib/wordbooks";
import { cn } from "@/lib/cn";

type Book = "units" | "topics";

export function WordbookBrowser() {
  const [book, setBook] = useState<Book>("units");
  const [unitNo, setUnitNo] = useState<number | null>(null);
  const [showZh, setShowZh] = useState(true);

  const units = useMemo(() => wordbookUnitList(), []);

  // 进了某个单元就是翻卡视图。判断只看 unitNo ——
  // 早先把册别和「进没进单元」塞进同一个 state，结果 onPick 只设了 unitNo、
  // 没设那个只被分段器写过的值，条件永远不成立，点单元像没点。
  if (unitNo !== null) {
    return (
      <UnitCards
        unitNo={unitNo}
        showZh={showZh}
        onToggleZh={() => setShowZh((v) => !v)}
        onExit={() => setUnitNo(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="rotate-tilt-b p-4">
        <p className="text-label leading-relaxed font-bold">
          核心词汇 · 上册 <span className="num font-black">{WORDBOOK_WORD_COUNT}</span> 词
          <span className="mx-1.5 text-fg-subtle">·</span>
          下册 <span className="num font-black">{WORDBOOK_ITEM_COUNT}</span> 条
        </p>
        <p className="mt-2 text-caption leading-relaxed text-fg-muted">
          按单元过，一屏一个词。真的不会再收进生词本，复习只看生词本。
        </p>
      </Card>

      <Segmented<Book>
        options={[
          { value: "units", label: "上册 · 单元" },
          { value: "topics", label: "下册 · 同义替换" },
        ]}
        value={book}
        onChange={setBook}
      />

      {book === "topics" ? <TopicBrowser /> : <UnitPicker onPick={setUnitNo} units={units} />}
    </div>
  );
}

/* ------------------------------------------------------------------ 单元分览 */

function UnitPicker({
  units,
  onPick,
}: {
  units: ReturnType<typeof wordbookUnitList>;
  onPick: (unitNo: number) => void;
}) {
  return (
    <ul className="space-y-3">
      {units.map((unit, i) => (
        <li key={unit.unitNo}>
          <button
            type="button"
            onClick={() => onPick(unit.unitNo)}
            className={cn(
              "tap block w-full text-left",
              i % 2 === 0 ? "rotate-tilt-a" : "rotate-tilt-b",
            )}
          >
            <Card className="p-4 transition-transform">
              <div className="flex items-baseline gap-2.5">
                <span className="num text-caption font-black text-fg-subtle">
                  UNIT {unit.unitNo}
                </span>
                <span className="text-[19px] leading-tight font-black tracking-[-0.02em]">
                  {unit.unitName}
                </span>
                <span className="num ml-auto rounded-pill bg-primary px-2.5 py-1 text-caption font-black text-primary-fg">
                  {unit.count} 词
                </span>
              </div>
              <p className="mt-2 text-caption leading-relaxed text-fg-muted">{unit.intro}</p>
            </Card>
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ 翻卡 */

const SWIPE_THRESHOLD = 72;

function UnitCards({
  unitNo,
  showZh,
  onToggleZh,
  onExit,
}: {
  unitNo: number;
  showZh: boolean;
  onToggleZh: () => void;
  onExit: () => void;
}) {
  const entries = useMemo(() => unitEntries(unitNo), [unitNo]);
  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const dragStart = useRef<number | null>(null);
  const { toast } = useToast();
  const saved = useLiveQuery(async () => {
    const list = await getVocabEntries();
    return new Set(list.map((e) => normWord(e.word)));
  }, []);

  useEffect(() => stopSpeaking, []);

  const total = entries.length;
  const entry = entries[index];

  const go = useCallback(
    (delta: number) => {
      setDx(0);
      stopSpeaking();
      setIndex((prev) => Math.min(total - 1, Math.max(0, prev + delta)));
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!entry) {
    return <EmptyState title="这个单元没有词" description="换个单元看看。" action={<Button size="sm" onClick={onExit}>返回单元</Button>} />;
  }

  async function handleCollect() {
    await addWordbookEntry(entry);
    toast({ title: `${entry.word} 收好了`, tone: "success" });
  }

  const already = saved?.has(normWord(entry.word)) ?? false;

  return (
    <div className="space-y-3">
      {/* 顶部：返回 + 进度 + 中文开关 */}
      <div className="sticky top-0 z-20 -mx-5 flex items-center gap-2 bg-surface-2/95 px-5 py-2 backdrop-blur">
        <button
          type="button"
          onClick={onExit}
          className="tap flex size-9 items-center justify-center rounded-pill bg-surface text-fg shadow-hard-sm"
          aria-label="返回单元列表"
        >
          <ArrowLeft className="size-4" strokeWidth={2.8} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-caption font-black">
            Unit {entry.unitNo} {entry.unitName}
          </p>
          <p className="num text-caption text-fg-muted">
            {index + 1} / {total}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleZh}
          aria-pressed={showZh}
          className={cn(
            "tap flex h-9 items-center gap-1 rounded-pill px-3 text-caption font-black",
            showZh ? "bg-fg text-bg" : "bg-surface text-fg-muted",
          )}
        >
          <Languages className="size-3.5" strokeWidth={2.8} />
          {showZh ? "中文开" : "中文关"}
        </button>
      </div>

      {/* 进度条 */}
      <div className="h-2 w-full overflow-hidden rounded-pill bg-surface-2">
        <div
          className="h-full bg-primary transition-[width] duration-200"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* 卡片本体（可左右滑动换词） */}
      <div
        className="touch-pan-y select-none"
        onPointerDown={(e) => {
          dragStart.current = e.clientX;
        }}
        onPointerMove={(e) => {
          if (dragStart.current === null) return;
          const next = e.clientX - dragStart.current;
          if ((index === 0 && next > 0) || (index === total - 1 && next < 0)) return;
          setDx(next);
        }}
        onPointerUp={() => {
          if (dragStart.current === null) return;
          if (dx <= -SWIPE_THRESHOLD) go(1);
          else if (dx >= SWIPE_THRESHOLD) go(-1);
          else setDx(0);
          dragStart.current = null;
        }}
        onPointerCancel={() => {
          dragStart.current = null;
          setDx(0);
        }}
      >
        <Card
          className="p-5 transition-transform duration-150"
          style={{
            transform: `translateX(${Math.max(-110, Math.min(110, dx))}px) rotate(${Math.max(-3, Math.min(3, dx / 40))}deg)`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[30px] leading-tight font-black tracking-[-0.03em]">
                {entry.word}
              </p>
              {entry.senses.find((s) => s.phonetic) ? (
                <p className="num mt-1 text-caption text-fg-muted">
                  /{entry.senses.find((s) => s.phonetic)?.phonetic}/
                </p>
              ) : null}
            </div>
            {speechSupported() ? (
              <button
                type="button"
                onClick={() => speak(entry.word)}
                aria-label={`朗读 ${entry.word}`}
                className="tap flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg shadow-hard"
              >
                <Volume2 className="size-5" strokeWidth={2.6} />
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-1.5">
            {entry.senses.map((sense, i) => (
              <p key={i} className="text-[15px] leading-relaxed">
                <span className="mr-1.5 font-black text-fg-muted">{sense.pos}</span>
                {showZh ? (
                  <MarkedText segments={sense.meaningHL} fallback={sense.meaning} />
                ) : (
                  <span className="text-fg-subtle">（中文已隐藏）</span>
                )}
              </p>
            ))}
          </div>

          <DetailSections
            entry={entry}
            showZh={showZh}
            onSpeak={speak}
          />

          <ExampleSection entry={entry} showZh={showZh} />

          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={index === 0}
              onClick={() => go(-1)}
              className="flex-1"
              leadingIcon={<ChevronDown className="size-4 rotate-90" />}
            >
              上一个
            </Button>
            <Button
              size="sm"
              variant={already ? "secondary" : "primary"}
              disabled={already}
              onClick={() => void handleCollect()}
              className="flex-[2]"
              leadingIcon={
                already ? <Check className="size-4" /> : <BookMarked className="size-4" />
              }
            >
              {already ? "已在生词本" : "不认识 · 收进生词本"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={index === total - 1}
              onClick={() => go(1)}
              className="flex-1"
              leadingIcon={<ChevronDown className="size-4 -rotate-90" />}
            >
              下一个
            </Button>
          </div>
          <p className="mt-2 text-center text-caption text-fg-subtle">
            左右滑动换词 · 键盘 ← → 也可以
          </p>
        </Card>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="tap w-full rounded-pill bg-surface-2 py-2.5 text-caption font-black text-fg-muted"
      >
        换一个单元
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ 折叠区块 */

function DetailSections({
  entry,
  showZh,
  onSpeak,
}: {
  entry: WordbookEntry;
  showZh: boolean;
  onSpeak: (text: string) => boolean;
}) {
  const groups = [
    { label: "派生词", items: entry.derivatives, tone: "mint" as const },
    { label: "近义词", items: entry.synonyms, tone: "lavender" as const },
    { label: "反义词", items: entry.antonyms, tone: "coral" as const },
    { label: "词组", items: entry.phrases, tone: "neutral" as const },
    { label: "拓展词", items: entry.extensions, tone: "neutral" as const },
  ].filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {groups.map((group) => (
        <Collapsible
          key={group.label}
          title={group.label}
          hint={`${group.items.length} 个 · 中英对照`}
          dense
        >
          <ul className="space-y-1.5">
            {group.items.map((item) => (
              <DetailRow key={item.term} item={item} tone={group.tone} showZh={showZh} onSpeak={onSpeak} />
            ))}
          </ul>
        </Collapsible>
      ))}
    </div>
  );
}

function DetailRow({
  item,
  tone,
  showZh,
  onSpeak,
}: {
  item: DetailItem;
  tone: "mint" | "lavender" | "coral" | "neutral";
  showZh: boolean;
  onSpeak: (text: string) => boolean;
}) {
  return (
    <li className="flex items-start gap-2">
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          {item.termHL ? (
            // 书上标黄过的词条：整条按原书的高亮样子显示，不再套 Chip
            <MarkedText
              segments={item.termHL}
              fallback={
                <Chip tone={tone}>
                  {item.term}
                </Chip>
              }
            />
          ) : (
            <Chip tone={tone}>{item.term}</Chip>
          )}
          {item.phonetic ? (
            <span className="num text-caption text-fg-subtle">/{item.phonetic}/</span>
          ) : null}
        </span>
        {item.senses.length > 0 ? (
          <span className="mt-0.5 block text-caption leading-relaxed text-fg-muted">
            {showZh
              ? item.senses.map((s, si) => (
                  // 保持原来的「词性 + 释义；词性 + 释义」排版，只把释义本身换成带高亮的
                  <Fragment key={si}>
                    {si > 0 ? "；" : null}
                    {s.pos}
                    <MarkedText segments={s.meaningHL} fallback={s.meaning} />
                  </Fragment>
                ))
              : "（中文已隐藏）"}
          </span>
        ) : null}
      </span>
      {speechSupported() ? (
        <button
          type="button"
          onClick={() => onSpeak(item.term)}
          aria-label={`朗读 ${item.term}`}
          className="tap mt-1 shrink-0 text-fg-subtle"
        >
          <Volume2 className="size-3.5" strokeWidth={2.4} />
        </button>
      ) : null}
    </li>
  );
}

function ExampleSection({ entry, showZh }: { entry: WordbookEntry; showZh: boolean }) {
  const examples = entryExamples(entry);
  if (examples.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {examples.map((example, i) => (
        <Collapsible
          key={i}
          title={examples.length > 1 ? `原题例句 ${i + 1}` : "原题例句"}
          hint={example.source || (example.article ? "含原题" : "")}
          dense
        >
          {example.source ? (
            <p className="mb-1.5 text-caption font-black text-fg-subtle">{example.source}</p>
          ) : null}
          {example.article ? (
            <>
              <p className="text-[14px] leading-relaxed">
                <MarkedText segments={example.articleHL} fallback={example.article} />
              </p>
              {example.question ? (
                <p className="mt-1.5 text-[14px] leading-relaxed font-bold">
                  <MarkedText segments={example.questionHL} fallback={example.question} />
                </p>
              ) : null}
              <ul className="mt-1 space-y-0.5">
                {example.options.map((opt) => (
                  <li key={opt.label} className="text-caption leading-relaxed text-fg-muted">
                    <span className="mr-1.5 font-black">{opt.label})</span>
                    <MarkedText segments={opt.textHL} fallback={opt.text} />
                  </li>
                ))}
              </ul>
            </>
          ) : example.sentence ? (
            <p className="text-[14px] leading-relaxed">
              <MarkedText segments={example.sentenceHL} fallback={example.sentence} />
            </p>
          ) : null}
          {example.translation ? (
            <p className="mt-1.5 text-[14px] leading-relaxed text-fg-muted">
              {showZh ? (
                <MarkedText segments={example.translationHL} fallback={example.translation} />
              ) : (
                "（译文已隐藏）"
              )}
            </p>
          ) : null}
          {speechSupported() && example.sentence ? (
            <Button
              size="sm"
              variant="secondary"
              className="mt-2"
              onClick={() => speak(example.sentence)}
              leadingIcon={<Volume2 className="size-3.5" />}
            >
              朗读例句
            </Button>
          ) : null}
        </Collapsible>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ 下册专题 */

function TopicBrowser() {
  const [query, setQuery] = useState("");
  const [topicNo, setTopicNo] = useState<number | null>(null);
  const hits = useMemo(() => searchTopicItems(query, topicNo), [query, topicNo]);

  const blocks = useMemo(() => {
    const out: { label: string; hits: typeof hits }[] = [];
    for (const hit of hits) {
      const label = `${hit.topic.topicName} · ${hit.groupName}`;
      const last = out[out.length - 1];
      if (last && last.label === label) last.hits.push(hit);
      else out.push({ label, hits: [hit] });
    }
    return out;
  }, [hits]);

  return (
    <div className="space-y-4">
      <Field>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fg-muted"
            strokeWidth={2.6}
          />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜表达或中文"
            className="pl-11"
          />
        </div>
      </Field>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {[{ key: null, label: "全部", count: WORDBOOK_ITEM_COUNT }, ...WORDBOOK_TOPICS.map((t) => ({
          key: t.topicNo,
          label: `专题${t.topicNo} ${t.topicName}`,
          count: t.groups.reduce((n, g) => n + g.items.length, 0),
        }))].map((option) => {
          const active = option.key === topicNo;
          return (
            <button
              key={String(option.key)}
              type="button"
              onClick={() => setTopicNo(option.key)}
              aria-pressed={active}
              className={cn(
                "tap shrink-0 rounded-pill px-3.5 py-2 text-caption font-black whitespace-nowrap",
                active ? "bg-primary text-primary-fg shadow-hard-sm" : "bg-surface-2 text-fg-muted",
              )}
            >
              {option.label}
              <span className="num ml-1.5 opacity-70">{option.count}</span>
            </button>
          );
        })}
      </div>

      {blocks.length === 0 ? (
        <EmptyState title="没有匹配的表达" description="换个关键词，或把筛选切回全部。" />
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => (
            <section key={block.label} className="space-y-2">
              <h3 className="px-1 text-caption font-black tracking-[0.08em] text-fg-muted uppercase">
                {block.label}
              </h3>
              <ul className="space-y-2">
                {block.hits.map((hit, i) => (
                  <Card key={`${block.label}-${i}`} className="p-3.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {hit.item.terms.map((term, ti) => (
                        <Chip key={term.term} tone={(["primary", "lavender", "mint", "coral"] as const)[ti % 4]}>
                          {term.term}
                          {term.zh ? <span className="opacity-75">{term.zh}</span> : null}
                        </Chip>
                      ))}
                    </div>
                    {hit.item.meaning ? (
                      <p className="mt-2.5 text-label font-black">＝ {hit.item.meaning}</p>
                    ) : null}
                    {hit.item.senses.length > 0 ? (
                      <ul className="mt-1.5 space-y-0.5">
                        {hit.item.senses.map((sense, si) => (
                          <li key={si} className="text-caption text-fg-muted">
                            <span className="mr-1.5 font-black">{sense.pos}</span>
                            {sense.meaning}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {(hit.item.examples ?? []).map((ex, ei) => (
                      <Collapsible
                        key={ei}
                        title="原题例句"
                        hint={ex.article ? "含原题" : undefined}
                        dense
                        className="mt-2"
                      >
                        {ex.article ? (
                          <>
                            <p className="text-caption leading-relaxed">
                              <MarkedText segments={ex.articleHL} fallback={ex.article} />
                            </p>
                            {ex.question ? (
                              <p className="mt-1 text-caption leading-relaxed font-bold">
                                <MarkedText segments={ex.questionHL} fallback={ex.question} />
                              </p>
                            ) : null}
                            <ul className="mt-1 space-y-0.5">
                              {ex.options.map((opt) => (
                                <li key={opt.label} className="text-caption leading-relaxed text-fg-muted">
                                  <span className="mr-1.5 font-black">{opt.label})</span>
                                  <MarkedText segments={opt.textHL} fallback={opt.text} />
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <p className="text-caption leading-relaxed">
                            <MarkedText segments={ex.sentenceHL} fallback={ex.sentence} />
                          </p>
                        )}
                        {ex.translation ? (
                          <p className="mt-1 text-caption leading-relaxed text-fg-muted">
                            <MarkedText segments={ex.translationHL} fallback={ex.translation} />
                          </p>
                        ) : null}
                      </Collapsible>
                    ))}
                  </Card>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
