import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentAdminProfile } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getCurrentAdminProfile();
    if (!auth.user || !auth.profile || auth.profile.is_active === false) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active team membership required" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const supabaseAdmin = createAdminClient();

    // Query service with linked projects via project_services
    // Support matching by UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabaseAdmin
      .from("services")
      .select(`
        *,
        project_services (
          is_primary,
          projects (
            id,
            slug,
            number,
            title_ar,
            title_en,
            cover_image,
            status,
            is_concept,
            year
          )
        )
      `);

    if (isUuid) {
      query = query.eq("id", id);
    } else {
      query = query.eq("slug", id);
    }

    const { data: service, error } = await query.maybeSingle();

    if (error) {
      console.error("[api/admin/services/[id]] Fetch error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    if (!service) {
      return NextResponse.json(
        { success: false, error: "الخدمة غير موجودة / Service not found" },
        { status: 404 }
      );
    }

    // Format linked projects
    interface ProjectServiceJoinItem {
      is_primary?: boolean | null;
      projects?: Record<string, unknown> | null;
    }

    const linkedProjects = ((service.project_services || []) as ProjectServiceJoinItem[])
      .map((ps) => {
        if (!ps.projects) return null;
        return {
          ...ps.projects,
          is_primary: Boolean(ps.is_primary),
        };
      })
      .filter(Boolean);

    const cleanService = { ...service };
    delete (cleanService as Record<string, unknown>).project_services;

    return NextResponse.json({
      success: true,
      service: {
        ...cleanService,
        projects: linkedProjects,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading service";
    console.error("[api/admin/services/[id]] GET exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getCurrentAdminProfile();
    if (!auth.user || !auth.profile || auth.profile.is_active === false) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active team membership required" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;

    const {
      title_ar,
      title_en,
      tagline_ar,
      tagline_en,
      short_description_ar,
      short_description_en,
      overview_ar,
      overview_en,
      key_metrics,
      deliverables,
      process,
      tech_stack,
      gallery,
      is_visible,
      sort_order,
    } = body || {};

    const supabaseAdmin = createAdminClient();

    // Prepare update payload (STRICT CONSTRAINT: slug is immutable)
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (title_ar !== undefined && typeof title_ar === "string") updates.title_ar = title_ar.trim();
    if (title_en !== undefined && typeof title_en === "string") updates.title_en = title_en.trim();
    if (tagline_ar !== undefined) updates.tagline_ar = typeof tagline_ar === "string" ? tagline_ar.trim() : null;
    if (tagline_en !== undefined) updates.tagline_en = typeof tagline_en === "string" ? tagline_en.trim() : null;
    if (short_description_ar !== undefined && typeof short_description_ar === "string") {
      updates.short_description_ar = short_description_ar.trim();
    }
    if (short_description_en !== undefined && typeof short_description_en === "string") {
      updates.short_description_en = short_description_en.trim();
    }
    if (overview_ar !== undefined && typeof overview_ar === "string") {
      updates.overview_ar = overview_ar.trim();
    }
    if (overview_en !== undefined && typeof overview_en === "string") {
      updates.overview_en = overview_en.trim();
    }
    if (Array.isArray(key_metrics)) updates.key_metrics = key_metrics;
    if (Array.isArray(deliverables)) updates.deliverables = deliverables;
    if (Array.isArray(process)) updates.process = process;
    if (Array.isArray(tech_stack)) updates.tech_stack = tech_stack;
    if (Array.isArray(gallery)) updates.gallery = gallery;
    if (typeof is_visible === "boolean") updates.is_visible = is_visible;
    if (typeof sort_order === "number") updates.sort_order = sort_order;

    // Check if ID is UUID or slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let updateQuery = supabaseAdmin.from("services").update(updates);

    if (isUuid) {
      updateQuery = updateQuery.eq("id", id);
    } else {
      updateQuery = updateQuery.eq("slug", id);
    }

    const { data: updatedService, error: updateError } = await updateQuery.select().single();

    if (updateError) {
      console.error("[api/admin/services/[id]] Update error:", updateError.message);
      return NextResponse.json({ success: false, error: updateError.message }, { status: 400 });
    }

    // Revalidate public routes
    try {
      revalidatePath("/services");
      revalidatePath("/");
      if (updatedService?.slug) {
        revalidatePath(`/services/${updatedService.slug}`);
      }
    } catch (revalErr) {
      console.warn("[api/admin/services/[id]] Revalidate warning:", revalErr);
    }

    return NextResponse.json({
      success: true,
      service: updatedService,
      message: "تم تحديث الخدمة بنجاح / Service updated successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating service";
    console.error("[api/admin/services/[id]] PATCH exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
