"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslation, useLanguage } from "@/hooks";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CtaBannerSection() {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)] relative overflow-hidden">
      <div
        className="pointer-events-none absolute bottom-0 end-0 w-96 h-96 rounded-full blur-[120px] opacity-10"
        style={{
          background: "radial-gradient(circle, #C6A66B 0%, rgba(198,166,107,0) 70%)",
        }}
        aria-hidden="true"
      />

      <Container size="narrow" className="relative z-10 text-center">
        <div className="mb-6">
          <Badge variant="gold">{t.ctaBanner.badge}</Badge>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.2] mb-6">
          {t.ctaBanner.title}
        </h2>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto mb-10">
          {t.ctaBanner.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            href="/request-project"
            size="lg"
            variant="primary"
            className="w-full sm:w-auto"
            icon={<ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />}
          >
            {t.ctaBanner.primaryButton}
          </Button>

          <Button
            href="/contact"
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
          >
            {t.ctaBanner.secondaryButton}
          </Button>
        </div>
      </Container>
    </section>
  );
}
