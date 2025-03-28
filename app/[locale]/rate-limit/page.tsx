import { getMessages } from "@/lib/get-messages";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Clock, AlertCircle } from "lucide-react";

export interface RateLimitPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ minutes?: string }>;
}

/**
 * The `RateLimitPage` component is a React functional component that displays a rate limit error
 * message to the user.
 *
 * @param {RateLimitPageProps} props - The `RateLimitPage` component takes two props:
 * @param params - The `params` prop is a promise that resolves to an object containing the locale
 * parameter.
 * @param searchParams - The `searchParams` prop is a promise that resolves to an object containing
 * the minutes parameter.
 *
 * @returns The `RateLimitPage` component returns a JSX element that displays a rate limit error
 * message to the user.
 */
export default async function RateLimitPage({
  params,
  searchParams,
}: RateLimitPageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);
  const { minutes = "5" } = await Promise.resolve(searchParams);

  return (
    <>
      <Navbar messages={messages.home} noLinks />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 space-y-8 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="p-4 bg-amber-100 dark:bg-amber-900/50 rounded-full ring-8 ring-white/90 dark:ring-gray-800/90 shadow-lg">
                <AlertCircle className="h-16 w-16 text-amber-500 dark:text-amber-400 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 pt-8">
              <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-200 bg-clip-text text-transparent">
                {messages.errors.rateLimitTitle}
              </h2>
              <div className="flex items-center justify-center space-x-3 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-6 py-3 rounded-full">
                <Clock className="h-5 w-5 animate-spin-slow" />
                <p className="text-lg font-medium">
                  {messages.errors.rateLimitMessage.replace(
                    "{minutes}",
                    minutes
                  )}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed">
                {messages.errors.rateLimitDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer messages={messages} />
    </>
  );
}
