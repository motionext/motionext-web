import { createBrowserClient } from "@supabase/ssr";

/**
 * The function `createClient` creates a client using the Supabase URL and anonymous key from
 * environment variables.
 * @returns A function named `createClient` is being returned. This function calls
 * `createBrowserClient` with the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 * environment variables as arguments.
 */
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
};
