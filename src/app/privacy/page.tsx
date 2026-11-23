"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CONTACT_CONFIG } from "@/data/contactConfig";
import { useLanguage } from "@/hooks";
import {
  ShieldCheck,
  Lock,
  MessageCircle,
  FileText,
  Eye,
  Mail,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export default function PrivacyPage() {
  const { lang } = useLanguage();

  const sections = [
    {
      icon: FileText,
      title: lang === "ar" ? "1. المعلومات التي يرسلها المستخدم" : "1. Information You Provide",
      content:
        lang === "ar"
          ? "عند استخدامك لنماذج «طلب خدمة» أو «مُهيّئ مواصفات الطباعة» أو «حاسبة النطاق»، قد تقوم بإدخال بيانات طوعية تشمل: اسمك، رقم هاتفك للتواصل، تفاصيل ومتطلبات مشروعك، وميزانيتك أو الإطار الزمني المقترح. نحن لا نطلب أي بيانات بنكية أو حساسة غير ضرورية لنطاق العمل."
          : "When using our 'Request a Service', 'Print Configurator', or 'Scope Estimator' tools, you voluntarily share project requirements, your name, contact phone number, and estimated timelines. We do not solicit financial, banking, or sensitive personal data unnecessary for project scoping.",
    },
    {
      icon: Eye,
      title: lang === "ar" ? "2. كيفية استخدام معلومات التواصل والطلب" : "2. How We Use Your Information",
      content:
        lang === "ar"
          ? "تُستخدم البيانات التي تشاركها معنا حصرياً للأغراض التالية: الرد على استفسارك، مناقشة تفاصيل المشروع، وتحديد نطاق العمل والتكلفة المناسبة. لا نقوم ببيع أو تأجير أو مشاركة بياناتك مع أي جهات خارجية أو معلنين بأي شكل من الأشكال."
          : "The details you communicate are used strictly to reply to inquiries, review technical deliverables, and provide accurate project proposals. We do not sell, rent, or lease your contact information to third parties or advertising brokers.",
    },
    {
      icon: MessageCircle,
      title: lang === "ar" ? "3. آلية التواصل واستقبال الطلبات عبر واتساب" : "3. WhatsApp Communications Handoff",
      content:
        lang === "ar"
          ? "يعتمد الموقع حالياً على تحويل ملخص طلبك إلى رسالة نصية منسقة تُفتح مباشرة في تطبيق واتساب المعتمد على جهازك، ويتم إرسالها بموافقتك إلى رقمنا الرسمي (+967779628873). بعد إرسال الرسالة، تخضع المحادثات لسياسة الخصوصية والشروط المعمول بها في منصة واتساب وشركة Meta."
          : "Our forms currently format your inputs into a client-side message prefilled in your native WhatsApp application, directed to our official number (+967779628873). Once transmitted, communications adhere to WhatsApp and Meta end-to-end encryption and terms.",
    },
    {
      icon: Lock,
      title: lang === "ar" ? "4. التخزين وأمان المعلومات" : "4. Data Storage & Security Reality",
      content:
        lang === "ar"
          ? "حرصاً منا على الشفافية والمصداقية، نود توضيح أن الموقع حالياً موقع واجهات تفاعلية ثابتة (Static-First)، ولا يحتفظ ببيانات الطلبات في قواعد بيانات سحابية دائمة على خوادم الموقع. تتم كافة المداولات عبر القنوات المباشرة (واتساب والبريد الإلكتروني)، ونلتزم بحفظ سرية المداولات والمستندات المشتركة وعدم إفشائها."
          : "In line with our honesty commitment, our platform operates as a modern static web architecture. Form interactions do not persist in unsecured web databases. Project discussions are conducted directly via approved channels (WhatsApp and Email) under strict professional confidentiality.",
    },
    {
      icon: RefreshCw,
      title: lang === "ar" ? "5. ملفات تعريف الارتباط وتفضيلات الموقع (Cookies)" : "5. Cookies & Local Preferences",
      content:
        lang === "ar"
          ? "نستخدم تقنيات التخزين المحلي (LocalStorage) فقط لحفظ تفضيلاتك الأساسية في التصفح، مثل اختيار المظهر (الداكن أو الفاتح) واللغة المختارة (العربية أو الإنجليزية). لا نستخدم ملفات تتبع إعلانية متطفلة أو ملفات كوكيز لجهات خارجية لأغراض التتبع السلوكي."
          : "We utilize browser LocalStorage exclusively to store non-identifying user interface preferences, such as selected theme (Dark/Light) and language preference (Arabic/English). We do not deploy intrusive cross-site ad trackers.",
    },
    {
      icon: ExternalLink,
      title: lang === "ar" ? "6. الروابط والخدمات الخارجية" : "6. External Links & Services",
      content:
        lang === "ar"
          ? "قد يحتوي الموقع على روابط لحساباتنا الرسمية على منصات خارجية (مثل إنستغرام، لينكد إن، وجيت هاب). نحن لسنا مسؤولين عن ممارسات الخصوصية المتبعة في تلك المواقع والخدمات الخارجية، ونوصي بالاطلاع على سياسات الخصوصية الخاصة بها عند زيارتها."
          : "Our website includes hyperlinks directing to official profiles on third-party networks (Instagram, LinkedIn, and GitHub). We are not liable for the privacy practices of external platforms and encourage reviewing their individual governance policies.",
    },
    {
      icon: ShieldCheck,
      title: lang === "ar" ? "7. حقوق المستخدم وسرية المشاريع" : "7. Client Rights & Confidentiality",
      content:
        lang === "ar"
          ? "يحق لك في أي وقت طلب حذف سجل محادثاتك أو عدم استلام أي مراسلات إضافية. كما نلتزم التزاماً كاملاً بسرية الأفكار والبيانات ومستندات العمل التي تزودنا بها أثناء إعداد المقترحات أو بعد الاتفاق."
          : "You hold the right at any time to request the cessation of communications or purging of correspondence history. We maintain absolute confidentiality regarding proprietary concepts and strategic documents submitted during project scoping.",
    },
    {
      icon: Mail,
      title: lang === "ar" ? "8. وسيلة التواصل للاستفسارات والتحديثات" : "8. Inquiries & Policy Revisions",
      content:
        lang === "ar"
          ? "قد نقوم بتحديث سياسة الخصوصية من وقت لآخر لمواكبة تطوير خدماتنا أو إضافة ميزات تقنية جديدة. إذا كان لديك أي استفسار أو ملاحظة بشأن الخصوصية، يسعدنا تواصلك معنا مباشرة عبر البريد الإلكتروني (mazenalkhadami123@gmail.com) أو عبر رقم الواتساب الرسمي (+967779628873)."
          : "We may update this policy periodically to reflect platform capabilities or expanded services. For questions regarding privacy practices, contact us via email at mazenalkhadami123@gmail.com or via official WhatsApp (+967779628873).",
    },
  ];

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <Badge variant="gold" size="md" className="mb-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</span>
            </span>
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            {lang === "ar"
              ? "سياسة الخصوصية وسرية المعلومات"
              : "Privacy & Information Policy"}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "توضح هذه الوثيقة بوضوح وشفافية كيفية تعامل MULTI CREATIVES مع المعلومات التي تشاركها معنا عند تصفح الموقع أو تقديم طلبات الخدمات."
              : "This document outlines transparently how MULTI CREATIVES manages the information shared when browsing the platform or submitting service requests."}
          </p>

          <div className="pt-2 text-xs font-mono text-[var(--text-muted)]">
            {lang === "ar" ? "آخر تحديث: فبراير 2026" : "Last Updated: February 2026"}
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6 max-w-4xl">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <Card
                key={idx}
                className="p-6 sm:p-8 border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-2xl hover:border-[#C6A66B]/30 transition-colors space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#C6A66B]/15 border border-[#C6A66B]/30 flex items-center justify-center text-[#C6A66B] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    {sec.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed ps-12">
                  {sec.content}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Footer Contact Reminder */}
        <div className="pt-12 max-w-4xl">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {lang === "ar" ? "هل لديك استفسار حول سياسة الخصوصية؟" : "Have Questions About Privacy?"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {lang === "ar"
                  ? "تواصل معنا مباشرة عبر البريد الإلكتروني أو الواتساب وسنرد عليك بكل سرور."
                  : "Reach out directly via email or WhatsApp and we will be glad to assist."}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-4 py-2 rounded-full border border-[var(--border-subtle)] hover:border-[#C6A66B]/40 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
              >
                {lang === "ar" ? "صفحة التواصل" : "Contact Page"}
              </Link>
              <a
                href={CONTACT_CONFIG.phone.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] text-xs font-bold transition-all"
              >
                {lang === "ar" ? "محادثة واتساب" : "WhatsApp Chat"}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
