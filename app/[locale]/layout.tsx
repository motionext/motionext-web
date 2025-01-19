import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { i18nConfig, Locale } from "@/messages/i18n-config";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!i18nConfig.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <Toaster richColors closeButton/>
    </main>
  );
}
