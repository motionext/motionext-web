import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPasswordResetSuccessEmail } from "@/lib/email-smtp";
import { normalizeLocale } from "@/lib/normalize-locale";

/**
 * The `POST` function is a Next.js route handler that processes the updating of a password
 * and sends a confirmation email.
 *
 * @param {NextRequest} request - The request object.
 * @returns The response from the password updating process.
 */
export async function POST(request: NextRequest) {
  try {
    // Get the parameters from the request body
    const { password, locale } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    // Create the Supabase client
    const supabase = await createClient();

    // Check if the user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      let errorMessage = updateError.message;
      let statusCode = 400;

      if (updateError.message.includes("Auth session missing")) {
        errorMessage = "Session expired";
        statusCode = 401;
      } else if (updateError.message.includes("should be different")) {
        errorMessage = "Password already in use";
      } else if (updateError.message.includes("Rate limit")) {
        errorMessage = "Too many attempts";
        statusCode = 429;
      }

      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }

    // Determine the language to use
    const targetLocale = normalizeLocale(locale);

    // Send the password reset confirmation email
    try {
      await sendPasswordResetSuccessEmail({
        email: user.email!,
        locale: targetLocale,
      });
    } catch (emailError) {
      console.error(
        "Error sending password reset confirmation email:",
        emailError,
      );
      // Do not fail completely if the email cannot be sent
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
