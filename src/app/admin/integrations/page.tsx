"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { CodeAnalysisReport } from "@/lib/integrations/analyzer";
import {
  Code2,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  History,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Layers,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  X,
  Globe,
  FileCode,
  Tag,
  Clock,
  RotateCcw,
} from "lucide-react";

interface IntegrationItem {
  id: string;
  name: string;
  provider: string;
  code_type: string;
  code_content: string;
  placement: "head" | "body_start" | "body_end";
  target_pages: string[];
  is_active: boolean;
  is_approved: boolean;
  approved_by?: string | null;
  version: number;
  versions_count: number;
  ai_analysis?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface IntegrationVersion {
  id: string;
  version: number;
  code_content: string;
  placement: string;
  target_pages: string[];
  changed_by?: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

const COMMON_PAGES = [
  { path: "*", labelAr: "جميع صفحات الموقع (*)", labelEn: "All Pages (*)" },
  { path: "/", labelAr: "الصفحة الرئيسية (/)", labelEn: "Homepage (/)" },
  { path: "/services", labelAr: "صفحات الخدمات (/services)", labelEn: "Services (/services)" },
  { path: "/portfolio", labelAr: "معرض الأعمال (/portfolio)", labelEn: "Portfolio (/portfolio)" },
  { path: "/about", labelAr: "عن ملتي كريتيفز (/about)", labelEn: "About (/about)" },
  { path: "/contact", labelAr: "صفحة اتصل بنا (/contact)", labelEn: "Contact (/contact)" },
  { path: "/quote-builder", labelAr: "حاسبة الأسعار (/quote-builder)", labelEn: "Quote Builder (/quote-builder)" },
  { path: "/print-configurator", labelAr: "مخصص الطباعة (/print-configurator)", labelEn: "Print Configurator (/print-configurator)" },
];

export default function AdminIntegrationsPage() {
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";
  const [, startTransition] = useTransition();

  // Auth & Page State
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal: Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [codeType, setCodeType] = useState("custom_js");
  const [codeContent, setCodeContent] = useState("");
  const [placement, setPlacement] = useState<"head" | "body_start" | "body_end">("head");
  const [targetPages, setTargetPages] = useState<string[]>(["*"]);
  const [isActive, setIsActive] = useState(true);
  const [isApproved, setIsApproved] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Analyzer State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<CodeAnalysisReport | null>(null);
  const [analyzerError, setAnalyzerError] = useState<string | null>(null);

  // Version History Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyIntegration, setHistoryIntegration] = useState<IntegrationItem | null>(null);
  const [versions, setVersions] = useState<IntegrationVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [restoringVersionId, setRestoringVersionId] = useState<string | null>(null);

  // Delete Confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch integrations list
  const loadIntegrations = React.useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/integrations");
      const json = await res.json();
      if (res.ok && json.success) {
        setIntegrations(json.integrations || []);
      } else {
        setFeedback({ type: "error", text: json.error || "فشل تحميل قائمة التكاملات" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ في الاتصال بالخادم";
      setFeedback({ type: "error", text: msg });
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  // Initial Auth Check
  useEffect(() => {
    async function verifyAndFetch() {
      try {
        const res = await fetch("/api/admin/profile");
        const json = await res.json();
        if (res.ok && json.success && json.profile?.role === "admin") {
          setIsAdmin(true);
          await loadIntegrations();
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      } catch (err) {
        console.error("[Integrations] Auth error:", err);
        setIsAdmin(false);
        setLoading(false);
      }
    }
    verifyAndFetch();
  }, [loadIntegrations]);

  // Run AI / Static Analyzer
  const handleAnalyzeCode = async () => {
    if (!codeContent.trim()) {
      setAnalyzerError(isArabic ? "يرجى لصق كود التتبع أولاً ليتم تحليله" : "Please paste code content to analyze");
      return;
    }
    setIsAnalyzing(true);
    setAnalyzerError(null);
    setAnalysisReport(null);

    try {
      const res = await fetch("/api/admin/integrations/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code_content: codeContent }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.report) {
        setAnalysisReport(data.report);
      } else {
        setAnalyzerError(data.error || (isArabic ? "فشل تحليل الكود" : "Failed to analyze code"));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء تحليل الكود";
      setAnalyzerError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply Recommendations
  const handleApplyRecommendations = () => {
    if (!analysisReport) return;

    if (!name.trim()) {
      const idText = analysisReport.detected_identifiers[0] ? ` (${analysisReport.detected_identifiers[0]})` : "";
      setName(`${analysisReport.provider}${idText}`);
    }
    setProvider(analysisReport.provider);
    setCodeType(analysisReport.code_type);
    setPlacement(analysisReport.recommended_placement);
    setTargetPages(analysisReport.recommended_pages);
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setName("");
    setProvider("");
    setCodeType("custom_js");
    setCodeContent("");
    setPlacement("head");
    setTargetPages(["*"]);
    setIsActive(true);
    setIsApproved(true);
    setAnalysisReport(null);
    setAnalyzerError(null);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (item: IntegrationItem) => {
    setEditingId(item.id);
    setName(item.name);
    setProvider(item.provider);
    setCodeType(item.code_type);
    setCodeContent(item.code_content);
    setPlacement(item.placement);
    setTargetPages(item.target_pages || ["*"]);
    setIsActive(item.is_active);
    setIsApproved(item.is_approved);
    setAnalysisReport(null);
    setAnalyzerError(null);
    setIsModalOpen(true);
  };

  // Toggle Target Page Selection
  const handleToggleTargetPage = (path: string) => {
    if (path === "*") {
      setTargetPages(["*"]);
      return;
    }
    setTargetPages((prev) => {
      const filtered = prev.filter((p) => p !== "*");
      if (filtered.includes(path)) {
        const next = filtered.filter((p) => p !== path);
        return next.length === 0 ? ["*"] : next;
      } else {
        return [...filtered, path];
      }
    });
  };

  // Save Integration (Create or Update)
  const handleSaveIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !codeContent.trim()) {
      setFeedback({ type: "error", text: isArabic ? "يرجى ملء الاسم ومحتوى الكود" : "Name and code are required" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        provider: provider.trim() || "Third-Party",
        code_type: codeType,
        code_content: codeContent.trim(),
        placement,
        target_pages: targetPages,
        is_active: isActive,
        is_approved: isApproved,
        ai_analysis: analysisReport || {},
      };

      const url = editingId ? `/api/admin/integrations/${editingId}` : "/api/admin/integrations";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل حفظ التكامل");
      }

      setFeedback({
        type: "success",
        text: editingId
          ? (isArabic ? "تم تحديث التكامل وحفظ نسخة تدقيق جديدة بنجاح" : "Integration updated with new version snapshot")
          : (isArabic ? "تمت إضافة التكامل واعتماده بنجاح" : "Integration successfully created"),
      });

      setIsModalOpen(false);
      startTransition(() => {
        loadIntegrations();
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء الحفظ";
      setFeedback({ type: "error", text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active Switch Directly from Table
  const handleToggleActive = async (item: IntegrationItem) => {
    const nextState = !item.is_active;
    setIntegrations((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, is_active: nextState } : it))
    );

    try {
      const res = await fetch(`/api/admin/integrations/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: nextState }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل تعديل حالة التفعيل");
      }
    } catch (err: unknown) {
      setIntegrations((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, is_active: item.is_active } : it))
      );
      const msg = err instanceof Error ? err.message : "خطأ أثناء تعديل الحالة";
      setFeedback({ type: "error", text: msg });
    }
  };

  // Toggle Admin Approval Directly
  const handleToggleApprove = async (item: IntegrationItem) => {
    const nextApproved = !item.is_approved;
    setIntegrations((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, is_approved: nextApproved } : it))
    );

    try {
      const res = await fetch(`/api/admin/integrations/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: nextApproved }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل تعديل حالة الاعتماد");
      }
      setFeedback({
        type: "success",
        text: nextApproved
          ? (isArabic ? `تم اعتماد "${item.name}" صراحة من المشرف` : `Approved "${item.name}"`)
          : (isArabic ? `تم إلغاء اعتماد "${item.name}"` : `Approval revoked for "${item.name}"`),
      });
    } catch (err: unknown) {
      setIntegrations((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, is_approved: item.is_approved } : it))
      );
      const msg = err instanceof Error ? err.message : "خطأ أثناء تعديل الاعتماد";
      setFeedback({ type: "error", text: msg });
    }
  };

  // Open Version History Modal
  const handleOpenHistoryModal = async (item: IntegrationItem) => {
    setHistoryIntegration(item);
    setHistoryModalOpen(true);
    setLoadingVersions(true);
    try {
      const res = await fetch(`/api/admin/integrations/${item.id}`);
      const data = await res.json();
      if (res.ok && data.success && data.integration) {
        setVersions(data.integration.integration_versions || []);
      }
    } catch (err) {
      console.error("[Integrations] Error loading versions:", err);
    } finally {
      setLoadingVersions(false);
    }
  };

  // Restore Older Version
  const handleRestoreVersion = async (versionId: string, versionNumber: number) => {
    if (!historyIntegration) return;
    const confirmText = isArabic
      ? `هل أنت متأكد من استعادة الإصدار #${versionNumber}؟ سيتم إنشاء إصدار جديد يحمل نفس محتواه.`
      : `Are you sure you want to restore Version #${versionNumber}?`;

    if (!window.confirm(confirmText)) return;

    setRestoringVersionId(versionId);
    try {
      const res = await fetch(`/api/admin/integrations/${historyIntegration.id}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version_id: versionId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل استعادة الإصدار");
      }

      setFeedback({
        type: "success",
        text: data.message || (isArabic ? "تمت استعادة الإصدار بنجاح" : "Version restored successfully"),
      });
      setHistoryModalOpen(false);
      loadIntegrations();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء استعادة الإصدار";
      setFeedback({ type: "error", text: msg });
    } finally {
      setRestoringVersionId(null);
    }
  };

  // Delete Integration
  const handleDeleteIntegration = async (id: string, itemName: string) => {
    const confirmMsg = isArabic
      ? `هل أنت متأكد من حذف "${itemName}" نهائياً مع كافة إصداراته وسجلات تدقيقه؟`
      : `Delete "${itemName}" permanently?`;

    if (!window.confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/integrations/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل حذف التكامل");
      }
      setFeedback({
        type: "success",
        text: isArabic ? "تم حذف التكامل وسجل إصداراته بنجاح" : "Integration and history deleted",
      });
      setIntegrations((prev) => prev.filter((it) => it.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطأ أثناء الحذف";
      setFeedback({ type: "error", text: msg });
    } finally {
      setDeletingId(null);
    }
  };

  // Stats Counters
  const totalCount = integrations.length;
  const activeCount = integrations.filter((it) => it.is_active && it.is_approved).length;
  const pendingCount = integrations.filter((it) => !it.is_approved).length;
  const providersSet = new Set(integrations.map((it) => it.provider));

  // Loading Screen
  if (loading) {
    return (
      <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center gap-3 text-[#C6A66B]">
        <Loader2 size={36} className="animate-spin" />
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          {isArabic ? "جاري فحص الصلاحيات وتحميل مركز التكاملات..." : "Verifying admin access & loading integrations..."}
        </span>
      </div>
    );
  }

  // Admin Access Guard Screen
  if (!isAdmin) {
    return (
      <div dir={dir} className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[var(--bg-surface)] border border-rose-500/30 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {isArabic ? "صلاحيات الوصول مقيدة (Admins Only)" : "Restricted Access (Admins Only)"}
          </h2>
          <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
            {isArabic
              ? "هذا القسم مخصص لمدراء النظام فقط (Administrators). إدارة أكواد التتبع وفحص السكربتات بحاجة إلى صلاحيات أمنية عليا لحماية الموقع من الثغرات."
              : "This section is restricted strictly to Administrators. Script injection and tracking code configuration require elevated security privileges."}
          </p>
          <div className="mt-6">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] hover:border-[#C6A66B]/50 transition-all"
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
    <div dir={dir} className="w-full space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-[var(--text-tertiary)]">
            <Link href="/admin" className="hover:text-[#C6A66B]">
              {isArabic ? "الرئيسية" : "Dashboard"}
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-semibold">
              {isArabic ? "التكاملات والتتبع" : "Integrations & Tracking"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Code2 size={28} className="text-[#C6A66B]" />
            <span>{isArabic ? "مركز التكاملات والتتبع وأداة الفحص الذكية" : "Integrations & AI Code Analyzer"}</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isArabic
              ? "إدارة سكربتات GA4، بكسلات الإعلانات، أكواد التحقق ومخططات Schema مع تحليل أمني شامل وحقن ديناميكي آمن."
              : "Manage GA4, ad pixels, verification tags & schemas with AI security analysis and dynamic injection."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadIntegrations}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#C6A66B]/40 transition-all cursor-pointer"
            title={isArabic ? "تحديث القائمة" : "Refresh"}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin text-[#C6A66B]" : ""} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A66B] to-[#b39358] text-black text-xs font-bold shadow hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>{isArabic ? "إضافة تكامل جديد" : "Add Integration"}</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="opacity-70 hover:opacity-100 p-1 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center font-bold">
            <Layers size={18} />
          </div>
          <div>
            <span className="text-[11px] text-[var(--text-tertiary)] block">
              {isArabic ? "إجمالي الأكواد" : "Total Integrations"}
            </span>
            <span className="text-lg font-bold text-[var(--text-primary)] font-mono">{totalCount}</span>
          </div>
        </div>

        {/* Active & Injected */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-[11px] text-[var(--text-tertiary)] block">
              {isArabic ? "مفعّل ومعتمد بالكامل" : "Active & Approved"}
            </span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{activeCount}</span>
          </div>
        </div>

        {/* Pending Approval */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="text-[11px] text-[var(--text-tertiary)] block">
              {isArabic ? "بانتظار موافقة المشرف" : "Pending Approval"}
            </span>
            <span className="text-lg font-bold text-amber-400 font-mono">{pendingCount}</span>
          </div>
        </div>

        {/* Unique Providers */}
        <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold">
            <Globe size={18} />
          </div>
          <div>
            <span className="text-[11px] text-[var(--text-tertiary)] block">
              {isArabic ? "الخدمات المدمجة" : "Connected Providers"}
            </span>
            <span className="text-lg font-bold text-[var(--text-primary)] font-mono">
              {providersSet.size}
            </span>
          </div>
        </div>
      </div>

      {/* Integrations Table */}
      <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
        {integrations.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center mx-auto border border-[#C6A66B]/30">
              <Code2 size={28} />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              {isArabic ? "لا توجد أكواد تتبع مضافة حالياً" : "No tracking integrations yet"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {isArabic
                ? "ابدأ بإضافة أكواد Google Analytics 4 أو بكسل Meta أو أكواد التحقق. سيقوم النظام بتحليلها أمنياً والتأكد من خلوها من أي تعارض قبل تفعيلها."
                : "Add GA4, Meta Pixel or verification tags. The analyzer will verify security and prevent duplicate tracking."}
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A66B] to-[#b39358] text-black text-xs font-bold hover:brightness-105 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>{isArabic ? "إضافة أول كود تتبع" : "Add First Integration"}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 text-[var(--text-tertiary)] uppercase font-mono text-[11px]">
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "اسم التكامل والمزود" : "Integration & Provider"}
                  </th>
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "النوع والمكان" : "Type & Placement"}
                  </th>
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "الصفحات المستهدفة" : "Target Pages"}
                  </th>
                  <th className="py-3.5 px-4 text-center font-semibold">
                    {isArabic ? "الإصدار" : "Version"}
                  </th>
                  <th className="py-3.5 px-4 text-center font-semibold">
                    {isArabic ? "موافقة المشرف" : "Admin Approval"}
                  </th>
                  <th className="py-3.5 px-4 text-center font-semibold">
                    {isArabic ? "التفعيل بالموقع" : "Active"}
                  </th>
                  <th className="py-3.5 px-4 text-end font-semibold">
                    {isArabic ? "الإجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {integrations.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--bg-secondary)]/30 transition-colors group"
                  >
                    {/* Name & Provider */}
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--text-primary)] text-xs">
                            {item.name}
                          </span>
                        </div>
                        <span className="inline-block mt-0.5 text-[10px] text-[#C6A66B] font-mono">
                          {item.provider}
                        </span>
                      </div>
                    </td>

                    {/* Type & Placement */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[var(--text-secondary)]">
                          <Tag size={11} className="text-[#C6A66B]" />
                          <span>{item.code_type}</span>
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                          {item.placement === "head"
                            ? "<head>"
                            : item.placement === "body_start"
                            ? "<body> start"
                            : "<body> end"}
                        </span>
                      </div>
                    </td>

                    {/* Target Pages */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {(item.target_pages || ["*"]).map((page, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-mono text-[10px] text-[var(--text-secondary)]"
                          >
                            {page === "*" ? (isArabic ? "جميع الصفحات (*)" : "All Pages (*)") : page}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Version & History */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenHistoryModal(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-mono font-bold text-[var(--text-primary)] hover:border-[#C6A66B]/50 hover:text-[#C6A66B] transition-all cursor-pointer"
                        title={isArabic ? "عرض سجل الإصدارات وتدقيق التغييرات" : "View audit version history"}
                      >
                        <History size={11} />
                        <span>v{item.version}</span>
                        <span className="text-[9px] text-[var(--text-tertiary)]">
                          ({item.versions_count})
                        </span>
                      </button>
                    </td>

                    {/* Admin Approval */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleApprove(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                          item.is_approved
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                            : "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
                        }`}
                        title={isArabic ? "النقر لتعديل حالة الاعتماد" : "Click to toggle approval"}
                      >
                        {item.is_approved ? (
                          <>
                            <ShieldCheck size={11} />
                            <span>{isArabic ? "معتمد" : "Approved"}</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert size={11} />
                            <span>{isArabic ? "بانتظار الاعتماد" : "Pending"}</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Active Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                          item.is_active ? "bg-emerald-500" : "bg-zinc-700"
                        }`}
                        title={item.is_active ? (isArabic ? "مفعّل" : "Active") : (isArabic ? "متوقف" : "Disabled")}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            item.is_active
                              ? isArabic
                                ? "-translate-x-4"
                                : "translate-x-4"
                              : isArabic
                              ? "-translate-x-1"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/40 transition-colors cursor-pointer"
                          title={isArabic ? "تعديل الكود" : "Edit Code"}
                        >
                          <Edit3 size={13} />
                        </button>

                        {/* History */}
                        <button
                          type="button"
                          onClick={() => handleOpenHistoryModal(item)}
                          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                          title={isArabic ? "سجل الإصدارات" : "Version History"}
                        >
                          <History size={13} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => handleDeleteIntegration(item.id, item.name)}
                          className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer disabled:opacity-50"
                          title={isArabic ? "حذف نهائي" : "Delete"}
                        >
                          {deletingId === item.id ? (
                            <Loader2 size={13} className="animate-spin text-rose-400" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT INTEGRATION ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center font-bold">
                  <Code2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {editingId
                      ? isArabic
                        ? `تعديل تكامل: ${name}`
                        : `Edit Integration: ${name}`
                      : isArabic
                      ? "إضافة تكامل وكود تتبع جديد"
                      : "Add New Tracking Integration"}
                  </h3>
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {isArabic ? "محمي بموافقة المشرف وفحص أمني شامل" : "Strict Admin Authorization & Security Auditing"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveIntegration} className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Code Content & AI Analyzer Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <FileCode size={14} className="text-[#C6A66B]" />
                    <span>{isArabic ? "كود التتبع / الاسكربت *" : "Tracking Code / Script *"}</span>
                  </label>

                  {/* AI Analyze Trigger Button */}
                  <button
                    type="button"
                    onClick={handleAnalyzeCode}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30 hover:bg-[#C6A66B]/25 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>{isArabic ? "جاري التحليل..." : "Analyzing..."}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={13} />
                        <span>{isArabic ? "تحليل الكود قبل الإضافة" : "Analyze Code"}</span>
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  rows={6}
                  required
                  value={codeContent}
                  onChange={(e) => {
                    setCodeContent(e.target.value);
                    if (analysisReport) setAnalysisReport(null);
                  }}
                  placeholder="<!-- الصق الكود هنا، مثال: Google tag (gtag.js), Meta Pixel, Schema JSON-LD, أو وسم meta -->"
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none transition-colors leading-relaxed"
                />

                {analyzerError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{analyzerError}</span>
                  </div>
                )}

                {/* 9-Point Analysis Report Card */}
                {analysisReport && (
                  <div className="p-5 rounded-2xl bg-[var(--bg-canvas)] border border-[#C6A66B]/30 space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-[#C6A66B]" />
                        <h4 className="text-xs font-bold text-[var(--text-primary)]">
                          {isArabic ? "تقرير الفحص والتحليل الذكي (9 معايير)" : "Code Analysis Report (9 Points)"}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={handleApplyRecommendations}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#C6A66B] to-[#b39358] text-black text-[11px] font-bold hover:brightness-105 transition-all cursor-pointer"
                      >
                        <Check size={12} />
                        <span>{isArabic ? "تطبيق التوصيات المقترحة" : "Apply Recommendations"}</span>
                      </button>
                    </div>

                    {/* Report Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* 1. Code Type & 3. Provider */}
                      <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                        <span className="text-[10px] text-[var(--text-tertiary)] block">
                          {isArabic ? "1. نوع الكود والخدمة التابعة" : "1. Code Type & Provider"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#C6A66B]/15 text-[#C6A66B] font-mono font-bold text-[11px]">
                            {analysisReport.code_type}
                          </span>
                          <span className="font-semibold text-[var(--text-primary)]">
                            {analysisReport.provider}
                          </span>
                        </div>
                      </div>

                      {/* 4. Recommended Placement */}
                      <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                        <span className="text-[10px] text-[var(--text-tertiary)] block">
                          {isArabic ? "4. مكان التركيب الموصى به" : "4. Recommended Placement"}
                        </span>
                        <span className="font-mono font-bold text-[#C6A66B]">
                          {analysisReport.recommended_placement === "head"
                            ? "<head> (الرأس)"
                            : analysisReport.recommended_placement === "body_start"
                            ? "<body> البداية"
                            : "<body> النهاية"}
                        </span>
                      </div>

                      {/* 2. Purpose */}
                      <div className="sm:col-span-2 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                        <span className="text-[10px] text-[var(--text-tertiary)] block">
                          {isArabic ? "2. وظيفة الكود والغرض منه" : "2. Code Purpose"}
                        </span>
                        <p className="text-[11px] text-[var(--text-primary)] leading-relaxed">
                          {isArabic ? analysisReport.purpose.ar : analysisReport.purpose.en}
                        </p>
                      </div>

                      {/* 7. Security Risks Assessment */}
                      <div
                        className={`sm:col-span-2 p-3 rounded-xl border space-y-1.5 ${
                          analysisReport.security_risks.level === "safe"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : analysisReport.security_risks.level === "warning"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          {analysisReport.security_risks.level === "safe" ? (
                            <ShieldCheck size={14} />
                          ) : (
                            <ShieldAlert size={14} />
                          )}
                          <span>
                            {isArabic
                              ? `7. الفحص الأمني: ${
                                  analysisReport.security_risks.level === "safe"
                                    ? "آمن ومطابق للمعايير"
                                    : analysisReport.security_risks.level === "warning"
                                    ? "تنبيه أمني متوسط"
                                    : "مخاطر أمنية حرجة"
                                }`
                              : `7. Security: ${analysisReport.security_risks.level.toUpperCase()}`}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {isArabic
                            ? analysisReport.security_risks.description.ar
                            : analysisReport.security_risks.description.en}
                        </p>
                        {analysisReport.security_risks.flags.length > 0 && (
                          <ul className="list-disc list-inside text-[10px] space-y-0.5 mt-1 font-mono">
                            {analysisReport.security_risks.flags.map((flag, idx) => (
                              <li key={idx}>{flag}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* 6. Conflicts & Duplicates */}
                      <div
                        className={`sm:col-span-2 p-3 rounded-xl border space-y-1 ${
                          analysisReport.conflicts.is_duplicate || analysisReport.conflicts.has_conflicts
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                            : "bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          {analysisReport.conflicts.is_duplicate || analysisReport.conflicts.has_conflicts ? (
                            <XCircle size={14} className="text-rose-400" />
                          ) : (
                            <CheckCircle2 size={14} className="text-emerald-400" />
                          )}
                          <span className="text-[var(--text-primary)]">
                            {isArabic ? "6. فحص التعارض والتكرار" : "6. Conflicts & Duplication Check"}
                          </span>
                        </div>
                        {analysisReport.conflicts.conflicting_items.length > 0 ? (
                          <div className="space-y-1 pt-1 text-[11px]">
                            {analysisReport.conflicts.conflicting_items.map((conf, idx) => (
                              <p key={idx} className="text-rose-400">
                                • {isArabic ? conf.reason_ar : conf.reason_en}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-emerald-400">
                            {isArabic
                              ? "لا يوجد أي تعارض أو تكرار مع الأكواد المسجلة حالياً."
                              : "No conflicts or duplicates detected against current integrations."}
                          </p>
                        )}
                      </div>

                      {/* 8. Cookie Consent & 9. Dynamic Execution */}
                      <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                        <span className="text-[10px] text-[var(--text-tertiary)] block">
                          {isArabic ? "8. ملفات تعريف الارتباط (Cookies)" : "8. Cookie Consent"}
                        </span>
                        <span className="font-semibold text-[11px] text-[var(--text-primary)]">
                          {analysisReport.needs_cookie_consent
                            ? isArabic
                              ? "يتطلب موافقة ملفات تعريف الارتباط"
                              : "Requires Cookie Consent"
                            : isArabic
                            ? "لا يتطلب موافقة كوكيز (أداء / تعريفي)"
                            : "No Cookie Consent Required"}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                        <span className="text-[10px] text-[var(--text-tertiary)] block">
                          {isArabic ? "9. التفعيل الفوري" : "9. Dynamic Execution"}
                        </span>
                        <span className="font-semibold text-[11px] text-emerald-400">
                          {isArabic
                            ? "يعمل ديناميكياً فورياً دون إعادة بناء"
                            : "Executes dynamically without rebuild"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)]">
                    {isArabic ? "اسم التكامل *" : "Integration Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: Google Analytics 4 الرئيسية"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)]">
                    {isArabic ? "مزود الخدمة *" : "Provider *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    placeholder="مثال: Google, Meta, TikTok, Custom"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)]">
                    {isArabic ? "نوع الكود" : "Code Type"}
                  </label>
                  <select
                    value={codeType}
                    onChange={(e) => setCodeType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none font-mono"
                  >
                    <option value="ga4">Google Analytics 4 (ga4)</option>
                    <option value="gtm">Google Tag Manager (gtm)</option>
                    <option value="google_ads">Google Ads Conversion (google_ads)</option>
                    <option value="meta_pixel">Meta / Facebook Pixel (meta_pixel)</option>
                    <option value="tiktok_pixel">TikTok Pixel (tiktok_pixel)</option>
                    <option value="snapchat_pixel">Snapchat Pixel (snapchat_pixel)</option>
                    <option value="search_console">Search Console Verification (search_console)</option>
                    <option value="schema">JSON-LD Schema (schema)</option>
                    <option value="meta_tag">Meta Tag (meta_tag)</option>
                    <option value="custom_js">Custom JavaScript (custom_js)</option>
                    <option value="custom_html">Custom HTML (custom_html)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)]">
                    {isArabic ? "مكان التركيب" : "Placement"}
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as "head" | "body_start" | "body_end")}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none font-mono"
                  >
                    <option value="head">&lt;head&gt; (موصى به لـ GA4، البيكسل والوسوم)</option>
                    <option value="body_start">&lt;body&gt; البداية (مناسب لحاويات GTM noscript)</option>
                    <option value="body_end">&lt;body&gt; النهاية (مناسب لنوافذ الشات والسكربتات التفاعلية)</option>
                  </select>
                </div>
              </div>

              {/* Target Pages Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)] block">
                  {isArabic ? "الصفحات المستهدفة للحقن" : "Target Pages for Injection"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_PAGES.map((page) => {
                    const isSelected = targetPages.includes(page.path);
                    return (
                      <button
                        key={page.path}
                        type="button"
                        onClick={() => handleToggleTargetPage(page.path)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#C6A66B] text-black shadow"
                            : "bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {isArabic ? page.labelAr : page.labelEn}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] text-[var(--text-tertiary)] block">
                  {isArabic
                    ? "اختر '*' لتطبيق الكود على جميع الصفحات العامة، أو حدد مسارات معينة."
                    : "Select '*' for all public pages, or pick specific route targets."}
                </span>
              </div>

              {/* Admin Approval & Activation Switches */}
              <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)] block">
                      {isArabic ? "اعتماد الكود صراحة (موافقة المشرف)" : "Explicit Admin Approval"}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      {isArabic
                        ? "وفقاً للسياسة الأمنية، لن يُحقن أي كود بالموقع إلا إذا كان معتمداً من مشرف."
                        : "Security requirement: Only approved scripts are injected into live pages."}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="w-4 h-4 accent-[#C6A66B] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)] block">
                      {isArabic ? "تفعيل الكود في الموقع فوراً" : "Activate on Live Website"}
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      {isArabic ? "تشغيل الكود لزوار الموقع العام" : "Enable script execution for visitors"}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A66B] to-[#b39358] text-black text-xs font-bold shadow hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{isArabic ? "جاري الحفظ..." : "Saving..."}</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{isArabic ? "حفظ وتطبيق التغييرات" : "Save Integration"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: AUDIT VERSION HISTORY ================= */}
      {historyModalOpen && historyIntegration && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col">
            {/* History Header */}
            <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-canvas)]/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center font-bold">
                  <History size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {isArabic ? `سجل تدقيق وإصدارات: ${historyIntegration.name}` : `Audit History: ${historyIntegration.name}`}
                  </h3>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                    {historyIntegration.provider} • ID: {historyIntegration.id.slice(0, 8)}...
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setHistoryModalOpen(false)}
                className="p-1.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Versions List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {loadingVersions ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#C6A66B]">
                  <Loader2 size={24} className="animate-spin" />
                  <span className="text-xs text-[var(--text-secondary)]">
                    {isArabic ? "جاري تحميل سجل الإصدارات..." : "Loading version history..."}
                  </span>
                </div>
              ) : versions.length === 0 ? (
                <p className="text-xs text-center text-[var(--text-secondary)] py-8">
                  {isArabic ? "لا توجد إصدارات سابقة مسجلة" : "No previous versions found"}
                </p>
              ) : (
                versions.map((ver) => {
                  const isCurrent = ver.version === historyIntegration.version;
                  return (
                    <div
                      key={ver.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-[#C6A66B]/10 border-[#C6A66B]/40"
                          : "bg-[var(--bg-canvas)] border-[var(--border-subtle)]"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)]">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold ${
                              isCurrent
                                ? "bg-[#C6A66B] text-black"
                                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                            }`}
                          >
                            v{ver.version} {isCurrent && (isArabic ? "(الإصدار الحالي)" : "(Current)")}
                          </span>
                          <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1 font-mono">
                            <Clock size={11} />
                            {new Date(ver.created_at).toLocaleString(isArabic ? "ar-SA" : "en-US")}
                          </span>
                        </div>

                        {/* Restore Button (only on older versions) */}
                        {!isCurrent && (
                          <button
                            type="button"
                            disabled={restoringVersionId === ver.id}
                            onClick={() => handleRestoreVersion(ver.id, ver.version)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-primary)] hover:border-[#C6A66B]/50 hover:text-[#C6A66B] transition-all cursor-pointer disabled:opacity-50"
                          >
                            {restoringVersionId === ver.id ? (
                              <Loader2 size={12} className="animate-spin text-[#C6A66B]" />
                            ) : (
                              <RotateCcw size={12} />
                            )}
                            <span>{isArabic ? "استعادة هذا الإصدار" : "Restore Version"}</span>
                          </button>
                        )}
                      </div>

                      {/* Version Snapshot Meta */}
                      <div className="text-[11px] text-[var(--text-secondary)] space-y-1 mb-2">
                        <div>
                          <span className="font-semibold">{isArabic ? "مكان التركيب: " : "Placement: "}</span>
                          <span className="font-mono">{ver.placement}</span>
                        </div>
                        <div>
                          <span className="font-semibold">{isArabic ? "الصفحات: " : "Pages: "}</span>
                          <span className="font-mono">{(ver.target_pages || ["*"]).join(", ")}</span>
                        </div>
                      </div>

                      {/* Code Snippet Preview */}
                      <pre className="p-3 rounded-xl bg-black/60 border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-tertiary)] overflow-x-auto max-h-28">
                        {ver.code_content}
                      </pre>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
