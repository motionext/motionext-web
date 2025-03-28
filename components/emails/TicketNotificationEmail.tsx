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
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { Messages } from "@/types/messages";

interface TicketNotificationEmailProps {
  messages: Messages["emails"]["ticketNotification"];
  ticketData: {
    id: string;
    subject: string;
    message: string;
    email: string;
    hasImages: boolean;
    images?: string[];
  };
}

/**
 * The `TicketNotificationEmail` component is a React functional component that generates an HTML
 * email template using JSX syntax. The template includes various sections such as headings, text
 * content, and styling classes based on the provided `messages` and `ticketData` props.
 */
export default function TicketNotificationEmail({
  messages,
  ticketData,
}: TicketNotificationEmailProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>{messages.title}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto font-sans bg-white">
          <Container className="mx-auto my-10 max-w-[600px] rounded overflow-hidden border border-gray-200">
            <Section className="bg-primary text-primary-foreground px-6 py-8">
              <Heading className="text-2xl font-bold text-center">
                {messages.title}
              </Heading>
            </Section>
            <Section className="px-6 py-8 bg-white">
              <Text className="text-gray-700 font-medium">
                {messages.greeting}
              </Text>
              <Text className="text-gray-700">{messages.ticketReceived}</Text>

              <Section className="bg-gray-50 rounded p-4 my-4">
                <Text className="text-gray-700 font-medium">
                  {messages.ticketInfo}
                </Text>

                <Section className="mb-2">
                  <Text className="text-gray-500 text-sm mb-1">
                    {messages.ticketId}
                  </Text>
                  <Text className="text-gray-700 font-mono bg-gray-100 p-2 rounded">
                    {ticketData.id}
                  </Text>
                </Section>

                <Section className="mb-2">
                  <Text className="text-gray-500 text-sm mb-1">Email</Text>
                  <Text className="text-gray-700 bg-gray-100 p-2 rounded">
                    {ticketData.email}
                  </Text>
                </Section>

                <Section className="mb-2">
                  <Text className="text-gray-500 text-sm mb-1">
                    {messages.subjectLabel}
                  </Text>
                  <Text className="text-gray-700 bg-gray-100 p-2 rounded">
                    {ticketData.subject}
                  </Text>
                </Section>

                <Section>
                  <Text className="text-gray-500 text-sm mb-1">
                    {messages.messageLabel}
                  </Text>
                  <Text className="text-gray-700 bg-gray-100 p-2 rounded whitespace-pre-wrap">
                    {ticketData.message}
                  </Text>
                </Section>

                {ticketData.hasImages && messages.attachmentsIncluded && (
                  <Text className="text-gray-500 text-sm mt-2 italic">
                    * {messages.attachmentsIncluded}
                  </Text>
                )}
              </Section>

              <Text className="text-gray-700 font-medium">
                {messages.whatHappensNext}
              </Text>

              <Text className="text-gray-700">{messages.nextSteps}</Text>

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
