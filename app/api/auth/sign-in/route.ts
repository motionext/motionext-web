import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * The `POST` function is a Next.js route handler that handles the sign-in process.
 *
 * @param {Request} request - The request object.
 * @returns The response from the sign-in process.
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      user: data.user,
      session: data.session
    });
  } catch {
    return NextResponse.json(
      { error: "Error processing login" },
      { status: 500 }
    );
  }
} 