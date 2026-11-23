"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { useTranslation, useLanguage } from "@/hooks";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CoreCapabilitiesSection() {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  return (
    <section className="py-20 md:py-32 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 transition-colors">
      <Container>
        <SectionHeader
          badge={t.capabilities.badge}
          title={t.capabilities.title}
          subtitle={t.capabilities.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {t.capabilities.items.map((item, idx) => (
            <Card
              key={idx}
              variant="interactive"
              className="p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-semibold tracking-wider text-[#C6A66B]">
                    0{idx + 1}
                  </span>
                  <Link
                    href="/services"
                    className="p-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] group-hover:text-[#C6A66B] group-hover:border-[#C6A66B]/40 transition-colors"
                    aria-label={`Learn more about ${item.title}`}
                  >
                    <ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />
                  </Link>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[#C6A66B] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Capability Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border-subtle)]/60">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
