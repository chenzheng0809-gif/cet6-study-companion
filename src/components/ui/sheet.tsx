"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { useIsMounted } from "@/hooks/use-is-mounted";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Bottom sheet — the single modal surface used by the whole app.
 * Portal-rendered so it never fights a scrolling parent, body-scroll locked
 * while open, dismissed by backdrop or Escape.
 */
export function Sheet({
  open,
  onClose,
  eyebrow,
  title,
  description,
  children,
  footer,
  className,
}: SheetProps) {
  const reduce = useReducedMotion();
  const mounted = useIsMounted();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-[var(--cet-overlay)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            className={cn(
              "relative flex max-h-[86dvh] w-full max-w-[520px] flex-col overflow-hidden",
              "rounded-t-[32px] border-t-2 border-border bg-surface shadow-sheet",
              className,
            )}
            initial={{ y: reduce ? 0 : "100%" }}
            animate={{ y: 0 }}
            exit={{ y: reduce ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
          >
            <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-2">
              <div className="min-w-0 flex-1">
                <div aria-hidden className="mx-auto mb-4 h-1.5 w-12 rounded-pill bg-decor md:hidden" />
                {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
                {title ? (
                  <h2 className="text-section font-black tracking-[-0.02em]">{title}</h2>
                ) : null}
                {description ? (
                  <p className="mt-1 text-caption leading-relaxed text-fg-muted">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭"
                className="tap -mt-1 flex size-11 shrink-0 items-center justify-center rounded-pill bg-surface-2 text-fg-muted hover:text-fg"
              >
                <X className="size-[18px]" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
              {children}
            </div>

            {footer ? (
              <div className="border-t-2 border-border bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
                {footer}
              </div>
            ) : (
              <div className="pb-[max(16px,env(safe-area-inset-bottom))]" />
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
