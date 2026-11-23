"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ServiceForm, InitialServiceData } from "@/components/admin/ServiceForm";
import { useAppContext } from "@/context/AppContext";
import { Loader2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

export default function AdminEditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;
  const { lang, dir } = useAppContext();
  const isArabic = lang === "ar";

  const [service, setService] = useState<InitialServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadService() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/admin/services/${serviceId}`);
        const data = await res.json();

        if (!res.ok || !data.success || !data.service) {
          throw new Error(data.error || "الخدمة غير موجودة");
        }

        if (isMounted) {
          setService(data.service as InitialServiceData);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تحميل بيانات الخدمة";
          setError(msg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (serviceId) {
      loadService();
    }

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  if (loading) {
    return (
      <div dir={dir} className="w-full py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-[#C6A66B]" />
        <span className="text-xs font-semibold text-[var(--text-secondary)]">
          {isArabic ? "جاري تحميل بيانات الخدمة..." : "Loading service details..."}
        </span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div dir={dir} className="w-full py-16 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          {isArabic ? "تعذر تحميل الخدمة" : "Service Not Found"}
        </h2>
        <p className="text-xs text-[var(--text-secondary)]">
          {error || (isArabic ? "الخدمة المطلوبة غير متوفرة" : "The requested service could not be found.")}
        </p>
        <div className="pt-4">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] hover:border-[#C6A66B]/50 transition-all"
          >
            {isArabic ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
            <span>{isArabic ? "العودة إلى إدارة الخدمات" : "Back to Services"}</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ServiceForm serviceId={serviceId} initialData={service} />;
}
