# Restaurant Site Template — Onboarding Guide

A static-exported Next.js 15 marketing site optimized for restaurant SEO. This template was built once and is designed to be repopulated for additional clients in a single afternoon.

## What This Template Is

- **Single restaurant marketing site.** Multi-location support is not built in.
- **Static export only.** No CMS, no API routes, no server runtime. Deploys to any static host (Cloudflare Pages, Netlify, Vercel, S3+CloudFront).
- **SEO-first.** Per-page metadata, JSON-LD schema across every page, comprehensive sitemap, dedicated keyword-targeted landing pages.
- **Content lives in `/src/data/`.** Every customer-facing string flows from typed TypeScript data files. Components and routes are brand-agnostic.

## The 4x Onboarding Promise

A new restaurant client takes one focused afternoon, not a week. The work is:

1. **Replace 6 data files** in `src/data/`
2. **Swap images** in `/public/Images/`
3. **Update brand colors** in `src/styles/globals.css`
4. **Regenerate `public/sitemap.xml`** if URL slugs changed
5. **Run `npm run build`** and verify clean
6. **Deploy `/out`** to the chosen static host

You should not need to modify any route file (`src/app/**/page.tsx`) or any component (`src/components/`) for a new client. If you do, the template is leaking brand-specific defaults that should be extracted to the data layer.

## Per-File Swap-In Checklist

### `src/data/restaurant.ts` (NAP + brand source of truth)

This file is the canonical RESTAURANT object. Everything downstream (schema, footer, header, OG tags, neighborhood pages, specialty pages) reads from here. Replace:

- `name`, `legalName`, `tagline` — brand identity
- `shortDescription`, `longDescription` — used in metadata, schema, and our-story page
- `address.*` — full NAP
- `geo.{latitude, longitude}` — for LocalBusiness schema
- `phone`, `phoneRaw`, `email`, `url`
- `priceRange` (e.g., "$$"), `cuisine[]`, `servesCuisine`
- `hours[]` — open/close per day (24-hour format)
- `breakfastHours.*` — if applicable; otherwise remove or leave with a note for the future client
- `ratingValue`, `reviewCount` — pulled from Google Business Profile
- `socials.*` — at minimum facebook, instagram, googleBusinessProfile; others optional
- `orderOnline` — direct ordering URL
- `features[]` — bullet-list claims (Halal, Family Owned, etc.)
- `areasServed[]` — broad delivery/catering area list
- `cateringAreas` — single string for catering page copy
- `founded`, `familyRecipeSince` — optional; used by "since X" UI
- `pressQuote.{text, source}` — for the homepage PressStrip

### `src/data/menu.ts` (menu source of truth)

Replace the MENU array with the client's actual menu. Each category has an `id` (URL-safe slug), `name`, `description`, `image`, and `items[]`. Each item has at minimum `name`, `description`, `price`. Optional flags: `popular`, `spicy`, `vegetarian`. The `popular` flag drives the homepage FeaturedDishes carousel.

Image paths convention: `/Images/menu/[category-id].webp` for category images. Individual item images optional under `item.image`; falls back to category image.

### `src/data/specialties.ts` (SEO landing pages — keyword-targeted)

Each entry creates a page at `/specialties/[slug]/`. The number of specialty pages is flexible — Al-Baghdady has 11, a smaller brand might have 5, a larger one 20. Each entry needs:

- `slug` (URL-safe), `name` (display)
- `metaTitle`, `metaDescription`, `keywords[]` — for SEO
- `heroEyebrow` (optional uppercase tag), `heroHeadline`, `heroSubheadline` (optional)
- `primaryBlock.{heading, body}` — main "Try our X" content
- `pickupBlock.{heading, body}` — pickup/delivery angle
- `image` — optional `/Images/specialties/[slug].webp`
- `relatedMenuItemNames[]` — exact `item.name` strings from `menu.ts`; resolver silently skips names that don't match

The `/specialties/` index page auto-generates a card grid from this array. Adding/removing entries requires no route changes.

### `src/data/neighborhoods.ts` (geographic SEO landing pages)

Each entry creates a page at `/near/[slug]/`. Same data-driven pattern as specialties. Cities served by the brand's catering / delivery radius. Each needs:

- `slug` (e.g., "plano-tx"), `city`, `state`
- `metaTitle`, `metaDescription`, `keywords[]`
- `heroHeadline`, `heroSubheadline`, `driveTime`
- `intro`, `body` — short paragraphs
- `popularDishes[]` — strings (free text, not menu-linked)

### `src/data/faqs.ts`

Array of `{ question, answer }` objects. Drives the homepage FAQ section (`FAQS.slice(0, 6)`). JSON-LD FAQPage schema is auto-generated on the homepage via `faqSchema(HOME_FAQS)`. Entries 7+ stay in the data file as a reservoir — surface them later by raising the slice index, or render a topic-specific subset inside individual `/specialties/[topic]/` pages.

### `src/data/reviews.ts`

Two exports:
- `REVIEWS[]` — curated customer testimonials (use real reviews if licensed, or write client-approved fictionals)
- `PRESS_QUOTES[]` — third-party validation snippets (press, awards, ratings)

Both feed the homepage Reviews section. Author names should be plausible. Star ratings should match the brand's actual average.

## Visual / Brand Identity

### `src/styles/globals.css` (brand colors)

Inside the `:root` block:
- `--color-primary` — main brand color (used for buttons, accents)
- `--color-gold`, `--color-gold-dark` — secondary accent
- `--color-warm-white`, `--color-bg`, `--color-text`, `--color-text-muted` — neutrals
- `--color-border` — divider lines

Inside the `@theme` block:
- `--font-display` — heading font (default: Playfair Display via next/font)
- `--font-body` — body font

If you change fonts, update `src/app/layout.tsx` where the fonts are imported via `next/font/google`.

### `/public/Images/` (photography)

Required image paths:
- `/public/Images/hero.webp` (homepage hero, 1200×1500+)
- `/public/Images/bakery.webp` or main brand-secondary image
- `/public/Images/og-default.jpg` (1200×630, default social sharing card)
- `/public/Images/logo.png` (used in Organization schema)
- `/public/Images/icon-192.png`, `/public/Images/icon-512.png` (PWA icons)
- `/public/Images/menu/[category-id].webp` (one per menu category)
- `/public/Images/specialties/[slug].webp` (optional, falls back gracefully)
- `/public/Images/dish-1.webp` through `/public/Images/dish-N.webp` (homepage carousel — only used if individual items don't have images)

All images: WebP preferred (smaller, modern). JPEG fallback acceptable for OG card.

> **Fallback behavior:** If the dedicated OG card (`og-default.jpg`) is not yet supplied by the client, `metadata.ts` and `schema.ts` fall back to `/Images/hero.webp`. Swap sites are marked with `TODO` comments at every reference. Replacing the file is a drop-in operation — no code change needed.

### `/public/favicon.ico` and `/public/apple-touch-icon.png`

Standard favicon set. Use a favicon generator (realfavicongenerator.net) and drop the generated files into `/public/`.

> **Fallback behavior:** Next.js auto-discovers `src/app/icon.png` and serves it as the favicon. If you don't ship a `/public/favicon.ico`, the site still has a working browser tab icon via this convention. For broadest browser support though, dropping in a multi-resolution `favicon.ico` is preferred.

## Adding / Removing Pages

### To add a specialty page

Append a new entry to `SPECIALTIES` in `src/data/specialties.ts`. Run `npm run build`. Add the URL to `public/sitemap.xml`. Done — no route file edits.

### To add a neighborhood page

Append to `NEIGHBORHOODS` in `src/data/neighborhoods.ts`. Run build. Add URL to sitemap. Done.

### To add a menu item

Append to the appropriate category's `items[]` in `src/data/menu.ts`. The /menu page and JSON-LD pick it up automatically. Mark `popular: true` to surface in the homepage FeaturedDishes carousel.

### To add an FAQ

Append to the `FAQS` array. Both the FAQ page and homepage section pick it up.

### To remove anything

Remove the entry from the data file. Update `public/sitemap.xml` to drop the corresponding URL. Build to verify nothing was hard-referencing the removed item.

## Sitemap Maintenance

`public/sitemap.xml` is a **manually-maintained static file**. Whenever you add or remove a route (specialty, neighborhood, or top-level page), update it:

- `<loc>` — full URL with trailing slash
- `<lastmod>` — ISO date, update on material content changes
- `<priority>` — 1.0 for homepage, 0.9 for menu, 0.8 for evergreen pages, 0.7 for landers
- `<changefreq>` — `weekly` for menu, `monthly` for landers

When a route is removed, drop its entry from the sitemap immediately. Stale entries trigger Google Search Console "URL not found" warnings.

## Build, Verify, Deploy

    npm install                  # one-time dependency install
    npm run dev                  # local dev at http://localhost:3000
    npm run build                # full static export to /out (runs lint + type-check + SSG)
    npm run serve-out            # serve the built /out folder
    npm run lint                 # standalone lint

A clean build for the Al-Baghdady reference build produces **33 static pages**. Your client's build count will differ based on the number of specialty + neighborhood pages, but the build should:
- Exit 0
- Report no lint errors
- Report no TypeScript errors
- Generate all expected static routes

Deploy `/out` to Cloudflare Pages, Netlify, Vercel, or any static host. No environment variables required.

## Anti-Patterns (Don't Do These)

1. **Don't hardcode brand strings in routes or components.** Every customer-facing string belongs in `src/data/`. If you find yourself typing the restaurant's name into a `.tsx` file, you're leaking brand specificity into the template.

2. **Don't modify the type definitions casually.** The `Specialty`, `Neighborhood`, `MenuItem`, etc. types are the template's contract. Adding required fields breaks existing client deployments.

3. **Don't remove items from `menu.ts` without client approval.** "Discontinued" is the client's call, not the team's. Append-only is the default.

4. **Don't generate the sitemap.** It's static-by-design. If it ever becomes dynamic, the template needs route-introspection logic that doesn't currently exist.

5. **Don't merge to `release` without client sign-off.** The `main` branch is the staging line. Production deploys come from `release` after the client reviews. Push to release is always a deliberate human action.

## Architecture at a Glance

    /src/app/              ← routes (data-driven, brand-agnostic)
      /                    ← homepage
      /menu/               ← menu page
      /our-story/          ← brand story
      /bakery/             ← curated showcase
      /iraqi-cuisine/      ← educational encyclopedia (this name is brand-specific; future clients may rename)
      /catering/           ← catering inquiry form
      /reviews/            ← all reviews
      /near/[city]/        ← geographic SEO landing pages (one per neighborhood)
      /specialties/        ← specialty index
      /specialties/[topic]/← keyword-targeted SEO landing pages (one per topic)

    /src/components/       ← shared UI (brand-agnostic)
      /layout/             ← Header, Footer, BreadcrumbNav
      /home/               ← homepage sections
      /shared/             ← SmartImage, ThemeBtn, SchemaInjector
      /catering/           ← CateringForm

    /src/data/             ← THE BRAND-SPECIFIC LAYER
      restaurant.ts        ← NAP, brand, hours, etc.
      menu.ts              ← menu categories + items
      specialties.ts       ← SEO landing pages by topic
      neighborhoods.ts     ← SEO landing pages by city
      faqs.ts              ← FAQ entries
      reviews.ts           ← curated reviews + press quotes
      schema.ts            ← JSON-LD generator functions (brand-agnostic, uses RESTAURANT)
      metadata.ts          ← createMetadata factory (brand-agnostic, uses RESTAURANT)

    /public/
      /Images/             ← photography (per-client)
      sitemap.xml          ← manually maintained
      robots.txt
      manifest.json        ← PWA manifest
      favicon.ico, apple-touch-icon.png

    /docs/                 ← project documentation
      content-source.md    ← client-approved copy (per client)
      TEMPLATE.md          ← this file

## Versioning Convention

This template uses semantic-ish versioning in `package.json`:
- **Patch bump** (`1.16 → 1.17`) for content changes, copy updates, polish
- **Minor bump** (`1.16 → 1.20`) for new features, new pages, new data fields
- **Major bump** (`1.x → 2.0`) reserved for breaking template changes (e.g., type-shape changes that require client-side migrations)

Bump on every commit that touches source. Use a separate `chore(version): bump to vX.Y` commit so version changes don't muddy feature diffs.

## License & Provenance

Internal company template. Not for redistribution outside the agency without an explicit licensing agreement.
