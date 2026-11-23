"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { InstagramIcon, LinkedinIcon, GithubIcon } from "@/components/ui/SocialIcons";
import { useTranslation, useLanguage } from "@/hooks";
import { CONTACT_CONFIG } from "@/data/contactConfig";
import { 
  Calculator, 
  Palette, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle
} from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const { lang } = useLanguage();
  const currentYear = 2026;

  const quickLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
    { href: "/faq", label: t.nav.faq },
  ];

  const interactiveTools = [
    { href: "/request-project", label: lang === "ar" ? "طلب خدمة مباشرة" : "Request a Service", icon: Sparkles },
    { href: "/quote-builder", label: lang === "ar" ? "تقدير نطاق العمل" : "Scope Estimator", icon: Calculator },
    { href: "/print-configurator", label: lang === "ar" ? "خيارات الطباعة" : "Print Options", icon: Palette },
  ];

  const servicePillars = [
    { href: "/services/website-design-development", label: lang === "ar" ? "تطوير المواقع الإلكترونية" : "Website Design & Development" },
    { href: "/services/web-applications-development", label: lang === "ar" ? "تطوير تطبيقات الويب" : "Web Applications Development" },
    { href: "/services/software-systems-development", label: lang === "ar" ? "تطوير البرمجيات والأنظمة" : "Software & Systems Development" },
    { href: "/services/ai-automation-solutions", label: lang === "ar" ? "الذكاء الاصطناعي والأتمتة" : "AI & Automation Solutions" },
    { href: "/services/graphic-design", label: lang === "ar" ? "التصميم الجرافيكي" : "Graphic Design" },
    { href: "/services/printing-services", label: lang === "ar" ? "خدمات الطباعة" : "Printing Services" },
    { href: "/services/promotional-gifts", label: lang === "ar" ? "الهدايا الدعائية" : "Promotional Gifts" },
  ];

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors duration-300">
      <Container className="py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Statement Column */}
          <div className="lg:col-span-4 flex flex-col space-y-5">
            <Logo size="lg" />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] max-w-sm">
              {t.footer.aboutText}
            </p>
            
            {/* Champagne Gold Dot Indicator */}
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C6A66B]" />
              <span className="text-xs font-semibold tracking-wider text-[var(--accent-gold)]">
                {CONTACT_CONFIG.locations.welcomeScope[lang]}
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={CONTACT_CONFIG.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/50 transition-all flex items-center justify-center group"
              >
                <InstagramIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href={CONTACT_CONFIG.socials.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/50 transition-all flex items-center justify-center group"
              >
                <LinkedinIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href={CONTACT_CONFIG.socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/50 transition-all flex items-center justify-center group"
              >
                <GithubIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href={CONTACT_CONFIG.phone.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/50 transition-all flex items-center justify-center group"
              >
                <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#C6A66B] transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t.footer.servicesTitle}
            </h3>
            <ul className="space-y-2 text-xs">
              {servicePillars.map((service, idx) => (
                <li key={idx}>
                  <Link
                    href={service.href}
                    className="hover:text-[#C6A66B] transition-colors duration-200 inline-block"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Location Column */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {t.footer.contactTitle}
            </h3>
            <div className="space-y-3 text-xs">
              <a
                href={CONTACT_CONFIG.phone.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[var(--text-secondary)] hover:text-[#C6A66B] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span dir="ltr">{CONTACT_CONFIG.phone.international}</span>
              </a>

              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                className="flex items-center gap-2.5 text-[var(--text-secondary)] hover:text-[#C6A66B] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C6A66B] shrink-0" />
                <span className="truncate">{CONTACT_CONFIG.email}</span>
              </a>

              <div className="flex items-start gap-2.5 text-[var(--text-secondary)] pt-1">
                <MapPin className="w-4 h-4 text-[#C6A66B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p>{CONTACT_CONFIG.locations.primary[lang]}</p>
                  <p>{CONTACT_CONFIG.locations.secondary[lang]}</p>
                </div>
              </div>

              {/* Fast interactive tools shortcuts */}
              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5">
                {interactiveTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="hover:text-[#C6A66B] transition-colors text-[11px] flex items-center gap-2 text-[var(--text-muted)]"
                    >
                      <Icon className="w-3 h-3 text-[#C6A66B]" />
                      <span>{tool.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Rights Bar */}
        <div className="mt-14 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-tertiary)]">
          <p>© {currentYear} {t.footer.rights}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">
              {t.footer.privacy}
            </Link>
            <span className="text-[var(--border-subtle)]">•</span>
            <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
