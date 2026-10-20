/**
 * 渲染原书的**黄色重点标注**。
 *
 * PDF 里高亮不是文字属性，是 `/Highlight` 注解画的矩形，所以拿不到"哪些字被标了"
 * 的文本标记。`scripts/extract-highlights.py` 把矩形和文字层的字符包围盒对齐，
 * `scripts/parse-wordbooks.py` 再在**同义项只出现一次**的前提下切成分段数组
 * （`Marked[]`）。这里只负责把分段画出来。
 *
 * 不变量（verify.ts 第 11 节守着）：`segments.map(s => s.text).join("")`
 * 必须等于同名字段。少标可以，标错位置不行。
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Marked } from "@/lib/wordbooks";

/** 单个高亮片段。荧光笔质感：实心黄底 + 极窄内缩，字重不动。 */
export function Marker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <mark
      className={cn(
        "rounded-[3px] bg-marker px-[0.12em] py-[0.06em] text-marker-fg",
        "box-decoration-clone",
        className,
      )}
    >
      {children}
    </mark>
  );
}

/**
 * 把 `Marked[]` 画出来。没有高亮数据时退化成 `fallback`，调用方不用分支。
 * `fallback` 可以是字符串，也可以是节点 —— 词条那种「没有高亮就换 Chip」
 * 的情况才用得上。
 */
export function MarkedText({
  segments,
  fallback,
}: {
  segments: Marked[] | undefined;
  fallback: ReactNode;
}) {
  if (!segments || segments.length === 0) return <>{fallback}</>;
  return (
    <>
      {segments.map((seg, i) =>
        seg.mark ? (
          <Marker key={i}>{seg.text}</Marker>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

/** 带内联 `<p>` 的版本，省掉调用方包一层。 */
export function MarkedLine({
  segments,
  fallback,
  className,
}: {
  segments: Marked[] | undefined;
  fallback: ReactNode;
  className?: string;
}) {
  if (!segments || segments.length === 0) return <p className={className}>{fallback}</p>;
  return (
    <p className={className}>
      <MarkedText segments={segments} fallback={fallback} />
    </p>
  );
}
