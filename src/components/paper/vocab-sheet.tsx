"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { questionHref, sentenceHref } from "@/lib/papers";
import { addVocabEntry } from "@/lib/repo";

export interface VocabSeed {
  word: string;
  sourcePaperId: string;
  sourceQuestionNo?: number;
  sourceSentenceId?: string;
  sourceLabel: string;
  /** 在原文里点词收进来时，直接指回读到这个词的那一段 */
  sourceHref?: string;
  /** 出题时可建议的释义（来自解析册的生词表），只是建议，学生可以改 */
  suggestion?: string;
}

/**
 * 记生词面板。
 *
 * 只做一件事：把"读到的一个词"连同它的出处一起存下来。
 * 释义可以留空 —— 学生自己写印象最深，系统不替他编释义。
 */
export function VocabSheet({
  seed,
  open,
  onClose,
}: {
  seed: VocabSeed | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!seed) return null;
  /*
   * 表单按 seed 重新挂载：换一个词就得到一份干净的输入，
   * 不用 effect 去同步状态（同步状态在 effect 里会多渲染一轮，
   * 而且很容易漏掉某个字段）。
   */
  return (
    <VocabForm
      key={`${seed.word}__${seed.sourceQuestionNo ?? seed.sourceSentenceId ?? "x"}`}
      seed={seed}
      open={open}
      onClose={onClose}
    />
  );
}

function VocabForm({
  seed,
  open,
  onClose,
}: {
  seed: VocabSeed;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [word, setWord] = useState(seed.word);
  const [meaning, setMeaning] = useState(seed.suggestion ?? "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  // 回原处：从原文点的词按段落直链回去，从题库点的按题号/句子 id 反查，都不猜题段
  const href =
    seed.sourceHref ??
    (seed.sourceSentenceId
      ? sentenceHref(seed.sourcePaperId, seed.sourceSentenceId)
      : seed.sourceQuestionNo
        ? questionHref(seed.sourcePaperId, seed.sourceQuestionNo)
        : `/papers/${seed.sourcePaperId}`);

  async function handleSave() {
    setSaving(true);
    try {
      await addVocabEntry({
        word,
        meaning: meaning || undefined,
        note: note || undefined,
        sourcePaperId: seed.sourcePaperId,
        sourceQuestionNo: seed.sourceQuestionNo,
        sourceSentenceId: seed.sourceSentenceId,
        sourceLabel: seed.sourceLabel,
      });
      toast({ title: "收好了" });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow="Vocabulary"
      title="记个生词"
      description={seed.sourceLabel}
      footer={
        <div className="space-y-3">
          <Button block size="lg" loading={saving} onClick={() => void handleSave()}>
            存进生词本
          </Button>
          <Button block variant="soft" size="md" onClick={() => void router.push(href)}>
            回原题看看
          </Button>
        </div>
      }
    >
      <div className="space-y-4 pb-2">
        <label className="block">
          <span className="eyebrow mb-2 block text-fg-muted">WORD</span>
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="这个词"
            className="w-full rounded-row bg-surface-2 px-4 py-3 text-body outline-none focus-visible:ring-2 focus-visible:ring-fg"
          />
        </label>

        <label className="block">
          <span className="eyebrow mb-2 block text-fg-muted">释义（可留空）</span>
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="自己写，留空也行"
            className="w-full rounded-row bg-surface-2 px-4 py-3 text-label outline-none focus-visible:ring-2 focus-visible:ring-fg"
          />
        </label>

        <label className="block">
          <span className="eyebrow mb-2 block text-fg-muted">备注（可留空）</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="例句、联想、坑在哪"
            className="w-full resize-none rounded-row bg-surface-2 px-4 py-3 text-label leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-fg"
          />
        </label>
      </div>
    </Sheet>
  );
}


