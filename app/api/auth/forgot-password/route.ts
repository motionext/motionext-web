import { createClient } from "@/lib/supabase/server";
import { i18nConfig } from "@/messages/i18n-config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Register the start time
    const startTime = Date.now();

    const { email, locale } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const origin = request.headers.get("origin") || "https://www.motionext.app";

    // Get locale from URL params or headers, fallback to default
    const targetLocale =
      locale ||
      request.headers.get("accept-language")?.split(",")[0].split("-")[0] ||
      i18nConfig.defaultLocale;

    // Create URL with custom parameters
    const redirectUrl = `${origin}/${targetLocale}/auth/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    // Calculate the elapsed time
    const elapsedTime = Date.now() - startTime;
    const minimumTime = 2000; // 2 seconds in milliseconds

    // If the elapsed time is less than the minimum time, wait for the difference
    if (elapsedTime < minimumTime) {
      await new Promise((resolve) =>
        setTimeout(resolve, minimumTime - elapsedTime)
      );
    }

    if (error) {
      console.error("Reset password error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Password reset email sent successfully. Check your inbox.",
      redirectUrl, // Include in response for debugging
    });
  } catch (error) {
    console.error("Error processing password reset:", error);
    return NextResponse.json(
      { error: "Error processing password reset" },
      { status: 500 }
    );
  }
}
