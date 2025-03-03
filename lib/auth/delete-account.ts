import { i18nConfig } from "@/messages/i18n-config";
import { sendAccountDeletionEmail } from "@/lib/email";
import { createAdminClient, createClient } from "../supabase/server";

/**
 * Deletes a user account and all associated data
 * @param userId - The ID of the user to delete
 * @param locale - The locale for email notifications
 * @returns Object with success status and message
 */
export async function deleteUserAccount(userId: string, locale?: string) {
  // Get locale from params or fallback to default
  const targetLocale = locale || i18nConfig.defaultLocale;

  try {
    // Verify authentication with normal client
    const supabase = await createClient();

    // 1. Delete profile images from storage
    try {
      // Identify profile image to delete
      const { data: userData } = await supabase
        .from("users")
        .select("profile_image, email")
        .eq("id", userId)
        .single();

      if (userData?.email) {
        // Send email directly using the sendAccountDeletionEmail function
        await sendAccountDeletionEmail(userData.email, targetLocale).catch(
          console.error
        ); // Non-blocking email send
      }

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
      supabase.from("users").delete().eq("id", userId),
    ]);

    // 3. Delete authentication account
    const adminClient = await createAdminClient();
    const { error: deleteError } =
      await adminClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      throw deleteError;
    }

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting account:", error);
    throw new Error("Error deleting account");
  }
}
