import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/admin";

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, request.url));
      }
      console.error("Auth callback exchange error:", error.message);
    } catch (err) {
      console.error("Auth callback exception:", err);
    }
  }

  // Fallback to login with error parameter
  return NextResponse.redirect(
    new URL("/admin/login?error=auth_callback_failed", request.url)
  );
}
