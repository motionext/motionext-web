import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18nConfig } from "@/messages/i18n-config";
import { createClient } from "./lib/supabase/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18nConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Create a Supabase client configured to use cookies
  const supabase = await createClient();

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  if (pathnameIsMissingLocale) {
    const preferredLocale =
      request.headers.get("accept-language")?.split(",")[0].split("-")[0] ||
      i18nConfig.defaultLocale;

    return NextResponse.redirect(
      new URL(
        `/${preferredLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|legal|favicon.ico|.*\\..*|_vercel|[0-9a-f]{32}).*)",
  ],
};
