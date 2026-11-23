"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslation, useLanguage } from "@/hooks";
import { ArrowLeft, ArrowRight, Construction } from "lucide-react";

export interface PageShellProps {
  badge?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PageShell({
  badge,
  title,
  description,
  children,
}: PageShellProps) {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  return (
    <div className="py-16 md:py-24">
      <Container>
        {/* Navigation Breadcrumb / Return */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[#C6A66B] transition-colors"
          >
            {lang === "ar" ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{t.pagePlaceholders.backHome}</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          {badge && (
            <div className="mb-4">
              <Badge variant="gold">{badge}</Badge>
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.2] mb-4">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Page Content Body or Phase 2 Foundation Card */}
        {children ? (
          <div>{children}</div>
        ) : (
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] mb-5 text-[#C6A66B]">
              <Construction className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2">
              {t.pagePlaceholders.underConstruction}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 max-w-md">
              {lang === "ar"
                ? "يتم حالياً تطوير هيكل هذه الصفحة وتجهيز كافة تفاصيلها المعمارية لتنطلق في المرحلة القادمة."
                : "The detailed interactive layout and content for this page are architected for Phase 2 deployment."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button href="/request-project" size="sm" variant="primary">
                {t.nav.requestProject}
              </Button>
              <Button href="/" size="sm" variant="outline">
                {t.pagePlaceholders.backHome}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
