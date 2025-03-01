import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { i18nConfig } from "@/messages/i18n-config";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const redirectUrl = requestUrl.searchParams.get("redirectUrl");
  const locale =
    requestUrl.searchParams.get("locale") || i18nConfig.defaultLocale;

  if (!tokenHash || type !== "email") {
    return NextResponse.redirect(
      new URL(`/${locale}/auth/confirmation?success=false`, requestUrl.origin)
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });

    if (error) {
      console.error("Error verifying OTP:", error);
      return NextResponse.redirect(
        new URL(`/${locale}/auth/confirmation?success=false`, requestUrl.origin)
      );
    }

    // If there is a redirectUrl, use that, otherwise use the default confirmation page
    const successRedirectUrl =
      redirectUrl || `/${locale}/auth/confirmation?success=true`;
    return NextResponse.redirect(
      new URL(successRedirectUrl, requestUrl.origin)
    );
  } catch (error) {
    console.error("Error on email confirmation:", error);
    return NextResponse.redirect(
      new URL(`/${locale}/auth/confirmation?success=false`, requestUrl.origin)
    );
  }
}
