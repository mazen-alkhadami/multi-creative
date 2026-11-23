# MULTI CREATIVES — Project Blueprint & Architecture

## 1. Executive Summary & Vision

**MULTI CREATIVES** is an elite international creative and technology agency delivering high-caliber digital brand experiences, next-generation web architectures, and visionary design.

This document outlines the architectural blueprint, technological principles, structural conventions, and implementation roadmap designed for a rapid 3-day production cycle.

---

## 2. Core Brand Identity & Aesthetic Principles

- **Brand Essence**: Creative Power, High-End Engineering, Visionary Aesthetics.
- **Visual Philosophy**:
  - **Luxury & Minimalist**: Content and typography take center stage with ample whitespace and breathing room.
  - **No Generic Templates**: Bespoke layout rhythms, subtle hairline gold accents, sophisticated micro-interactions.
  - **Zero Visual Noise**: Avoid noisy gradients, unnecessary heavy glassmorphism, or frivolous continuous animations.
  - **Symmetric Balance**: Equal visual elegance in both Arabic (Right-to-Left) and English (Left-to-Right).

### Brand Color Tokens
| Token Name | Hex Code | Role in System |
| :--- | :--- | :--- |
| **Matte Black** | `#111111` | Primary dark surface, deepest foundation |
| **Charcoal** | `#1C1C1C` | Secondary dark surface, card backgrounds, elevated containers |
| **Champagne Gold** | `#C6A66B` | Primary luxury accent, focus rings, call-to-action highlights |
| **Warm Ivory** | `#F5F1E8` | Primary light background, soft premium contrast text in dark mode |
| **Muted Gray** | `#99958D` | Secondary body text, understated borders, muted iconography |

---

## 3. Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, Cache Components, Partial Prerendering ready)
- **Runtime & Language**: Node.js & TypeScript (Strict Type Checking)
- **Styling**: Tailwind CSS v4 with custom CSS custom properties (Tokens)
- **Animation**: Framer Motion (restrained, high-impact micro-interactions only)
- **Iconography**: Lucide React (streamlined, modern stroke icons)
- **Typography Engine**: Next.js Google Fonts (`Cairo` for Arabic, `Plus Jakarta Sans` for English)

---

## 4. Directory & Module Architecture

Strict separation of concerns is maintained across the codebase:

```text
multi-creatives/
├── public/
│   ├── images/
│   │   ├── logo-original.png   # Preserved original brand asset
│   │   ├── logo-dark.png       # Transparent dark emblem
│   │   ├── logo-light.png      # Transparent warm ivory emblem
│   │   └── logo-gold.png       # Transparent champagne gold emblem
│   └── fonts/
├── src/
│   ├── app/                    # Next.js App Router (pages & route handlers)
│   │   ├── about/              # About route foundation
│   │   ├── blog/               # Blog route foundation
│   │   ├── contact/            # Contact route foundation
│   │   ├── faq/                # FAQ route foundation
│   │   ├── portfolio/          # Portfolio route foundation
│   │   ├── request-project/    # Project request route foundation
│   │   ├── services/           # Services route foundation
│   │   ├── globals.css         # Global tokens & Tailwind v4 theme configuration
│   │   ├── layout.tsx          # Root shell layout with font & language injection
│   │   └── page.tsx            # Homepage foundation
│   ├── components/
│   │   ├── ui/                 # Atomic design tokens (Buttons, Badges, Inputs, Cards)
│   │   └── layout/             # Structural elements (Header, Footer, Navigation, Lang/Theme Toggles)
│   ├── sections/               # Composed page sections (Hero, ServicesPreview, ValuePillars, CtaBanner)
│   ├── data/                   # Static agency data, bilingual dictionaries, navigation schemas
│   ├── services/               # Future-proof client/API abstraction services
│   ├── hooks/                  # Custom React hooks (useLanguage, useTheme, useDirection)
│   ├── lib/                    # Core utilities (cn, storage, formatting)
│   └── styles/                 # Dedicated tokens and theme stylesheet extensions
├── PROJECT_BLUEPRINT.md        # Comprehensive technical blueprint
├── AGENTS.md                   # AI Agent and team workflow rules
├── DESIGN_SYSTEM.md            # Reusable design system guide
└── ROADMAP.md                  # 3-Day delivery milestones
```

---

## 5. Bilingual & RTL Architecture

1. **Default Language**: Arabic (`ar`, `dir="rtl"`).
2. **Secondary Language**: English (`en`, `dir="ltr"`).
3. **Typography Switch**:
   - Arabic text applies `var(--font-arabic)` (`Cairo`), naturally tuned line heights and letter spacing.
   - English text applies `var(--font-english)` (`Plus Jakarta Sans`), crisp contemporary geometric sans-serif.
4. **State Persistence**:
   - Language choice saved in `localStorage` under `mc_lang`.
   - HTML root tag dynamically receives `lang="ar|en"` and `dir="rtl|ltr"`.
   - Layout components leverage bidirectional Tailwind utilities (`ms-`, `me-`, `start-`, `end-`).

---

## 6. Theme Engine (Dark & Light)

- **Default Mode**: Dark luxury mode (`#111111` Matte Black base, `#1C1C1C` Charcoal surfaces, `#C6A66B` Gold accents).
- **Light Mode**: Warm Ivory mode (`#F5F1E8` base, `#FFFFFF` crisp surfaces, `#111111` typography, `#C6A66B` Gold accents).
- **Anti-Flicker**: Inline head script checks stored preference (`mc_theme`) or system color preference prior to render, eliminating flash of unstyled theme.
- **Theme Tokens**: Managed through CSS custom properties mapped cleanly into Tailwind classes.

---

## 7. Performance & Static-First Principles

- **Zero Unnecessary Backend Overhead**: No heavy CMS, no external DB, or fragile APIs in Phase 1.
- **Pre-rendered Static Assets**: App routes prerender to static HTML for sub-second global edge delivery.
- **High Core Web Vitals**: Images optimized via `next/image`, responsive breakpoints, minimal payload footprint.
