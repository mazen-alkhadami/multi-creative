"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowUpRight, BookOpen, Briefcase, FileText, HelpCircle, Layers } from "lucide-react";
import { servicesData } from "@/data/servicesData";
import { portfolioData } from "@/data/portfolioData";
import { blogPosts } from "@/data/blogData";
import { faqData } from "@/data/faqData";
import { useLanguage } from "@/hooks";
import { cn } from "@/lib/utils";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and lock scroll upon open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  // Global keyboard shortcut (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setQuery("");
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Index search results
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: "service" | "portfolio" | "blog" | "faq";
      url: string;
    }> = [];

    // Search Services
    servicesData.forEach((s) => {
      if (
        s.title.ar.toLowerCase().includes(trimmed) ||
        s.title.en.toLowerCase().includes(trimmed) ||
        s.shortDescription.ar.toLowerCase().includes(trimmed) ||
        s.shortDescription.en.toLowerCase().includes(trimmed)
      ) {
        results.push({
          id: `service-${s.slug}`,
          title: s.title[lang],
          subtitle: s.shortDescription[lang],
          category: "service",
          url: `/services/${s.slug}`,
        });
      }
    });

    // Search Portfolio
    portfolioData.forEach((p) => {
      if (
        p.title.ar.toLowerCase().includes(trimmed) ||
        p.title.en.toLowerCase().includes(trimmed) ||
        p.summary.ar.toLowerCase().includes(trimmed) ||
        p.summary.en.toLowerCase().includes(trimmed) ||
        p.categoryName.ar.toLowerCase().includes(trimmed) ||
        p.categoryName.en.toLowerCase().includes(trimmed) ||
        p.tools.some((t) => t.toLowerCase().includes(trimmed))
      ) {
        results.push({
          id: `portfolio-${p.slug}`,
          title: p.title[lang],
          subtitle: `${p.categoryName[lang]} • ${p.tools.slice(0, 2).join(", ")}`,
          category: "portfolio",
          url: `/portfolio/${p.slug}`,
        });
      }
    });

    // Search Blog
    blogPosts.forEach((b) => {
      if (
        b.title.ar.toLowerCase().includes(trimmed) ||
        b.title.en.toLowerCase().includes(trimmed) ||
        b.summary.ar.toLowerCase().includes(trimmed) ||
        b.summary.en.toLowerCase().includes(trimmed) ||
        b.category.ar.toLowerCase().includes(trimmed) ||
        b.category.en.toLowerCase().includes(trimmed)
      ) {
        results.push({
          id: `blog-${b.slug}`,
          title: b.title[lang],
          subtitle: b.category[lang],
          category: "blog",
          url: `/blog/${b.slug}`,
        });
      }
    });

    // Search FAQ
    faqData.forEach((f) => {
      if (
        f.question.ar.toLowerCase().includes(trimmed) ||
        f.question.en.toLowerCase().includes(trimmed) ||
        f.answer.ar.toLowerCase().includes(trimmed) ||
        f.answer.en.toLowerCase().includes(trimmed)
      ) {
        results.push({
          id: `faq-${f.id}`,
          title: f.question[lang],
          subtitle: f.answer[lang].slice(0, 80) + "...",
          category: "faq",
          url: `/faq`,
        });
      }
    });

    return results.slice(0, 10);
  }, [query, lang]);

  if (!isOpen) return null;

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const handleSelect = (url: string) => {
    setQuery("");
    onClose();
    router.push(url);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "service":
        return <Layers className="w-4 h-4 text-[#C6A66B]" />;
      case "portfolio":
        return <Briefcase className="w-4 h-4 text-[#C6A66B]" />;
      case "blog":
        return <BookOpen className="w-4 h-4 text-[#C6A66B]" />;
      case "faq":
        return <HelpCircle className="w-4 h-4 text-[#C6A66B]" />;
      default:
        return <FileText className="w-4 h-4 text-[#C6A66B]" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "service":
        return lang === "ar" ? "خدمة" : "Service";
      case "portfolio":
        return lang === "ar" ? "مشروع" : "Case Study";
      case "blog":
        return lang === "ar" ? "مقال" : "Article";
      case "faq":
        return lang === "ar" ? "سؤال شائع" : "FAQ";
      default:
        return "";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-[120] flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]">
          <Search className="w-5 h-5 text-[#C6A66B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === "ar"
                ? "ابحث في الخدمات، المشاريع، المقالات، والأسئلة الشائعة..."
                : "Search services, case studies, articles, and FAQs..."
            }
            className="flex-1 bg-transparent border-none text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {lang === "ar" ? "مسح" : "Clear"}
            </button>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
              <p>
                {lang === "ar"
                  ? "ابدأ بكتابة اسم الخدمة (مثل: مواقع، تطبيقات، أنظمة، طباعة)، أو عنوان المقال."
                  : "Type to query services, software architecture, case studies, or FAQs."}
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-mono text-[10px]">
                  Next.js 16
                </span>
                <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-mono text-[10px]">
                  {lang === "ar" ? "الذكاء الاصطناعي" : "AI"}
                </span>
                <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-mono text-[10px]">
                  {lang === "ar" ? "الطباعة الفاخرة" : "Packaging"}
                </span>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelect(result.url)}
                className="w-full p-3.5 rounded-xl border border-transparent hover:border-[#C6A66B]/30 hover:bg-[var(--bg-surface-elevated)] text-start flex items-center justify-between gap-4 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] group-hover:bg-[#C6A66B]/10 border border-[var(--border-subtle)] shrink-0">
                    {getCategoryIcon(result.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C6A66B]">
                        {getCategoryLabel(result.category)}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors truncate">
                      {result.title}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] truncate">
                      {result.subtitle}
                    </div>
                  </div>
                </div>

                <ArrowUpRight className={cn("w-4 h-4 text-[var(--text-muted)] group-hover:text-[#C6A66B] shrink-0", lang === "ar" && "rotate-[-90deg]")} />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              {lang === "ar"
                ? `لم يتم العثور على أي نتائج مطابقة لـ "${query}"`
                : `No results found matching "${query}"`}
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-mono text-[10px]">
                ESC
              </kbd>{" "}
              {lang === "ar" ? "للإغلاق" : "to close"}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#C6A66B]">MULTI CREATIVES INDEX</span>
        </div>
      </div>
    </div>
  );
}
