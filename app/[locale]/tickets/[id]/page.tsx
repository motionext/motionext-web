import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMessages } from "@/lib/get-messages";

import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { pt, es, fr, enUS } from "date-fns/locale";
import { ChevronLeft, ShieldUser } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TicketResponseForm } from "@/components/TicketResponseForm";
import { ImageModal } from "@/components/ui/image-modal";

interface TicketDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

/**
 * The `getDateLocale` function is a utility function that returns the appropriate date locale for a
 * given locale string.
 *
 * @param {string} locale - The locale string to get the date locale for.
 * @returns The appropriate date locale for the given locale string.
 */
function getDateLocale(locale: string) {
  switch (locale) {
    case "pt":
      return pt;
    case "es":
      return es;
    case "fr":
      return fr;
    default:
      return enUS;
  }
}

/**
 * The `generateMetadata` function is a Next.js function that generates metadata for the ticket
 * detail page.
 *
 * @param {TicketDetailPageProps} params - The `params` prop is a promise that resolves to an object
 * containing the locale and id parameters.
 * @returns The metadata for the ticket detail page.
 */
export async function generateMetadata({
  params,
}: TicketDetailPageProps): Promise<Metadata> {
  const { locale, id } = await Promise.resolve(params);
  const messages = await getMessages(locale);

  return {
    title: `${messages.tickets.ticketDetails} #${id.substring(0, 8)}`,
    description: messages.tickets.ticketDetails,
  };
}

/**
 * The `TicketDetailPage` component is a React functional component that displays the details of a
 * ticket.
 *
 * @param {TicketDetailPageProps} props - The `TicketDetailPage` component takes one prop:
 * @param params - The `params` prop is a promise that resolves to an object containing the locale
 * parameter.
 *
 * @returns The `TicketDetailPage` component returns a JSX element that displays the details of a
 * ticket.
 */
export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const { locale, id } = await Promise.resolve(params);
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

  // Fetch ticket details
  const { data: ticket, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !ticket) {
    // If the ticket does not exist or the user does not have access
    return notFound();
  }

  // Get public URLs for the images
  const imageUrls = [];

  if (ticket.images && ticket.images.length > 0) {
    for (const imagePath of ticket.images) {
      const { data: publicURL } = supabase.storage
        .from("tickets")
        .getPublicUrl(imagePath);

      if (publicURL) {
        imageUrls.push(publicURL.publicUrl);
      }
    }
  }

  // Fetch ticket responses
  const { data: responses } = await supabase
    .from('ticket_responses')
    .select(`
      *,
      user:user_id (
        first_name,
        last_name
      )
    `)
    .eq('ticket_id', id)
    .order('created_at', { ascending: true });

  /**
   * The `responseWithImages` variable is an array of objects that contain the ticket responses and
   * their associated image URLs.
   */
  const responseWithImages = await Promise.all(
    (responses || []).map(async (response) => {
      console.log(response);
      const respImageUrls = [];

      if (response.images && response.images.length > 0) {
        for (const imagePath of response.images) {
          const { data: publicURL } = supabase.storage
            .from("tickets")
            .getPublicUrl(imagePath);

          if (publicURL) {
            respImageUrls.push(publicURL.publicUrl);
          }
        }
      }

      return {
        ...response,
        imageUrls: respImageUrls,
      };
    })
  );

  return (
    <>
      <Navbar messages={messages.home} />
      <div
        className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
bg-[size:24px_24px] dark:bg-[size:24px_24px]-z-10"
      ></div>
      <section className="relative w-full bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 min-h-screen">
          <div className="mb-8">
            <Link
              href={`/tickets`}
              className="flex items-center text-muted-foreground hover:text-primary mb-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {messages.tickets.backToTickets}
            </Link>

            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold tracking-tight">
                {messages.tickets.ticketDetails}{" "}
                <span className="text-muted-foreground font-mono text-lg">
                  #{id.substring(0, 8)}
                </span>
              </h1>

              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  ticket.status === "open"
                    ? "bg-blue-100 text-blue-800"
                    : ticket.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : ticket.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {
                  messages.tickets.ticketStatuses[
                    ticket.status as keyof typeof messages.tickets.ticketStatuses
                  ]
                }
              </span>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>
                    {
                      messages.ticketForm.subjects[
                        ticket.subject as keyof typeof messages.ticketForm.subjects
                      ]
                    }
                  </CardTitle>
                  <CardDescription>
                    {messages.tickets.ticketCreated}:{" "}
                    {format(new Date(ticket.created_at), "PPP p", {
                      locale: getDateLocale(locale),
                    })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{ticket.message}</p>
              </div>

              {imageUrls.length > 0 && (
                <ImageViewer
                  images={imageUrls}
                  imageLabel={messages.ticketForm.imagesLabel}
                />
              )}
            </CardContent>
          </Card>

          {/* Responses section */}
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">
              {messages.tickets.ticketResponses}
            </h2>

            {responseWithImages && responseWithImages.length > 0 ? (
              <div className="space-y-4">
                {responseWithImages.map((response) => (
                  <div
                    key={response.id}
                    className={`flex ${
                      response.is_from_staff ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        response.is_from_staff
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      } p-4 rounded-lg`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold mr-2 flex items-center gap-2">
                          {response.is_from_staff
                            ? (
                              <>
                                <ShieldUser className="w-4 h-4 text-primary-foreground/80 flex-shrink-0" />
                                <span>
                                  {response.user?.first_name 
                                    ? `${response.user.first_name} ${response.user.last_name || ''}` 
                                    : "Admin"}
                                </span>
                              </>
                            )
                            : response.user.first_name + " " + response.user.last_name}
                        </div>
                        <div className="text-xs opacity-70">
                          <span
                            className="locale-date"
                            data-locale={locale}
                            data-date={response.created_at}
                          >
                            {format(new Date(response.created_at), "PPP", {
                              locale: getDateLocale(locale),
                            })}
                          </span>{" "}
                          {format(new Date(response.created_at), "p", {
                            locale: getDateLocale(locale),
                          })}
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap">
                        {response.message}
                      </div>

                      {response.imageUrls &&
                        response.imageUrls.length > 0 &&
                        (console.log(response.imageUrls),
                        (
                          <ImageViewer
                            images={response.imageUrls}
                            imageLabel={messages.tickets.imagesLabel}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4">
                {messages.tickets.noResponses}
              </p>
            )}

            {/* Form for adding a response */}
            <div className="mt-10">
              <TicketResponseForm
                ticketId={id}
                ticketStatus={ticket.status}
                messages={messages.tickets}
                isAdmin={isAdmin}
                resolvedAt={ticket.resolved_at}
                closedAt={ticket.closed_at}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer messages={messages} />
    </>
  );
}

// ImageViewer component for viewing images in a popup
function ImageViewer({
  images,
  imageLabel,
}: {
  images: string[];
  imageLabel: string;
}) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-2">{imageLabel}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {images.map((url, index) => (
          <ImageModal key={index} imageUrl={url} imageIndex={index} />
        ))}
      </div>
    </div>
  );
}
