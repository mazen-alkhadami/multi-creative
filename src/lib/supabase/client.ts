import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for browser/client-side execution.
 * Utilizes public anon keys and leverages browser cookie storage.
 */
export function createClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co").trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key").trim();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
