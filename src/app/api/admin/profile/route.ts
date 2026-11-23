import { NextResponse, type NextRequest } from "next/server";
import { getCurrentAdminProfile } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { user, profile, error } = await getCurrentAdminProfile();

    if (!user) {
      return NextResponse.json(
        { success: false, error: error || "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
      profile,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading admin profile";
    console.error("[api/admin/profile] GET error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, profile } = await getCurrentAdminProfile();

    if (!user || !profile) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active session required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName } = body || {};

    if (typeof fullName !== "string") {
      return NextResponse.json(
        { success: false, error: "Full name is required" },
        { status: 400 }
      );
    }

    const sanitizedName = fullName.trim();
    const supabaseAdmin = createAdminClient();

    // 1. Update profiles record in database
    const { data: updatedProfile, error: dbError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: sanitizedName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (dbError) {
      console.error("[api/admin/profile] DB update error:", dbError.message);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 400 });
    }

    // 2. Sync user metadata in auth.users
    try {
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: { full_name: sanitizedName },
      });
    } catch (metaErr) {
      console.warn("[api/admin/profile] Metadata sync warning:", metaErr);
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "تم تحديث الاسم الكامل بنجاح / Profile name updated successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating profile";
    console.error("[api/admin/profile] PATCH error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
