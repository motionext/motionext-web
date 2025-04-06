import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18nConfig, type Locale } from "@/messages/i18n-config";
import { createClient } from "@/lib/supabase/server";

/**
 * The middleware function checks for missing locale in the URL path, handles user authentication using
 * Supabase, and redirects to the preferred locale based on cookies or accept-language header if necessary.
 * @param {NextRequest} request - The `request` parameter in the `middleware` function is an object of
 * type `NextRequest`. It contains information about the incoming request, such as the URL, headers,
 * and other request details. In the provided code snippet, the `middleware` function is checking if
 * the pathname is missing a locale
 * @returns The middleware function returns a NextResponse object with a redirect to the preferred
 * locale if the pathname is missing a locale, or it returns a NextResponse object with the "next"
 * action if the pathname already includes a locale.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18nConfig.locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Create a Supabase client configured to use cookies
  const supabase = await createClient();

  // Check user authentication in a secure way
  await supabase.auth.getUser();

  if (pathnameIsMissingLocale) {
    // Check if the cookie NEXT_LOCALE exists
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

    // Check if the cookie locale is valid
    const isValidLocale =
      cookieLocale && i18nConfig.locales.includes(cookieLocale as Locale);

    // Priority: 1. Valid cookie, 2. Accept-Language, 3. Default locale
    const preferredLocale = isValidLocale
      ? cookieLocale
      : request.headers.get("accept-language")?.split(",")[0].split("-")[0] ||
        i18nConfig.defaultLocale;

    return NextResponse.redirect(
      new URL(
        `/${preferredLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

/* This `export const config` object is defining a configuration for the middleware function in the
provided TypeScript code snippet. */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|legal|favicon.ico|.*\\..*|_vercel|[0-9a-f]{32}).*)",
  ],
};
