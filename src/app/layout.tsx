import type { Metadata } from "next";
import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClientLayoutShell } from "@/components/layout";
import { DynamicIntegrations } from "@/components/integrations/DynamicIntegrations";
import { CONTACT_CONFIG } from "@/data/contactConfig";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-english",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "MULTI CREATIVES — الإبداع والحلول الرقمية المتكاملة",
    template: "%s | MULTI CREATIVES",
  },
  description:
    "حلول متكاملة في التصميم والإعلان، تطوير المواقع وتطبيقات الويب، الأنظمة والبرمجيات، الذكاء الاصطناعي، والطباعة والهدايا الدعائية.",
  keywords: [
    "MULTI CREATIVES",
    "ملتي كريتيفز",
    "تصميم مواقع",
    "تطوير مواقع",
    "تطبيقات ويب",
    "برمجيات وأنظمة",
    "ذكاء اصطناعي وأتمتة",
    "تصميم جرافيكي",
    "هويات بصرية",
    "خدمات طباعة",
    "هدايا دعائية",
  ],
  authors: [{ name: "MULTI CREATIVES" }],
  creator: "MULTI CREATIVES",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://multicreatives.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MULTI CREATIVES — الإبداع والحلول الرقمية المتكاملة",
    description:
      "نقدم حلولاً متكاملة في التصميم والإعلان، تطوير المواقع والتطبيقات، الأنظمة والبرمجيات، الذكاء الاصطناعي، وخدمات الطباعة والهدايا.",
    url: "/",
    siteName: "MULTI CREATIVES",
    images: [
      {
        url: "/images/logo-original.png",
        width: 632,
        height: 392,
        alt: "MULTI CREATIVES Logo",
      },
    ],
    locale: "ar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MULTI CREATIVES — الإبداع والحلول الرقمية المتكاملة",
    description:
      "خدمات متخصصة في التصميم والإعلان، تطوير المواقع والتطبيقات، والبرمجيات والطباعة والهدايا الدعائية.",
    images: ["/images/logo-original.png"],
  },
  icons: {
    icon: [
      { url: "/images/logo-gold.png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://multicreatives.com";

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "MULTI CREATIVES",
      alternateName: "ملتي كريتيفز",
      url: siteUrl,
      logo: `${siteUrl}/images/logo-original.png`,
      description:
        "Creative and digital services delivering responsive websites, custom web applications, software systems, visual identity design, printing, and promotional gifts.",
      telephone: CONTACT_CONFIG.phone.international,
      email: CONTACT_CONFIG.email,
      areaServed: ["Saudi Arabia", "Yemen"],
      knowsAbout: [
        "Website Design & Development",
        "Web Applications Development",
        "Software & Systems Development",
        "AI & Automation Solutions",
        "Graphic Design",
        "Printing Services",
        "Promotional Gifts",
      ],
      sameAs: [
        CONTACT_CONFIG.socials.instagram.url,
        CONTACT_CONFIG.socials.linkedin.url,
        CONTACT_CONFIG.socials.github.url,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "MULTI CREATIVES",
      publisher: {
        "@id": `${siteUrl}/#service`,
      },
      inLanguage: ["ar", "en"],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${plusJakartaSans.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#111111" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdData),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('mc_theme');
                  var theme = savedTheme === 'light' ? 'light' : 'dark';
                  document.documentElement.classList.add(theme);
                  document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);

                  var savedLang = localStorage.getItem('mc_lang');
                  var lang = savedLang === 'en' ? 'en' : 'ar';
                  document.documentElement.setAttribute('lang', lang);
                  document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
                } catch(e) {}
              })();
            `,
          }}
        />
        <DynamicIntegrations placement="head" />
      </head>
      <body className="antialiased min-h-screen">
        <DynamicIntegrations placement="body_start" />
        <ClientLayoutShell>{children}</ClientLayoutShell>
        <DynamicIntegrations placement="body_end" />
      </body>
    </html>
  );
}
