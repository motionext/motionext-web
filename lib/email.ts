import { Resend } from "resend";
import AccountDeletionEmail from "@/components/emails/AccountDeletionEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

function generatePlainText(messages: {
  title: string;
  description: string;
  footer: string;
  copyright: string;
}) {
  const currentYear = new Date().getFullYear();
  return `${messages.title}

${messages.description}

${messages.footer}

© ${currentYear} Motionext. ${messages.copyright}

--
Motionext
Instagram: https://instagram.com/motionext.app
Email: info@motionext.app`;
}

export async function sendAccountDeletionEmail(
  email: string,
  locale: string = "en"
) {
  try {
    // Import messages dynamically based on locale
    const messages = (await import(`@/messages/${locale}.ts`)).default;
    const emailMessages = messages.emails.accountDeletion;

    await resend.emails.send({
      from: "Motionext <info@transactional.motionext.app>",
      to: email,
      subject: emailMessages.subject,
      react: AccountDeletionEmail({
        messages: emailMessages,
      }),
      text: generatePlainText(emailMessages),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending account deletion email:", error);
    return { success: false, error };
  }
}
