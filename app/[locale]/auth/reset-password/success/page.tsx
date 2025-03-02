import { getMessages } from "@/lib/get-messages";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Password Reset Success | Motionext",
  description: "Your password has been reset successfully",
};

export interface ResetPasswordSuccessPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResetPasswordSuccessPage({
  params,
}: ResetPasswordSuccessPageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);
  const t = messages.auth.resetPassword;

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
          </div>

          <div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 
            ring-1 ring-gray-900/5 dark:ring-white/10 space-y-6 text-center"
          >
            <div className="mx-auto rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-16 h-16 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.successTitle}
            </h2>

            <p className="text-gray-600 dark:text-gray-400">
              {t.successMessage}
            </p>

            <Button asChild className="mt-6 w-full">
              <Link href="/auth/sign-in">{messages.auth.backToSignIn}</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer messages={messages} />
    </>
  );
}
