import { getMessages } from "@/lib/get-messages";
import { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Auth Error | Motionext",
  description: "An error occurred during the authentication process",
};

interface AuthErrorPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}

/**
 * The `AuthErrorPage` component is a React functional component that displays an error message to
 * the user based on the error code.
 *
 * @param {AuthErrorPageProps} props - The `AuthErrorPage` component takes two props:
 * @param params - The `params` prop is a promise that resolves to an object containing the locale
 * parameter.
 * @param searchParams - The `searchParams` prop is a promise that resolves to an object containing
 * the error parameter.
 *
 * @returns The `AuthErrorPage` component returns a JSX element that displays an error message to
 * the user based on the error code.
 */
export default async function AuthErrorPage({
  params,
  searchParams,
}: AuthErrorPageProps) {
  const { locale } = await Promise.resolve(params);
  const { error: errorCode } = await Promise.resolve(searchParams);
  const messages = await getMessages(locale);
  const error = errorCode || "unexpected_error";

  // Mapear códigos de erro para mensagens amigáveis usando o sistema de traduções
  const errorMessages: Record<string, { title: string; message: string }> = {
    invalid_parameters: {
      title: messages.auth.error.invalidParametersTitle,
      message: messages.auth.error.invalidParametersMessage,
    },
    invalid_token: {
      title: messages.auth.error.invalidTokenTitle,
      message: messages.auth.error.invalidTokenMessage,
    },
    session_error: {
      title: messages.auth.error.sessionErrorTitle,
      message: messages.auth.error.sessionErrorMessage,
    },
    unexpected_error: {
      title: messages.auth.error.unexpectedErrorTitle,
      message: messages.auth.error.unexpectedErrorMessage,
    },
  };

  const errorDetails = errorMessages[error] || errorMessages.unexpected_error;

  return (
    <>
      <Navbar messages={messages.home} noLinks />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black p-4 sm:p-6 lg:p-8 pt-24 sm:pt-16">
        <div className="w-full max-w-lg">
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 space-y-8 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-full ring-8 ring-white/90 dark:ring-gray-800/90 shadow-lg">
                <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 pt-8">
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-200 bg-clip-text text-transparent">
                {errorDetails.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed">
                {errorDetails.message}
              </p>
              <div className="space-y-4 w-full pt-4">
                <Button asChild className="w-full">
                  <Link href="/auth/sign-in">{messages.auth.backToSignIn}</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/forgot-password">
                    {messages.auth.sendResetLink}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer messages={messages} />
    </>
  );
}
