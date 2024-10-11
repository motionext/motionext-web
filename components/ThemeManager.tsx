"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeManager() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Apply the current theme from localStorage or default to 'system'
    const currentTheme = localStorage.getItem("theme") || "system";
    if (theme !== currentTheme) {
      setTheme(currentTheme);
    }
  }, [theme, setTheme]);

  return null;
}
