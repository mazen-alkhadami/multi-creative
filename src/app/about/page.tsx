"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { servicesData } from "@/data/servicesData";
import { CONTACT_CONFIG } from "@/data/contactConfig";
import { useLanguage } from "@/hooks";
import {
  Sparkles,
  Target,
  Compass,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  FileCode,
  Clock,
  MessageCircle,
} from "lucide-react";

export default function AboutPage() {
  const { lang } = useLanguage();

  const methodologySteps = [
    {
      step: "01",
      title: lang === "ar" ? "الاستيعاب والتدقيق" : "Scoping & Understanding",
      desc:
        lang === "ar"
          ? "الاستماع الدقيق لمتطلبات مشروعك، وتحليل الأهداف الفنية والتسويقية وتحديد نطاق العمل بوضوح."
          : "Active listening to understand your project vision, target audience, and precise technical scope.",
    },
    {
      step: "02",
      title: lang === "ar" ? "التخطيط والتصميم" : "Architecture & Design",
      desc:
        lang === "ar"
          ? "رسم مخططات تجربة المستخدم، واختيار الأنماط البصرية والخطوط والألوان المتناسقة مع هوية العمل."
          : "Crafting structural wireframes, UX flows, and bespoke aesthetic palettes aligned with your brand.",
    },
    {
      step: "03",
      title: lang === "ar" ? "التنفيذ الهندسي والإنتاجي" : "Engineering & Production",
      desc:
        lang === "ar"
          ? "برمجة الواجهات بأحدث التقنيات السريعة، أو تجهيز ملفات الطباعة والإنتاج وفق أعلى المعايير الفنية."
          : "Developing clean, performant codebases or preparing press-ready vector assets with precision.",
    },
    {
      step: "04",
      title: lang === "ar" ? "المراجعة والتسليم" : "Review & Full Handover",
      desc:
        lang === "ar"
          ? "فحص شامل للمخرجات على مختلف الشاشات، وتسليم الأصول والملفات المصدرية الكاملة للعميل."
          : "Rigorous testing across viewports, final refinement, and 100% transfer of all source files.",
    },
  ];

  const differentiators = [
    {
      icon: ShieldCheck,
      title: lang === "ar" ? "الوضوح والشفافية" : "Clarity & Transparency",
      desc:
        lang === "ar"
          ? "تحديد مسبق ودقيق لنطاق العمل والمتطلبات دون بنود مبهمة أو مفاجآت غير متوقعة."
          : "Pre-defined project milestones and requirements with zero ambiguity or hidden clauses.",
    },
    {
      icon: FileCode,
      title: lang === "ar" ? "ملكية الأصول 100%" : "Full Asset Ownership",
      desc:
        lang === "ar"
          ? "جميع الأكواد المصدرية، ملفات التصميم المفتوحة، والأصول الإنتاجية تُسلم بالكامل وتكون ملكاً للمشروع."
          : "You receive complete ownership of all repository code, open vector design files, and production assets.",
    },
    {
      icon: Clock,
      title: lang === "ar" ? "احترام الجداول الزمنية" : "Realistic Schedules",
      desc:
        lang === "ar"
          ? "وضع خطط تنفيذ منطقية ومدروسة والالتزام بمواعيد الإنجاز المتفق عليها دون وعود غير واقعية."
          : "Constructing realistic schedules and honoring delivery commitments without speculative promises.",
    },
    {
      icon: Layers,
      title: lang === "ar" ? "تكامل التخصصات" : "Unified Capabilities",
      desc:
        lang === "ar"
          ? "الجمع بين تصميم وتطوير المواقع والبرمجيات، والإنتاج الملموس للمطبوعات والهدايا في مسار متناسق واحد."
          : "Bridging modern digital software engineering and tactile print/merchandise in one coherent workflow.",
    },
  ];

  return (
    <div className="py-12 md:py-20 space-y-20">
      <Container>
        {/* Section 1: Hero & Overview */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="gold" size="md">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>{lang === "ar" ? "من نحن" : "About Us"}</span>
            </span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.2]">
            {lang === "ar" ? (
              <>
                الإبداع والحلول الرقمية{" "}
                <span className="text-[#C6A66B]">بمعايير الجودة والإتقان</span>
              </>
            ) : (
              <>
                Creative & Digital Solutions with{" "}
                <span className="text-[#C6A66B]">Uncompromising Craft</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl mx-auto">
            {lang === "ar"
              ? "MULTI CREATIVES مبادرة عمل مهنية متخصصة في تقديم الحلول الرقمية والإبداعية المتكاملة. نجمع بين جماليات التصميم العصري، وكفاءة الهندسة البرمجية، ودقة الإنتاج الملموس للمطبوعات والهدايا، لتمكين أصحاب المشاريع من إبراز أعمالهم بمظهر احترافي ومميز."
              : "MULTI CREATIVES is a dedicated professional practice providing integrated creative and digital solutions. We unite modern aesthetic design, robust software engineering, and artisanal print and merchandise production to empower forward-thinking ventures."}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Button
              href="/request-project"
              size="md"
              variant="primary"
              icon={<ArrowUpRight className={lang === "ar" ? "w-4 h-4 rotate-[-90deg]" : "w-4 h-4"} />}
            >
              {lang === "ar" ? "طلب خدمة مباشرة" : "Request a Service"}
            </Button>
            <Button href="/services" size="md" variant="secondary">
              {lang === "ar" ? "استكشف خدماتنا السبع" : "Explore All 7 Services"}
            </Button>
          </div>
        </div>

        {/* Section 2: Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-16">
          {/* Vision */}
          <Card className="p-8 sm:p-10 border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-3xl space-y-4 hover:border-[#C6A66B]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#C6A66B]/15 border border-[#C6A66B]/30 flex items-center justify-center text-[#C6A66B]">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {lang === "ar" ? "رؤيتنا" : "Our Vision"}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {lang === "ar"
                ? "أن نكون الوجهة الموثوقة لأصحاب المشاريع والأعمال الراغبين في الارتقاء بمظهرهم الرقمي والواقعي، من خلال بناء منصات وهويات بصرية تجمع بين البساطة الفاخرة، السرعة الفائقة، والاستقرار المستمر، وخدمة العملاء في السعودية واليمن باحترافية تامة."
                : "To be the premier trusted partner for entrepreneurs seeking to elevate their digital and physical presence, creating enduring platforms and identities defined by quiet luxury, high performance, and reliable delivery across Saudi Arabia and Yemen."}
            </p>
          </Card>

          {/* Mission */}
          <Card className="p-8 sm:p-10 border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-3xl space-y-4 hover:border-[#C6A66B]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#C6A66B]/15 border border-[#C6A66B]/30 flex items-center justify-center text-[#C6A66B]">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {lang === "ar" ? "رسالتنا" : "Our Mission"}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {lang === "ar"
                ? "تقديم خدمات إبداعية وبرمجية متقنة تترجم أفكار العميل إلى حلول عملية جاهزة للتشغيل، بالاعتماد على أحدث التقنيات وأفضل ممارسات التصميم والطباعة، مع الالتزام التام بالشفافية وجودة التنفيذ دون تعقيد غير ضروري."
                : "To engineer purposeful creative and digital deliverables that transform client concepts into operational solutions, utilizing modern web frameworks and pre-press standards while maintaining absolute clarity and uncompromising craft."}
            </p>
          </Card>
        </div>

        {/* Section 3: Methodology (منهجية عملنا) */}
        <div className="pt-20 space-y-12">
          <div className="max-w-2xl">
            <Badge variant="gold" size="sm" className="mb-3">
              {lang === "ar" ? "خطوات واضحة" : "Structured Process"}
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
              {lang === "ar" ? "منهجية عملنا في تنفيذ المشاريع" : "Our Working Methodology"}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2">
              {lang === "ar"
                ? "نتبع خطوات مدروسة ومباشرة تضمن تسليم العمل بأعلى درجات الجودة وبلا هدر للوقت."
                : "A pragmatic, four-step path ensuring high-fidelity delivery without unnecessary delays."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodologySteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-4 hover:border-[#C6A66B]/40 transition-all"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-[#C6A66B] px-2.5 py-1 rounded-md bg-[#C6A66B]/10 border border-[#C6A66B]/20 inline-block mb-3">
                    {step.step}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: What Distinguishes Us (ما يميز طريقة تنفيذ خدماتنا) */}
        <div className="pt-20 space-y-12">
          <div className="max-w-2xl">
            <Badge variant="gold" size="sm" className="mb-3">
              {lang === "ar" ? "معايير الجودة" : "Quality Standards"}
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
              {lang === "ar" ? "ما الذي يميز طريقة تنفيذ خدماتنا" : "What Distinguishes Our Delivery"}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2">
              {lang === "ar"
                ? "ركائز أساسية نلتزم بها مع كل عميل لضمان تجربة عمل مريحة ونتائج موثوقة."
                : "Core operating principles that guide every client engagement and project milestone."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((diff, idx) => {
              const Icon = diff.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-3 hover:border-[#C6A66B]/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#C6A66B]/15 border border-[#C6A66B]/30 flex items-center justify-center text-[#C6A66B]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {diff.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {diff.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 5: The 7 Approved Disciplines (المجالات السبعة التي نقدمها) */}
        <div className="pt-20 space-y-12">
          <div className="max-w-2xl">
            <Badge variant="gold" size="sm" className="mb-3">
              {lang === "ar" ? "التخصصات المعتمدة" : "Core Capabilities"}
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
              {lang === "ar" ? "المجالات السبعة التي نقدمها" : "Our Seven Core Disciplines"}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2">
              {lang === "ar"
                ? "خدمات متكاملة تغطي كافة احتياجات حضورك الرقمي والميداني."
                : "Comprehensive services covering all dimensions of your digital and physical brand presence."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/50 hover:bg-[var(--bg-surface-elevated)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#C6A66B] px-2.5 py-0.5 rounded bg-[#C6A66B]/10 border border-[#C6A66B]/20">
                      {service.number}
                    </span>
                    <ArrowUpRight className={lang === "ar" ? "w-4 h-4 text-[var(--text-muted)] group-hover:text-[#C6A66B] transition-colors rotate-[-90deg]" : "w-4 h-4 text-[var(--text-muted)] group-hover:text-[#C6A66B] transition-colors"} />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors mb-2">
                    {service.title[lang]}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    {service.shortDescription[lang]}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center gap-1.5 text-[11px] font-semibold text-[#C6A66B]">
                  <span>{lang === "ar" ? "تفاصيل الخدمة ومخرجاتها" : "View Deliverables"}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 6: Direct Call to Action Banner */}
        <div className="pt-20">
          <div className="rounded-3xl border border-[#C6A66B]/40 bg-[var(--bg-surface-elevated)] p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4">
              <Badge variant="gold" size="sm">
                {lang === "ar" ? "ابدأ مشروعك معنا" : "Start Your Project"}
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
                {lang === "ar"
                  ? "جاهز لمناقشة فكرة مشروعك وتحويلها إلى واقع؟"
                  : "Ready to Discuss and Bring Your Project to Life?"}
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {lang === "ar"
                  ? "تواصل معنا مباشرة عبر واتساب أو أرسل تفاصيل طلبك من خلال النموذج المخصص وسنزودك بخطة عمل واضحة وتفاصيل دقيقة."
                  : "Connect with us on WhatsApp or submit your project brief for a clear, actionable proposal."}
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Button
                  href="/request-project"
                  size="md"
                  variant="primary"
                  icon={<ArrowUpRight className={lang === "ar" ? "w-4 h-4 rotate-[-90deg]" : "w-4 h-4"} />}
                >
                  {lang === "ar" ? "طلب خدمة مباشرة" : "Request a Service"}
                </Button>
                <a
                  href={CONTACT_CONFIG.phone.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-[#C6A66B]/15 hover:bg-[#C6A66B]/25 text-[#C6A66B] border border-[#C6A66B]/40 text-sm font-bold transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#C6A66B]" />
                  <span>{lang === "ar" ? "محادثة عبر واتساب" : "WhatsApp Chat"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
