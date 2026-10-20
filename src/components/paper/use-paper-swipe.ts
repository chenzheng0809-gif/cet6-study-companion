"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 两层横向翻页：先在当前 Part 内的题段之间翻，题段到头了再推着整个 Part 换边。
 *
 * 做法是把 Plan 页 use-horizontal-swipe 的经验搬过来，再补上真题页必须有的几件事：
 *
 * 1. 手势数据全放 ref，松手时读的是最后一次移动的真实位移，而不是可能慢一拍的 state。
 * 2. `moved` 在下一次 pointerdown 复位 —— 滑动结束后紧接着的那一次点击不会被吞掉。
 * 3. 两层共用同一套指针事件，靠 canUnitMove / canPartMove 决定这一下归谁：
 *    题段挪得动就题段挪，题段到头了才让位给 Part，两层都到头就 0.25 阻尼。
 *    归属只在"这一层真的挪不动"或"方向反转"时才重判，中途不会来回横跳。
 * 4. 松手可能落在容器外面，所以 pointerup / pointercancel 额外挂在 window 上；
 *    finish() 用 startX 判空做重入保护，重复触发是安全的。
 * 5. 输入框里不起手势：草稿区的横向拖拽让给浏览器（选字、挪光标）。
 */

export type SwipeLevel = "unit" | "part" | "edge";

export type SwipeStep = 1 | -1;

export function useTwoLevelSwipe({
  canUnitMove,
  canPartMove,
  onUnitStep,
  onPartStep,
  threshold = 64,
}: {
  canUnitMove: (dir: SwipeStep) => boolean;
  canPartMove: (dir: SwipeStep) => boolean;
  onUnitStep: (dir: SwipeStep) => void;
  onPartStep: (dir: SwipeStep) => void;
  threshold?: number;
}) {
  const [dx, setDx] = useState(0);
  const [level, setLevel] = useState<SwipeLevel | null>(null);
  const [dragging, setDragging] = useState(false);
  /**
   * 这一下手势的方向，松手后还会留一小会儿。
   * 用途只有一个：翻页落位的那 300ms 里，被滑走的那一屏还得挂在轨道上，
   * 否则新面板会直接跳到终点，而不是从手指松开的位置滑过去。
   */
  const [dir, setDir] = useState<SwipeStep | 0>(0);

  const startX = useRef<number | null>(null);
  const deltaRef = useRef(0);
  const levelRef = useRef<SwipeLevel | null>(null);
  const dirRef = useRef<SwipeStep>(1);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** 这一下手势是不是滑动（而不是点一下） */
  const moved = useRef(false);

  useEffect(() => {
    return () => {
      if (settle.current) clearTimeout(settle.current);
    };
  }, []);

  const finish = useCallback(() => {
    if (startX.current === null) return;
    const delta = deltaRef.current;
    const step: SwipeStep | 0 = delta <= -threshold ? 1 : delta >= threshold ? -1 : 0;

    startX.current = null;
    deltaRef.current = 0;
    levelRef.current = null;
    setDx(0);
    setLevel(null);
    setDragging(false);

    if (step === 0) return;
    if (settle.current) clearTimeout(settle.current);
    // 落位动画跑完再把方向收掉，被滑走的那一屏才真正卸载
    settle.current = setTimeout(() => setDir(0), 340);
    // 跟松手判定用的是同一套优先级：题段优先，其次整层 Part
    if (canUnitMove(step)) onUnitStep(step);
    else if (canPartMove(step)) onPartStep(step);
  }, [canPartMove, canUnitMove, onPartStep, onUnitStep, threshold]);

  // 松手可能落在容器外面，指针事件收不到 —— window 上补一份
  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    return () => {
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
  }, [dragging, finish]);

  return {
    /** 跟手的位移，到头自动衰减到 0.25 倍 */
    dx,
    /** 这一下归谁：题段 / 整层 Part / 撞到边界 */
    level,
    /** 手势方向（1 = 下一段，-1 = 上一段），松手后短暂保留给落位动画 */
    dir,
    dragging,
    moved,
    handlers: {
      onPointerDown(event: React.PointerEvent) {
        const target = event.target as HTMLElement | null;
        if (target?.closest("textarea, input, [contenteditable='true']")) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        startX.current = event.clientX;
        deltaRef.current = 0;
        levelRef.current = null;
        moved.current = false;
        if (settle.current) {
          clearTimeout(settle.current);
          settle.current = null;
        }
        setDir(0);
        setDragging(true);
      },
      onPointerMove(event: React.PointerEvent) {
        const from = startX.current;
        if (from === null) return;
        const delta = event.clientX - from;
        deltaRef.current = delta;
        if (Math.abs(delta) > 6) moved.current = true;

        const dir: SwipeStep = delta < 0 ? 1 : -1;
        // 方向反转就重新判一次归属，免得"起手那 2px"把整层 Part 定死
        if (dirRef.current !== dir) {
          dirRef.current = dir;
          levelRef.current = null;
        }

        const unitOk = canUnitMove(dir);
        const partOk = canPartMove(dir);
        let next = levelRef.current;
        if (next === null || (next === "unit" && !unitOk) || (next === "part" && !partOk)) {
          next = unitOk ? "unit" : partOk ? "part" : "edge";
          levelRef.current = next;
        }

        setLevel(next);
        if (Math.abs(delta) > 6) setDir(dir);
        // 两层都到头：给一点阻尼，提示"没有下一屏"而不是完全不动
        setDx(next === "edge" ? delta * 0.25 : delta);
      },
      onPointerUp: finish,
      onPointerCancel: finish,
    },
    /** 挂在根节点的 onClickCapture 上：滑动刚结束时浏览器补的那个 click 要拦掉 */
    swallowClick(event: React.MouseEvent) {
      if (!moved.current) return;
      moved.current = false;
      event.preventDefault();
      event.stopPropagation();
    },
  };
}
