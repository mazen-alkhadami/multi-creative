import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { email, fullName, role } = body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const sanitizedRole: "admin" | "editor" = role === "admin" ? "admin" : "editor";
    const sanitizedName = typeof fullName === "string" ? fullName.trim() : "";

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://multicreatives.com";
    const redirectTo = `${siteUrl}/admin/auth/callback?next=/admin/set-password`;

    const supabaseAdmin = createAdminClient();

    // Invite user via Supabase Auth Admin API
    const { data, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email.trim().toLowerCase(),
      {
        data: {
          full_name: sanitizedName,
          role: sanitizedRole,
        },
        redirectTo,
      }
    );

    if (inviteError) {
      return NextResponse.json(
        { success: false, error: inviteError.message },
        { status: 400 }
      );
    }

    // Ensure profiles record is synchronized with selected role and name
    if (data?.user?.id) {
      await supabaseAdmin.from("profiles").upsert(
        {
          id: data.user.id,
          email: email.trim().toLowerCase(),
          full_name: sanitizedName,
          role: sanitizedRole,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        role: sanitizedRole,
        full_name: sanitizedName,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error during invite";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
