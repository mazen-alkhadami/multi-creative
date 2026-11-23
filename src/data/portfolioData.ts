export interface PortfolioCategory {
  id: string;
  name: { ar: string; en: string };
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { id: "all", name: { ar: "جميع الأعمال", en: "All Projects" } },
  { id: "web-design", name: { ar: "تصميم المواقع", en: "Web Design" } },
  { id: "web-apps-software", name: { ar: "تطبيقات الويب والبرمجيات", en: "Web Apps & Software" } },
  { id: "branding-logos", name: { ar: "الهويات البصرية والشعارات", en: "Branding & Logos" } },
  { id: "graphic-design", name: { ar: "التصميم الجرافيكي", en: "Graphic Design" } },
  { id: "printing", name: { ar: "الطباعة", en: "Printing" } },
  { id: "promotional-gifts", name: { ar: "الهدايا الدعائية", en: "Promotional Gifts" } },
];

export interface PortfolioItem {
  slug: string;
  number: string;
  title: { ar: string; en: string };
  category: string;
  categoryName: { ar: string; en: string };
  status: "concept" | "real";
  isConcept: boolean;
  year: string;
  coverImage: string;
  gallery: string[];
  summary: { ar: string; en: string };
  challenge: { ar: string; en: string };
  solution: { ar: string; en: string };
  deliverables: Array<{ ar: string; en: string }>;
  tools: string[];
  previewUrl?: string | null;
}

export const portfolioData: PortfolioItem[] = [
  {
    slug: "specialty-coffee-platform",
    number: "01",
    title: {
      ar: "منصة تجارة إلكترونية وموقع تعريفي لمنتجات قهوة مختصة (Aura Coffee)",
      en: "Specialty Coffee E-Commerce & Brand Platform (Aura Coffee)",
    },
    category: "web-design",
    categoryName: { ar: "تصميم المواقع", en: "Web Design" },
    status: "concept",
    isConcept: true,
    year: "2026",
    coverImage: "/images/portfolio/coffee-web.svg",
    gallery: [
      "/images/portfolio/coffee-web.svg",
      "/images/services/website-design-development.svg",
    ],
    summary: {
      ar: "تصميم موقع تعريفي ومتجر متجاوب يعرض محاصيل القهوة المختصة وطرق التحضير بأسلوب بصري هادئ وسهل التصفح.",
      en: "Responsive specialty coffee brand website and storefront showcasing rare harvests and brewing guides with serene minimalism.",
    },
    challenge: {
      ar: "إبراز تفاصيل محاصيل القهوة وإيحاءاتها في بطاقات بسيطة وسريعة التصفح على الجوال دون إرباك المشتري.",
      en: "Presenting flavor notes and harvest origins clearly on mobile devices while maintaining smooth scrolling.",
    },
    solution: {
      ar: "بناء واجهات متجاوبة بألوان مريحة مع تقسيم واضح لأقسام المحاصيل وسلة الشراء وسهولة الوصول لزر الطلب.",
      en: "Developing intuitive product cards, simplified category filters, and an effortless checkout experience.",
    },
    deliverables: [
      { ar: "تصميم الواجهات المتجاوبة (Figma)", en: "Responsive UI Design (Figma)" },
      { ar: "تطوير صفحات العرض والمنتجات", en: "Frontend Pages Development" },
      { ar: "تحسين سرعة التصفح على الجوال", en: "Mobile Speed Optimization" },
    ],
    tools: ["Next.js", "Tailwind CSS", "TypeScript", "Figma"],
    previewUrl: null,
  },
  {
    slug: "creative-workspace-app",
    number: "02",
    title: {
      ar: "تطبيق ويب لإدارة المشاريع والمهام الإبداعية (Nova Workspace)",
      en: "Task & Project Management Web Application (Nova Workspace)",
    },
    category: "web-apps-software",
    categoryName: { ar: "تطبيقات الويب والبرمجيات", en: "Web Apps & Software" },
    status: "concept",
    isConcept: true,
    year: "2026",
    coverImage: "/images/portfolio/workspace-app.svg",
    gallery: [
      "/images/portfolio/workspace-app.svg",
      "/images/services/web-applications-development.svg",
    ],
    summary: {
      ar: "لوحة تحكم تفاعلية تمكّن الفِرق من متابعة المهام اليومية وجداول العمل وحالة المشاريع بصورة واضحة ومباشرة.",
      en: "Interactive dashboard enabling creative teams to track sprints, daily tasks, and deadlines with visual clarity.",
    },
    challenge: {
      ar: "تسهيل تنظيم المهام دون تعقيدات البرامج الضخمة، لتمكين الأعضاء من تحديث حالات العمل بضغطة زر.",
      en: "Avoiding dashboard clutter while providing fast status updates and essential performance metrics.",
    },
    solution: {
      ar: "تصميم أعمدة كانبان سلسة مع بطاقات ملونة حسب الأولوية ورسوم بيانية مختصرة لمتابعة سير الإنجاز.",
      en: "Creating streamlined Kanban columns, priority tags, and clean statistical cards for rapid visibility.",
    },
    deliverables: [
      { ar: "لوحة تحكم تفاعلية للمهام", en: "Interactive Task Kanban Board" },
      { ar: "نظام إحصائيات مبسط", en: "Clean Metrics Overview" },
      { ar: "واجهة سحابية متوافقة مع الجوال والكمبيوتر", en: "Responsive Web Dashboard" },
    ],
    tools: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    previewUrl: null,
  },
  {
    slug: "luxury-perfumes-branding",
    number: "03",
    title: {
      ar: "هوية بصرية وتصميم شعار لعلامة عطور راقية (Misk Luxury Perfumes)",
      en: "Brand Identity & Logo Suite for Fragrance Label (Misk Perfumes)",
    },
    category: "branding-logos",
    categoryName: { ar: "الهويات البصرية والشعارات", en: "Branding & Logos" },
    status: "concept",
    isConcept: true,
    year: "2026",
    coverImage: "/images/portfolio/perfume-branding.svg",
    gallery: [
      "/images/portfolio/perfume-branding.svg",
      "/images/services/graphic-design.svg",
    ],
    summary: {
      ar: "ابتكار رمز شعار مميز ونظام خطوط وألوان فاخرة يجمع بين الأصالة الشرقية والرقي العصري لمنتجات العطور.",
      en: "Creating an iconic emblem and color palette uniting oriental heritage with modern luxury for haute perfumery.",
    },
    challenge: {
      ar: "صياغة هوية تناسب الطباعة على الزجاج والعلب الكرتونية مع إمكانية استخدام الشعار بأحجام صغيرة وكبيرة.",
      en: "Ensuring the emblem retains clarity across foil stamping on glass bottles and embossed packaging.",
    },
    solution: {
      ar: "رسم رمز هندسي انسيابي بدرجات الذهبي الشامبيني والأسود الفحمي، مع دليل متكامل لاستخدام الشعار.",
      en: "Drafting a refined geometric emblem in champagne gold, paired with comprehensive brand guidelines.",
    },
    deliverables: [
      { ar: "تصميم الشعار الأساسي والرموز البديلة", en: "Master Emblem & Secondary Marks" },
      { ar: "دليل الهوية البصرية ونظام الخطوط", en: "Brand Manual & Typography Guide" },
      { ar: "تصميم نموذج الملصق والعبوة", en: "Bottle Label & Box Packaging Concept" },
    ],
    tools: ["Adobe Illustrator", "Photoshop", "Figma"],
    previewUrl: null,
  },
  {
    slug: "urban-bistro-campaigns",
    number: "04",
    title: {
      ar: "سلسلة تصاميم إعلانية ومنشورات سوشيال ميديا (Urban Bistro Ads)",
      en: "Social Media Advertising & Promo Campaign Suite (Urban Bistro)",
    },
    category: "graphic-design",
    categoryName: { ar: "التصميم الجرافيكي", en: "Graphic Design" },
    status: "concept",
    isConcept: true,
    year: "2026",
    coverImage: "/images/portfolio/bistro-ads.svg",
    gallery: [
      "/images/portfolio/bistro-ads.svg",
      "/images/services/graphic-design.svg",
    ],
    summary: {
      ar: "مجموعة بوسترات وبانرات رقمية موجهة لمنصات إنستغرام وتيك توك للترويج لقوائم الطعام وعروض الافتتاح.",
      en: "Dynamic digital ad campaign suite for Instagram and TikTok promoting seasonal menus and opening specials.",
    },
    challenge: {
      ar: "لفت انتباه المشاهد خلال الثواني الأولى من التمرير مع الحفاظ على وضوح العرض ورسالة الدعوة للطلب.",
      en: "Capturing instant viewer attention in social feeds while highlighting promotional discount calls to action.",
    },
    solution: {
      ar: "استخدام ألوان دافئة مشجعة، وخطوط عريضة ومقروءة، وتكوينات بصرية تضع الأطباق في المركز مباشرة.",
      en: "Utilizing vibrant warm palettes, bold typography, and centered hero product framing.",
    },
    deliverables: [
      { ar: "سلسلة منشورات وقوالب ستوري", en: "Social Media Post & Story Templates" },
      { ar: "بانرات إعلانية رقمية للحملات الممولة", en: "Paid Campaign Digital Banners" },
      { ar: "أصول قابلة للتعديل وإعادة الاستخدام", en: "Editable Vector Assets" },
    ],
    tools: ["Photoshop", "Illustrator", "After Effects"],
    previewUrl: null,
  },
  {
    slug: "horizon-print-suite",
    number: "05",
    title: {
      ar: "مطبوعات ورقية فاخرة وبطاقات أعمال مذهبة (Horizon Print Suite)",
      en: "Tactile Stationery & Foil-Stamped Business Cards (Horizon Print)",
    },
    category: "printing",
    categoryName: { ar: "الطباعة", en: "Printing" },
    status: "concept",
    isConcept: true,
    year: "2026",
    coverImage: "/images/portfolio/print-stationery.svg",
    gallery: [
      "/images/portfolio/print-stationery.svg",
      "/images/services/printing-services.svg",
    ],
    summary: {
      ar: "تصميم وتنفيذ مجموعة متناسقة من المطبوعات الرسمية تشمل كروت أعمال بختم حراري، أوراق مراسلات، ومغلفات خاصة.",
      en: "Cohesive stationery collection featuring hot-stamped business cards, letterheads, and custom envelopes.",
    },
    challenge: {
      ar: "مراعاة متطلبات المطابع من هوامش القص وتحديد خامات الورق المناسبة للختم الحراري دون تلف الألياف.",
      en: "Calibrating bleed margins, foil pressure tolerance, and heavy paper stock selection.",
    },
    solution: {
      ar: "تجهيز ملفات ديلاين دقيقة (Dielines) وتحديد ألوان البانتون وبصمات الذهب المعتمدة للتنفيذ الاحترافي.",
      en: "Preparing press-ready CMYK and foil separation files with exact registration marks.",
    },
    deliverables: [
      { ar: "تصميم بطاقات شخصية مذهبة", en: "Foil-Stamped Business Cards" },
      { ar: "أوراق مراسلات رسمية ومغلفات", en: "Official Letterheads & Envelopes" },
      { ar: "ملفات جاهزة للمطابع (Press-Ready)", en: "Production-Ready PDF / Dieline Files" },
    ],
    tools: ["InDesign", "Illustrator", "Pre-Press Dielines"],
    previewUrl: null,
  },
  {
    slug: "executive-gift-box",
    number: "06",
    title: {
      ar: "بوكس هدايا ترحيبية ودعائية متكاملة (Executive Welcome Gift Box)",
      en: "Curated Executive Welcome Gift Box & Merchandise Set",
    },
    category: "promotional-gifts",
    categoryName: { ar: "الهدايا الدعائية", en: "Promotional Gifts" },
    status: "concept",
    isConcept: true,
    year: "2026",
    coverImage: "/images/portfolio/gift-box.svg",
    gallery: [
      "/images/portfolio/gift-box.svg",
      "/images/services/promotional-gifts.svg",
    ],
    summary: {
      ar: "تصميم مجموعة هدايا ترحيبية داخل صندوق صلب مخصص، تشمل أجندة جلدية، قلم معدني محفور، وفلاش ميموري أنيق.",
      en: "Bespoke rigid gift box set featuring an embossed leather notebook, engraved metal pen, and custom USB drive.",
    },
    challenge: {
      ar: "توزيع القطع داخل الصندوق بتناسق متين يحمي المنتجات ويوفر تجربة فتح صندوق (Unboxing) ممتعة.",
      en: "Designing precise internal foam insets to secure each item firmly while creating an impressive unboxing.",
    },
    solution: {
      ar: "محاكاة قالب إسفنجي مخصص مع طباعة الشعار بلون ذهبي على غطاء الصندوق وكافة المحتويات الداخلية.",
      en: "Engineering custom EVA foam layouts and matching gold foil branding across all merchandise items.",
    },
    deliverables: [
      { ar: "تصميم الصندوق الخارجي وقوالب الحفر", en: "Rigid Box Dieline & Foil Artwork" },
      { ar: "تخصيص الأجندة والقلم والملحقات", en: "Branded Leather Notebook & Metal Pen" },
      { ar: "نماذج بصرية للمعاينة قبل الإنتاج", en: "3D Product Visualization Mockups" },
    ],
    tools: ["Illustrator", "Packaging CAD", "Photoshop Mockup"],
    previewUrl: null,
  },
];
