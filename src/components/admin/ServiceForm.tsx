"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { ServiceDetailView } from "@/sections/ServiceDetailView";
import { ServiceItem, ServiceDeliverable, ServiceProcessStep, ServiceGalleryItem } from "@/data/servicesData";
import { ExtendedPortfolioItem } from "@/lib/data/projects";
import {
  Save,
  Eye,
  X,
  Upload,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Tag,
  Lock,
  ExternalLink,
  Briefcase,
  Sliders,
  FileText,
  Activity,
  Image as ImageIcon,
} from "lucide-react";

export interface InitialServiceData {
  id: string;
  slug: string;
  number: string;
  title_ar: string;
  title_en: string;
  tagline_ar?: string | null;
  tagline_en?: string | null;
  short_description_ar: string;
  short_description_en: string;
  overview_ar: string;
  overview_en: string;
  key_metrics?: Array<{ value: string; label: { ar: string; en: string } }> | null;
  deliverables?: ServiceDeliverable[] | null;
  process?: ServiceProcessStep[] | null;
  tech_stack?: string[] | null;
  gallery?: ServiceGalleryItem[] | null;
  is_visible: boolean;
  sort_order: number;
  projects?: Array<{
    id: string;
    slug: string;
    number: string;
    title_ar: string;
    title_en: string;
    cover_image: string;
    status: string;
    is_concept: boolean;
    year: string;
    is_primary: boolean;
  }>;
}

export interface ServiceFormProps {
  serviceId: string;
  initialData: InitialServiceData;
}

type TabType = "basic" | "content" | "deliverables" | "gallery" | "projects";

export function ServiceForm({ serviceId, initialData }: ServiceFormProps) {
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>("basic");

  // Basic Info
  const [titleAr, setTitleAr] = useState(initialData.title_ar || "");
  const [titleEn, setTitleEn] = useState(initialData.title_en || "");
  const [number, setNumber] = useState(initialData.number || "01");
  const [sortOrder, setSortOrder] = useState<number>(initialData.sort_order ?? 1);
  const [isVisible, setIsVisible] = useState<boolean>(initialData.is_visible ?? true);
  const [taglineAr, setTaglineAr] = useState(initialData.tagline_ar || "");
  const [taglineEn, setTaglineEn] = useState(initialData.tagline_en || "");

  // Content
  const [shortDescAr, setShortDescAr] = useState(initialData.short_description_ar || "");
  const [shortDescEn, setShortDescEn] = useState(initialData.short_description_en || "");
  const [overviewAr, setOverviewAr] = useState(initialData.overview_ar || "");
  const [overviewEn, setOverviewEn] = useState(initialData.overview_en || "");

  // Key Metrics
  const [keyMetrics, setKeyMetrics] = useState<Array<{ value: string; label: { ar: string; en: string } }>>(
    Array.isArray(initialData.key_metrics) && initialData.key_metrics.length > 0
      ? initialData.key_metrics
      : [
          { value: "< 0.8s", label: { ar: "سرعة تحميل الصفحة", en: "First Contentful Paint" } },
          { value: "100%", label: { ar: "تجاوب كامل مع الأجهزة", en: "Responsive Fluidity" } },
          { value: "95+", label: { ar: "معدل معايير SEO والأداء", en: "Google Lighthouse Score" } },
        ]
  );

  // Deliverables
  const [deliverables, setDeliverables] = useState<ServiceDeliverable[]>(
    Array.isArray(initialData.deliverables) && initialData.deliverables.length > 0
      ? initialData.deliverables
      : [
          {
            title: { ar: "تصميم واجهات مخصصة", en: "Bespoke UI/UX Architecture" },
            desc: { ar: "تصاميم فريدة تعبر عن نبرة الفخامة والخصوصية.", en: "Custom tailored interface layouts reflecting quiet luxury." },
          },
        ]
  );

  // Process Steps
  const [processSteps, setProcessSteps] = useState<ServiceProcessStep[]>(
    Array.isArray(initialData.process) && initialData.process.length > 0
      ? initialData.process
      : [
          {
            step: "01",
            title: { ar: "التدقيق والتخطيط المعماري", en: "Architecture & Wireframing" },
            desc: { ar: "دراسة متطلبات الخدمة وتحديد المسار الأمثل.", en: "Defining the scope and high-conversion pathways." },
          },
        ]
  );

  // Tech Stack
  const [techStack, setTechStack] = useState<string[]>(
    Array.isArray(initialData.tech_stack) && initialData.tech_stack.length > 0
      ? initialData.tech_stack
      : ["Next.js", "TypeScript", "Tailwind CSS"]
  );
  const [newTechInput, setNewTechInput] = useState("");

  // Gallery
  const [gallery, setGallery] = useState<ServiceGalleryItem[]>(
    Array.isArray(initialData.gallery) && initialData.gallery.length > 0
      ? initialData.gallery
      : [
          {
            title: { ar: initialData.title_ar, en: initialData.title_en },
            desc: { ar: initialData.tagline_ar || "", en: initialData.tagline_en || "" },
            image: `/images/services/${initialData.slug}.svg`,
            tag: { ar: "خدمة رئيسية", en: "Core Service" },
          },
        ]
  );

  // Linked Projects (read-only from GET)
  const linkedProjects = initialData.projects || [];

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingGalleryIndex, setUploadingGalleryIndex] = useState<number | null>(null);
  const [isAddingNewImage, setIsAddingNewImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Handle Tag Input
  const handleAddTech = () => {
    const trimmed = newTechInput.trim();
    if (!trimmed) return;
    if (!techStack.includes(trimmed)) {
      setTechStack((prev) => [...prev, trimmed]);
    }
    setNewTechInput("");
  };

  const handleRemoveTech = (index: number) => {
    setTechStack((prev) => prev.filter((_, i) => i !== index));
  };

  // Gallery Image Upload Handler
  const handleUploadGalleryImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetIndex?: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetIndex !== undefined) {
      setUploadingGalleryIndex(targetIndex);
    } else {
      setIsAddingNewImage(true);
    }
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "service-images");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        const uploadedUrl = String(data.url).trim();
        if (targetIndex !== undefined) {
          // Replace image in existing slide
          setGallery((prev) =>
            prev.map((item, idx) =>
              idx === targetIndex ? { ...item, image: uploadedUrl } : item
            )
          );
        } else {
          // Add new slide
          const newSlide: ServiceGalleryItem = {
            title: { ar: titleAr || "شريحة جديدة", en: titleEn || "New Slide" },
            desc: { ar: taglineAr || "", en: taglineEn || "" },
            image: uploadedUrl,
            tag: { ar: "معرض الأعمال", en: "Showcase" },
          };
          setGallery((prev) => [...prev, newSlide]);
        }
      } else {
        throw new Error(data.error || "فشل رفع الصورة إلى السحابة");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء رفع الصورة";
      setErrorMessage(msg);
    } finally {
      setUploadingGalleryIndex(null);
      setIsAddingNewImage(false);
      e.target.value = "";
    }
  };

  // Reorder Gallery
  const moveGalleryItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === gallery.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...gallery];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setGallery(updated);
  };

  const removeGalleryItem = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      if (!titleAr.trim() || !titleEn.trim()) {
        throw new Error(isArabic ? "يرجى كتابة عنوان الخدمة بالعربية والإنجليزية" : "Title is required in both Arabic and English");
      }
      if (!shortDescAr.trim() || !shortDescEn.trim()) {
        throw new Error(isArabic ? "يرجى ملء الوصف القصير بالعربية والإنجليزية" : "Short description is required in both languages");
      }
      if (!overviewAr.trim() || !overviewEn.trim()) {
        throw new Error(isArabic ? "يرجى ملء نظرة عامة بالعربية والإنجليزية" : "Overview is required in both languages");
      }

      const payload = {
        title_ar: titleAr.trim(),
        title_en: titleEn.trim(),
        tagline_ar: taglineAr.trim() || null,
        tagline_en: taglineEn.trim() || null,
        short_description_ar: shortDescAr.trim(),
        short_description_en: shortDescEn.trim(),
        overview_ar: overviewAr.trim(),
        overview_en: overviewEn.trim(),
        key_metrics: keyMetrics,
        deliverables: deliverables,
        process: processSteps,
        tech_stack: techStack,
        gallery: gallery,
        is_visible: isVisible,
        sort_order: Number(sortOrder) || 1,
      };

      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل حفظ بيانات الخدمة");
      }

      setSuccessMessage(
        isArabic
          ? "تم حفظ وتحديث بيانات الخدمة بنجاح، وتحديث الصفحات العامة فورياً!"
          : "Service details successfully updated and cache revalidated!"
      );

      // Auto dismiss success toast after 5s
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الخدمة";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare Live Preview Model
  const currentPreviewService: ServiceItem = {
    slug: initialData.slug,
    number: number,
    title: { ar: titleAr || initialData.title_ar, en: titleEn || initialData.title_en },
    tagline: { ar: taglineAr || "", en: taglineEn || "" },
    shortDescription: { ar: shortDescAr || "", en: shortDescEn || "" },
    overview: { ar: overviewAr || "", en: overviewEn || "" },
    keyMetrics: keyMetrics,
    deliverables: deliverables,
    process: processSteps,
    techStack: techStack,
    gallery: gallery.length > 0 ? gallery : [
      {
        title: { ar: titleAr, en: titleEn },
        desc: { ar: taglineAr, en: taglineEn },
        image: `/images/services/${initialData.slug}.svg`,
        tag: { ar: "خدمة", en: "Service" },
      }
    ],
  };

  const previewRelatedProjects: ExtendedPortfolioItem[] = linkedProjects.map((p) => ({
    id: p.id,
    slug: p.slug,
    number: p.number,
    title: { ar: p.title_ar, en: p.title_en },
    summary: { ar: "", en: "" },
    category: "web-design",
    categoryName: { ar: "خدمة", en: "Service" },
    challenge: { ar: "", en: "" },
    solution: { ar: "", en: "" },
    coverImage: p.cover_image,
    gallery: [p.cover_image],
    deliverables: [],
    tools: [],
    status: (p.is_concept ? "concept" : "real") as "concept" | "real",
    isConcept: p.is_concept,
    year: p.year,
  }));

  return (
    <div dir={dir} className="w-full pb-20">
      {/* Top Header & Action Bar */}
      <div className="sticky top-0 z-30 mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-[var(--bg-canvas)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#C6A66B]/40 transition-colors"
            title={isArabic ? "العودة لقائمة الخدمات" : "Back to Services"}
          >
            {isArabic ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#C6A66B]/20 text-[#C6A66B] font-mono text-xs font-bold flex items-center justify-center">
                {number}
              </span>
              <h1 className="text-lg font-bold text-[var(--text-primary)]">
                {isArabic ? `تعديل خدمة: ${titleAr}` : `Edit Service: ${titleEn}`}
              </h1>
            </div>
            {/* Slug Lock Badge */}
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)]"
                title={isArabic ? "الرابط الثابت محمي للحفاظ على بنية الروابط ونتائج محركات البحث" : "Permalink is immutable"}
              >
                <Lock size={10} className="text-[#C6A66B]" />
                <span>/services/{initialData.slug}</span>
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)]">
                {isArabic ? "(رابط دائم محمي)" : "(Permanent Link)"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href={`/services/${initialData.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#C6A66B]/40 transition-all"
          >
            <ExternalLink size={14} className="text-[#C6A66B]" />
            <span>{isArabic ? "عرض بالموقع" : "View Live"}</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#C6A66B]/30 bg-[#C6A66B]/10 text-xs font-semibold text-[#C6A66B] hover:bg-[#C6A66B]/20 transition-all cursor-pointer"
          >
            <Eye size={14} />
            <span>{isArabic ? "معاينة حية" : "Live Preview"}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#C6A66B] to-[#b39358] text-black text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{isArabic ? "جاري الحفظ..." : "Saving..."}</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>{isArabic ? "حفظ التغييرات" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="shrink-0" />
          <span className="flex-1">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400/60 hover:text-emerald-400 p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-xs font-semibold animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400/60 hover:text-rose-400 p-1"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-[var(--border-subtle)] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "basic"
              ? "bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <Sliders size={14} />
          <span>{isArabic ? "البيانات الأساسية" : "Basic Info"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "content"
              ? "bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <FileText size={14} />
          <span>{isArabic ? "الوصف والنظرة العامة" : "Content & Overview"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("deliverables")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "deliverables"
              ? "bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <Activity size={14} />
          <span>{isArabic ? "المؤشرات، المخرجات ومراحل العمل" : "Metrics & Process"}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "gallery"
              ? "bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <ImageIcon size={14} />
          <span>{isArabic ? "التقنيات ومعرض الصور" : "Tech Stack & Gallery"}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-[var(--bg-secondary)] text-[10px] text-[var(--text-tertiary)]">
            {gallery.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "projects"
              ? "bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <Briefcase size={14} />
          <span>{isArabic ? "المشاريع المرتبطة" : "Linked Projects"}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-[var(--bg-secondary)] text-[10px] text-[var(--text-tertiary)]">
            {linkedProjects.length}
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ================= TAB 1: BASIC INFO ================= */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
                <Sliders size={16} className="text-[#C6A66B]" />
                <span>{isArabic ? "التعريف والهوية الأساسية" : "Identification & Core Details"}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title AR */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)]">
                    {isArabic ? "عنوان الخدمة بالعربية *" : "Arabic Service Title *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: تطوير المواقع الإلكترونية"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none transition-colors"
                  />
                </div>

                {/* Title EN */}
                <div className="space-y-2" dir="ltr">
                  <label className="block text-xs font-bold text-[var(--text-secondary)]">
                    English Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Website Design & Development"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none transition-colors"
                  />
                </div>

                {/* Number & Sort Order */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[var(--text-secondary)]">
                      {isArabic ? "رقم العرض" : "Display Number"}
                    </label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="01"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:border-[#C6A66B] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[var(--text-secondary)]">
                      {isArabic ? "ترتيب الظهور" : "Sort Order"}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:border-[#C6A66B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Visibility Toggle Switch */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)]">
                    {isArabic ? "حالة الظهور في الموقع" : "Visibility Status"}
                  </label>
                  <div className="p-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isVisible ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-zinc-500"
                        }`}
                      />
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {isVisible
                          ? isArabic
                            ? "ظاهرة في صفحات الموقع والقائمة"
                            : "Visible across public pages"
                          : isArabic
                          ? "مخفية مؤقتاً من الموقع"
                          : "Temporarily hidden"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsVisible(!isVisible)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        isVisible ? "bg-emerald-500" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isVisible ? (isArabic ? "-translate-x-6" : "translate-x-6") : (isArabic ? "-translate-x-1" : "translate-x-1")
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Tagline AR */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)]">
                    {isArabic ? "الشعار النصي (Tagline بالعربية)" : "Arabic Tagline"}
                  </label>
                  <input
                    type="text"
                    value={taglineAr}
                    onChange={(e) => setTaglineAr(e.target.value)}
                    placeholder="مثال: تصميم وتطوير مواقع إلكترونية فاخرة، فائقة السرعة..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none transition-colors"
                  />
                </div>

                {/* Tagline EN */}
                <div className="space-y-2 md:col-span-2" dir="ltr">
                  <label className="block text-xs font-bold text-[var(--text-secondary)]">
                    English Tagline
                  </label>
                  <input
                    type="text"
                    value={taglineEn}
                    onChange={(e) => setTaglineEn(e.target.value)}
                    placeholder="e.g. Designing and engineering elite, high-performance websites..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EDITORIAL CONTENT ================= */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
                <FileText size={16} className="text-[#C6A66B]" />
                <span>{isArabic ? "الوصف القصير والنظرة العامة الشاملة" : "Short Description & Overview"}</span>
              </h2>

              {/* Short Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)]">
                    {isArabic ? "الوصف المختصر (بالعربية) *" : "Arabic Short Description *"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={shortDescAr}
                    onChange={(e) => setShortDescAr(e.target.value)}
                    placeholder="يظهر في بطاقات الخدمات والقوائم التعريفية..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none transition-colors leading-relaxed"
                  />
                </div>

                <div className="space-y-2" dir="ltr">
                  <label className="block text-xs font-bold text-[var(--text-secondary)]">
                    English Short Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={shortDescEn}
                    onChange={(e) => setShortDescEn(e.target.value)}
                    placeholder="Appears in cards and section previews..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none transition-colors leading-relaxed"
                  />
                </div>
              </div>

              {/* Detailed Overviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-[var(--border-subtle)]">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--text-secondary)]">
                    {isArabic ? "النظرة العامة المفصلة (بالعربية) *" : "Arabic Full Overview *"}
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={overviewAr}
                    onChange={(e) => setOverviewAr(e.target.value)}
                    placeholder="النص التعريفي الكامل الذي يظهر في صدر صفحة الخدمة..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none transition-colors leading-relaxed"
                  />
                </div>

                <div className="space-y-2" dir="ltr">
                  <label className="block text-xs font-bold text-[var(--text-secondary)]">
                    English Full Overview *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={overviewEn}
                    onChange={(e) => setOverviewEn(e.target.value)}
                    placeholder="Comprehensive institutional overview presented on the service detail page..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none transition-colors leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: METRICS, DELIVERABLES & PROCESS ================= */}
        {activeTab === "deliverables" && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles size={16} className="text-[#C6A66B]" />
                  <span>{isArabic ? "المؤشرات الرقمية (Key Metrics)" : "Key Metrics"}</span>
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setKeyMetrics((prev) => [
                      ...prev,
                      { value: "100%", label: { ar: "مؤشر جديد", en: "New Metric" } },
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30 hover:bg-[#C6A66B]/25 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>{isArabic ? "إضافة مؤشر" : "Add Metric"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {keyMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#C6A66B] font-bold">
                        #{index + 1}
                      </span>
                      {keyMetrics.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setKeyMetrics((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="text-[var(--text-tertiary)] hover:text-rose-400 transition-colors p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                        {isArabic ? "القيمة (Value)" : "Value"}
                      </label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => {
                          const updated = [...keyMetrics];
                          updated[index].value = e.target.value;
                          setKeyMetrics(updated);
                        }}
                        placeholder="< 0.8s"
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[#C6A66B] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                        {isArabic ? "التسمية بالعربية" : "Arabic Label"}
                      </label>
                      <input
                        type="text"
                        value={metric.label.ar}
                        onChange={(e) => {
                          const updated = [...keyMetrics];
                          updated[index].label.ar = e.target.value;
                          setKeyMetrics(updated);
                        }}
                        placeholder="سرعة التحميل"
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1" dir="ltr">
                      <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                        English Label
                      </label>
                      <input
                        type="text"
                        value={metric.label.en}
                        onChange={(e) => {
                          const updated = [...keyMetrics];
                          updated[index].label.en = e.target.value;
                          setKeyMetrics(updated);
                        }}
                        placeholder="Load Speed"
                        className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#C6A66B]" />
                  <span>{isArabic ? "مخرجات وحلول الخدمة (Deliverables)" : "Deliverables"}</span>
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setDeliverables((prev) => [
                      ...prev,
                      {
                        title: { ar: "مخرج جديد", en: "New Deliverable" },
                        desc: { ar: "وصف المخرج والحل المقترح", en: "Detailed deliverable description" },
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30 hover:bg-[#C6A66B]/25 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>{isArabic ? "إضافة مخرج" : "Add Deliverable"}</span>
                </button>
              </div>

              <div className="space-y-4">
                {deliverables.map((deliv, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-lg bg-[#C6A66B]/15 text-[#C6A66B] font-mono font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      {deliverables.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setDeliverables((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="text-[var(--text-tertiary)] hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                          {isArabic ? "عنوان المخرج (بالعربية)" : "Arabic Title"}
                        </label>
                        <input
                          type="text"
                          value={deliv.title.ar}
                          onChange={(e) => {
                            const updated = [...deliverables];
                            updated[index].title.ar = e.target.value;
                            setDeliverables(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2" dir="ltr">
                        <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                          English Title
                        </label>
                        <input
                          type="text"
                          value={deliv.title.en}
                          onChange={(e) => {
                            const updated = [...deliverables];
                            updated[index].title.en = e.target.value;
                            setDeliverables(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                          {isArabic ? "الوصف والتفاصيل (بالعربية)" : "Arabic Description"}
                        </label>
                        <textarea
                          rows={2}
                          value={deliv.desc.ar}
                          onChange={(e) => {
                            const updated = [...deliverables];
                            updated[index].desc.ar = e.target.value;
                            setDeliverables(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2" dir="ltr">
                        <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                          English Description
                        </label>
                        <textarea
                          rows={2}
                          value={deliv.desc.en}
                          onChange={(e) => {
                            const updated = [...deliverables];
                            updated[index].desc.en = e.target.value;
                            setDeliverables(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Layers size={16} className="text-[#C6A66B]" />
                  <span>{isArabic ? "مراحل وخطوات العمل (Process Steps)" : "Process Steps"}</span>
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setProcessSteps((prev) => [
                      ...prev,
                      {
                        step: String(prev.length + 1).padStart(2, "0"),
                        title: { ar: "مرحلة جديدة", en: "New Step" },
                        desc: { ar: "تفاصيل المرحلة وإجراءاتها", en: "Step execution details" },
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30 hover:bg-[#C6A66B]/25 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>{isArabic ? "إضافة خطوة" : "Add Step"}</span>
                </button>
              </div>

              <div className="space-y-4">
                {processSteps.map((step, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--text-tertiary)]">
                          {isArabic ? "رقم المرحلة:" : "Step Number:"}
                        </span>
                        <input
                          type="text"
                          value={step.step}
                          onChange={(e) => {
                            const updated = [...processSteps];
                            updated[index].step = e.target.value;
                            setProcessSteps(updated);
                          }}
                          className="w-14 px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[#C6A66B] text-center focus:outline-none"
                        />
                      </div>

                      {processSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setProcessSteps((prev) => prev.filter((_, i) => i !== index))
                          }
                          className="text-[var(--text-tertiary)] hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                          {isArabic ? "عنوان الخطوة (بالعربية)" : "Arabic Title"}
                        </label>
                        <input
                          type="text"
                          value={step.title.ar}
                          onChange={(e) => {
                            const updated = [...processSteps];
                            updated[index].title.ar = e.target.value;
                            setProcessSteps(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2" dir="ltr">
                        <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                          English Title
                        </label>
                        <input
                          type="text"
                          value={step.title.en}
                          onChange={(e) => {
                            const updated = [...processSteps];
                            updated[index].title.en = e.target.value;
                            setProcessSteps(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                          {isArabic ? "شرح الخطوة (بالعربية)" : "Arabic Description"}
                        </label>
                        <textarea
                          rows={2}
                          value={step.desc.ar}
                          onChange={(e) => {
                            const updated = [...processSteps];
                            updated[index].desc.ar = e.target.value;
                            setProcessSteps(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2" dir="ltr">
                        <label className="block text-[11px] font-semibold text-[var(--text-tertiary)]">
                          English Description
                        </label>
                        <textarea
                          rows={2}
                          value={step.desc.en}
                          onChange={(e) => {
                            const updated = [...processSteps];
                            updated[index].desc.en = e.target.value;
                            setProcessSteps(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: TECH STACK & GALLERY ================= */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            {/* Tech Stack */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
                <Tag size={16} className="text-[#C6A66B]" />
                <span>{isArabic ? "التقنيات والأدوات (Tech Stack)" : "Tech Stack & Tools"}</span>
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] group"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(index)}
                      className="text-[var(--text-tertiary)] hover:text-rose-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-md pt-2">
                <input
                  type="text"
                  value={newTechInput}
                  onChange={(e) => setNewTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder={isArabic ? "أضف تقنية (مثال: Next.js)..." : "Add technology tag..."}
                  className="flex-1 px-4 py-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-[#C6A66B] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#C6A66B]/50 hover:text-[#C6A66B] transition-colors cursor-pointer"
                >
                  {isArabic ? "إضافة" : "Add"}
                </button>
              </div>
            </div>

            {/* Gallery Manager */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div>
                  <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <ImageIcon size={16} className="text-[#C6A66B]" />
                    <span>{isArabic ? "معرض صور الخدمة (Gallery)" : "Service Gallery"}</span>
                  </h2>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    {isArabic
                      ? "تُرفع الصور تلقائياً إلى مجلد الخدمة بسحابة Supabase Storage (service-images)"
                      : "Images are uploaded directly to Supabase Storage (service-images bucket)"}
                  </p>
                </div>

                {/* Upload New Slide Button */}
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30 hover:bg-[#C6A66B]/25 text-xs font-semibold transition-all cursor-pointer">
                  {isAddingNewImage ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{isArabic ? "جاري الرفع..." : "Uploading..."}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>{isArabic ? "رفع شريحة جديدة" : "Upload Slide"}</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isAddingNewImage}
                    onChange={(e) => handleUploadGalleryImage(e)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Gallery List */}
              <div className="space-y-4">
                {gallery.map((item, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#C6A66B]/15 text-[#C6A66B] font-mono font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          {isArabic ? `شريحة العرض #${index + 1}` : `Slide #${index + 1}`}
                        </span>
                      </div>

                      {/* Controls: Move Up, Move Down, Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveGalleryItem(index, "up")}
                          className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
                          title={isArabic ? "تحريك لأعلى" : "Move Up"}
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={index === gallery.length - 1}
                          onClick={() => moveGalleryItem(index, "down")}
                          className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30 transition-colors"
                          title={isArabic ? "تحريك لأسفل" : "Move Down"}
                        >
                          <ArrowDown size={13} />
                        </button>
                        {gallery.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(index)}
                            className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:text-rose-400 transition-colors ms-1"
                            title={isArabic ? "حذف الشريحة" : "Delete Slide"}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      {/* Image Thumbnail & Upload Replace */}
                      <div className="space-y-2">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-[var(--border-subtle)] group">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title?.ar || "Slide"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-tertiary)]">
                              No Image
                            </div>
                          )}

                          {/* Hover Upload Overlay */}
                          <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white text-xs font-semibold cursor-pointer">
                            {uploadingGalleryIndex === index ? (
                              <Loader2 size={18} className="animate-spin text-[#C6A66B]" />
                            ) : (
                              <>
                                <Upload size={16} />
                                <span>{isArabic ? "استبدال الصورة" : "Replace Image"}</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingGalleryIndex === index}
                              onChange={(e) => handleUploadGalleryImage(e, index)}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => {
                            const updated = [...gallery];
                            updated[index].image = e.target.value;
                            setGallery(updated);
                          }}
                          placeholder="/images/services/..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-tertiary)] focus:outline-none"
                        />
                      </div>

                      {/* Content Fields */}
                      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Tag AR & EN */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-semibold text-[var(--text-tertiary)]">
                            {isArabic ? "وسم الشريحة (بالعربية)" : "Tag (Arabic)"}
                          </label>
                          <input
                            type="text"
                            value={item.tag?.ar || ""}
                            onChange={(e) => {
                              const updated = [...gallery];
                              updated[index].tag = { ...updated[index].tag, ar: e.target.value };
                              setGallery(updated);
                            }}
                            placeholder="مثال: واجهة المستخدم"
                            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1" dir="ltr">
                          <label className="block text-[10px] font-semibold text-[var(--text-tertiary)]">
                            Tag (English)
                          </label>
                          <input
                            type="text"
                            value={item.tag?.en || ""}
                            onChange={(e) => {
                              const updated = [...gallery];
                              updated[index].tag = { ...updated[index].tag, en: e.target.value };
                              setGallery(updated);
                            }}
                            placeholder="e.g. User Interface"
                            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                          />
                        </div>

                        {/* Title AR & EN */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-semibold text-[var(--text-tertiary)]">
                            {isArabic ? "عنوان الشريحة (بالعربية)" : "Slide Title (Arabic)"}
                          </label>
                          <input
                            type="text"
                            value={item.title?.ar || ""}
                            onChange={(e) => {
                              const updated = [...gallery];
                              updated[index].title = { ...updated[index].title, ar: e.target.value };
                              setGallery(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1" dir="ltr">
                          <label className="block text-[10px] font-semibold text-[var(--text-tertiary)]">
                            Slide Title (English)
                          </label>
                          <input
                            type="text"
                            value={item.title?.en || ""}
                            onChange={(e) => {
                              const updated = [...gallery];
                              updated[index].title = { ...updated[index].title, en: e.target.value };
                              setGallery(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                          />
                        </div>

                        {/* Desc AR & EN */}
                        <div className="space-y-1 sm:col-span-2">
                          <label className="block text-[10px] font-semibold text-[var(--text-tertiary)]">
                            {isArabic ? "وصف الشريحة (بالعربية)" : "Slide Description (Arabic)"}
                          </label>
                          <input
                            type="text"
                            value={item.desc?.ar || ""}
                            onChange={(e) => {
                              const updated = [...gallery];
                              updated[index].desc = { ...updated[index].desc, ar: e.target.value };
                              setGallery(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2" dir="ltr">
                          <label className="block text-[10px] font-semibold text-[var(--text-tertiary)]">
                            Slide Description (English)
                          </label>
                          <input
                            type="text"
                            value={item.desc?.en || ""}
                            onChange={(e) => {
                              const updated = [...gallery];
                              updated[index].desc = { ...updated[index].desc, en: e.target.value };
                              setGallery(updated);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: LINKED PROJECTS ================= */}
        {activeTab === "projects" && (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
            <div className="pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Briefcase size={16} className="text-[#C6A66B]" />
                <span>
                  {isArabic
                    ? `المشاريع المرتبطة بهده الخدمة (${linkedProjects.length})`
                    : `Projects Linked to this Service (${linkedProjects.length})`}
                </span>
              </h2>
              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                {isArabic
                  ? "يتم ربط المشاريع بالخدمات تلقائياً عبر جدول الربط project_services من خلال صفحة تحرير أي مشروع في معرض الأعمال."
                  : "Projects are linked to services from each project edit page in the portfolio CMS."}
              </p>
            </div>

            {linkedProjects.length === 0 ? (
              <div className="py-12 text-center max-w-sm mx-auto space-y-3">
                <Briefcase size={32} className="text-[var(--text-tertiary)] mx-auto" />
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {isArabic ? "لا توجد مشاريع مرتبطة حالياً" : "No Projects Linked"}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {isArabic
                    ? "يمكنك ربط أي مشروع بهذه الخدمة بالدخول إلى إدارة معرض الأعمال واختيار هذه الخدمة في قسم الخدمات."
                    : "You can associate projects with this service by editing any project in the Portfolio CMS."}
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin/portfolio"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] hover:border-[#C6A66B]/50 transition-colors"
                  >
                    <span>{isArabic ? "الانتقال لمعرض الأعمال" : "Go to Portfolio CMS"}</span>
                    {isArabic ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {linkedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between group hover:border-[#C6A66B]/30 transition-colors"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-[var(--border-subtle)] mb-3">
                        {project.cover_image ? (
                          <Image
                            src={project.cover_image}
                            alt={project.title_ar || "Project"}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-tertiary)]">
                            No Cover
                          </div>
                        )}
                        {/* Primary Badge */}
                        {project.is_primary && (
                          <span className="absolute top-2 start-2 px-2 py-0.5 rounded-md bg-[#C6A66B] text-black font-bold text-[10px] shadow">
                            {isArabic ? "خدمة رئيسية" : "Primary Service"}
                          </span>
                        )}
                      </div>

                      {/* Number & Titles */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#C6A66B]">
                          #{project.number}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                          {project.year}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">
                        {isArabic ? project.title_ar : project.title_en}
                      </h4>
                      <p className="text-[10px] text-[var(--text-tertiary)] line-clamp-1 font-mono">
                        /portfolio/{project.slug}
                      </p>
                    </div>

                    {/* Action link */}
                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                        {project.status === "published"
                          ? isArabic
                            ? "منشور"
                            : "Published"
                          : isArabic
                          ? "مسودة"
                          : "Draft"}
                      </span>

                      <Link
                        href={`/admin/portfolio/${project.id}/edit`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C6A66B] hover:underline"
                      >
                        <span>{isArabic ? "تعديل المشروع" : "Edit Project"}</span>
                        {isArabic ? <ArrowLeft size={11} /> : <ArrowRight size={11} />}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </form>

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col">
          {/* Preview Modal Header */}
          <div className="p-4 bg-[var(--bg-canvas)] border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {isArabic
                  ? `معاينة حية لقالب الخدمة: ${titleAr}`
                  : `Live Service Preview: ${titleEn}`}
              </span>
            </div>

            <button
              onClick={() => setShowPreviewModal(false)}
              className="p-1.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto">
            <ServiceDetailView
              slug={initialData.slug}
              service={currentPreviewService}
              relatedProjects={previewRelatedProjects}
            />
          </div>
        </div>
      )}
    </div>
  );
}
