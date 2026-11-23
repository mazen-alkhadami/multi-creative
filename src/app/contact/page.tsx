"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { InstagramIcon, LinkedinIcon, GithubIcon } from "@/components/ui/SocialIcons";
import { servicesData } from "@/data/servicesData";
import { CONTACT_CONFIG } from "@/data/contactConfig";
import { useLanguage } from "@/hooks";
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  Send,
} from "lucide-react";

export function ContactPage() {
  const { lang } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    phoneOrEmail: "",
    service: servicesData[0].slug,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const activeServiceTitle =
    servicesData.find((s) => s.slug === formData.service)?.title[lang] || servicesData[0].title[lang];

  const getWhatsAppContactUrl = () => {
    const text = [
      `*MULTI CREATIVES — رسالة تواصل مباشرة*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `*الاسم:* ${formData.name || (lang === "ar" ? "غير محدد" : "N/A")}`,
      `*معلومات التواصل:* ${formData.phoneOrEmail || (lang === "ar" ? "غير محدد" : "N/A")}`,
      `*الخدمة المطلوبة:* ${activeServiceTitle}`,
      formData.message ? `*نص الرسالة:* ${formData.message}` : "",
      `━━━━━━━━━━━━━━━━━━━━`,
      `_تم الإرسال عبر صفحة التواصل في MULTI CREATIVES_`,
    ].filter(Boolean).join("\n");

    return `https://wa.me/${CONTACT_CONFIG.phone.rawWhatsApp}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phoneOrEmail.trim()) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <Badge variant="gold" size="md" className="mb-4">
            {lang === "ar" ? "تواصل معنا" : "Contact Us"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            {lang === "ar"
              ? "نحن هنا لمساعدتك في بدء مشروعك"
              : "We Are Here to Bring Your Project to Life"}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "تواصل معنا مباشرة عبر واتساب، أو أرسل بريداً إلكترونياً، أو املأ النموذج وسنرد عليك بأسرع وقت."
              : "Connect with us directly via WhatsApp, send an email, or complete the form. We respond promptly."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Official Contact Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] pb-4 border-b border-[var(--border-subtle)]">
                {lang === "ar" ? "بيانات التواصل المعتمدة" : "Official Contact Details"}
              </h2>

              <div className="space-y-4 text-sm text-[var(--text-secondary)]">
                {/* Phone & WhatsApp */}
                <a
                  href={CONTACT_CONFIG.phone.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/50 hover:text-[var(--text-primary)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      {lang === "ar" ? "الهاتف وواتساب المباشر" : "Direct Phone & WhatsApp"}
                    </span>
                    <span className="font-bold text-[var(--text-primary)]" dir="ltr">
                      {CONTACT_CONFIG.phone.international}
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${CONTACT_CONFIG.email}`}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/50 hover:text-[var(--text-primary)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#C6A66B]/15 text-[#C6A66B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      {lang === "ar" ? "البريد الإلكتروني الرسمي" : "Official Email"}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] truncate block" dir="ltr">
                      {CONTACT_CONFIG.email}
                    </span>
                  </div>
                </a>

                {/* Locations */}
                <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                    <MapPin className="w-4 h-4 text-[#C6A66B]" />
                    <span>{lang === "ar" ? "نطاق استقبال الطلبات" : "Service Coverage"}</span>
                  </div>
                  <div className="space-y-1 text-xs text-[var(--text-secondary)] ps-6">
                    <p>• {CONTACT_CONFIG.locations.primary[lang]}</p>
                    <p>• {CONTACT_CONFIG.locations.secondary[lang]}</p>
                    <p className="text-[11px] text-[#C6A66B] font-medium pt-1">
                      {CONTACT_CONFIG.locations.welcomeScope[lang]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Call to Action */}
              <div className="pt-2">
                <a
                  href={CONTACT_CONFIG.phone.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] font-bold text-sm transition-all shadow-lg shadow-[#C6A66B]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 text-[#111111]" />
                  <span>{lang === "ar" ? "محادثة فورية عبر واتساب" : "Chat on WhatsApp Now"}</span>
                </a>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider block mb-3">
                  {lang === "ar" ? "حساباتنا الرسمية" : "Official Social Accounts"}
                </span>
                <div className="flex items-center gap-2.5">
                  <a
                    href={CONTACT_CONFIG.socials.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/40 transition-all flex items-center gap-2 text-xs"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>{CONTACT_CONFIG.socials.instagram.handle}</span>
                  </a>

                  <a
                    href={CONTACT_CONFIG.socials.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/40 transition-all"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>

                  <a
                    href={CONTACT_CONFIG.socials.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[#C6A66B] hover:border-[#C6A66B]/40 transition-all"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
                  {lang === "ar" ? "أرسل رسالة أو استفسار" : "Send an Inquiry"}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {lang === "ar"
                    ? "اكتب تفاصيل استفسارك وسنرد عليك عبر واتساب أو البريد الإلكتروني."
                    : "Fill in your inquiry details and we will connect via WhatsApp or email."}
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl border border-[#C6A66B]/40 bg-[#C6A66B]/10 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#C6A66B] text-[#111111] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {lang === "ar" ? "شكراً لتواصلك معنا" : "Thank You for Reaching Out"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                    {lang === "ar"
                      ? "تم تجهيز رسالتك. يمكنك الضغط على الزر أدناه لإرسالها مباشرة عبر واتساب للبدء في المحادثة فوراً دون أي تأخير."
                      : "Your message is ready. Click below to send it directly via WhatsApp to chat without delay."}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={getWhatsAppContactUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] font-bold text-xs inline-flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{lang === "ar" ? "متابعة الإرسال عبر واتساب" : "Forward via WhatsApp"}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors"
                    >
                      {lang === "ar" ? "كتابة رسالة أخرى" : "Write Another Message"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                        {lang === "ar" ? "الاسم الكريم *" : "Your Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={lang === "ar" ? "أدخل اسمك" : "Enter your name"}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                        {lang === "ar" ? "رقم الهاتف أو البريد *" : "Phone or Email *"}
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={formData.phoneOrEmail}
                        onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                        placeholder="+967... أو email@..."
                        className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B] transition-colors text-start"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                      {lang === "ar" ? "الخدمة ذات الصلة" : "Related Service"}
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B] transition-colors"
                    >
                      {servicesData.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.title[lang]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                      {lang === "ar" ? "الرسالة أو الاستفسار" : "Message or Inquiry"}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={
                        lang === "ar"
                          ? "اكتب تفاصيل استفسارك أو ما تود معرفته..."
                          : "Describe your inquiry or question..."
                      }
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[#C6A66B] transition-colors"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] font-bold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-[#C6A66B]/20"
                    >
                      <Send className="w-4 h-4" />
                      <span>{lang === "ar" ? "إرسال الاستفسار" : "Send Inquiry"}</span>
                    </button>

                    <a
                      href={getWhatsAppContactUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-full border border-[var(--border-subtle)] hover:border-[#C6A66B]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#C6A66B]" />
                      <span>{lang === "ar" ? "أو تحدث مباشرة في واتساب" : "Or Chat Directly on WhatsApp"}</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ContactPage;
