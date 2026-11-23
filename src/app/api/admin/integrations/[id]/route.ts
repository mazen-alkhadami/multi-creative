import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized || !auth.user || !auth.profile) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized: Administrator privileges required" },
        { status: auth.status }
      );
    }

    const { id } = await context.params;
    const supabaseAdmin = createAdminClient();

    // Query integration with complete audit version history
    const { data: integration, error } = await supabaseAdmin
      .from("integrations")
      .select(`
        *,
        integration_versions (
          id,
          version,
          code_content,
          placement,
          target_pages,
          changed_by,
          created_at,
          profiles:changed_by (
            full_name,
            email
          )
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[api/admin/integrations/[id]] GET error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    if (!integration) {
      return NextResponse.json(
        { success: false, error: "التكامل غير موجود / Integration not found" },
        { status: 404 }
      );
    }

    // Sort versions descending
    if (Array.isArray(integration.integration_versions)) {
      integration.integration_versions.sort(
        (a: { version: number }, b: { version: number }) => b.version - a.version
      );
    }

    return NextResponse.json({
      success: true,
      integration,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error fetching integration";
    console.error("[api/admin/integrations/[id]] GET exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized || !auth.user || !auth.profile) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized: Administrator privileges required" },
        { status: auth.status }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const supabaseAdmin = createAdminClient();

    // 1. Fetch current integration state
    const { data: current, error: fetchErr } = await supabaseAdmin
      .from("integrations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !current) {
      return NextResponse.json(
        { success: false, error: "التكامل غير موجود أو تعذر قراءته" },
        { status: 404 }
      );
    }

    const {
      name,
      provider,
      code_type,
      code_content,
      placement,
      target_pages,
      is_active,
      is_approved,
      ai_analysis,
    } = body || {};

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined && typeof name === "string") updates.name = name.trim();
    if (provider !== undefined && typeof provider === "string") updates.provider = provider.trim();
    if (code_type !== undefined && typeof code_type === "string") updates.code_type = code_type.trim();
    if (ai_analysis !== undefined && typeof ai_analysis === "object") updates.ai_analysis = ai_analysis;

    if (typeof is_active === "boolean") {
      updates.is_active = is_active;
    }

    if (typeof is_approved === "boolean") {
      updates.is_approved = is_approved;
      updates.approved_by = is_approved ? auth.user.id : null;
    }

    // Determine if content, placement or target_pages changed requiring an audit version increment
    let codeChanged = false;

    if (code_content !== undefined && typeof code_content === "string") {
      const trimmedCode = code_content.trim();
      if (trimmedCode !== current.code_content) {
        updates.code_content = trimmedCode;
        codeChanged = true;
      }
    }

    if (placement !== undefined && typeof placement === "string") {
      const validPlacements = ["head", "body_start", "body_end"];
      if (validPlacements.includes(placement) && placement !== current.placement) {
        updates.placement = placement;
        codeChanged = true;
      }
    }

    if (target_pages !== undefined && Array.isArray(target_pages)) {
      const currentJson = JSON.stringify(current.target_pages || []);
      const newJson = JSON.stringify(target_pages);
      if (currentJson !== newJson) {
        updates.target_pages = target_pages;
        codeChanged = true;
      }
    }

    let nextVersion = current.version || 1;
    if (codeChanged) {
      nextVersion += 1;
      updates.version = nextVersion;
    }

    // 2. Perform the update
    const { data: updatedIntegration, error: updateErr } = await supabaseAdmin
      .from("integrations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      console.error("[api/admin/integrations/[id]] Update error:", updateErr.message);
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 400 });
    }

    // 3. Record new version snapshot if code or placement changed
    if (codeChanged) {
      const { error: versionErr } = await supabaseAdmin
        .from("integration_versions")
        .insert({
          integration_id: id,
          version: nextVersion,
          code_content: updatedIntegration.code_content,
          placement: updatedIntegration.placement,
          target_pages: updatedIntegration.target_pages,
          changed_by: auth.user.id,
          created_at: new Date().toISOString(),
        });

      if (versionErr) {
        console.warn("[api/admin/integrations/[id]] Version snapshot error:", versionErr.message);
      }
    }

    // 4. Revalidate public layout cache
    try {
      revalidatePath("/", "layout");
    } catch (revalErr) {
      console.warn("[api/admin/integrations/[id]] Revalidate warning:", revalErr);
    }

    return NextResponse.json({
      success: true,
      integration: updatedIntegration,
      message: codeChanged
        ? `تم تحديث التكامل وحفظ الإصدار الجديد #${nextVersion}`
        : "تم تحديث التكامل بنجاح",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating integration";
    console.error("[api/admin/integrations/[id]] PATCH exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized || !auth.user || !auth.profile) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized: Administrator privileges required" },
        { status: auth.status }
      );
    }

    const { id } = await context.params;
    const supabaseAdmin = createAdminClient();

    const { error: deleteErr } = await supabaseAdmin
      .from("integrations")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      console.error("[api/admin/integrations/[id]] Delete error:", deleteErr.message);
      return NextResponse.json({ success: false, error: deleteErr.message }, { status: 400 });
    }

    // Revalidate public layout cache
    try {
      revalidatePath("/", "layout");
    } catch (revalErr) {
      console.warn("[api/admin/integrations/[id]] Revalidate warning:", revalErr);
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف التكامل وسجل إصداراته بنجاح",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting integration";
    console.error("[api/admin/integrations/[id]] DELETE exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
