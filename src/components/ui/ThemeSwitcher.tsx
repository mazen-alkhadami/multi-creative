"use client";

import React from "react";
import { useTheme } from "@/hooks";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className = "" }: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "relative p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/40 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B] cursor-pointer",
        className
      )}
      aria-label={theme === "dark" ? "Activate Light Mode" : "تفعيل الوضع الداكن"}
      title={theme === "dark" ? "Switch to Light Mode" : "التبديل إلى الوضع الداكن"}
    >
      <span className="sr-only">Toggle Theme</span>
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-[#C6A66B] transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#111111] transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
