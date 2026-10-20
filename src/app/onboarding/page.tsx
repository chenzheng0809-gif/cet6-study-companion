"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlowShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChoiceCard, RadioRow } from "@/components/ui/choice";
import { Stepper } from "@/components/ui/feedback";
import { Field, TextInput } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { PageSkeleton } from "@/components/ui/skeleton";
import { formatFullDate, todayKey } from "@/lib/date";
import { defaultSession, findSession, upcomingSessions } from "@/lib/exam";
import { WEAK_AREAS } from "@/lib/journey";
import { saveProfile, saveSettings } from "@/lib/repo";
import { db } from "@/lib/db";
import type { TargetScorePreset } from "@/lib/types";
import { useProfileState } from "@/hooks/use-study";

const TOTAL_STEPS = 3;

const TARGET_PRESETS: { value: TargetScorePreset; label: string; description: string }[] = [
  { value: 425, label: "425", description: "先稳稳过线" },
  { value: 500, label: "500", description: "稳中有升" },
  { value: 550, label: "550+", description: "冲击高分段" },
  { value: "custom", label: "自定义", description: "填写具体分数" },
];

interface FormState {
  cet4Score: string;
  cet6History: "none" | "taken";
  cet6PastScore: string;
  targetPreset: TargetScorePreset;
  targetCustom: string;
  weakAreas: string[];
  examSessionId: string;
  examDate: string;
}

function parseScore(raw: string): number | null {
  const value = Number(raw.trim());
  if (!raw.trim() || Number.isNaN(value)) return null;
  if (value < 0 || value > 710) return null;
  return Math.round(value);
}

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, loaded } = useProfileState();

  const sessions = useMemo(() => upcomingSessions(), []);
  const initialSession = useMemo(() => defaultSession(), []);

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    cet4Score: "",
    cet6History: "none",
    cet6PastScore: "",
    targetPreset: 500,
    targetCustom: "",
    weakAreas: [],
    examSessionId: initialSession.id,
    examDate: initialSession.date,
  });

  // 提交成功后 profile 立刻就有了，会把上面那条"已填过就去 /today"的守卫也点亮。
  // 不拦一下的话两个跳转会打架，学生明明填完了却被弹回首页，看不到刚生成的那周建议。
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!loaded) return;
    if (profile && !submittedRef.current) router.replace("/today");
  }, [loaded, profile, router]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  }

  function validateStep(current: number): string | null {
    if (current === 1) {
      if (parseScore(form.cet4Score) === null) return "请填写四级总分（0–710 之间）。";
      if (form.cet6History === "taken" && parseScore(form.cet6PastScore) === null) {
        return "请填写六级历史成绩，或切换为“没考过”。";
      }
    }
    if (current === 2) {
      if (form.targetPreset === "custom" && parseScore(form.targetCustom) === null) {
        return "请填写你的目标分数（0–710 之间）。";
      }
    }
    return null;
  }

  async function handleNext() {
    const problem = validateStep(step);
    if (problem) {
      setError(problem);
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      setError(null);
      return;
    }

    setSaving(true);
    submittedRef.current = true;
    try {
      const targetScore =
        form.targetPreset === "custom"
          ? (parseScore(form.targetCustom) ?? 500)
          : Number(form.targetPreset);
      const session = findSession(form.examSessionId) ?? initialSession;

      await db.transaction("rw", [db.profile, db.settings], async () => {
        await saveProfile({
          id: "me",
          nickname: "同学",
          major: "",
          cet4Score: parseScore(form.cet4Score),
          cet6History: form.cet6History,
          cet6PastScore:
            form.cet6History === "taken" ? parseScore(form.cet6PastScore) : null,
          targetScore,
          targetPreset: form.targetPreset,
          weakAreas: form.weakAreas,
          examSessionId: session.id,
          examDate: form.examDate,
          createdAt: profile?.createdAt ?? Date.now(),
          updatedAt: Date.now(),
        });
        await saveSettings({ onboarded: true });
      });

      toast({ title: "好了", description: "去看看这周练什么" });
      router.push("/plan");
    } catch {
      setError("保存失败，请重试或检查浏览器存储权限。");
      setSaving(false);
    }
  }

  if (!loaded) {
    return (
      <FlowShell>
        <PageSkeleton />
      </FlowShell>
    );
  }

  return (
    <FlowShell>
      <div className="flex min-h-dvh flex-col">
        <header className="color-field px-5 pt-[max(20px,env(safe-area-inset-top))] pb-5">
          <span aria-hidden className="sticker -top-10 -right-8 size-28 bg-lavender" />
          <span aria-hidden className="sticker right-32 -bottom-12 size-20 bg-coral" />
          <div className="relative flex items-center gap-3">
            <button
              type="button"
              aria-label="返回上一步"
              onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
              className="tap -ml-2 flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-fg shadow-hard-sm"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="min-w-0 flex-1 rounded-pill bg-surface px-4 py-2.5 shadow-hard-sm">
              <Stepper step={step} total={TOTAL_STEPS} />
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          {step === 1 ? (
            <StepOne form={form} update={update} />
          ) : step === 2 ? (
            <StepTwo form={form} update={update} />
          ) : (
            <StepThree form={form} update={update} sessions={sessions} />
          )}

          {error ? (
            <p className="mt-5 rounded-row border-2 border-coral bg-coral-soft px-4 py-3 text-caption font-bold text-coral-fg">
              {error}
            </p>
          ) : null}
        </div>

        <div className="border-t-2 border-border bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
          <Button
            size="lg"
            block
            loading={saving}
            trailingIcon={
              step < TOTAL_STEPS ? (
                <ArrowRight className="size-[18px]" />
              ) : (
                <Check className="size-[18px]" strokeWidth={2.6} />
              )
            }
            onClick={handleNext}
          >
            {step < TOTAL_STEPS ? "下一步" : "生成我的计划"}
          </Button>
        </div>
      </div>
    </FlowShell>
  );
}

/* ------------------------------------------------------------------- steps */

type StepProps = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

function StepTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-6 rotate-tilt-a">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h1 className="text-title font-black tracking-[-0.03em]">{title}</h1>
      {description ? <p className="mt-2 text-label text-fg-muted">{description}</p> : null}
    </div>
  );
}

function StepOne({ form, update }: StepProps) {
  return (
    <div>
      <StepTitle
        eyebrow="Baseline"
        title="先了解一下你的起点"
      />

      <div className="space-y-6">
        <Field label="四级总分" hint="满分 710 分，填个大概就行">
          <TextInput
            inputMode="numeric"
            placeholder="例如 480"
            value={form.cet4Score}
            onChange={(event) => update("cet4Score", event.target.value.replace(/[^\d]/g, "").slice(0, 3))}
            suffix="分"
          />
        </Field>

        <Field label="六级经历">
          <div className="flex gap-3">
            <RadioRow
              selected={form.cet6History === "none"}
              title="没考过"
              description="第一次上考场"
              onSelect={() => update("cet6History", "none")}
            />
            <RadioRow
              selected={form.cet6History === "taken"}
              title="考过"
              description="已经有历史成绩"
              onSelect={() => update("cet6History", "taken")}
            />
          </div>
        </Field>

        {form.cet6History === "taken" ? (
          <Field label="六级历史成绩">
            <TextInput
              inputMode="numeric"
              placeholder="例如 430"
              value={form.cet6PastScore}
              onChange={(event) =>
                update("cet6PastScore", event.target.value.replace(/[^\d]/g, "").slice(0, 3))
              }
              suffix="分"
            />
          </Field>
        ) : null}
      </div>
    </div>
  );
}

function StepTwo({ form, update }: StepProps) {
  return (
    <div>
      <StepTitle
        eyebrow="Target"
        title="你想考到多少分"
      />

      <div className="space-y-3">
        {TARGET_PRESETS.map((preset) => (
          <ChoiceCard
            key={String(preset.value)}
            selected={form.targetPreset === preset.value}
            title={preset.label}
            description={preset.description}
            onSelect={() => update("targetPreset", preset.value)}
          />
        ))}
      </div>

      {form.targetPreset === "custom" ? (
        <Field label="自定义目标分数" className="mt-5">
          <TextInput
            inputMode="numeric"
            placeholder="例如 580"
            value={form.targetCustom}
            onChange={(event) => update("targetCustom", event.target.value.replace(/[^\d]/g, "").slice(0, 3))}
            suffix="分"
          />
        </Field>
      ) : null}
    </div>
  );
}

function StepThree({
  form,
  update,
  sessions,
}: StepProps & { sessions: ReturnType<typeof upcomingSessions> }) {
  return (
    <div>
      <StepTitle
        eyebrow="Journey"
        title="你在为哪一场考试准备"
      />

      <div className="space-y-6">
        <Field label="目标考试场次">
          <Card className="divide-y divide-line overflow-hidden">
            {sessions.map((session) => {
              const selected = form.examSessionId === session.id;
              return (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => {
                    update("examSessionId", session.id);
                    update("examDate", session.date);
                  }}
                  className="tap flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-surface-2"
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                      selected ? "bg-primary text-primary-fg" : "border-2 border-decor"
                    }`}
                  >
                    {selected ? <Check className="size-3.5" strokeWidth={3.5} /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-black tracking-[-0.02em]">
                      {session.label} 场次
                    </span>
                    <span className="block text-caption text-fg-muted">
                      {formatFullDate(session.date)} · 预估
                    </span>
                  </span>
                </button>
              );
            })}
          </Card>
        </Field>

        <Field label="考试日期">
          <TextInput
            type="date"
            value={form.examDate}
            min={todayKey()}
            onChange={(event) => {
              if (event.target.value) update("examDate", event.target.value);
            }}
          />
        </Field>
      </div>

      <div className="mt-8">
        <h2 className="mb-1 text-section font-black tracking-[-0.02em]">哪几块你自己觉得弱</h2>
        <div className="space-y-2">
          {WEAK_AREAS.map((area) => {
            const on = form.weakAreas.includes(area.value);
            return (
              <button
                key={area.value}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  update(
                    "weakAreas",
                    on
                      ? form.weakAreas.filter((w) => w !== area.value)
                      : [...form.weakAreas, area.value],
                  )
                }
                className={`tap flex w-full items-center gap-3 rounded-row p-3 text-left ${
                  on ? "bg-primary text-primary-fg" : "bg-surface-2"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-black">{area.label}</span>
                  <span className={`block text-caption ${on ? "opacity-75" : "text-fg-muted"}`}>
                    {area.hint}
                  </span>
                </span>
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full ${
                    on ? "bg-primary-fg text-primary" : "border-2 border-decor"
                  }`}
                >
                  {on ? <Check className="size-3" strokeWidth={4} /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
