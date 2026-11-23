"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ProjectForm, InitialProjectData } from "@/components/admin/ProjectForm";
import { useAppContext } from "@/context/AppContext";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

export default function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";

  const [project, setProject] = useState<InitialProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadProject() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/admin/projects/${projectId}`);
        const data = await res.json();

        if (!res.ok || !data.success || !data.project) {
          throw new Error(data.error || "المشروع غير موجود أو تم حذفه");
        }

        if (isMounted) {
          setProject(data.project as InitialProjectData);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تحميل بيانات المشروع";
          setError(msg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (projectId) {
      loadProject();
    }

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (loading) {
    return (
      <div dir={dir} className="w-full py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-[#C6A66B]" />
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          {isArabic ? "جاري تحميل بيانات المشروع..." : "Loading project details..."}
        </span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div dir={dir} className="w-full py-16 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          {isArabic ? "تعذر تحميل المشروع" : "Project Not Found"}
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          {error || (isArabic ? "المشروع المطلوب غير متوفر" : "The requested project could not be found.")}
        </p>
        <div className="pt-4">
          <Link
            href="/admin/portfolio"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] hover:border-[#C6A66B]/50 transition-all"
          >
            {isArabic ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span>{isArabic ? "العودة إلى معرض الأعمال" : "Back to Catalog"}</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ProjectForm mode="edit" projectId={projectId} initialData={project} />;
}
