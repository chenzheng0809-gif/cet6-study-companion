/**
 * 界面语气 —— 底线四句与歌词陪伴，唯一的出处。
 *
 * 这个文件存在的理由：这些句子散落在七八个页面里，改一次要找半天，
 * 而且很容易出现「同一件事两种说法」。文案是产品的一部分，得有版本管理。
 *
 * 两条规矩贯穿全文件：
 *
 * 1. **一次只出现一句。** 不并列、不轮播堆叠。歌词是陪伴，不是免责声明。
 *    所以每个场景只登记一句，取用时也只取一句。
 *
 * 2. **歌词只放在人已经累了的地方** —— 中断回来、没练、低完成度、连续几天没动。
 *    用户有劲的时候不要泼「没关系」，那不是安慰，是冷水。
 */

/* ------------------------------------------------------------------ 场景 */

export type MoodScene =
  /** 开始页：还没开始 */
  | "begin"
  /** 中断回来 / 今天一条记录都没有 */
  | "return"
  /** 周回顾：这周没做完多少 */
  | "weekly"
  /** 空状态 / 今天什么都不想做 */
  | "night"
  /** 连续练了几天，状态不错 */
  | "streak";

export interface MoodLine {
  id: string;
  scene: MoodScene;
  /** 英文原句 */
  lines: string;
  /** 中文旁注，可有可无。有就小字、下一行，不加引号解释 */
  zh?: string;
  /** 出处。歌词是别人的东西，署名不能省 */
  credit: string;
}

/**
 * 一个场景只登记一句。
 *
 * 注意 `return` 和 `missed` 用的是同一首 *To Begin Again* 的同一句 ——
 * 不是重复登记，是同一个意思在两个地方复用，署名跟着一起走。
 */
export const MOOD_LINES: Record<MoodScene, MoodLine> = {
  begin: {
    id: "one-step-at-a-time",
    scene: "begin",
    lines: "We live and we learn to take one step at a time. There's no need to rush.",
    zh: "不用赶。一步一步来。",
    credit: "Jordin Sparks · One Step at a Time",
  },
  return: {
    id: "to-begin-again",
    scene: "return",
    lines: "And it's alright, it's okay. We will get another day. To begin again.",
    zh: "没事的。还有一天。重新开始就好。",
    credit: "Ingrid Michaelson & ZAYN · To Begin Again",
  },
  weekly: {
    id: "the-climb",
    scene: "weekly",
    lines: "Ain't about how fast I get there. It's the climb.",
    zh: "不在于多快到那里。走着的这一段，就算数。",
    credit: "Miley Cyrus · The Climb",
  },
  night: {
    id: "gonna-be-alright",
    scene: "night",
    lines: "Everything, everything is gonna be alright.",
    zh: "会好的。",
    credit: "Tom Odell · Best Day Of My Life",
  },
  streak: {
    id: "hold-on-to-that-feelin",
    scene: "streak",
    lines: "Don't stop believin'. Hold on to that feelin'.",
    credit: "Journey · Don't Stop Believin'",
  },
};

/**
 * 连着几天算「状态不错」。
 *
 * 门槛定在 3 天：两天还可能是手滑，三天才像真的在坚持。
 * 这句经典得很，容易变成口号，所以只在状态好的时候轻轻给一句 ——
 * 没练的时候说「别停止相信」是压力，不是陪伴。
 */
export const STREAK_THRESHOLD = 3;

/* ------------------------------------------------------------- 底线四句 */

/**
 * 四条不随场景变化的承诺。
 *
 * 它们是产品的立场，不是安慰，所以不跟歌词混在一起轮换 ——
 * 歌词负责陪，底线负责说清楚规则。
 *
 * `habit` 与 `missed` 用的是歌词原句：这两件事本来就该轻，
 * 「习惯不是任务」「没练不是缺卡」写成标语反而变重了。
 */
export const BOTTOM_LINE = {
  /** 分数：只认练，不换算、不预测 */
  score: "分数靠练，不靠换算和预测～",
  /** 隐私：数据不出设备 */
  privacy: "数据只保存在这台设备上，不会上传到任何服务器。",
  /** 习惯：今天没做，明天也不欠 */
  habit: {
    lines: "And it's alright, it's okay. We will get another day. To begin again.",
    credit: "Ingrid Michaelson & ZAYN · To Begin Again",
  },
  /** 缺卡：没练就是没练，不是罪 */
  missed: {
    lines: "We live and we learn to take one step at a time. There's no need to rush.",
    credit: "Jordin Sparks · One Step at a Time",
  },
} as const;
