import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: auth.status }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Member ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { is_active, role } = body || {};

    // 1. Guard against self-deactivation
    if (auth.user?.id === id && is_active === false) {
      return NextResponse.json(
        {
          success: false,
          error: "لا يمكنك تعطيل حسابك الشخصي بصفتك مديراً للنظام / Cannot deactivate your own administrator account",
        },
        { status: 400 }
      );
    }

    // 2. Guard against self-demotion
    if (auth.user?.id === id && role && role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "لا يمكنك تجريد حسابك من صلاحية الإدارة / Cannot demote your own account from administrator",
        },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof is_active === "boolean") {
      updates.is_active = is_active;
    }

    if (role === "admin" || role === "editor") {
      updates.role = role;
    }

    const supabaseAdmin = createAdminClient();

    // Update profile in database
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 400 }
      );
    }

    // Sync auth metadata if role changed
    if (role === "admin" || role === "editor") {
      try {
        await supabaseAdmin.auth.admin.updateUserById(id, {
          user_metadata: { role },
        });
      } catch (authMetaErr) {
        console.warn("Failed to update auth metadata for user:", authMetaErr);
      }
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "تم تحديث بيانات العضو بنجاح / Team member updated successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
