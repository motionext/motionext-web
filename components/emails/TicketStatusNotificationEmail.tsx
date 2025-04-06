import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { Messages } from "@/types/messages";

interface TicketStatusNotificationEmailProps {
  messages: Messages["emails"]["ticketStatusNotification"];
  ticketData: {
    id: string;
    subject: string;
    status: string;
  };
  statusLabels: {
    [key: string]: string;
  };
  siteUrl?: string;
}

/**
 * The `TicketStatusNotificationEmail` component generates an email template to notify users
 * about changes in ticket status, including ticket details and instructions on how to view updates.
 */
export default function TicketStatusNotificationEmail({
  messages,
  ticketData,
  statusLabels,
  siteUrl = "",
}: TicketStatusNotificationEmailProps) {
  const currentYear = new Date().getFullYear();
  const ticketIdShort = ticketData.id.substring(0, 8);
  const ticketUrl = `${siteUrl}/tickets/${ticketData.id}`;

  return (
    <Html>
      <Head />
      <Preview>{messages.subject}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-white">
          <Container className="mx-auto my-10 max-w-[600px] rounded overflow-hidden border border-gray-200">
            <Section className="bg-primary text-primary-foreground px-6 py-8">
              <Heading className="text-2xl font-bold text-center">
                {messages.subject}
              </Heading>
            </Section>
            <Section className="px-6 py-8 bg-white">
              <Text className="text-gray-700 font-medium">
                {messages.greeting}
              </Text>
              <Text className="text-gray-700">{messages.statusUpdated}</Text>

              {/* Add specific messages for each status */}
              {ticketData.status === "resolved" && (
                <Text className="text-gray-700 mt-2">
                  {messages.resolvedMessage}
                </Text>
              )}
              {ticketData.status === "closed" && (
                <Text className="text-gray-700 mt-2">
                  {messages.closedMessage}
                </Text>
              )}

              <Section className="bg-gray-50 rounded p-4 my-4">
                <Section className="mb-2">
                  <Text className="text-gray-500 text-sm mb-1">Ticket ID</Text>
                  <Text className="text-gray-700 font-mono bg-gray-100 p-2 rounded">
                    #{ticketIdShort}
                  </Text>
                </Section>

                <Section className="mb-2">
                  <Text className="text-gray-500 text-sm mb-1">Subject</Text>
                  <Text className="text-gray-700 bg-gray-100 p-2 rounded">
                    {ticketData.subject}
                  </Text>
                </Section>

                <Section className="mb-2">
                  <Text className="text-gray-500 text-sm mb-1">Status</Text>
                  <Text className="text-gray-700 font-medium bg-gray-100 p-2 rounded">
                    {statusLabels[ticketData.status] || ticketData.status}
                  </Text>
                </Section>
              </Section>

              <Text className="text-gray-700 mb-4">{messages.nextSteps}</Text>

              <Section className="text-center my-8">
                <Button
                  className="bg-primary text-primary-foreground px-6 py-3 rounded text-sm font-medium no-underline"
                  href={ticketUrl}
                >
                  {messages.viewTicket}
                </Button>
              </Section>

              <Hr className="my-6 border-t border-gray-300" />

              <Text className="text-gray-700 text-sm">
                {messages.thankyou},
                <br />
                {messages.team}
              </Text>
            </Section>

            <Section className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500">
              <Text className="my-1">{messages.footer}</Text>
              <Text className="my-1">{messages.poweredBy}</Text>
              <Text className="my-1">
                © {currentYear} Motionext. {messages.copyright}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
