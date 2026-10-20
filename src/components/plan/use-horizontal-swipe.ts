"use client";

import { useRef, useState } from "react";

/**
 * 横向滑动翻页（Plan 页的周一 → 周日）。
 *
 * 两个细节是踩过才知道的：
 * 1. 滑动结束时必须把 `movedRef` 复位，否则紧接着的一次正常点击会被吞掉。
 * 2. 拖动超过阈值才算翻页，中途反悔要弹回原位 —— 不能松手就跳。
 */
export function useHorizontalSwipe({
  count,
  index,
  onIndexChange,
  threshold = 64,
}: {
  count: number;
  index: number;
  onIndexChange: (next: number) => void;
  threshold?: number;
}) {
  const [dx, setDx] = useState(0);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);

  const atStart = index <= 0;
  const atEnd = index >= count - 1;

  return {
    dx,
    moved,
    handlers: {
      onPointerDown(event: React.PointerEvent) {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        startX.current = event.clientX;
        moved.current = false;
      },
      onPointerMove(event: React.PointerEvent) {
        if (startX.current === null) return;
        const delta = event.clientX - startX.current;
        if (Math.abs(delta) > 6) moved.current = true;
        if ((atStart && delta > 0) || (atEnd && delta < 0)) {
          // 到头了给一点阻尼，提示"没有下一屏"而不是完全不动
          setDx(delta * 0.25);
          return;
        }
        setDx(delta);
      },
      onPointerUp() {
        const delta = dx;
        startX.current = null;
        setDx(0);
        if (delta <= -threshold) onIndexChange(Math.min(count - 1, index + 1));
        else if (delta >= threshold) onIndexChange(Math.max(0, index - 1));
      },
      onPointerCancel() {
        startX.current = null;
        setDx(0);
      },
    },
    /** 翻页后要把「刚刚滑过」标记清掉，否则接下来的点击全被当拖拽 */
    resetMoved() {
      moved.current = false;
    },
  };
}
