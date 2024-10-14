"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeManager() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue && e.newValue !== theme) {
        setTheme(e.newValue);
      }
    };

    const savedTheme = localStorage.getItem("theme") || "system";
    if (theme !== savedTheme) {
      setTheme(savedTheme);
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [theme, setTheme]);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return null;
}
