"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import {
  Layers,
  ExternalLink,
  Edit3,
  Eye,
  EyeOff,
  Briefcase,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

interface AdminServiceItem {
  id: string;
  slug: string;
  number: string;
  title_ar: string;
  title_en: string;
  tagline_ar?: string | null;
  tagline_en?: string | null;
  short_description_ar: string;
  short_description_en: string;
  is_visible: boolean;
  sort_order: number;
  projects_count: number;
}

export default function AdminServicesPage() {
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";

  const [services, setServices] = useState<AdminServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/services");
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل تحميل قائمة الخدمات");
      }

      setServices(data.services || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تحميل الخدمات";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/services");
        const data = await res.json();
        if (isMounted) {
          if (!res.ok || !data.success) {
            setError(data.error || "فشل تحميل قائمة الخدمات");
          } else {
            setServices(data.services || []);
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تحميل الخدمات";
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

  const handleToggleVisibility = async (service: AdminServiceItem) => {
    setTogglingId(service.id);
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_visible: !service.is_visible }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل تغيير حالة الظهور للخدمة");
      }

      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, is_visible: !s.is_visible } : s))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تغيير الحالة";
      alert(msg);
    } finally {
      setTogglingId(null);
    }
  };

  const filteredServices = services.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      s.title_ar?.toLowerCase().includes(q) ||
      s.title_en?.toLowerCase().includes(q) ||
      s.slug?.toLowerCase().includes(q) ||
      s.number?.includes(q)
    );
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
              {isArabic ? "إدارة الخدمات" : "Services"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Layers size={28} className="text-[#C6A66B]" />
            <span>{isArabic ? "إدارة الخدمات والحلول الرقمية" : "Services & Disciplines CMS"}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/services"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[#C6A66B] transition-all shadow-sm"
          >
            <span>{isArabic ? "معاينة صفحة الخدمات العامة" : "Live Services Page"}</span>
            <ExternalLink size={14} />
          </Link>
          <button
            onClick={fetchServices}
            title={isArabic ? "تحديث القائمة" : "Refresh list"}
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Alert Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchServices}
            className="px-3 py-1 rounded-lg bg-rose-500/20 text-xs font-semibold hover:bg-rose-500/30"
          >
            {isArabic ? "إعادة المحاولة" : "Retry"}
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="relative">
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
                ? "ابحث باسم الخدمة، الرابط، أو الرقم..."
                : "Search services by title, slug, or number..."
            }
            className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[#C6A66B]"
          />
        </div>
      </div>

      {/* Services Table */}
      {loading ? (
        <div className="w-full py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#C6A66B]" />
          <span className="text-xs font-semibold text-[var(--text-secondary)]">
            {isArabic ? "جاري تحميل الخدمات..." : "Loading services..."}
          </span>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-center max-w-lg mx-auto space-y-3">
          <Layers size={32} className="text-[var(--text-tertiary)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            {isArabic ? "لا توجد خدمات مطابقة" : "No services found"}
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            {isArabic ? "لم يتم العثور على أي خدمة تطابق معايير البحث." : "No services matched your query."}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 text-[var(--text-tertiary)] uppercase font-mono text-[11px]">
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "الرقم والخدمة" : "# & Service"}
                  </th>
                  <th className="py-3.5 px-4 text-start font-semibold">
                    {isArabic ? "الرابط الثابت (Slug)" : "Permalink"}
                  </th>
                  <th className="py-3.5 px-4 text-center font-semibold">
                    {isArabic ? "المشاريع المرتبطة" : "Projects"}
                  </th>
                  <th className="py-3.5 px-4 text-center font-semibold">
                    {isArabic ? "حالة الظهور" : "Visibility"}
                  </th>
                  <th className="py-3.5 px-4 text-center font-semibold">
                    {isArabic ? "الترتيب" : "Order"}
                  </th>
                  <th className="py-3.5 px-4 text-end font-semibold">
                    {isArabic ? "الإجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-[var(--bg-secondary)]/30 transition-colors group"
                  >
                    {/* Number & Titles */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                          {service.number}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors">
                            {isArabic ? service.title_ar : service.title_en}
                          </h4>
                          <p className="text-[11px] text-[var(--text-tertiary)]">
                            {isArabic ? service.title_en : service.title_ar}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-4 font-mono text-[11px] text-[var(--text-secondary)]">
                      <span className="px-2 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        /services/{service.slug}
                      </span>
                    </td>

                    {/* Linked Projects Count */}
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#C6A66B]/10 text-[#C6A66B] border border-[#C6A66B]/30">
                        <Briefcase size={12} />
                        <span>{service.projects_count}</span>
                        <span>{isArabic ? "مشاريع" : "works"}</span>
                      </span>
                    </td>

                    {/* Visibility Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        disabled={togglingId === service.id}
                        onClick={() => handleToggleVisibility(service)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                          service.is_visible
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                            : "bg-zinc-500/15 border-zinc-500/40 text-zinc-400 hover:bg-zinc-500/25"
                        } ${togglingId === service.id ? "opacity-50" : ""}`}
                      >
                        {service.is_visible ? (
                          <>
                            <Eye size={12} />
                            <span>{isArabic ? "ظاهرة بالموقع" : "Visible"}</span>
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            <span>{isArabic ? "مخفية" : "Hidden"}</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Sort Order */}
                    <td className="py-4 px-4 text-center font-mono font-bold text-xs text-[var(--text-secondary)]">
                      {service.sort_order}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[#C6A66B]/50 hover:text-[#C6A66B] text-xs font-semibold transition-all"
                        >
                          <Edit3 size={13} />
                          <span>{isArabic ? "تعديل" : "Edit"}</span>
                        </Link>

                        {/* View Live */}
                        <Link
                          href={`/services/${service.slug}`}
                          target="_blank"
                          title={isArabic ? "فتح الخدمة في الموقع" : "View Live"}
                          className="p-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-tertiary)] hover:text-[#C6A66B] transition-colors"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
