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
import { useRequireProfile } from "@/hooks/use-study";
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

const BLOCKS: Block[] = [
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
    href: "/papers/2025-12-set1?unit=l-r1",
    type: "intensive-listen",
  },
  {
    key: "listen-paper",
    title: "听力真题",
    hint: "新闻 / 对话 / 讲座，七段",
    icon: <Headphones className="size-[18px]" strokeWidth={2.6} />,
    tint: "primary",
    href: "/papers/2025-12-set1",
    type: "listening-paper",
    examPart: "listening",
  },
  {
    key: "read-paper",
    title: "阅读真题",
    hint: "选词 / 匹配 / 仔细阅读",
    icon: <LibraryBig className="size-[18px]" strokeWidth={2.6} />,
    tint: "coral",
    href: "/papers/2025-12-set1",
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
    hint: "一段汉译英，含参考译文",
    icon: <Languages className="size-[18px]" strokeWidth={2.6} />,
    tint: "lavender",
    href: "/papers/2025-12-set1?unit=translation",
    type: "translation",
    paperUnitId: "translation",
    examPart: "translation",
  },
  {
    key: "writing",
    title: "写作",
    hint: "审题 + 范文 + 点评",
    icon: <PenLine className="size-[18px]" strokeWidth={2.6} />,
    tint: "mint",
    href: "/papers/2025-12-set1?unit=writing",
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

export default function PracticePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, loaded } = useRequireProfile();
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
          {BLOCKS.map((b, i) => (
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
