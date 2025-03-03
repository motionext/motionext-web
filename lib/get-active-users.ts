import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Function to get the number of active users with cache
export const getActiveUsers = cache(async (): Promise<number> => {
  try {
    // Create Supabase client
    const supabase = await createClient();

    // Count the number of users in the 'users' table
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching active users:", error.message);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error fetching active users:", error);
    return 0;
  }
});
