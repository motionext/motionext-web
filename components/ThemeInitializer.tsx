"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * The `ThemeInitializer` component is a React component that initializes the theme for the application.
 * It sets the theme based on the saved theme in localStorage, or uses the system theme if no saved theme is found.
 * It also listens for changes to the theme in localStorage and updates the theme accordingly.
 *
 * @returns The `ThemeInitializer` component returns null.
 */
export function ThemeInitializer() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    } else if (!savedTheme && theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, setTheme]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue && e.newValue !== theme) {
        setTheme(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setTheme, theme]);

  return null;
}
