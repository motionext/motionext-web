"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

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
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
