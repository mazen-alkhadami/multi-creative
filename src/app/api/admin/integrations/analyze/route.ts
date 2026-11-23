import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { analyzeIntegrationCode, ExistingIntegrationSummary } from "@/lib/integrations/analyzer";

export async function POST(request: NextRequest) {
  try {
    // 1. Strict Admin Authorization Check
    const auth = await requireAdmin();
    if (!auth.authorized || !auth.user || !auth.profile) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized: Administrator privileges required" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { code_content } = body || {};

    if (!code_content || typeof code_content !== "string" || !code_content.trim()) {
      return NextResponse.json(
        { success: false, error: "يرجى لصق كود التتبع المراد تحليله / Code content is required" },
        { status: 400 }
      );
    }

    // 2. Fetch existing active & inactive integrations to check for conflicts/duplicates
    const supabaseAdmin = createAdminClient();
    const { data: existingData, error: fetchErr } = await supabaseAdmin
      .from("integrations")
      .select("id, name, provider, code_type, code_content, placement, is_active");

    if (fetchErr) {
      console.warn("[api/admin/integrations/analyze] Warning fetching existing integrations:", fetchErr.message);
    }

    const existingList: ExistingIntegrationSummary[] = (existingData || []).map((row) => ({
      id: row.id,
      name: row.name,
      provider: row.provider,
      code_type: row.code_type,
      code_content: row.code_content,
      placement: row.placement,
      is_active: Boolean(row.is_active),
    }));

    // 3. Run Analysis (Hybrid: AI or Rule-Based Static Analyzer)
    const report = await analyzeIntegrationCode(code_content, existingList);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error analyzing code";
    console.error("[api/admin/integrations/analyze] Exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
