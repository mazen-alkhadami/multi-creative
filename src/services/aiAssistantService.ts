export interface AssistantMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  actionUrl?: string;
  actionLabel?: string;
  timestamp?: number;
}

export interface AssistantResponse {
  reply: string;
  actionUrl?: string;
  actionLabel?: string;
}

export const AiAssistantService = {
  async sendMessage(query: string, lang: "ar" | "en"): Promise<AssistantResponse> {
    try {
      // Integration-ready: attempts local API route if configured
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, lang }),
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // Client-side fallback gracefully handled if offline or in static export
    }

    // Default grounded knowledge base
    return this.getLocalKnowledgeReply(query, lang);
  },

  getLocalKnowledgeReply(query: string, lang: "ar" | "en"): AssistantResponse {
    const lower = query.toLowerCase();

    if (
      lower.includes("خدمات") ||
      lower.includes("تخصص") ||
      lower.includes("disciplines") ||
      lower.includes("service")
    ) {
      return {
        reply:
          lang === "ar"
            ? "نقدم سبعة تخصصات استراتيجية متكاملة:\n1. تطوير المواقع الإلكترونية (Next.js 16)\n2. تطوير تطبيقات الويب\n3. تطوير البرمجيات والأنظمة المؤسسية\n4. الذكاء الاصطناعي والأتمتة\n5. التصميم الجرافيكي والهويات\n6. خدمات الطباعة والتغليف الفاخر\n7. الهدايا الدعائية والتنفيذية."
            : "We deliver seven integrated disciplines:\n1. Website Design & Development (Next.js 16)\n2. Web Applications Development\n3. Software & Systems Development\n4. AI & Automation Solutions\n5. Graphic Design\n6. Luxury Printing Services\n7. Promotional Gifts.",
        actionUrl: "/services",
        actionLabel: lang === "ar" ? "دليل الخدمات السبعة" : "Explore 7 Disciplines",
      };
    }

    if (
      lower.includes("طلب") ||
      lower.includes("مشروع") ||
      lower.includes("بدء") ||
      lower.includes("brief") ||
      lower.includes("quote")
    ) {
      return {
        reply:
          lang === "ar"
            ? "يمكنك تقديم موجز مشروعك مباشرة عبر نموذج المخطط الذكي، أو استخدام حاسبة النطاق التفاعلية لتقدير عدد أسابيع التنفيذ وتشكيل الفريق الهندسي."
            : "You can submit your requirements via our Smart Project Brief, or use the interactive Quote Builder to estimate sprint duration and engineering squad composition.",
        actionUrl: "/request-project",
        actionLabel: lang === "ar" ? "موجز المشروع الذكي" : "Open Project Brief",
      };
    }

    if (
      lower.includes("طباعة") ||
      lower.includes("تغليف") ||
      lower.includes("ورق") ||
      lower.includes("print") ||
      lower.includes("packaging")
    ) {
      return {
        reply:
          lang === "ar"
            ? "يوفر استوديو الطباعة والتغليف لدينا إمكانية تهيئة الخامات القطنية الإيطالية 600 GSM، والتذهيب الحراري الشامباني، وهياكل الصناديق الفاخرة مع تقديم نموذج تجريبي أبيض (White Dummy) قبل الإنتاج."
            : "Our Luxury Print Studio enables you to configure 600 GSM Italian cotton board, champagne hot stamping, and custom rigid box dielines with physical white dummy proofing.",
        actionUrl: "/print-configurator",
        actionLabel: lang === "ar" ? "مُهيّئ خامات الطباعة" : "Open Print Configurator",
      };
    }

    if (
      lower.includes("أمان") ||
      lower.includes("سرعة") ||
      lower.includes("security") ||
      lower.includes("speed") ||
      lower.includes("next")
    ) {
      return {
        reply:
          lang === "ar"
            ? "معاييرنا المعمارية تشمل:\n• زمن تحميل أولي أقل من 0.8 ثانية عبر Next.js 16.\n• تقييم أداء 95+ في مؤشرات Core Web Vitals.\n• سرية مؤسسية واتفاقيات عدم إفصاح (NDA) مع نقل الملكية الفكرية بالكامل للعميل."
            : "Our architectural standards guarantee:\n• Sub-800ms initial paint via Next.js 16.\n• 95+ Core Web Vitals performance benchmarks.\n• Bilateral NDA governance and 100% intellectual property sovereignty transfer.",
        actionUrl: "/faq",
        actionLabel: lang === "ar" ? "الأسئلة والمعايير الفنية" : "View Technical FAQs",
      };
    }

    return {
      reply:
        lang === "ar"
          ? "شكراً لتواصلك. فريق الاستشارات الاستراتيجية في MULTI CREATIVES جاهز لبحث تفاصيل مشروعك وصياغة المخطط المعماري المناسب لأهدافكم."
          : "Thank you for connecting. The MULTI CREATIVES executive team is ready to analyze your technical requirements and formulate a tailored architectural blueprint.",
      actionUrl: "/contact",
      actionLabel: lang === "ar" ? "التواصل المباشر" : "Contact Executive Desk",
    };
  },
};
