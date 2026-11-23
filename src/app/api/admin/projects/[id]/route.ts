import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentAdminProfile, requireAdmin } from "@/lib/auth/adminAuth";
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

    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .select(`
        *,
        project_services (
          is_primary,
          service_id,
          services (
            id,
            slug,
            title_ar,
            title_en
          )
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    if (!project) {
      return NextResponse.json({ success: false, error: "المشروع غير موجود / Project not found" }, { status: 404 });
    }

    const projectData = project as Record<string, unknown>;
    const rawServices = (projectData.project_services || []) as Array<{
      is_primary: boolean;
      services: { id: string; slug: string; title_ar: string; title_en: string } | null;
    }>;

    const services = rawServices
      .map((ps) => {
        if (!ps.services) return null;
        return {
          id: ps.services.id,
          slug: ps.services.slug,
          title_ar: ps.services.title_ar,
          title_en: ps.services.title_en,
          is_primary: Boolean(ps.is_primary),
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      project: {
        ...projectData,
        services,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading project";
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
    const body = await request.json();

    const {
      title_ar,
      title_en,
      slug,
      number,
      summary_ar,
      summary_en,
      description_ar,
      description_en,
      challenge_ar,
      challenge_en,
      solution_ar,
      solution_en,
      result_ar,
      result_en,
      deliverables,
      tools,
      cover_image,
      coverImage,
      gallery,
      preview_url,
      status,
      is_concept,
      year,
      primary_service_id,
      additional_service_ids,
    } = (body || {}) as Record<string, unknown>;

    const supabaseAdmin = createAdminClient();

    // Prepare update payload
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (title_ar !== undefined && typeof title_ar === "string") updates.title_ar = title_ar.trim();
    if (title_en !== undefined && typeof title_en === "string") updates.title_en = title_en.trim();
    if (slug !== undefined && typeof slug === "string") {
      updates.slug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (number !== undefined) updates.number = String(number).padStart(2, "0");
    if (summary_ar !== undefined && typeof summary_ar === "string") updates.summary_ar = summary_ar.trim();
    if (summary_en !== undefined && typeof summary_en === "string") updates.summary_en = summary_en.trim();
    if (description_ar !== undefined) updates.description_ar = typeof description_ar === "string" ? description_ar.trim() : null;
    if (description_en !== undefined) updates.description_en = typeof description_en === "string" ? description_en.trim() : null;
    if (challenge_ar !== undefined) updates.challenge_ar = typeof challenge_ar === "string" ? challenge_ar.trim() : null;
    if (challenge_en !== undefined) updates.challenge_en = typeof challenge_en === "string" ? challenge_en.trim() : null;
    if (solution_ar !== undefined) updates.solution_ar = typeof solution_ar === "string" ? solution_ar.trim() : null;
    if (solution_en !== undefined) updates.solution_en = typeof solution_en === "string" ? solution_en.trim() : null;
    if (result_ar !== undefined) updates.result_ar = typeof result_ar === "string" ? result_ar.trim() : null;
    if (result_en !== undefined) updates.result_en = typeof result_en === "string" ? result_en.trim() : null;
    if (Array.isArray(deliverables)) updates.deliverables = deliverables;
    if (Array.isArray(tools)) updates.tools = tools;

    // Cover image: accepts either cover_image or coverImage
    const targetCoverImage = cover_image !== undefined ? cover_image : coverImage;
    if (targetCoverImage !== undefined && typeof targetCoverImage === "string" && targetCoverImage.trim()) {
      updates.cover_image = targetCoverImage.trim();
    }

    if (Array.isArray(gallery)) updates.gallery = gallery;
    if (preview_url !== undefined) updates.preview_url = typeof preview_url === "string" ? preview_url.trim() : null;
    if (status !== undefined && typeof status === "string" && ["draft", "published", "hidden"].includes(status)) {
      updates.status = status;
    }
    if (typeof is_concept === "boolean") updates.is_concept = is_concept;
    if (year !== undefined) updates.year = String(year).trim();

    // Update project row
    const { data: updatedProject, error: updateError } = await supabaseAdmin
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[api/admin/projects/[id]] Update error:", updateError.message);
      return NextResponse.json({ success: false, error: updateError.message }, { status: 400 });
    }

    // Update linked services if provided
    if (primary_service_id) {
      // Remove previous links
      await supabaseAdmin.from("project_services").delete().eq("project_id", id);

      const serviceLinks = [
        {
          project_id: id,
          service_id: primary_service_id,
          is_primary: true,
        },
      ];

      if (Array.isArray(additional_service_ids)) {
        for (const sId of additional_service_ids) {
          if (sId && sId !== primary_service_id) {
            serviceLinks.push({
              project_id: id,
              service_id: sId,
              is_primary: false,
            });
          }
        }
      }

      await supabaseAdmin.from("project_services").insert(serviceLinks);
    }

    // Revalidate public routes so cached pages immediately reflect the updated project & images
    try {
      revalidatePath("/portfolio");
      revalidatePath("/");
      if (updatedProject?.slug) {
        revalidatePath(`/portfolio/${updatedProject.slug}`);
      }
    } catch (revalErr) {
      console.warn("[api/admin/projects/[id]] Revalidate warning:", revalErr);
    }

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: "تم تحديث المشروع بنجاح / Project updated successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating project";
    console.error("[api/admin/projects/[id]] PATCH exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // STRICT REQUIREMENT: Only active Admins can delete projects
    const adminAuth = await requireAdmin();
    if (!adminAuth.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: "حذف المشاريع محصور بمدير النظام فقط / Project deletion is restricted to Administrators only",
        },
        { status: adminAuth.status || 403 }
      );
    }

    const { id } = await context.params;
    const supabaseAdmin = createAdminClient();

    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[api/admin/projects/[id]] Delete error:", deleteError.message);
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف المشروع نهائياً / Project deleted successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting project";
    console.error("[api/admin/projects/[id]] DELETE exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
