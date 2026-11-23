export type Language = "ar" | "en";
export type Theme = "dark" | "light";

export interface TranslationDictionary {
  brand: {
    name: string;
    subname: string;
    slogan: string;
    description: string;
  };
  nav: {
    home: string;
    about: string;
    services: string;
    portfolio: string;
    blog: string;
    requestProject: string;
    contact: string;
    faq: string;
  };
  theme: {
    toggle: string;
    dark: string;
    light: string;
  };
  lang: {
    toggle: string;
    ar: string;
    en: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlineHighlight: string;
    headlinePart2: string;
    subheading: string;
    primaryCta: string;
    secondaryCta: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  capabilities: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      tags: string[];
    }>;
  };
  ctaBanner: {
    badge: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
  footer: {
    tagline: string;
    aboutText: string;
    quickLinks: string;
    servicesTitle: string;
    contactTitle: string;
    rights: string;
    privacy: string;
    terms: string;
    address: string;
  };
  pagePlaceholders: {
    aboutTitle: string;
    aboutDesc: string;
    servicesTitle: string;
    servicesDesc: string;
    portfolioTitle: string;
    portfolioDesc: string;
    blogTitle: string;
    blogDesc: string;
    requestTitle: string;
    requestDesc: string;
    contactTitle: string;
    contactDesc: string;
    faqTitle: string;
    faqDesc: string;
    backHome: string;
    underConstruction: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    brand: {
      name: "MULTI CREATIVES",
      subname: "ملتي كريتيفز",
      slogan: "الإبداع والحلول الرقمية المتكاملة",
      description: "نقدم حلولاً متكاملة في التصميم والإعلان، تطوير المواقع والتطبيقات، الأنظمة والبرمجيات، الذكاء الاصطناعي، والطباعة والهدايا الدعائية.",
    },
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      portfolio: "أعمالنا",
      blog: "المقالات",
      requestProject: "طلب خدمة",
      contact: "تواصل معنا",
      faq: "الأسئلة الشائعة",
    },
    theme: {
      toggle: "تبديل المظهر",
      dark: "الوضع الداكن",
      light: "الوضع الفاتح",
    },
    lang: {
      toggle: "تغيير اللغة",
      ar: "العربية",
      en: "English",
    },
    hero: {
      badge: "الإبداع والحلول التقنية",
      headlinePart1: "نصنع تجارب إبداعية وحلولاً برمجية",
      headlineHighlight: "تساعد أعمالك على النمو",
      headlinePart2: "بكل احترافية ووضوح",
      subheading:
        "نساعدك على إطلاق موقعك، وتطوير تطبيقاتك، وبناء هويتك البصرية، وتنفيذ مطبوعاتك وهداياك الدعائية بجودة عالية وبأفضل المعايير.",
      primaryCta: "طلب خدمة",
      secondaryCta: "استكشف خدماتنا",
      feature1Title: "تصميم متميز",
      feature1Desc: "هويات بصرية وتصاميم واجهات تجمع بين الجمال وسهولة الاستخدام.",
      feature2Title: "تطوير عالي الأداء",
      feature2Desc: "مواقع وتطبيقات حديثة وسريعة ومتوافقة مع جميع الأجهزة.",
      feature3Title: "تنفيذ دقيق ومباشر",
      feature3Desc: "التزام كامل بالمواعيد ووضوح في المتطلبات ودعم فني مستمر.",
    },
    capabilities: {
      badge: "مجالات العمل",
      title: "خدمات متكاملة تغطي احتياجاتك الرقمية والإبداعية",
      subtitle:
        "نقدم باقة شاملة من الخدمات المتخصصة لمساعدتك في كل مرحلة من مراحل مشروعك.",
      items: [
        {
          title: "تطوير المواقع وتطبيقات الويب",
          description:
            "تصميم وبرمجة مواقع حديثة وتطبيقات ويب سريعة وسهلة الاستخدام.",
          tags: ["مواقع إلكترونية", "تطبيقات الويب", "تصميم متجاوب"],
        },
        {
          title: "تطوير البرمجيات والأنظمة",
          description:
            "بناء أنظمة تشغيلية مخصصة وقواعد بيانات منظمة تدعم متطلبات عملك.",
          tags: ["برمجيات مخصصة", "أنظمة إدارية", "ربط الأنظمة"],
        },
        {
          title: "حلول الذكاء الاصطناعي والأتمتة",
          description:
            "تطبيق حلول الذكاء الاصطناعي وأتمتة المهام اليومية لتوفير الوقت والجهد.",
          tags: ["أتمتة المهام", "مساعد ذكي", "تطوير الأعمال"],
        },
        {
          title: "التصميم الجرافيكي والطباعة والهدايا الدعائية",
          description:
            "ابتكار هويات بصرية جذابة، وتنفيذ مطبوعات تجارية وهدايا دعائية متكاملة.",
          tags: ["هويات بصرية", "مطبوعات ورقية", "هدايا دعائية"],
        },
      ],
    },
    ctaBanner: {
      badge: "ابدأ طلبك الآن",
      title: "هل لديك فكرة أو خدمة ترغب في تنفيذها؟",
      description:
        "يسعدنا التواصل معك ومناقشة تفاصيل طلبك وتقديم الحل المناسب لمتطلباتك بكل وضوح.",
      primaryButton: "طلب خدمة الآن",
      secondaryButton: "تواصل عبر واتساب",
    },
    footer: {
      tagline: "الإبداع والحلول الرقمية المتكاملة.",
      aboutText:
        "MULTI CREATIVES يقدم خدمات متخصصة في التصميم والإعلان، تطوير المواقع والتطبيقات، الأنظمة البرمجية، الذكاء الاصطناعي، وخدمات الطباعة والهدايا الدعائية.",
      quickLinks: "روابط سريعة",
      servicesTitle: "خدماتنا",
      contactTitle: "معلومات التواصل",
      rights: "جميع الحقوق محفوظة لـ MULTI CREATIVES.",
      privacy: "سياسة الخصوصية",
      terms: "الشروط والأحكام",
      address: "المملكة العربية السعودية — الرياض | اليمن — صنعاء",
    },
    pagePlaceholders: {
      aboutTitle: "عن MULTI CREATIVES",
      aboutDesc: "تعرف على مجالات عملنا ورؤيتنا في تقديم خدمات رقمية وإبداعية مميزة.",
      servicesTitle: "خدماتنا",
      servicesDesc: "قائمة بالخدمات المتخصصة التي نقدمها لعملائنا في مختلف المجالات.",
      portfolioTitle: "أعمالنا ومشاريعنا",
      portfolioDesc: "نماذج ومشاريع تجريبية توضح أسلوبنا في التصميم والتطوير.",
      blogTitle: "المقالات والمعرفة",
      blogDesc: "مقالات مبسطة ومفيدة في التقنية والتصميم وتطوير الأعمال.",
      requestTitle: "طلب خدمة",
      requestDesc: "حدد تفاصيل طلبك وسنتواصل معك سريعاً للبدء في التنفيذ.",
      contactTitle: "تواصل معنا",
      contactDesc: "نحن هنا للإجابة على استفساراتك واستقبال طلبات الخدمات.",
      faqTitle: "الأسئلة الشائعة",
      faqDesc: "إجابات واضحة على أكثر الأسئلة تكراراً حول خدماتنا وطريقة العمل.",
      backHome: "العودة للرئيسية",
      underConstruction: "يجري تحديث هذا القسم حالياً.",
    },
  },
  en: {
    brand: {
      name: "MULTI CREATIVES",
      subname: "Creative & Digital Solutions",
      slogan: "Creative & Digital Solutions",
      description: "Comprehensive solutions in design, advertising, web and app development, software systems, AI automation, printing, and promotional gifts.",
    },
    nav: {
      home: "Home",
      about: "About Us",
      services: "Services",
      portfolio: "Portfolio",
      blog: "Articles",
      requestProject: "Request a Service",
      contact: "Contact",
      faq: "FAQ",
    },
    theme: {
      toggle: "Toggle Theme",
      dark: "Dark Mode",
      light: "Light Mode",
    },
    lang: {
      toggle: "Switch Language",
      ar: "العربية",
      en: "English",
    },
    hero: {
      badge: "Creative & Digital Craft",
      headlinePart1: "Crafting Creative Experiences & Digital Solutions",
      headlineHighlight: "To Help Your Business Grow",
      headlinePart2: "With Clarity & Precision",
      subheading:
        "We help you build your website, develop custom applications, establish your visual identity, and produce premium prints and promotional gifts.",
      primaryCta: "Request a Service",
      secondaryCta: "Explore Services",
      feature1Title: "Distinctive Design",
      feature1Desc: "Visual identities and user interfaces that unite aesthetics with ease of use.",
      feature2Title: "High-Performance Build",
      feature2Desc: "Modern, responsive websites and apps optimized for all devices.",
      feature3Title: "Reliable Execution",
      feature3Desc: "On-time delivery, clear requirements, and continuous support.",
    },
    capabilities: {
      badge: "Capabilities",
      title: "Comprehensive Solutions for Your Digital and Creative Needs",
      subtitle:
        "A full suite of specialized services to support you at every stage of your project.",
      items: [
        {
          title: "Website & Web Applications Development",
          description:
            "Designing and developing modern, fast, and responsive websites and web applications.",
          tags: ["Websites", "Web Apps", "Responsive"],
        },
        {
          title: "Software & Systems Development",
          description:
            "Building tailored operational systems and structured databases to empower your workflow.",
          tags: ["Custom Software", "Management Systems", "APIs"],
        },
        {
          title: "AI & Automation Solutions",
          description:
            "Applying practical AI and task automation to save time and streamline daily operations.",
          tags: ["Automation", "Smart Assistants", "Productivity"],
        },
        {
          title: "Graphic Design, Printing & Promotional Gifts",
          description:
            "Creating memorable visual identities, commercial print collateral, and curated gift sets.",
          tags: ["Graphic Design", "Print Collateral", "Promotional Gifts"],
        },
      ],
    },
    ctaBanner: {
      badge: "Start Your Request",
      title: "Have a service or project you'd like to bring to life?",
      description:
        "We would be delighted to discuss your requirements and offer the most suitable solution.",
      primaryButton: "Request a Service Now",
      secondaryButton: "Chat on WhatsApp",
    },
    footer: {
      tagline: "Creative & Digital Solutions.",
      aboutText:
        "MULTI CREATIVES provides specialized services in advertising & design, website & app development, software systems, AI automation, printing, and promotional gifts.",
      quickLinks: "Quick Links",
      servicesTitle: "Services",
      contactTitle: "Contact Info",
      rights: "All Rights Reserved. MULTI CREATIVES.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      address: "Saudi Arabia — Riyadh | Yemen — Sana'a",
    },
    pagePlaceholders: {
      aboutTitle: "About MULTI CREATIVES",
      aboutDesc: "Learn more about our services and approach to digital and creative craft.",
      servicesTitle: "Our Services",
      servicesDesc: "A focused list of services tailored to elevate your business.",
      portfolioTitle: "Portfolio & Projects",
      portfolioDesc: "Concept projects and design mockups showcasing our capabilities.",
      blogTitle: "Articles & Insights",
      blogDesc: "Practical and accessible articles on technology, design, and business growth.",
      requestTitle: "Request a Service",
      requestDesc: "Share your requirements and we will connect promptly to get started.",
      contactTitle: "Contact Us",
      contactDesc: "We are here to answer your questions and welcome your service requests.",
      faqTitle: "Frequently Asked Questions",
      faqDesc: "Clear answers to common questions about our services and process.",
      backHome: "Back to Home",
      underConstruction: "This section is currently being updated.",
    },
  },
};
