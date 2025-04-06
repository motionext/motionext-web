import "@/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Motionext",
  description: "Motionext. More healthy, more connected.",
};

export const dynamic = "force-dynamic";

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * The `RootLayout` component is the main layout component for the application.
 *
 * @param {RootLayoutProps} props - The `RootLayout` component takes one prop:
 * @param children - The `children` prop is a React node that will be rendered inside the layout.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
