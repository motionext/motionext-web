import { CheckCircle2 } from "lucide-react";
import { getMessages } from "@/lib/get-messages";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export interface ResetPasswordSuccessPageProps {
  params: Promise<{ locale: string }>;
}

/**
 * The `ResetPasswordSuccessPage` component is a React functional component that displays a success
 * message to the user after resetting their password.
 *
 * @param {ResetPasswordSuccessPageProps} props - The `ResetPasswordSuccessPage` component takes
 * one prop:
 * @param params - The `params` prop is a promise that resolves to an object containing the locale
 * parameter.
 *
 * @returns The `ResetPasswordSuccessPage` component returns a JSX element that displays a success
 * message to the user after resetting their password.
 */
export default async function ResetPasswordSuccessPage({
  params,
}: ResetPasswordSuccessPageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);
  const t = messages.auth.resetPassword;

  return (
    <>
      <Navbar messages={messages.home} noLinks />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 space-y-8 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full ring-8 ring-white/90 dark:ring-gray-800/90 shadow-lg">
                <CheckCircle2 className="h-16 w-16 text-green-500 dark:text-green-400" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 pt-8">
              <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-200 bg-clip-text text-transparent">
                {t.successTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed">
                {t.successMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer messages={messages} />
    </>
  );
}
