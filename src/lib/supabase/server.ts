import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Creates an authenticated Supabase server client inside Server Components,
 * Server Actions, or Route Handlers. Compatible with Next.js 15+ async cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co").trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key").trim();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
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
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
