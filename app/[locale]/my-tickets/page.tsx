import { getMessages } from "@/lib/get-messages";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface MyTicketsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MyTicketsPage({ params }: MyTicketsPageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  return (
    <>
      <Navbar messages={messages.home} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black p-4 sm:p-6 lg:p-8 pt-24 sm:pt-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 ring-1 ring-gray-900/5 dark:ring-white/10">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
              {messages.tickets.myTickets}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              In construction.
            </p>
          </div>
        </div>
      </div>
      <Footer messages={messages} />
    </>
  );
} 