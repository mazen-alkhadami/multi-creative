"use client";

import React from "react";
import { useLanguage } from "@/hooks";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "simple";
}

export function LanguageSwitcher({ className = "", variant = "pill" }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  if (variant === "simple") {
    return (
      <button
        onClick={() => setLang(lang === "ar" ? "en" : "ar")}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[#C6A66B] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A66B]",
          className
        )}
        title={lang === "ar" ? "Switch to English" : "التحويل إلى العربية"}
        aria-label="Switch Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#C6A66B]" />
        <span>{lang === "ar" ? "English" : "العربية"}</span>
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Language selection"
      className={cn(
        "inline-flex items-center p-0.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-medium select-none",
        className
      )}
    >
      <button
        role="radio"
        aria-checked={lang === "ar"}
        onClick={() => setLang("ar")}
        className={cn(
          "px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer",
          lang === "ar"
            ? "bg-[#C6A66B] text-[#111111] font-semibold shadow-sm"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
      >
        العربية
      </button>
      <button
        role="radio"
        aria-checked={lang === "en"}
        onClick={() => setLang("en")}
        className={cn(
          "px-2.5 py-1 rounded-full transition-all duration-300 cursor-pointer",
          lang === "en"
            ? "bg-[#C6A66B] text-[#111111] font-semibold shadow-sm"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        )}
      >
        EN
      </button>
    </div>
  );
}
