"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { createClient } from "@/lib/supabase/client";
import {
  UserCog,
  Mail,
  User,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  AlertCircle,
  Calendar,
  Fingerprint,
} from "lucide-react";

interface ProfileState {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "editor";
  isActive: boolean;
  createdAt: string;
}

export default function AdminSettingsPage() {
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileState>({
    id: "",
    email: "",
    fullName: "",
    role: "editor",
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  // Name Form State
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Password Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAccountData() {
      try {
        // Attempt 1: Fetch from server API
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.profile) {
            setProfile({
              id: json.profile.id,
              email: json.profile.email,
              fullName: json.profile.full_name || "",
              role: json.profile.role,
              isActive: json.profile.is_active,
              createdAt: json.profile.created_at || new Date().toISOString(),
            });
            setNameInput(json.profile.full_name || "");
            return;
          }
        }

        // Attempt 2: Fallback to client session
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: pData } = await supabase
            .from("profiles")
            .select("id, email, full_name, role, is_active, created_at")
            .eq("id", user.id)
            .maybeSingle();

          const fName = pData?.full_name || (user.user_metadata?.full_name as string) || "";
          setProfile({
            id: user.id,
            email: user.email || "",
            fullName: fName,
            role: (pData?.role || user.user_metadata?.role || "editor") as "admin" | "editor",
            isActive: pData?.is_active ?? true,
            createdAt: pData?.created_at || user.created_at || new Date().toISOString(),
          });
          setNameInput(fName);
        }
      } catch (err) {
        console.error("[Settings] Error loading account data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAccountData();
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setNameSuccess(null);
    setSavingName(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: nameInput }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setNameError(data.error || (isArabic ? "فشل حفظ الاسم" : "Failed to update name"));
        setSavingName(false);
        return;
      }

      setProfile((prev) => ({ ...prev, fullName: nameInput }));
      setNameSuccess(
        isArabic
          ? "تم تحديث الاسم بنجاح في قاعدة البيانات!"
          : "Full name updated successfully in database!"
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating name";
      setNameError(msg);
    } finally {
      setSavingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError(
        isArabic
          ? "يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل."
          : "New password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        isArabic
          ? "كلمتا المرور غير متطابقتين. يرجى إعادة التأكد."
          : "Passwords do not match. Please verify."
      );
      return;
    }

    setSavingPassword(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
        setSavingPassword(false);
        return;
      }

      setPasswordSuccess(
        isArabic
          ? "تم تحديث كلمة المرور الخاصة بك بنجاح!"
          : "Password updated successfully!"
      );
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating password";
      setPasswordError(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center text-[#C6A66B]">
        <Loader2 size={36} className="animate-spin" />
      </div>
    );
  }

  return (
    <div dir={dir} className="w-full max-w-5xl space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
          <UserCog size={28} className="text-[#C6A66B]" />
          <span>{isArabic ? "إعدادات الحساب والأمان" : "Account & Security Settings"}</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
          {isArabic
            ? "عرض تفاصيل عضويتك في المنظومة، تحديث بياناتك الشخصية، وضبط كلمة المرور."
            : "Review your team credentials, update your display identity, and modify your access password."}
        </p>
      </div>

      {/* 1. Account Identity Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#C6A66B]" />
          <span>{isArabic ? "بيانات الاعتماد المسجلة في السحابة" : "Cloud Account Credentials"}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Email */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[11px] font-semibold text-[var(--text-tertiary)] flex items-center gap-1.5 mb-1.5">
              <Mail size={13} />
              <span>{isArabic ? "البريد الإلكتروني" : "Work Email"}</span>
            </span>
            <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-mono truncate" title={profile.email}>
              {profile.email}
            </div>
          </div>

          {/* Role */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[11px] font-semibold text-[var(--text-tertiary)] flex items-center gap-1.5 mb-1.5">
              <Shield size={13} />
              <span>{isArabic ? "الدور والصلاحية" : "System Role"}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30">
                {profile.role === "admin" ? "Admin (مدير)" : "Editor (محرر)"}
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[11px] font-semibold text-[var(--text-tertiary)] flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 size={13} />
              <span>{isArabic ? "حالة الحساب" : "Account Status"}</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{profile.isActive ? (isArabic ? "نشط ومفعل" : "Active & Verified") : (isArabic ? "معطل" : "Deactivated")}</span>
            </div>
          </div>

          {/* Joined Date */}
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[11px] font-semibold text-[var(--text-tertiary)] flex items-center gap-1.5 mb-1.5">
              <Calendar size={13} />
              <span>{isArabic ? "تاريخ الانضمام" : "Member Since"}</span>
            </span>
            <div className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] font-mono">
              {new Date(profile.createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* User UID */}
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-2 text-[11px] text-[var(--text-tertiary)] font-mono">
          <Fingerprint size={14} className="text-[#C6A66B]" />
          <span>User UUID:</span>
          <span className="truncate">{profile.id}</span>
        </div>
      </div>

      {/* 2. Forms Grid: Personal Identity (Left) + Password Change (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form 1: Update Full Name */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[var(--border-subtle)]">
              <div className="w-9 h-9 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {isArabic ? "الهوية الشخصية والاسم" : "Profile Name & Identity"}
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  {isArabic ? "الاسم المعروض في لوحة التحكم وسجل الأنشطة" : "Displayed across the admin portal"}
                </p>
              </div>
            </div>

            {nameSuccess && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{nameSuccess}</span>
              </div>
            )}

            {nameError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{nameError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  {isArabic ? "الاسم الكامل" : "Full Name"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[var(--text-tertiary)]">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={isArabic ? "اسمك الكامل" : "Your full name"}
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#C6A66B] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  {isArabic ? "البريد الإلكتروني (غير قابل للتعديل المباشر)" : "Email (Read-only)"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[var(--text-tertiary)]">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] opacity-70 text-xs sm:text-sm text-[var(--text-secondary)] cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingName || nameInput.trim() === profile.fullName}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#C6A66B] to-[#D8BC84] hover:from-[#D8BC84] hover:to-[#C6A66B] text-[#111111] shadow-md shadow-[#C6A66B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingName ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>{isArabic ? "جارٍ حفظ الاسم..." : "Saving..."}</span>
                    </>
                  ) : (
                    <span>{isArabic ? "حفظ التغييرات" : "Save Changes"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Form 2: Change Password */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[var(--border-subtle)]">
              <div className="w-9 h-9 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center">
                <KeyRound size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {isArabic ? "تغيير كلمة المرور" : "Change Access Password"}
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  {isArabic ? "تحديث مفتاح الدخول المشفر لحسابك" : "Update encrypted login credential"}
                </p>
              </div>
            </div>

            {passwordSuccess && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  {isArabic ? "كلمة المرور الجديدة" : "New Password"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[var(--text-tertiary)]">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full ps-10 pe-11 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#C6A66B] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-[var(--text-tertiary)] hover:text-[#C6A66B] cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  {isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-[var(--text-tertiary)]">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#C6A66B] focus:outline-none text-xs sm:text-sm text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPassword || !newPassword}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#C6A66B] to-[#D8BC84] hover:from-[#D8BC84] hover:to-[#C6A66B] text-[#111111] shadow-md shadow-[#C6A66B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>{isArabic ? "جارٍ التحديث..." : "Updating..."}</span>
                    </>
                  ) : (
                    <span>{isArabic ? "تحديث كلمة المرور" : "Update Password"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
