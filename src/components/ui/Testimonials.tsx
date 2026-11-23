"use client";

import React from "react";
import { Container, Badge } from "@/components/ui";
import { useLanguage } from "@/hooks";
import { ShieldCheck, Award, CheckCircle2, Lock } from "lucide-react";

export function Testimonials() {
  const { lang } = useLanguage();

  const standards = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C6A66B]" />,
      title: {
        ar: "السرية التامة وحماية البيانات",
        en: "Confidentiality & Privacy",
      },
      desc: {
        ar: "نلتزم بحفظ سرية جميع تفاصيل مشروعك ومعلوماتك، ونحمي خصوصيتك في كل مراحل العمل.",
        en: "We maintain strict confidentiality for all your project details and business information.",
      },
      tag: { ar: "سرية تامة", en: "Confidential" },
    },
    {
      icon: <Award className="w-5 h-5 text-[#C6A66B]" />,
      title: {
        ar: "جودة التنفيذ والاهتمام بالتفاصيل",
        en: "Quality & Attention to Detail",
      },
      desc: {
        ar: "نحرص على مراجعة كل تصميم واختبار كل صفحة للتأكد من خلو العمل من الأخطاء وجاهزيته التامة.",
        en: "We thoroughly review every design and test every page to ensure seamless operation.",
      },
      tag: { ar: "جودة عالية", en: "High Quality" },
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#C6A66B]" />,
      title: {
        ar: "الالتزام بمواعيد التسليم",
        en: "On-Time Delivery",
      },
      desc: {
        ar: "نضع جدولاً زمنياً واقعياً ونتفق معك على مواعيد واضحة مع إطلاعك المستمر على سير الإنجاز.",
        en: "We agree on realistic timelines and keep you updated on progress every step of the way.",
      },
      tag: { ar: "التزام زمني", en: "On Schedule" },
    },
    {
      icon: <Lock className="w-5 h-5 text-[#C6A66B]" />,
      title: {
        ar: "ملكية كاملة لجميع مخرجاتك",
        en: "Full Client Ownership",
      },
      desc: {
        ar: "تحصل على كافة ملفات التصميم الأصلية والشيفرات البرمجية والملفات المفتوحة فور إتمام التسليم.",
        en: "You receive full ownership of all source code, design assets, and raw files upon project delivery.",
      },
      tag: { ar: "ملكية كاملة", en: "100% Ownership" },
    },
  ];

  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 relative">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="gold" className="mb-4">
            {lang === "ar" ? "معايير التزامنا" : "OUR COMMITMENT"}
          </Badge>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.2] mb-4">
            {lang === "ar"
              ? "مبادئ العمل التي نلتزم بها مع كل عميل"
              : "Core Principles We Commit to for Every Project"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "نعمل بوضوح وشفافية واحترافية لنقدم لك تجربة مريحة وعملاً متقناً يلبي توقعاتك."
              : "We operate with transparency, precision, and dedication to deliver results that exceed your expectations."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-2.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] group-hover:border-[#C6A66B]/40 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#C6A66B]/10 border border-[#C6A66B]/20 text-[#C6A66B]">
                    {item.tag[lang]}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] mb-2.5 group-hover:text-[#C6A66B] transition-colors">
                  {item.title[lang]}
                </h3>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.desc[lang]}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-[var(--border-subtle)]/50 flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)]">
                <span>0{idx + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
