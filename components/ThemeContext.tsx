"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTheme } from "next-themes";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * The `ThemeProvider` component is a wrapper around the `NextThemesProvider` component that
 * provides a theme context for the application.
 *
 * @param {ThemeProviderProps} props - The properties for the component
 * @param {React.ReactNode} props.children - The child elements to render
 *
 * @returns The `ThemeProvider` component returns a `NextThemesProvider` component that wraps the
 * child elements and provides a theme context for the application.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (theme) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  if (!mounted || !theme) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme: theme || "system", setTheme }}>
      <div className="animate-fade-in">{children}</div>
    </ThemeContext.Provider>
  );
}

/**
 * The `useThemeContext` function is a React hook that returns the theme context.
 *
 * @returns The `useThemeContext` function returns the theme context.
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
