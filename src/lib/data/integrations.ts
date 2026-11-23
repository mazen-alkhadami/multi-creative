import { createClient as createBrowserClient } from "@/lib/supabase/client";

export interface DbIntegration {
  id: string;
  name: string;
  provider: string;
  code_type: string;
  code_content: string;
  placement: "head" | "body_start" | "body_end";
  target_pages: string[];
  is_active: boolean;
  is_approved: boolean;
  version: number;
}

/**
 * Fetches all active and administrator-approved tracking and script integrations.
 * Strictly filters out any integrations where is_active is false or is_approved is false.
 * Falls back to an empty array in offline / build / unauthenticated contexts.
 */
export async function getActiveIntegrations(): Promise<DbIntegration[]> {
  try {
    const supabase = createBrowserClient();

    const { data: rows, error } = await supabase
      .from("integrations")
      .select("id, name, provider, code_type, code_content, placement, target_pages, is_active, is_approved, version")
      .eq("is_active", true)
      .eq("is_approved", true);

    if (error) {
      console.warn("[getActiveIntegrations] Supabase query notice:", error.message);
      return [];
    }

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows as DbIntegration[];
  } catch (err) {
    console.warn("[getActiveIntegrations] Exception encountered, returning empty list:", err);
    return [];
  }
}
