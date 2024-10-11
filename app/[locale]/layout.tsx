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

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Motionext - More healthy, more connected.",
  description: "Motionext. More healthy, more connected.",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt" }];
}

async function loadMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return {};
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  // Validate the locale
  const validLocales = ["en", "pt"];
  if (!validLocales.includes(locale)) notFound();

  let messages;
  try {
    messages = await loadMessages(locale);
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }

  const bodyClasses = cn(
    inter.className,
    "min-h-screen bg-background text-foreground",
    "dark:bg-slate-950 dark:text-slate-50",
  );

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={bodyClasses}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeManager />
          <ThemeInitializer />
          <Navbar messages={messages.Home} />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
