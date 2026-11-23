import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح / Successfully signed out",
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error signing out";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
