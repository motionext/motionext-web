import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * The `GET` function is a Next.js route handler that handles the callback from the authentication
 * provider.
 *
 * @param {Request} request - The request object.
 * @returns The response from the authentication provider.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(requestUrl.origin);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.json({ error: "Invalid code" }, { status: 400 });
}
