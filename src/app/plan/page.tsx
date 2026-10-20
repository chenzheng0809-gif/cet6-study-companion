"use client";

/**
 * Study Journey —— 「这周练什么」。
 *
 * 这一页只有三件事：
 *   1. 告诉你**现在是哪个阶段、为什么**，以及这周的推荐是怎么算出来的
 *   2. 列出这一周建议做的几件事（**不绑定任何日期**）
 *   3. 让你接受 / 自己挑一项删掉 / 换内容 / 整组忽略
 *
 * 刻意**没有**的东西：进度条、"应完成 8 项已完成 2 项"、逾期提醒、
 * 每周时间预算、学习档位。
 *
 * 一周有七天，人不是每天都能学。这里没有日程，也就没有欠账 ——
 * 周末自动归档，没做完的直接带走，下周重新推荐。
 */

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Info,
  BarChart3,
  Minus,
  Plus,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardLarge } from "@/components/ui/card";
import { Chip } from "@/components/ui/choice";
import { Field, TextInput } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  acceptWeeklyPlan,
  addWeeklyGoal,
  buildWeeklyReport,
  ignoreWeeklyPlan,
  logStudy,
  removeWeeklyGoal,
  saveProfile,
  undoGoal,
} from "@/lib/repo";
import {
  STAGES,
  WEAK_AREAS,
  WEAK_AREA_LABEL,
  areaCoverage,
  daysUntilExam,
  stageFor,
  type WeakArea,
} from "@/lib/journey";
import { taskTypeMeta } from "@/lib/journey-types";
import { Mood } from "@/components/mood/mood-line";
import { BOTTOM_LINE } from "@/lib/copy";
import type { TaskType } from "@/lib/types";
import { useCoverage, useProfileState, useRequireProfile, useWeeklyPlan } from "@/hooks/use-study";
import { useLiveQuery } from "dexie-react-hooks";
import { currentWeekStart } from "@/lib/repo";
import type { WeeklyGoalItem } from "@/lib/types";

/**
 * 推荐依据的总说明 —— 只有这一句，别处不另抄一份。
 *
 * 依据只有三种：考试剩余天数（客观）、系统记录的真题练习进度、用户标记的弱项。
 * 第三种只做微调：它能决定哪一项被标成薄弱，但定不了阶段、也定不了量。
 */
const BASIS_RULE =
  "推荐依据：考试剩余天数、系统记录的真题练习进度、用户标记的弱项（仅做微调使用）。";

export default function PlanPage() {
  const { profile, loaded } = useRequireProfile();
  const { plan, loading } = useWeeklyPlan();
  const coverage = useCoverage();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [basisOpen, setBasisOpen] = useState<string | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removePick, setRemovePick] = useState<string | null>(null);

  const report = useLiveQuery(() => buildWeeklyReport(currentWeekStart()), [plan?.goals.length]);

  if (!loaded || !profile) {
    return (
      <AppShell>
        <PageSkeleton />
      </AppShell>
    );
  }

  /*
   * 阶段 id 是生成推荐那一刻写进周计划里的。老计划可能存着已经下线的阶段
   * （建构期已删），所以认不出来时按今天的距考天数重算，别退回到「还没定考期」
   * —— 那句「先不定日程」跟一个定了考期的学生完全对不上。
   */
  const stage =
    STAGES.find((s) => s.id === plan?.stageId) ?? stageFor(daysUntilExam(profile.examDate));
  const goals = plan?.goals ?? [];
  const doneCount = goals.filter((g) => g.done).length;

  async function complete(item: WeeklyGoalItem) {
    await logStudy({
      title: item.title,
      type: item.type,
      source: "weekly-goal",
      goalItemId: item.id,
      paperId: item.paperId,
      paperUnitId: item.paperUnitId,
      examPart: item.examPart,
    });
    toast({ title: "记下了" });
  }

  return (
    <AppShell>
      <div className="color-field px-5 pt-[max(20px,env(safe-area-inset-top))] pb-9">
        <span aria-hidden className="sticker -top-12 -right-10 size-40 bg-mint" />
        <p className="eyebrow-field relative">Study Journey</p>
        <h1 className="relative mt-3 text-title font-black tracking-[-0.03em] text-primary-fg">
          {plan?.rationale ?? "这一周想练什么"}
        </h1>
        <p className="relative mt-2 text-caption leading-relaxed text-fg-muted">
          {stage.intent}
        </p>
      </div>

      <div className="space-y-3 px-5 pt-6 pb-9">
        {/* 阶段说明 */}
        <Card className="rotate-tilt-a p-4">
          <div className="flex items-center gap-2">
            <Target className="size-4 shrink-0" strokeWidth={2.6} />
            <span className="text-[15px] font-black">{stage.name}</span>
            <span className="num ml-auto text-caption text-fg-muted">{stage.en}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {STAGES.filter((s) => s.id !== "explore").map((s) => (
              <Chip key={s.id} tone={s.id === stage.id ? "primary" : "neutral"}>
                <span className="opacity-70">
                  {s.from === 0 ? "" : s.from}–{s.to === Infinity ? "∞" : s.to} 天
                </span>
              </Chip>
            ))}
          </div>
        </Card>

        {/* 练到哪儿了 —— 推荐依据的第二来源，摆出来让学生自己对得上账 */}
        {coverage ? (
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 shrink-0" strokeWidth={2.6} />
              <p className="text-[15px] font-black">你练到哪儿了</p>
            </div>
            <ul className="mt-3 space-y-1.5">
              {areaCoverage(coverage, stage).map((a) => (
                <li key={a.area} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-[13px] font-bold">
                    {WEAK_AREA_LABEL[a.area]}
                  </span>
                  <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-pill bg-surface-2">
                    <span
                      className={`block h-full rounded-pill ${
                        a.ratio >= 1 ? "bg-mint" : a.ratio > 0 ? "bg-primary" : "bg-transparent"
                      }`}
                      style={{ width: `${Math.min(100, Math.round(a.ratio * 100))}%` }}
                    />
                  </span>
                  <span className="num shrink-0 text-caption font-bold text-fg-muted">
                    {a.done}/{a.suggested}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {/* 本周建议 */}
        <CardLarge className="p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="eyebrow">这周建议</p>
            <span className="num text-caption text-fg-muted">
              {doneCount}/{goals.length} 完成
            </span>
          </div>
          {loading && goals.length === 0 ? (
            <p className="mt-4 text-caption text-fg-subtle">马上就好…</p>
          ) : goals.length === 0 ? (
            <p className="mt-4 text-caption text-fg-subtle">这周还没有建议。</p>
          ) : (
            <>
              <ul className="mt-4 space-y-2">
                {goals.map((g) => (
                  <GoalRow
                    key={g.id}
                    item={g}
                    onComplete={() => void complete(g)}
                    onUndo={() => void undoGoal(plan!.id, g.id)}
                    onRemove={() => void removeWeeklyGoal(plan!.id, g.id)}
                    onShowBasis={() => setBasisOpen(g.id)}
                  />
                ))}
              </ul>
              <p className="mt-3 text-caption leading-relaxed text-fg-subtle">{BASIS_RULE}</p>
            </>
          )}

          <div className="mt-4 flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => setAddOpen(true)}
              leadingIcon={<Plus className="size-4" />}
            >
              加一项
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setRemovePick(null);
                setRemoveOpen(true);
              }}
              disabled={goals.length <= 1}
              leadingIcon={<Minus className="size-4" />}
            >
              少一项
            </Button>
          </div>

          <div className="mt-2 space-y-2">
            {!plan?.accepted ? (
              <Button block onClick={() => void acceptWeeklyPlan(plan!.id)} leadingIcon={<Check className="size-4" />}>
                就按这几项来
              </Button>
            ) : null}
            <Button
              block
              variant="secondary"
              onClick={() => void ignoreWeeklyPlan(plan!.id)}
              leadingIcon={<X className="size-4" />}
            >
              这周不用推荐
            </Button>
          </div>
        </CardLarge>

        {/* 周报 */}
        {report ? (
          <Card className="p-4">
            <div className="flex items-center gap-1.5">
              <Sparkles className="size-3.5" strokeWidth={2.6} />
              <p className="eyebrow">这周回顾</p>
            </div>
            <ul className="mt-2.5 space-y-1.5">
              <li className="text-caption text-fg-muted">
                建议 {report.suggested} 项，完成 {report.completed} 项 ·{" "}
                {report.studyDays} 天有记录 · {report.units} 个模块
              </li>
              {report.nextFocus.map((line, i) => (
                <li key={i} className="text-caption leading-relaxed text-fg-muted">
                  · {line}
                </li>
              ))}
            </ul>
            {/* 全做完了就别安慰了 —— 「不在于多快」对刚完成的人是废话 */}
            {report.suggested > report.completed ? (
              <Mood scene="weekly" className="mt-3" />
            ) : null}

            <p className="mt-3 text-caption text-fg-subtle">{BOTTOM_LINE.score}</p>
          </Card>
        ) : null}

        {/* 弱项设置 */}
        <WeakAreaCard />
      </div>

      <AddGoalSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={async (title, type) => {
          if (!plan) return;
          await addWeeklyGoal(plan.id, { title, type });
          setAddOpen(false);
          toast({ title: "加上了" });
        }}
      />

      <Sheet
        open={basisOpen !== null}
        onClose={() => setBasisOpen(null)}
        eyebrow="为什么推荐这个"
        title="推荐依据"
        footer={
          <Button className="w-full" onClick={() => setBasisOpen(null)}>
            知道了
          </Button>
        }
      >
        <p className="rounded-row bg-surface-2 p-4 text-[14px] leading-relaxed">
          {goals.find((g) => g.id === basisOpen)?.basis ?? "这一项是你自己加的。"}
        </p>
        <p className="mt-3 text-caption leading-relaxed text-fg-muted">{BASIS_RULE}</p>
      </Sheet>

      <Sheet
        open={removeOpen}
        onClose={() => {
          setRemoveOpen(false);
          setRemovePick(null);
        }}
        eyebrow="Trim"
        title="少哪一项"
        footer={
          <Button
            className="w-full"
            disabled={!removePick}
            onClick={() => {
              if (!removePick || !plan) return;
              void removeWeeklyGoal(plan.id, removePick);
              setRemoveOpen(false);
              setRemovePick(null);
              toast({ title: "少了一项" });
            }}
          >
            少这一项
          </Button>
        }
      >
        <ul className="space-y-2">
          {goals.map((g) => {
            const on = removePick === g.id;
            const meta = taskTypeMeta(g.type);
            return (
              <li key={g.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setRemovePick(g.id)}
                  className={`tap flex w-full items-center gap-3 rounded-row p-3 text-left ${
                    on ? "bg-primary text-primary-fg" : "bg-surface-2"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-black">{g.title}</span>
                    <span
                      className={`block text-caption ${on ? "opacity-75" : "text-fg-muted"}`}
                    >
                      {meta.label !== g.title ? `${meta.label} · ` : ""}
                      {g.detail || "这一项你自己加的"}
                    </span>
                  </span>
                  {on ? <Check className="size-4 shrink-0" strokeWidth={3} /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>
    </AppShell>
  );
}

function GoalRow({
  item,
  onComplete,
  onUndo,
  onRemove,
  onShowBasis,
}: {
  item: WeeklyGoalItem;
  onComplete: () => void;
  onUndo: () => void;
  onRemove: () => void;
  onShowBasis: () => void;
}) {
  const meta = taskTypeMeta(item.type);
  return (
    <li className="rounded-row bg-surface-2 p-3">
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={item.done ? onUndo : onComplete}
          aria-label={item.done ? `撤销「${item.title}」` : `完成「${item.title}」`}
          className={`tap grid size-7 shrink-0 place-items-center rounded-full ${
            item.done ? "bg-primary text-primary-fg" : "bg-surface text-fg-muted"
          }`}
        >
          <Check className="size-4" strokeWidth={3} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {meta.label !== item.title ? (
              <Chip tone={item.done ? "neutral" : "primary"}>{meta.label}</Chip>
            ) : null}
            <span
              className={`text-[14px] font-bold ${item.done ? "line-through opacity-60" : ""}`}
            >
              {item.title}
            </span>
            {item.source === "student" ? <Chip tone="lavender">你自己加的</Chip> : null}
          </div>
          {item.basis && item.source === "system" ? (
            <button
              type="button"
              onClick={onShowBasis}
              className="tap mt-1 flex items-center gap-1 text-left text-caption text-fg-muted"
            >
              <Info className="size-3 shrink-0" strokeWidth={2.4} />
              {item.basis}
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`删除「${item.title}」`}
          className="tap shrink-0 text-fg-subtle"
        >
          <Trash2 className="size-3.5" strokeWidth={2.4} />
        </button>
      </div>
    </li>
  );
}

function WeakAreaCard() {
  const { profile } = useProfileState();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  if (!profile) return null;
  // 存一份局部引用：闭包里要用，TS 不会把 render 期的收窄带进函数体
  const me = profile;
  const current = new Set(me.weakAreas);

  async function toggle(value: WeakArea) {
    const next = current.has(value) ? [...current].filter((v) => v !== value) : [...current, value];
    await saveProfile({ ...me, weakAreas: next });
    void toast({ title: "标好了" });
  }

  return (
    <Card className="p-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="tap flex w-full items-center gap-2 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="eyebrow">你标的弱项</p>
          <p className="mt-1 text-caption text-fg-muted">
            {me.weakAreas.length > 0
              ? me.weakAreas
                  .map((w) => WEAK_AREAS.find((a) => a.value === w)?.label ?? w)
                  .join("、")
              : "还没标。"}
          </p>
        </div>
        <ChevronDown className="size-4 shrink-0 text-fg-muted" />
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Self Assessment"
        title="哪几块你觉得弱"
        footer={
          <Button className="w-full" onClick={() => setOpen(false)}>
            好了
          </Button>
        }
      >
        <div className="space-y-2">
          {WEAK_AREAS.map((a) => {
            const on = current.has(a.value);
            return (
              <button
                key={a.value}
                type="button"
                aria-pressed={on}
                onClick={() => void toggle(a.value)}
                className={`tap flex w-full items-center gap-3 rounded-row p-3 text-left ${
                  on ? "bg-primary text-primary-fg" : "bg-surface-2"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-black">{a.label}</span>
                  <span className={`block text-caption ${on ? "opacity-75" : "text-fg-muted"}`}>
                    {a.hint}
                  </span>
                </span>
                {on ? <Check className="size-4 shrink-0" strokeWidth={3} /> : null}
              </button>
            );
          })}
        </div>
      </Sheet>
    </Card>
  );
}

function AddGoalSheet({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, type: TaskType) => void;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("custom");
  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow="Add"
      title="加一项想练的"
      footer={
        <Button className="w-full" disabled={!title.trim()} onClick={() => onAdd(title, type)}>
          加上
        </Button>
      }
    >
      <div className="space-y-4">
        <Field label="做什么">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="比如：把长篇匹配的错题重做一遍"
            maxLength={30}
          />
        </Field>
        <Field label="类型">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["vocab", "单词"],
                ["intensive-listen", "精听"],
                ["sentence", "长难句"],
                ["review", "错题复盘"],
                ["custom", "其他"],
              ] as [TaskType, string][]
            ).map(([v, label]) => (
              <Chip key={v} tone={type === v ? "primary" : "neutral"}>
                <button type="button" onClick={() => setType(v)} className="tap">
                  {label}
                </button>
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </Sheet>
  );
}
