import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // Only handle admin routes
  if (!pathname.startsWith("/admin")) {
    return response;
  }

  // Exempt public auth routes from session requirement
  const isAuthCallback = pathname.startsWith("/admin/auth/callback");
  const isLoginPage = pathname === "/admin/login";
  const isSetPasswordPage = pathname === "/admin/set-password";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // In test / build mode where Supabase URL is placeholder, avoid blocking if unconfigured
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    if (!isLoginPage && !isAuthCallback && !isSetPasswordPage) {
      // In local dev without live Supabase credentials, pass through or redirect
      // to login with notice so pages can still render during build tests
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Unauthenticated user attempting to access protected admin pages
  if (!user && !isLoginPage && !isAuthCallback && !isSetPasswordPage) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user checks
  if (user) {
    // Verify account activation in profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_active, role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && profile.is_active === false) {
      // Deactivated user -> force redirect to login with error and flush cookies
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "account_deactivated");
      const redirectResponse = NextResponse.redirect(loginUrl);

      // Clear Supabase session cookies
      request.cookies.getAll().forEach((cookie) => {
        if (cookie.name.includes("sb-") || cookie.name.includes("auth-token")) {
          redirectResponse.cookies.delete(cookie.name);
        }
      });
      return redirectResponse;
    }

    // Active user navigating to login page -> redirect to admin dashboard
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
