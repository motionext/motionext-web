import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetSuccessEmail } from "@/lib/email-smtp";
import { normalizeLocale } from "@/lib/normalize-locale";

/**
 * The `POST` function is a Next.js route handler that processes the sending of an email after a successful password reset.
 *
 * @param {NextRequest} request - The request object.
 * @returns The response from the email sending process.
 */
export async function POST(request: NextRequest) {
  try {
    // Get the parameters from the request body
    const { email, locale } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Normalize the locale
    const targetLocale = normalizeLocale(locale);

    // Enviar o email de confirmação de redefinição de senha
    const { success, error } = await sendPasswordResetSuccessEmail({
      email,
      locale: targetLocale,
    });

    if (!success) {
      console.error("Error sending password reset success email:", error);
      // Do not fail completely if the email cannot be sent
      return NextResponse.json(
        {
          success: true,
          emailSent: false,
          message: "Password reset completed, but notification email could not be sent.",
        }
      );
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      message: "Password reset success email sent.",
    });
  } catch (error) {
    console.error("Error processing password reset success notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 