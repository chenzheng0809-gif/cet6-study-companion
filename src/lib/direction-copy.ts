/**
 * Copy for the three homepage directions under evaluation.
 *
 * Same product, same data — three different voices. The current app speaks
 * "supportive supervisor"; the point of this comparison is to hear how much
 * more like a real product each voice sounds.
 */

export interface DirectionCopy {
  id: "A" | "B" | "C";
  name: string;
  tagline: string;
  axis: string;
  meta: string;
}

export const DIRECTIONS: DirectionCopy[] = [
  {
    id: "A",
    name: "排版驱动",
    tagline: "EDITORIAL RAW",
    axis: "靠字号和留白制造重音，几乎不用卡片",
    meta: "暖白 · 墨黑 · 一根线",
  },
  {
    id: "B",
    name: "撞色贴纸",
    tagline: "STICKER TIDE",
    axis: "高饱和撞色 + 硬阴影 + 轻微倾斜",
    meta: "荧光绿 × 紫 × 珊瑚 · 32px 圆角",
  },
  {
    id: "C",
    name: "养成系统",
    tagline: "PLAYER HUD",
    axis: "游戏化数据感，连击与经验值驱动",
    meta: "暗色 · 等宽数字 · 格子进度",
  },
] as const;

export const copy = {
  A: {
    countdownLabel: "距考试",
    countdownUnit: "DAYS",
    focusTitle: (n: number) => `今天欠你 ${n} 项`,
    focusKicker: "先把这个啃掉",
    cta: "开始",
    others: "剩下的",
    weekLabel: "本周",
    weekUnit: "天",
    streak: (n: number) => `连着 ${n} 天`,
    microTitle: "今天实在没状态？",
    microDesc: "也行，做一件小事把今天接上",
    empty: "今天的事做完了",
    emptyDesc: "剩下的时间是你自己的",
    noTask: "今天没有安排",
  },
  B: {
    headline1: "现在不学",
    headline2: "什么时候学？",
    sub: "行吧，先把这个啃了",
    sticker: (n: number) => `距考 ${n} 天`,
    focusTitle: "今日份任务",
    focusDesc: "不差这一件，但差这件就完蛋",
    cta: "冲",
    others: "顺手把这个也做了",
    weekLabel: "这周你还行",
    streak: (n: number) => `连着 ${n} 天，别断啊`,
    microTitle: "今天没状态？",
    microDesc: "那也得来一下，不然亏的是自己",
    empty: "今天摸鱼成功",
    emptyDesc: "明天记得回来，别真断",
    noTask: "今天没活儿",
  },
  C: {
    level: "LV.03",
    mission: "今日任务",
    priority: "优先目标",
    streak: (n: number) => `连击 ${n} DAYS`,
    energy: "ENERGY",
    cta: "START",
    others: "PENDING",
    weekLabel: "本周战报",
    weekUnit: "ACTIVE DAYS",
    xp: (m: number) => `本周经验 +${m}`,
    microTitle: "低配模式 1 TASK",
    microDesc: "资源不够也能启动",
    empty: "任务已清空",
    emptyDesc: "今日结算完成",
    noTask: "NO MISSION",
  },
} as const;
