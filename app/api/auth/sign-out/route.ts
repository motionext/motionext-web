import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * The `POST` function is a Next.js route handler that handles the sign-out process.
 *
 * @param {Request} request - The request object.
 * @returns The response from the sign-out process.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Logout successful" });
  } catch {
    return NextResponse.json(
      { error: "Error processing logout" },
      { status: 500 },
    );
  }
}
