"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { LightboxItem } from "@/components/ui/Lightbox";
import { portfolioData, PortfolioItem } from "@/data/portfolioData";
import { ExtendedPortfolioItem } from "@/lib/data/projects";
import { useLanguage } from "@/hooks";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PortfolioDetailViewProps {
  slug?: string;
  project?: ExtendedPortfolioItem | PortfolioItem;
  prevItem?: PortfolioItem | ExtendedPortfolioItem | null;
  nextItem?: PortfolioItem | ExtendedPortfolioItem | null;
  isPreviewModal?: boolean;
}

export function PortfolioDetailView({
  slug,
  project,
  prevItem: propPrev,
  nextItem: propNext,
  isPreviewModal = false,
}: PortfolioDetailViewProps) {
  const { lang } = useLanguage();

  const currentIndex = slug ? portfolioData.findIndex((item) => item.slug === slug) : -1;
  const item: ExtendedPortfolioItem = (project as ExtendedPortfolioItem) || (currentIndex !== -1 ? (portfolioData[currentIndex] as ExtendedPortfolioItem) : (portfolioData[0] as ExtendedPortfolioItem));

  const prevItem = propPrev !== undefined ? propPrev : currentIndex > 0 ? portfolioData[currentIndex - 1] : null;
  const nextItem = propNext !== undefined ? propNext : currentIndex !== -1 && currentIndex < portfolioData.length - 1 ? portfolioData[currentIndex + 1] : null;

  // Transform gallery for ImageSlider with built-in Lightbox
  const sliderItems: LightboxItem[] = item.gallery.map((img, i) => ({
    image: img,
    title: `${item.title[lang]} — ${lang === "ar" ? "معاينة" : "Visual"} ${i + 1}`,
    desc: `${item.categoryName[lang]} • ${lang === "ar" ? "عمل تجريبي" : "Concept Project"}`,
    tag: item.number,
  }));

  return (
    <article className="py-12 md:py-20">
      <Container>
        {/* Top Back Navigation */}
        <div className="mb-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[#C6A66B] transition-colors"
          >
            {lang === "ar" ? (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>العودة إلى معرض الأعمال</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Portfolio</span>
              </>
            )}
          </Link>
        </div>

        {/* Header Hero */}
        <div className="max-w-4xl mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-md bg-[#C6A66B]/10 text-[#C6A66B] border border-[#C6A66B]/30 text-xs font-mono font-bold">
              {item.number}
            </span>
            <Badge variant="gold" size="sm">
              {item.categoryName[lang]}
            </Badge>
            <span className="text-xs font-medium text-[var(--text-muted)]">
              {item.year}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              {lang === "ar" ? "عمل تجريبي (Concept Project)" : "Concept Project"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-6">
            {item.title[lang]}
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed">
            {item.summary[lang]}
          </p>
        </div>

        {/* Gallery / Interactive Slider Box (with built-in Lightbox) */}
        <div className="mb-16 rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 sm:p-4">
          <ImageSlider items={sliderItems} aspectRatio="16/10" />
        </div>

        {/* Main Editorial Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Deep-dive Challenge & Solution */}
          <div className="lg:col-span-8 space-y-10">
            {/* The Challenge */}
            <section className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#C6A66B]" />
                <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                  {lang === "ar" ? "أهداف ومتطلبات المشروع" : "Project Objectives & Needs"}
                </h2>
              </div>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                {item.challenge[lang]}
              </p>
            </section>

            {/* The Solution */}
            <section className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#C6A66B]" />
                <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                  {lang === "ar" ? "الحل الإبداعي والتنفيذي" : "Creative & Execution Solution"}
                </h2>
              </div>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                {item.solution[lang]}
              </p>
            </section>

            {/* The Result / النتيجة المحققة (إذا كانت متوفرة) */}
            {item.result && item.result[lang] && (
              <section className="p-8 rounded-2xl border border-[#C6A66B]/30 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-[#C6A66B]" />
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                    {lang === "ar" ? "النتيجة والأثر المحقق" : "Outcomes & Realized Impact"}
                  </h2>
                </div>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                  {item.result[lang]}
                </p>
              </section>
            )}

            {/* Deliverables Checklist */}
            <section className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-6">
                {lang === "ar" ? "مخرجات العمل" : "Deliverables"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.deliverables.map((d, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C6A66B] shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {d[lang]}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Specifications */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C6A66B]">
                {lang === "ar" ? "معلومات العمل" : "Project Information"}
              </h3>

              <div>
                <span className="text-xs text-[var(--text-muted)] block mb-1">
                  {lang === "ar" ? "التصنيف" : "Category"}
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {item.categoryName[lang]}
                </span>
              </div>

              <div>
                <span className="text-xs text-[var(--text-muted)] block mb-1">
                  {lang === "ar" ? "الحالة" : "Status"}
                </span>
                <span className="text-xs font-semibold text-amber-400">
                  {lang === "ar" ? "عمل تجريبي (Concept Project)" : "Concept Project"}
                </span>
              </div>

              <div>
                <span className="text-xs text-[var(--text-muted)] block mb-2">
                  {lang === "ar" ? "الأدوات والتقنيات" : "Tools & Technologies"}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <Button
                  href="/request-project"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  icon={<ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />}
                >
                  {lang === "ar" ? "طلب خدمة مماثلة" : "Request Similar Service"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Next / Previous Project Navigation */}
        {!isPreviewModal && (
          <div className="pt-12 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevItem ? (
              <Link
                href={`/portfolio/${prevItem.slug}`}
                className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 transition-colors flex items-center gap-4"
              >
                <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] text-[#C6A66B]">
                  {lang === "ar" ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    {lang === "ar" ? "المشروع السابق" : "Previous Project"}
                  </span>
                  <span className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                    {prevItem.title[lang]}
                  </span>
                </div>
              </Link>
            ) : <div />}

            {nextItem ? (
              <Link
                href={`/portfolio/${nextItem.slug}`}
                className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 transition-colors flex items-center justify-end gap-4 text-end"
              >
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">
                    {lang === "ar" ? "المشروع التالي" : "Next Project"}
                  </span>
                  <span className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                    {nextItem.title[lang]}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] text-[#C6A66B]">
                  {lang === "ar" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </div>
              </Link>
            ) : <div />}
          </div>
        )}
      </Container>
    </article>
  );
}
