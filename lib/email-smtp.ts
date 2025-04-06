import { ReactElement } from "react";
import { render } from "@react-email/render";
import { createTransport } from "nodemailer";
import { normalizeLocale } from "@/lib/normalize-locale";

/* The above code is creating a nodemailer transporter object for sending emails. It is using
environment variables to configure the SMTP host, port, secure connection, and authentication
credentials (username and password) for the email server. */
const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    path: string;
    cid?: string;
  }>;
}

/**
 * The function `generatePlainText` takes in an object containing title, description, footer, and
 * copyright messages, and returns a formatted plain text message including the current year and
 * additional information.
 * @param messages - {
 * @returns The function `generatePlainText` returns a formatted plain text message that includes the
 * title, description, footer, copyright information with the current year, and additional contact
 * information for Motionext.
 */
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
https://motionext.app
Email: info@motionext.app`;
}

/**
 * The function `renderAsync` asynchronously renders a React component and returns the result as a
 * string.
 * @param component - The `component` parameter is a React element that represents a UI component in a
 * React application. It could be a functional component, a class component, or any other type of
 * component that can be rendered in a React application.
 * @returns The `renderAsync` function is returning a Promise that resolves to a string.
 */
async function renderAsync(component: ReactElement): Promise<string> {
  return render(component);
}

/**
 * The function `sendEmail` in TypeScript sends an email with options like recipient, subject, content,
 * and attachments, handling rendering of React components to HTML and error logging.
 * @param {EmailOptions}  - The `sendEmail` function you provided is an asynchronous function that
 * sends an email using Nodemailer. Here's an explanation of the parameters used in the function:
 * @returns The `sendEmail` function returns an object with either a success or error status along with
 * the message ID of the email sent. If the email is sent successfully, it returns `{ success: true,
 * messageId: info.messageId }`. If there is an error during the process, it returns `{ success: false,
 * error }` where `error` contains the error information.
 */
export async function sendEmail({
  to,
  subject,
  react,
  text,
  from = "Motionext <info@motionext.app>",
  replyTo = "info@motionext.app",
  attachments = [],
}: EmailOptions) {
  try {
    // Render the React component to HTML
    const html = await Promise.resolve(render(react));

    // Send the email
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || "", // Alternative plain text
      replyTo,
      attachments,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

/**
 * The function `sendTicketConfirmationEmail` sends a confirmation email for a ticket with dynamic
 * content based on the locale.
 * @param  - The `sendTicketConfirmationEmail` function is an asynchronous function that sends a ticket
 * confirmation email to a specified email address. Here's an explanation of the parameters:
 * @returns The `sendTicketConfirmationEmail` function returns an object with a `success` property
 * indicating whether the email sending was successful or not. If successful, it returns `{ success:
 * true }`, and if there was an error, it returns `{ success: false, error }` where `error` is the
 * caught error object.
 */
export async function sendTicketConfirmationEmail({
  email,
  ticketData,
  locale = "en",
}: {
  email: string;
  ticketData: {
    id: string;
    subject: string;
    message: string;
    hasImages: boolean;
  };
  locale?: string;
}) {
  try {
    // Normalize the locale
    const resolvedLocale = normalizeLocale(locale);
    
    // Import dynamically the messages based on the locale
    const messages = (await import(`@/messages/${resolvedLocale}.ts`)).default;
    const emailMessages = messages.emails.ticketConfirmation;

    // Import dynamically the component
    const TicketConfirmationEmail = (
      await import("@/components/emails/TicketConfirmationEmail")
    ).default;

    await sendEmail({
      from: "Motionext Support <info@motionext.app>",
      to: email,
      subject: emailMessages.subject,
      react: TicketConfirmationEmail({
        messages: emailMessages,
        ticketData: {
          ...ticketData,
          email,
        },
      }),
      text: generatePlainText({
        title: emailMessages.title,
        description: `${emailMessages.greeting}\n\n${emailMessages.ticketReceived}\n\nTicket ID: ${ticketData.id}\n\n${emailMessages.whatHappensNext}\n\n${emailMessages.nextSteps}`,
        footer: emailMessages.footer,
        copyright: emailMessages.copyright,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending ticket confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * The function `sendTicketNotificationEmail` sends an email notification for a new ticket with dynamic
 * content based on the provided locale.
 * @param  - The `sendTicketNotificationEmail` function is an asynchronous function that sends a
 * notification email for a ticket. It takes an object as a parameter with the following properties:
 * @returns The function `sendTicketNotificationEmail` returns an object with a `success` property
 * indicating whether the email sending was successful or not. If the email was sent successfully, it
 * returns `{ success: true }`. If there was an error during the process, it returns `{ success: false,
 * error }` where `error` is the error object caught during the execution of the function.
 */
export async function sendTicketNotificationEmail({
  ticketData,
  locale = "en",
}: {
  ticketData: {
    id: string;
    subject: string;
    message: string;
    email: string;
    hasImages: boolean;
    images?: string[];
  };
  locale?: string;
}) {
  try {
    // Normalize the locale
    const resolvedLocale = normalizeLocale(locale);
    
    // Import dynamically the messages based on the locale
    const messages = (await import(`@/messages/${resolvedLocale}.ts`)).default;
    const emailMessages = messages.emails.ticketNotification;

    // Import dynamically the component
    const TicketNotificationEmail = (
      await import("@/components/emails/TicketNotificationEmail")
    ).default;

    await sendEmail({
      from: "Motionext Support <info@motionext.app>",
      to: "info@motionext.app",
      subject: `${emailMessages.newTicket}: ${ticketData.subject} (${ticketData.id})`,
      react: TicketNotificationEmail({
        messages: {
          ...emailMessages,
          title: `${emailMessages.newTicket}: ${ticketData.subject}`,
          greeting: `${emailMessages.customerEmail}: ${ticketData.email}`,
        },
        ticketData,
      }),
      text: `
${emailMessages.newTicket}: ${ticketData.subject}

${emailMessages.customerEmail}: ${ticketData.email}

Ticket ID: ${ticketData.id}

Message:
${ticketData.message}

${ticketData.hasImages ? emailMessages.attachmentsIncluded : ""}
`,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending ticket notification:", error);
    return { success: false, error };
  }
}

/**
 * The function `sendAccountDeletionEmail` sends an account deletion email to a specified email address
 * based on the provided locale.
 * @param {string} email - The `email` parameter in the `sendAccountDeletionEmail` function is the
 * email address of the user for whom you want to send the account deletion email.
 * @param {string} [locale=en] - The `locale` parameter in the `sendAccountDeletionEmail` function is
 * used to specify the language or region for which the email content should be localized. By default,
 * it is set to "en" which represents English. You can pass a different locale value to generate the
 * email content in a
 * @returns The `sendAccountDeletionEmail` function returns an object with a `success` property
 * indicating whether the email sending was successful or not. If successful, it returns `{ success:
 * true }`. If there was an error during the process, it returns `{ success: false, error }` where
 * `error` is the caught error object.
 */
export async function sendAccountDeletionEmail(
  email: string,
  locale: string = "en"
) {
  try {
    // Normalize the locale
    const resolvedLocale = normalizeLocale(locale);
    
    // Import the component dynamically
    const AccountDeletionEmail = (
      await import("@/components/emails/AccountDeletionEmail")
    ).default;

    // Import messages based on the locale
    const messages = (await import(`@/messages/${resolvedLocale}`)).default;
    const emailMessages = messages.emails.accountDeletion;

    await sendEmail({
      from: "Motionext Security <info@motionext.app>",
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

/**
 * The function `sendTicketResponseNotificationToUser` sends an email notification to a user regarding
 * a ticket response, with customizable content based on the locale and response type.
 * @param {string} email - The `email` parameter in the `sendTicketResponseNotificationToUser` function
 * is the email address of the user to whom the ticket response notification will be sent.
 * @param ticketData - The `ticketData` parameter in the `sendTicketResponseNotificationToUser`
 * function includes the following properties:
 * @param responseData - The `responseData` parameter in the `sendTicketResponseNotificationToUser`
 * function contains the following properties:
 * @param {boolean} isFromStaff - The `isFromStaff` parameter in the
 * `sendTicketResponseNotificationToUser` function is a boolean value that indicates whether the ticket
 * response notification is being sent from staff or from the user. This parameter helps determine the
 * content and formatting of the email notification based on whether the response is from staff or
 * @param {string} [locale=en] - The `locale` parameter in the `sendTicketResponseNotificationToUser`
 * function is used to specify the language/locale for the email messages. It defaults to "en"
 * (English) if not provided. The function loads messages based on the specified locale to customize
 * the email content for the user.
 * @returns The function `sendTicketResponseNotificationToUser` is returning the information object
 * `info` after sending the email notification. The information object contains details about the email
 * sent, such as the sender, recipient, subject, text body, and HTML body of the email.
 */
export async function sendTicketResponseNotificationToUser(
  email: string,
  ticketData: {
    id: string;
    subject: string;
  },
  responseData: {
    message: string;
    hasImages: boolean;
  },
  isFromStaff: boolean,
  locale: string = "en"
) {
  try {
    // Normalize the locale
    const resolvedLocale = normalizeLocale(locale);
    
    // Load messages according to the locale
    const defaultMessages = (await import("@/messages/en")).default;
    const localeMessages =
      resolvedLocale !== "en"
        ? (await import(`@/messages/${resolvedLocale}`)).default
        : defaultMessages;

    const messages = {
      ...defaultMessages,
      ...localeMessages,
    };

    // Email information
    const subject = isFromStaff
      ? `${messages.emails.ticketResponseNotification.newResponse}: #${ticketData.id.substring(0, 8)}`
      : `${messages.emails.ticketResponseNotification.userResponse}: #${ticketData.id.substring(0, 8)}`;

    // Email body
    const textBody = `
${messages.emails.ticketResponseNotification.ticketId}: ${ticketData.id.substring(0, 8)}
${messages.emails.ticketResponseNotification.responseMessage}:

${responseData.message}

${responseData.hasImages ? messages.emails.ticketResponseNotification.attachmentsIncluded : ""}

${messages.emails.ticketResponseNotification.viewTicket}: ${process.env.NEXT_PUBLIC_SITE_URL}/tickets/${ticketData.id}
    `;

    // Import component for ticket response notification email
    const TicketResponseNotificationEmail = (
      await import("@/components/emails/TicketResponseNotificationEmail")
    ).default;

    // Generate email HTML using React
    const emailHtml = await renderAsync(
      TicketResponseNotificationEmail({
        messages: messages.emails.ticketResponseNotification,
        ticketData,
        responseData,
        isFromStaff,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
      })
    );

    // Send email
    const info = await transporter.sendMail({
      from: '"Motionext Support" <info@motionext.app>',
      to: email,
      subject,
      text: textBody,
      html: emailHtml,
    });

    return info;
  } catch (error) {
    console.error("Error sending ticket response notification email:", error);
    throw error;
  }
}

/**
 * The function `sendTicketResponseNotificationToStaff` sends an email notification to staff members
 * regarding a ticket response, including relevant ticket and response information.
 * @param ticketData - The `ticketData` parameter in the `sendTicketResponseNotificationToStaff`
 * function contains the following information about the ticket:
 * @param responseData - The `responseData` parameter in the `sendTicketResponseNotificationToStaff`
 * function contains the following properties:
 * @param {string} [locale=en] - The `locale` parameter in the `sendTicketResponseNotificationToStaff`
 * function is used to determine the language/locale for the email messages. It has a default value of
 * "en" (English) but can be overridden to support different languages. The function loads messages
 * based on the specified locale to customize
 * @returns The function `sendTicketResponseNotificationToStaff` is returning the information object
 * `info` after sending the email notification to the support staff. This information object contains
 * details about the email sent, such as the sender, recipient, subject, text body, and HTML content.
 */
export async function sendTicketResponseNotificationToStaff(
  ticketData: {
    id: string;
    subject: string;
    email: string;
  },
  responseData: {
    message: string;
    hasImages: boolean;
  },
  locale: string = "en"
) {
  try {
    // Normalize the locale
    const resolvedLocale = normalizeLocale(locale);
    
    // Load messages according to the locale
    const defaultMessages = (await import("@/messages/en")).default;
    const localeMessages =
      resolvedLocale !== "en"
        ? (await import(`@/messages/${resolvedLocale}`)).default
        : defaultMessages;

    const messages = {
      ...defaultMessages,
      ...localeMessages,
    };

    // Email information
    const subject = `${messages.emails.ticketResponseNotification.userResponse}: #${ticketData.id.substring(0, 8)}`;

    // Email body
    const textBody = `
${messages.emails.ticketResponseNotification.ticketId}: ${ticketData.id.substring(0, 8)}
${messages.emails.ticketResponseNotification.customerEmail}: ${ticketData.email}
${messages.emails.ticketResponseNotification.responseMessage}:

${responseData.message}

${responseData.hasImages ? messages.emails.ticketResponseNotification.attachmentsIncluded : ""}

${messages.emails.ticketResponseNotification.viewTicket}: ${process.env.NEXT_PUBLIC_SITE_URL}/tickets/${ticketData.id}
    `;

    // Import component for ticket response notification email
    const TicketResponseNotificationEmail = (
      await import("@/components/emails/TicketResponseNotificationEmail")
    ).default;

    // Generate email HTML using React
    const emailHtml = await renderAsync(
      TicketResponseNotificationEmail({
        messages: messages.emails.ticketResponseNotification,
        ticketData,
        responseData,
        customerEmail: ticketData.email,
        isFromStaff: false,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
      })
    );

    // Send email to support address
    const info = await transporter.sendMail({
      from: '"Motionext Support" <info@motionext.app>',
      to: process.env.SUPPORT_EMAIL || "",
      subject,
      text: textBody,
      html: emailHtml,
    });

    return info;
  } catch (error) {
    console.error(
      "Error sending ticket response notification email to staff:",
      error
    );
    throw error;
  }
}

/**
 * The function `sendTicketStatusNotificationEmail` sends an email notification when a ticket status changes,
 * with dynamic content based on the provided locale and status information.
 */
export async function sendTicketStatusNotificationEmail({
  ticketData,
  statusLabel,
  email,
  locale = "en",
}: {
  ticketData: {
    id: string;
    subject: string;
    status: string;
  };
  statusLabel: string;
  email: string;
  locale?: string;
}) {
  try {
    // Normalize the locale
    const resolvedLocale = normalizeLocale(locale);
    
    // Importar dinamicamente as mensagens baseadas no idioma
    const defaultMessages = (await import("@/messages/en")).default;
    const localeMessages =
      resolvedLocale !== "en"
        ? (await import(`@/messages/${resolvedLocale}`)).default
        : defaultMessages;

    const messages = {
      ...defaultMessages,
      ...localeMessages,
    };

    const emailMessages = messages.emails.ticketStatusNotification;
    const statusLabels = messages.tickets.ticketStatuses;

    // Import dynamically the component
    const TicketStatusNotificationEmail = (
      await import("@/components/emails/TicketStatusNotificationEmail")
    ).default;

    // Enhanced subject with status information
    const subject = `${emailMessages.subject}: ${statusLabel} - #${ticketData.id.substring(0, 8)}`;

    // Generate email HTML using React
    const emailHtml = await renderAsync(
      TicketStatusNotificationEmail({
        messages: emailMessages,
        ticketData,
        statusLabels,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
      })
    );

    // Email body in text format
    const textBody = `
${emailMessages.subject}

${emailMessages.greeting}

${emailMessages.statusUpdated}
${ticketData.status === "resolved" ? "\n" + emailMessages.resolvedMessage : ""}
${ticketData.status === "closed" ? "\n" + emailMessages.closedMessage : ""}

Ticket ID: ${ticketData.id}
Subject: ${ticketData.subject}
Status: ${statusLabel}

${emailMessages.nextSteps}

${emailMessages.viewTicket}: ${process.env.NEXT_PUBLIC_SITE_URL}/tickets/${ticketData.id}

${emailMessages.thankyou},
${emailMessages.team}
    `;

    // Send email
    const info = await transporter.sendMail({
      from: '"Motionext Support" <info@motionext.app>',
      to: email,
      subject,
      text: textBody,
      html: emailHtml,
    });

    return { success: true, info };
  } catch (error) {
    console.error("Error sending ticket status notification:", error);
    return { success: false, error };
  }
}

/**
 * A função `sendPasswordResetSuccessEmail` envia um email de notificação quando uma senha é redefinida com sucesso,
 * com conteúdo dinâmico baseado no idioma fornecido.
 */
export async function sendPasswordResetSuccessEmail({
  email,
  locale = "en",
}: {
  email: string;
  locale?: string;
}) {
  try {
    // Normalize the locale
    const resolvedLocale = normalizeLocale(locale);
    
    // Importar dinamicamente as mensagens baseadas no idioma
    const defaultMessages = (await import("@/messages/en")).default;
    const localeMessages =
      resolvedLocale !== "en"
        ? (await import(`@/messages/${resolvedLocale}`)).default
        : defaultMessages;

    const messages = {
      ...defaultMessages,
      ...localeMessages,
    };

    const emailMessages = messages.emails.passwordReset;

    // Importar dinamicamente o componente
    const PasswordResetSuccessEmail = (
      await import("@/components/emails/PasswordResetSuccessEmail")
    ).default;

    // Gerar o HTML do email usando React
    const emailHtml = await renderAsync(
      PasswordResetSuccessEmail({
        messages: emailMessages,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
      })
    );

    // Corpo do email em formato texto
    const textBody = `
${emailMessages.subject}

${emailMessages.greeting}

${emailMessages.message}

${emailMessages.securityNotice}

${emailMessages.loginButtonText}: ${process.env.NEXT_PUBLIC_SITE_URL}/auth/signin

${emailMessages.thankyou},
${emailMessages.team}
    `;

    // Enviar email
    const info = await transporter.sendMail({
      from: '"Motionext Security" <security@motionext.app>',
      to: email,
      subject: emailMessages.subject,
      text: textBody,
      html: emailHtml,
    });

    return { success: true, info };
  } catch (error) {
    console.error("Error sending password reset success notification:", error);
    return { success: false, error };
  }
}
