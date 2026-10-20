"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./ui/toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
