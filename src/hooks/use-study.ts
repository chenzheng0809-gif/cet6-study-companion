"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, startOfWeek, todayKey, type DateKey } from "@/lib/date";
import {
  archivePreviousWeek,
  ensureWeeklyPlan,
  getAllLogs,
  getWeeklyPlan,
  habitsOn,
  practiceCoverage,
  profile as readProfile,
  refreshWeeklyPlanText,
  settings as readSettings,
} from "@/lib/repo";
import {
  daysUntilExam,
  lightSuggestion,
  stageFor,
  type JourneyStage,
  type PracticeCoverage,
} from "@/lib/journey";
import { currentStreak, weekStat } from "@/lib/stats";
import type { Profile, StudyLog, WeeklyGoalItem, WeeklyPlan } from "@/lib/types";

export function useProfile() {
  return useLiveQuery(() => readProfile(), []);
}

export function useProfileState() {
  const result = useLiveQuery(async () => (await readProfile()) ?? null, []);
  return { profile: result ?? undefined, loaded: result !== undefined };
}

/**
 * 需要档案的页面用这个。
 *
 * 少了它，新用户从底栏点进「日历」或「我的」，看到的会是一块永远转不出来的骨架屏 ——
 * 因为这两个页面的内容全部来自档案，档案不存在就永远渲染不出来。
 * 与其让人对着一块骨架发呆，不如直接送回欢迎页。
 */
export function useRequireProfile() {
  const { profile, loaded } = useProfileState();
  const router = useRouter();

  useEffect(() => {
    if (loaded && !profile) router.replace("/welcome");
  }, [loaded, profile, router]);

  return { profile, loaded };
}

export function useSettings() {
  return useLiveQuery(() => readSettings(), []);
}

export function useAllLogs() {
  return useLiveQuery(() => getAllLogs(), []);
}

export function useCoverage(): PracticeCoverage | undefined {
  return useLiveQuery(() => practiceCoverage(), []);
}

/**
 * 拿到本周推荐目标；还没有就按 Study Journey 现生成一份。
 *
 * 读和写必须分开：
 *   · `useLiveQuery` 只读。Dexie 的 liveQuery 跑在一个**只读事务**里，
 *     在 querier 内部写库会直接抛 `ReadOnlyError: Readwrite transaction in
 *     liveQuery context`，整页直接崩。
 *   · 「没有就建一份」放到 effect 里做，而且**不往组件里 setState** ——
 *     写完之后 `weeklyPlans` 表变了，liveQuery 自己就会重新返回。
 *
 * 顺带解决了另一件事：这样一来，学生改过一项之后界面会立刻跟着更新
 * （之前用 useState 中转，表变了组件反而不知道）。
 */
export function useWeeklyPlan(): { plan: WeeklyPlan | undefined; loading: boolean } {
  const weekStart = startOfWeek(todayKey());
  const { profile, loaded } = useProfileState();
  const stored = useLiveQuery(() => getWeeklyPlan(weekStart), [weekStart]);
  const plan = stored && !stored.archived ? stored : undefined;

  useEffect(() => {
    if (plan) return;
    /*
     * 档案没就绪之前，绝不生成周计划。
     *
     * 这里以前是「只要还没有计划就建一份」，于是踩到一个很难复现的坑：
     * 学生还没填完 onboarding 就先进了 /plan（`useRequireProfile` 会把他弹去
     * /welcome，但本 hook 的 effect 早就跑完了），此刻 profile 还是 undefined，
     * `ensureWeeklyPlan` 里那句 `profile?.examDate ?? todayKey()` 把「还没填考期」
     * 算成了「距考 0 天」，于是生成一份 **考前一周** 的推荐并**存进库**。
     * 等学生填完考期再回来，计划已经存在、不再重算，
     * 于是「距考试 0 天 · 考前一周」就一直挂在那儿，还会按考前一周的标准量
     * 去推荐题段 —— 直接违反「阶段只看距考天数」和「推荐必须可追溯」两条底线。
     */
    if (!loaded || !profile) return;
    let alive = true;
    void ensureWeeklyPlan(weekStart)
      .then(() => {
        // 不用返回值：写完 liveQuery 会自己更新，这里 setState 只会多一次渲染
        if (!alive) return;
      })
      .catch((err: unknown) => {
        // 不能静默吞掉：生成失败会让首页空空如也，页面上看不出任何异常
        console.error("[ensureWeeklyPlan] 生成失败", weekStart, err);
      });
    return () => {
      alive = false;
    };
  }, [plan, weekStart, loaded, profile]);

  /*
   * 标题那句话和每一项的依据都是系统话术，会随三样东西变：
   * 文案改了版、学生又练了新的题、还有日子本身在走。
   * 计划是存下来的，存下来的话就容易锁死在生成那一刻的样子上 ——
   * 所以每次打开这一周的计划，都按当前状态重算一遍。
   *
   * 写回库里是安全的：算出来跟原来一样时不会写，
   * 写完之后 liveQuery 会把新计划送回来，再算一次还是一样的，不会转圈。
   */
  useEffect(() => {
    if (!plan) return;
    void refreshWeeklyPlanText(plan.id).catch((err: unknown) => {
      console.error("[refreshWeeklyPlanText] 话术刷新失败", plan.id, err);
    });
  }, [plan, weekStart]);

  return { plan, loading: plan === undefined };
}

/** 周一进来时把上周归档 —— 归档 = 不追责，不显示未完成，不结转。 */
export function useWeekRollover() {
  const weekStart = startOfWeek(todayKey());
  useEffect(() => {
    void archivePreviousWeek(weekStart).catch((err: unknown) => {
      console.error("[archivePreviousWeek] 归档失败", weekStart, err);
    });
  }, [weekStart]);
}

/* ------------------------------------------------------------------ bundle */

export interface TodayBundle {
  ready: boolean;
  profile: Profile;
  today: DateKey;
  logs: StudyLog[];
  /** 今天做了什么 */
  todayLogs: StudyLog[];
  /** 今天的习惯做过了没有 */
  habits: { vocab: boolean; listening: boolean };
  week: ReturnType<typeof weekStat>;
  streak: number;
  plan: WeeklyPlan | undefined;
  stage: JourneyStage;
  daysLeft: number | null;
  /** 首页给的那一项 */
  focus: FocusCandidate | undefined;
  /** 「换一项」轮到的备选 */
  focusOptions: FocusCandidate[];
  /** 「换一项」：把首页那一项往后轮一位，不改变今天实际做了什么 */
  shuffle: () => void;
  light: ReturnType<typeof lightSuggestion>;
}

export interface FocusCandidate {
  id: string;
  title: string;
  hint: string;
  type: StudyLog["type"];
  paperId?: string;
  paperUnitId?: string;
  examPart?: string;
  /** 这项是从哪儿来的：周目标 / 习惯 / 练习 */
  from: "weekly-goal" | "habit" | "practice";
  basis?: string;
  /** 练的是哪一套的哪一段（真题推荐会跟着卷子轮换） */
  detail?: string;
}

/**
 * 首页的 Today's Focus。
 *
 * 只挑**一项**，而且必须挑得出理由：
 *   1. 本周还没完成的推荐目标（这是"这周该做的事"里最靠前的一件）
 *   2. 今天还没做的习惯（单词 / 精听）
 *   3. 都没有 → 给一句"想练什么都行"，把主动权交回去
 *
 * 永远只推一项 —— 首页是给"现在打开就能开始"用的，
 * 摆十条待办等于什么都没推。
 */
export function buildFocus(
  plan: WeeklyPlan | undefined,
  habits: { vocab: boolean; listening: boolean },
  offset: number,
): FocusCandidate[] {
  const options: FocusCandidate[] = [];

  for (const g of plan?.goals ?? []) {
    if (g.done) continue;
    options.push({
      id: `goal-${g.id}`,
      title: g.title,
      hint: g.basis || "本周推荐里还没做的一项",
      type: g.type,
      paperId: g.paperId,
      paperUnitId: g.paperUnitId,
      examPart: g.examPart,
      from: "weekly-goal",
      basis: g.basis,
      detail: g.detail,
    });
  }

  if (!habits.vocab) {
    options.push({
      id: "habit-vocab",
      title: "过几个词",
      hint: "核心词库随便翻，看到眼熟的就收进生词本。",
      type: "vocab",
      from: "habit",
    });
  }
  if (!habits.listening) {
    options.push({
      id: "habit-listen",
      title: "精听一小段",
      hint: "挑一题段，听完看原文就行，不用全对。",
      type: "intensive-listen",
      from: "habit",
    });
  }

  if (options.length === 0) {
    options.push({
      id: "free",
      title: "今天想练什么就练什么",
      hint: "本周推荐都做完了。去练习里挑一块，或者休息一天。",
      type: "custom",
      from: "practice",
    });
  }

  const safeOffset = options.length > 0 ? Math.abs(offset) % options.length : 0;
  return [...options.slice(safeOffset), ...options.slice(0, safeOffset)];
}

export function useTodayData(): TodayBundle | undefined {
  const { profile, loaded } = useProfileState();
  const logs = useAllLogs();
  const coverage = useCoverage();
  const { plan } = useWeeklyPlan();
  const stage = useMemo(() => {
    const d = profile ? daysUntilExam(profile.examDate) : null;
    return stageFor(d);
  }, [profile]);
  useWeekRollover();

  const [habits, setHabits] = useState({ vocab: false, listening: false });
  const today = todayKey();
  useEffect(() => {
    let alive = true;
    void habitsOn(today)
      .then((h) => {
        if (alive) setHabits(h);
      })
      .catch((err: unknown) => console.error("[habitsOn] 读取习惯记录失败", err));
    return () => {
      alive = false;
    };
  }, [today, logs]);

  const [offset, setOffset] = useState(0);
  const shuffle = useCallback(() => setOffset((v) => v + 1), []);

  if (!loaded || !profile || logs === undefined) return undefined;

  const todayLogs = logs.filter((l) => l.date === today);
  const focusOptions = buildFocus(plan, habits, offset);
  const EMPTY_COVERAGE: PracticeCoverage = {
    finishedUnits: [],
    finishedUnitsByPaper: {},
    writings: 0,
    translations: 0,
    vocabTouched: 0,
    offsiteLogs: 0,
  };

  return {
    ready: true,
    profile,
    today,
    logs,
    todayLogs,
    habits,
    week: weekStat(logs, today),
    streak: currentStreak(logs, today),
    plan,
    stage,
    daysLeft: daysUntilExam(profile.examDate),
    focus: focusOptions[0],
    focusOptions,
    shuffle,
    light: lightSuggestion({ coverage: coverage ?? EMPTY_COVERAGE, habitsToday: habits }),
  };
}

export function useWeekData() {
  const logs = useAllLogs();
  const { plan } = useWeeklyPlan();
  return { logs, plan, stat: logs ? weekStat(logs, todayKey()) : undefined };
}

export function greeting(date = new Date()): { en: string; zh: string } {
  const hour = date.getHours();
  if (hour < 5) return { en: "Good night", zh: "夜深了，注意休息" };
  if (hour < 12) return { en: "Good morning", zh: "今天也向目标前进一步。" };
  if (hour < 18) return { en: "Good afternoon", zh: "今天也向目标前进一步。" };
  return { en: "Good evening", zh: "今天也向目标前进一步。" };
}

export { addDays };
export type { WeeklyGoalItem };
