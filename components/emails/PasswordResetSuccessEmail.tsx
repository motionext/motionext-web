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

interface PasswordResetSuccessEmailProps {
  messages: Messages["emails"]["passwordReset"];
  siteUrl?: string;
}

/**
 * The `PasswordResetSuccessEmail` component generates an email template to notify the user
 * that their password has been reset successfully.
 */
export default function PasswordResetSuccessEmail({
  messages,
  siteUrl = "",
}: PasswordResetSuccessEmailProps) {
  const currentYear = new Date().getFullYear();
  const loginUrl = `${siteUrl}/auth/signin`;

  return (
    <Html>
      <Head />
      <Preview>{messages.subject}</Preview>
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
              <Text className="text-gray-700">{messages.message}</Text>

              <Text className="text-gray-700 mt-4">
                {messages.securityNotice}
              </Text>

              <Section className="text-center my-8">
                <Button
                  className="bg-primary text-primary-foreground px-6 py-3 rounded text-sm font-medium no-underline"
                  href={loginUrl}
                >
                  {messages.loginButtonText}
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
              <Text className="my-1">© {currentYear} Motionext. {messages.copyright}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
} 