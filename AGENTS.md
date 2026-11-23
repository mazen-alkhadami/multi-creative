<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MULTI CREATIVES — Agent & Developer Operational Manual

## 1. Project Overview & Deadlines
- **Entity**: MULTI CREATIVES (Premier Creative & Technology Agency)
- **Deadline**: 3-Day Accelerated Launch Window
- **Core Stance**: High aesthetics, production-grade stability, zero bloat.

## 2. Mandatory Architectural Constraints
1. **Never Invent Data**: Do NOT fabricate fake clients, fake case studies, fake awards, or fake testimonials. Use realistic, high-level agency capabilities, pillars, and structural placeholders.
2. **Logo Integrity**: Never modify or alter the geometry, aspect ratio, or angles of the official logo (`public/images/logo-original.png`). The two parallel rounded pills and the sparkle star are sacred brand geometry.
3. **Strict Separation of Concerns**:
   - `components/ui/` for primitive reusable UI blocks (Button, Input, Card).
   - `components/layout/` for navigation, header, footer, chrome.
   - `sections/` for high-level page sections (Hero, Services, CTA).
   - `data/` for bilingual copy, site config, navigation maps.
   - `services/` for mocked or external client bridges.
   - `hooks/` for re-usable React hooks.
   - `lib/` for pure helper functions and utilities.
4. **Bilingual & Bidirectional Requirement**:
   - Arabic is the primary default language (`ar`, `rtl`).
   - English is fully supported (`en`, `ltr`).
   - Never hardcode directional margins like `mr-` or `ml-` when bidirectional utilities (`me-`, `ms-`) are required.
5. **No DB / No Heavy Auth in Initial Phases**:
   - Maintain static-first architecture. Form submissions should route cleanly through typed service handlers ready for future API/webhooks.
6. **Code Quality & Build Integrity**:
   - Every change must pass `npm run build` with zero TypeScript or Turbopack errors.
