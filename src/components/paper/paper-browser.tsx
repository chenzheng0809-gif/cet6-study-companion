"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { getListeningUnit, getReadingSection } from "@/lib/papers";
import { EXAM_PART_LIMIT, type ExamPart } from "@/lib/papers/exam-clock";
import { buildPaperNav, stepInPart, type NavPart, type NavUnit } from "@/lib/papers/nav";
import type { Paper } from "@/lib/papers/types";
import { useTwoLevelSwipe, type SwipeStep } from "./use-paper-swipe";
import { ListeningUnitSegment } from "./segments/listening-unit";
import { ReadingSectionSegment } from "./segments/reading-section";
import { WritingTaskSegment } from "./segments/writing-task";
import { TranslationTaskSegment } from "./segments/translation-task";

interface Cursor {
  section: number;
  unit: number;
}

/** 没有可浏览内容时的占位：只为让类型收窄，渲染前就 return null 了 */
const EMPTY_PART: NavPart = {
  part: "listening",
  sections: [{ key: "empty", label: "", units: [] }],
  units: [],
  unitCount: 0,
};

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** 把某个 Part 上记着的游标落到真实存在的 Section / 题段上。 */
function resolve(part: NavPart, cursor: Cursor | undefined) {
  const sectionIndex = clamp(cursor?.section ?? 0, 0, part.sections.length - 1);
  const section = part.sections[sectionIndex];
  const unitIndex = clamp(cursor?.unit ?? 0, 0, section.units.length - 1);
  return { sectionIndex, section, unitIndex, unit: section.units[unitIndex] };
}

/** 跟手时不要过渡，松手后让面板滑到位；减弱动效时干脆不位移。 */
function trackClass(dragging: boolean): string {
  return dragging
    ? "flex"
    : "flex transition-transform duration-300 ease-out-quart motion-reduce:transition-none";
}

/** 题号范围一律来自数据；写作和翻译没有题号，就只报官方考场时长。 */
function unitMeta(unit: NavUnit, part: NavPart): string {
  if (unit.questionRange) return `第 ${unit.questionRange[0]}–${unit.questionRange[1]} 题`;
  return `考场 ${EXAM_PART_LIMIT[part.part].minutes} 分钟`;
}

/**
 * 真题页的两层横向浏览。
 *
 * 第一层：听力 / 阅读 / 写作 / 翻译 四个 Part 左右滑动切换。
 * 第二层：听力与阅读按 Section A / B / C 切，每个 Section 内再按题段左右滑动；
 *         写作与翻译整个 Part 就是一段，没有 Section。
 *
 * 两条等价入口：手势（拖动翻页，到边界有阻尼）和键盘（舞台聚焦后按左右方向键）。
 * Part 与 Section 的直跳由上面的 chip 行负责。
 *
 * 页内不再摆「上一段 / 下一段」的按钮：真题页里能点的按钮太多，
 * 反而分不清哪个是题、哪个是控件。翻页靠手势和方向键。
 *
 * 计时不在这里做：每个 Part 一份考场计时由 segments 里的 PartSessionBar 负责，
 * 所以同一个 Part 下换题段不会重置倒计时。
 */
export function PaperBrowser({ paper }: { paper: Paper }) {
  const nav = useMemo(() => buildPaperNav(paper), [paper]);
  const [partIndex, setPartIndex] = useState(0);
  const [cursors, setCursors] = useState<Partial<Record<ExamPart, Cursor>>>({});
  const stageRef = useRef<HTMLDivElement | null>(null);

  const activeIndex = clamp(partIndex, 0, nav.length - 1);
  const part = nav[activeIndex] ?? EMPTY_PART;
  const at = resolve(part, cursors[part.part]);

  const canUnitMove = useCallback(
    (dir: SwipeStep) => stepInPart(part, at.sectionIndex, at.unitIndex, dir) !== null,
    [part, at.sectionIndex, at.unitIndex],
  );
  const canPartMove = useCallback(
    (dir: SwipeStep) => {
      const next = activeIndex + dir;
      return next >= 0 && next < nav.length;
    },
    [activeIndex, nav.length],
  );

  const stepUnit = useCallback(
    (dir: SwipeStep) => {
      const next = stepInPart(part, at.sectionIndex, at.unitIndex, dir);
      if (!next) return;
      setCursors((prev) => ({ ...prev, [part.part]: next }));
    },
    [part, at.sectionIndex, at.unitIndex],
  );

  const stepPart = useCallback(
    (dir: SwipeStep) => {
      setPartIndex((prev) => clamp(prev + dir, 0, nav.length - 1));
    },
    [nav.length],
  );

  const swipe = useTwoLevelSwipe({
    canUnitMove,
    canPartMove,
    onUnitStep: stepUnit,
    onPartStep: stepPart,
  });

  // 位置一变，焦点不能留在已经 inert 的旧面板里：拉回舞台，键盘接着能用
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const el = document.activeElement as HTMLElement | null;
    if (el && el !== stage && stage.contains(el)) stage.focus();
  }, [activeIndex, at.sectionIndex, at.unitIndex]);

  /** 方向键和手势松手判定走同一条路，两者行为一致 */
  const move = (dir: SwipeStep) => {
    if (canUnitMove(dir)) stepUnit(dir);
    else if (canPartMove(dir)) stepPart(dir);
  };

  const setCursor = useCallback(
    (part: ExamPart, cursor: Cursor) => {
      setCursors((prev) => ({ ...prev, [part]: cursor }));
    },
    [],
  );

  // 第一层窗口：当前 Part 左右各带一屏，滑到边界时不会白屏
  const partWindow = useMemo(() => {
    const out: number[] = [];
    for (let i = activeIndex - 1; i <= activeIndex + 1; i += 1) {
      if (i >= 0 && i < nav.length) out.push(i);
    }
    return out;
  }, [activeIndex, nav.length]);

  /*
   * 第二层窗口按「整个 Part 摊平后的序号」算，跨 Section 边界也能接上。
   *
   * 拖动时要露出的是 {f, f+dir} 这一对；松手之后 f 已经变成 f+dir，
   * 减去方向就回到刚才那一屏，这一对还是同一对 —— 于是 transform 从
   * 手指松开的位置滑到终点，而不是直接跳过去。
   * 方向会在落位动画跑完后被 hook 收回，这一对随之只剩当前这一屏。
   */
  const flatAt = at.unit.unitIndexInPart;
  const unitWindow = useMemo(() => {
    if (swipe.dir === 0) return [flatAt];
    const anchor = swipe.dragging ? flatAt : flatAt - swipe.dir;
    const other = anchor + swipe.dir;
    if (other < 0 || other >= part.unitCount) return [flatAt];
    return other < anchor ? [other, anchor] : [anchor, other];
  }, [swipe.dir, swipe.dragging, flatAt, part.unitCount]);

  const partDx = swipe.level === "part" ? swipe.dx : 0;
  const unitDx = swipe.level === "unit" ? swipe.dx : 0;

  // 键盘等价入口：舞台聚焦后左右方向键 = 上一段 / 下一段
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  };

  if (nav.length === 0) return null;

  return (
    <div>
      {/* Part chips —— 第一层的直跳入口 */}
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {nav.map((p, i) => (
          <PartChip
            key={p.part}
            part={p.part}
            unitCount={p.unitCount}
            active={i === activeIndex}
            onClick={() => setPartIndex(clamp(i, 0, nav.length - 1))}
          />
        ))}
      </div>

      {/*
        舞台：两层轨道都靠 translateX 走位。overflow-x-clip 负责横向裁切，
        而且它不会把祖先变成滚动容器，里面的 PartSessionBar 照常吸顶。
      */}
      <div
        ref={stageRef}
        role="group"
        tabIndex={0}
        aria-label="真题分段浏览：左右滑动切换题段，也可以按左右方向键"
        onKeyDown={onKeyDown}
        onPointerDown={swipe.handlers.onPointerDown}
        onPointerMove={swipe.handlers.onPointerMove}
        onPointerUp={swipe.handlers.onPointerUp}
        onPointerCancel={swipe.handlers.onPointerCancel}
        onClickCapture={swipe.swallowClick}
        className={cn(
          "-mx-5 mt-3 overflow-x-clip touch-pan-y",
          swipe.dragging && "select-none",
        )}
      >
        <div
          className={trackClass(swipe.dragging)}
          style={{
            transform: `translateX(calc(${(partWindow[0] - activeIndex) * 100}% + ${partDx}px))`,
          }}
        >
          {partWindow.map((i) => {
            const p = nav[i];
            const isActive = i === activeIndex;
            const here = resolve(p, cursors[p.part]);
            return (
              <div
                key={p.part}
                className="w-full shrink-0"
                inert={!isActive}
                aria-hidden={!isActive}
              >
                <PartPane
                  paper={paper}
                  part={p}
                  cursor={cursors[p.part]}
                  unitWindow={isActive ? unitWindow : [here.unit.unitIndexInPart]}
                  dx={isActive ? unitDx : 0}
                  dragging={swipe.dragging}
                  onSelectSection={(index) => setCursor(p.part, { section: index, unit: 0 })}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PartChip({
  part,
  unitCount,
  active,
  onClick,
}: {
  part: ExamPart;
  unitCount: number;
  active: boolean;
  onClick: () => void;
}) {
  const limit = EXAM_PART_LIMIT[part];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "tap flex min-h-11 shrink-0 items-center rounded-btn px-4 text-label font-black shadow-hard-sm",
        active ? "bg-primary text-on-accent" : "bg-surface-2 text-fg-muted",
      )}
    >
      {limit.label}
      <span className="num ml-1.5 text-eyebrow opacity-70">{unitCount} 段</span>
    </button>
  );
}

function PartPane({
  paper,
  part,
  cursor,
  unitWindow,
  dx,
  dragging,
  onSelectSection,
}: {
  paper: Paper;
  part: NavPart;
  cursor: Cursor | undefined;
  /** 这一屏要挂哪几个题段（相邻的那一屏只在拖起来时才挂上） */
  unitWindow: number[];
  dx: number;
  dragging: boolean;
  onSelectSection: (index: number) => void;
}) {
  const { sectionIndex, section, unitIndex, unit } = resolve(part, cursor);
  /** 这一 Part 摊平后的序号，翻页动画按它算位移 */
  const flatAt = unit.unitIndexInPart;
  return (
    <div className="px-5">
      <div className="flex flex-wrap items-center gap-2">
        {part.sections.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onSelectSection(i)}
            aria-current={i === sectionIndex ? "true" : undefined}
            className={cn(
              "tap min-h-11 rounded-pill px-3.5 text-caption font-black",
              i === sectionIndex
                ? "bg-fg text-bg"
                : "border-2 border-dashed border-fg/25 text-fg-muted",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="num mt-1 min-w-0 truncate text-caption text-fg-subtle">
        {unitMeta(unit, part)} · 本段 {unitIndex + 1}/{section.units.length} · 全 Part{" "}
        {unit.unitIndexInPart + 1}/{part.unitCount}
      </p>

      <div
        className={trackClass(dragging)}
        style={{
          transform: `translateX(calc(${(unitWindow[0] - flatAt) * 100}% + ${dx}px))`,
        }}
      >
        {unitWindow.map((i) => {
          const u = part.units[i];
          const isActiveUnit = i === flatAt;
          return (
            <div
              key={u.id}
              className="w-full shrink-0"
              inert={!isActiveUnit}
              aria-hidden={!isActiveUnit}
            >
              <UnitBody paper={paper} unit={u} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UnitBody({ paper, unit }: { paper: Paper; unit: NavUnit }) {
  if (unit.part === "listening") {
    const listening = getListeningUnit(paper, unit.id);
    return listening ? (
      <ListeningUnitSegment paper={paper} unit={listening} showSiblings={false} />
    ) : null;
  }
  if (unit.part === "reading") {
    const reading = getReadingSection(paper, unit.id);
    return reading ? (
      <ReadingSectionSegment paper={paper} section={reading} showSiblings={false} />
    ) : null;
  }
  if (unit.part === "writing" && paper.writing) {
    return <WritingTaskSegment paper={paper} writing={paper.writing} />;
  }
  if (unit.part === "translation" && paper.translation) {
    return <TranslationTaskSegment paper={paper} translation={paper.translation} />;
  }
  return null;
}
