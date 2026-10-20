import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BottomNav } from "./bottom-nav";

/**
 * Mobile-first shell. On phones the column fills the viewport; on desktop it
 * becomes a centred 460px frame sitting on a darker cream surround, so the
 * hard-edged card language reads as a sticker sheet rather than a bare column.
 */
const frame = "relative mx-auto min-h-dvh w-full max-w-[460px] bg-bg";

export function AppShell({ children, withNav = true }: { children: ReactNode; withNav?: boolean }) {
  return (
    <div className="min-h-dvh bg-surface-3 md:bg-surface-2">
      <div className={cn(frame, "md:shadow-hard")}>
        <main
          className={withNav ? "pb-[calc(var(--nav-height)+env(safe-area-inset-bottom,0px))]" : ""}
        >
          {children}
        </main>
        {withNav ? <BottomNav /> : null}
      </div>
    </div>
  );
}

/** Shell for the pre-onboarding flow — no navigation, full-bleed hero. */
export function FlowShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface-3 md:bg-surface-2">
      <div className={cn(frame, "md:shadow-hard")}>{children}</div>
    </div>
  );
}
