"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { useAppContext } from "@/context/AppContext";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowLeft, ArrowRight, Loader2, Sun, Moon, Globe } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, dir, theme, toggleLang, toggleTheme } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isArabic = lang === "ar";
  const redirectTarget = searchParams.get("redirect") || "/admin";
  const urlError = searchParams.get("error");

  const computedUrlError =
    urlError === "account_deactivated"
      ? isArabic
        ? "تم تعطيل هذا الحساب من قِبل إدارة النظام. يرجى التواصل مع المسؤول المباشر."
        : "This account has been deactivated by the administrator. Please contact support."
      : urlError === "auth_callback_failed"
      ? isArabic
        ? "تعذر التحقق من الرابط أو انتهت صلاحيته. يرجى إعادة تسجيل الدخول."
        : "Authentication link has expired or is invalid. Please sign in again."
      : null;

  const activeError = errorMessage || computedUrlError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage(
            isArabic
              ? "بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور."
              : "Invalid credentials. Please verify your email and password."
          );
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Verify account active status in profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_active, role")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profile && profile.is_active === false) {
          await supabase.auth.signOut();
          setErrorMessage(
            isArabic
              ? "حسابك معطل حالياً من قِبل الإدارة. لا يمكنك الوصول إلى النظام."
              : "Your account is currently deactivated. Access is denied."
          );
          setLoading(false);
          return;
        }

        router.push(redirectTarget);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error authenticating";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col justify-between bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 relative overflow-hidden"
    >
      {/* Subtle luxury glow in background */}
      <div className="absolute top-1/4 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C6A66B]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full px-6 py-6 flex items-center justify-between border-b border-[var(--border-subtle)] relative z-10 backdrop-blur-md">
        <Logo size="md" href="/" />

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:text-[#C6A66B] transition-all cursor-pointer"
            title={isArabic ? "تبديل المظهر" : "Toggle Theme"}
            aria-label={isArabic ? "تبديل المظهر" : "Toggle Theme"}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:text-[#C6A66B] text-xs font-semibold transition-all cursor-pointer"
            title={isArabic ? "Switch to English" : "التحويل للعربية"}
          >
            <Globe size={15} />
            <span>{isArabic ? "EN" : "عربي"}</span>
          </button>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:text-[#C6A66B] text-xs font-medium transition-all"
          >
            <span>{isArabic ? "الموقع الرئيسي" : "Public Site"}</span>
            {isArabic ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 my-8">
        <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/30 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all">
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C6A66B]/10 border border-[#C6A66B]/30 text-[#C6A66B] mb-5 shadow-inner">
              <Lock size={26} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {isArabic ? "بوابة الإدارة المركزية" : "Central Admin Portal"}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {isArabic
                ? "نظام تسجيل دخول مغلق مخصص لأعضاء فريق MULTI CREATIVES المعتمدين فقط."
                : "Closed-access administrative gateway for authorized MULTI CREATIVES team only."}
            </p>
          </div>

          {/* Security Alert Badge */}
          <div className="mb-6 p-3.5 rounded-xl bg-[#C6A66B]/5 border border-[#C6A66B]/20 flex items-start gap-3 text-xs text-[var(--text-secondary)]">
            <ShieldAlert size={18} className="text-[#C6A66B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isArabic
                ? "الدخول يتم حصراً بدعوة مسبقة من الإدارة. لا يوجد خيار لإنشاء حسابات جديدة."
                : "Access is granted strictly via private invitation. Public registration is disabled."}
            </p>
          </div>

          {/* Error Banner */}
          {activeError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs sm:text-sm leading-relaxed flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{activeError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--text-secondary)]">
                {isArabic ? "البريد الإلكتروني المؤسسي" : "Work Email"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[var(--text-tertiary)]">
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@multicreatives.com"
                  className="w-full ps-10 pe-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] focus:outline-none text-sm transition-all text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-[var(--text-secondary)]">
                {isArabic ? "كلمة المرور" : "Password"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[var(--text-tertiary)]">
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full ps-10 pe-11 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] focus:outline-none text-sm transition-all text-[var(--text-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-[var(--text-tertiary)] hover:text-[#C6A66B] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#C6A66B] to-[#D8BC84] hover:from-[#D8BC84] hover:to-[#C6A66B] text-[#111111] shadow-lg shadow-[#C6A66B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>{isArabic ? "جارٍ التحقق وتأكيد الدخول..." : "Authenticating..."}</span>
                </>
              ) : (
                <span>{isArabic ? "تسجيل الدخول إلى النظام" : "Sign In to Portal"}</span>
              )}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center">
            <p className="text-[11px] text-[var(--text-tertiary)]">
              MULTI CREATIVES &copy; {new Date().getFullYear()} — Secure Operations Engine
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Legal / Status line */}
      <footer className="w-full py-4 text-center text-xs text-[var(--text-tertiary)] border-t border-[var(--border-subtle)] relative z-10">
        <span>{isArabic ? "جميع الحقوق محفوظة لمنصة MULTI CREATIVES" : "All rights reserved to MULTI CREATIVES"}</span>
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#111111] text-[#C6A66B]">
          <Loader2 size={32} className="animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
