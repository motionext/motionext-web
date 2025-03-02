import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    // Verify authentication with normal client
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Delete profile images from storage
    try {
      // Identify profile image to delete
      const { data: userData } = await supabase
        .from("users")
        .select("profile_image")
        .eq("id", user.id)
        .single();

      if (userData?.profile_image) {
        try {
          // Extract the file name from the URL
          const url = new URL(userData.profile_image);
          const pathname = url.pathname;
          // The typical format is /storage/v1/object/public/avatars/filename
          const segments = pathname.split("/");
          const filename = segments[segments.length - 1];

          if (filename) {
            await supabase.storage.from("avatars").remove([filename]);
          }
        } catch (e) {
          console.error("Error deleting profile image:", e);
          // Continue even with error
        }
      }
    } catch (e) {
      console.error("Error processing user resources:", e);
      // Continue even with error
    }

    // 2. Delete database data
    // RLS policies should ensure only the user's data is deleted
    await Promise.all([
      // Delete the user profile
      supabase.from("users").delete().eq("id", user.id),
    ]);

    // 3. Delete authentication account
    const adminClient = await createAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Error deleting account" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
export const dynamic = "force-dynamic";
