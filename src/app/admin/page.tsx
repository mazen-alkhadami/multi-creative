"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { createClient } from "@/lib/supabase/client";
import {
  Briefcase,
  Layers,
  Users,
  Code2,
  PlusCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  FileCheck2,
  FileEdit,
  Activity,
} from "lucide-react";

interface DashboardMetrics {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  visibleServices: number;
  totalTeam: number;
  activeIntegrations: number;
  dbStatus: "connected" | "standby" | "error";
  dbMessage: string;
}

export default function AdminDashboardPage() {
  const { lang } = useAppContext();
  const isArabic = lang === "ar";

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    fullName: string;
    role: "admin" | "editor";
  } | null>(null);

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    visibleServices: 0,
    totalTeam: 0,
    activeIntegrations: 0,
    dbStatus: "standby",
    dbMessage: isArabic ? "جارٍ فحص الاتصال وقراءة الجداول..." : "Checking connection...",
  });

  const fetchMetrics = useCallback(async () => {
    try {
      const supabase = createClient();

      // 1. Fetch current user & profile
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("[Dashboard] Error fetching auth user:", userError.message);
      }

      if (authUser) {
        // Attempt to fetch profile from server endpoint or client
        let role: "admin" | "editor" = (authUser.user_metadata?.role as "admin" | "editor") || "editor";
        let fullName = authUser.user_metadata?.full_name || (isArabic ? "مشرف معتمد" : "Administrator");

        try {
          const profileRes = await fetch("/api/admin/profile");
          if (profileRes.ok) {
            const pData = await profileRes.json();
            if (pData.success && pData.profile) {
              role = pData.profile.role;
              fullName = pData.profile.full_name || fullName;
            }
          }
        } catch (pEx) {
          console.warn("[Dashboard] Profile fallback to metadata:", pEx);
        }

        setCurrentUser({
          id: authUser.id,
          email: authUser.email || "",
          fullName,
          role,
        });
      }

      // 2. Query exact live metrics from Supabase tables
      const [
        totalProjectsRes,
        publishedProjectsRes,
        draftProjectsRes,
        servicesRes,
        profilesRes,
        integrationsRes,
      ] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("projects").select("id", { count: "exact", head: true }).in("status", ["draft", "hidden"]),
        supabase.from("services").select("id", { count: "exact", head: true }).eq("is_visible", true),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("integrations").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);

      if (totalProjectsRes.error) {
        console.error("[Dashboard] Total projects query error:", totalProjectsRes.error.message);
      }
      if (servicesRes.error) {
        console.error("[Dashboard] Services query error:", servicesRes.error.message);
      }
      if (profilesRes.error) {
        console.error("[Dashboard] Profiles query error:", profilesRes.error.message);
      }

      const hasCriticalError = Boolean(totalProjectsRes.error || servicesRes.error);

      if (!hasCriticalError) {
        setMetrics({
          totalProjects: totalProjectsRes.count ?? 0,
          publishedProjects: publishedProjectsRes.count ?? 0,
          draftProjects: draftProjectsRes.count ?? 0,
          visibleServices: servicesRes.count ?? 0,
          totalTeam: profilesRes.count ?? 0,
          activeIntegrations: integrationsRes.count ?? 0,
          dbStatus: "connected",
          dbMessage: isArabic
            ? "قاعدة البيانات السحابية (Supabase) متصلة وتعمل بكفاءة"
            : "Supabase Cloud Database connected and operational",
        });
      } else {
        const errorMsg = totalProjectsRes.error?.message || servicesRes.error?.message || "Database query failed";
        setMetrics((prev) => ({
          ...prev,
          dbStatus: "error",
          dbMessage: errorMsg,
        }));
      }
    } catch (err: unknown) {
      console.error("[Dashboard] Exception while fetching live metrics:", err);
      setMetrics((prev) => ({
        ...prev,
        dbStatus: "error",
        dbMessage: err instanceof Error ? err.message : "Error connecting to database",
      }));
    }
  }, [isArabic]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await fetchMetrics();
      setLoading(false);
    }
    init();
  }, [fetchMetrics]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMetrics();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[60vh] flex items-center justify-center text-[#C6A66B]">
        <Loader2 size={36} className="animate-spin" />
      </div>
    );
  }

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="w-full space-y-8">
      {/* 1. Welcome Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1C1C1C] via-[#161616] to-[#0F0F0F] border border-[#C6A66B]/25 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 end-0 w-72 h-72 bg-[#C6A66B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30 flex items-center gap-1.5">
                <Sparkles size={13} />
                {isAdmin
                  ? isArabic
                    ? "مدير النظام (Admin)"
                    : "System Administrator"
                  : isArabic
                  ? "محرر معتمد (Editor)"
                  : "Verified Editor"}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  metrics.dbStatus === "connected"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : metrics.dbStatus === "error"
                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                }`}
              >
                {metrics.dbStatus === "connected" ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={13} className={metrics.dbStatus === "error" ? "text-red-400" : "text-amber-400"} />
                )}
                <span>
                  {metrics.dbStatus === "connected"
                    ? isArabic
                      ? "قاعدة البيانات: متصلة بنجاح"
                      : "Supabase: Live Connected"
                    : metrics.dbStatus === "error"
                    ? isArabic
                      ? "قاعدة البيانات: تنبيه اتصال"
                      : "Supabase: Query Alert"
                    : isArabic
                    ? "قاعدة البيانات: قيد الفحص"
                    : "Supabase: Standby"}
                </span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F5F1E8] tracking-tight">
              {isArabic ? "مرحباً بك مجدداً،" : "Welcome back,"}{" "}
              <span className="text-[#C6A66B]">{currentUser?.fullName || "Admin"}</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#99958D] max-w-2xl leading-relaxed">
              {isArabic
                ? "لوحة العمليات والتحكم المركزي لمنصة MULTI CREATIVES. إحصائيات المحتوى، إدارة المشاريع والخدمات، وصلاحيات الفريق تُدار مباشرة من هنا."
                : "Central Operations and Management Platform for MULTI CREATIVES. All metrics and content records reflect live Supabase cloud data."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/portfolio/new"
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#C6A66B] to-[#D8BC84] hover:from-[#D8BC84] hover:to-[#C6A66B] text-[#111111] shadow-lg shadow-[#C6A66B]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>{isArabic ? "إضافة مشروع جديد" : "Add New Project"}</span>
            </Link>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:text-[#C6A66B] text-[var(--text-secondary)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              title={isArabic ? "تحديث الإحصائيات" : "Refresh Metrics"}
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{isArabic ? "تحديث البيانات" : "Refresh"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Real Metrics Grid from Supabase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Total Projects */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {isArabic ? "إجمالي المشاريع" : "Total Projects"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#C6A66B]/10 text-[#C6A66B] flex items-center justify-center">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {metrics.totalProjects}
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
            <Activity size={12} className="text-[#C6A66B]" />
            <span>{isArabic ? "مسجلة في قاعدة البيانات" : "In database"}</span>
          </p>
        </div>

        {/* Metric 2: Published Projects */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-emerald-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {isArabic ? "المشاريع المنشورة" : "Published Projects"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileCheck2 size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {metrics.publishedProjects}
          </div>
          <p className="mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} />
            <span>{isArabic ? "ظاهرة للزوار بالموقع" : "Live on site"}</span>
          </p>
        </div>

        {/* Metric 3: Draft Projects */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-amber-500/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {isArabic ? "المسودات والمخفي" : "Drafts & Hidden"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileEdit size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {metrics.draftProjects}
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
            <span>{isArabic ? "مشاريع قيد الإعداد" : "In preparation"}</span>
          </p>
        </div>

        {/* Metric 4: Visible Services */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {isArabic ? "الخدمات النشطة" : "Active Services"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#C6A66B]/10 text-[#C6A66B] flex items-center justify-center">
              <Layers size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {metrics.visibleServices}
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
            <CheckCircle2 size={12} className="text-[#C6A66B]" />
            <span>{isArabic ? "مجالات تخصصية معتمدة" : "Core service pillars"}</span>
          </p>
        </div>

        {/* Metric 5: Team Members */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {isArabic ? "أعضاء الفريق" : "Team Members"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#C6A66B]/10 text-[#C6A66B] flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {metrics.totalTeam}
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
            <span>{isArabic ? "حسابات إدارية ومحررين" : "Admins & Editors"}</span>
          </p>
        </div>

        {/* Metric 6: Active Integrations */}
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/30 transition-all shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {isArabic ? "التكاملات المفعلة" : "Live Integrations"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#C6A66B]/10 text-[#C6A66B] flex items-center justify-center">
              <Code2 size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {metrics.activeIntegrations}
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
            <span>{isArabic ? "أكواد تتبع معتمدة" : "Active tracking codes"}</span>
          </p>
        </div>
      </div>

      {/* 3. Quick Action Hub */}
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <span>{isArabic ? "بوابة الإجراءات السريعة" : "Quick Actions Hub"}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Action 1: Add New Project */}
          <Link
            href="/admin/portfolio/new"
            className="group p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <PlusCircle size={22} />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors">
                {isArabic ? "إضافة مشروع جديد" : "Add New Project"}
              </h4>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                {isArabic
                  ? "إنشاء دراسة حالة جديدة، رفع صور الغلاف والمعرض، وتحديد الخدمات المرتبطة."
                  : "Draft a new case study, upload visual assets, and bind primary deliverables."}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#C6A66B]">
              <span>{isArabic ? "بدء الإضافة الآن" : "Launch Editor"}</span>
              {isArabic ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </div>
          </Link>

          {/* Action 2: Manage Portfolio */}
          <Link
            href="/admin/portfolio"
            className="group p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Briefcase size={22} />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors">
                {isArabic ? "معرض الأعمال والمشاريع" : "Manage Portfolio"}
              </h4>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                {isArabic
                  ? "مراجعة المشاريع الستة المفهرسة، تعديل بياناتها، تغيير حالتها، أو إخفاؤها."
                  : "Review catalogued projects, update bilingual content, and control visibility."}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#C6A66B]">
              <span>{isArabic ? "عرض قائمة المشاريع" : "Open Catalog"}</span>
              {isArabic ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </div>
          </Link>

          {/* Action 3: Manage Services */}
          <Link
            href="/admin/services"
            className="group p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <Layers size={22} />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors">
                {isArabic ? "إدارة الخدمات والحلول" : "Services Directory"}
              </h4>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                {isArabic
                  ? "تحديث تفاصيل الخدمات السبع، مؤشرات الأداء (Key Metrics)، ومراحل التنفيذ."
                  : "Modify core deliverables, process steps, and performance metrics across 7 pillars."}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#C6A66B]">
              <span>{isArabic ? "تعديل الخدمات" : "Edit Offerings"}</span>
              {isArabic ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </div>
          </Link>

          {/* Action 4: Integrations or Team */}
          {isAdmin ? (
            <Link
              href="/admin/integrations"
              className="group p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Code2 size={22} />
                </div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors">
                  {isArabic ? "التكاملات والتتبع" : "Tracking & Scripts"}
                </h4>
                <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {isArabic
                    ? "إدارة أكواد الماركتنج (Google Analytics, Pixels, Webhooks) ومواقع حقنها."
                    : "Manage third-party tracking snippets, placement locations, and active states."}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#C6A66B]">
                <span>{isArabic ? "إدارة التكاملات" : "Manage Scripts"}</span>
                {isArabic ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </div>
            </Link>
          ) : (
            <Link
              href="/admin/settings"
              className="group p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[#C6A66B] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  <Users size={22} />
                </div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors">
                  {isArabic ? "إعدادات الحساب والأمان" : "Account Settings"}
                </h4>
                <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {isArabic
                    ? "تحديث اسمك الشخصي، وتغيير كلمة المرور الخاصة بحسابك الإداري."
                    : "Update your full name and configure a secure updated password."}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#C6A66B]">
                <span>{isArabic ? "تعديل الإعدادات" : "Account Settings"}</span>
                {isArabic ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
