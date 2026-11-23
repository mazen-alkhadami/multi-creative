"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Badge, Button, Lightbox } from "@/components/ui";
import { servicesData, ServiceItem } from "@/data/servicesData";
import { getPublicServices } from "@/lib/data/services";
import { useTranslation, useLanguage } from "@/hooks";
import { ArrowUpRight, CheckCircle, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const [services, setServices] = useState<ServiceItem[]>(servicesData);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const live = await getPublicServices();
        if (isMounted && live && live.length > 0) {
          setServices(live);
        }
      } catch (err) {
        console.warn("[ServicesPage] Error loading live services:", err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // All services gallery items flattened for universal lightbox exploration
  const allGalleryItems = services.map((s) => ({
    title: s.title[lang],
    desc: s.tagline[lang],
    image: s.gallery?.[0]?.image || `/images/services/${s.slug}.svg`,
    tag: s.gallery?.[0]?.tag?.[lang] || (lang === "ar" ? "خدمة رئيسية" : "Core Service"),
  }));

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="gold" className="mb-4">
            {lang === "ar" ? "منظومة الخدمات الشاملة" : "Integrated Capabilities Ecosystem"}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.2] mb-6">
            {lang === "ar"
              ? "سبعة تخصصات إبداعية وتقنية مصممة لتحقيق الريادة المؤسسية"
              : "Seven Integrated Disciplines Engineered for Institutional Distinction"}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "نجمع بين عمق التفكير الاستراتيجي وأرقى المعايير الهندسية والإنتاجية لنقدم حلولاً متكاملة لا تقبل التنازل."
              : "Uniting deep strategic rigor with elite engineering and artisanal production to create enduring digital landmark experiences."}
          </p>
        </div>

        {/* Services List - 7 Complete Disciplines */}
        <div className="space-y-12 mb-24">
          {services.map((service, idx) => (
            <div
              key={service.slug}
              id={service.slug}
              className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-10 transition-all duration-300 hover:border-[#C6A66B]/40 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Preview with Lightbox Trigger */}
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] aspect-[16/10] cursor-pointer group/img">
                  <Image
                    src={service.gallery?.[0]?.image || `/images/services/${service.slug}.svg`}
                    alt={service.title[lang]}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/img:opacity-80 transition-opacity" />

                  <button
                    type="button"
                    onClick={() => handleOpenLightbox(idx)}
                    className="absolute bottom-4 end-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-[#C6A66B] hover:text-[#111111] border border-white/20 transition-all duration-200"
                    aria-label={`Inspect ${service.title[lang]}`}
                    title={lang === "ar" ? "معاينة مكبرة" : "Inspect Lightbox"}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Info */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold tracking-widest text-[#C6A66B] px-3 py-1 rounded-full bg-[#C6A66B]/10 border border-[#C6A66B]/20">
                        {service.number} / 07
                      </span>
                      <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                        {service.techStack.slice(0, 2).join(" • ")}
                      </span>
                    </div>

                    <Link href={`/services/${service.slug}`}>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] hover:text-[#C6A66B] transition-colors mb-3">
                        {service.title[lang]}
                      </h2>
                    </Link>

                    <p className="text-sm sm:text-base text-[#C6A66B] font-medium mb-4">
                      {service.tagline[lang]}
                    </p>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                      {service.shortDescription[lang]}
                    </p>

                    {/* Key Deliverables Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                      {service.deliverables.slice(0, 4).map((deliv, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#C6A66B] shrink-0" />
                          <span className="truncate">{deliv.title[lang]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link to Detail Page */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-tertiary)]">
                      {service.keyMetrics.slice(0, 2).map((m, mIdx) => (
                        <span key={mIdx}>
                          <strong className="text-[#C6A66B]">{m.value}</strong> {m.label[lang]}
                        </span>
                      ))}
                    </div>

                    <Button
                      href={`/services/${service.slug}`}
                      variant="outline"
                      size="sm"
                      icon={<ArrowUpRight className={cn("w-3.5 h-3.5", lang === "ar" && "rotate-[-90deg]")} />}
                    >
                      {lang === "ar" ? "تفاصيل الخدمة والمعرض" : "Explore Detail & Gallery"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Lightbox Component */}
        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          items={allGalleryItems}
          currentIndex={lightboxIndex}
          onIndexChange={setLightboxIndex}
        />

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl border border-[#C6A66B]/30 bg-[var(--bg-surface)] p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-20 start-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] opacity-15"
            style={{
              background: "radial-gradient(circle, #C6A66B 0%, rgba(198,166,107,0) 70%)",
            }}
          />
          <Badge variant="gold" className="mb-4">
            {lang === "ar" ? "شراكة استراتيجية" : "Strategic Partnership"}
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
            {lang === "ar"
              ? "هل تحتاج إلى حزمة خدمات متكاملة مصممة خصيصاً لمؤسستك؟"
              : "Require an integrated multidisciplinary engagement tailored for your institution?"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-8 max-w-xl mx-auto leading-relaxed">
            {lang === "ar"
              ? "يسعدنا ترتيب جلسة استشارية مغلقة مع شركائنا التنفيذيين لمناقشة أهدافكم وتفصيل نطاق العمل الملائم."
              : "We welcome private consultations with leadership teams to engineer custom cross-discipline delivery models."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              href="/request-project"
              size="lg"
              variant="primary"
              icon={<ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />}
            >
              {t.nav.requestProject}
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              {t.nav.contact}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
