import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * The function `createClient` asynchronously creates a client using Supabase URL and anonymous key
 * with cookie handling.
 * @returns The `createClient` function is returning a server client created using the
 * `createServerClient` function. The server client is configured with the Supabase URL and Supabase
 * anonymous key obtained from environment variables. Additionally, the server client is configured to
 * use a cookie store for managing cookies, with methods for getting all cookies and setting multiple
 * cookies at once.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * The `createAdminClient` function creates a client for accessing a server using Supabase with cookie
 * handling.
 * @returns The `createAdminClient` function is returning a server client created using the
 * `createServerClient` function. The server client is configured with the Supabase URL from the
 * `NEXT_PUBLIC_SUPABASE_URL` environment variable, the Supabase service role key from the
 * `SUPABASE_SERVICE_ROLE_KEY` environment variable, and a cookies object with `getAll` and `setAll`
 * methods
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
