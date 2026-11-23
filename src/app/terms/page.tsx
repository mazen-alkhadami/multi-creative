"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CONTACT_CONFIG } from "@/data/contactConfig";
import { useLanguage } from "@/hooks";
import {
  FileCheck2,
  Layers,
  Send,
  Sliders,
  DollarSign,
  Palette,
  Copyright,
  UploadCloud,
  ExternalLink,
  Scale,
  RefreshCw,
  Mail,
} from "lucide-react";

export default function TermsPage() {
  const { lang } = useLanguage();

  const sections = [
    {
      icon: FileCheck2,
      title: lang === "ar" ? "1. مقدمة ونطاق استخدام الموقع" : "1. Introduction & Scope of Use",
      content:
        lang === "ar"
          ? "تحكم هذه الشروط والأحكام استخدامك لموقع MULTI CREATIVES والاطلاع على خدماتنا وتجربة الأدوات التفاعلية المتاحة. تصفحك للموقع أو إرسالك لطلب خدمة يعني قراءتك لهذه المبادئ وموافقتك على بنودها العامة."
          : "These terms govern your access to and interaction with the MULTI CREATIVES website, design capabilities, and client exploration tools. Browsing or submitting service requests signifies acknowledgment of these general guidelines.",
    },
    {
      icon: Layers,
      title: lang === "ar" ? "2. طبيعة الخدمات المعروضة" : "2. Nature of Services",
      content:
        lang === "ar"
          ? "يقدم MULTI CREATIVES حلولاً مهنية عبر سبعة مجالات رئيسية: تطوير المواقع الإلكترونية، تطبيقات الويب، البرمجيات والأنظمة، حلول الذكاء الاصطناعي والأتمتة، التصميم الجرافيكي والهويات البصرية، خدمات الطباعة، والهدايا الدعائية والتنفيذية."
          : "MULTI CREATIVES delivers professional engineering and creative services spanning seven core disciplines: website design, web apps, custom software, practical AI workflows, visual branding, printing services, and promotional gift sets.",
    },
    {
      icon: Send,
      title: lang === "ar" ? "3. آلية تقديم طلب الخدمة والتواصل" : "3. Service Request & Communication Process",
      content:
        lang === "ar"
          ? "يتم تقديم طلبات الخدمات عبر النماذج التفاعلية المخصصة في الموقع، والتي تنقل ملخص متطلباتك إلى رقم الواتساب الرسمي (+967779628873) أو عبر البريد الإلكتروني. لا يُعتبر إرسال ملخص الطلب تعاقداً نهائياً ملزماً إلا بعد مراجعة المتطلبات المشتركة والتوافق عليها كتابياً."
          : "Requests are initiated via interactive site forms, formatting your inputs to our official WhatsApp dispatch (+967779628873) or email. Submitting a brief initiates preliminary exploration and does not constitute a binding contract until formal terms are agreed upon in writing.",
    },
    {
      icon: Sliders,
      title: lang === "ar" ? "4. مراجعة المتطلبات وتحديد نطاق العمل" : "4. Scope Definition & Technical Review",
      content:
        lang === "ar"
          ? "يخضع كل طلب خدمة لدراسة ومراجعة فنية تفصيلية لتحديد نطاق المخرجات (Scope of Work)، والخصائص التقنية، ومراحل التنفيذ بدقة قبل بدء العمل، لضمان وضوح المسؤوليات وتفادي أي غموض."
          : "Each brief undergoes technical review to define the precise Scope of Work, component deliverables, and execution milestones prior to kickoff, ensuring clarity and alignment for both parties.",
    },
    {
      icon: DollarSign,
      title: lang === "ar" ? "5. اعتماد الأسعار والمواعيد والالتزامات" : "5. Pricing, Budgets & Delivery Schedules",
      content:
        lang === "ar"
          ? "تأكيداً لمبدأ الشفافية والنزاهة، لا تُعتمد أي أسعار أو تكاليف إجمالية أو مواعيد تسليم نهائية إلا بعد دراسة تفاصيل كل مشروع على حدة والتوافق عليها رسمياً بين الطرفين. إن الأدوات الاسترشادية في الموقع (مثل حاسبة النطاق ومُهيّئ الطباعة) تهدف فقط لتنظيم المتطلبات ولا تشكل عروض أسعار ملزمة أو وعوداً بمواعيد ثابتة."
          : "In accordance with our integrity standards, all pricing quotes, schedules, and final timelines are established strictly after individual requirement evaluation and mutual agreement. Estimation tools on the site are organizational aids and do not constitute fixed quotes or delivery guarantees.",
    },
    {
      icon: Palette,
      title: lang === "ar" ? "6. صفة المشاريع التجريبية في معرض الأعمال" : "6. Concept Projects Status",
      content:
        lang === "ar"
          ? "المشاريع المعروضة حالياً في معرض الأعمال (Portfolio) والموسومة بـ «عمل تجريبي (Concept Project)» هي نماذج بصرية ومحاكاة برمجية لتوضيح أسلوبنا الفني والهندسي وإمكاناتنا في التنفيذ، ولا يُقصد بها ادعاء شراكات تجارية سابقة أو عملاء تعاقديين فعليين."
          : "All projects currently showcased in our portfolio tagged as 'Concept Project' are demonstrative design and engineering models illustrating our capabilities. They do not claim past commercial client partnerships.",
    },
    {
      icon: Copyright,
      title: lang === "ar" ? "7. حقوق الملكية الفكرية والأصول المسلمة" : "7. Intellectual Property & Deliverables Ownership",
      content:
        lang === "ar"
          ? "جميع حقوق الملكية الفكرية الخاصة بالموقع وشعاره وهندسته البرمجية محفوظة لـ MULTI CREATIVES. وفي حال التعاقد على مشروع ودفع مستحقاته، تنتقل ملكية مخرجات العمل المتفق عليها (كود المصدر، ملفات التصميم المفتوحة، الأصول الإنتاجية) إلى العميل بالكامل بنسبة 100%."
          : "All platform branding, visual identity geometry, and codebase remain the proprietary property of MULTI CREATIVES. Upon project completion and payment settlement, 100% ownership of agreed deliverables (source code, vector assets, and production files) transfers to the client.",
    },
    {
      icon: UploadCloud,
      title: lang === "ar" ? "8. مسؤوليات المستخدم ومحتوى الملفات" : "8. User Responsibilities & Asset Rights",
      content:
        lang === "ar"
          ? "يتحمل العميل المسؤولية القانونية الكاملة عن أي مواد أو نصوص أو صور أو شعارات يزودنا بها لاستخدامها في مشروعه، ويقر بأنه يملك الحقوق القانونية لاستخدامها ولا تنتهك حقوق أي طرف ثالث."
          : "Clients bear full responsibility for the legality, copyright, and authorization of all logos, text, imagery, or assets provided for project integration, ensuring no infringement of third-party rights.",
    },
    {
      icon: ExternalLink,
      title: lang === "ar" ? "9. الروابط والخدمات الخارجية" : "9. Third-Party Integrations & Links",
      content:
        lang === "ar"
          ? "قد نوفر روابط لخدمات ومنصات خارجية (مثل واتساب، إنستغرام، لينكد إن، جيت هاب، أو بوابات سحابية). لا نتحمل أي مسؤولية عن سياسات أو خدمات تلك المنصات وتخضع تعاملاتك معها لشروطها الخاصة."
          : "Links to third-party services (WhatsApp, social media platforms, or external repositories) are governed by their respective operator terms. We assume no liability for external platform conduct.",
    },
    {
      icon: Scale,
      title: lang === "ar" ? "10. حدود المسؤولية والتنبيه القانوني" : "10. Limitation of Liability & Legal Notice",
      content:
        lang === "ar"
          ? "يُعرض محتوى الموقع للأغراض التعريفية والاستعراضية، ولا يُعد هذا النص استشارة قانونية مخصصة أو بديلاً عن العقود التجارية الثنائية المستقلة. تعتبر هذه الشروط مسودة تنظيمية واضحة وقابلة للمراجعة والتطوير قبل إبرام أي تعاقد رسمي."
          : "Website content is provided on an 'as-is' informational basis and does not replace customized formal bilateral contracts. These terms represent a clear operational framework subject to review prior to definitive commercial agreements.",
    },
    {
      icon: RefreshCw,
      title: lang === "ar" ? "11. تحديث وتعديل الشروط" : "11. Terms Amendments",
      content:
        lang === "ar"
          ? "يحتفظ MULTI CREATIVES بالحق في مراجعة وتحديث هذه الشروط عند تطوير الموقع أو إضافة خدمات جديدة. يسري التعديل من تاريخ نشره على هذه الصفحة."
          : "We reserve the right to revise these terms as capabilities evolve. Continued use of the platform following updates constitutes acceptance of the amended terms.",
    },
    {
      icon: Mail,
      title: lang === "ar" ? "12. وسيلة التواصل للاستفسارات" : "12. Inquiries & Official Channels",
      content:
        lang === "ar"
          ? "لأي استفسارات أو ملاحظات تتعلق بهذه الشروط، يرجى التواصل معنا عبر البريد الإلكتروني الرسمي (mazenalkhadami123@gmail.com) أو عبر رقم الواتساب المعتمد (+967779628873)."
          : "For inquiries regarding these terms of service, reach us via email at mazenalkhadami123@gmail.com or via official WhatsApp at +967779628873.",
    },
  ];

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <Badge variant="gold" size="md" className="mb-4">
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#C6A66B]" />
              <span>{lang === "ar" ? "الشروط والتعاقد" : "Terms & Conditions"}</span>
            </span>
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            {lang === "ar"
              ? "الشروط والأحكام وأطر العمل"
              : "Terms & Conditions of Service"}
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "تحدد هذه الوثيقة المبادئ التنظيمية العامة لاستخدام الموقع وطلب الخدمات ومعايير الملكية الفكرية المعتمدة لدى MULTI CREATIVES."
              : "This document defines the operational principles, engagement workflows, and intellectual property standards governing MULTI CREATIVES services."}
          </p>

          <div className="pt-2 text-xs font-mono text-[var(--text-muted)]">
            {lang === "ar" ? "نسخة مسودة تنظيمية — فبراير 2026" : "Operational Draft Framework — February 2026"}
          </div>
        </div>

        {/* Terms Sections */}
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

        {/* Bottom Contact / Handoff */}
        <div className="pt-12 max-w-4xl">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {lang === "ar" ? "هل لديك استفسار حول أطر العمل؟" : "Questions About Our Terms?"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {lang === "ar"
                  ? "تواصل معنا مباشرة عبر البريد الإلكتروني أو الواتساب لمناقشة أي استفسار."
                  : "Connect with us directly to discuss specific requirements or contractual details."}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-4 py-2 rounded-full border border-[var(--border-subtle)] hover:border-[#C6A66B]/40 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
              >
                {lang === "ar" ? "صفحة التواصل" : "Contact Us"}
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
