import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface SupabaseError {
  message: string;
  status?: number;
}

export async function POST(request: Request) {
  try {
    // Validate request content type
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { error: "INVALID_CONTENT_TYPE" },
        { status: 400 }
      );
    }

    const { password, access_token, refresh_token } = await request.json();

    // Validate password and token
    if (
      !password ||
      typeof password !== "string" ||
      !access_token ||
      typeof access_token !== "string" ||
      !refresh_token ||
      typeof refresh_token !== "string"
    ) {
      return NextResponse.json({ error: "INVALID_DATA" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "PASSWORD_TOO_SHORT" },
        { status: 400 }
      );
    }

    // Create Supabase client and set cookies
    const supabase = await createClient();

    try {
      // Set session with token
      await supabase.auth.setSession({
        access_token: access_token,
        refresh_token: refresh_token,
      });

      // Update password with a 10s timeout
      const updatePromise = supabase.auth.updateUser({ password });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 10000)
      );

      const { error } = (await Promise.race([
        updatePromise,
        timeoutPromise,
      ])) as { error: SupabaseError | null };

      if (error) {
        // Log error without exposing sensitive details
        console.error("Password reset error code:", error.status);

        // Map error messages for translation
        const errorMessages: Record<string, { code: string; status: number }> = {
          AuthWeakPasswordError: { code: "PASSWORD_TOO_WEAK", status: 400 },
          token: { code: "EXPIRED_LINK", status: 401 },
          "Auth session missing": { code: "SESSION_EXPIRED", status: 401 },
          "should be different": { code: "PASSWORD_IN_USE", status: 400 },
          "Rate limit exceeded": { code: "TOO_MANY_ATTEMPTS", status: 429 },
        };

        // Find appropriate error code
        const errorType = Object.keys(errorMessages).find((key) =>
          error.message.toLowerCase().includes(key.toLowerCase())
        );

        if (errorType) {
          const { code, status } = errorMessages[errorType];
          return NextResponse.json(
            { error: code }, 
            { 
              status,
              headers: {
                'Retry-After': '10',
                'Content-Type': 'application/json',
              }
            }
          );
        }

        throw error;
      }

      // Clear session after success
      await supabase.auth.signOut();

      return NextResponse.json(
        { success: true },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            Pragma: "no-cache",
          },
        }
      );
    } catch (error) {
      // Force logout on error
      await supabase.auth.signOut();
      throw error;
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "UNEXPECTED_ERROR" }, { status: 500 });
  }
}

// Limit allowed HTTP methods
export const runtime = "edge";
export const dynamic = "force-dynamic";
