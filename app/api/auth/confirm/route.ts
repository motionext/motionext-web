import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { i18nConfig } from "@/messages/i18n-config";

/**
 * The `GET` function is a Next.js route handler that handles the confirmation of a user's email
 * address.
 *
 * @param {Request} request - The request object.
 * @returns The response from the confirmation process.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const locale =
    requestUrl.searchParams.get("locale") || i18nConfig.defaultLocale;

  if (!tokenHash || type !== "email") {
    return NextResponse.redirect(
      new URL(`/${locale}/auth/confirmation?success=false`, requestUrl.origin),
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/${locale}/auth/confirmation?success=false`,
          requestUrl.origin,
        ),
      );
    }

    return NextResponse.redirect(
      new URL(`/${locale}/auth/confirmation?success=true`, requestUrl.origin),
    );
  } catch {
    return NextResponse.redirect(
      new URL(`/${locale}/auth/confirmation?success=false`, requestUrl.origin),
    );
  }
}
