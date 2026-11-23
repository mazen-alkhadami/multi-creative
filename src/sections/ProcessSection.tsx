"use client";

import React from "react";
import { Container, SectionHeader } from "@/components/ui";
import { useLanguage } from "@/hooks";

export function ProcessSection() {
  const { lang } = useLanguage();

  const steps = [
    {
      number: "01",
      title: { ar: "فهم المتطلبات وتحديد الهدف", en: "Understanding Requirements" },
      desc: {
        ar: "نستمع إليك بدقة لفهم طبيعة نشاطك ومتطلبات الخدمة والنتائج التي تود تحقيقها.",
        en: "We listen attentively to understand your goals, target audience, and exact service needs.",
      },
    },
    {
      number: "02",
      title: { ar: "التصميم والتخطيط الأولي", en: "Planning & Design Mockup" },
      desc: {
        ar: "نحدد خطة العمل ونقدم لك نماذج وتصاميم مبدئية قبل بدء البرمجة أو الإنتاج الفعلي.",
        en: "We draft a clear execution roadmap and initial design mockups before development or production.",
      },
    },
    {
      number: "03",
      title: { ar: "التطوير والتنفيذ المتقن", en: "Development & Build" },
      desc: {
        ar: "ننفذ العمل باحترافية عالية مع الاهتمام بأدق التفاصيل والسرعة والتوافق مع الجوال.",
        en: "We build and execute the service with high attention to performance, speed, and responsiveness.",
      },
    },
    {
      number: "04",
      title: { ar: "المراجعة والتسليم النهائي", en: "Review & Launch" },
      desc: {
        ar: "نراجع معك النتائج بدقة، ونجري أي تعديلات مطلوبة، ونسلمك المشروع جاهزاً للاستخدام.",
        en: "We review the deliverables with you, make necessary adjustments, and hand over a ready-to-use result.",
      },
    },
  ];

  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)] relative transition-colors">
      <Container>
        <SectionHeader
          badge={lang === "ar" ? "طريقة العمل" : "OUR PROCESS"}
          title={
            lang === "ar"
              ? "خطوات واضحة ومباشرة لتنفيذ طلبك"
              : "Clear & Direct Steps to Bring Your Project to Life"
          }
          subtitle={
            lang === "ar"
              ? "نحرص على الوضوح في كل مرحلة، من أول تواصل وحتى تسليم العمل النهائي بجودة ترضيك."
              : "We prioritize clarity and precision at every stage, from first consultation to final delivery."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#C6A66B] mb-4 block">
                  {step.number}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2">
                  {step.title[lang]}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {step.desc[lang]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
