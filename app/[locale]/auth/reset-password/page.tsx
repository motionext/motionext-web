import { getMessages } from "@/lib/get-messages";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Motionext",
  description: "Reset your access password to Motionext",
};

export interface ResetPasswordPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * The `ResetPasswordPage` component is a React functional component that displays a reset password
 * form to the user.
 *
 * @param {ResetPasswordPageProps} props - The `ResetPasswordPage` component takes one prop:
 * @param params - The `params` prop is a promise that resolves to an object containing the locale
 * parameter.
 *
 * @returns The `ResetPasswordPage` component returns a JSX element that displays a reset password
 * form to the user.
 */
export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);
  const t = messages.auth;

  return (
    <>
      <Navbar messages={messages.home} noLinks />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black p-4 sm:p-6 lg:p-8 pt-24 sm:pt-4">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-6">
            <div className="flex justify-center relative h-24 mb-4">
              <Image
                src="/black1.png"
                alt="Motionext Logo"
                width={90}
                height={90}
                className="absolute transition-opacity duration-200 dark:opacity-0"
                priority
              />
              <Image
                src="/white1.png"
                alt="Motionext Logo"
                width={90}
                height={90}
                className="absolute opacity-0 transition-opacity duration-200 dark:opacity-100"
                priority
              />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {t.resetPassword.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.resetPassword.description}
              </p>
            </div>
          </div>

          <div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 
          ring-1 ring-gray-900/5 dark:ring-white/10"
          >
            <ResetPasswordForm messages={t.resetPassword} />
          </div>
        </div>
      </div>
      <Footer messages={messages} />
    </>
  );
}
