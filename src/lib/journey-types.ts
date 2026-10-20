/**
 * 任务类型的展示元数据。
 *
 * 单独拆出来是因为首页、练习页、词库页都要用，
 * 而 journey.ts 已经很大了，不该让展示层的东西混进去。
 */

export interface TaskTypeMetaView {
  label: string;
  hint: string;
  heavy: boolean;
  examArea?: "listening" | "reading" | "writing" | "translation";
}

const TYPES: Record<string, TaskTypeMetaView> = {
  vocab: { label: "单词", hint: "核心词汇 / 生词本", heavy: false },
  "intensive-listen": { label: "精听", hint: "关键句精听", heavy: false },
  "listening-paper": { label: "听力真题", hint: "新闻 / 对话 / 讲座", heavy: true, examArea: "listening" },
  "reading-paper": { label: "阅读真题", hint: "选词 / 匹配 / 仔细阅读", heavy: true, examArea: "reading" },
  translation: { label: "翻译", hint: "汉译英段落", heavy: true, examArea: "translation" },
  writing: { label: "写作", hint: "作文一篇", heavy: true, examArea: "writing" },
  sentence: { label: "长难句", hint: "拆句 / 翻译", heavy: false },
  review: { label: "错题复盘", hint: "回看做错的题", heavy: false },
  "skill-card": { label: "技巧卡", hint: "策略卡 / 心得", heavy: false },
  custom: { label: "自定义", hint: "你自己想做的事", heavy: false },
};

export function taskTypeMeta(value: string | undefined): TaskTypeMetaView {
  return TYPES[value ?? "custom"] ?? TYPES.custom;
}

export { TYPES as TASK_TYPE_VIEWS };
