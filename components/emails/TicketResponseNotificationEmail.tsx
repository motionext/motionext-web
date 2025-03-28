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

interface TicketResponseNotificationEmailProps {
  messages: Messages["emails"]["ticketResponseNotification"];
  ticketData: {
    id: string;
    subject: string;
    email?: string;
  };
  responseData: {
    message: string;
    hasImages: boolean;
    images?: string[];
  };
  isFromStaff?: boolean;
  customerEmail?: string;
  siteUrl?: string;
}

/**
 * The function `TicketResponseNotificationEmail` generates an email template for notifying users about
 * ticket responses, including message content, ticket details, and a footer with branding information.
 * @param {TicketResponseNotificationEmailProps}  - The `TicketResponseNotificationEmail` component is
 * a React component that generates an email template for notifying users about ticket responses.
 * Here's an explanation of the parameters used in the component:
 * @returns The `TicketResponseNotificationEmail` component is being returned. It is a React component
 * that generates an email template for notifying users about ticket responses. The template includes
 * information such as the ticket ID, customer email, response message, attachments, a button to view
 * the ticket, and a footer with copyright information.
 */
export default function TicketResponseNotificationEmail({
  messages,
  ticketData,
  responseData,
  isFromStaff,
  customerEmail,
  siteUrl = "",
}: TicketResponseNotificationEmailProps) {
  const currentYear = new Date().getFullYear();
  const ticketIdShort = ticketData.id.substring(0, 8);
  const ticketUrl = `${siteUrl}/tickets/${ticketData.id}`;

  return (
    <Html>
      <Head />
      <Preview>
        {isFromStaff
          ? `${messages.newResponse}: #${ticketIdShort}`
          : `${messages.userResponse}: #${ticketIdShort}`}
      </Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-white">
          <Container className="mx-auto my-10 max-w-[600px] rounded overflow-hidden border border-gray-200">
            <Section className="bg-primary text-primary-foreground px-6 py-8">
              <Heading className="text-2xl font-bold text-center">
                {isFromStaff
                  ? `${messages.newResponse}: #${ticketIdShort}`
                  : `${messages.userResponse}: #${ticketIdShort}`}
              </Heading>
            </Section>
            <Section className="px-6 py-8 bg-white">
              {customerEmail && (
                <Text className="text-gray-700 font-medium mb-4">
                  {messages.customerEmail}: {customerEmail}
                </Text>
              )}

              <Section className="bg-gray-50 rounded p-4 my-4">
                {/* <Section className="mb-2">
                  <Text className="text-gray-500 text-sm mb-1">
                    {messages.ticketId}
                  </Text>
                  <Text className="text-gray-700 font-mono bg-gray-100 p-2 rounded">
                    {ticketData.id}
                  </Text>
                </Section> */}

                <Section className="mb-2">
                  <Text className="text-gray-500 text-sm mb-1">
                    {messages.responseMessage}
                  </Text>
                  <Text className="text-gray-700 bg-gray-100 p-2 rounded whitespace-pre-wrap">
                    {responseData.message}
                  </Text>
                </Section>

                {responseData.hasImages && (
                  <Text className="text-gray-500 text-sm mt-2 italic">
                    * {messages.attachmentsIncluded}
                  </Text>
                )}
              </Section>

              <Section className="text-center mt-8">
                <Button
                  className="bg-primary text-primary-foreground px-6 py-3 rounded font-medium text-sm no-underline"
                  href={ticketUrl}
                >
                  {messages.viewTicket}
                </Button>
              </Section>

              <Hr className="my-6 border-gray-200" />

              <Text className="text-gray-500 text-sm text-center">
                {messages.footer}
              </Text>
            </Section>

            <Section className="px-6 py-4 bg-gray-50 text-center">
              <Text className="text-gray-500 text-xs">
                {messages.poweredBy}
              </Text>
              <Text className="text-gray-500 text-xs">
                &copy; {currentYear} Motionext. {messages.copyright}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
