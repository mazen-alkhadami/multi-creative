export interface FaqItem {
  id: string;
  category: "general" | "services" | "branding" | "production";
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

export const faqCategories = [
  { id: "all", label: { ar: "جميع الأسئلة", en: "All Questions" } },
  { id: "general", label: { ar: "عام وطريقة العمل", en: "General & Process" } },
  { id: "services", label: { ar: "المواقع والبرمجيات", en: "Web & Software" } },
  { id: "branding", label: { ar: "الهوية والتصميم", en: "Branding & Design" } },
  { id: "production", label: { ar: "الطباعة والهدايا", en: "Print & Gifts" } },
];

export const faqData: FaqItem[] = [
  {
    id: "general-1",
    category: "general",
    question: {
      ar: "كيف أبدأ بطلب خدمة من MULTI CREATIVES؟",
      en: "How do I request a service from MULTI CREATIVES?",
    },
    answer: {
      ar: "يمكنك الضغط على زر 'طلب خدمة' واختيار نوع الخدمة وكتابة وصف موجز، ثم إرسال الطلب مباشرة عبر واتساب لنتواصل معك ونبدأ فوراً.",
      en: "Simply click 'Request a Service', select your desired service, provide a brief description, and submit directly via WhatsApp to get started.",
    },
  },
  {
    id: "general-2",
    category: "general",
    question: {
      ar: "ما هي مناطق تقديم واستقبال الخدمات؟",
      en: "What regions do you serve?",
    },
    answer: {
      ar: "نستقبل طلبات الخدمات من المملكة العربية السعودية (الرياض) والجمهورية اليمنية (صنعاء)، ونخدم عملاءنا رقمياً وعبر وسائل التواصل المباشرة.",
      en: "We welcome service requests from Saudi Arabia (Riyadh) and Yemen (Sana'a), serving clients digitally with direct communication.",
    },
  },
  {
    id: "services-1",
    category: "services",
    question: {
      ar: "ما هي التقنيات المستخدمة في تطوير المواقع والتطبيقات؟",
      en: "What technologies do you use for websites and apps?",
    },
    answer: {
      ar: "نستخدم أحدث أطر العمل الحديثة مثل Next.js وReact وTypeScript وTailwind CSS، لضمان سرعة فائقة في التحميل وتوافق كامل مع الهواتف الذكية.",
      en: "We build with modern frameworks like Next.js, React, TypeScript, and Tailwind CSS, ensuring fast loading speeds and full mobile responsiveness.",
    },
  },
  {
    id: "services-2",
    category: "services",
    question: {
      ar: "كيف تساعد حلول الذكاء الاصطناعي في تحسين عملي؟",
      en: "How do AI solutions help my business?",
    },
    answer: {
      ar: "تساعد حلول الذكاء الاصطناعي في أتمتة المهام اليومية المتكررة، وتنظيم البيانات، وبناء روبوتات محادثة ذكية تجيب على استفسارات عملائك على مدار الساعة.",
      en: "AI solutions help automate repetitive daily tasks, organize data, and deploy guided assistants that answer client questions 24/7.",
    },
  },
  {
    id: "branding-1",
    category: "branding",
    question: {
      ar: "ماذا أستلم عند طلب تصميم هوية بصرية؟",
      en: "What deliverables do I receive with a visual identity?",
    },
    answer: {
      ar: "تستلم ملفات الشعار بجميع الصيغ المفتوحة وعالية الدقة، مع كود الألوان المعتمدة، الخطوط العربية والإنجليزية، ودليل مبسط لطريقة استخدام الهوية.",
      en: "You receive high-resolution and vector logo files, color codes, approved typography, and clear guidelines on using your visual identity.",
    },
  },
  {
    id: "production-1",
    category: "production",
    question: {
      ar: "ما هي خيارات الطباعة المتاحة لديكم؟",
      en: "What printing options do you offer?",
    },
    answer: {
      ar: "نوفر طباعة كروت الأعمال، البروشورات، الأكياس الورقية، وعلب المنتجات، مع تشطيبات متنوعة تشمل السلوفان المطفي واللامع، والبصمة الذهبية والفضية، والسبوت يو في.",
      en: "We produce business cards, brochures, paper bags, and product packaging with finishes including matte/gloss lamination, metallic foils, and spot UV.",
    },
  },
  {
    id: "production-2",
    category: "production",
    question: {
      ar: "هل يمكن تجهيز بوكسات هدايا دعائية بمحتويات مخصصة؟",
      en: "Can promotional gift boxes be customized?",
    },
    answer: {
      ar: "نعم، نساعدك في اختيار وتخصيص محتويات البوكس، مثل الأجندات، والأقلام المعدنية، والملحقات الترويجية مع طباعة شعارك بتغليف أنيق.",
      en: "Yes, we help curate and customize gift boxes with notebooks, metal pens, and promotional accessories featuring your branding.",
    },
  },
];
