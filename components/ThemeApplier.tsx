"use client";

import { useEffect } from "react";

interface ThemeColors {
  background: string;
  foreground: string;
  border: string;
}

interface ThemeData {
  light: ThemeColors;
  dark: ThemeColors;
}

export function ThemeApplier({ theme }: { theme: ThemeData | undefined }) {
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;

    // Set all per-mode variables on :root (always available)
    root.style.setProperty("--theme-light-bg", theme.light.background);
    root.style.setProperty("--theme-light-fg", theme.light.foreground);
    root.style.setProperty("--theme-light-border", theme.light.border);
    root.style.setProperty("--theme-dark-bg", theme.dark.background);
    root.style.setProperty("--theme-dark-fg", theme.dark.foreground);
    root.style.setProperty("--theme-dark-border", theme.dark.border);
  }, [theme]);

  return null;
}
