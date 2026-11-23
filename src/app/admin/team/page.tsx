"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "editor";
  is_active: boolean;
  created_at: string;
}

export default function AdminTeamPage() {
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";

  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "admin">("editor");
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Action State (per row loading)
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/team");
      if (res.ok) {
        const json = await res.json();
        if (json.team) {
          setMembers(json.team);
          return;
        }
      }

      // Fallback: query client supabase directly if available
      const supabase = createClient();
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, is_active, created_at")
        .order("created_at", { ascending: false });

      if (profiles && profiles.length > 0) {
        setMembers(profiles as TeamMember[]);
      } else {
        // Fallback default member for inspection if local
        setMembers([
          {
            id: "current-admin",
            email: "admin@multicreatives.com",
            full_name: isArabic ? "مدير النظام الرئيسي" : "Lead System Admin",
            role: "admin",
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
    }
  }, [isArabic]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, role")
            .eq("id", user.id)
            .maybeSingle();

          setCurrentUser({
            id: user.id,
            role: profile?.role || user.user_metadata?.role || "editor",
          });
        } else {
          // Dev preview fallback
          setCurrentUser({ id: "current-admin", role: "admin" });
        }

        await fetchTeamMembers();
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [fetchTeamMembers]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchTeamMembers();
    setRefreshing(false);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);
    setInviting(true);

    try {
      const res = await fetch("/api/admin/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          fullName: inviteName.trim(),
          role: inviteRole,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setInviteError(data.error || (isArabic ? "فشل إرسال الدعوة" : "Failed to send invitation"));
        setInviting(false);
        return;
      }

      setInviteSuccess(
        isArabic
          ? `تم إرسال دعوة الانضمام بنجاح إلى ${inviteEmail}`
          : `Invitation successfully dispatched to ${inviteEmail}`
      );
      setInviteEmail("");
      setInviteName("");
      setInviteRole("editor");
      await fetchTeamMembers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending invite";
      setInviteError(msg);
    } finally {
      setInviting(false);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    if (member.id === currentUser?.id) {
      setActionMessage({
        type: "error",
        text: isArabic
          ? "لا يمكنك تعطيل حسابك الشخصي"
          : "You cannot deactivate your own administrator account",
      });
      return;
    }

    setUpdatingId(member.id);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !member.is_active }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionMessage({
          type: "error",
          text: data.error || (isArabic ? "فشل تحديث الحالة" : "Failed to update status"),
        });
      } else {
        setActionMessage({
          type: "success",
          text: isArabic
            ? `تم ${member.is_active ? "تعطيل" : "تفعيل"} الحساب بنجاح`
            : `Account ${member.is_active ? "deactivated" : "activated"} successfully`,
        });
        await fetchTeamMembers();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error toggling status";
      setActionMessage({ type: "error", text: msg });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleChangeRole = async (member: TeamMember, newRole: "admin" | "editor") => {
    if (member.id === currentUser?.id) {
      setActionMessage({
        type: "error",
        text: isArabic
          ? "لا يمكنك تعديل دور حسابك الشخصي"
          : "You cannot change your own administrator role",
      });
      return;
    }

    setUpdatingId(member.id);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionMessage({
          type: "error",
          text: data.error || (isArabic ? "فشل تعديل الدور" : "Failed to change role"),
        });
      } else {
        setActionMessage({
          type: "success",
          text: isArabic
            ? `تم تغيير دور العضو إلى ${newRole === "admin" ? "مدير نظام" : "محرر"}`
            : `Member role updated to ${newRole}`,
        });
        await fetchTeamMembers();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error changing role";
      setActionMessage({ type: "error", text: msg });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center text-[#C6A66B]">
        <Loader2 size={36} className="animate-spin" />
      </div>
    );
  }

  // Permission Guard Check
  const isAuthorizedAdmin = currentUser?.role === "admin";
  if (!isAuthorizedAdmin) {
    return (
      <div dir={dir} className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[var(--bg-surface)] border border-red-500/30 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {isArabic ? "صلاحيات الوصول مقيدة" : "Restricted Access"}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {isArabic
              ? "هذه الصفحة مخصصة لمدراء النظام فقط (Administrators). حسابك مصنف كمحرر ولا يملك صلاحية إدارة الفريق."
              : "This page is strictly reserved for Administrators. Your account does not possess permission to manage team accounts."}
          </p>
          <div className="mt-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C6A66B] text-black text-xs font-bold hover:bg-[#D8BC84] transition-all"
            >
              {isArabic ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
              <span>{isArabic ? "العودة للوحة التحكم" : "Back to Dashboard"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/admin"
              className="text-xs font-semibold text-[#C6A66B] hover:underline flex items-center gap-1"
            >
              {isArabic ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
              <span>{isArabic ? "لوحة التحكم" : "Dashboard"}</span>
            </Link>
            <span className="text-[var(--text-tertiary)]">/</span>
            <span className="text-xs text-[var(--text-secondary)]">
              {isArabic ? "إدارة الفريق" : "Team"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Users size={28} className="text-[#C6A66B]" />
            <span>{isArabic ? "إدارة فريق العمل والدعوات" : "Team & Invitations"}</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
            {isArabic
              ? "إرسال دعوات بريدية مغلقة وتعيين أدوار المشرفين والمحررين والتحكم في تفعيل الحسابات."
              : "Dispatch private invitations, assign administrative roles, and toggle team member permissions."}
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:text-[#C6A66B] text-xs font-semibold text-[var(--text-secondary)] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          <span>{isArabic ? "تحديث القائمة" : "Refresh Roster"}</span>
        </button>
      </div>

      {/* Global Action Toast / Feedback */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 border ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-500"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle size={16} className="shrink-0 text-red-500" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Layout Grid: Invite Card (1 col) + Team Roster (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Right Column: Invite New Member Card */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/30 transition-all shadow-sm sticky top-24">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[var(--border-subtle)]">
              <div className="w-9 h-9 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center">
                <UserPlus size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {isArabic ? "دعوة عضو جديد" : "Invite Team Member"}
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  {isArabic ? "إرسال رابط آمن لتعيين كلمة المرور" : "Send secure invitation via email"}
                </p>
              </div>
            </div>

            {inviteSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                <span>{inviteSuccess}</span>
              </div>
            )}

            {inviteError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{inviteError}</span>
              </div>
            )}

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  {isArabic ? "الاسم الكامل" : "Full Name"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-[var(--text-tertiary)]">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder={isArabic ? "مثال: م. مروان القديمي" : "e.g. John Doe"}
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#C6A66B] focus:outline-none text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  {isArabic ? "البريد الإلكتروني" : "Work Email"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-[var(--text-tertiary)]">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="editor@multicreatives.com"
                    className="w-full ps-9 pe-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-[#C6A66B] focus:outline-none text-xs text-[var(--text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  {isArabic ? "الدور والصلاحية" : "Role & Privileges"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInviteRole("editor")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      inviteRole === "editor"
                        ? "bg-[#C6A66B]/15 border-[#C6A66B] text-[#C6A66B]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <Shield size={13} />
                    <span>{isArabic ? "محرر (Editor)" : "Editor"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole("admin")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      inviteRole === "admin"
                        ? "bg-[#C6A66B]/15 border-[#C6A66B] text-[#C6A66B]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <ShieldCheck size={13} />
                    <span>{isArabic ? "مدير (Admin)" : "Admin"}</span>
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)]">
                  {inviteRole === "admin"
                    ? isArabic
                      ? "صلاحية كاملة: إدارة الفريق، التعديل والحذف لكافة الجداول."
                      : "Full access: team management, mutations, and table deletion."
                    : isArabic
                    ? "صلاحية محرر: إضافة وتعديل المشاريع والخدمات دون صلاحية الحذف."
                    : "Editor access: insert and update projects & services without delete."}
                </p>
              </div>

              <button
                type="submit"
                disabled={inviting}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-[#C6A66B] to-[#D8BC84] hover:from-[#D8BC84] hover:to-[#C6A66B] text-[#111111] shadow-md shadow-[#C6A66B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {inviting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>{isArabic ? "جارٍ إرسال الدعوة..." : "Sending Invitation..."}</span>
                  </>
                ) : (
                  <span>{isArabic ? "إرسال دعوة الانضمام" : "Dispatch Invitation"}</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Center/Right Columns: Team Roster Table */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>{isArabic ? "سجل أعضاء الفريق المعتمدين" : "Active Team Roster"}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#C6A66B]/15 text-[#C6A66B] font-mono">
                  {members.length}
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4 text-start">{isArabic ? "العضو" : "Member"}</th>
                    <th className="py-3.5 px-4 text-start">{isArabic ? "الدور" : "Role"}</th>
                    <th className="py-3.5 px-4 text-start">{isArabic ? "الحالة" : "Status"}</th>
                    <th className="py-3.5 px-4 text-start">{isArabic ? "تاريخ الانضمام" : "Joined"}</th>
                    <th className="py-3.5 px-4 text-end">{isArabic ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {members.map((member) => {
                    const isSelf = member.id === currentUser?.id;
                    const isRowUpdating = updatingId === member.id;

                    return (
                      <tr key={member.id} className="hover:bg-[var(--bg-secondary)]/40 transition-colors">
                        {/* Member Name & Email */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C6A66B]/20 to-[#C6A66B]/5 text-[#C6A66B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C6A66B]/20">
                              {(member.full_name || member.email || "M")[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <span className="truncate">{member.full_name || (isArabic ? "عضو بدون اسم" : "Unnamed Member")}</span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#C6A66B]/20 text-[#C6A66B] font-mono shrink-0">
                                    {isArabic ? "حسابك" : "You"}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[var(--text-tertiary)] font-mono truncate">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge & Switcher */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {isSelf ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30">
                              <ShieldCheck size={12} />
                              <span>Admin</span>
                            </span>
                          ) : (
                            <select
                              value={member.role}
                              disabled={isRowUpdating}
                              onChange={(e) => handleChangeRole(member, e.target.value as "admin" | "editor")}
                              className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none cursor-pointer"
                            >
                              <option value="editor">Editor (محرر)</option>
                              <option value="admin">Admin (مدير)</option>
                            </select>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              member.is_active
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {member.is_active ? (
                              <>
                                <CheckCircle2 size={11} />
                                <span>{isArabic ? "نشط" : "Active"}</span>
                              </>
                            ) : (
                              <>
                                <XCircle size={11} />
                                <span>{isArabic ? "معطل" : "Inactive"}</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-4 whitespace-nowrap text-[11px] text-[var(--text-tertiary)] font-mono">
                          {new Date(member.created_at).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4 text-end whitespace-nowrap">
                          {isSelf ? (
                            <span className="text-[11px] text-[var(--text-tertiary)] italic">
                              {isArabic ? "محمي من التعديل" : "Protected"}
                            </span>
                          ) : (
                            <button
                              onClick={() => handleToggleActive(member)}
                              disabled={isRowUpdating}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                member.is_active
                                  ? "border border-red-500/30 text-red-400 hover:bg-red-500/10"
                                  : "border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                              } disabled:opacity-50`}
                            >
                              {isRowUpdating ? (
                                <Loader2 size={13} className="animate-spin inline" />
                              ) : member.is_active ? (
                                isArabic ? "تعطيل الحساب" : "Deactivate"
                              ) : (
                                isArabic ? "تفعيل الحساب" : "Activate"
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
