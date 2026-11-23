export interface ServiceDeliverable {
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
}

export interface ServiceProcessStep {
  step: string;
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
}

export interface ServiceGalleryItem {
  title: { ar: string; en: string };
  desc: { ar: string; en: string };
  image: string;
  tag: { ar: string; en: string };
}

export interface ServiceItem {
  slug: string;
  number: string;
  title: { ar: string; en: string };
  tagline: { ar: string; en: string };
  shortDescription: { ar: string; en: string };
  overview: { ar: string; en: string };
  keyMetrics: Array<{ value: string; label: { ar: string; en: string } }>;
  deliverables: ServiceDeliverable[];
  process: ServiceProcessStep[];
  techStack: string[];
  gallery: ServiceGalleryItem[];
}

export const servicesData: ServiceItem[] = [
  {
    slug: "website-design-development",
    number: "01",
    title: {
      ar: "تطوير المواقع الإلكترونية",
      en: "Website Design & Development",
    },
    tagline: {
      ar: "تصميم وتطوير مواقع إلكترونية فاخرة، فائقة السرعة، ومصممة لترسيخ المكانة السوقية",
      en: "Designing and engineering elite, high-performance websites that command market eminence",
    },
    shortDescription: {
      ar: "نصمم ونطور مواقع مؤسسية وبوابات تعريفية تعكس فخامة علامتك وتوفر تجربة تصفح سلسة على كافة الشاشات، مع التركيز على أعلى معايير السرعة والأمان والتوافق مع محركات البحث.",
      en: "We architect and develop corporate websites and digital brand portals that embody luxury, deliver sub-second performance, and ensure flawless responsive behavior across all viewports.",
    },
    overview: {
      ar: "الموقع الإلكتروني هو الواجهة السيادية الأولى للعلامة التجارية في الفضاء الرقمي. في MULTI CREATIVES، لا نعتمد على القوالب الجاهزة أو التصاميم المكررة؛ بل نصمم كل تفصيلة وفق هوية العميل وأهدافه الاستراتيجية. نستخدم أحدث تقنيات الويب مثل Next.js 16 وTailwind CSS، لضمان تحميل فوري، وتوافق تام مع اللغة العربية (RTL) والإنجليزية (LTR)، وتجربة مستخدم لا تُنسى.",
      en: "Your website is the primary institutional embassy of your organization in the digital sphere. At MULTI CREATIVES, we reject generic themes and prefabricated templates. Every layout, interaction, and typographic rhythm is meticulously engineered to reflect quiet luxury, uncompromising security, and sub-second page rendering powered by modern edge technologies.",
    },
    keyMetrics: [
      { value: "< 0.8s", label: { ar: "سرعة تحميل الصفحة", en: "First Contentful Paint" } },
      { value: "100%", label: { ar: "تجاوب كامل مع الأجهزة", en: "Responsive Fluidity" } },
      { value: "95+", label: { ar: "معدل معايير SEO والأداء", en: "Google Lighthouse Score" } },
    ],
    deliverables: [
      {
        title: { ar: "تصميم واجهات وتجربة مستخدم مخصصة", en: "Bespoke UI/UX Architecture" },
        desc: {
          ar: "تصاميم فريدة تعبر عن نبرة الفخامة والخصوصية للعلامة التجارية.",
          en: "Custom-tailored interface layouts reflecting understated luxury and brand prestige.",
        },
      },
      {
        title: { ar: "تطوير أمامي متطور (Next.js & TypeScript)", en: "Next-Gen Frontend Engineering" },
        desc: {
          ar: "بناء واجهات برمجية نظيفة وخالية من التعقيد تضمن ثبات الأداء وسرعة الاستجابة.",
          en: "Clean, strongly typed codebases leveraging Next.js App Router and server rendering.",
        },
      },
      {
        title: { ar: "دعم كامل ومثالي للغتين (العربية والإنجليزية)", en: "Full Bilingual (RTL/LTR) Parity" },
        desc: {
          ar: "مراعاة تامة للتوازن البصري والطباعي بين العربية والإنجليزية دون تشوهات.",
          en: "Flawless bidirectional typography with native line balancing and zero clipping.",
        },
      },
      {
        title: { ar: "تهيئة محركات البحث المتقدمة (SEO)", en: "Technical SEO & Semantic Schema" },
        desc: {
          ar: "بناء وسوم وصفحات مهيأة لأرشفة فورية وتصدر الكلمات المفتاحية التنافسية.",
          en: "Semantic JSON-LD metadata and OpenGraph architecture to maximize search visibility.",
        },
      },
    ],
    process: [
      {
        step: "01",
        title: { ar: "التدقيق والتخطيط المعماري", en: "Architecture & Wireframing" },
        desc: {
          ar: "دراسة متطلبات الموقع، شجرة الصفحات، وتحديد المسار الأمثل للزائر.",
          en: "Defining the site map, structural wireframes, and high-conversion user pathways.",
        },
      },
      {
        step: "02",
        title: { ar: "التصميم البصري ونظام المكونات", en: "Visual Design & Tokenization" },
        desc: {
          ar: "إسقاط الهوية المؤسسية، والخطوط، والألوان الفاخرة على نماذج تفاعلية.",
          en: "Applying luxury color palettes, typography scales, and interactive design tokens.",
        },
      },
      {
        step: "03",
        title: { ar: "التطوير البرمجي والاختبار", en: "Engineering & Multi-Device QA" },
        desc: {
          ar: "تحويل التصاميم إلى شيفرات برمجية فائقة السرعة مع فحص التجاوب عبر مختلف الشاشات.",
          en: "Coding performant components with rigorous testing across 20+ device viewports.",
        },
      },
      {
        step: "04",
        title: { ar: "الإطلاق السحابي والتحسين", en: "Edge Deployment & Optimization" },
        desc: {
          ar: "نشر الموقع على شبكات خوادم سحابية عالمية مع شهادات أمان متقدمة.",
          en: "Deploying to distributed edge CDN with SSL hardening and cache optimization.",
        },
      },
    ],
    techStack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Vercel Edge", "Figma"],
    gallery: [
      {
        title: { ar: "واجهة الموقع المؤسسي الفاخر", en: "Luxury Corporate Web Experience" },
        desc: { ar: "مخطط موقع تعريفي مع شاشات تفاعلية وتوازن طباعي مريح للعين.", en: "Corporate portal interface with responsive layouts and refined typography." },
        image: "/images/services/website-design-development.svg",
        tag: { ar: "موقع ويب", en: "Web Design" },
      },
      {
        title: { ar: "التوافق التجاوبي على الشاشات الذكية", en: "Multi-Device Viewport Fidelity" },
        desc: { ar: "تجربة تصفح متسقة وانسيابية على الهواتف الذكية والأجهزة اللوحية.", en: "Seamless fluid experience across mobile, tablet, and ultra-wide screens." },
        image: "/images/services/web-applications-development.svg",
        tag: { ar: "تجاوب الشاشات", en: "Responsive" },
      },
      {
        title: { ar: "معمارية الكود ونظام الواجهات", en: "Modular Code Architecture" },
        desc: { ar: "بنية تحتية برمجية تدعم التوسع والسرعة والاستقرار الدائم.", en: "Structured TypeScript codebase engineered for longevity and speed." },
        image: "/images/services/software-systems-development.svg",
        tag: { ar: "هندسة الكود", en: "Engineering" },
      },
    ],
  },
  {
    slug: "web-applications-development",
    number: "02",
    title: {
      ar: "تطوير تطبيقات الويب",
      en: "Web Applications Development",
    },
    tagline: {
      ar: "بناء تطبيقات ويب تفاعلية، مرنة، وقابلة للتوسع للتعامل مع العمليات المعقدة",
      en: "Engineering robust, scalable, and interactive web applications for complex business logic",
    },
    shortDescription: {
      ar: "نطور تطبيقات ويب مخصصة للشركات والمنصات الرقمية، تدمج بين سهولة الاستخدام، وقوة المعالجة السحابية، واستقرار قواعد البيانات لتوفير تجربة عمل متكاملة.",
      en: "We engineer enterprise web applications that combine intuitive workflows, resilient cloud architectures, and high-throughput data processing to power core business operations.",
    },
    overview: {
      ar: "تتطلب تطبيقات الويب الحديثة بنية برمجية متينة قادرة على معالجة تدفقات البيانات اللحظية وإدارة صلاحيات المستخدمين بدقة. نحن نبني منصات تفاعلية، ولوحات تحكم إدارية (Dashboards)، وأنظمة إدارة محتوى مخصصة تعتمد على الفصل الدقيق للمسؤوليات (Separation of Concerns)، مع التركيز على حماية البيانات وسلاسة تجربة الاستخدام.",
      en: "Modern web applications require bulletproof architectural scaffolding capable of managing stateful real-time data and granular role-based access. We design and build mission-critical enterprise web apps, operational dashboards, and custom client portals engineered with modular micro-components and zero-trust security postures.",
    },
    keyMetrics: [
      { value: "99.9%", label: { ar: "جاهزية واستقرار النظام", en: "Uptime Reliability" } },
      { value: "Real-Time", label: { ar: "معالجة فورية للبيانات", en: "Real-Time State Sync" } },
      { value: "Zero-Drift", label: { ar: "توافق الأنظمة والمكونات", en: "Component Token Parity" } },
    ],
    deliverables: [
      {
        title: { ar: "لوحات تحكم إدارية تفاعلية (Dashboards)", en: "Executive Operational Dashboards" },
        desc: {
          ar: "واجهات مخصصة لرصد المؤشرات والتقارير الحية وتسهيل اتخاذ القرارات.",
          en: "Intuitive telemetry dashboards surfacing actionable operational data in real time.",
        },
      },
      {
        title: { ar: "إدارة الصلاحيات والأمان المتعدد", en: "Role-Based Access Control (RBAC)" },
        desc: {
          ar: "هيكلة صلاحيات دقيقة تضمن حماية خصوصية بيانات العمل ومستخدميه.",
          en: "Granular permission hierarchies and authentication frameworks protecting corporate assets.",
        },
      },
      {
        title: { ar: "بوابات العملاء والشركاء الذكية", en: "Client & Partner Portals" },
        desc: {
          ar: "منصات ذاتية الخدمة تتيح للعملاء متابعة الطلبات والمدفوعات والمستندات.",
          en: "Secure self-service portals allowing clients to manage workflows, requests, and billing.",
        },
      },
      {
        title: { ar: "ربط واجهات برمجة التطبيقات (API Integrations)", en: "Modern API Integrations" },
        desc: {
          ar: "تكامل مباشر مع بوابات الدفع، والبريد الإلكتروني، والخدمات السحابية العالمية.",
          en: "Resilient connectors linking payment gateways, notification brokers, and cloud services.",
        },
      },
    ],
    process: [
      {
        step: "01",
        title: { ar: "تحليل منطق العمل والمتطلبات", en: "Scoping & Functional Logic" },
        desc: {
          ar: "تفكيك نماذج العمل، وتحديد حالات الاستخدام (Use Cases)، ورسم تدفق العمليات.",
          en: "Mapping user personas, edge cases, and architectural state management.",
        },
      },
      {
        step: "02",
        title: { ar: "هندسة البيانات والواجهات", en: "Data Modeling & UI Prototyping" },
        desc: {
          ar: "بناء هيكلية البيانات وتصميم شاشات التطبيق بنظام تفاعلي متماسك.",
          en: "Structuring schemas, relational tables, and clickable interactive prototypes.",
        },
      },
      {
        step: "03",
        title: { ar: "التطوير البرمجي واختبارات الأمان", en: "Full-Stack Build & Security Audits" },
        desc: {
          ar: "كتابة شيفرات برمجية نظيفة مدعومة باختبارات تلقائية وفحص ثغرات الأمان.",
          en: "Building modular components backed by automated unit tests and penetration audits.",
        },
      },
      {
        step: "04",
        title: { ar: "التشغيل والتدريب والتوثيق", en: "Deployment & Documentation" },
        desc: {
          ar: "تدشين التطبيق وتوفير أدلة استخدام شاملة لفرق العمل والمسؤولين.",
          en: "Production release with technical documentation and administrative handover.",
        },
      },
    ],
    techStack: ["React 19", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "REST/GraphQL"],
    gallery: [
      {
        title: { ar: "لوحة التحكم التفاعلية ومتابعة العمليات", en: "Interactive Application Dashboard" },
        desc: { ar: "واجهة تطبيق ويب معقدة تعرض المؤشرات والمخططات البيانية اللحظية.", en: "Complex application cockpit displaying live metric streams and analytics." },
        image: "/images/services/web-applications-development.svg",
        tag: { ar: "تطبيق ويب", en: "Web App" },
      },
      {
        title: { ar: "هندسة الشاشات وتدفق العمليات", en: "Workflow Canvas & User Flow" },
        desc: { ar: "مسارات عمل بديهية تسهل إنجاز المهام المؤسسية بأقل عدد من النقرات.", en: "Intuitive interaction pathways minimizing cognitive friction for end users." },
        image: "/images/services/website-design-development.svg",
        tag: { ar: "تجربة مستخدم", en: "UX Flow" },
      },
      {
        title: { ar: "معمارية الأنظمة والتكامل السحابي", en: "Cloud Microservices Network" },
        desc: { ar: "بنية تحتية سحابية مصممة للتعامل مع آلاف العمليات المتزامنة.", en: "Scalable backend architecture engineered for high concurrency." },
        image: "/images/services/software-systems-development.svg",
        tag: { ar: "معمارية سحابية", en: "Cloud Arch" },
      },
    ],
  },
  {
    slug: "software-systems-development",
    number: "03",
    title: {
      ar: "تطوير البرمجيات والأنظمة",
      en: "Software & Systems Development",
    },
    tagline: {
      ar: "هندسة برمجيات مخصصة وبنى تحتية معيارية تلبي تطلعات الكيانات الكبرى",
      en: "Custom software engineering and modular infrastructure engineered for scale and resilience",
    },
    shortDescription: {
      ar: "نطور أنظمة برمجية متخصصة وحلول إدارة مؤسسية مصممة خصيصاً لتلبية متطلبات العمل الفريدة، مع التركيز على استقرار المعمارية وأمان البيانات.",
      en: "We architect bespoke enterprise software, database infrastructure, and specialized business systems engineered to solve complex operational challenges with uncompromising reliability.",
    },
    overview: {
      ar: "الحلول الجاهزة غالباً ما تفرض قيوداً على نمو المؤسسات الطموحة. نحن نقدم هندسة برمجية متقدمة تبدأ من دراسة عميقة لآليات العمل، وصولاً إلى بناء أنظمة مخصصة تندمج بسلاسة مع البنى القائمة. نحرص على تطبيق أفضل الممارسات في كتابة الشيفرات، واستخدام معمارية الخدمات المصغرة (Microservices)، لضمان قابلية التوسع والصيانة على المدى الطويل.",
      en: "Off-the-shelf software inevitably imposes architectural limitations on growing institutions. We engineer custom software systems from the ground up, aligning domain logic with high-performance computational models. Our engineers implement clean code paradigms, microservice isolation, and automated CI/CD pipelines to guarantee institutional software longevity.",
    },
    keyMetrics: [
      { value: "99.99%", label: { ar: "استقرار الخوادم والبنية", en: "Infrastructure Resilience" } },
      { value: "Scalable", label: { ar: "قابلية غير محدودة للتوسع", en: "Horizontal Scalability" } },
      { value: "Tier-1", label: { ar: "معايير الحماية والتشفير", en: "Enterprise Encryption" } },
    ],
    deliverables: [
      {
        title: { ar: "أنظمة إدارة الموارد والعمليات المخصصة", en: "Custom Enterprise Operations Systems" },
        desc: {
          ar: "برمجيات لإدارة سلاسل الإمداد، والموارد البشرية، والعمليات الداخلية.",
          en: "Tailored ERP modules synchronizing operations, resource allocation, and reporting.",
        },
      },
      {
        title: { ar: "هندسة قواعد البيانات والبيانات الضخمة", en: "Database Architecture & Optimization" },
        desc: {
          ar: "تصميم قواعد بيانات سريعة وآمنة قادرة على استيعاب ملايين السجلات.",
          en: "High-throughput SQL/NoSQL schemas calibrated for rapid query execution.",
        },
      },
      {
        title: { ar: "بوابات وخدمات الربط البرمجي (Custom APIs)", en: "Bespoke API Gateways" },
        desc: {
          ar: "تطوير واجهات برمجة معيارية تربط الأنظمة المختلفة بسلاسة وأمان.",
          en: "Standardized microservices connecting legacy systems with modern cloud stacks.",
        },
      },
      {
        title: { ar: "التكامل والترحيل السحابي الآمن", en: "Cloud Migration & Containerization" },
        desc: {
          ar: "نقل الأنظمة وتوزيعها عبر الحاويات (Docker) لضمان سهولة الإدارة والتوسع.",
          en: "Seamless containerized deployments ensuring portable and reproducible environments.",
        },
      },
    ],
    process: [
      {
        step: "01",
        title: { ar: "التحليل المؤسسي وتوثيق النطاق", en: "Domain Modeling & Scoping" },
        desc: {
          ar: "جلسات عمل مكثفة مع فرق العميل لرسم خريطة المتطلبات والتحديات التشغيلية.",
          en: "Deep-dive stakeholder discovery to map operational dependencies and bottlenecks.",
        },
      },
      {
        step: "02",
        title: { ar: "التصميم المعماري للنظام", en: "System Architecture Blueprint" },
        desc: {
          ar: "رسم المخططات الهندسية للعلاقات البرمجية، وتدفق البيانات، ومعايير الأمان.",
          en: "Designing architectural schematics, network topologies, and security protocols.",
        },
      },
      {
        step: "03",
        title: { ar: "التطوير المرحلي واختبارات الجودة", en: "Iterative Build & Unit Testing" },
        desc: {
          ar: "برمجة الأنظمة بنهج رشيق يتيح للعميل مراجعة المخرجات مرحلياً.",
          en: "Agile sprints delivering functional releases tested under simulated production loads.",
        },
      },
      {
        step: "04",
        title: { ar: "التدشين، الحوكمة، والدعم الفني", en: "Deployment, Governance & SLA" },
        desc: {
          ar: "إطلاق النظام وتقديم الصيانة الوقائية والمتابعة التقنية المستمرة.",
          en: "Production handover, staff enablement, and round-the-clock infrastructure monitoring.",
        },
      },
    ],
    techStack: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "Redis", "AWS / Edge"],
    gallery: [
      {
        title: { ar: "معمارية الكود والأنظمة البرمجية", en: "Enterprise Systems Architecture" },
        desc: { ar: "شفرة برمجية نظيفة تعتمد أحدث المعايير لتأمين البيانات وتسريع العمليات.", en: "Architectural code schematics delivering high-throughput processing." },
        image: "/images/services/software-systems-development.svg",
        tag: { ar: "أنظمة برمجية", en: "Systems" },
      },
      {
        title: { ar: "شبكات المعالجة وتكامل واجهات الربط", en: "Distributed Service Infrastructure" },
        desc: { ar: "مخطط هيكلي لربط الأنظمة عبر خدمات مصغرة ذات زمن استجابة فائق.", en: "Microservice topologies maintaining persistent sub-millisecond latency." },
        image: "/images/services/ai-automation-solutions.svg",
        tag: { ar: "بنية تحتية", en: "Infrastructure" },
      },
      {
        title: { ar: "لوحة التحكم التفاعلية ومراقبة الخوادم", en: "Server Telemetry & Metrics" },
        desc: { ar: "مؤشرات حية لمتابعة أداء الخوادم واستهلاك الموارد والأمان.", en: "Real-time infrastructure health and operational metrics dashboard." },
        image: "/images/services/web-applications-development.svg",
        tag: { ar: "رصد الأنظمة", en: "Monitoring" },
      },
    ],
  },
  {
    slug: "ai-automation-solutions",
    number: "04",
    title: {
      ar: "الذكاء الاصطناعي والأتمتة",
      en: "AI & Automation Solutions",
    },
    tagline: {
      ar: "دمج الذكاء الاصطناعي وأتمتة مسارات العمل لرفع الكفاءة التشغيلية وصناعة ميزة تنافسية",
      en: "Integrating artificial intelligence and intelligent automation to eliminate friction and maximize output",
    },
    shortDescription: {
      ar: "نبتكر حلول ذكاء اصطناعي وأدوات أتمتة ذكية تسهم في تسريع وتيرة الأعمال، وتحليل البيانات المعقدة، وأتمتة العمليات المتكررة بدقة متناهية.",
      en: "We engineer AI workflows, custom assistant agents, and automated pipeline solutions that transform business velocity, extract predictive insights, and eliminate manual overhead.",
    },
    overview: {
      ar: "أصبح الذكاء الاصطناعي رافعة استراتيجية أساسية للشركات التي تسعى للريادة. في MULTI CREATIVES، لا نكتفي بالأدوات الجاهزة؛ بل ندمج تقنيات النماذج اللغوية الكبيرة (LLMs)، وتحليل البيانات الذكي، وأتمتة مسارات العمل في صميم عمليات العميل. نساعد المؤسسات على تقليل الأخطاء البشرية، وتسريع خدمة العملاء، واتخاذ قرارات مبنية على بيانات دقيقة.",
      en: "Artificial intelligence is the definitive strategic catalyst for institutional market leadership. We build bespoke generative AI pipelines, intelligent customer-facing assistants, and autonomous workflow engines integrated directly into enterprise databases. Our solutions empower teams to automate repetitive labor and extract high-conviction insights from proprietary data.",
    },
    keyMetrics: [
      { value: "80%", label: { ar: "خفض زمن العمليات الروتينية", en: "Process Time Reduction" } },
      { value: "24/7", label: { ar: "استجابة ذكية فورية ومستمرة", en: "Autonomous Availability" } },
      { value: "Zero-Leak", label: { ar: "خصوصية وأمان البيانات", en: "Data Sovereignty & Privacy" } },
    ],
    deliverables: [
      {
        title: { ar: "المساعدات الذكية ووكلاء الدردشة المخصصين", en: "Custom AI Agents & Copilots" },
        desc: {
          ar: "تطوير وكلاء ذكاء اصطناعي مدربين على مستندات وبيانات العمل الخاصة.",
          en: "Specialized AI agents trained on proprietary enterprise knowledge bases.",
        },
      },
      {
        title: { ar: "أتمتة مسارات العمل التشغيلية (Workflows)", en: "End-to-End Workflow Automation" },
        desc: {
          ar: "ربط التطبيقات، ومعالجة الطلبات، وتوليد التقارير والفواتير تلقائياً.",
          en: "Autonomous pipeline connectors eliminating manual handoffs across platforms.",
        },
      },
      {
        title: { ar: "التحليلات التنبؤية واستخراج الرؤى", en: "Predictive Analytics & Intelligence" },
        desc: {
          ar: "تحليل البيانات التاريخية لاستكشاف أنماط وسلوكيات المستهلكين والتنبؤ بالطلب.",
          en: "Machine learning models surfacing predictive trends and customer behavior patterns.",
        },
      },
      {
        title: { ar: "معالجة المستندات والبيانات غير المهيكلة", en: "Intelligent Document Processing (IDP)" },
        desc: {
          ar: "استخراج البيانات من العقود، والفواتير، والملفات وتحويلها إلى بيانات منظمة.",
          en: "Automated extraction and classification of unstructured contracts, invoices, and PDFs.",
        },
      },
    ],
    process: [
      {
        step: "01",
        title: { ar: "تدقيق العمليات واستكشاف فرص الأتمتة", en: "Workflow Audit & Opportunity Mapping" },
        desc: {
          ar: "تحديد العمليات الروتينية التي تستهلك الوقت الأكبر وتعيق سرعة الإنجاز.",
          en: "Identifying high-drag operational bottlenecks with maximum automation ROI potential.",
        },
      },
      {
        step: "02",
        title: { ar: "اختيار وتدريب النماذج والحلول", en: "Model Selection & Architecture" },
        desc: {
          ar: "انتقاء النماذج المناسبة (OpenAI, Anthropic, Open-Source) وضمان سرية البيانات.",
          en: "Selecting optimal model architectures with strict data sovereignty guardrails.",
        },
      },
      {
        step: "03",
        title: { ar: "الربط التقني والتكامل مع الأنظمة", en: "Pipeline Integration & Testing" },
        desc: {
          ar: "وصل حلول الذكاء الاصطناعي بقواعد البيانات وتطبيقات العمل الحالية.",
          en: "Wiring intelligent agents into operational databases and enterprise APIs.",
        },
      },
      {
        step: "04",
        title: { ar: "الرصد، المعايرة، والتحسين المستمر", en: "Monitoring & Continuous Fine-Tuning" },
        desc: {
          ar: "متابعة دقة المخرجات وضبط إعدادات النماذج لضمان جودة الأداء المستمر.",
          en: "Telemetry tracking tracking model hallucination rates, latency, and operational efficiency.",
        },
      },
    ],
    techStack: ["OpenAI API", "Python", "LangChain", "Vector Databases", "TypeScript", "n8n / Automations"],
    gallery: [
      {
        title: { ar: "محرك الذكاء الاصطناعي وشبكات المعالجة", en: "AI Neural Network & Automation Engine" },
        desc: { ar: "مخطط هيكلي لتدفق البيانات والأتمتة الذكية عبر العمليات المؤسسية.", en: "Architectural visualization of neural pipelines and automated decision flows." },
        image: "/images/services/ai-automation-solutions.svg",
        tag: { ar: "ذكاء اصطناعي", en: "Artificial Intelligence" },
      },
      {
        title: { ar: "معمارية المنظومة وسرعة المعالجة", en: "Computational Pipelines & Cloud Speed" },
        desc: { ar: "معالجة بيانات فورية تدعم اتخاذ القرارات التنبؤية بكفاءة متناهية.", en: "Real-time inference and data transformation pipelines delivering high-throughput results." },
        image: "/images/services/software-systems-development.svg",
        tag: { ar: "أتمتة العمليات", en: "Automation" },
      },
      {
        title: { ar: "لوحة التحكم التفاعلية للأنظمة الذكية", en: "Agent Cockpit & Telemetry" },
        desc: { ar: "واجهة إدارية لمراقبة أداء المساعدات والمهام المؤتمتة بدقة.", en: "Administrative cockpit monitoring autonomous bot interactions and token consumption." },
        image: "/images/services/web-applications-development.svg",
        tag: { ar: "رصد الوكلاء", en: "Agent Monitoring" },
      },
    ],
  },
  {
    slug: "graphic-design",
    number: "05",
    title: {
      ar: "التصميم الجرافيكي",
      en: "Graphic Design",
    },
    tagline: {
      ar: "صياغة هويات بصرية استثنائية وأصول تسويقية راقية تترك انطباعاً دائماً",
      en: "Crafting bespoke visual identities, marketing collateral, and timeless graphic systems",
    },
    shortDescription: {
      ar: "نبتكر تصاميم جرافيكية متكاملة تشمل الهويات البصرية، وشعارات العلامات، والأدلة الإرشادية، وتصاميم الحملات الرقمية بأسلوب راقٍ ومدروس هندسياً.",
      en: "We conceptualize and execute comprehensive graphic design systems, from sacred brand emblems and guidelines to high-impact campaign assets with editorial precision.",
    },
    overview: {
      ar: "التصميم الجرافيكي هو لغة التخاطب الصامتة التي تعبر عن جودة ومكانة علامتك قبل أن يقرأ العميل كلمة واحدة. في MULTI CREATIVES، نتعامل مع التصميم الجرافيكي كفن هندسي يجمع بين الفخامة والوضوح. نطور هويات متكاملة تشمل الرموز، والخطوط، والأنماط البصرية، وتصاميم منصات التواصل، بما يضمن وحدة الشخصية البصرية عبر كافة القنوات.",
      en: "Graphic design is the silent dialect that communicates institutional stature before a single word is read. At MULTI CREATIVES, we approach graphic systems with mathematical restraint and luxury sensibility. From foundational brand marks and stationery to grand architectural signage, our visual output embodies quiet elegance and commanding distinction.",
    },
    keyMetrics: [
      { value: "100%", label: { ar: "أصالة وتفرد التصميم", en: "Originality & Bespoke Craft" } },
      { value: "Vector", label: { ar: "ملفات متجهة غير قابلة للتلف", en: "Lossless Vector Formats" } },
      { value: "360°", label: { ar: "شمولية المنظومة البصرية", en: "Ecosystem Consistency" } },
    ],
    deliverables: [
      {
        title: { ar: "تصميم الشعار والرموز المؤسسية", en: "Brand Marks & Sacred Emblems" },
        desc: {
          ar: "ابتكار رمز هندسي خالد متوافق مع النِسَب البصرية الذهبية.",
          en: "Developing enduring symbols grounded in balanced geometric ratios.",
        },
      },
      {
        title: { ar: "دليل الهوية البصرية المتكامل (Brand Manual)", en: "Comprehensive Brand Guidelines" },
        desc: {
          ar: "كتيب إرشادي يحدد بدقة قواعد استخدام الألوان، والخطوط، والمساحات الآمنة.",
          en: "Detailed design bible codifying color palettes, typography rules, and spatial clearances.",
        },
      },
      {
        title: { ar: "القرطاسية والمطبوعات الإدارية الفاخرة", en: "Corporate Stationery & Collateral" },
        desc: {
          ar: "أوراق المراسلات، وبطاقات الأعمال، والمجلدات بتصاميم تعكس الاحترافية.",
          en: "Executive business cards, letterheads, and presentation folders designed for impact.",
        },
      },
      {
        title: { ar: "أصول الحملات الرقمية وشبكات التواصل", en: "Digital Campaign & Social Kits" },
        desc: {
          ar: "قوالب وتصاميم إعلانية مصممة للمنصات الرقمية لضمان تماسك النبرة البصرية.",
          en: "Curated social media design systems and digital campaign collateral.",
        },
      },
    ],
    process: [
      {
        step: "01",
        title: { ar: "البحث والاستكشاف البصري", en: "Discovery & Visual Archetypes" },
        desc: {
          ar: "دراسة نبرة العلامة، وتحليل المنافسين، وصياغة لوحات الإلهام (Moodboards).",
          en: "Analyzing brand values, sector landscape, and compiling curated aesthetic moodboards.",
        },
      },
      {
        step: "02",
        title: { ar: "الرسم الأولي والتوليد الهندسي", en: "Sketching & Geometric Synthesis" },
        desc: {
          ar: "استكشاف مسارات بصرية متعددة تركز على البساطة والجمال الهندسي الخالص.",
          en: "Iterative exploration of form, symmetry, and symbolic depth.",
        },
      },
      {
        step: "03",
        title: { ar: "التطوير والتطبيق على البيئات", en: "Refinement & Environmental Mockups" },
        desc: {
          ar: "معاينة التصاميم على تطبيقات واقعية من مطبوعات وشاشات ولافتات.",
          en: "Testing visual marks across real-world physical and digital touchpoints.",
        },
      },
      {
        step: "04",
        title: { ar: "التسليم بكافة الصيغ الاحترافية", en: "Asset Delivery & Governance" },
        desc: {
          ar: "توفير كافة الملفات المصدرية المتجهية (AI, EPS, SVG, PDF) بدقة فائقة.",
          en: "Packaging production-ready vector assets and usage guidelines for seamless deployment.",
        },
      },
    ],
    techStack: ["Adobe Illustrator", "Photoshop", "InDesign", "Figma", "Pantone Standards"],
    gallery: [
      {
        title: { ar: "دليل الهوية البصرية والمعمارية", en: "Brand Architecture & Identity Manual" },
        desc: { ar: "كتيب مفصل لقواعد وتطبيقات الهوية البصرية والمساحات الهندسية.", en: "Comprehensive brand guidelines with geometric grids and typography specimens." },
        image: "/images/services/graphic-design.svg",
        tag: { ar: "تصميم جرافيكي", en: "Graphic Design" },
      },
      {
        title: { ar: "القرطاسية والمطبوعات المؤسسية", en: "Executive Collateral Ecosystem" },
        desc: { ar: "بطاقات أعمال ونماذج مراسلات راقية تعكس هيبة العلامة.", en: "Luxury stationery applications with foil debossing and premium paper stocks." },
        image: "/images/services/printing-services.svg",
        tag: { ar: "قرطاسية مؤسسية", en: "Corporate Stationery" },
      },
      {
        title: { ar: "الهدايا والمخرجات الترويجية", en: "Branded Promotional Artifacts" },
        desc: { ar: "تطبيقات الهوية على الهدايا الفاخرة والمنتجات الدعائية الخاصة.", en: "Brand identity applications on bespoke merchandise and promotional artifacts." },
        image: "/images/services/promotional-gifts.svg",
        tag: { ar: "تطبيقات العلامة", en: "Applications" },
      },
    ],
  },
  {
    slug: "printing-services",
    number: "06",
    title: {
      ar: "خدمات الطباعة",
      en: "Printing Services",
    },
    tagline: {
      ar: "طباعة فاخرة، تقنيات تذهيب ونحت ورقي دقيق، ومطبوعات تجارية متطورة",
      en: "High-precision luxury print, artisanal foil finishes, and premium corporate collateral",
    },
    shortDescription: {
      ar: "نقدم خدمات طباعة فاخرة وتجارية بمعايير عالمية، تشمل الكتيبات المؤسسية، والتقارير السنوية، والعلب الفاخرة، مع تقنيات تشطيب تشمل التذهيب الحراري، والنحت، والورنيش الموضعي.",
      en: "We deliver master-grade luxury and commercial printing services, specializing in corporate lookbooks, bespoke rigid packaging, blind debossing, and foil finishes with microscopic precision.",
    },
    overview: {
      ar: "تمنح المطبوعات الفاخرة علامتك حضوراً حسياً ملموساً لا يمكن للعالم الرقمي محاكاته. نحن نتشارك مع أرقى المطابع وخبراء الورق في المنطقة لنوفر لعملائنا خامات ورقية أوروبية نادرة، وتقنيات طباعة متطورة مثل الحفر الحراري (Foil Stamping)، والنحت الغائر والبارز (Emboss/Deboss)، والطباعة الحريرية (Silkscreen). نضمن تسليم منتجات طباعية تفوق التوقعات.",
      en: "Tactile print craftsmanship creates an immediate sensory connection with discerning clients. We collaborate with master printers and heritage paper mills to provide rare European paper stocks, multi-ply duplexing, metallic foil debossing, and precision die-cutting. Every production job is supervised to ensure zero tolerance and immaculate registration.",
    },
    keyMetrics: [
      { value: "0.1mm", label: { ar: "دقة التفاوت الطباعي الميكانيكي", en: "Mechanical Registration Precision" } },
      { value: "FSC®", label: { ar: "خامات ورقية فاخرة ومعتمدة", en: "Certified Heritage Paper Stocks" } },
      { value: "Bespoke", label: { ar: "تشطيبات وتذهيب مخصص", en: "Custom Foil & Deboss Tooling" } },
    ],
    deliverables: [
      {
        title: { ar: "كتيبات التعريف بالشركات والتقارير السنوية", en: "Corporate Lookbooks & Annual Reports" },
        desc: {
          ar: "إخراج وتجليد فاخر بخياطة يابانية أو سويسرية وحواف ملونة يدوياً.",
          en: "Executive editorial monographs featuring bespoke bindings and gilded edges.",
        },
      },
      {
        title: { ar: "صناديق وعلب التغليف الفاخرة", en: "Custom Rigid Box Packaging" },
        desc: {
          ar: "صناديق هدايا ومنتجات سميكة ذات إغلاق مغناطيسي وتشطيبات ذهبية.",
          en: "Artisanal rigid gift packaging with concealed magnetic closures and foil stamping.",
        },
      },
      {
        title: { ar: "بطاقات الأعمال التنفيذية الفاخرة", en: "Multi-Ply Executive Business Cards" },
        desc: {
          ar: "بطاقات متعددة الطبقات بأوزان تصل إلى 700 جم مع حفر بارز وتذهيب الأطراف.",
          en: "Heavyweight multi-ply business cards with painted edges and blind debossing.",
        },
      },
      {
        title: { ar: "المطبوعات التسويقية والبروشورات المتقنة", en: "Marketing Collateral & Brochures" },
        desc: {
          ar: "بروشورات ذات طيات مبتكرة وخامات ورقية محببة تأسر حواس العميل.",
          en: "Textured brochures and marketing collateral calibrated for luxury presentations.",
        },
      },
    ],
    process: [
      {
        step: "01",
        title: { ar: "اختيار المواد وتجهيز القوالب", en: "Material Selection & Dieline Engineering" },
        desc: {
          ar: "انتقاء أوزان الورق، وأقمشة التجليد، ورسم قوالب القطع بدقة مليمترية.",
          en: "Selecting paper grammages, tactile cloth bindings, and drawing structural dielines.",
        },
      },
      {
        step: "02",
        title: { ar: "النماذج البيضاء التجريبية (Dummies)", en: "Physical White-Dummy Sampling" },
        desc: {
          ar: "تصنيع نموذج مجسم لاختبار المتانة، والطي، وتجربة فتح العبوة.",
          en: "Fabricating unprinted physical samples to stress-test rigidity, hinges, and ergonomics.",
        },
      },
      {
        step: "03",
        title: { ar: "الطباعة وتطبيق التشطيبات الخاصة", en: "Printing & Specialty Finish Execution" },
        desc: {
          ar: "تنفيذ عمليات الطباعة مع تطبيق التذهيب والنحت والورنيش الموضعي.",
          en: "High-precision press run applying metallic foils, blind embossing, and spot UV layers.",
        },
      },
      {
        step: "04",
        title: { ar: "الفحص المجهري، التغليف، والتسليم", en: "Quality Inspection & Secure Logistics" },
        desc: {
          ar: "مراقبة جودة كل قطعة على حدة وتغليفها بعناية لضمان وصولها بحالة مثالية.",
          en: "Rigorous unit-by-unit QA inspection and protective white-glove packaging for delivery.",
        },
      },
    ],
    techStack: ["Heidelberg Offset", "Hot Foil Stamping", "Blind Embossing", "Laser Die-Cutting", "Pantone Formula"],
    gallery: [
      {
        title: { ar: "صناديق المنتجات الفاخرة والتذهيب الحراري", en: "Luxury Rigid Packaging & Hot Stamping" },
        desc: { ar: "تصميم وتنفيذ علب صلبة مع أشرطة تذهيب ممتدة وختم حراري غائر.", en: "Custom rigid box packaging with gold foil band and debossed emblem." },
        image: "/images/services/printing-services.svg",
        tag: { ar: "خدمات الطباعة", en: "Printing" },
      },
      {
        title: { ar: "المطبوعات التحريرية والكتيبات الاستثمارية", en: "Editorial Lookbooks & Bound Reports" },
        desc: { ar: "كتيبات فاخرة مطبوعة على ورق إيطالي ذي ملمس مخملي راقٍ.", en: "Monographs printed on European velvet-touch uncoated papers." },
        image: "/images/services/graphic-design.svg",
        tag: { ar: "مطبوعات تحريرية", en: "Editorial Print" },
      },
      {
        title: { ar: "الهدايا الدعائية وتطبيقات الطباعة الخاصة", en: "Specialty Print on Branded Gifts" },
        desc: { ar: "طباعة حريرية وحفر ليزري على الأسطح الخشبية والمعدنية الفاخرة.", en: "Silkscreen and laser engraving on premium metallic and wooden gift sets." },
        image: "/images/services/promotional-gifts.svg",
        tag: { ar: "طباعة خاصة", en: "Specialty Print" },
      },
    ],
  },
  {
    slug: "promotional-gifts",
    number: "07",
    title: {
      ar: "الهدايا الدعائية",
      en: "Promotional Gifts",
    },
    tagline: {
      ar: "هدايا ترويجية وتنفيذية فاخرة تصنع تقديراً متبادلاً وتخلد ذكرى علامتك",
      en: "Bespoke executive gifts and luxury promotional artifacts engineered to delight VIP recipients",
    },
    shortDescription: {
      ar: "نبتكر ونوفر مجموعات هدايا دعائية وتنفيذية مخصصة، مصممة بأعلى معايير الذوق والأناقة، لتكون سفيراً راقياً لعلامتك التجارية في المناسبات والمؤتمرات الكبرى.",
      en: "We curate, design, and produce high-end promotional gift ecosystems and executive VIP boxes tailored to cultivate enduring relationships at major summits and corporate milestones.",
    },
    overview: {
      ar: "الهدايا الدعائية ليست مجرد أدوات ترويجية عادية؛ إنها تجسيد مادي لتقديرك لشركائك وعملائك النخبة. في MULTI CREATIVES، نبتعد تماماً عن الهدايا التقليدية منخفضة الجودة، ونقدم مجموعات حصرية تشمل الأدوات الجلدية الفاخرة، والإكسسوارات التقنية الراقية، والأقلام والمفكرات المصممة خصيصاً، وكلها موضوعة داخل علب وتغليفات مصممة كتحف فنية.",
      en: "Promotional gifts are tangible expressions of your organization's esteem for key partners and distinguished clientele. At MULTI CREATIVES, we reject low-tier novelty merchandise. We curate bespoke gift suites crafted from fine leathers, aerospace metals, custom leather journals, and smart tech accessories, presented in couture packaging that commands reverence.",
    },
    keyMetrics: [
      { value: "VIP Tier", label: { ar: "جودة مخصصة للشخصيات المهمة", en: "Executive Presentation" } },
      { value: "100%", label: { ar: "تخصيص تام بالهوية المؤسسية", en: "Bespoke Customization" } },
      { value: "Turnkey", label: { ar: "حلول متكاملة من التصميم للتسليم", en: "Full Turnkey Logistics" } },
    ],
    deliverables: [
      {
        title: { ar: "صناديق الهدايا التنفيذية (VIP Gift Boxes)", en: "VIP Executive Gift Boxes" },
        desc: {
          ar: "مجموعات هدايا حصرية مخصصة للرؤساء التنفيذيين والضيوف رفيعي المستوى.",
          en: "Curated gift suites presented in bespoke magnetic boxes tailored for C-suite leaders.",
        },
      },
      {
        title: { ar: "الإكسسوارات والأجهزة التقنية الفاخرة", en: "Smart Luxury Tech Accessories" },
        desc: {
          ar: "شواحن لاسلكية، وبنوك طاقة، وسماعات مصنعة من مواد طبيعية محفورة بالليزر.",
          en: "Laser-engraved wireless chargers, metallic power banks, and audio gear.",
        },
      },
      {
        title: { ar: "الجلديات والأدوات المكتبية الحصرية", en: "Artisanal Leather Goods & Desk Sets" },
        desc: {
          ar: "محافظ، وحوامل بطاقات، ومفكرات جلدية طبيعية موسومة بختم العلامة الغائر.",
          en: "Full-grain leather passport holders, cardholders, and embossed executive journals.",
        },
      },
      {
        title: { ar: "هدايا المؤتمرات والمحافل الرسمية", en: "Summit & Corporate Event Kits" },
        desc: {
          ar: "حقائب ترحيبية وأدوات متكاملة مصممة خصيصاً للمؤتمرات والفعاليات الكبرى.",
          en: "Comprehensive welcome kits and delegates collateral crafted for landmark summits.",
        },
      },
    ],
    process: [
      {
        step: "01",
        title: { ar: "تحديد الفئة المستهدفة والمناسبة", en: "Audience Profiling & Curation" },
        desc: {
          ar: "دراسة نوعية الضيوف، وطبيعة الفعالية، وميزانية الإهداء لاختيار الأنسب.",
          en: "Evaluating recipient demographics, event significance, and budget parameters.",
        },
      },
      {
        step: "02",
        title: { ar: "تصميم العينات وتخصيص الهوية", en: "Sample Prototyping & Custom Branding" },
        desc: {
          ar: "تطبيق الشعار والرمز بتقنيات الحفر بالليزر أو الختم الحراري على العينات.",
          en: "Applying precise laser engraving, UV printing, or hot-stamp debossing on samples.",
        },
      },
      {
        step: "03",
        title: { ar: "التصنيع وتجميع الصناديق", en: "Manufacturing & Box Assembly" },
        desc: {
          ar: "إنتاج الكميات المطلوبة مع التجميع اليدوي الدقيق للأجزاء والبطانات الحريرية.",
          en: "Precision production run with handcrafted interior lining and structural inserts.",
        },
      },
      {
        step: "04",
        title: { ar: "التغليف النهائي والتسليم اللوجستي", en: "Luxury Packaging & Direct Handover" },
        desc: {
          ar: "إغلاق كل هدية بعناية مع أشرطة وبطاقات إهداء مخصصة وشحنها في الموعد المحدد.",
          en: "Sealing gift boxes with bespoke ribbons, personalized cards, and direct event delivery.",
        },
      },
    ],
    techStack: ["Laser Engraving", "Hot Foil Debossing", "UV Flatbed Printing", "Custom Foam Cutters", "Textile Embroidery"],
    gallery: [
      {
        title: { ar: "مجموعة الهدايا التنفيذية الفاخرة", en: "VIP Executive Gift Suite" },
        desc: { ar: "صندوق إهداء راقٍ يجمع بين التقنية والجلديات والختم الذهبي.", en: "Couture gift suite combining smart technology, fine leathers, and gold foil." },
        image: "/images/services/promotional-gifts.svg",
        tag: { ar: "هدايا دعائية", en: "Promotional Gifts" },
      },
      {
        title: { ar: "علب التغليف والطباعة الخاصة بالهدايا", en: "Custom Presentation Packaging" },
        desc: { ar: "صناديق صلبة مخصصة ذات بطانات مخملية لحماية وتثبيت محتويات الإهداء.", en: "Rigid magnetic presentation packaging with precision-cut velvet inserts." },
        image: "/images/services/printing-services.svg",
        tag: { ar: "تغليف هدايا", en: "Gift Packaging" },
      },
      {
        title: { ar: "الأصول البصرية وتطبيقات الهوية", en: "Branded Material Artifacts" },
        desc: { ar: "تطبيق هوية العلامة التجارية على كافة منتجات ومستلزمات الإهداء الفاخرة.", en: "Cohesive brand identity expressions across high-value luxury merchandise." },
        image: "/images/services/graphic-design.svg",
        tag: { ar: "أصول العلامة", en: "Brand Artifacts" },
      },
    ],
  },
];
