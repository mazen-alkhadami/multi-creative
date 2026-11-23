import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
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
    const { version_id } = body || {};

    if (!version_id) {
      return NextResponse.json(
        { success: false, error: "معرّف الإصدار المراد استعادته مطلوب" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch the target version to restore
    const { data: targetVersion, error: versionFetchErr } = await supabaseAdmin
      .from("integration_versions")
      .select("*")
      .eq("id", version_id)
      .eq("integration_id", id)
      .maybeSingle();

    if (versionFetchErr || !targetVersion) {
      return NextResponse.json(
        { success: false, error: "الإصدار المطلوب استعادته غير موجود" },
        { status: 404 }
      );
    }

    // 2. Fetch the current integration state
    const { data: current, error: currentErr } = await supabaseAdmin
      .from("integrations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (currentErr || !current) {
      return NextResponse.json(
        { success: false, error: "التكامل غير موجود" },
        { status: 404 }
      );
    }

    const nextVersion = (current.version || 1) + 1;

    // 3. Update integration with restored snapshot content
    const { data: updatedIntegration, error: updateErr } = await supabaseAdmin
      .from("integrations")
      .update({
        code_content: targetVersion.code_content,
        placement: targetVersion.placement,
        target_pages: targetVersion.target_pages,
        version: nextVersion,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      console.error("[api/admin/integrations/[id]/restore] Update error:", updateErr.message);
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 400 });
    }

    // 4. Save a new audit version reflecting the restoration
    await supabaseAdmin.from("integration_versions").insert({
      integration_id: id,
      version: nextVersion,
      code_content: targetVersion.code_content,
      placement: targetVersion.placement,
      target_pages: targetVersion.target_pages,
      changed_by: auth.user.id,
      created_at: new Date().toISOString(),
    });

    // 5. Revalidate public layout cache
    try {
      revalidatePath("/", "layout");
    } catch (revalErr) {
      console.warn("[api/admin/integrations/[id]/restore] Revalidate warning:", revalErr);
    }

    return NextResponse.json({
      success: true,
      integration: updatedIntegration,
      message: `تم استعادة الإصدار #${targetVersion.version} بنجاح كإصدار جديد #${nextVersion}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error restoring integration version";
    console.error("[api/admin/integrations/[id]/restore] Exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
