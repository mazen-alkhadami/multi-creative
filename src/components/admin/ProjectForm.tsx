"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { PortfolioDetailView } from "@/sections/PortfolioDetailView";
import { ExtendedPortfolioItem } from "@/lib/data/projects";
import { servicesData } from "@/data/servicesData";
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
} from "lucide-react";

interface ServiceOption {
  id: string;
  slug: string;
  number: string;
  title_ar: string;
  title_en: string;
}

interface DeliverableItem {
  ar: string;
  en: string;
}

export interface InitialProjectData {
  id?: string;
  slug?: string;
  number?: string;
  title_ar?: string;
  title_en?: string;
  summary_ar?: string;
  summary_en?: string;
  description_ar?: string | null;
  description_en?: string | null;
  challenge_ar?: string | null;
  challenge_en?: string | null;
  solution_ar?: string | null;
  solution_en?: string | null;
  result_ar?: string | null;
  result_en?: string | null;
  deliverables?: DeliverableItem[] | null;
  tools?: string[] | null;
  cover_image?: string;
  coverImage?: string;
  gallery?: string[] | null;
  preview_url?: string | null;
  status?: "draft" | "published" | "hidden";
  is_concept?: boolean;
  year?: string;
  services?: Array<{ id: string; slug: string; title_ar: string; title_en: string; is_primary: boolean }> | null;
}

export interface ProjectFormProps {
  mode: "create" | "edit";
  projectId?: string;
  initialData?: InitialProjectData | null;
}

export function ProjectForm({ mode, projectId, initialData }: ProjectFormProps) {
  const router = useRouter();
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";

  // Form States
  const [titleAr, setTitleAr] = useState(initialData?.title_ar || "");
  const [titleEn, setTitleEn] = useState(initialData?.title_en || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugEditedManually, setSlugEditedManually] = useState(Boolean(initialData?.slug));
  const [number, setNumber] = useState(initialData?.number || "01");
  const [summaryAr, setSummaryAr] = useState(initialData?.summary_ar || "");
  const [summaryEn, setSummaryEn] = useState(initialData?.summary_en || "");
  const [descriptionAr, setDescriptionAr] = useState(initialData?.description_ar || "");
  const [descriptionEn, setDescriptionEn] = useState(initialData?.description_en || "");
  const [challengeAr, setChallengeAr] = useState(initialData?.challenge_ar || "");
  const [challengeEn, setChallengeEn] = useState(initialData?.challenge_en || "");
  const [solutionAr, setSolutionAr] = useState(initialData?.solution_ar || "");
  const [solutionEn, setSolutionEn] = useState(initialData?.solution_en || "");
  const [resultAr, setResultAr] = useState(initialData?.result_ar || "");
  const [resultEn, setResultEn] = useState(initialData?.result_en || "");
  const [year, setYear] = useState(initialData?.year || "2026");
  const [isConcept, setIsConcept] = useState<boolean>(initialData?.is_concept ?? true);
  const [previewUrl, setPreviewUrl] = useState(initialData?.preview_url || "");
  const [status, setStatus] = useState<"draft" | "published" | "hidden">(
    initialData?.status || "published"
  );

  // Deliverables
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(
    Array.isArray(initialData?.deliverables) && initialData.deliverables.length > 0
      ? initialData.deliverables
      : [{ ar: "تصميم واجهة المستخدم وتجربة الاستخدام", en: "UI/UX Design & Architecture" }]
  );

  // Tools
  const [tools, setTools] = useState<string[]>(
    Array.isArray(initialData?.tools) && initialData.tools.length > 0
      ? initialData.tools
      : ["Next.js", "Tailwind CSS", "TypeScript"]
  );
  const [newToolInput, setNewToolInput] = useState("");

  // Initial Services Extraction
  const initialServices = Array.isArray(initialData?.services)
    ? (initialData.services as Array<{ id: string; is_primary: boolean }>)
    : [];
  const initialPrimary = initialServices.find((s) => s.is_primary)?.id || "";
  const initialAdditionals = initialServices.filter((s) => !s.is_primary).map((s) => s.id);

  // Services
  const [servicesList, setServicesList] = useState<ServiceOption[]>([]);
  const [primaryServiceId, setPrimaryServiceId] = useState<string>(initialPrimary);
  const [additionalServiceIds, setAdditionalServiceIds] = useState<string[]>(initialAdditionals);

  // Images
  const initialCover =
    initialData?.cover_image ||
    initialData?.coverImage ||
    "/images/portfolio/coffee-web.svg";
  const [coverImage, setCoverImage] = useState<string>(initialCover);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>(
    Array.isArray(initialData?.gallery) && initialData.gallery.length > 0
      ? initialData.gallery
      : [initialCover]
  );

  // Status & UI States
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Handle Title EN change with auto-slug
  const handleTitleEnChange = (val: string) => {
    setTitleEn(val);
    if (!slugEditedManually && mode === "create") {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  // Load available services
  useEffect(() => {
    let isMounted = true;
    async function fetchServices() {
      try {
        const res = await fetch("/api/admin/services");
        const json = await res.json();
        if (json.success && Array.isArray(json.services) && json.services.length > 0) {
          if (isMounted) {
            setServicesList(json.services);
            setPrimaryServiceId((prev) => prev || json.services[0].id);
          }
        } else {
          // Fallback to static servicesData mapping with pseudo IDs
          const fallback: ServiceOption[] = servicesData.map((s) => ({
            id: s.slug,
            slug: s.slug,
            number: s.number,
            title_ar: s.title.ar,
            title_en: s.title.en,
          }));
          if (isMounted) {
            setServicesList(fallback);
            setPrimaryServiceId((prev) => prev || fallback[0].id);
          }
        }
      } catch {
        const fallback: ServiceOption[] = servicesData.map((s) => ({
          id: s.slug,
          slug: s.slug,
          number: s.number,
          title_ar: s.title.ar,
          title_en: s.title.en,
        }));
        if (isMounted) {
          setServicesList(fallback);
          setPrimaryServiceId((prev) => prev || fallback[0].id);
        }
      } finally {
        if (isMounted) setIsLoadingServices(false);
      }
    }
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Cover Image Upload Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setCoverUploadError(null);
    setErrorMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.url) {
        const uploadedUrl = String(data.url).trim();
        const oldCover = coverImage;
        setCoverImage(uploadedUrl);
        setCoverUploadError(null);

        // Synchronize gallery so that the new cover replaces old cover or becomes index 0
        setGallery((prev) => {
          const filtered = prev.filter((img) => img !== oldCover && !img.includes("coffee-web.svg"));
          return [uploadedUrl, ...filtered];
        });
      } else {
        const errorText =
          data.error ||
          (isArabic
            ? "فشل رفع صورة الغلاف إلى السحابة، يرجى المحاولة مرة أخرى"
            : "Failed to upload cover image to cloud storage");
        setCoverUploadError(errorText);
        setErrorMessage(errorText);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isArabic
          ? "حدث خطأ غير متوقع أثناء رفع صورة الغلاف"
          : "Unexpected error during cover upload";
      setCoverUploadError(msg);
      setErrorMessage(msg);
    } finally {
      setUploadingCover(false);
      // Reset input element value so re-uploading the same file works as expected
      e.target.value = "";
    }
  };

  // Gallery Multiple Images Upload Handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    setErrorMessage(null);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          newUrls.push(data.url);
        } else {
          console.warn("Upload failed for file:", files[i].name, data.error);
        }
      }

      if (newUrls.length > 0) {
        setGallery((prev) => {
          // If previous was only fallback placeholder, replace it
          if (prev.length === 1 && prev[0].includes("coffee-web.svg")) {
            return newUrls;
          }
          return [...prev, ...newUrls];
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء رفع صور المعرض";
      setErrorMessage(msg);
    } finally {
      setUploadingGallery(false);
    }
  };

  // Move Gallery Image
  const moveGalleryImage = (index: number, direction: "up" | "down") => {
    setGallery((prev) => {
      const updated = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  // Remove Gallery Image
  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  // Deliverables Handlers
  const addDeliverable = () => {
    setDeliverables((prev) => [...prev, { ar: "", en: "" }]);
  };

  const updateDeliverable = (index: number, field: "ar" | "en", value: string) => {
    setDeliverables((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeDeliverable = (index: number) => {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  // Tools Handlers
  const addTool = () => {
    if (newToolInput.trim() && !tools.includes(newToolInput.trim())) {
      setTools((prev) => [...prev, newToolInput.trim()]);
      setNewToolInput("");
    }
  };

  const removeTool = (toolToRemove: string) => {
    setTools((prev) => prev.filter((t) => t !== toolToRemove));
  };

  // Toggle Additional Service
  const toggleAdditionalService = (serviceId: string) => {
    setAdditionalServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Construct Live Preview Object for Modal
  const primaryServiceObj =
    servicesList.find((s) => s.id === primaryServiceId) || servicesList[0];

  const previewItem: ExtendedPortfolioItem = {
    id: projectId || "preview",
    slug: slug || "preview-project",
    number: number || "01",
    title: { ar: titleAr || "عنوان المشروع بالعربية", en: titleEn || "Project Title in English" },
    category: primaryServiceObj?.slug || "website-design-development",
    categoryName: {
      ar: primaryServiceObj?.title_ar || "تصميم المواقع",
      en: primaryServiceObj?.title_en || "Website Design",
    },
    status: isConcept ? "concept" : "real",
    isConcept: isConcept,
    year: year || "2026",
    coverImage: coverImage,
    gallery: gallery.length > 0 ? gallery : [coverImage],
    summary: {
      ar: summaryAr || "ملخص المشروع الترويجي بالعربية هنا.",
      en: summaryEn || "Brief marketing summary of the project in English here.",
    },
    challenge: { ar: challengeAr, en: challengeEn },
    solution: { ar: solutionAr, en: solutionEn },
    result: resultAr || resultEn ? { ar: resultAr, en: resultEn } : undefined,
    deliverables: deliverables.filter((d) => d.ar || d.en),
    tools: tools,
    previewUrl: previewUrl || undefined,
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!titleAr.trim() || !titleEn.trim()) {
      setErrorMessage(
        isArabic ? "يرجى إدخال عنوان المشروع باللغتين" : "Project title is required in both languages"
      );
      return;
    }

    if (!summaryAr.trim() || !summaryEn.trim()) {
      setErrorMessage(
        isArabic ? "يرجى إدخال نبذة مختصرة عن المشروع باللغتين" : "Project summary is required in both languages"
      );
      return;
    }

    if (!primaryServiceId) {
      setErrorMessage(
        isArabic ? "يرجى تحديد الخدمة الرئيسية للمشروع" : "Primary service selection is required"
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title_ar: titleAr.trim(),
      title_en: titleEn.trim(),
      slug: slug.trim() || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      number: number.trim() || "01",
      summary_ar: summaryAr.trim(),
      summary_en: summaryEn.trim(),
      description_ar: descriptionAr.trim() || null,
      description_en: descriptionEn.trim() || null,
      challenge_ar: challengeAr.trim() || null,
      challenge_en: challengeEn.trim() || null,
      solution_ar: solutionAr.trim() || null,
      solution_en: solutionEn.trim() || null,
      result_ar: resultAr.trim() || null,
      result_en: resultEn.trim() || null,
      deliverables: deliverables.filter((d) => d.ar.trim() || d.en.trim()),
      tools: tools,
      cover_image: coverImage.trim(),
      coverImage: coverImage.trim(),
      gallery: gallery.length > 0 ? gallery : [coverImage.trim()],
      preview_url: previewUrl.trim() || null,
      status: status,
      is_concept: isConcept,
      year: year.trim() || "2026",
      primary_service_id: primaryServiceId,
      additional_service_ids: additionalServiceIds.filter((id) => id !== primaryServiceId),
    };

    try {
      const endpoint = mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${projectId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "فشل حفظ المشروع");
      }

      setSuccessMessage(
        mode === "create"
          ? isArabic ? "تم إنشاء المشروع بنجاح وإضافته إلى المعرض!" : "Project created successfully!"
          : isArabic ? "تم تحديث بيانات المشروع بنجاح!" : "Project updated successfully!"
      );

      setTimeout(() => {
        router.push("/admin/portfolio");
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء حفظ المشروع";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir={dir} className="w-full pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-xs text-[var(--text-tertiary)]">
            <Link href="/admin" className="hover:text-[#C6A66B]">
              {isArabic ? "الرئيسية" : "Dashboard"}
            </Link>
            <span>/</span>
            <Link href="/admin/portfolio" className="hover:text-[#C6A66B]">
              {isArabic ? "معرض الأعمال" : "Portfolio"}
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-semibold">
              {mode === "create"
                ? isArabic ? "إضافة مشروع جديد" : "Create Project"
                : isArabic ? "تعديل المشروع" : "Edit Project"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
            <Sparkles size={28} className="text-[#C6A66B]" />
            <span>
              {mode === "create"
                ? isArabic ? "إضافة مشروع جديد لمعرض الأعمال" : "Add New Project"
                : isArabic ? `تعديل المشروع: ${titleAr || titleEn}` : `Edit Project: ${titleEn || titleAr}`}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-[#C6A66B]/30 bg-[#C6A66B]/10 text-[#C6A66B] hover:bg-[#C6A66B]/20 transition-all shadow-sm"
          >
            <Eye size={15} />
            <span>{isArabic ? "معاينة قبل النشر" : "Live Preview"}</span>
          </button>

          <Link
            href="/admin/portfolio"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            {isArabic ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span>{isArabic ? "إلغاء والعودة" : "Cancel & Return"}</span>
          </Link>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 spans): Content, bilingual fields, case study */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-[#C6A66B] border-b border-[var(--border-subtle)] pb-4 font-bold text-sm">
                <Layers size={18} />
                <span>{isArabic ? "البيانات الأساسية والهوية" : "Core Details & Identity"}</span>
              </div>

              {/* Titles AR / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "عنوان المشروع (بالعربية) *" : "Project Title (Arabic) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: متجر بُن كود الفاخر"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "عنوان المشروع (بالإنجليزية) *" : "Project Title (English) *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => handleTitleEnChange(e.target.value)}
                    placeholder="e.g. Bun Code Specialty Coffee"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Slug & Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "المعرف الرابط (Slug) *" : "URL Slug *"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugEditedManually(true);
                      }}
                      placeholder="bun-code-specialty-coffee"
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-xs focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                  <span className="text-[10px] text-[var(--text-tertiary)] mt-1 block">
                    {isArabic ? "يظهر في الرابط: /portfolio/your-slug" : "URL: /portfolio/your-slug"}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "رقم المشروع (ترتيب)" : "Project #" }
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="01"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Summaries AR / EN */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "نبذة تسويقية ملخصة (عربي) *" : "Short Summary (Arabic) *"}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={summaryAr}
                    onChange={(e) => setSummaryAr(e.target.value)}
                    placeholder="نبذة مكثفة وموجزة عن فكرة المشروع وقيمته المضافة..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "نبذة تسويقية ملخصة (إنجليزي) *" : "Short Summary (English) *"}
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={summaryEn}
                    onChange={(e) => setSummaryEn(e.target.value)}
                    placeholder="Concise overview highlighting key value proposition..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Detailed Descriptions AR / EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "الوصف التفصيلي للمشروع (عربي)" : "Detailed Description (Arabic)"}
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder="تفاصيل وشرح أوفى عن المشروع ومراحل بنائه..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "الوصف التفصيلي للمشروع (إنجليزي)" : "Detailed Description (English)"}
                  </label>
                  <textarea
                    rows={3}
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Comprehensive description of the project execution..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>
            </div>

            {/* Case Study Details (Challenge, Solution, Result) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-[#C6A66B] border-b border-[var(--border-subtle)] pb-4 font-bold text-sm">
                <Sparkles size={18} />
                <span>{isArabic ? "دراسة الحالة (التحدي، الحل، والنتائج)" : "Case Study Deep-Dive"}</span>
              </div>

              {/* Challenge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "التحدي الاستراتيجي (عربي)" : "Challenge (Arabic)"}
                  </label>
                  <textarea
                    rows={3}
                    value={challengeAr}
                    onChange={(e) => setChallengeAr(e.target.value)}
                    placeholder="ما هو التحدي الذي واجهه العميل في السوق؟"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "التحدي الاستراتيجي (إنجليزي)" : "Challenge (English)"}
                  </label>
                  <textarea
                    rows={3}
                    value={challengeEn}
                    onChange={(e) => setChallengeEn(e.target.value)}
                    placeholder="What specific challenges needed solving?"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Solution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "الحل الإبداعي والتقني (عربي)" : "Solution (Arabic)"}
                  </label>
                  <textarea
                    rows={3}
                    value={solutionAr}
                    onChange={(e) => setSolutionAr(e.target.value)}
                    placeholder="كيف صممت ونفذت وكالة MULTI CREATIVES الحل الفارق؟"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "الحل الإبداعي والتقني (إنجليزي)" : "Solution (English)"}
                  </label>
                  <textarea
                    rows={3}
                    value={solutionEn}
                    onChange={(e) => setSolutionEn(e.target.value)}
                    placeholder="How did MULTI CREATIVES craft and execute the solution?"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Result */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "الأثر والنتائج المحققة (عربي)" : "Result & Impact (Arabic)"}
                  </label>
                  <textarea
                    rows={3}
                    value={resultAr}
                    onChange={(e) => setResultAr(e.target.value)}
                    placeholder="النتائج النوعية أو مقاييس النمو والأثر المحقق..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                    {isArabic ? "الأثر والنتائج المحققة (إنجليزي)" : "Result & Impact (English)"}
                  </label>
                  <textarea
                    rows={3}
                    value={resultEn}
                    onChange={(e) => setResultEn(e.target.value)}
                    placeholder="Measurable outcomes and market response..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>
            </div>

            {/* Deliverables List */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-2 text-[#C6A66B] font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>{isArabic ? "مخرجات المشروع (Deliverables)" : "Deliverables List"}</span>
                </div>
                <button
                  type="button"
                  onClick={addDeliverable}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C6A66B]/15 text-[#C6A66B] hover:bg-[#C6A66B]/25 transition-all"
                >
                  <Plus size={14} />
                  <span>{isArabic ? "إضافة مخرج" : "Add Deliverable"}</span>
                </button>
              </div>

              <div className="space-y-3">
                {deliverables.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
                  >
                    <div className="w-full sm:flex-1">
                      <input
                        type="text"
                        value={item.ar}
                        onChange={(e) => updateDeliverable(index, "ar", e.target.value)}
                        placeholder="المخرج بالعربية (مثال: تصميم متكامل للهوية)"
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#C6A66B]"
                      />
                    </div>
                    <div className="w-full sm:flex-1">
                      <input
                        type="text"
                        value={item.en}
                        onChange={(e) => updateDeliverable(index, "en", e.target.value)}
                        placeholder="Deliverable in English (e.g. Full UI/UX Design)"
                        className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#C6A66B]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDeliverable(index)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools & Tech Stack */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-[#C6A66B] border-b border-[var(--border-subtle)] pb-4 font-bold text-sm">
                <Tag size={18} />
                <span>{isArabic ? "الأدوات والتقنيات المستخدمة (Tools)" : "Tools & Technologies"}</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newToolInput}
                  onChange={(e) => setNewToolInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTool();
                    }
                  }}
                  placeholder="مثال: Next.js, Figma, Adobe Illustrator"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[#C6A66B]"
                />
                <button
                  type="button"
                  onClick={addTool}
                  className="px-4 py-2.5 rounded-xl bg-[#C6A66B] text-[#111111] text-xs font-bold hover:bg-[#D8BC84] transition-all"
                >
                  {isArabic ? "إضافة" : "Add"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                  >
                    <span>{tool}</span>
                    <button
                      type="button"
                      onClick={() => removeTool(tool)}
                      className="text-[var(--text-tertiary)] hover:text-rose-400"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column (1 span): Services, Status, Media uploads, Concept toggle */}
          <div className="space-y-8">
            {/* Status & Visibility Box */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
              <h3 className="font-bold text-sm text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                {isArabic ? "النشر وحالة المشروع" : "Publishing & Status"}
              </h3>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  {isArabic ? "حالة المشروع" : "Project Status"}
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published" | "hidden")}
                  className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-[#C6A66B]"
                >
                  <option value="published">
                    {isArabic ? "🟢 منشور للعامة (Published)" : "🟢 Published Live"}
                  </option>
                  <option value="draft">
                    {isArabic ? "🟡 مسودة مؤقتة (Draft)" : "🟡 Draft"}
                  </option>
                  <option value="hidden">
                    {isArabic ? "⚪ مخفي من المعرض (Hidden)" : "⚪ Hidden from Catalog"}
                  </option>
                </select>
              </div>

              {/* Year & Concept */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                    {isArabic ? "سنة الإنجاز" : "Year"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2026"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-mono focus:outline-none focus:border-[#C6A66B]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                    {isArabic ? "نوع العمل" : "Type"}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsConcept(!isConcept)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      isConcept
                        ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                        : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                    }`}
                  >
                    {isConcept
                      ? isArabic ? "عمل تجريبي (Concept)" : "Concept"
                      : isArabic ? "مشروع حقيقي (Live)" : "Live"}
                  </button>
                </div>
              </div>

              {/* External Preview URL */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                  {isArabic ? "رابط المعاينة الخارجية (Live URL)" : "Live Project URL"}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={previewUrl}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-mono focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>
            </div>

            {/* Services Selector Box */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
              <h3 className="font-bold text-sm text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                {isArabic ? "تصنيف الخدمات (الخدمات السبع)" : "Services Categorization"}
              </h3>

              {isLoadingServices ? (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] py-4">
                  <Loader2 size={16} className="animate-spin text-[#C6A66B]" />
                  <span>{isArabic ? "جاري تحميل قائمة الخدمات..." : "Loading services..."}</span>
                </div>
              ) : (
                <>
                  {/* Primary Service */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                      {isArabic ? "الخدمة الرئيسية (إلزامي) *" : "Primary Service (Required) *"}
                    </label>
                    <select
                      required
                      value={primaryServiceId}
                      onChange={(e) => setPrimaryServiceId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-[#C6A66B]"
                    >
                      {servicesList.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.number} - {isArabic ? service.title_ar : service.title_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Additional Services */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                      {isArabic ? "خدمات إضافية مرتبطة بالمشروع" : "Additional Linked Services"}
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pe-1">
                      {servicesList
                        .filter((s) => s.id !== primaryServiceId)
                        .map((service) => {
                          const isSelected = additionalServiceIds.includes(service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => toggleAdditionalService(service.id)}
                              className={`w-full text-start p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                                isSelected
                                  ? "bg-[#C6A66B]/15 border-[#C6A66B]/40 text-[#C6A66B] font-bold"
                                  : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              }`}
                            >
                              <span>
                                {service.number} - {isArabic ? service.title_ar : service.title_en}
                              </span>
                              {isSelected && <CheckCircle2 size={14} className="shrink-0" />}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Media Uploads Box (Cover Image & Gallery) */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm space-y-6">
              <h3 className="font-bold text-sm text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                {isArabic ? "الصور والوسائط (Supabase Storage)" : "Media & Storage"}
              </h3>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                  {isArabic ? "صورة الغلاف الرئيسية *" : "Cover Image *"}
                </label>

                <div className="relative aspect-[16/10] rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden mb-3">
                  <Image
                    src={coverImage}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {uploadingCover && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-[#C6A66B]" />
                      <span className="text-xs text-white">
                        {isArabic ? "جاري الرفع..." : "Uploading..."}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-[#C6A66B] text-[#111111] hover:bg-[#D8BC84] transition-all">
                    <Upload size={14} />
                    <span>{isArabic ? "رفع صورة غلاف جديدة" : "Upload Cover"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>
                </div>

                {coverUploadError && (
                  <div className="mt-2.5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-rose-400" />
                    <span>{coverUploadError}</span>
                  </div>
                )}

                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-[var(--text-tertiary)] mb-1">
                    {isArabic ? "أو رابط الصورة المباشر (URL):" : "Or direct image URL:"}
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => {
                      setCoverImage(e.target.value);
                      setCoverUploadError(null);
                    }}
                    placeholder="https://... أو /images/..."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-mono focus:outline-none focus:border-[#C6A66B]"
                  />
                </div>
              </div>

              {/* Gallery Images */}
              <div className="border-t border-[var(--border-subtle)] pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[var(--text-primary)]">
                    {isArabic ? "معرض صور المشروع" : "Project Gallery"}
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/50 transition-all text-[#C6A66B]">
                    <Plus size={12} />
                    <span>{isArabic ? "إضافة صور" : "Add Images"}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      disabled={uploadingGallery}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadingGallery && (
                  <div className="p-3 mb-3 rounded-xl bg-[#C6A66B]/10 text-[#C6A66B] text-xs flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span>{isArabic ? "جاري رفع صور المعرض إلى السحابة..." : "Uploading to storage..."}</span>
                  </div>
                )}

                <div className="space-y-2 max-h-64 overflow-y-auto pe-1">
                  {gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
                    >
                      <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-[var(--border-subtle)]">
                        <Image
                          src={imgUrl}
                          alt={`Gallery ${idx + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-tertiary)] flex-1 truncate">
                        {imgUrl.split("/").pop()}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(idx, "down")}
                          disabled={idx === gallery.length - 1}
                          className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action Card */}
            <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[#C6A66B]/30 shadow-lg space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold bg-[#C6A66B] text-[#111111] hover:bg-[#D8BC84] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{isArabic ? "جاري الحفظ..." : "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>
                      {mode === "create"
                        ? isArabic ? "حفظ ونشر المشروع" : "Save & Publish"
                        : isArabic ? "حفظ التعديلات" : "Save Changes"}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-[#C6A66B]/50 transition-all flex items-center justify-center gap-2"
              >
                <Eye size={15} />
                <span>{isArabic ? "معاينة الشكل النهائي" : "Preview Final Look"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-[var(--bg-primary)] border border-[#C6A66B]/40 rounded-3xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-4 px-6 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C6A66B]">
                <Eye size={16} />
                <span>{isArabic ? "معاينة حية لصفحة المشروع (كما سيراها الزائر)" : "Live Project Preview"}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-rose-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Direct invocation of PortfolioDetailView */}
            <div className="p-4 sm:p-8">
              <PortfolioDetailView project={previewItem} isPreviewModal={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
