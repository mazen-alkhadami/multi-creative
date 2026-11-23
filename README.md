# MULTI CREATIVES — Creative & Digital Solutions

> **MULTI CREATIVES** is a premier digital solutions and creative design platform built with Next.js 16 (Turbopack), React 19, TypeScript, and Tailwind CSS v4. It delivers a quiet-luxury aesthetic, complete bilingual parity (Arabic RTL & English LTR), dark and light theme adaptability, interactive client tools, and progressive web application (PWA) readiness.

---

## 🌟 Key Highlights & Architecture

- **Sub-Second Performance**: Next.js 16 App Router with Partial Prerendering (PPR), static optimization for 39+ routes, and zero layout shift.
- **Bilingual & Bidirectional (RTL / LTR)**:
  - **Arabic (Primary)**: Customized typographic hierarchy with balanced line heights to prevent character clipping (`html[dir="rtl"]`).
  - **English (Secondary)**: Clean geometric layout with matching aesthetic fidelity.
- **Luxury Brand Palette**:
  - **Matte Charcoal** (`#111111` / `#161616`) — Grounded editorial depth.
  - **Champagne Gold** (`#C6A66B`) — Primary prestige metallic accent for CTAs, active states, and highlights.
  - **Warm Ivory** (`#FDFBF7`) — Soft high-contrast typography and subtle surfaces.
  - **Secondary Neon** (`#00F0FF`) — Discreet modern focal accents and interaction indicators.
- **Official Brand Geometry**: Preserved official logo geometry (`/images/logo-original.png`).
- **Unified Contact & Dispatch**:
  - Official WhatsApp direct routing (`+967779628873` / `967779628873`).
  - Official Email: `mazenalkhadami123@gmail.com`.
  - Service coverage: Riyadh (Saudi Arabia) & Sana'a (Yemen).
  - Social presence: Instagram (`@l.i9iil`), LinkedIn, GitHub (`mazen-alkhadami`).

---

## 🛠️ The 7 Approved Creative & Tech Disciplines

1. **Website Design & Development** (`/services/website-design-development`)
2. **Web Applications Development** (`/services/web-applications-development`)
3. **Software & Systems Development** (`/services/software-systems-development`)
4. **AI & Automation Solutions** (`/services/ai-automation-solutions`)
5. **Graphic Design & Visual Identity** (`/services/graphic-design`)
6. **Printing Services** (`/services/printing-services`)
7. **Promotional Gifts** (`/services/promotional-gifts`)

---

## 💡 Interactive Client Tools

- **Request a Service (طلب خدمة)** (`/request-project`): Streamlined 9-field project brief generator with instant WhatsApp message formatting.
- **Print Configurator (حاسبة مواصفات الطباعة)** (`/print-configurator`): Technical parameter selector for paper weights, finishes, and quantities with clear WhatsApp dispatch.
- **Quote Scope Estimator (مقدّر نطاق المشروع)** (`/quote-builder`): Realistic timeline and scope calculator without invented or speculative pricing.
- **Smart Global Search**: Instant bilingual modal overlay searching services, concept portfolio, blog articles, and FAQs.
- **MC AI Assistant**: Local grounded knowledge assistant ready for LLM API integration.
- **Floating WhatsApp Button**: Custom Champagne Gold floating action button with live indicator and subtle neon pulse.

---

## 📂 Project Structure

```bash
multi-creatives/
├── public/
│   ├── icons/                   # PWA app icons (192, 512, maskable, apple)
│   ├── images/                  # Official logos and service vector graphics
│   │   ├── portfolio/           # 6 concept project SVG mockups
│   │   └── services/            # 7 high-fidelity service vector diagrams
│   ├── manifest.webmanifest     # Progressive Web App manifest
│   ├── sw.js                    # Service worker offline caching
│   └── robots.txt               # Search engine directives
├── src/
│   ├── app/                     # Next.js App Router (pages, layouts, metadata)
│   │   ├── about/               # About page
│   │   ├── blog/                # 4 bilingual articles & dynamic reader
│   │   ├── contact/             # Official contact channels & form
│   │   ├── faq/                 # Searchable FAQ
│   │   ├── portfolio/           # 6 concept projects & category filtering
│   │   ├── print-configurator/  # Technical print specs builder
│   │   ├── quote-builder/       # Scope & timeline estimator
│   │   ├── request-project/     # Request a Service multi-step form
│   │   ├── services/            # 7 comprehensive service detail pages
│   │   └── api/assistant/       # Grounded assistant API endpoint
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, ClientLayoutShell, Container
│   │   └── ui/                  # Button, Badge, Card, Lightbox, SocialIcons, etc.
│   ├── data/
│   │   ├── contactConfig.ts     # Single source of truth for contact details
│   │   ├── servicesData.ts      # 7 service definitions & deliverables
│   │   ├── portfolioData.ts     # 6 concept projects across core categories
│   │   ├── blogData.ts          # 4 complete bilingual thought leadership pieces
│   │   ├── faqData.ts           # Frequently asked questions & answers
│   │   └── translations.ts      # Arabic and English translation dictionaries
│   ├── hooks/                   # useLanguage, useTheme, useTranslation
│   └── styles/                  # Design tokens, typography rules, Tailwind v4
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `20.x` or higher (tested on Node.js `26.x`)
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mazen-alkhadami/multi-creatives.git

# Navigate to project directory
cd multi-creatives

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Linting & Production Build

```bash
# Run strict TypeScript & ESLint validation
npm run lint

# Compile optimized production build
npm run build

# Start local production server
npm run start
```

---

## ⚙️ Environment Variables

Configure the following variables in `.env.local` or in your hosting provider's dashboard:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical public URL | `https://multicreatives.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Official WhatsApp dispatch number | `967779628873` |
| `MC_AI_API_KEY` | Optional API key for live LLM | *(Optional)* |
| `MC_AI_PROVIDER` | AI provider choice (`gemini` / `openai` / `claude`) | `gemini` |
| `DATABASE_URL` | Optional PostgreSQL / Prisma database connection | *(Optional)* |
| `RESEND_API_KEY` | Optional transactional email provider API key | *(Optional)* |
| `NEXT_PUBLIC_ONESIGNAL_APP_ID`| Optional push notification app ID | *(Optional)* |
| `NEXT_PUBLIC_GA_ID` | Optional Google Analytics measurement ID | *(Optional)* |

---

## 🚢 Production Deployment

### Recommended Platforms:
1. **Vercel**: Import GitHub repository, leave build command as `npm run build`, and add environment variables.
2. **Cloudflare Pages / Workers**: Deploy Next.js SSR via OpenNext adapter.
3. **Self-Hosted VPS / Docker**: Build with standalone mode and run via PM2 or Docker.

---

## 📄 License & Rights

All brand geometry, source code, and design architecture are proprietary to **MULTI CREATIVES**.
Developed by **Mazen Al-Khadami** ([@mazen-alkhadami](https://github.com/mazen-alkhadami)).
