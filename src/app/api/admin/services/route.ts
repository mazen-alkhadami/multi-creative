import { NextResponse } from "next/server";
import { getCurrentAdminProfile } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const auth = await getCurrentAdminProfile();
    if (!auth.user || !auth.profile || auth.profile.is_active === false) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active team membership required" },
        { status: 401 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Fetch all services ordered by sort_order with linked projects count
    const { data: services, error } = await supabaseAdmin
      .from("services")
      .select(`
        *,
        project_services (
          id
        )
      `)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[api/admin/services] Fetch error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    interface ServiceWithProjectsCount {
      project_services?: Array<{ id: string }> | null;
      [key: string]: unknown;
    }

    const formatted = ((services || []) as ServiceWithProjectsCount[]).map((s) => {
      const { project_services, ...rest } = s;
      return {
        ...rest,
        projects_count: Array.isArray(project_services) ? project_services.length : 0,
      };
    });

    return NextResponse.json({
      success: true,
      services: formatted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading services";
    console.error("[api/admin/services] GET exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
