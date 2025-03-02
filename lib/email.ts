import { Resend } from "resend";
import AccountDeletionEmail from "@/components/emails/AccountDeletionEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAccountDeletionEmail(
  email: string,
  locale: string = "en"
) {
  try {
    // Import messages dynamically based on locale
    const messages = (await import(`@/messages/${locale}.ts`)).default;
    const emailMessages = messages.emails.accountDeletion;

    await resend.emails.send({
      from: "Motionext <no-reply@transactional.motionext.app>",
      to: email,
      subject: emailMessages.subject,
      react: AccountDeletionEmail({
        messages: emailMessages,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending account deletion email:", error);
    return { success: false, error };
  }
}
