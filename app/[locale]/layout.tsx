import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { i18nConfig, Locale } from "@/messages/i18n-config";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

/**
 * The `LocaleLayout` component is a React functional component that displays a layout for the
 * locale.
 *
 * @param {LocaleLayoutProps} props - The `LocaleLayout` component takes one prop:
 * @param children - The `children` prop is a React node that will be rendered inside the layout.
 * @param params - The `params` prop is a promise that resolves to an object containing the locale
 * parameter.
 *
 * @returns The `LocaleLayout` component returns a JSX element that displays a layout for the
 * locale.
 */
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
      <Toaster richColors closeButton />
    </main>
  );
}
