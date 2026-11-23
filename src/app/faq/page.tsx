"use client";

import React, { useState, useMemo } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { faqData, faqCategories, FaqItem } from "@/data/faqData";
import { useLanguage } from "@/hooks";
import { Search, ChevronDown, HelpCircle, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FaqPage() {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>("engagement-1");

  // Filter items based on category and search query
  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const questionText = item.question[lang].toLowerCase();
      const answerText = item.answer[lang].toLowerCase();

      return questionText.includes(q) || answerText.includes(q);
    });
  }, [selectedCategory, searchQuery, lang]);

  const toggleItem = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <Badge variant="gold" size="md" className="mb-4">
            {lang === "ar" ? "مركز المساعدة والمعرفة" : "Help Center & Knowledge Base"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            {lang === "ar"
              ? "مركز المساعدة والأسئلة الشائعة"
              : "Help Center & Frequently Asked Questions"}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "إجابات شفافة ومفصلة حول آليات التعاقد، ومنهجيتنا التقنية الصارمة، ومعايير الجودة والأمان في MULTI CREATIVES."
              : "Transparent architectural answers regarding our engagement models, technical standards, security policies, and production craftsmanship."}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mb-10 space-y-6">
          {/* Live Search Input */}
          <div className="relative">
            <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === "ar"
                  ? "ابحث في الأسئلة والمعايير الفنية..."
                  : "Search questions, technical standards, or topics..."
              }
              className="w-full ps-12 pe-4 py-3.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:border-[#C6A66B] transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              {faqCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border",
                      isActive
                        ? "bg-[#C6A66B] text-black border-[#C6A66B] font-semibold shadow-sm"
                        : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[#C6A66B]/40"
                    )}
                  >
                    {cat.label[lang]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl space-y-4 mb-16">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item: FaqItem) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border transition-all duration-200 overflow-hidden",
                    isExpanded
                      ? "border-[#C6A66B]/50 bg-[var(--bg-surface-elevated)] shadow-sm"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/30"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isExpanded}
                    className="w-full p-5 sm:p-6 text-start flex items-center justify-between gap-4"
                  >
                    <span className="text-base sm:text-lg font-bold text-[var(--text-primary)] leading-snug">
                      {item.question[lang]}
                    </span>
                    <span
                      className={cn(
                        "p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-transform duration-200 shrink-0",
                        isExpanded && "rotate-180 text-[#C6A66B] border-[#C6A66B]/40"
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)]/60 animate-in fade-in duration-200">
                      {item.answer[lang]}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <HelpCircle className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                {lang === "ar" ? "لم نجد نتائج مطابقة لبحثك" : "No matching questions found"}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                {lang === "ar"
                  ? "جرّب تغيير كلمات البحث أو استعرض جميع الفئات."
                  : "Try altering your query or select a different category."}
              </p>
            </div>
          )}
        </div>

        {/* Direct Contact Support Box */}
        <div className="max-w-4xl p-8 sm:p-10 rounded-2xl border border-[#C6A66B]/30 bg-gradient-to-br from-[#1C1C1C] to-[#111111] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-start">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {lang === "ar" ? "هل لديك استفسار هندسي خاص؟" : "Have a specific architectural inquiry?"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg">
              {lang === "ar"
                ? "فريق الاستشارات الفنية في MULTI CREATIVES جاهز للرد على استفسارات العقود والمشاريع خلال يوم عمل واحد."
                : "Our advisory team is available to address bespoke scope, contractual governance, and tech queries within one business day."}
            </p>
          </div>
          <Button
            href="/contact"
            variant="primary"
            size="lg"
            className="shrink-0"
            icon={<ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />}
          >
            {lang === "ar" ? "تواصل مع الإدارة" : "Contact Executive Advisory"}
          </Button>
        </div>
      </Container>
    </div>
  );
}
