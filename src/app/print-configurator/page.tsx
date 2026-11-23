"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PrintConfigurator } from "@/components/ui/PrintConfigurator";
import { useLanguage } from "@/hooks";

export default function PrintConfiguratorPage() {
  const { lang } = useLanguage();

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header Intro */}
        <div className="max-w-3xl mb-12">
          <Badge variant="gold" size="md" className="mb-4">
            {lang === "ar" ? "خيارات الطباعة" : "Print Options"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            {lang === "ar"
              ? "مواصفات الطباعة والتغليف"
              : "Print & Packaging Options"}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "حدد نوع المنتج، المقاس، نوع الورق، والتشطيبات الفنية المناسبة لمطبوعاتك، ثم أرسل المواصفة مباشرة إلى واتساب للحصول على السعر وموعد التنفيذ."
              : "Select product type, size, material, and finishes, then submit your specification directly via WhatsApp for pricing and timelines."}
          </p>
        </div>

        {/* Interactive Print Configurator Widget */}
        <PrintConfigurator />
      </Container>
    </div>
  );
}
