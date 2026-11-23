"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Badge, Button, Lightbox } from "@/components/ui";
import { servicesData, ServiceItem } from "@/data/servicesData";
import { getPublicServices } from "@/lib/data/services";
import { useTranslation, useLanguage } from "@/hooks";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ServicesShowcaseSection() {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>(servicesData);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const live = await getPublicServices();
        if (isMounted && live && live.length > 0) {
          setServices(live);
        }
      } catch (err) {
        console.warn("[ServicesShowcaseSection] Error loading live services:", err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeService = services[selectedIndex] || services[0] || servicesData[0];

  const allPreviewSlides = services.map((s) => ({
    title: s.title[lang],
    desc: s.tagline[lang],
    image: s.gallery?.[0]?.image || `/images/services/${s.slug}.svg`,
    tag: s.gallery?.[0]?.tag?.[lang] || (lang === "ar" ? "خدمة رئيسية" : "Core Service"),
  }));

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % services.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 relative overflow-hidden transition-colors">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="gold" className="mb-4">
              {lang === "ar" ? "خدماتنا السبع" : "OUR 7 SERVICES"}
            </Badge>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.2]">
              {lang === "ar" ? "خدماتنا الإبداعية والتقنية" : "Our Creative & Digital Services"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="text-xs sm:text-sm font-semibold text-[#C6A66B] hover:text-[#D8BC84] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{lang === "ar" ? "استعراض كافة الخدمات (7)" : "View All 7 Services"}</span>
              <ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />
            </Link>
          </div>
        </div>

        {/* Interactive Discipline Tabs Strip */}
        <div className="w-full max-w-full min-w-0 flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {services.map((service, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={service.slug}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 border",
                  isActive
                    ? "bg-[#C6A66B] text-[#111111] border-[#C6A66B] shadow-md shadow-[#C6A66B]/20 scale-102"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[#C6A66B]/30"
                )}
              >
                <span className="font-mono text-[10px] opacity-75">{service.number}</span>
                <span>{service.title[lang]}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Showcase Card */}
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Preview Frame with Lightbox Trigger */}
            <div
              className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] aspect-[16/10] bg-[var(--bg-surface-elevated)] group cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            >
              <Image
                src={activeService.gallery?.[0]?.image || `/images/services/${activeService.slug}.svg`}
                alt={activeService.title[lang]}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute top-4 start-4 z-10">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-[#C6A66B] border border-[#C6A66B]/30">
                  {activeService.gallery[0].tag[lang]}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute top-4 end-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-[#C6A66B] hover:text-[#111111] border border-white/20 transition-colors"
                aria-label="Inspect Lightbox"
                title={lang === "ar" ? "معاينة مكبرة" : "Inspect Lightbox"}
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 start-4 end-4 z-10 text-white">
                <p className="text-xs font-mono text-[#C6A66B] mb-1">
                  {lang === "ar" ? "انقر للمعاينة بملء الشاشة" : "Click to inspect in fullscreen lightbox"}
                </p>
                <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-sm">
                  {activeService.gallery[0].title[lang]}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono font-bold text-[#C6A66B] px-2.5 py-0.5 rounded-md bg-[#C6A66B]/15 border border-[#C6A66B]/30">
                    {activeService.number} / 07
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                    {activeService.techStack.slice(0, 3).join(" • ")}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">
                  {activeService.title[lang]}
                </h3>

                <p className="text-sm font-semibold text-[#C6A66B] mb-4">
                  {activeService.tagline[lang]}
                </p>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {activeService.overview[lang]}
                </p>

                {/* Key Deliverables Matrix */}
                <div className="space-y-2 mb-8">
                  {activeService.deliverables.slice(0, 3).map((item, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <div className="w-4 h-4 rounded-full bg-[#C6A66B]/20 text-[#C6A66B] flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">{item.title[lang]}:</span>
                      <span className="text-[var(--text-tertiary)] truncate">{item.desc[lang]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions & Next/Prev Controls */}
              <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    href={`/services/${activeService.slug}`}
                    variant="primary"
                    size="sm"
                    icon={<ArrowUpRight className={cn("w-3.5 h-3.5", lang === "ar" && "rotate-[-90deg]")} />}
                  >
                    {lang === "ar" ? "تفاصيل الخدمة" : "Service Details"}
                  </Button>

                  <Button href="/request-project" variant="outline" size="sm">
                    {t.nav.requestProject}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={lang === "ar" ? handleNext : handlePrev}
                    className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/50 transition-colors"
                    aria-label="Previous discipline"
                  >
                    {lang === "ar" ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={lang === "ar" ? handlePrev : handleNext}
                    className="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/50 transition-colors"
                    aria-label="Next discipline"
                  >
                    {lang === "ar" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox for Homepage Showcase */}
        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          items={allPreviewSlides}
          currentIndex={selectedIndex}
          onIndexChange={setSelectedIndex}
        />
      </Container>
    </section>
  );
}
