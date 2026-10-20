import Dexie, { type Table } from "dexie";
import type {
  PaperAttempt,
  PlanChange,
  Profile,
  Settings,
  StudyLog,
  VocabEntry,
  WeeklyPlan,
} from "./types";

/**
 * Local-first storage. Everything the student does lives in IndexedDB on this
 * device — no account, no server. Round 2 adds the upgrade interface for a real
 * spaced-repetition store (word / listening annotations) without touching pages.
 */
class Cet6Database extends Dexie {
  profile!: Table<Profile, string>;
  /** 本周推荐目标（一组），不绑日期 */
  weeklyPlans!: Table<WeeklyPlan, string>;
  /** 唯一的学习记录：Focus / Habit / Practice / 周目标 / 站外 都写这里 */
  logs!: Table<StudyLog, string>;
  settings!: Table<Settings, string>;
  /** 真题作答记录：每套卷一份，含逐题作答与用时 */
  paperAttempts!: Table<PaperAttempt, string>;
  /** 学生自己攒的生词 */
  vocab!: Table<VocabEntry, string>;
  /** 计划调整记录，只追加不改写 */
  changes!: Table<PlanChange, string>;

  constructor() {
    super("cet6-study-companion");
    this.version(1).stores({
      profile: "id",
      plans: "id, createdAt, isCurrent, effectiveFrom",
      tasks: "id, date, planId, status, kind, [date+status]",
      logs: "id, date",
      settings: "id",
    });
    this.version(2).stores({
      profile: "id",
      plans: "id, createdAt, isCurrent, effectiveFrom",
      tasks: "id, date, planId, status, kind, [date+status]",
      logs: "id, date",
      settings: "id",
      paperAttempts: "id, paperId, updatedAt",
    });
    /*
     * v3 —— 计量单位从"分钟"换成"模块"。
     *
     * 这是一次真实的数据迁移，不是改个字段名了事：老记录里只有 minutes，
     * 不补的话老任务会渲染成 "undefined 个模块"，老计划会算出 NaN 额度。
     *
     * 迁移只做换算，不改任何学生的事实：状态、完成时间、id 原样保留。
     * minutes → units 没有可信的换算关系（15 分钟不等于 1.5 个"模块"，
     * 更没有依据说它等于 1），所以这里只保留模块数，
     * 把旧的分钟估算丢掉 —— 反正那个数字本来就不该出现。
     */
    this.version(3)
      .stores({
        profile: "id",
        plans: "id, createdAt, isCurrent, effectiveFrom",
        tasks: "id, date, planId, status, kind, [date+status]",
        logs: "id, date",
        settings: "id",
        paperAttempts: "id, paperId, updatedAt",
      })
      .upgrade(async (tx) => {
        await tx
          .table("tasks")
          .toCollection()
          .modify((task: Record<string, unknown>) => {
            if (typeof task.units !== "number" || !Number.isFinite(task.units)) {
              // 老任务是"一分钟级的单件事"，迁过来统一按 1 个模块计
              task.units = 1;
            }
            delete task.minutes;
            delete task.actualMinutes;
          });

        await tx
          .table("plans")
          .toCollection()
          .modify((plan: Record<string, unknown>) => {
            // v6 会把整张表清空，这里只是保持升级链能跑通
            delete plan.weeklyUnits;
            delete plan.extraUnits;
            delete plan.budgetMinutes;
            delete plan.extraMinutes;
          });

        await tx
          .table("logs")
          .toCollection()
          .modify((log: Record<string, unknown>) => {
            if (typeof log.units !== "number" || !Number.isFinite(log.units)) {
              log.units = 1;
            }
            delete log.minutes;
          });

        await tx
          .table("paperAttempts")
          .toCollection()
          .modify((attempt: Record<string, unknown>) => {
            // sessions 是第三轮才加的，旧记录没有这个字段
            if (!attempt.sessions || typeof attempt.sessions !== "object") {
              attempt.sessions = {};
            }
          });
      });

    /* v4 —— 学生自己攒的生词本。 */
    this.version(4).stores({
      profile: "id",
      plans: "id, createdAt, isCurrent, effectiveFrom",
      tasks: "id, date, planId, status, kind, [date+status]",
      logs: "id, date",
      settings: "id",
      paperAttempts: "id, paperId, updatedAt",
      vocab: "id, word, sourcePaperId, createdAt",
    });

    /*
     * v5 —— 计划从"每周模板"改成"规则 + 目标 + 修改记录"。
     *
     * 老模型只有 tasks，每次刷新都从档位模板整周重建，所以学生改过的日期、
     * 删掉的任务、调过的训练量都会被刷回去 —— 这正是这次要根治的问题。
     * 新模型把"要做什么"存成 rules（长期），把"哪天做"存成 tasks（物化），
     * 两边分开，学生改日期就不动目标。
     *
     * 迁移只做补齐，不改任何已经发生的事实：
     *   · 老任务补 type（按 kind 推）、flexible=false、estMin 不填（不猜）
     *   · 老计划补 mode="recommended"（学生还没编辑过新模型）
     *   · 老设置补 restWeekdays=[]
     */
    this.version(5)
      .stores({
        profile: "id",
        plans: "id, createdAt, isCurrent, effectiveFrom",
        tasks: "id, date, planId, status, kind, ruleId, goalId, [date+status]",
        logs: "id, date",
        settings: "id",
        paperAttempts: "id, paperId, updatedAt",
        vocab: "id, word, sourcePaperId, createdAt",
        rules: "id, familyId, archived, sortKey",
        goals: "id, familyId, weekStart",
        changes: "id, familyId, createdAt",
      })
      .upgrade(async (tx) => {
        const TYPE_BY_KIND: Record<string, string> = {
          practice: "reading-paper",
          vocabulary: "vocab",
          listening: "intensive-listen",
          review: "review",
          summary: "skill-card",
          custom: "custom",
        };
        await tx
          .table("tasks")
          .toCollection()
          .modify((task: Record<string, unknown>) => {
            if (!task.type) {
              task.type = TYPE_BY_KIND[String(task.kind)] ?? "custom";
            }
            // 老任务的 date 就是它实际安排的那天，一律按固定任务处理
            if (task.flexible === undefined) task.flexible = false;
            // estMin 故意不填：没有任何可信依据能从模块数反推分钟，
            // 编一个数字出来比空着更糟。健康检查会如实说"有几项没填"。
            if (task.sortKey === undefined) task.sortKey = 0;
          });

        await tx
          .table("plans")
          .toCollection()
          .modify((plan: Record<string, unknown>) => {
            if (!plan.mode) plan.mode = "recommended";
          });

        await tx
          .table("settings")
          .toCollection()
          .modify((settings: Record<string, unknown>) => {
            if (!Array.isArray(settings.restWeekdays)) settings.restWeekdays = [];
          });
      });

    /*
     * v6 —— 计划模块推倒重来。
     *
     * 定位从「按档位排每天」改成「每周推荐一组目标 + 随时可自主练习」：
     * 删掉 L1–L4 档位、每周时间预算、每日任务表、重复规则表；
     * 新增 weeklyPlans；logs 变成全 App 唯一的「我做了 X」。
     *
     * **旧计划数据在这里清空**，这是学生明确选的"全部清空，重新开始"。
     * 清掉的是「安排」：计划版本、每日任务、旧日志、规则、目标、修改记录。
     * 保留的是「事实」：profile、settings、生词本、真题作答记录 ——
     * 那些是学生真的练出来的东西，不该因为改了产品定位就没了。
     */
    this.version(6)
      .stores({
        profile: "id",
        weeklyPlans: "id, weekStart, archived",
        logs: "id, date, source",
        settings: "id",
        paperAttempts: "id, paperId, updatedAt",
        vocab: "id, word, sourcePaperId, createdAt",
        changes: "id, createdAt",
      })
      .upgrade(async (tx) => {
        // Dexie 的 Table 才有 clear()；tx.table() 拿到的是 Transaction 子表，
        // 所以先取出来再逐条删。
        for (const name of ["plans", "tasks", "rules", "goals", "changes", "logs"]) {
          const rows = (await tx.table(name).toArray()) as { id: string }[];
          if (rows.length > 0) await tx.table(name).bulkDelete(rows.map((r) => r.id));
        }
        await tx
          .table("profile")
          .toCollection()
          .modify((profile: Record<string, unknown>) => {
            delete profile.level;
            delete profile.weeklyUnits;
            if (!Array.isArray(profile.weakAreas)) profile.weakAreas = [];
          });
        await tx
          .table("settings")
          .toCollection()
          .modify((settings: Record<string, unknown>) => {
            delete settings.restWeekdays;
          });
      });
  }
}

export const db = new Cet6Database();

export const isBrowser = typeof window !== "undefined";

export const DEFAULT_SETTINGS: Settings = {
  id: "app",
  theme: "system",
  remindersEnabled: false,
  reminderTime: "20:00",
  paused: false,
  onboarded: false,
  updatedAt: 0,
};
