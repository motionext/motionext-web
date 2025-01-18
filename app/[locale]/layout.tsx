import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { i18nConfig, Locale } from "@/messages/i18n-config";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: Locale };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  if (!i18nConfig.locales.includes(locale)) {
    notFound();
  }

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <Toaster />
    </main>
);
}
