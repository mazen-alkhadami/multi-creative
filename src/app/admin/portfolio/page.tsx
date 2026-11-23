"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { PortfolioDetailView } from "@/sections/PortfolioDetailView";
import {
  transformDbProjectToItem,
  ExtendedPortfolioItem,
  DbProjectWithServices,
} from "@/lib/data/projects";
import {
  Briefcase,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  AlertCircle,
  Loader2,
  X,
  Layers,
  ShieldAlert,
} from "lucide-react";

export default function AdminPortfolioPage() {
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";

  // Data states
  const [projects, setProjects] = useState<DbProjectWithServices[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("editor");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  // Preview Modal
  const [previewProject, setPreviewProject] = useState<ExtendedPortfolioItem | null>(null);

  // Delete Modal
  const [deletingProject, setDeletingProject] = useState<DbProjectWithServices | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Quick Status Updating ID
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Load User Profile to verify Admin role
  useEffect(() => {
    async function checkRole() {
      try {
        const res = await fetch("/api/admin/profile");
        const data = await res.json();
        if (data.success && data.profile?.role) {
          setUserRole(data.profile.role);
        }
      } catch (e) {
        console.warn("Could not check admin profile:", e);
      }
    }
    checkRole();
  }, []);

  // Fetch Projects on demand
  const refreshProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/projects");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل تحميل قائمة المشاريع");
      }

      setProjects(data.projects || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تحميل المشاريع";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/projects");
        const data = await res.json();
        if (isMounted) {
          if (!res.ok || !data.success) {
            setError(data.error || "فشل تحميل قائمة المشاريع");
          } else {
            setProjects(data.projects || []);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تحميل المشاريع";
          setError(msg);
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Quick Status Change
  const handleQuickStatusChange = async (projectId: string, newStatus: string) => {
    setUpdatingStatusId(projectId);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل تغيير حالة المشروع");
      }

      // Update local state
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, status: newStatus as "draft" | "published" | "hidden" }
            : p
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تغيير الحالة";
      alert(msg);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Handle Delete Project
  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/projects/${deletingProject.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل حذف المشروع");
      }

      // Remove from local state
      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
      setDeletingProject(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "فشل إتمام عملية الحذف";
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter((project) => {
    // Search matching
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      project.title_ar?.toLowerCase().includes(q) ||
      project.title_en?.toLowerCase().includes(q) ||
      project.slug?.toLowerCase().includes(q) ||
      project.summary_ar?.toLowerCase().includes(q) ||
      project.summary_en?.toLowerCase().includes(q) ||
      (Array.isArray(project.tools) &&
        project.tools.some((t: string) => t.toLowerCase().includes(q)));

    // Status matching
    const matchStatus = statusFilter === "all" || project.status === statusFilter;

    // Service matching
    const matchService =
      serviceFilter === "all" ||
      (Array.isArray(project.services) &&
        project.services.some((s) => s.slug === serviceFilter));

    return matchSearch && matchStatus && matchService;
  });

  // Unique services list for filtering dropdown
  const allServicesSet = new Map<string, string>();
  projects.forEach((p) => {
    if (Array.isArray(p.services)) {
      p.services.forEach((s) => {
        if (s.slug && !allServicesSet.has(s.slug)) {
          allServicesSet.set(s.slug, isArabic ? s.title_ar : s.title_en);
        }
      });
    }
  });

  return (
    <div dir={dir} className="w-full space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs text-[var(--text-tertiary)]">
            <Link href="/admin" className="hover:text-[#C6A66B]">
              {isArabic ? "الرئيسية" : "Dashboard"}
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-semibold">
              {isArabic ? "معرض الأعمال" : "Portfolio"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Briefcase size={28} className="text-[#C6A66B]" />
            <span>{isArabic ? "إدارة معرض الأعمال والمشاريع" : "Portfolio CMS & Projects"}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#C6A66B] text-[#111111] hover:bg-[#D8BC84] transition-all shadow-md shadow-[#C6A66B]/20"
          >
            <PlusCircle size={16} />
            <span>{isArabic ? "إضافة مشروع جديد" : "Add New Project"}</span>
          </Link>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={refreshProjects}
            className="px-3 py-1 rounded-lg bg-rose-500/20 text-xs font-semibold hover:bg-rose-500/30"
          >
            {isArabic ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-stretch md:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute top-1/2 -translate-y-1/2 start-3 text-[var(--text-tertiary)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isArabic
                ? "ابحث بالعنوان، الكلمات المفتاحية، أو الأدوات..."
                : "Search by title, summary, or tools..."
            }
            className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[#C6A66B]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 -translate-y-1/2 end-3 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--text-tertiary)] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-[#C6A66B]"
          >
            <option value="all">{isArabic ? "جميع الحالات" : "All Statuses"}</option>
            <option value="published">{isArabic ? "منشور للعامة" : "Published"}</option>
            <option value="draft">{isArabic ? "مسودة مؤقتة" : "Draft"}</option>
            <option value="hidden">{isArabic ? "مخفي من العرض" : "Hidden"}</option>
          </select>
        </div>

        {/* Service Filter */}
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[var(--text-tertiary)] shrink-0" />
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-[#C6A66B]"
          >
            <option value="all">{isArabic ? "كافة الخدمات السبع" : "All Services"}</option>
            {Array.from(allServicesSet.entries()).map(([slug, name]) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List / Table */}
      {loading ? (
        <div className="w-full py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#C6A66B]" />
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            {isArabic ? "جاري تحميل مشاريع المعرض..." : "Loading projects..."}
          </span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center max-w-lg mx-auto space-y-4 my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center mx-auto border border-[#C6A66B]/30">
            <Briefcase size={28} />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            {isArabic ? "لا توجد مشاريع مطابقة" : "No Projects Found"}
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            {isArabic
              ? "لم يتم العثور على أي مشروع يتطابق مع معايير البحث أو التصفية الحالية."
              : "No projects match your current search query or active filters."}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/portfolio/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#C6A66B] text-[#111111] hover:bg-[#D8BC84] transition-all"
            >
              <PlusCircle size={14} />
              <span>{isArabic ? "إضافة أول مشروع الآن" : "Add Project Now"}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 text-[var(--text-tertiary)] uppercase font-mono text-[11px]">
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "المشروع" : "Project"}
                  </th>
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "الخدمة الرئيسية" : "Primary Service"}
                  </th>
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "الحالة" : "Status"}
                  </th>
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "النوع" : "Type"}
                  </th>
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "السنة" : "Year"}
                  </th>
                  <th className="py-3.5 px-4 text-end font-semibold">
                    {isArabic ? "الإجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredProjects.map((project) => {
                  const primaryService =
                    project.services?.find((s) => s.is_primary) || project.services?.[0];
                  const additionalServices = (project.services || []).filter(
                    (s) => !s.is_primary
                  );

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-[var(--bg-secondary)]/30 transition-colors group"
                    >
                      {/* Project info & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-11 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden shrink-0">
                            <Image
                              src={project.cover_image || "/images/portfolio/coffee-web.svg"}
                              alt={project.title_ar}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <span className="absolute bottom-0.5 start-0.5 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono font-bold text-[#C6A66B]">
                              {project.number || "01"}
                            </span>
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <h4 className="font-bold text-sm text-[var(--text-primary)] truncate group-hover:text-[#C6A66B] transition-colors">
                              {isArabic ? project.title_ar : project.title_en}
                            </h4>
                            <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                              {isArabic ? project.title_en : project.title_ar} • /{project.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Primary and additional services */}
                      <td className="py-3.5 px-4">
                        {primaryService ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30">
                              <span>
                                {isArabic ? primaryService.title_ar : primaryService.title_en}
                              </span>
                            </span>
                            {additionalServices.length > 0 && (
                              <span className="block text-[10px] text-[var(--text-tertiary)] mt-1">
                                +{additionalServices.length}{" "}
                                {isArabic ? "خدمات إضافية" : "more services"}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[var(--text-tertiary)] font-mono text-[11px]">
                            —
                          </span>
                        )}
                      </td>

                      {/* Status + Quick Toggle */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={project.status}
                            disabled={updatingStatusId === project.id}
                            onChange={(e) =>
                              handleQuickStatusChange(project.id, e.target.value)
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer focus:outline-none transition-all ${
                              project.status === "published"
                                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                                : project.status === "draft"
                                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                                : "bg-zinc-500/15 border-zinc-500/40 text-zinc-400"
                            } ${updatingStatusId === project.id ? "opacity-50" : ""}`}
                          >
                            <option value="published" className="bg-[#1a1a1a] text-white">
                              {isArabic ? "منشور" : "Published"}
                            </option>
                            <option value="draft" className="bg-[#1a1a1a] text-white">
                              {isArabic ? "مسودة" : "Draft"}
                            </option>
                            <option value="hidden" className="bg-[#1a1a1a] text-white">
                              {isArabic ? "مخفي" : "Hidden"}
                            </option>
                          </select>
                        </div>
                      </td>

                      {/* Concept vs Live */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            project.is_concept
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {project.is_concept ? "Concept" : "Live"}
                        </span>
                      </td>

                      {/* Year */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--text-secondary)]">
                        {project.year || "2026"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live preview modal button */}
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewProject(transformDbProjectToItem(project))
                            }
                            title={isArabic ? "معاينة الصفحة" : "Preview page"}
                            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/40 transition-colors"
                          >
                            <Eye size={15} />
                          </button>

                          {/* Public Page Link if published */}
                          {project.status === "published" && (
                            <Link
                              href={`/portfolio/${project.slug}`}
                              target="_blank"
                              title={isArabic ? "فتح الرابط العام" : "Open public URL"}
                              className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/40 transition-colors"
                            >
                              <ExternalLink size={15} />
                            </Link>
                          )}

                          {/* Edit Project */}
                          <Link
                            href={`/admin/portfolio/${project.id}/edit`}
                            title={isArabic ? "تعديل المشروع" : "Edit project"}
                            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
                          >
                            <Edit3 size={15} />
                          </Link>

                          {/* Delete Project (ADMIN ONLY) */}
                          {userRole === "admin" && (
                            <button
                              type="button"
                              onClick={() => setDeletingProject(project)}
                              title={isArabic ? "حذف المشروع (مدير فقط)" : "Delete project (Admin only)"}
                              className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (ADMIN STRICT) */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[var(--bg-surface)] border border-rose-500/30 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <ShieldAlert size={24} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {isArabic ? "تأكيد حذف المشروع نهائياً" : "Confirm Project Permanent Deletion"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {isArabic
                  ? `هل أنت متأكد من رغبتك في حذف "${deletingProject.title_ar}" نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to permanently delete "${deletingProject.title_en}"? This action cannot be undone.`}
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{isArabic ? "جاري الحذف..." : "Deleting..."}</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>{isArabic ? "نعم، حذف نهائي" : "Yes, Delete Permanently"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeletingProject(null);
                  setDeleteError(null);
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-bold border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-[var(--bg-primary)] border border-[#C6A66B]/40 rounded-3xl shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between p-4 px-6 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C6A66B]">
                <Eye size={16} />
                <span>
                  {isArabic
                    ? `معاينة حية للمشروع: ${previewProject.title[lang]}`
                    : `Live Preview: ${previewProject.title[lang]}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="p-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-rose-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-8">
              <PortfolioDetailView project={previewProject} isPreviewModal={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
