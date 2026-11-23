"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslation, useLanguage } from "@/hooks";
import { ArrowUpRight, Sparkles, Layers, Cpu, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { t } = useTranslation();
  const { lang } = useLanguage();

  const featureCards = [
    {
      icon: <Layers className="w-5 h-5 text-[#C6A66B]" />,
      title: t.hero.feature1Title,
      desc: t.hero.feature1Desc,
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#C6A66B]" />,
      title: t.hero.feature2Title,
      desc: t.hero.feature2Desc,
    },
    {
      icon: <Compass className="w-5 h-5 text-[#C6A66B]" />,
      title: t.hero.feature3Title,
      desc: t.hero.feature3Desc,
    },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Subtle Ambient Glow Background - Elegant & Non-intrusive */}
      <div
        className="pointer-events-none absolute -top-40 start-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-15"
        style={{
          background: "radial-gradient(circle, #C6A66B 0%, rgba(198,166,107,0) 70%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10 flex flex-col items-center text-center">
        {/* Top Highlight Badge */}
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Badge variant="gold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>{t.hero.badge}</span>
            </span>
          </Badge>
        </div>

        {/* Hero Display Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] max-w-5xl leading-[1.15] sm:leading-[1.12]">
          <span>{t.hero.headlinePart1} </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8BC84] via-[#C6A66B] to-[#A8884C] underline decoration-[#C6A66B]/30 decoration-2 underline-offset-8">
            {t.hero.headlineHighlight}
          </span>
          <br className="hidden sm:inline" />
          <span> {t.hero.headlinePart2}</span>
        </h1>

        {/* Supporting Narrative */}
        <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed font-normal">
          {t.hero.subheading}
        </p>

        {/* Call-to-Action Group */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button
            href="/request-project"
            size="lg"
            variant="primary"
            className="w-full sm:w-auto"
            icon={<ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />}
          >
            {t.hero.primaryCta}
          </Button>

          <Button
            href="/services"
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            {t.hero.secondaryCta}
          </Button>
        </div>

        {/* Value Pillars Grid */}
        <div className="mt-16 md:mt-24 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          {featureCards.map((card, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] inline-flex items-center justify-center mb-5 group-hover:border-[#C6A66B]/30 transition-colors">
                {card.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
