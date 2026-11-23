"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowUpRight,
  Search,
  ChevronDown,
  Calculator,
  Printer,
  FileEdit,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useTranslation, useLanguage, useSearch } from "@/hooks";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const { openSearch } = useSearch();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for subtle shadow enhancement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
    { href: "/faq", label: t.nav.faq },
  ];

  const toolLinks = [
    {
      href: "/request-project",
      title: lang === "ar" ? "طلب خدمة مباشرة" : "Request a Service",
      desc: lang === "ar" ? "تحديد متطلبات مشروعك وإرسالها مباشرة" : "Submit detailed project requirements directly",
      icon: FileEdit,
    },
    {
      href: "/quote-builder",
      title: lang === "ar" ? "تقدير نطاق العمل" : "Scope Estimator",
      desc: lang === "ar" ? "تحديد الخدمات وحساب نطاق المتطلبات" : "Select deliverables and scope requirements",
      icon: Calculator,
    },
    {
      href: "/print-configurator",
      title: lang === "ar" ? "خيارات الطباعة" : "Print Configurator",
      desc: lang === "ar" ? "تخصيص الخامات والمقاسات والتشطيبات" : "Configure paper, finishes, and quantities",
      icon: Printer,
    },
  ];

  const isToolActive = toolLinks.some((t) => pathname === t.href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled
          ? "bg-[var(--header-bg)] backdrop-blur-md border-[var(--border-subtle)] shadow-md"
          : "bg-[var(--header-bg)] backdrop-blur-sm border-[var(--border-subtle)]/70"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center shrink-0">
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2"
          aria-label={lang === "ar" ? "التنقل الرئيسي" : "Main Navigation"}
        >
          {/* First Group: Home, About, Services, Portfolio */}
          {navLinks.slice(0, 4).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200",
                  isActive
                    ? "text-[#C6A66B] bg-[#C6A66B]/10 font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Interactive Tools Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              onMouseEnter={() => setToolsDropdownOpen(true)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1",
                isToolActive || toolsDropdownOpen
                  ? "text-[#C6A66B] bg-[#C6A66B]/10 font-bold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]"
              )}
              aria-expanded={toolsDropdownOpen}
              aria-haspopup="true"
            >
              <span>{lang === "ar" ? "أدوات تفاعلية" : "Tools"}</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200 text-[#C6A66B]",
                  toolsDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu Popup */}
            {toolsDropdownOpen && (
              <div
                onMouseLeave={() => setToolsDropdownOpen(false)}
                className="absolute top-full start-0 mt-2 w-72 p-2 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-1"
              >
                <div className="px-3 py-1.5 border-b border-[var(--border-subtle)] mb-1">
                  <span className="text-[10px] font-bold text-[#C6A66B] uppercase tracking-wider">
                    {lang === "ar" ? "أدوات التخطيط والطلب" : "Planning & Request Tools"}
                  </span>
                </div>
                {toolLinks.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = pathname === tool.href;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setToolsDropdownOpen(false)}
                      className={cn(
                        "p-2.5 rounded-xl transition-all flex items-start gap-3 group",
                        isActive
                          ? "bg-[#C6A66B]/15 text-[#C6A66B]"
                          : "hover:bg-[var(--bg-surface)] text-[var(--text-primary)]"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 group-hover:border-[#C6A66B]/40 text-[#C6A66B] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold leading-snug group-hover:text-[#C6A66B] transition-colors">
                          {tool.title}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                          {tool.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Remaining Links: Blog, Contact, FAQ */}
          {navLinks.slice(4).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200",
                  isActive
                    ? "text-[#C6A66B] bg-[#C6A66B]/10 font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls & CTA */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          {/* Global Search Button */}
          <button
            type="button"
            onClick={openSearch}
            className="h-9 px-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/30 transition-all flex items-center gap-2 text-xs"
            aria-label={lang === "ar" ? "بحث في الموقع (Cmd+K)" : "Search site (Cmd+K)"}
          >
            <Search className="w-3.5 h-3.5 text-[#C6A66B]" />
            <span className="hidden xl:inline text-xs text-[var(--text-muted)]">
              {lang === "ar" ? "بحث..." : "Search..."}
            </span>
            <kbd className="hidden xl:inline px-1.5 py-0.5 text-[10px] font-mono bg-[var(--bg-surface)] text-[var(--text-muted)] rounded border border-[var(--border-subtle)]">
              ⌘K
            </kbd>
          </button>

          <LanguageSwitcher />
          <ThemeSwitcher />

          <Button
            href="/request-project"
            size="sm"
            variant="primary"
            icon={<ArrowUpRight className={cn("w-3.5 h-3.5", lang === "ar" && "rotate-[-90deg]")} />}
          >
            {t.nav.requestProject}
          </Button>
        </div>

        {/* Mobile / Tablet Controls & Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[#C6A66B]"
            aria-label={lang === "ar" ? "فتح البحث" : "Open search"}
          >
            <Search className="w-4 h-4 text-[#C6A66B]" />
          </button>

          <ThemeSwitcher />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] hover:text-[#C6A66B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B]"
            aria-label={lang === "ar" ? "قائمة التنقل" : "Toggle navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] px-4 pt-4 pb-8 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300 max-h-[85vh] overflow-y-auto">
          {/* Language & Preferences Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {lang === "ar" ? "اللغة والتفضيلات" : "Preferences"}
            </span>
            <LanguageSwitcher />
          </div>

          {/* Primary Nav Links */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between",
                    isActive
                      ? "text-[#C6A66B] bg-[#C6A66B]/10 font-bold"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]"
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />}
                </Link>
              );
            })}
          </nav>

          {/* Dedicated Interactive Tools Section */}
          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2.5">
            <span className="text-xs font-bold text-[#C6A66B] uppercase tracking-wider block px-1">
              {lang === "ar" ? "الأدوات التفاعلية" : "Interactive Tools"}
            </span>
            <div className="grid grid-cols-1 gap-2">
              {toolLinks.map((tool) => {
                const Icon = tool.icon;
                const isActive = pathname === tool.href;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "p-3 rounded-xl border transition-all flex items-center gap-3",
                      isActive
                        ? "border-[#C6A66B] bg-[#C6A66B]/10 text-[#C6A66B]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] hover:border-[#C6A66B]/40"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 text-[#C6A66B]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold">{tool.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)] line-clamp-1">{tool.desc}</div>
                    </div>
                    <ArrowUpRight className={cn("w-3.5 h-3.5 text-[var(--text-muted)]", lang === "ar" && "rotate-[-90deg]")} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Primary Mobile Action Button */}
          <div className="pt-3">
            <Button
              href="/request-project"
              size="md"
              variant="primary"
              className="w-full justify-center"
              icon={<ArrowUpRight className={cn("w-4 h-4", lang === "ar" && "rotate-[-90deg]")} />}
            >
              {t.nav.requestProject}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
