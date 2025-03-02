import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { i18nConfig } from "@/messages/i18n-config";

export async function GET(request: NextRequest) {
  try {
    // Get the parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    // Get locale from URL params or headers, fallback to default
    const locale =
      searchParams.get("locale") ||
      request.headers.get("accept-language")?.split(",")[0].split("-")[0] ||
      i18nConfig.defaultLocale;

    // Check if all required parameters are present
    if (!tokenHash || !type || type !== "email") {
      console.warn("Invalid or missing parameters:", {
        tokenHash: !!tokenHash,
        type,
      });
      return NextResponse.redirect(
        new URL(
          `/${locale}/auth/error?error=invalid_parameters`,
          request.nextUrl.origin
        )
      );
    }

    // Create the Supabase client
    const supabase = await createClient();

    try {
      // Verify the password reset token and create a session
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "email",
      });

      // If there is an error in the token verification
      if (error) {
        console.error("Error verifying token:", error.message, error);
        return NextResponse.redirect(
          new URL(
            `/${locale}/auth/error?error=invalid_token`,
            request.nextUrl.origin
          )
        );
      }

      const resetPasswordUrl = new URL(
        `/${locale}/auth/reset-password`,
        request.nextUrl.origin
      );

      // We don't need to pass the token as a parameter because
      // we already have an authenticated session in the cookies
      return NextResponse.redirect(resetPasswordUrl.toString());
    } catch (error) {
      // Add more information to the error redirection
      const errorUrl = new URL(
        `/${locale}/auth/error?error=unexpected_error&code=${encodeURIComponent(
          (error instanceof Error ? error.name : "unknown")
        )}`,
        request.nextUrl.origin
      );
      return NextResponse.redirect(errorUrl);
    }
  } catch {
    return NextResponse.redirect(
      new URL(`/en/auth/error?error=critical_error`, request.nextUrl.origin)
    );
  }
}

export const runtime = "edge";
export const dynamic = "force-dynamic";
