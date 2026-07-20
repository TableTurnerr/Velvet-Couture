# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies (multiple lockfiles warning is expected — workspace root inferred from parent)
npm run dev          # local dev at http://localhost:3000
npm run build        # static export to ./out (runs lint + type-check + SSG)
npm run serve-out    # serve the built /out directory locally
npm run lint         # next lint
```

There is no test suite. Verification is done by running `npm run build` (lint + type-check + static export of all routes — currently `/`, `/menu/`, `/bakery/`, `/catering/`, `/iraqi-cuisine/`, `/our-story/`, `/near/` plus all 11 `/near/[city]/` pages, and `/specialties/` plus all 11 `/specialties/[topic]/` pages) and visually checking with `serve-out`.

### Environment

Copy `.env.local.example` → `.env.local`. Required public env vars:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key gating the review-submission modal. Test key `1x00000000000000000000AA` always passes.
- `NEXT_PUBLIC_REVIEW_API_URL` + `NEXT_PUBLIC_REVIEW_API_KEY` — TableTurnerr ParentSite endpoint where `ReviewModal` POSTs submissions.
- `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_PHONE_RAW`, `NEXT_PUBLIC_EMAIL`, social URLs, `NEXT_PUBLIC_ORDER_ONLINE_URL` — surfaced via `restaurant.ts` and used throughout. All are public (`NEXT_PUBLIC_*`) because this is a fully static export — no server runtime exists to hold secrets.

## Architecture

This is a static-exported Next.js 15 (App Router) marketing site for a single restaurant. The dominant architectural decision is **static export with all content driven from `/src/data/`** — there is no CMS, no API routes, no server runtime.

### Data layer is the source of truth (`/src/data/`)

Edit data once and it propagates across pages, JSON-LD schema, sitemap and footer. The flow is:

1. **`restaurant.ts`** — NAP, hours, socials, geo, areas served, ratingValue/reviewCount. Imported by nearly every component.
2. **`menu.ts`** — Categories with items. Drives `/menu`, homepage `FeaturedDishes` (filters `popular: true`), and `Menu` JSON-LD.
3. **`faqs.ts`** — Single FAQ array. The standalone `/faq` route was removed; the homepage `FAQSection` shows `FAQS.slice(0, 6)` and injects `FAQPage` schema.
4. **`neighborhoods.ts`** — Configs for `/near/[city]` dynamic route. `generateStaticParams()` reads this array.
5. **`reviews.ts`** — Curated quotes shown on the homepage `Reviews` section. Live review *submission* is implemented via `ReviewModal` + Cloudflare Turnstile → POST to `NEXT_PUBLIC_REVIEW_API_URL` (TableTurnerr ParentSite); curated quotes in this file are the editorially-controlled set rendered on the page.
6. **`schema.ts`** — Pure functions returning JSON-LD objects (`organizationSchema`, `restaurantSchema`, `menuSchema`, `faqSchema`, `breadcrumbSchema`, etc.). All schema is generated from the data files above.
7. **`metadata.ts`** — `createMetadata()` factory that returns Next.js `Metadata`. Every page calls this — never hand-roll metadata.

### SEO is the primary product

The site exists to fix a 16/100 SEO grader score (see `we-need-to-replicate-jazzy-dragon.md` plan and the source SEO report at `../ParentSite-Tableturnerr/reports-archive/al-baghdady/al-baghdady-internal-report.json`). When making changes:

- Every page must inject relevant JSON-LD via `<SchemaInjector>` (`/src/components/shared/SchemaInjector.tsx`). Schema arrays render multiple `<script type="application/ld+json">` tags.
- Every page must use `createMetadata()` for `<title>`, description, canonical, OG, Twitter.
- Every page should render `<BreadcrumbNav>` which auto-injects `BreadcrumbList` schema.
- The sitemap is generated at build time by `/src/app/sitemap.ts` from the data layer (`RESTAURANT.url`, `NEIGHBORHOODS`, `SPECIALTIES`, and a static route list). New static routes need to be added to that file's `STATIC_ROUTES` array; new dynamic routes should be sourced from their data file. Do not edit `/public/sitemap.xml` — it has been removed in favor of build-time generation.

### Routing

Static export means `output: 'export'` + `trailingSlash: true` in `next.config.ts`. All internal links must include the trailing slash (e.g. `/menu/`, not `/menu`) — this is consistent throughout the codebase.

Dynamic routes: `/near/[city]` reads from `NEIGHBORHOODS` (11 cities) and `/specialties/[topic]` reads from `SPECIALTIES` (11 topics). Both use `generateStaticParams()` to pre-render at build time. The future `/[dish]-in-[city]/` mesh route will read from `DISHES` × `NEIGHBORHOODS` gated by a `MATRIX_ALLOWLIST` constant.

App Router error boundaries are wired up: `app/error.tsx` (per-segment runtime errors), `app/global-error.tsx` (root-level fallback), and `app/not-found.tsx` (404). Keep these branded and on-theme — they are the only non-success states users see.

### Styling

Tailwind CSS 4 with custom theme tokens in `/src/styles/globals.css` (`@theme` block). The design system is a **light theme only** — cream/sand backgrounds, maroon (`--color-primary: #8B1A1A`) and gold (`--color-gold: #C9A84C`) accents. Reusable utility classes: `.btn-primary`, `.btn-secondary`, `.btn-gold`, `.card`, `.container-pad`, `.section-pad`, `.eyebrow`. Prefer these over inline Tailwind for spacing/buttons to keep visual consistency.

`Inter` and `Fraunces` are loaded via `next/font` in `src/app/layout.tsx`. **Check the token mapping in `globals.css` before assuming which face headings use**: `--font-display` currently maps to Inter and Fraunces is bound to `--font-accent`, so headings styled with `style={{ fontFamily: 'var(--font-display)' }}` render Inter. To change the heading face, change the token mapping — not per-component fonts. Inline `var(...)` references are used because Tailwind 4's `@theme` font tokens aren't picked up automatically by class names in this setup.

### Component structure

- `/src/components/layout/` — `Header`, `Footer`, `BreadcrumbNav` (used on every page).
- `/src/components/home/` — Homepage sections: `HeroBanner`, `ActionCards`, `TrustBar`, `FeaturedDishes`, `BakerySpotlight`, `Gallery`, `Reviews`, `FAQSection`, `OurLocation`, `PressStrip`, `InstagramSection`.
- `/src/components/shared/` — `SchemaInjector`, `SmartImage`, `Turnstile`, `ThemeBtn`, `QRHover`, `TabTitleHandler`.
- `/src/components/reviews/` — `ReviewModal` (submission form, gated by `Turnstile`, POSTs to the TableTurnerr ParentSite API).
- `/src/components/catering/` — `CateringForm` (mailto-based, no backend).
- `/src/components/menu/` — `CategoryNav` (client component extracted so the menu page can stay a server component).

Most pages and sections are server components. Mark `"use client"` only when interactivity or browser-only APIs are needed (`Header`, `FAQSection`, `CategoryNav`, `ReviewModal`, `Turnstile`, `SmartImage`, `QRHover`, `TabTitleHandler`).

### Image handling

Real photos live under `/public/Images/` (including `/public/Images/gallery/`). The standard renderer is **`SmartImage`** (`/src/components/shared/SmartImage.tsx`) — a `"use client"` component that wraps a plain `<img>` with a shimmer skeleton, lazy/eager loading via the `priority` prop, and a `fetchPriority` hint. It deliberately does **not** use `next/image` because the static export disables the Image optimization API (`next.config.ts` has `images.unoptimized: true`); any image processing happens at build time via `sharp`. Prefer `SmartImage` over raw `<img>` so the loading shimmer stays consistent.

### Notable dependencies

- `framer-motion` — animations on hero, gallery, modal transitions.
- `lucide-react` — icon set used across nav, cards, forms.
- `qrcode.react` — renders the QR code surfaced by `QRHover` (hover-to-reveal "scan to view menu/order").
- `sharp` — build-time image processing for the static export.

### Brand consolidation context

The SEO report flagged 3 active domains, 4 brand-name variants, 3 phone numbers and one email typo for the client. This site is the canonical replacement: one domain (`al-baghdady.com`), one brand (`Al-Baghdady Restaurant & Bakery`), one phone, one correct email. The `Organization` schema in `/src/data/schema.ts` lists the legacy variants in `alternateName` so search engines can consolidate authority. Don't introduce new brand-name variations.

**Intentional divergence**: `RESTAURANT.name` ("Al-Baghdady Bakery & Café") and `schema.ts` `CANONICAL_NAME` ("Al Baghdady | Bakery and Cafe") differ on purpose — the latter matches the Google Business Profile. Don't unify them.

## Gotchas & conventions

- **Mesh route absence is deliberate.** The `(matrix)/[meshSlug]` route file must NOT exist while `MATRIX_ALLOWLIST` in `src/data/matrix.ts` is empty — an empty `generateStaticParams()` breaks `output: export`. Wiring instructions live as a comment block in `matrix.ts`.
- **Doc precedence**: `docs/TEMPLATE.md` and `README.md` are stale in places — both describe a manually-maintained `public/sitemap.xml` (it doesn't exist; the sitemap is build-time generated by `src/app/sitemap.ts`) and quote old route counts. When they conflict with this file or the code, this file and the code govern.
- `ratingValue`/`reviewCount` live in `restaurant.ts` AND a press quote in `reviews.ts` hardcodes the review count — keep all in sync when ratings update.
- `npm install` warns about multiple lockfiles (workspace root inferred from the parent directory) — expected, not an error.
- `next.config.ts` supports `NEXT_BASE_PATH` for subpath deploys.
- Commit style: `feat(Scope): ...` / `fix(Scope): ...`; version bumps are their own `chore(version): bump to vX.Y` commit (version lives in `package.json`). The `.claude/skills/commit-changes` skill automates this; `.claude/skills/media-optimizer` handles image/video WebP compression; `.claude/commands/add-instagram-post.md` adds Instagram posts.
- Cross-repo: `ReviewModal` POSTs to the TableTurnerr ParentSite ingest API (`NEXT_PUBLIC_REVIEW_API_URL` + `NEXT_PUBLIC_REVIEW_API_KEY`); this repo is also the source template rendered by TT-ChildSite-Wireframe.
