import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * The `POST` function is a Next.js route handler that handles the Google authentication process.
 *
 * @param {Request} request - The request object.
 * @returns The response from the Google authentication process.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `https://www.motionext.app/api/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ url: data.url });
  } catch {
    return NextResponse.json(
      { error: "Error processing Google authentication" },
      { status: 500 },
    );
  }
}
