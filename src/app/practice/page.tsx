"use client";

/**
 * Practice —— 想练什么就练什么。
 *
 * 这不是「今天该做的事」，是**目录**。学生打开就能挑一个板块进去，
 * 做完记一笔，和首页推荐、周目标写进同一张表。
 *
 * 刻意不做的事：不按当前阶段排序、不显示"应该先做哪个"、
 * 不统计"这个月练了几次推荐之外的"。
 * 自主练习就是自主练习，不需要被系统评价。
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookMarked,
  Dumbbell,
  FileText,
  Headphones,
  Languages,
  LibraryBig,
  PenLine,
  SplitSquareVertical,
} from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet } from "@/components/ui/sheet";
import { Field, TextInput } from "@/components/ui/input";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { OffsiteSheet } from "@/components/today/offsite-sheet";
import { logStudy } from "@/lib/repo";
import { useCoverage, useRequireProfile } from "@/hooks/use-study";
import { nextPracticeTarget, type PaperArea, type PracticeTarget } from "@/lib/journey";
import { getPaper } from "@/lib/papers";
import { listeningSummary } from "@/lib/papers/nav";
import type { Paper } from "@/lib/papers/types";
import type { TaskType } from "@/lib/types";

interface Block {
  key: string;
  title: string;
  hint: string;
  icon: React.ReactNode;
  tint: "primary" | "lavender" | "mint" | "coral";
  href?: string;
  type?: TaskType;
  paperUnitId?: string;
  examPart?: string;
}

/**
 * 入口指向哪一套卷子，由「下一段该练什么」决定 ——
 * 这套练完就换下一套，不锁死在第一套卷子上。
 *
 * 提示语也按那套卷子的真实内容写：段数、范文点评还是参考范文、
 * 译点精析还是参考译文，都从数据里取，不写死一套的话给所有卷子。
 */
function blocksFor(targets: Partial<Record<PaperArea, PracticeTarget>>): Block[] {
  const paperOf = (area: PaperArea): Paper | undefined => {
    const t = targets[area];
    return t ? getPaper(t.paperId) : undefined;
  };
  const listening = paperOf("listening");
  const reading = paperOf("reading");
  const writing = paperOf("writing");
  const translation = paperOf("translation");
  const hrefOf = (area: PaperArea): string | undefined => {
    const t = targets[area];
    return t ? `/papers/${t.paperId}?unit=${t.unitId}` : undefined;
  };

  return [
  {
    key: "vocab",
    title: "核心词汇",
    hint: "上下册词库，一屏一词过",
    icon: <BookMarked className="size-[18px]" strokeWidth={2.6} />,
    tint: "mint",
    href: "/vocab",
    type: "vocab",
  },
  {
    key: "listen-intense",
    title: "精听",
    hint: "挑一小段，听完看原文",
    icon: <Headphones className="size-[18px]" strokeWidth={2.6} />,
    tint: "lavender",
    href: hrefOf("listening"),
    type: "intensive-listen",
  },
  {
    key: "listen-paper",
    title: "听力真题",
    hint: listening ? listeningSummary(listening) : "对话 / 短文 / 讲座",
    icon: <Headphones className="size-[18px]" strokeWidth={2.6} />,
    tint: "primary",
    href: listening ? `/papers/${listening.id}` : undefined,
    type: "listening-paper",
    examPart: "listening",
  },
  {
    key: "read-paper",
    title: "阅读真题",
    hint: "选词 / 匹配 / 仔细阅读",
    icon: <LibraryBig className="size-[18px]" strokeWidth={2.6} />,
    tint: "coral",
    href: reading ? `/papers/${reading.id}` : undefined,
    type: "reading-paper",
    examPart: "reading",
  },
  {
    key: "sentence",
    title: "长难句",
    hint: "拆句 + 翻译",
    icon: <SplitSquareVertical className="size-[18px]" strokeWidth={2.6} />,
    tint: "mint",
    type: "sentence",
  },
  {
    key: "translation",
    title: "翻译",
    hint: translation?.translation?.points
      ? "一段汉译英，含译点精析"
      : "一段汉译英，含参考译文",
    icon: <Languages className="size-[18px]" strokeWidth={2.6} />,
    tint: "lavender",
    href: hrefOf("translation"),
    type: "translation",
    paperUnitId: "translation",
    examPart: "translation",
  },
  {
    key: "writing",
    title: "写作",
    hint: writing?.writing?.comments
      ? "审题 + 范文 + 点评"
      : "审题 + 写完对一遍参考范文",
    icon: <PenLine className="size-[18px]" strokeWidth={2.6} />,
    tint: "mint",
    href: hrefOf("writing"),
    type: "writing",
    paperUnitId: "writing",
    examPart: "writing",
  },
  {
    key: "review",
    title: "错题复盘",
    hint: "回看做错的题",
    icon: <FileText className="size-[18px]" strokeWidth={2.6} />,
    tint: "coral",
    type: "review",
  },
  ];
}

export default function PracticePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, loaded } = useRequireProfile();
  const coverage = useCoverage();
  const [offsiteOpen, setOffsiteOpen] = useState(false);
  const [logging, setLogging] = useState<Block | null>(null);
  const [note, setNote] = useState("");

  if (!loaded || !profile) {
    return (
      <AppShell>
        <PageSkeleton />
      </AppShell>
    );
  }

  /* 四个板块各自下一段该练什么：跟着真题库轮换，这套练完换下一套 */
  const targets: Partial<Record<PaperArea, PracticeTarget>> = {};
  for (const area of ["listening", "reading", "writing", "translation"] as PaperArea[]) {
    const t = coverage ? nextPracticeTarget(area, coverage) : null;
    if (t) targets[area] = t;
  }
  const blocks = blocksFor(targets);

  async function submitLog() {
    if (!logging) return;
    await logStudy({
      title: logging.title,
      type: logging.type,
      source: "practice",
      detail: note.trim() || undefined,
      paperUnitId: logging.paperUnitId,
      examPart: logging.examPart,
    });
    setLogging(null);
    setNote("");
    toast({ title: "记下了" });
  }

  return (
    <AppShell>
      <div className="color-field px-5 pt-[max(20px,env(safe-area-inset-top))] pb-9">
        <span aria-hidden className="sticker -top-12 -right-10 size-40 bg-coral" />
        <p className="eyebrow-field relative">Practice</p>
        <h1 className="relative mt-3 text-title font-black tracking-[-0.03em] text-primary-fg">
          想练什么就练什么。
        </h1>
      </div>

      <div className="px-5 pt-6 pb-9">
        <ul className="grid grid-cols-2 gap-3">
          {blocks.map((b, i) => (
            <li key={b.key}>
              <button
                type="button"
                onClick={() => (b.href ? router.push(b.href) : setLogging(b))}
                className={`tap block w-full text-left ${i % 3 === 0 ? "rotate-tilt-a" : "rotate-tilt-b"}`}
              >
                <Card className="h-full p-4 transition-transform">
                  <span
                    className={`grid size-10 place-items-center rounded-full ${
                      b.tint === "primary"
                        ? "bg-primary text-primary-fg"
                        : b.tint === "lavender"
                          ? "bg-lavender text-on-accent"
                          : b.tint === "mint"
                            ? "bg-mint text-mint-fg"
                            : "bg-coral-soft text-coral-fg"
                    }`}
                  >
                    {b.icon}
                  </span>
                  <p className="mt-3 text-[15px] leading-tight font-black">{b.title}</p>
                  <p className="mt-1 text-caption leading-relaxed text-fg-muted">{b.hint}</p>
                </Card>
              </button>
            </li>
          ))}
        </ul>

        <Card className="mt-4 p-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-fg">
              <Dumbbell className="size-4" strokeWidth={2.6} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-black">在别处练的</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setOffsiteOpen(true)}>
              补记
            </Button>
          </div>
        </Card>
      </div>

      <OffsiteSheet open={offsiteOpen} onClose={() => setOffsiteOpen(false)} />

      <Sheet
        open={logging !== null}
        onClose={() => setLogging(null)}
        eyebrow="Practice"
        title={`记一笔「${logging?.title ?? ""}」`}
        footer={
          <Button className="w-full" onClick={() => void submitLog()}>
            记上
          </Button>
        }
      >
        <Field label="要不要写点什么" optional>
          <TextInput
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="随手一句"
            maxLength={40}
          />
        </Field>
      </Sheet>
    </AppShell>
  );
}
