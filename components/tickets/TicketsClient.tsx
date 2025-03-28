"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import {
  PlusCircle,
  CalendarIcon,
  ClockIcon,
  MessageSquare,
  InboxIcon,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDateLocale } from "@/lib/utils";
import { Messages } from "@/types/messages";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  user_email: string;
  response_count: number;
}

interface TicketsClientProps {
  tickets: Ticket[];
  allTickets?: Ticket[];
  messages: Messages;
  localeCode: string;
  isAdmin?: boolean;
}

/**
 * The `TicketsClient` function in TypeScript React manages ticket filtering, rendering, and state
 * handling based on user roles and statuses.
 * @param {TicketsClientProps}  - The `TicketsClient` function is a React component that handles the
 * display of tickets based on various filters and conditions. Here's a breakdown of the parameters
 * used in the function:
 */
export function TicketsClient({
  tickets,
  allTickets = [],
  messages,
  localeCode,
  isAdmin = false,
}: TicketsClientProps) {
  // Convert the locale code to the locale object
  const dateLocale = getDateLocale(localeCode);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState(
    searchParams.get("status") || ""
  );
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [filteredAllTickets, setFilteredAllTickets] =
    useState<Ticket[]>(allTickets);
  const [activeTab, setActiveTab] = useState<string>("my-tickets");

  useEffect(() => {
    if (filterStatus) {
      setFilteredTickets(
        tickets.filter((ticket) => ticket.status === filterStatus)
      );
      setFilteredAllTickets(
        allTickets.filter((ticket) => ticket.status === filterStatus)
      );
    } else {
      setFilteredTickets(tickets);
      setFilteredAllTickets(allTickets);
    }
  }, [filterStatus, tickets, allTickets]);

  /**
   * The function `setFilterParams` updates the filter status and the URL parameters without reloading
   * the page in a TypeScript React application.
   * @param  - The `setFilterParams` function takes an object as a parameter with a `status` property of
   * type string. It sets the filter status using the `setFilterStatus` function, updates the URL query
   * parameters based on the status value, and then replaces the current URL without reloading the page
   * using the
   */
  const setFilterParams = ({ status }: { status: string }) => {
    setFilterStatus(status);

    // Update the URL
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    // Replace the current URL without reloading the page
    router.replace(`/tickets?${params.toString()}`);
  };

  /**
   * The `renderTicket` function generates a card component displaying information about a ticket,
   * including subject, creation date, status, user email, message, and response count.
   * @param {Ticket} ticket - The `renderTicket` function takes in a `ticket` object as a parameter. The
   * `ticket` object likely contains information about a specific ticket, such as its `id`, `subject`,
   * `created_at`, `status`, `user_email`, `message`, and `response_count`.
   */
  const renderTicket = (ticket: Ticket) => (
    <Link href={`/tickets/${ticket.id}`} key={ticket.id}>
      <Card className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                {
                  messages.ticketForm.subjects[
                    ticket.subject as keyof typeof messages.ticketForm.subjects
                  ]
                }
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {format(new Date(ticket.created_at), "PPP", {
                  locale: dateLocale,
                })}
                <span className="text-gray-300 dark:text-gray-700 mx-2">|</span>
                <ClockIcon className="h-3 w-3 mr-1" />
                {format(new Date(ticket.created_at), "p", {
                  locale: dateLocale,
                })}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`${
                  ticket.status === "open"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    : ticket.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                      : ticket.status === "resolved"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {
                  messages.tickets.ticketStatuses[
                    ticket.status as keyof typeof messages.tickets.ticketStatuses
                  ]
                }
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "all-tickets" && (
            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">{messages.tickets.from}:</span>{" "}
              {ticket.user_email}
            </div>
          )}
          <p className="text-muted-foreground line-clamp-2">{ticket.message}</p>

          {ticket.response_count > 0 && (
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <MessageSquare className="h-3 w-3 mr-1" />
              {messages.tickets.responseCount}: {ticket.response_count}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );

  /**
   * The `renderEmptyState` function is a React function that returns JSX elements for rendering an
   * empty state message in a React component. The empty state message includes text and icons to
   * inform the user that there are no tickets available. Depending on the `activeTab` state,
   * different messages are displayed. If the `activeTab` is not "all-tickets", a button is provided
   * to create a new ticket. The code uses Tailwind CSS classes for styling the elements.
   */
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="flex flex-col items-center gap-2">
        <InboxIcon className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">{messages.tickets.noTickets}</h3>
        <p className="text-muted-foreground">
          {activeTab === "all-tickets"
            ? messages.tickets.noAllTickets
            : messages.tickets.noTicketsDesc}
        </p>
        {activeTab !== "all-tickets" && (
          <div className="mt-4">
            <Link href="/support">
              <Button>
                {messages.tickets.createFirst}
                <PlusCircle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );


  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {messages.tickets.myTickets}
        </h1>
        <p className="text-muted-foreground text-lg">
          {messages.tickets.subtitle}
        </p>
      </div>

      {isAdmin ? (
        <Tabs
          defaultValue="my-tickets"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="my-tickets">
              {messages.tickets.myTickets}
            </TabsTrigger>
            <TabsTrigger value="all-tickets" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {messages.tickets.allTickets}
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={filterStatus === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterParams({ status: "" })}
                className="h-8"
              >
                {messages.tickets.all}
              </Button>
              {Object.entries(messages.tickets.ticketStatuses).map(
                ([key, label]) => (
                  <Button
                    key={key}
                    variant={filterStatus === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterParams({ status: key })}
                    className={`h-8 ${
                      key === "open"
                        ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        : key === "in_progress"
                          ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                          : key === "resolved"
                            ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                            : key === "closed"
                              ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                              : ""
                    } ${filterStatus === key ? "ring-2 ring-offset-1 dark:ring-offset-gray-950" : ""}`}
                  >
                    {label as React.ReactNode}
                  </Button>
                )
              )}
            </div>

            <Link href="/support" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto" size="sm">
                {messages.tickets.newTicket}
                <PlusCircle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <TabsContent value="my-tickets">
            {filteredTickets && filteredTickets.length > 0 ? (
              <div className="grid gap-4 mb-8">
                {filteredTickets.map(renderTicket)}
              </div>
            ) : (
              renderEmptyState()
            )}
          </TabsContent>

          <TabsContent value="all-tickets">
            {filteredAllTickets && filteredAllTickets.length > 0 ? (
              <div className="grid gap-4 mb-8">
                {filteredAllTickets.map(renderTicket)}
              </div>
            ) : (
              renderEmptyState()
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant={filterStatus === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterParams({ status: "" })}
                className="h-8"
              >
                {messages.tickets.all}
              </Button>
              {Object.entries(messages.tickets.ticketStatuses).map(
                ([key, label]) => (
                  <Button
                    key={key}
                    variant={filterStatus === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterParams({ status: key })}
                    className={`h-8 ${
                      key === "open"
                        ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        : key === "in_progress"
                          ? "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                          : key === "resolved"
                            ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                            : key === "closed"
                              ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                              : ""
                    } ${filterStatus === key ? "ring-2 ring-offset-1 dark:ring-offset-gray-950" : ""}`}
                  >
                    {label as React.ReactNode}
                  </Button>
                )
              )}
            </div>

            <Link href="/support" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto" size="sm">
                {messages.tickets.newTicket}
                <PlusCircle className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {filteredTickets && filteredTickets.length > 0 ? (
            <div className="grid gap-4 mb-8">
              {filteredTickets.map(renderTicket)}
            </div>
          ) : (
            renderEmptyState()
          )}
        </>
      )}
    </>
  );
}
