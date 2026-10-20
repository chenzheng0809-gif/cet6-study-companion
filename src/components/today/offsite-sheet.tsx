"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Sheet } from "@/components/ui/sheet";
import { Field, TextInput } from "@/components/ui/input";
import { Chip } from "@/components/ui/choice";
import { logStudy } from "@/lib/repo";
import { todayKey } from "@/lib/date";
import type { StudyLog, TaskType } from "@/lib/types";
import { cn } from "@/lib/cn";

const KINDS: { type: TaskType; label: string }[] = [
  { type: "vocab", label: "背单词" },
  { type: "intensive-listen", label: "精听" },
  { type: "listening-paper", label: "听力真题" },
  { type: "reading-paper", label: "阅读真题" },
  { type: "writing", label: "写作" },
  { type: "translation", label: "翻译" },
  { type: "sentence", label: "长难句" },
  { type: "review", label: "错题复盘" },
  { type: "custom", label: "其他" },
];

/**
 * 站外记录 —— 在别处学的，补一笔进来。
 *
 * 和站内练习写的是**同一张表**，所以日历和周报不用为它单开一套口径。
 * 只记「什么时候做了什么」，不追问做了多久、做了多少 —— 那些学生自己也不一定说得清。
 */
export function OffsiteSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("custom");
  const [date, setDate] = useState(todayKey());

  async function submit() {
    const value = title.trim();
    if (!value) return;
    await logStudy({
      title: value,
      type,
      source: "offsite" satisfies StudyLog["source"],
      date,
    });
    setTitle("");
    onClose();
    toast({ title: "补上了" });
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow="Off-site"
      title="在别处学的，补一笔"
      footer={
        <ButtonLike onClick={() => void submit()} disabled={!title.trim()}>
          记上
        </ButtonLike>
      }
    >
      <div className="space-y-4">
        <Field label="做了什么">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="比如：背了 30 个单词"
            maxLength={40}
          />
        </Field>

        <Field label="是哪一类" optional>
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map((k) => (
              <Chip key={k.type} tone={type === k.type ? "primary" : "neutral"}>
                <button type="button" onClick={() => setType(k.type)} className="tap">
                  {k.label}
                </button>
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="日期">
          <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>
    </Sheet>
  );
}

function ButtonLike({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "tap h-14 w-full rounded-btn text-[15px] font-black",
        disabled ? "bg-surface-2 text-fg-subtle" : "bg-primary text-primary-fg shadow-hard",
      )}
    >
      {children}
    </button>
  );
}
