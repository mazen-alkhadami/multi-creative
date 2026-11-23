"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { servicesData, ServiceItem } from "@/data/servicesData";
import { ExtendedPortfolioItem } from "@/lib/data/projects";
import { Container, Badge, Button, Card, ImageSlider } from "@/components/ui";
import { useTranslation, useLanguage } from "@/hooks";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Cpu,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceDetailViewProps {
  slug: string;
  service?: ServiceItem;
  prevService?: ServiceItem | null;
  nextService?: ServiceItem | null;
  relatedProjects?: ExtendedPortfolioItem[];
}

export function ServiceDetailView({
  slug,
  service: propService,
  prevService: propPrev,
  nextService: propNext,
  relatedProjects = [],
}: ServiceDetailViewProps) {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const serviceIndex = servicesData.findIndex((s) => s.slug === slug);
  if (!propService && serviceIndex === -1) {
    notFound();
  }

  const service: ServiceItem = propService || servicesData[serviceIndex] || servicesData[0];

  // Prev / Next services for seamless exploration
  const prevService =
    propPrev !== undefined
      ? propPrev
      : serviceIndex !== -1
      ? servicesData[(serviceIndex - 1 + servicesData.length) % servicesData.length]
      : null;

  const nextService =
    propNext !== undefined
      ? propNext
      : serviceIndex !== -1
      ? servicesData[(serviceIndex + 1) % servicesData.length]
      : null;

  // Prepare slides for ImageSlider & Lightbox
  const sliderItems = service.gallery.map((g) => ({
    title: g.title[lang],
    desc: g.desc[lang],
    image: g.image,
    tag: g.tag[lang],
  }));

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Breadcrumbs Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] mb-8">
          <Link href="/" className="hover:text-[#C6A66B] transition-colors">
            {t.nav.home}
          </Link>
          <span className="text-[var(--border-subtle)]">/</span>
          <Link href="/services" className="hover:text-[#C6A66B] transition-colors">
            {t.nav.services}
          </Link>
          <span className="text-[var(--border-subtle)]">/</span>
          <span className="text-[#C6A66B]">{service.title[lang]}</span>
        </div>

        {/* Hero Header for Service */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 pb-8 border-b border-[var(--border-subtle)]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="gold">
                <span>{service.number}</span>
                <span className="opacity-50">/</span>
                <span>{lang === "ar" ? "الخدمات الأساسية" : "CORE DISCIPLINE"}</span>
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.2] mb-4">
              {service.title[lang]}
            </h1>

            <p className="text-lg sm:text-xl text-[#C6A66B] font-medium leading-relaxed">
              {service.tagline[lang]}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Button
              href="/request-project"
              size="lg"
              variant="primary"
              icon={<ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />}
            >
              {lang === "ar" ? "طلب هذه الخدمة" : "Initiate Engagement"}
            </Button>
          </div>
        </div>

        {/* Gallery Image Slider with Lightbox Preview Functionality */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              <Sparkles className="w-4 h-4 text-[#C6A66B]" />
              <span>{lang === "ar" ? "معرض المخرجات والمعاينة التفاعلية" : "Artifacts & Interactive Gallery"}</span>
            </div>
            <span className="text-xs text-[var(--text-tertiary)]">
              {lang === "ar" ? "انقر على الصورة للمعاينة بملء الشاشة" : "Click slide for full-screen inspection"}
            </span>
          </div>

          <ImageSlider items={sliderItems} autoplay aspectRatio="16/9" />
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {service.keyMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center flex flex-col items-center justify-center"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-[#C6A66B] mb-1 font-mono">
                {metric.value}
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
                {metric.label[lang]}
              </span>
            </div>
          ))}
        </div>

        {/* Two-Column In-depth Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A66B] block mb-3">
              {lang === "ar" ? "الفلسفة والنهج المعماري" : "Philosophy & Approach"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug">
              {lang === "ar"
                ? "كيف نعيد تعريف معايير هذه الخدمة لنمنحكم أسبقية نوعية؟"
                : "How we redefine this capability to secure your competitive advantage."}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
              {service.overview[lang]}
            </p>
            <p className="text-sm sm:text-base text-[var(--text-tertiary)] leading-relaxed">
              {service.shortDescription[lang]}
            </p>
          </div>
        </div>

        {/* Concrete Deliverables Section */}
        <div className="mb-20">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A66B] block mb-2">
              {lang === "ar" ? "نطاق المخرجات الملموسة" : "Deliverables Ecosystem"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {lang === "ar" ? "ما الذي تتسلمه في نهاية المشروع؟" : "What you receive upon project completion"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.deliverables.map((item, idx) => (
              <Card key={idx} variant="elevated" className="p-6 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#C6A66B]/15 border border-[#C6A66B]/30 text-[#C6A66B] shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-1">
                    {item.title[lang]}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.desc[lang]}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 4-Stage Methodology Process */}
        <div className="mb-20">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6A66B] block mb-2">
              {lang === "ar" ? "المنهجية ومراحل العمل" : "Engineering Process"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {lang === "ar" ? "آلية العمل المنضبطة من الفكرة إلى الإطلاق" : "Rigorous delivery from blueprint to launch"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-mono font-bold text-[#C6A66B] block mb-4">
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                    {step.title[lang]}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {step.desc[lang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack & Tooling */}
        <div className="mb-20 p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[#C6A66B]">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {lang === "ar" ? "التقنيات والأدوات المستخدمة" : "Toolsets & Technologies"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {lang === "ar" ? "نعتمد أرقى الأدوات البرمجية والصناعية العالمية" : "World-class industrial tools and frameworks"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {service.techStack.map((tool, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[#C6A66B]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C6A66B] block mb-2">
                  {lang === "ar" ? "معرض التطبيقات" : "Case Studies"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
                  <Briefcase size={24} className="text-[#C6A66B]" />
                  <span>
                    {lang === "ar" ? "أعمال ومشاريع مرتبطة بهذه الخدمة" : "Featured Projects in this Discipline"}
                  </span>
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="text-xs font-bold text-[#C6A66B] hover:text-[#D8BC84] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{lang === "ar" ? "استعراض كافة الأعمال" : "Explore All Works"}</span>
                <ArrowUpRight className={cn("w-3.5 h-3.5", lang === "ar" && "rotate-[-90deg]")} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <div
                  key={p.slug}
                  className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden hover:border-[#C6A66B]/50 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-lg"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-[var(--bg-surface-elevated)] overflow-hidden border-b border-[var(--border-subtle)]">
                      <Image
                        src={p.coverImage}
                        alt={p.title[lang]}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-3 start-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#C6A66B] border border-[#C6A66B]/30 font-bold">
                          {p.number}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors line-clamp-1 mb-2">
                        <Link href={`/portfolio/${p.slug}`}>{p.title[lang]}</Link>
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {p.summary[lang]}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[var(--border-subtle)]/60 mt-auto flex items-center justify-between pt-3">
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">{p.year}</span>
                    <Link
                      href={`/portfolio/${p.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C6A66B] hover:text-[#D8BC84] transition-colors"
                    >
                      <span>{lang === "ar" ? "تفاصيل المشروع" : "Case Study"}</span>
                      <ArrowUpRight className={cn("w-3 h-3", lang === "ar" && "rotate-[-90deg]")} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next / Previous Service Exploration Cards */}
        {(prevService || nextService) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 border-t border-[var(--border-subtle)] mb-16">
            {prevService ? (
              <Link
                href={`/services/${prevService.slug}`}
                className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/50 transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#C6A66B] uppercase tracking-wider mb-2">
                  {lang === "ar" ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                  <span>{lang === "ar" ? "الخدمة السابقة" : "Previous Service"}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors">
                  {prevService.title[lang]}
                </h4>
              </Link>
            ) : <div />}

            {nextService ? (
              <Link
                href={`/services/${nextService.slug}`}
                className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/50 transition-all group flex flex-col justify-between text-end"
              >
                <div className="flex items-center justify-end gap-2 text-xs font-bold text-[#C6A66B] uppercase tracking-wider mb-2">
                  <span>{lang === "ar" ? "الخدمة التالية" : "Next Service"}</span>
                  {lang === "ar" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors">
                  {nextService.title[lang]}
                </h4>
              </Link>
            ) : <div />}
          </div>
        )}

        {/* Bottom Call-to-Action */}
        <div className="rounded-3xl border border-[#C6A66B]/30 bg-gradient-to-b from-[#C6A66B]/10 to-transparent p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <Badge variant="gold" className="mb-4">
            {lang === "ar" ? "بدء التعاقد" : "Get Started"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
            {lang === "ar"
              ? `جاهز لتنفيذ ${service.title.ar}؟`
              : `Ready to initiate ${service.title.en}?`}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
            {lang === "ar"
              ? "فريقنا المتخصص مستعد لتحليل متطلبات مشروعك وصياغة خطة عمل متكاملة تلبي أهدافكم."
              : "Our partners are prepared to evaluate your project parameters and engineer a custom execution blueprint."}
          </p>
          <Button
            href="/request-project"
            size="lg"
            variant="primary"
            icon={<ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />}
          >
            {t.nav.requestProject}
          </Button>
        </div>
      </Container>
    </div>
  );
}
