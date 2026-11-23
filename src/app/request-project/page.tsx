"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SmartProjectBrief } from "@/components/ui/SmartProjectBrief";
import { useLanguage } from "@/hooks";

export default function RequestProjectPage() {
  const { lang } = useLanguage();

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header Intro */}
        <div className="max-w-3xl mb-12">
          <Badge variant="gold" size="md" className="mb-4">
            {lang === "ar" ? "طلب خدمة مباشرة" : "Request a Service"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            {lang === "ar"
              ? "أرسل تفاصيل طلبك لنبدأ التنفيذ"
              : "Share Your Requirements & Let's Build"}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "اختر الخدمة التي تحتاجها واكتب وصفاً موجزاً لطلبك، وسنتواصل معك مباشرة عبر واتساب لمناقشة التفاصيل والبدء في العمل."
              : "Select your desired service, describe your needs, and we will connect with you directly via WhatsApp to begin."}
          </p>
        </div>

        {/* Smart Project Brief Multi-step Component */}
        <SmartProjectBrief />
      </Container>
    </div>
  );
}
