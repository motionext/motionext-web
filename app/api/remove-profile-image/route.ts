import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * The `POST` function is a Next.js route handler that handles the removal of a profile image.
 *
 * @param {NextRequest} request - The request object.
 * @returns The response from the removal of a profile image.
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the file name from the request
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 },
      );
    }

    // Remove the image from the bucket
    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([filename]);

    if (deleteError) {
      console.error("Error deleting image:", deleteError);
      return NextResponse.json(
        { error: "Error deleting image" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image successfully removed",
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
