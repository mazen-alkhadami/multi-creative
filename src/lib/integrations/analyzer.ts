/**
 * MULTI CREATIVES — AI & Static Code Analyzer Engine
 * Analyzes third-party tracking scripts, tags, pixels, and meta tags.
 * Operates in a hybrid mode: utilizes GEMINI_API_KEY if present, with a deterministic
 * Rule-Based Static Analyzer fallback that detects patterns, security flags, and conflicts.
 */

export type IntegrationCodeType =
  | "ga4"
  | "gtm"
  | "google_ads"
  | "search_console"
  | "meta_pixel"
  | "tiktok_pixel"
  | "snapchat_pixel"
  | "schema"
  | "meta_tag"
  | "custom_html"
  | "custom_js";

export type PlacementType = "head" | "body_start" | "body_end";

export interface ExistingIntegrationSummary {
  id: string;
  name: string;
  provider: string;
  code_type: string;
  code_content: string;
  placement: string;
  is_active: boolean;
}

export interface SecurityAnalysis {
  level: "safe" | "warning" | "danger";
  flags: string[];
  description: {
    ar: string;
    en: string;
  };
}

export interface ConflictAnalysis {
  is_duplicate: boolean;
  has_conflicts: boolean;
  conflicting_items: Array<{
    id: string;
    name: string;
    reason_ar: string;
    reason_en: string;
  }>;
}

export interface CodeAnalysisReport {
  code_type: IntegrationCodeType;
  provider: string;
  purpose: {
    ar: string;
    en: string;
  };
  recommended_placement: PlacementType;
  recommended_pages: string[];
  conflicts: ConflictAnalysis;
  security_risks: SecurityAnalysis;
  needs_cookie_consent: boolean;
  can_run_dynamically: {
    can_run: boolean;
    requires_rebuild: boolean;
    notes: {
      ar: string;
      en: string;
    };
  };
  detected_identifiers: string[];
}

/**
 * Extracts key tracking IDs from code content (e.g. G-XXXX, GTM-XXXX, AW-XXXX, Pixel IDs).
 */
function extractIdentifiers(code: string): string[] {
  const ids: string[] = [];

  // GA4 Measurement ID: G-XXXXXXXXXX
  const ga4Matches = code.match(/G-[A-Z0-9]{4,15}/gi);
  if (ga4Matches) ids.push(...ga4Matches);

  // GTM Container ID: GTM-XXXXXXX
  const gtmMatches = code.match(/GTM-[A-Z0-9]{4,15}/gi);
  if (gtmMatches) ids.push(...gtmMatches);

  // Google Ads ID: AW-XXXXXXXXX
  const gadsMatches = code.match(/AW-[0-9]{5,15}/gi);
  if (gadsMatches) ids.push(...gadsMatches);

  // Google Site Verification token
  const gsvMatch = code.match(/google-site-verification["']?\s+content=["']?([^"'>]+)/i);
  if (gsvMatch && gsvMatch[1]) ids.push(`verify:${gsvMatch[1].slice(0, 16)}...`);

  // Meta Pixel ID: fbq('init', 'XXXXXXXXXXXXXXX')
  const metaMatches = code.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"]([0-9]{8,20})['"]/gi);
  if (metaMatches) {
    metaMatches.forEach((m) => {
      const id = m.replace(/[^0-9]/g, "");
      if (id) ids.push(`Meta:${id}`);
    });
  }

  // TikTok Pixel ID: ttq.load('XXXXXXXXXXXXXXX')
  const ttMatches = code.match(/ttq\.load\s*\(\s*['"]([A-Z0-9]{8,25})['"]/gi);
  if (ttMatches) {
    ttMatches.forEach((m) => {
      const match = m.match(/['"]([A-Z0-9]{8,25})['"]/i);
      if (match && match[1]) ids.push(`TikTok:${match[1]}`);
    });
  }

  // Snapchat Pixel ID: snaptr('init', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
  const snapMatches = code.match(/snaptr\s*\(\s*['"]init['"]\s*,\s*['"]([a-f0-9-]{16,40})['"]/gi);
  if (snapMatches) {
    snapMatches.forEach((m) => {
      const match = m.match(/['"]([a-f0-9-]{16,40})['"]/i);
      if (match && match[1]) ids.push(`Snap:${match[1]}`);
    });
  }

  return Array.from(new Set(ids));
}

/**
 * Inspects security risks inside user-supplied code.
 */
function analyzeSecurity(code: string): SecurityAnalysis {
  const flags: string[] = [];
  let level: "safe" | "warning" | "danger" = "safe";

  // Check for dangerous execution primitives
  if (/\beval\s*\(/i.test(code)) {
    flags.push("eval() primitive detected (High Risk of Arbitrary Code Execution)");
    level = "danger";
  }
  if (/document\.write\s*\(/i.test(code)) {
    flags.push("document.write() detected (Can break rendering and DOM hierarchy)");
    level = "danger";
  }
  if (/new\s+Function\s*\(/i.test(code)) {
    flags.push("Dynamic Function constructor detected (Unsafe Code Generation)");
    level = "danger";
  }
  if (/window\.execScript/i.test(code)) {
    flags.push("execScript invocation detected");
    level = "danger";
  }

  // Check for unencrypted HTTP references
  if (/http:\/\/[a-z0-9]/i.test(code) && !/http:\/\/www\.w3\.org/i.test(code) && !/http:\/\/schema\.org/i.test(code)) {
    flags.push("Insecure HTTP protocol used (May trigger Mixed Content security alerts)");
    if (level !== "danger") level = "warning";
  }

  // Check for potential private secret leaks
  if (/sk_live_[0-9a-zA-Z]{16,}/.test(code) || /-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----/.test(code)) {
    flags.push("Potential Secret Key or Private Key detected inside client-side code");
    level = "danger";
  }

  // Obfuscated code detection (heavy base64 / hex blobs)
  if (/(?:atob|fromCharCode|String\.fromCharCode)\s*\(/i.test(code)) {
    flags.push("String obfuscation / decoding primitives detected");
    if (level !== "danger") level = "warning";
  }

  // Safe classification description
  let descAr = "الكود آمن وخالٍ من دوال التنفيذ العشوائي أو الثغرات الأمنية المعروفة.";
  let descEn = "Code is safe and free from arbitrary execution sinks or known vulnerabilities.";

  if (level === "danger") {
    descAr = "تحذير أمني شديد: يحتوي الكود على دوال خطيرة مثل eval أو أسرار غير مشفرة قد تعرض الموقع للخطر.";
    descEn = "Critical Security Alert: Code contains hazardous primitives (e.g. eval, document.write) or exposed credentials.";
  } else if (level === "warning") {
    descAr = "تنبيه أمني متوسط: يحتوي الكود على استدعاءات غير مشفرة (HTTP) أو نصوص مشوشة قد تسبب تنبيهات أمان في المتصفح.";
    descEn = "Moderate Warning: Code contains insecure HTTP references or obfuscation sinks.";
  }

  return {
    level,
    flags,
    description: { ar: descAr, en: descEn },
  };
}

/**
 * Checks for duplicate tracking codes or conflicts against already configured integrations.
 */
function analyzeConflicts(
  code: string,
  detectedIds: string[],
  codeType: IntegrationCodeType,
  existingList: ExistingIntegrationSummary[]
): ConflictAnalysis {
  const conflictingItems: Array<{
    id: string;
    name: string;
    reason_ar: string;
    reason_en: string;
  }> = [];

  let isDuplicate = false;
  const cleanIncoming = code.replace(/\s+/g, "").trim();

  for (const item of existingList) {
    const cleanExisting = item.code_content.replace(/\s+/g, "").trim();

    // 1. Exact code duplicate
    if (cleanIncoming === cleanExisting) {
      isDuplicate = true;
      conflictingItems.push({
        id: item.id,
        name: item.name,
        reason_ar: `تطابق تام (Duplicate) مع التكامل الحالي "${item.name}".`,
        reason_en: `Exact content duplicate of existing integration "${item.name}".`,
      });
      continue;
    }

    // 2. Shared Tracking ID check (e.g. same G- or GTM-)
    const existingIds = extractIdentifiers(item.code_content);
    const sharedIds = detectedIds.filter((id) => existingIds.includes(id));
    if (sharedIds.length > 0) {
      isDuplicate = true;
      conflictingItems.push({
        id: item.id,
        name: item.name,
        reason_ar: `يشترك في نفس معرّف التتبع (${sharedIds.join(", ")}) مع "${item.name}". تركيب المعرف مرتين يسبب احتساب الزيارات مرتين.`,
        reason_en: `Shares the exact tracking ID (${sharedIds.join(", ")}) with "${item.name}". Duplicate injection will double-count metrics.`,
      });
      continue;
    }

    // 3. Competing Tag Managers check
    if (codeType === "gtm" && item.code_type === "gtm") {
      conflictingItems.push({
        id: item.id,
        name: item.name,
        reason_ar: `يوجد بالفعل حاوية GTM أخرى مفعّلة ("${item.name}"). يُنصح عادة بحاوية واحدة لمنع التعارض.`,
        reason_en: `Another GTM container ("${item.name}") is already active. A single container is recommended.`,
      });
    }
  }

  return {
    is_duplicate: isDuplicate,
    has_conflicts: conflictingItems.length > 0,
    conflicting_items: conflictingItems,
  };
}

/**
 * High-precision rule-based classifier.
 */
function classifyCode(code: string): {
  code_type: IntegrationCodeType;
  provider: string;
  purpose: { ar: string; en: string };
  recommended_placement: PlacementType;
  recommended_pages: string[];
  needs_cookie_consent: boolean;
  can_run_dynamically: {
    can_run: boolean;
    requires_rebuild: boolean;
    notes: { ar: string; en: string };
  };
} {
  const lower = code.toLowerCase();

  // 1. Google Tag Manager (GTM)
  if (lower.includes("googletagmanager.com/gtm.js") || /GTM-[A-Z0-9]+/i.test(code)) {
    return {
      code_type: "gtm",
      provider: "Google Tag Manager",
      purpose: {
        ar: "إدارة وإطلاق وسوم التسويق والتحليلات مركزياً دون الحاجة لتعديل كود الموقع البرمجي.",
        en: "Centralized tag management for deploying analytics and marketing tags without code changes.",
      },
      recommended_placement: "head",
      recommended_pages: ["*"],
      needs_cookie_consent: true,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "يعمل ديناميكياً وفورياً على جميع الصفحات بمجرد التفعيل.",
          en: "Runs dynamically across all pages upon activation without rebuilding.",
        },
      },
    };
  }

  // 2. Google Analytics 4 (GA4)
  if (lower.includes("googletagmanager.com/gtag/js") || /G-[A-Z0-9]+/i.test(code)) {
    return {
      code_type: "ga4",
      provider: "Google Analytics 4",
      purpose: {
        ar: "تتبع حركة الزوار، مسارات التصفح، مصادر الزيارات، والأحداث وسلوك المستخدم في الموقع.",
        en: "Web traffic analytics, user acquisition channels, event tracking, and behavior reporting.",
      },
      recommended_placement: "head",
      recommended_pages: ["*"],
      needs_cookie_consent: true,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "يتم حقنه في الرأس (Head) ويعمل فورياً دون إعادة بناء.",
          en: "Injected in Head and executes immediately without rebuilding.",
        },
      },
    };
  }

  // 3. Google Ads Conversion Tracking
  if (/AW-[0-9]+/i.test(code) || lower.includes("googleadservices.com")) {
    return {
      code_type: "google_ads",
      provider: "Google Ads",
      purpose: {
        ar: "تتبع التحويلات وقياس عوائد الحملات الإعلانية المدفوعة على شبكة إعلانات Google.",
        en: "Conversion tracking and ROI measurement for Google Ads campaigns.",
      },
      recommended_placement: "head",
      recommended_pages: ["*"],
      needs_cookie_consent: true,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "يعمل ديناميكياً ويقيس التحويلات مباشرة.",
          en: "Executes dynamically and records conversions immediately.",
        },
      },
    };
  }

  // 4. Google Search Console Verification
  if (lower.includes("google-site-verification")) {
    return {
      code_type: "search_console",
      provider: "Google Search Console",
      purpose: {
        ar: "إثبات ملكية الموقع لمحركات بحث Google لتمكين أرشفة الروابط ومراقبة أداء البحث.",
        en: "Verifies site ownership with Google Search Console for indexing and search performance monitoring.",
      },
      recommended_placement: "head",
      recommended_pages: ["/"],
      needs_cookie_consent: false,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "وسم ساكن يوضع في الرأس للصفحة الرئيسية لإتمام التحقق.",
          en: "Static meta tag placed in the root head for domain verification.",
        },
      },
    };
  }

  // 5. Meta / Facebook Pixel
  if (lower.includes("connect.facebook.net") || lower.includes("fbevents.js") || /fbq\s*\(/i.test(code)) {
    return {
      code_type: "meta_pixel",
      provider: "Meta (Facebook / Instagram)",
      purpose: {
        ar: "قياس أداء إعلانات فيسبوك وإنستغرام وبناء الجماهير المخصصة وتتبع تحويلات العملاء.",
        en: "Tracking conversions from Facebook & Instagram ads and building retargeting audiences.",
      },
      recommended_placement: "head",
      recommended_pages: ["*"],
      needs_cookie_consent: true,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "يعمل فورياً مع أحداث PageView التلقائية.",
          en: "Runs immediately with standard PageView tracking.",
        },
      },
    };
  }

  // 6. TikTok Pixel
  if (lower.includes("analytics.tiktok.com") || lower.includes("ttq.load") || /ttq\s*\(/i.test(code)) {
    return {
      code_type: "tiktok_pixel",
      provider: "TikTok For Business",
      purpose: {
        ar: "تتبع الزوار والتحويلات القادمة من حملات تيك توك الإعلانية وتحسين الاستهداف.",
        en: "Tracking events and conversions driven by TikTok ad campaigns.",
      },
      recommended_placement: "head",
      recommended_pages: ["*"],
      needs_cookie_consent: true,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "يعمل ديناميكياً مع أحداث التتبع.",
          en: "Runs dynamically with client tracking events.",
        },
      },
    };
  }

  // 7. Snapchat Pixel
  if (lower.includes("sc-static.net") || lower.includes("snaptr") || /snaptr\s*\(/i.test(code)) {
    return {
      code_type: "snapchat_pixel",
      provider: "Snapchat Ads",
      purpose: {
        ar: "قياس أداء حملات سناب شات الإعلانية وتتبع سلوك الجمهور المستهدف.",
        en: "Measuring Snapchat ad campaign effectiveness and conversion tracking.",
      },
      recommended_placement: "head",
      recommended_pages: ["*"],
      needs_cookie_consent: true,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "يعمل ديناميكياً داخل الرأس.",
          en: "Executes dynamically in head.",
        },
      },
    };
  }

  // 8. JSON-LD Schema (Structured Data)
  if (lower.includes("application/ld+json") || lower.includes("schema.org")) {
    return {
      code_type: "schema",
      provider: "Schema.org (SEO Data)",
      purpose: {
        ar: "توفير بيانات هيكلية لمحركات البحث لتحسين ظهور الموقع في النتائج الغنية (Rich Snippets).",
        en: "Structured data schema to enhance search appearance with rich snippets and graph entities.",
      },
      recommended_placement: "head",
      recommended_pages: ["*"],
      needs_cookie_consent: false,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "بيانات وصفية ساكنة تُحقن في الرأس دون أي تأثير على الخصوصية أو الكوكيز.",
          en: "Static metadata schema injected in head with zero privacy impact.",
        },
      },
    };
  }

  // 9. Meta Tags
  if (/^<meta\s+/i.test(code.trim()) || (lower.includes("<meta") && !lower.includes("<script"))) {
    return {
      code_type: "meta_tag",
      provider: "SEO / Social Metadata",
      purpose: {
        ar: "وسوم تعريفية لمحركات البحث أو الشبكات الاجتماعية لتحديد هوية الصفحة أو إثبات الملكية.",
        en: "Metadata tags for SEO, social graph previews, or domain ownership verification.",
      },
      recommended_placement: "head",
      recommended_pages: ["*"],
      needs_cookie_consent: false,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "وسوم HTML ساكنة تُحقن مباشرة داخل وسم الرأس.",
          en: "Static HTML tags injected directly into the head container.",
        },
      },
    };
  }

  // 10. Custom JS vs Custom HTML
  const isPureScript = lower.includes("<script") || /function\s*\(|var\s+|const\s+|let\s+/i.test(code);

  if (isPureScript) {
    return {
      code_type: "custom_js",
      provider: "Custom JavaScript",
      purpose: {
        ar: "شيفرة برمجية مخصصة (سكربت تفاعلي، نافذة محادثة، أو أداة خارجية).",
        en: "Custom JavaScript code for interactive widgets, chat support, or external integrations.",
      },
      recommended_placement: "body_end",
      recommended_pages: ["*"],
      needs_cookie_consent: true,
      can_run_dynamically: {
        can_run: true,
        requires_rebuild: false,
        notes: {
          ar: "يُنصح بوضعه في نهاية الصفحة (Body End) لضمان عدم تأخير تحميل المحتوى الأساسي للموقع.",
          en: "Recommended in Body End to prevent render-blocking the main UI.",
        },
      },
    };
  }

  return {
    code_type: "custom_html",
    provider: "Custom HTML Markup",
    purpose: {
      ar: "عناصر HTML مخصصة للعرض في الموقع.",
      en: "Custom HTML markup or container element.",
    },
    recommended_placement: "body_end",
    recommended_pages: ["*"],
    needs_cookie_consent: false,
    can_run_dynamically: {
      can_run: true,
      requires_rebuild: false,
      notes: {
        ar: "يُحقن كعنصر HTML مباشر في الموقع.",
        en: "Injected directly as an HTML element.",
      },
    },
  };
}

/**
 * Optional Gemini AI augmentation if GEMINI_API_KEY is available in the environment.
 */
async function augmentWithGeminiIfAvailable(
  code: string,
  baseReport: CodeAnalysisReport
): Promise<CodeAnalysisReport> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return baseReport;
  }

  try {
    const prompt = `You are a web security and analytics analyst. Review this third-party code snippet:
\`\`\`html
${code.slice(0, 2000)}
\`\`\`
Return a JSON object with:
{
  "purpose_ar": "One concise sentence in Arabic explaining exact purpose",
  "purpose_en": "One concise sentence in English explaining exact purpose",
  "security_note_ar": "Security/privacy assessment in Arabic",
  "security_note_en": "Security/privacy assessment in English"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    if (!res.ok) {
      return baseReport;
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      return {
        ...baseReport,
        purpose: {
          ar: parsed.purpose_ar || baseReport.purpose.ar,
          en: parsed.purpose_en || baseReport.purpose.en,
        },
      };
    }
  } catch (err) {
    console.warn("[analyzer] Gemini AI augmentation skipped/failed, using static result:", err);
  }

  return baseReport;
}

/**
 * Main Analysis Entrypoint:
 * Takes code content and existing integrations, returning the complete 9-point report.
 */
export async function analyzeIntegrationCode(
  code: string,
  existingIntegrations: ExistingIntegrationSummary[] = []
): Promise<CodeAnalysisReport> {
  const trimmed = code.trim();
  const detectedIds = extractIdentifiers(trimmed);
  const security = analyzeSecurity(trimmed);
  const classification = classifyCode(trimmed);
  const conflicts = analyzeConflicts(trimmed, detectedIds, classification.code_type, existingListToSummary(existingIntegrations));

  const baseReport: CodeAnalysisReport = {
    code_type: classification.code_type,
    provider: classification.provider,
    purpose: classification.purpose,
    recommended_placement: classification.recommended_placement,
    recommended_pages: classification.recommended_pages,
    conflicts: conflicts,
    security_risks: security,
    needs_cookie_consent: classification.needs_cookie_consent,
    can_run_dynamically: classification.can_run_dynamically,
    detected_identifiers: detectedIds,
  };

  return await augmentWithGeminiIfAvailable(trimmed, baseReport);
}

function existingListToSummary(list: ExistingIntegrationSummary[]): ExistingIntegrationSummary[] {
  return list.map((item) => ({
    id: item.id,
    name: item.name,
    provider: item.provider,
    code_type: item.code_type,
    code_content: item.code_content,
    placement: item.placement,
    is_active: item.is_active,
  }));
}
