import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "editor";
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CurrentAdminResult {
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  } | null;
  profile: AdminProfile | null;
  error?: string;
}

export interface RequireAdminResult extends CurrentAdminResult {
  authorized: boolean;
  status: number;
}

/**
 * Retrieves the currently logged-in user and their corresponding profile record.
 * Executes strictly on the server using Server Components / Server Actions / Route Handlers.
 */
export async function getCurrentAdminProfile(): Promise<CurrentAdminResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      if (userError) {
        console.error("[adminAuth] Auth session retrieval error:", userError.message);
      }
      return { user: null, profile: null, error: userError?.message || "Not authenticated" };
    }

    // Attempt 1: Fetch profile via server client (user context)
    let fetchedProfile: AdminProfile | null = null;
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, is_active, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("[adminAuth] Error querying profiles via session client:", profileError.message);
    } else if (userProfile) {
      fetchedProfile = userProfile as AdminProfile;
    }

    // Attempt 2: If profile was not resolved (e.g. RLS denial or delay), query via AdminClient with Service Role
    if (!fetchedProfile) {
      try {
        const adminClient = createAdminClient();
        const { data: adminProfile, error: adminErr } = await adminClient
          .from("profiles")
          .select("id, email, full_name, role, is_active, created_at, updated_at")
          .eq("id", user.id)
          .maybeSingle();

        if (adminErr) {
          console.error("[adminAuth] AdminClient service-role query error:", adminErr.message);
        } else if (adminProfile) {
          fetchedProfile = adminProfile as AdminProfile;
        }
      } catch (adminClientEx) {
        console.error("[adminAuth] Exception during AdminClient fallback:", adminClientEx);
      }
    }

    // Attempt 3: If no row exists in profiles yet, fallback to user_metadata
    if (!fetchedProfile) {
      const metaRole = (user.user_metadata?.role as "admin" | "editor") || "editor";
      console.warn(
        `[adminAuth] No profile record found for user ${user.id}. Falling back to metadata: role=${metaRole}`
      );
      fetchedProfile = {
        id: user.id,
        email: user.email || "",
        full_name: (user.user_metadata?.full_name as string) || null,
        role: metaRole,
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }

    return { user, profile: fetchedProfile };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load admin profile";
    console.error("[adminAuth] Uncaught exception:", err);
    return { user: null, profile: null, error: message };
  }
}

/**
 * Strictly verifies that the current requester is an active administrator.
 * Returns an authorization outcome with status code suitable for API routes.
 */
export async function requireAdmin(): Promise<RequireAdminResult> {
  const { user, profile } = await getCurrentAdminProfile();

  if (!user) {
    console.error("[requireAdmin] Verification failed: No active user session");
    return {
      authorized: false,
      user: null,
      profile: null,
      error: "Unauthorized: Active session required",
      status: 401,
    };
  }

  if (!profile || profile.is_active === false) {
    console.error(`[requireAdmin] Verification failed for user ${user.id}: Account deactivated or profile missing`);
    return {
      authorized: false,
      user,
      profile,
      error: "Forbidden: Account is inactive or deactivated",
      status: 403,
    };
  }

  if (profile.role !== "admin") {
    console.error(`[requireAdmin] Verification failed for user ${user.id}: Role is '${profile.role}', requires 'admin'`);
    return {
      authorized: false,
      user,
      profile,
      error: "Forbidden: Administrator privileges required",
      status: 403,
    };
  }

  return {
    authorized: true,
    user,
    profile,
    status: 200,
  };
}
