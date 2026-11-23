"use client";

import React, { useState } from "react";
import { useLanguage } from "@/hooks";
import { Card, Badge } from "@/components/ui";
import { CONTACT_CONFIG } from "@/data/contactConfig";
import { 
  Globe, 
  Smartphone, 
  Cpu, 
  Bot, 
  Palette, 
  Printer, 
  Gift, 
  MessageCircle, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  DollarSign,
  User,
  Phone
} from "lucide-react";

const SERVICES_LIST = [
  { id: "website-design-development", labelAr: "تطوير المواقع الإلكترونية", labelEn: "Website Design & Development", icon: Globe },
  { id: "web-applications-development", labelAr: "تطوير تطبيقات الويب", labelEn: "Web Applications Development", icon: Smartphone },
  { id: "software-systems-development", labelAr: "تطوير البرمجيات والأنظمة", labelEn: "Software & Systems Development", icon: Cpu },
  { id: "ai-automation-solutions", labelAr: "الذكاء الاصطناعي والأتمتة", labelEn: "AI & Automation Solutions", icon: Bot },
  { id: "graphic-design", labelAr: "التصميم الجرافيكي", labelEn: "Graphic Design", icon: Palette },
  { id: "printing-services", labelAr: "خدمات الطباعة", labelEn: "Printing Services", icon: Printer },
  { id: "promotional-gifts", labelAr: "الهدايا الدعائية", labelEn: "Promotional Gifts", icon: Gift },
];

export function SmartProjectBrief() {
  const { lang } = useLanguage();

  // Form State
  const [selectedService, setSelectedService] = useState<string>("website-design-development");
  const [description, setDescription] = useState<string>("");
  const [extraDetails, setExtraDetails] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Step State: 1 = Details, 2 = Contact, 3 = Review
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const activeService = SERVICES_LIST.find((s) => s.id === selectedService) || SERVICES_LIST[0];

  const handleNextStep1 = () => {
    if (!description.trim()) {
      setError(lang === "ar" ? "يرجى كتابة وصف مختصر لما تحتاجه." : "Please provide a brief description of your request.");
      return;
    }
    setError("");
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    if (!name.trim()) {
      setError(lang === "ar" ? "يرجى إدخال اسمك الكريم." : "Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setError(lang === "ar" ? "يرجى إدخال رقم التواصل." : "Please enter your contact phone number.");
      return;
    }
    setError("");
    setCurrentStep(3);
  };

  const generateWhatsAppUrl = () => {
    const serviceName = lang === "ar" ? activeService.labelAr : activeService.labelEn;
    const lines = [
      `*MULTI CREATIVES — طلب خدمة جديدة*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `*الخدمة المطلوبة:* ${serviceName}`,
      `*الاسم:* ${name.trim()}`,
      `*رقم التواصل:* ${phone.trim()}`,
      `*وصف الطلب:* ${description.trim()}`,
      extraDetails.trim() ? `*تفاصيل إضافية:* ${extraDetails.trim()}` : "",
      budget.trim() ? `*الميزانية التقديرية:* ${budget.trim()}` : "",
      timeline.trim() ? `*الوقت المتوقع:* ${timeline.trim()}` : "",
      `━━━━━━━━━━━━━━━━━━━━`,
      `_تم الإرسال عبر صفحة طلب الخدمة في MULTI CREATIVES_`,
    ].filter(Boolean);

    const message = lines.join("\n");
    return `https://wa.me/${CONTACT_CONFIG.phone.rawWhatsApp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Card className="p-6 sm:p-8 md:p-10 border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl rounded-3xl max-w-4xl mx-auto">
      {/* Progress Indicators */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#C6A66B] text-[#111111] font-bold text-sm flex items-center justify-center">
            {currentStep}
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {currentStep === 1 && (lang === "ar" ? "1. تفاصيل الخدمة المطلوبة" : "1. Service Details")}
              {currentStep === 2 && (lang === "ar" ? "2. معلومات التواصل" : "2. Contact Info")}
              {currentStep === 3 && (lang === "ar" ? "3. مراجعة وتأكيد الطلب" : "3. Review & Submit")}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {lang === "ar" ? "خطوات بسيطة وسريعة لإرسال طلبك" : "Simple and quick steps to submit your request"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={`w-6 sm:w-8 h-1.5 rounded-full transition-colors ${
                step <= currentStep ? "bg-[#C6A66B]" : "bg-[var(--border-subtle)]"
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SERVICE DETAILS */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* 1. Service Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-3">
              {lang === "ar" ? "1. اختر الخدمة المطلوبة *" : "1. Select Desired Service *"}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {SERVICES_LIST.map((service) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className={`p-3.5 rounded-2xl border text-start flex items-center gap-3 transition-all ${
                      isSelected
                        ? "border-[#C6A66B] bg-[#C6A66B]/10 text-[var(--text-primary)] shadow-md"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:border-[#C6A66B]/30 hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isSelected ? "text-[#C6A66B]" : "text-[var(--text-muted)]"}`} />
                    <span className="text-xs sm:text-sm font-medium">
                      {lang === "ar" ? service.labelAr : service.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Brief Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
              {lang === "ar" ? "2. وصف مختصر لما تحتاجه * (مطلوب)" : "2. Brief Description of Your Needs * (Required)"}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                lang === "ar"
                  ? "مثال: أحتاج موقعاً إلكترونياً تعريفياً لنشاطي، يشمل صفحة رئيسية وصفحة لخدماتنا ونموذج تواصل..."
                  : "e.g., I need a modern business website with a homepage, services overview, and contact form..."
              }
              className="w-full px-4 py-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#C6A66B] text-sm transition-colors"
            />
          </div>

          {/* 3. Additional Details (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              {lang === "ar" ? "3. تفاصيل إضافية أو روابط مرجعية (اختياري)" : "3. Additional Details or References (Optional)"}
            </label>
            <textarea
              rows={2}
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              placeholder={
                lang === "ar"
                  ? "أي تفاصيل أخرى مثل روابط لمواقع أعجبتك، ألوان مفضلة، أو صفحات إضافية..."
                  : "Any other details such as reference links, preferred colors, or extra pages..."
              }
              className="w-full px-4 py-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#C6A66B] text-sm transition-colors"
            />
          </div>

          {/* 4 & 5. Budget & Timeframe (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>{lang === "ar" ? "4. الميزانية التقديرية (اختياري)" : "4. Estimated Budget (Optional)"}</span>
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder={lang === "ar" ? "مثال: ميزانية محددة أو مرنة" : "e.g., Flexible or specific range"}
                className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#C6A66B] text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C6A66B]" />
                <span>{lang === "ar" ? "5. الوقت المتوقع أو الموعد المطلوب (اختياري)" : "5. Expected Timeframe (Optional)"}</span>
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder={lang === "ar" ? "مثال: خلال شهر، عاجل، غير محدد" : "e.g., Within a month, urgent, flexible"}
                className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#C6A66B] text-sm transition-colors"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleNextStep1}
              className="px-6 py-3 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] font-bold text-sm inline-flex items-center gap-2 transition-all shadow-lg shadow-[#C6A66B]/20"
            >
              <span>{lang === "ar" ? "المتابعة لمعلومات التواصل" : "Continue to Contact Info"}</span>
              {lang === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CONTACT INFORMATION */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#C6A66B]" />
                <span>{lang === "ar" ? "6. الاسم الكريم * (مطلوب)" : "6. Full Name * (Required)"}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === "ar" ? "أدخل اسمك الكريم" : "Enter your name"}
                className="w-full px-4 py-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#C6A66B] text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#C6A66B]" />
                <span>{lang === "ar" ? "7. رقم الهاتف أو الواتساب * (مطلوب)" : "7. Phone or WhatsApp * (Required)"}</span>
              </label>
              <input
                type="text"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+967... أو 05..."
                className="w-full px-4 py-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#C6A66B] text-sm transition-colors text-start"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-start gap-3 text-xs text-[var(--text-secondary)] leading-relaxed">
            <span className="text-[#C6A66B] text-base">ℹ️</span>
            <span>
              {lang === "ar"
                ? "سنستخدم رقمك للتواصل معك ومناقشة تفاصيل الخدمة وتقديم العرض المناسب لك بكل وضوح."
                : "Your phone number will be used strictly to connect with you and discuss the service details."}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] text-sm transition-all"
            >
              {lang === "ar" ? "رجوع" : "Back"}
            </button>
            <button
              type="button"
              onClick={handleNextStep2}
              className="px-6 py-3 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] font-bold text-sm inline-flex items-center gap-2 transition-all shadow-lg shadow-[#C6A66B]/20"
            >
              <span>{lang === "ar" ? "مراجعة ملخص الطلب" : "Review Request Summary"}</span>
              {lang === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & WHATSAPP SUBMISSION */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[#C6A66B]/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                {lang === "ar" ? "ملخص طلب الخدمة" : "Request Summary"}
              </span>
              <Badge variant="gold" size="sm">
                {lang === "ar" ? activeService.labelAr : activeService.labelEn}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[var(--text-muted)] block mb-1">{lang === "ar" ? "الاسم:" : "Name:"}</span>
                <span className="font-semibold text-sm text-[var(--text-primary)]">{name}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block mb-1">{lang === "ar" ? "رقم التواصل:" : "Phone:"}</span>
                <span className="font-semibold text-sm text-[var(--text-primary)]" dir="ltr">{phone}</span>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-[var(--text-muted)] block mb-1">{lang === "ar" ? "تفاصيل الطلب:" : "Description:"}</span>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-subtle)]">
                {description}
              </p>
            </div>

            {(budget || timeline || extraDetails) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-[var(--border-subtle)]">
                {budget && (
                  <div>
                    <span className="text-[var(--text-muted)] block">{lang === "ar" ? "الميزانية:" : "Budget:"}</span>
                    <span className="text-[var(--text-primary)] font-medium">{budget}</span>
                  </div>
                )}
                {timeline && (
                  <div>
                    <span className="text-[var(--text-muted)] block">{lang === "ar" ? "الموعد المتوقع:" : "Timeframe:"}</span>
                    <span className="text-[var(--text-primary)] font-medium">{timeline}</span>
                  </div>
                )}
                {extraDetails && (
                  <div className="sm:col-span-3">
                    <span className="text-[var(--text-muted)] block">{lang === "ar" ? "ملاحظات إضافية:" : "Extra Notes:"}</span>
                    <span className="text-[var(--text-secondary)]">{extraDetails}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Transparent Notice */}
          <div className="p-4 rounded-2xl bg-[#C6A66B]/10 border border-[#C6A66B]/20 text-xs text-[var(--text-secondary)] leading-relaxed flex items-start gap-3">
            <span className="text-[#C6A66B] text-base">💬</span>
            <div>
              <p className="font-semibold text-[var(--text-primary)] mb-0.5">
                {lang === "ar" ? "إرسال مباشر عبر واتساب" : "Direct WhatsApp Transmission"}
              </p>
              <p>
                {lang === "ar"
                  ? "عند الضغط على الزر أدناه، ستفتح لك محادثة واتساب الرسمية مع الرقم المعتمد وبها تفاصيل طلبك كاملة ومنسقة للبدء فوراً."
                  : "Clicking the button below opens WhatsApp with your complete, formatted request to start directly."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-all"
            >
              {lang === "ar" ? "تعديل البيانات" : "Edit Details"}
            </button>

            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] font-bold text-sm inline-flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#C6A66B]/25 hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 text-[#111111]" />
              <span>{lang === "ar" ? "إرسال الطلب عبر واتساب الآن" : "Submit Request via WhatsApp Now"}</span>
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}
