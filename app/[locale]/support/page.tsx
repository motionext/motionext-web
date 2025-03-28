import { Metadata } from "next";
import { getMessages } from "@/lib/get-messages";
import { TicketForm } from "@/components/TicketForm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

interface SupportPageProps {
  params: {
    locale: string;
  };
}

/**
 * The `generateMetadata` function is a Next.js function that generates metadata for the support
 * page.
 *
 * @param {SupportPageProps} params - The `params` prop is a promise that resolves to an object
 * containing the locale parameter.
 */
export async function generateMetadata({
  params,
}: SupportPageProps): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);

  return {
    title: messages.ticketForm.title,
    description: messages.ticketForm.description,
  };
}

/**
 * The `SupportPage` component is a React functional component that displays a support page for
 * the user.
 *
 * @param {SupportPageProps} props - The `SupportPage` component takes one prop:
 * @param params - The `params` prop is a promise that resolves to an object containing the locale
 * parameter.
 */
export default async function SupportPage({ params }: SupportPageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);

  // Check if the user is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  return (
    <>
      <Navbar messages={messages.home} />
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
bg-[size:24px_24px] dark:bg-[size:24px_24px]-z-10"
      ></div>
      <section className="relative w-full bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 min-h-screen">
          <div className="mb-12 space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              {messages.ticketForm.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {messages.ticketForm.description}
            </p>
          </div>
          <TicketForm
            messages={messages.ticketForm}
            isAuthenticated={isAuthenticated}
            locale={locale}
          />
        </div>
      </section>
      <Footer messages={messages} />
    </>
  );
}
