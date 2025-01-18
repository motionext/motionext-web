"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

const themeScript = `
  !function(){
    try {
      var d=document.documentElement;
      var e=localStorage.getItem('theme');
      if("system"===e||(!e&&true)){
        var t="(prefers-color-scheme: dark)",
        m=window.matchMedia(t);
        if(m.media!==t||m.matches){
          d.classList.add("dark")
        }else{
          d.classList.remove("dark")
        }
      }else if(e){
        var darkMode=e==="dark";
        d.classList[darkMode?"add":"remove"]("dark");
      }
    } catch (e) {}
  }();
`;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: themeScript,
        }}
      />
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </>
  );
}
