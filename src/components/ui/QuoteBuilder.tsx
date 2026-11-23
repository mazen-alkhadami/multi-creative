"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks";
import { Card, Badge } from "@/components/ui";
import { CONTACT_CONFIG } from "@/data/contactConfig";
import { 
  Check, 
  Clock, 
  ArrowUpRight, 
  MessageCircle, 
  Globe,
  Smartphone,
  Cpu,
  Bot,
  Palette,
  Printer,
  Gift,
  LucideIcon
} from "lucide-react";

interface DeliverableOption {
  id: string;
  discipline: string;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  icon: LucideIcon;
}

const deliverablesPool: DeliverableOption[] = [
  {
    id: "deliv-web-portal",
    discipline: "Website Design & Development",
    title: { ar: "موقع إلكتروني حديث وسريع", en: "Modern Responsive Website" },
    desc: { ar: "تصميم متجاوب متوافق مع كافة الأجهزة ومحسن لمحركات البحث.", en: "Responsive design optimized for all devices and SEO." },
    icon: Globe,
  },
  {
    id: "deliv-web-app",
    discipline: "Web Applications Development",
    title: { ar: "تطبيق ويب تفاعلي مع لوحة إدارة", en: "Web App with Dashboard" },
    desc: { ar: "تطبيق سحابي تفاعلي بواجهة مستخدم سهلة ولوحة تحكم.", en: "Interactive web app with clean UI and management panel." },
    icon: Smartphone,
  },
  {
    id: "deliv-custom-software",
    discipline: "Software & Systems Development",
    title: { ar: "نظام أو برمجيات مخصصة", en: "Custom Software & Systems" },
    desc: { ar: "بناء قواعد بيانات وأنظمة تشغيلية تخدم أعمالك.", en: "Tailored databases and operational systems." },
    icon: Cpu,
  },
  {
    id: "deliv-ai-agent",
    discipline: "AI & Automation Solutions",
    title: { ar: "أتمتة مهام وحلول ذكاء اصطناعي", en: "AI & Workflow Automation" },
    desc: { ar: "أتمتة العمليات المتكررة وتطبيق حلول الذكاء الاصطناعي.", en: "Automating repetitive workflows and practical AI." },
    icon: Bot,
  },
  {
    id: "deliv-brand-bible",
    discipline: "Graphic Design",
    title: { ar: "هوية بصرية كاملة وتصاميم", en: "Visual Identity & Graphic Design" },
    desc: { ar: "تصميم الشعار، الخطوط، الألوان، ودليل الهوية المتكامل.", en: "Logo design, typography, color palette, and brand guide." },
    icon: Palette,
  },
  {
    id: "deliv-luxury-packaging",
    discipline: "Printing Services",
    title: { ar: "خدمات طباعة وتغليف", en: "Printing & Packaging" },
    desc: { ar: "طباعة كروت، بروشورات، علب ومنتجات ورقية متنوعة.", en: "Cards, brochures, boxes, and paper collateral." },
    icon: Printer,
  },
  {
    id: "deliv-gifts",
    discipline: "Promotional Gifts",
    title: { ar: "هدايا دعائية وترحيبية", en: "Promotional Gifts" },
    desc: { ar: "تجهيز هدايا مطبوعة ومخصصة لعملائك ومناسباتك.", en: "Custom branded merchandise and corporate gift sets." },
    icon: Gift,
  },
];

export function QuoteBuilder() {
  const { lang } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "deliv-web-portal",
    "deliv-brand-bible",
  ]);

  const toggleDeliverable = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedItems = deliverablesPool.filter((d) => selectedIds.includes(d.id));

  const generateWhatsAppUrl = () => {
    const list = selectedItems
      .map((item, idx) => `${idx + 1}. ${item.title[lang]}`)
      .join("\n");

    const message = [
      `*MULTI CREATIVES — استفسار عن نطاق خدمات*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `*الخدمات المحددة:*`,
      list,
      `━━━━━━━━━━━━━━━━━━━━`,
      `_أود مناقشة تفاصيل المتطلبات وتحديد خطة العمل والتكلفة المناسبة_`,
    ].join("\n");

    return `https://wa.me/${CONTACT_CONFIG.phone.rawWhatsApp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Selection Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              {lang === "ar" ? "اختر المتطلبات التي تحتاجها في مشروعك" : "Select Your Required Services"}
            </h3>
            <span className="text-xs text-[var(--text-muted)]">
              {selectedItems.length} {lang === "ar" ? "محدد" : "selected"}
            </span>
          </div>

          <div className="space-y-3">
            {deliverablesPool.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleDeliverable(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? "border-[#C6A66B] bg-[#C6A66B]/10 shadow-sm"
                      : "border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/30 hover:bg-[var(--bg-surface-elevated)]"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "border-[#C6A66B] bg-[#C6A66B] text-[#111111]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)]"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-[var(--bg-surface-elevated)] flex items-center justify-center shrink-0 text-[#C6A66B] border border-[var(--border-subtle)]">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-[var(--text-primary)]">
                        {item.title[lang]}
                      </span>
                      <span className="text-[11px] text-[var(--text-muted)] shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C6A66B]" />
                        <span>{lang === "ar" ? "حسب النطاق" : "Custom Scope"}</span>
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                      {item.desc[lang]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 sticky top-28">
          <Card className="p-6 border-[#C6A66B]/30 bg-[var(--bg-surface-elevated)] rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h4 className="font-bold text-sm text-[var(--text-primary)]">
                {lang === "ar" ? "ملخص النطاق والمتطلبات" : "Scope & Requirements Summary"}
              </h4>
              <Badge variant="gold" size="sm">
                {selectedItems.length} {lang === "ar" ? "خدمات" : "services"}
              </Badge>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[var(--text-muted)] block">
                {lang === "ar" ? "الخدمات المختارة:" : "Selected Services:"}
              </span>
              {selectedItems.length > 0 ? (
                <ul className="space-y-1.5">
                  {selectedItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
                      <span className="truncate">{item.title[lang]}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--text-muted)] italic">
                  {lang === "ar" ? "لم تختر أي خدمة بعد" : "No services selected yet"}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                {lang === "ar"
                  ? "تحديد التكلفة والجدول الزمني يتم بدقة وموثوقية بعد مراجعة تفاصيل المشروع، دون وعود غير مؤكدة أو أسعار تقديرية مسبقة."
                  : "Final timelines and proposals are defined with precision after reviewing project specifications, with no speculative estimates."}
              </p>

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#C6A66B]/20 hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-[#111111]" />
                <span>{lang === "ar" ? "استفسر عن هذا النطاق عبر واتساب" : "Inquire via WhatsApp"}</span>
              </a>

              <Link
                href="/request-project"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-[var(--border-subtle)] hover:border-[#C6A66B]/40 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors"
              >
                <span>{lang === "ar" ? "أو أرسل طلب خدمة تفصيلي" : "Or Submit Service Request"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
