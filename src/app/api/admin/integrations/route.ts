import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized || !auth.user || !auth.profile) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized: Administrator privileges required" },
        { status: auth.status }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Query all integrations with version count
    const { data: integrations, error } = await supabaseAdmin
      .from("integrations")
      .select(`
        *,
        integration_versions (
          id,
          version,
          created_at
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/admin/integrations] GET error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    interface DbIntegrationRow {
      id: string;
      integration_versions?: Array<{ id: string; version: number; created_at: string }> | null;
      [key: string]: unknown;
    }

    const formatted = ((integrations || []) as DbIntegrationRow[]).map((item) => {
      const versions = item.integration_versions || [];
      const rest = { ...item };
      delete (rest as Record<string, unknown>).integration_versions;
      return {
        ...rest,
        versions_count: versions.length,
      };
    });

    return NextResponse.json({
      success: true,
      integrations: formatted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading integrations";
    console.error("[api/admin/integrations] GET exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized || !auth.user || !auth.profile) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized: Administrator privileges required" },
        { status: auth.status }
      );
    }

    const body = await request.json();
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

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "اسم التكامل مطلوب" }, { status: 400 });
    }
    if (!provider || typeof provider !== "string" || !provider.trim()) {
      return NextResponse.json({ success: false, error: "مزود الخدمة مطلوب" }, { status: 400 });
    }
    if (!code_content || typeof code_content !== "string" || !code_content.trim()) {
      return NextResponse.json({ success: false, error: "محتوى الكود مطلوب" }, { status: 400 });
    }

    const validPlacements = ["head", "body_start", "body_end"];
    const finalPlacement = validPlacements.includes(placement) ? placement : "head";

    const supabaseAdmin = createAdminClient();

    // Prevent duplicate content
    const cleanContent = code_content.replace(/\s+/g, "").trim();
    const { data: existingAll } = await supabaseAdmin
      .from("integrations")
      .select("id, name, code_content");

    if (existingAll) {
      for (const item of existingAll) {
        if (item.code_content.replace(/\s+/g, "").trim() === cleanContent) {
          return NextResponse.json(
            {
              success: false,
              error: `هذا الكود متطابق تماماً مع التكامل الموجود مسبقاً ("${item.name}"). منعاً للتكرار لا يمكن إضافته مرتين.`,
            },
            { status: 400 }
          );
        }
      }
    }

    const finalTargetPages = Array.isArray(target_pages) && target_pages.length > 0 ? target_pages : ["*"];
    const approvedFlag = Boolean(is_approved);
    const activeFlag = Boolean(is_active);

    // 1. Insert into integrations
    const insertPayload = {
      name: name.trim(),
      provider: provider.trim(),
      code_type: code_type || "custom_js",
      code_content: code_content.trim(),
      placement: finalPlacement,
      target_pages: finalTargetPages,
      is_active: activeFlag,
      is_approved: approvedFlag,
      approved_by: approvedFlag ? auth.user.id : null,
      ai_analysis: ai_analysis || {},
      version: 1,
      created_by: auth.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newIntegration, error: insertErr } = await supabaseAdmin
      .from("integrations")
      .insert(insertPayload)
      .select()
      .single();

    if (insertErr || !newIntegration) {
      console.error("[api/admin/integrations] Insert error:", insertErr?.message);
      return NextResponse.json(
        { success: false, error: insertErr?.message || "فشل حفظ التكامل في قاعدة البيانات" },
        { status: 400 }
      );
    }

    // 2. Audit version snapshot (Version 1)
    const { error: versionErr } = await supabaseAdmin
      .from("integration_versions")
      .insert({
        integration_id: newIntegration.id,
        version: 1,
        code_content: newIntegration.code_content,
        placement: newIntegration.placement,
        target_pages: newIntegration.target_pages,
        changed_by: auth.user.id,
        created_at: new Date().toISOString(),
      });

    if (versionErr) {
      console.warn("[api/admin/integrations] Version snapshot error:", versionErr.message);
    }

    // 3. Revalidate public layout cache
    try {
      revalidatePath("/", "layout");
    } catch (revalErr) {
      console.warn("[api/admin/integrations] Revalidate warning:", revalErr);
    }

    return NextResponse.json({
      success: true,
      integration: newIntegration,
      message: "تمت إضافة التكامل وسجل الإصدار الأول بنجاح",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating integration";
    console.error("[api/admin/integrations] POST exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
