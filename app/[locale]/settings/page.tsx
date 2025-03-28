import { Metadata } from "next";
import { getMessages } from "@/lib/get-messages";
import { SettingsForm } from "@/components/SettingsForm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Settings | Motionext",
  description: "Manage your personal information and account settings",
};

export interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * The `SettingsPage` component is a React functional component that displays a settings page for
 * the user.
 *
 * @param {SettingsPageProps} props - The `SettingsPage` component takes one prop:
 * @param params - The `params` prop is a promise that resolves to an object containing the locale
 * parameter.
 *
 * @returns The `SettingsPage` component returns a JSX element that displays a settings page for
 * the user.
 */
export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);

  return (
    <>
      <Navbar messages={messages.home} />

      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
bg-[size:24px_24px] dark:bg-[size:24px_24px]-z-10"
      ></div>
      <section className="relative w-full bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 min-h-screen">
          <SettingsForm messages={messages} locale={locale} />
        </div>
      </section>

      <Footer messages={messages} />
    </>
  );
}
