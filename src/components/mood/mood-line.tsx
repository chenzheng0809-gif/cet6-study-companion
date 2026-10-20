"use client";

import { BOTTOM_LINE, MOOD_LINES, STREAK_THRESHOLD, type MoodLine, type MoodScene } from "@/lib/copy";
import { cn } from "@/lib/cn";

/**
 * 一句歌词，外加可选的中文旁注和署名。
 *
 * 排版规矩（有意的，不是随便定的）：
 *   · 英文原句最大 —— 它是主语，中文只是旁注
 *   · 旁注小字、下一行，不加引号、不加「意思是」这种解释
 *   · 署名最小 —— 歌词是别人的东西，藏着不给等于偷
 *
 * 不加「加油」「别放弃」。歌词自己会说，加上去反而像家长。
 */
export function MoodLine_({
  line,
  className,
  showCredit = true,
  tone = "default",
}: {
  line: MoodLine;
  className?: string;
  showCredit?: boolean;
  /**
   * `onAccent` 是给深色/彩色底的卡片用的（比如首页那张 lavender 的「这周」）。
   * 两套只用 globals.css 里已有的 token，没有新颜色。
   */
  tone?: "default" | "onAccent";
}) {
  const main = tone === "onAccent" ? "text-on-accent" : "text-fg";
  const sub = tone === "onAccent" ? "opacity-70" : "text-fg-muted";
  const faint = tone === "onAccent" ? "opacity-55" : "text-fg-subtle";

  return (
    <figure className={cn("m-0", className)}>
      <blockquote
        className={cn("m-0 text-[15px] leading-relaxed font-black tracking-[-0.01em]", main)}
        lang="en"
      >
        {line.lines}
      </blockquote>
      {line.zh ? <p className={cn("mt-1 text-caption leading-relaxed", sub)}>{line.zh}</p> : null}
      {showCredit ? (
        <figcaption className={cn("mt-1 text-[11px]", faint)}>— {line.credit}</figcaption>
      ) : null}
    </figure>
  );
}

/** 按场景取那一句。一个场景只有一句，所以不存在挑哪句的问题。 */
export function Mood({
  scene,
  className,
  showCredit,
  tone,
}: {
  scene: MoodScene;
  className?: string;
  showCredit?: boolean;
  tone?: "default" | "onAccent";
}) {
  return (
    <MoodLine_
      line={MOOD_LINES[scene]}
      className={className}
      showCredit={showCredit}
      tone={tone}
    />
  );
}

/**
 * 连续练了几天的时候才给状态好那句。
 * 没达到门槛就什么都不显示 —— 沉默比「别停止相信」合适。
 *
 * 传 `engagedToday=false` 时连门槛都不看：今天一条记录都没有的话，
 * 这一页该由「中断回来」那句接手，不能两句一起上。
 */
export function StreakMood({
  streak,
  engagedToday = true,
  className,
  showCredit,
  tone,
}: {
  streak: number;
  engagedToday?: boolean;
  className?: string;
  showCredit?: boolean;
  tone?: "default" | "onAccent";
}) {
  if (!engagedToday || streak < STREAK_THRESHOLD) return null;
  return (
    <Mood scene="streak" className={className} showCredit={showCredit} tone={tone} />
  );
}

/**
 * 底线里那两句歌词。
 *
 * 和 `Mood` 分开是因为它们不是场景陪伴，而是每次都要说清的立场，
 * 所以永远显示、不按状态出现。字符串仍然只从 `copy.ts` 取，
 * 这里只是给它一个不用中文旁注的排版。
 */
export function BottomLineLyric({
  which,
  className,
  tone,
}: {
  which: "habit" | "missed";
  className?: string;
  tone?: "default" | "onAccent";
}) {
  const src = BOTTOM_LINE[which];
  const line: MoodLine = {
    id: `bottom-line-${which}`,
    scene: which === "habit" ? "return" : "begin",
    lines: src.lines,
    credit: src.credit,
  };
  return <MoodLine_ line={line} className={className} tone={tone} />;
}
