import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * The `GET` function is a Next.js route handler that handles the OAuth callback process.
 * It processes Google authentication responses and extracts user information.
 *
 * @param {Request} request - The request object.
 * @returns Redirect to the home page after authentication.
 */
export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    
    if (!code) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    const supabase = await createClient();
    
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    
    // For Google auth, extract name from user metadata and update profile if needed
    if (data.user?.app_metadata?.provider === "google") {
      const fullName = data.user.user_metadata?.full_name || "";
      const nameParts = fullName.split(" ");
      
      // Only update if first_name and last_name are not already set
      if (!data.user.user_metadata?.first_name || !data.user.user_metadata?.last_name) {
        let firstName = "";
        let lastName = "";
        
        if (nameParts.length >= 2) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(" ");
        } else if (nameParts.length === 1) {
          firstName = nameParts[0];
          lastName = "";
        }
        
        // Update user profile with extracted name
        await supabase.auth.updateUser({
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        });
      }
    }
    
    // Redirect to home page after successful authentication
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}
