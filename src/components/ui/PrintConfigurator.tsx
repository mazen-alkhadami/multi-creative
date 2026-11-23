"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks";
import { Card, Badge } from "@/components/ui";
import { CONTACT_CONFIG } from "@/data/contactConfig";
import { 
  Printer, 
  Layers, 
  Sparkles, 
  Check, 
  MessageSquare, 
  ArrowUpRight,
  Maximize2
} from "lucide-react";

interface ProductType {
  id: string;
  name: { ar: string; en: string };
  desc: { ar: string; en: string };
}

interface SizeOption {
  id: string;
  name: { ar: string; en: string };
}

interface MaterialOption {
  id: string;
  name: { ar: string; en: string };
  spec: string;
}

interface FinishOption {
  id: string;
  name: { ar: string; en: string };
}

const productTypes: ProductType[] = [
  {
    id: "business-cards",
    name: { ar: "كروت شخصية وأعمال", en: "Business Cards" },
    desc: { ar: "كروت أنيقة بتشطيبات متنوعة تعكس هويتك.", en: "Elegant cards with custom finishes." },
  },
  {
    id: "brochures",
    name: { ar: "بروشورات ومطويات", en: "Brochures & Flyers" },
    desc: { ar: "مطبوعات تسويقية بمقاسات وثنيات متعددة.", en: "Marketing collateral in various folds." },
  },
  {
    id: "paper-bags",
    name: { ar: "أكياس ورقية مطبوعة", en: "Branded Paper Bags" },
    desc: { ar: "أكياس متينة وفاخرة لمتاجرك ومنتجاتك.", en: "Durable custom bags for retail and gifts." },
  },
  {
    id: "boxes",
    name: { ar: "علب وتغليف منتجات", en: "Product Packaging & Boxes" },
    desc: { ar: "علب كرتونية صلبة ومخصصة للمنتجات.", en: "Custom rigid and folding boxes." },
  },
  {
    id: "stationery",
    name: { ar: "مغلفات وأوراق مراسلات", en: "Envelopes & Letterheads" },
    desc: { ar: "مطبوعات مكتبية رسمية بالهوية المعتمدة.", en: "Official stationery aligned with your identity." },
  },
  {
    id: "notebooks",
    name: { ar: "دفاتر وأجندات مخصصة", en: "Custom Notebooks & Planners" },
    desc: { ar: "دفاتر بغلاف مقوى وتصميم داخلي مخصص.", en: "Hardcover branded notebooks." },
  },
];

const sizeOptions: SizeOption[] = [
  { id: "standard-card", name: { ar: "مقاس كرت قياسي (9 × 5 سم)", en: "Standard Card (9 x 5 cm)" } },
  { id: "a4", name: { ar: "مقاس A4 (21 × 29.7 سم)", en: "A4 Size (21 x 29.7 cm)" } },
  { id: "a5", name: { ar: "مقاس A5 (14.8 × 21 سم)", en: "A5 Size (14.8 x 21 cm)" } },
  { id: "custom-size", name: { ar: "مقاس مخصص حسب الطلب", en: "Custom Size on Request" } },
];

const materials: MaterialOption[] = [
  { id: "couche-matte", name: { ar: "ورق كوشيه مطفي (Matte)", en: "Matte Coated Paper" }, spec: "300 - 350 GSM" },
  { id: "couche-gloss", name: { ar: "ورق كوشيه لامع (Gloss)", en: "Glossy Coated Paper" }, spec: "300 - 350 GSM" },
  { id: "kraft", name: { ar: "ورق كرافت بيئي بني", en: "Eco Brown Kraft Paper" }, spec: "250 - 300 GSM" },
  { id: "heavy-board", name: { ar: "ورق مقوى فاخر (Rigid Board)", en: "Premium Rigid Board" }, spec: "400+ GSM" },
];

const finishOptions: FinishOption[] = [
  { id: "matte-lamination", name: { ar: "سلوفان مطفي ناعم", en: "Soft Matte Lamination" } },
  { id: "gloss-lamination", name: { ar: "سلوفان لامع حامي", en: "Protective Gloss Lamination" } },
  { id: "gold-foil", name: { ar: "بصمة حرارية ذهبية", en: "Metallic Gold Foil" } },
  { id: "silver-foil", name: { ar: "بصمة حرارية فضية", en: "Metallic Silver Foil" } },
  { id: "spot-uv", name: { ar: "سبوت يو في بارز (Spot UV)", en: "Raised Spot UV" } },
];

const quantityTiers = [100, 250, 500, 1000, 2500];

export function PrintConfigurator() {
  const { lang } = useLanguage();

  const [selectedProduct, setSelectedProduct] = useState<string>("business-cards");
  const [selectedSize, setSelectedSize] = useState<string>("standard-card");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("couche-matte");
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>(["matte-lamination"]);
  const [quantity, setQuantity] = useState<number>(500);

  const toggleFinish = (id: string) => {
    setSelectedFinishes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentProduct = productTypes.find((p) => p.id === selectedProduct) || productTypes[0];
  const currentSize = sizeOptions.find((s) => s.id === selectedSize) || sizeOptions[0];
  const currentMaterial = materials.find((m) => m.id === selectedMaterial) || materials[0];

  const generateWhatsAppUrl = () => {
    const finishesText = selectedFinishes
      .map((fId) => finishOptions.find((f) => f.id === fId)?.name[lang])
      .filter(Boolean)
      .join("، ");

    const lines = [
      `*MULTI CREATIVES — طلب مواصفات طباعة*`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `*نوع المنتج:* ${currentProduct.name[lang]}`,
      `*المقاس:* ${currentSize.name[lang]}`,
      `*نوع الورق / الخامة:* ${currentMaterial.name[lang]} (${currentMaterial.spec})`,
      `*التشطيبات المختارة:* ${finishesText || (lang === "ar" ? "بدون تشطيب إضافي" : "Standard")}`,
      `*الكمية المطلوبة:* ${quantity} قطعة`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `_يرجى تزويدي بالسعر وتفاصيل التنفيذ_`,
    ];

    const message = lines.join("\n");
    return `https://wa.me/${CONTACT_CONFIG.phone.rawWhatsApp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Configuration Controls */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Product Type */}
          <Card className="p-6 border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Printer className="w-5 h-5 text-[#C6A66B]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                {lang === "ar" ? "1. نوع المنتج" : "1. Product Type"}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {productTypes.map((p) => {
                const isSelected = selectedProduct === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProduct(p.id)}
                    className={`p-3.5 rounded-xl border text-start transition-all ${
                      isSelected
                        ? "border-[#C6A66B] bg-[#C6A66B]/10 text-[var(--text-primary)] shadow-sm"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:border-[#C6A66B]/30 hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs sm:text-sm">{p.name[lang]}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#C6A66B]" />}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{p.desc[lang]}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 2. Size Option */}
          <Card className="p-6 border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Maximize2 className="w-5 h-5 text-[#C6A66B]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                {lang === "ar" ? "2. المقاس" : "2. Size"}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sizeOptions.map((s) => {
                const isSelected = selectedSize === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSize(s.id)}
                    className={`p-3 rounded-xl border text-start transition-all text-xs font-medium flex items-center justify-between ${
                      isSelected
                        ? "border-[#C6A66B] bg-[#C6A66B]/10 text-[var(--text-primary)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:border-[#C6A66B]/30"
                    }`}
                  >
                    <span>{s.name[lang]}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#C6A66B]" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 3. Paper / Material */}
          <Card className="p-6 border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#C6A66B]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                {lang === "ar" ? "3. نوع الورق أو الخامة" : "3. Material & Paper"}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {materials.map((m) => {
                const isSelected = selectedMaterial === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMaterial(m.id)}
                    className={`p-3.5 rounded-xl border text-start transition-all ${
                      isSelected
                        ? "border-[#C6A66B] bg-[#C6A66B]/10 text-[var(--text-primary)]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:border-[#C6A66B]/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm">{m.name[lang]}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#C6A66B]" />}
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">{m.spec}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 4. Finishes */}
          <Card className="p-6 border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#C6A66B]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                {lang === "ar" ? "4. التشطيبات واللمسات الفنية (يمكن اختيار أكثر من نوع)" : "4. Finishes (Multi-select)"}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {finishOptions.map((f) => {
                const isSelected = selectedFinishes.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFinish(f.id)}
                    className={`px-4 py-2 rounded-full border text-xs font-medium transition-all flex items-center gap-2 ${
                      isSelected
                        ? "border-[#C6A66B] bg-[#C6A66B] text-[#111111] font-bold shadow-sm"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:border-[#C6A66B]/40"
                    }`}
                  >
                    <span>{f.name[lang]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#111111]" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 5. Quantity */}
          <Card className="p-6 border-[var(--border-subtle)] bg-[var(--bg-surface)] rounded-2xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] mb-4">
              {lang === "ar" ? "5. تحديد الكمية المطلوبة" : "5. Quantity Tier"}
            </h3>
            <div className="flex flex-wrap gap-3">
              {quantityTiers.map((q) => {
                const isSelected = quantity === q;
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`flex-1 min-w-[80px] py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-[#C6A66B] bg-[#C6A66B]/15 text-[#C6A66B] font-bold"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:border-[#C6A66B]/30"
                    }`}
                  >
                    <span>{q}</span>
                    <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
                      {lang === "ar" ? "قطعة" : "pcs"}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Live Summary & WhatsApp Handoff Column */}
        <div className="lg:col-span-4 sticky top-28">
          <Card className="p-6 border-[#C6A66B]/30 bg-[var(--bg-surface-elevated)] rounded-2xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h4 className="font-bold text-sm text-[var(--text-primary)]">
                {lang === "ar" ? "ملخص المواصفة" : "Specification Summary"}
              </h4>
              <Badge variant="gold" size="sm">
                {quantity} {lang === "ar" ? "قطعة" : "pcs"}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[var(--text-muted)] block mb-0.5">{lang === "ar" ? "المنتج:" : "Product:"}</span>
                <span className="font-semibold text-[var(--text-primary)]">{currentProduct.name[lang]}</span>
              </div>

              <div>
                <span className="text-[var(--text-muted)] block mb-0.5">{lang === "ar" ? "المقاس:" : "Size:"}</span>
                <span className="text-[var(--text-secondary)]">{currentSize.name[lang]}</span>
              </div>

              <div>
                <span className="text-[var(--text-muted)] block mb-0.5">{lang === "ar" ? "نوع الورق:" : "Material:"}</span>
                <span className="text-[var(--text-secondary)]">{currentMaterial.name[lang]} ({currentMaterial.spec})</span>
              </div>

              <div>
                <span className="text-[var(--text-muted)] block mb-0.5">{lang === "ar" ? "التشطيبات:" : "Finishes:"}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedFinishes.length > 0 ? (
                    selectedFinishes.map((fId) => (
                      <span key={fId} className="px-2 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-primary)] text-[10px] border border-[var(--border-subtle)]">
                        {finishOptions.find((f) => f.id === fId)?.name[lang]}
                      </span>
                    ))
                  ) : (
                    <span className="text-[var(--text-muted)]">{lang === "ar" ? "بدون إضافات" : "None"}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-3">
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                {lang === "ar"
                  ? "لا توجد أسعار وهمية. اضغط لإرسال المواصفة إلى واتساب وسنزودك بالسعر الدقيق وموعد التسليم فوراً."
                  : "No fabricated prices. Click to send your spec directly to WhatsApp for an accurate quote and timeline."}
              </p>

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#C6A66B]/20 hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-[#111111]" />
                <span>{lang === "ar" ? "إرسال المواصفة عبر واتساب" : "Send Spec via WhatsApp"}</span>
              </a>

              <Link
                href="/request-project"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-[var(--border-subtle)] hover:border-[#C6A66B]/40 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs transition-colors"
              >
                <span>{lang === "ar" ? "أو انتقل لنموذج طلب خدمة شامل" : "Or Go to General Service Form"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
