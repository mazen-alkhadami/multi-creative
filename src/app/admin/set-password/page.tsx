"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useAppContext } from "@/context/AppContext";
import { createClient } from "@/lib/supabase/client";
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

function SetPasswordForm() {
  const router = useRouter();
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function verifySession() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/admin/login?error=session_required");
          return;
        }

        setUserEmail(user.email || null);
      } catch (err) {
        console.error("Session verification error:", err);
      } finally {
        setCheckingSession(false);
      }
    }

    verifySession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 8) {
      setErrorMessage(
        isArabic
          ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."
          : "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        isArabic
          ? "كلمتا المرور غير متطابقتين. يرجى إعادة التأكد."
          : "Passwords do not match. Please verify."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSuccessMessage(
        isArabic
          ? "تم تعيين كلمة المرور بنجاح! جارٍ تحويلك إلى لوحة الإدارة..."
          : "Password updated successfully! Redirecting to portal..."
      );

      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating password";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[#C6A66B]">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col justify-center items-center p-6 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 relative"
    >
      <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" href="/" />
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#C6A66B]/10 text-[#C6A66B] mb-3 border border-[#C6A66B]/20">
            <KeyRound size={22} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)]">
            {isArabic ? "تعيين كلمة المرور الجديدة" : "Set Your Account Password"}
          </h1>
          {userEmail && (
            <p className="mt-1 text-xs text-[#C6A66B] font-mono font-medium">
              {userEmail}
            </p>
          )}
          <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
            {isArabic
              ? "مرحباً بك في فريق MULTI CREATIVES. يرجى تعيين كلمة مرور قوية لحماية حسابك والبدء في العمل."
              : "Welcome to the MULTI CREATIVES team. Please configure a secure password to activate your access."}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs sm:text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-2 text-[var(--text-secondary)]">
              {isArabic ? "كلمة المرور الجديدة" : "New Password"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[var(--text-tertiary)]">
                <Lock size={17} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full ps-10 pe-11 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] focus:outline-none text-sm text-[var(--text-primary)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-[var(--text-tertiary)] hover:text-[#C6A66B] cursor-pointer"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
              <ShieldCheck size={13} />
              <span>{isArabic ? "8 أحرف على الأقل مع أرقام ورموز" : "Minimum 8 characters with numbers & symbols"}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 text-[var(--text-secondary)]">
              {isArabic ? "تأكيد كلمة المرور" : "Confirm Password"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[var(--text-tertiary)]">
                <Lock size={17} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full ps-10 pe-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#C6A66B] focus:ring-1 focus:ring-[#C6A66B] focus:outline-none text-sm text-[var(--text-primary)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#C6A66B] to-[#D8BC84] hover:from-[#D8BC84] hover:to-[#C6A66B] text-[#111111] shadow-lg shadow-[#C6A66B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{isArabic ? "جارٍ حفظ كلمة المرور..." : "Saving password..."}</span>
              </>
            ) : (
              <span>{isArabic ? "حفظ كلمة المرور وتفعيل الحساب" : "Save Password & Activate"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#111111] text-[#C6A66B]">
          <Loader2 size={32} className="animate-spin" />
        </div>
      }
    >
      <SetPasswordForm />
    </Suspense>
  );
}
