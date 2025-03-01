import { getMessages } from "@/lib/get-messages";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface ConfirmationPageProps {
  params: Promise<{ locale: string }>;
  searchParams: { success?: string };
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);
  const t = messages.auth;

  const isSuccess = searchParams.success === "true";

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
                {isSuccess ? t.emailConfirmed : t.emailConfirmationFailed}
              </h2>
            </div>
          </div>

          <div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 
          ring-1 ring-gray-900/5 dark:ring-white/10"
          >
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              {isSuccess ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500" />
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {t.accountActivated}
                  </p>
                  <Button asChild>
                    <Link href="/auth/sign-in">{t.signIn}</Link>
                  </Button>
                </>
              ) : (
                <>
                  <XCircle className="h-16 w-16 text-red-500" />
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {t.confirmationError}
                  </p>
                  <Button asChild>
                    <Link href="/auth/sign-up">{t.tryAgain}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer messages={messages} />
    </>
  );
}
