"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeInitializer() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return null;
}
