import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface AccountDeletionEmailProps {
  messages: {
    subject: string;
    preheader: string;
    title: string;
    description: string;
    footer: string;
    copyright: string;
  };
}

/**
 * The function `AccountDeletionEmail` generates an email template for account deletion with dynamic
 * content.
 * @param {AccountDeletionEmailProps}  - The `AccountDeletionEmail` component is a React functional
 * component that renders an email template for account deletion. It receives a prop object `messages`
 * of type `AccountDeletionEmailProps`, which contains various message content for the email template
 * such as `preheader`, `title`, `description`,
 * @returns The `AccountDeletionEmail` component is being returned. It contains HTML structure with
 * various elements such as links, images, text, and containers styled using Tailwind CSS classes. The
 * component receives `messages` as props and dynamically renders the content based on the values
 * provided in the `messages` object.
 */
export default function AccountDeletionEmail({
  messages,
}: AccountDeletionEmailProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Html>
      <Head>
        <link
          rel="preload"
          as="image"
          href="https://motionext.app/icon-rounded.png"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Preview>{messages.preheader}</Preview>
      <Tailwind>
        <Body className="bg-[#f5f7fa] font-['Space_Grotesk',HelveticaNeue,Helvetica,Arial,sans-serif] m-0 p-0">
          <Container className="my-10 mx-auto p-0 w-full max-w-[480px]">
            <Container className="bg-white rounded-2xl shadow-lg p-12 w-full">
              <Img
                src="https://motionext.app/icon-rounded.png"
                width="80"
                height="80"
                alt="Motionext"
                className="mx-auto block"
              />

              <Heading className="text-[#1f2937] text-2xl font-bold leading-8 mt-6 mb-4 text-center">
                {messages.title}
              </Heading>

              <Text className="text-[#6b7280] text-base leading-6 m-0 mb-8 text-center">
                {messages.description}
              </Text>

              <Section className="text-center mt-8">
                <Text className="text-[#6b7280] text-base leading-6">
                  {messages.footer}
                </Text>
              </Section>
            </Container>

            <Text className="text-[#6b7280] text-sm text-center mt-6">
              © {currentYear} Motionext. {messages.copyright}
            </Text>

            <Section className="mt-8 text-center">
              <Link
                href="https://instagram.com/motionext.app"
                className="mx-2 inline-block"
              >
                <Container className="w-8 h-8 bg-[#D28468] rounded-full p-2 inline-block">
                  <Img
                    src="https://motionext.app/icons/instagram.png"
                    width="16"
                    height="16"
                    alt="Instagram"
                  />
                </Container>
              </Link>
              <Link
                href="mailto:info@motionext.app"
                className="mx-2 inline-block"
              >
                <Container className="w-8 h-8 bg-[#D28468] rounded-full p-2 inline-block">
                  <Img
                    src="https://motionext.app/icons/email.png"
                    width="16"
                    height="16"
                    alt="Email"
                  />
                </Container>
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
