"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { cn } from "@/lib/cn";

type ToastTone = "success" | "info" | "warn";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

type ToastInput = { title: string; description?: string; tone?: ToastTone };

const ToastContext = createContext<{ toast: (input: ToastInput) => void } | null>(null);

/** Every actionable control in the app routes its feedback through here. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const reduce = useReducedMotion();
  const mounted = useIsMounted();

  const toast = useCallback((input: ToastInput) => {
    const id = Date.now() + Math.random();
    const item: ToastItem = { id, tone: input.tone ?? "success", title: input.title, description: input.description };
    setItems((prev) => [...prev.slice(-2), item]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2600);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  const icons = {
    success: <CheckCircle2 className="size-[18px]" />,
    info: <Info className="size-[18px]" />,
    warn: <TriangleAlert className="size-[18px]" />,
  };

  const iconTones = {
    success: "bg-primary text-primary-fg",
    info: "bg-lavender-soft text-lavender-fg",
    warn: "bg-coral-soft text-coral-fg",
  } as const;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted
        ? createPortal(
            <div
              className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-4 pt-[max(12px,env(safe-area-inset-top))]"
              role="status"
              aria-live="polite"
            >
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: reduce ? 0 : -18, scale: reduce ? 1 : 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -12, scale: reduce ? 1 : 0.98 }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="pointer-events-auto flex w-full max-w-[420px] items-start gap-3 rounded-card border border-card-edge bg-surface px-4 py-3 shadow-hard"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
                        iconTones[item.tone],
                      )}
                    >
                      {icons[item.tone]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-black leading-snug tracking-[-0.01em]">
                        {item.title}
                      </p>
                      {item.description ? (
                        <p className="mt-0.5 text-caption leading-snug text-fg-muted">{item.description}</p>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
