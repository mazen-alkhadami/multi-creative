"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { QuoteBuilder } from "@/components/ui/QuoteBuilder";
import { useLanguage } from "@/hooks";

export default function QuoteBuilderPage() {
  const { lang } = useLanguage();

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header Intro */}
        <div className="max-w-3xl mb-12">
          <Badge variant="gold" size="md" className="mb-4">
            {lang === "ar" ? "تقدير نطاق العمل" : "Scope Estimator"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            {lang === "ar"
              ? "تحديد نطاق المشروع والخدمات المطلوبة"
              : "Project Scope & Services Selection"}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "حدد الخدمات التي تحتاجها لمشروعك، وتواصل معنا لمناقشة المتطلبات الفنية والحصول على خطة عمل واضحة دون أي تعقيد."
              : "Select the services you need for your project, and connect with us directly to discuss your requirements with complete clarity."}
          </p>
        </div>

        {/* Interactive Quote Builder Widget */}
        <QuoteBuilder />
      </Container>
    </div>
  );
}
