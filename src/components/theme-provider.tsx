"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSettings, saveSettings } from "@/lib/repo";
import type { ThemeMode } from "@/lib/types";

const STORAGE_KEY = "cet6.theme";

interface ThemeContextValue {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeState {
  mode: ThemeMode;
  resolved: "light" | "dark";
}

function systemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolve(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") return systemPrefersDark() ? "dark" : "light";
  return mode;
}

/**
 * The pre-paint script in layout.tsx already applied the stored theme to
 * <html>. This reads the same mirror so React state matches the DOM.
 */
function readInitialTheme(): ThemeState {
  if (typeof window === "undefined") return { mode: "system", resolved: "light" };
  const stored = localStorage.getItem(STORAGE_KEY);
  const mode: ThemeMode = stored === "dark" || stored === "light" ? stored : "system";
  return { mode, resolved: resolve(mode) };
}

function applyTheme(resolved: "light" | "dark") {
  const root = document.documentElement;
  // always explicit, so a stored choice always wins over the OS media query
  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ThemeState>(readInitialTheme);
  const { mode, resolved } = state;

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  // IndexedDB is the durable store; it wins once it holds a real preference.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const settings = await getSettings();
        if (cancelled || settings.updatedAt === 0) return;
        const stored = settings.theme;
        const next = resolve(stored);
        setState((prev) => (prev.mode === stored ? prev : { mode: stored, resolved: next }));
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable — the localStorage mirror still works */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Follow the OS while the student has not chosen explicitly.
  useEffect(() => {
    if (mode !== "system" || typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setState({ mode: "system", resolved: media.matches ? "dark" : "light" });
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    const value = resolve(next);
    setState({ mode: next, resolved: value });
    localStorage.setItem(STORAGE_KEY, value);
    void saveSettings({ theme: next }).catch(() => undefined);
  }, []);

  const toggle = useCallback(() => {
    setMode(resolved === "dark" ? "light" : "dark");
  }, [resolved, setMode]);

  const value = useMemo(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, setMode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
