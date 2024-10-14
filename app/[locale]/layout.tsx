import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { unstable_setRequestLocale } from "next-intl/server";

import { cn } from "@/lib/utils";

import { Navbar } from "@/components/Navbar";
import { ThemeManager } from "@/components/ThemeManager";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeInitializer } from "@/components/ThemeInitializer";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Motionext - More healthy, more connected.",
  description: "Motionext. More healthy, more connected.",
};

const validLocales = ["en", "pt"] as const;
type Locale = (typeof validLocales)[number];

export function generateStaticParams() {
  return validLocales.map((locale) => ({ locale }));
}

async function loadMessages(locale: Locale) {
  try {
    return (await import(`@/messages/${locale}`)).translations;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  if (!validLocales.includes(locale as Locale)) notFound();

  unstable_setRequestLocale(locale);

  const messages = await loadMessages(locale as Locale);

  const bodyClasses = cn(
    inter.className,
    "min-h-screen bg-background text-foreground dark:bg-slate-950 dark:text-slate-50"
  );

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="canonical" href={`https://motionext.app/${locale}`} />
      </head>
      <body className={bodyClasses}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeManager />
          <ThemeInitializer />
          <Navbar messages={messages.Home} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
