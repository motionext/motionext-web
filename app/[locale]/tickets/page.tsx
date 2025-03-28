import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMessages } from "@/lib/get-messages";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TicketsClient } from "@/components/tickets/TicketsClient";

interface TicketsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * The `generateMetadata` function is a Next.js function that generates metadata for the tickets
 * page.
 *
 * @param {TicketsPageProps} params - The `params` prop is a promise that resolves to an object
 * containing the locale parameter.
 */
export async function generateMetadata({
  params,
}: TicketsPageProps): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);

  return {
    title: messages.tickets.pageTitle,
    description: messages.tickets.pageTitle,
  };
}

/**
 * The `TicketsPage` component is a React functional component that displays a page for users to
 * view their tickets.
 *
 * @param {TicketsPageProps} props - The `TicketsPage` component takes one prop:
 * @param params - The `params` prop is a promise that resolves to an object containing the locale
 * parameter.
 *
 * @returns The `TicketsPage` component returns a JSX element that displays a page for users to
 * view their tickets.
 */
export default async function TicketsPage({ params }: TicketsPageProps) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale);
  const supabase = await createClient();

  // Check if the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // Redirect to the login page if not authenticated
    return redirect(`/auth/sign-in`);
  }

  // Check if the user is an admin
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = userData?.role === "admin";

  // Fetch tickets for the user
  const { data: userTickets = [], error: userTicketsError } = await supabase
    .from("tickets")
    .select("*, ticket_responses(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (userTicketsError) {
    console.error("Error fetching user tickets:", userTicketsError);
  }

  // Fetch all tickets if the user is an admin
  const { data: allTickets = [], error: allTicketsError } = isAdmin
    ? await supabase
        .from("tickets")
        .select("*, ticket_responses(count), users(email)")
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (allTicketsError) {
    console.error("Error fetching all tickets:", allTicketsError);
  }

  // Process ticket data to ensure we have response_count
  const processedUserTickets = (userTickets || []).map((ticket) => ({
    ...ticket,
    response_count: ticket.ticket_responses?.[0]?.count || 0,
  }));

  // Process all tickets data (for admins)
  const processedAllTickets = isAdmin
    ? (allTickets || []).map((ticket) => ({
        ...ticket,
        response_count: ticket.ticket_responses?.[0]?.count || 0,
        user_email: ticket.users?.email || ticket.user_email || "",
      }))
    : [];

  return (
    <>
      <Navbar messages={messages.home} />
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
bg-[size:24px_24px] dark:bg-[size:24px_24px]-z-10"
      ></div>
      <section className="relative w-full bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 min-h-screen">
          <TicketsClient
            tickets={processedUserTickets}
            allTickets={processedAllTickets}
            messages={messages}
            localeCode={locale}
            isAdmin={isAdmin}
          />
        </div>
      </section>
      <Footer messages={messages} />
    </>
  );
}
