"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { BookMarked, CalendarDays, Dumbbell, LibraryBig, Sunrise, Target, User } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * 五个位置对应的是「打开之后能做什么」：
 *   今天做什么（Today）· 这周练什么（Journey）· 想练就练（Practice）
 *   · 查真题（Papers）· 记的词（Vocab）
 *
 * 日历和「我的」退到主栏上方那条窄栏里 —— 现在没有"必须每天完成 N 项"的日程，
 * 日历就只是一个纯记录的查看页，不该占最显眼的位；但它仍然得进得去，
 * 导出备份、改主题、看真实记录都还指着它，所以不能把入口一起删掉。
 */
export const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: Sunrise, available: true },
  { href: "/plan", label: "Journey", icon: Target, available: true },
  { href: "/practice", label: "Practice", icon: Dumbbell, available: true },
  { href: "/papers", label: "Papers", icon: LibraryBig, available: true },
  { href: "/vocab", label: "Vocab", icon: BookMarked, available: true },
] as const;

/** 底栏之外但仍然存在的入口 */
export const EXTRA_NAV_ITEMS = [
  { href: "/calendar", label: "日历", icon: CalendarDays },
  { href: "/me", label: "我的", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[460px] border-t-2 border-border bg-surface"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="主导航"
    >
      <ul className="flex items-center gap-2 border-b border-line px-4 py-1.5">
        {EXTRA_NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "tap flex h-8 items-center gap-1.5 rounded-pill px-3 text-[11px] tracking-[0.06em] uppercase",
                  active
                    ? "bg-fg text-bg font-black"
                    : "bg-surface-2 text-fg-muted font-bold",
                )}
              >
                <Icon className="size-3.5" strokeWidth={2.6} aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="flex items-stretch">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.available ? item.href : "#"}
                aria-current={active ? "page" : undefined}
                aria-disabled={!item.available}
                onClick={(event) => {
                  if (!item.available) event.preventDefault();
                }}
                className={cn(
                  "tap flex h-16 flex-col items-center justify-center gap-1",
                  active ? "text-fg" : "text-fg-subtle",
                )}
              >
                <span className="relative flex size-8 items-center justify-center">
                  {active ? (
                    <motion.span
                      layoutId="nav-active-tile"
                      className="absolute inset-0 rounded-full bg-primary shadow-hard-sm"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <Icon
                    className={cn("relative size-[21px]", active && "text-primary-fg")}
                    strokeWidth={active ? 2.8 : 2}
                    aria-hidden
                  />
                </span>
                <span
                  className={cn(
                    "text-[10px] tracking-[0.06em] uppercase",
                    active ? "font-black" : "font-bold",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
