# Template swap surface — 2026-05-18

The full list of things a new tenant must touch when reusing this codebase. Tenant #1 is Al-Baghdady (Iraqi bakery & breakfast café in Richardson, TX). When tenant #2 lands, this is the catalogue.

Scope: documentation only. No shared package, no automation — just a map. Read top to bottom for an onboarding checklist (see section 9).

Audience: future-me or a teammate six months from now who has not been in this repo recently.

---

## 1. Data files — `/src/data/` (full swap)

Edit data here and it propagates across pages, JSON-LD schema, sitemap, and footer. The flow is intentional: schema and metadata generators read from these data files — tenants change the inputs, not the generators.

### `restaurant.ts` — single most important file

NAP, hours, geo, socials, ratings, brand strings. Imported by nearly every component and every schema generator. (`src/data/restaurant.ts:1-122`)

What a tenant must populate:

- `name` / `legalName` / `tagline` — brand strings used in metadata titles, schema, headers, footer.
- `shortDescription` / `longDescription` / `footerDescription` — three different lengths. `shortDescription` drives meta descriptions and `websiteSchema.description`. `longDescription` drives `restaurantSchema.description`. `footerDescription` renders directly in `Footer.tsx:31`.
- `address` (object: `street`, `city`, `state`, `zip`, `country`, `full`) — drives `PostalAddress` schema, the Google Maps "hasMap" URL, and on-page address blocks.
- `geo.latitude` / `geo.longitude` — `GeoCoordinates` schema.
- `phone` / `phoneRaw` / `email` — env-driven with hardcoded fallback. Set the env in production and the fallback in the file should be the same value (defense in depth).
- `url` — canonical site URL. Used as `BASE_URL` everywhere (`schema.ts:5`, `metadata.ts:4`, `sitemap.ts:24`).
- `priceRange`, `cuisine[]`, `servesCuisine`, `paymentAccepted`, `currenciesAccepted` — schema fields.
- `founded`, `familyRecipeSince` — surfaced in schema and prose.
- `hours[]` — 7-row array, 24-hour times. Drives `openingHoursSpecification` schema.
- `breakfastHours` — bakery/café-specific extension. Tenants without a breakfast hour callout can leave the shape but remove the references from `/menu/` copy.
- `ratingValue`, `reviewCount` — `AggregateRating` schema. Update from the live GBP before each release.
- `socials` — Instagram, Facebook, Google Business Profile, Google Review link. Used in `sameAs` and footer/header buttons.
- `orderOnline` — single URL for the "Order Online" CTA.
- `features[]` — bullet list rendered in trust bar and footer.
- `areasServed[]` — used in `areaServed` schema arrays and the catering page. Should align with `NEIGHBORHOODS` for SEO consistency but doesn't have to match exactly.
- `cateringAreas` — single string for the catering hero.
- `pressQuote` — `{ text, source }` rendered in the press strip and added to `Organization.award`.

### `menu.ts` — full bakery/café menu

Categories with items. Drives `/menu/`, the homepage `FeaturedDishes` (filters `popular: true`), and `Menu` JSON-LD. (`src/data/menu.ts:1-365`)

```ts
type MenuItem = {
  name: string; description: string; price: string;
  image?: string; popular?: boolean; spicy?: boolean; vegetarian?: boolean;
};
type MenuCategory = { id: string; name: string; description: string; image: string; items: MenuItem[]; };
```

Tenant action: replace `MENU` wholesale. Keep the shape; the `id` slug is used as a stable React key and DOM anchor on the menu page.

### `neighborhoods.ts` — `/near/[city]/` pages

10 entries today; one page per entry. (`src/data/neighborhoods.ts:1-285`)

```ts
type Neighborhood = {
  slug: string; city: string; state: string;
  metaTitle: string; metaDescription: string; keywords: string[];
  heroHeadline: string; heroSubheadline: string;
  driveTime: string; intro: string; body: string;
  popularDishes: string[];
};
```

Tenant action: rewrite all entries for the new market. `slug` format is `kebab-city-state` (e.g. `plano-tx`). Each becomes `/near/<slug>/` and gets pre-rendered by `generateStaticParams()`.

### `specialties.ts` — `/specialties/[topic]/` pages

11 entries today, one page each. (`src/data/specialties.ts:1-522`)

```ts
type Specialty = {
  slug: string; name: string;
  metaTitle: string; metaDescription: string; keywords: string[];
  heroEyebrow?: string; heroHeadline: string; heroSubheadline?: string;
  primaryBlock: { heading: string; body: string };
  pickupBlock: { heading: string; body: string };
  image?: string;
  relatedMenuItemNames?: string[];
  faqs?: { question: string; answer: string }[];
};
```

Image convention (`specialties.ts:18-21`): canonical path is `/Images/specialties/<slug>.webp`. Today only `baklava`, `burma`, `lady-fingers`, `halal-food` have dedicated photos; the rest reuse `/Images/` / `/Images/gallery/` placeholders. Swap as new tenant supplies photography.

`relatedMenuItemNames` must exactly match `MenuItem.name` from `menu.ts` — the related-items section does a name lookup.

### `dishes.ts` — city × dish mesh dish axis (PENDING)

7 candidate dishes for the planned `/[dish]-in-[city]/` mesh. (`src/data/dishes.ts:1-98`) Currently has slugs + aliases + image paths only; `intro`/`body`/`keywords` are intentionally empty pending Tuesday 2026-05-19 client confirmation. Not yet wired to a route.

Tenant action when mesh ships: populate the empty fields, then populate `matrix.ts` allowlist (next).

### `matrix.ts` — mesh allowlist (PENDING, empty)

Single source of truth for which (dish, city) leaf pages get pre-rendered. (`src/data/matrix.ts:1-110`)

`MATRIX_ALLOWLIST` is intentionally empty until copy + photography are ready. **The dynamic route `src/app/(matrix)/[meshSlug]/page.tsx` does not exist yet** — Next 15 + `output: "export"` requires `generateStaticParams()` to return at least one path, so adding the route file with an empty allowlist would break the build. The file scaffolding instructions live as a comment in `matrix.ts:31-77`.

Tenant action: leave alone until tenant-specific dish/city copy is ready.

### `faqs.ts` — homepage FAQ section

Single FAQ array rendered as the homepage `FAQSection` (`FAQS.slice(0, 6)`) and injected as `FAQPage` JSON-LD. (`src/data/faqs.ts:1-108`) Standalone `/faq/` route was removed.

```ts
type FAQ = { question: string; answer: string };
```

Inline markdown links `[anchor](/url/)` are supported — `FAQSection` renders them as `<Link>`, `faqSchema` strips them to plain text. Several answers interpolate `${RESTAURANT.phone}` and `${RESTAURANT.address.full}` — keep that pattern when rewriting.

### `reviews.ts` — curated quotes + press

`REVIEWS[]` is the editorially-controlled set shown on the homepage `Reviews` section. `PRESS_QUOTES[]` feeds the press strip. (`src/data/reviews.ts:1-65`)

```ts
type Review = { author: string; rating: number; text: string; date?: string; source?: "Google" | "Yelp" | "Tripadvisor" | "Zabihah"; };
```

Note: live review **submission** goes through `ReviewModal` → POST to TableTurnerr ParentSite (`NEXT_PUBLIC_REVIEW_API_URL`). The file here is curated quotes only.

### `schema.ts` — JSON-LD generators (configure inputs, not generators)

Pure functions returning JSON-LD objects. (`src/data/schema.ts:1-549`)

**Leave alone** (the generators):
- `organizationSchema`, `websiteSchema`, `restaurantSchema`, `localBusinessSchema`
- `menuSchema`, `faqSchema`, `breadcrumbSchema`
- `cateringServiceSchema`, `articleSchema`, `webPageSchema`

**Configure** (the top-of-file constants — these are the only knobs):
- `CANONICAL_NAME` (`:9`) — exact brand name matching the GBP listing. Used as the schema `name`.
- `ALTERNATE_NAMES` (`:14-27`) — every historical / variant spelling the tenant has used across the web. Critical for Google Knowledge Graph consolidation. List 5–12 variants.
- `KEYWORDS_STRING` (`:29-53`) — comma-joined keyword string, surfaced in multiple schemas' `keywords` field.
- `KNOWS_ABOUT` (`:55-81`) — `Organization.knowsAbout` array. List the cuisine/topic expertise the brand wants to rank for.
- `AMENITY_FEATURES` (`:83-101`) — `LocationFeatureSpecification` items. Edit the boolean amenities for the new business.
- `PRIMARY_IMAGES` (`:103-110`) — 6 absolute URLs to representative photos (hero, bakery, gallery shots). Used in every schema's `image` field. Update to point at the new tenant's `/Images/` paths.

### `metadata.ts` — Next.js metadata factory

`createMetadata()` is called by every page. (`src/data/metadata.ts:1-111`)

**Leave alone:** the `createMetadata` function itself.

**Configure:**
- `DEFAULT_OG` (`:6`) — currently `${BASE_URL}/Images/hero.webp` with a TODO. Replace with a real 1200×630 OG card per tenant.
- `BASE_KEYWORDS` (`:17-40`) — 22 brand keywords merged into every page's metadata. Rewrite for the new tenant's market.
- The icons/manifest/theme-color block (`:100-108`) — currently hardcoded paths to `/icon.png`, `/apple-touch-icon.png`, `/manifest.json`, theme color `#8B1A1A`. Each tenant should review.

---

## 2. Brand tokens — `src/styles/globals.css`

Tailwind 4 `@theme` block at the top of the file. (`src/styles/globals.css:3-27`) Edit these and the entire design system follows.

| Token | Current value | What it controls |
|---|---|---|
| `--color-primary` | `#8B1A1A` (maroon) | Primary brand color. Used by buttons, eyebrows, FAQ links, hover states, focus rings, ::selection. Also duplicated in `:root` at `:30` and in `manifest.json` + `layout.tsx:53` as `theme-color` — change in all four places. |
| `--color-primary-dark` | `#6B1414` | Hover/active variant of primary. |
| `--color-primary-light` | `#B22222` | Lighter primary accent. |
| `--color-gold` | `#C9A84C` | Secondary brand color. Used by `.btn-gold`, accents, 404 page glow. |
| `--color-gold-dark` | `#A88838` | Hover/active variant of gold. |
| `--color-cream` | `#FFFFFF` | "Cream" surface. Currently pure white. |
| `--color-sand` | `#F7F4EE` | Light tan section background. |
| `--color-warm-white` | `#FAFAF7` | Slightly off-white for warm sections. |
| `--color-text` | `#111110` | Body text. Also `.btn-primary` background. |
| `--color-text-muted` | `#6B6258` | Secondary text. |
| `--color-border` | `#ECE7DD` | Card borders and dividers. |
| `--font-display` | `var(--font-inter)`, sans-serif fallbacks | Headings (h1–h6). |
| `--font-body` | `var(--font-inter)`, sans-serif fallbacks | Body text. |
| `--font-accent` | `var(--font-fraunces)`, serif | Italic accents (404 numerals, "menu" emphasis). |
| `--font-arabic` | `"Amiri"`, fallbacks | Reserved for Arabic display text. Loaded only if used. |
| `--radius-card` / `--radius-section` / `--radius-button` | `18px` / `28px` / `9999px` | Rounding tokens. |
| `--shadow-soft` / `--shadow-lift` | hover/lift shadow stacks | Card hover. |

**Important: many tokens are duplicated in the `:root` block (`:29-41`)** because Tailwind 4's `@theme` tokens aren't always reachable in runtime CSS. Edit both blocks together.

### Font swap — `src/app/layout.tsx`

Despite what `CLAUDE.md` says about Playfair Display, the layout currently loads **Inter** (`layout.tsx:18-23`) and **Fraunces** (`:25-31`) from `next/font/google` and exposes them as the CSS variables `--font-inter` and `--font-fraunces`. To swap fonts:

1. Change the imports in `src/app/layout.tsx:3` (e.g. `import { Playfair_Display, Lora } from "next/font/google"`).
2. Update the two `*().variable` instances and the `<html className>` (`:51`).
3. Update the `var(--font-*)` references inside `src/styles/globals.css` `@theme` block to match the new variable names.

---

## 3. Imagery surface — `/public/Images/` and `/public/`

Group by purpose, not by file. The current tenant's assets are real photos; replace with the new tenant's library.

| Purpose | Current path(s) | Dimensions / notes |
|---|---|---|
| **Hero photo** (homepage + many specialties as placeholder) | `/Images/hero.webp` | Wide hero, ~1600w. Also used as `DEFAULT_OG` (`metadata.ts:6`) until a real OG card lands. |
| **Bakery interior / production** | `/Images/bakery.webp` | Used on `/bakery/`, bread/manakish/fatayer specialty placeholders, `Menu` "Bread" + "Manakish & Fatayer" category cards. |
| **Storefront** | `/Images/storefront.webp` | Used on the homepage `OurLocation` block. |
| **Logo** | `/Images/logo.webp` | Header, footer, schema `Organization.logo`, `Restaurant.logo`. ~256×256 ideal. |
| **Featured dishes** (homepage `FeaturedDishes`) | `/Images/dish-1.webp` … `dish-4.webp` | Square or 4:3. Currently 4 photos cycled across `popular: true` menu items. |
| **Gallery** (homepage gallery, schema `image[]`) | `/Images/gallery/*.webp` (15 files) | Mixed aspect; the gallery handles any size. Photos: baklava-pistachio-copper, baklava-tiered-tray, sweets-platter-lamps, zalabia-rings/tray, baklava-boxed, baklava-pistachio-plate, dessert-tray-box, ladyfingers-pistachio. Six are referenced by URL in `schema.ts:103-110` as `PRIMARY_IMAGES` — keep filenames stable or update that constant. |
| **Specialty hero images** | `/Images/specialties/<slug>.webp` | Convention from `specialties.ts:18-21`. Today only `baklava`, `burma`, `lady-fingers`, `halal-food` exist. Others fall back to gallery/hero photos. Aim for 1600×900 landscape. |
| **Menu category image** | `/Images/menu/bakery-sweets.webp` | One file today; category cards reference these in `menu.ts` `image` fields. |
| **Instagram strip** | `/Images/instagram/post-1.webp` … `post-6.webp` | Square. Rendered in `InstagramSection`. Replace per tenant. |
| **OG card** | `/Images/hero.webp` (TODO — `metadata.ts:6`) | **Needs a real 1200×630 branded card.** The single largest visible quality gap for tenant #2 launch. |
| **Favicons** (root `/public/`) | `favicon.ico`, `favicon-32.png`, `favicon-192.webp`, `favicon-512.webp`, `apple-touch-icon.png`, `src/app/icon.png` | Standard favicon set. The `.png.original` files are pre-conversion sources kept for re-export. |
| **PWA manifest icons** | `/favicon-192.webp`, `/favicon-512.webp` | Referenced from `/public/manifest.json:10-19`. Note: the manifest declares `"type": "image/png"` while the files are WebP — that mismatch is in the current repo, worth fixing for tenant #2. |
| **Decorative SVG** | `/Svgs/divider-pattern.svg` | Used by the `.divider-pattern` CSS class in `globals.css:264-270`. Brand-agnostic geometric pattern; can stay across tenants. |

---

## 4. Metadata / OG / Twitter defaults

Wired in `src/data/metadata.ts` and `src/app/layout.tsx`.

What `createMetadata()` produces (`metadata.ts:42-110`):
- `title` — auto-appended with ` | ${RESTAURANT.name}` unless the title already includes the brand. **Tenant change-once:** the brand auto-append condition (`:52-56`) hardcodes "Al-Baghdady" / "Al Baghdady" / "Albaghdady" variants — strip those literals and rely on `RESTAURANT.name` only when swapping tenants.
- `description` — per-page input, no template.
- `keywords` — `BASE_KEYWORDS` merged with per-page keywords. Rewrite `BASE_KEYWORDS` (`:17-40`).
- `metadataBase` — pulled from `RESTAURANT.url`. No action needed.
- `alternates.canonical` — derived from `path` input.
- `robots` — full Googlebot directive object. Generic; leave alone.
- `openGraph` — type `website`, locale `en_US`, siteName from `RESTAURANT.name`, single 1200×630 image. **Tenant action:** replace `DEFAULT_OG`. Update the OG image `alt` text (`:90`) which currently hardcodes "halal Iraqi bakery & breakfast in Richardson, TX".
- `twitter` — `summary_large_image` card. **No Twitter handle is wired today.** If tenant #2 has a handle, add `creator`/`site` fields.
- `icons` / `manifest` — `/icon.png`, `/apple-touch-icon.png`, `/manifest.json`.
- `other.theme-color` — `#8B1A1A`. Duplicated in `layout.tsx:53` (`<meta name="theme-color">`) and `manifest.json:8`. Three-way swap.

Root layout extras (`src/app/layout.tsx:50-74`):
- `<html lang="en">` — change for non-English tenants.
- 4 explicit `<link rel="icon">` / `apple-touch-icon` tags. Filenames hardcoded.
- `<SchemaInjector>` runs `organizationSchema`, `websiteSchema`, `localBusinessSchema` on every page — no tenant change needed (inputs come from data files).

---

## 5. Sitemap — `src/app/sitemap.ts`

Build-time generator (`src/app/sitemap.ts:1-52`) — replaces the old hand-maintained `public/sitemap.xml`.

What a tenant edits:
- `STATIC_ROUTES` (`:12-21`) — array of `{ path, priority, changeFrequency }`. Add or remove if your tenant has different top-level pages. Current 8 entries: `/`, `/menu/`, `/our-story/`, `/iraqi-cuisine/`, `/bakery/`, `/catering/`, `/near/`, `/specialties/`.
- Dynamic entries come for free from `NEIGHBORHOODS` and `SPECIALTIES`. Update those data files and the sitemap follows.
- Base URL: comes from `RESTAURANT.url`. No edits here.

When the mesh route lands (currently held back — see `src/data/matrix.ts`), add a third map for `MATRIX_ALLOWLIST.map((e) => /${meshSlug(e.dishSlug, e.citySlug)}/)`.

---

## 6. Environment variables — `.env.local.example`

All are `NEXT_PUBLIC_*` because this is a static export — there is no server runtime to hold secrets.

| Var | Purpose | Required? | Where it surfaces |
|---|---|---|---|
| `NEXT_PUBLIC_REVIEW_API_URL` | TableTurnerr ParentSite endpoint base. Reviews and catering form POST here. | Required for forms to submit | `ReviewModal.tsx:12`, `CateringForm.tsx:107` |
| `NEXT_PUBLIC_REVIEW_API_KEY` | Auth token for the above endpoint. Example `ttk_replace_me`. | Required for forms to submit | Same as above |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile public site key. Gates the review modal + catering form. Test key `1x00000000000000000000AA` always passes. | Required for forms to render | `ReviewModal.tsx:14`, `CateringForm.tsx:8` |
| `NEXT_PUBLIC_PHONE` | Display phone (e.g. `(469) 547-2042`) | Optional (file has a fallback at `restaurant.ts:26`) | `RESTAURANT.phone` everywhere |
| `NEXT_PUBLIC_PHONE_RAW` | `tel:` link form (`+14695472042`) | Optional (fallback at `:27`) | `tel:` links + `QRHover` |
| `NEXT_PUBLIC_EMAIL` | Contact email | Optional (fallback at `:28`) | Header CTA, footer, schema |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL | Optional (fallback at `:62`) | `RESTAURANT.socials.instagram` |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook page URL | Optional (fallback at `:64`) | `RESTAURANT.socials.facebook` |
| `NEXT_PUBLIC_GOOGLE_BUSINESS_URL` | GBP listing URL | Optional (fallback at `:66`) | `RESTAURANT.socials.googleBusinessProfile` |
| `NEXT_PUBLIC_GOOGLE_REVIEW_URL` | Direct "Write a review" Google URL | Optional (fallback at `:68`) | Reviews CTAs |
| `NEXT_PUBLIC_ORDER_ONLINE_URL` | Online ordering destination | Optional (fallback at `:72`) | "Order Online" CTAs |
| `NEXT_BASE_PATH` | Set on the build env to deploy under a sub-path (e.g. `/al-baghdady`). | Optional | `next.config.ts:9` |

Production pattern: set every `NEXT_PUBLIC_*` value at build time; leave the in-file fallbacks pointing at the same canonical value so local dev still works without `.env.local`.

---

## 7. Acceptable hardcodes (do not chase)

These are page-local process/UI copy, not brand-specific. Future-you can ignore them.

- **`src/app/catering/page.tsx`** — `SERVICES` and `STEPS` arrays describe the catering workflow (weddings/corporate/Ramadan, "how it works" steps). Same workflow applies to any restaurant; rewrite only if the catering process actually differs.
- **`src/app/not-found.tsx`** — `QUICK_LINKS` array (Menu / Our Story / Catering). Route-based, UI copy, not brand-specific. The "404 · Off the Menu" eyebrow and "This dish isn't on our menu" copy are restaurant-genre puns — acceptable for any food tenant.
- **`src/app/error.tsx`** — "Something burned in the oven" copy. Same — food-genre flavor text.
- **`src/app/iraqi-cuisine/page.tsx`** — `SPECIALTY_LINKS` map (8 entries) maps dish names to `/specialties/<slug>/` URLs. Tightly coupled to the page-local `DISHES` array (see §8). Will be replaced together when that array moves.
- **`src/components/shared/SmartImage.tsx`** — image renderer with shimmer skeleton. No tenant content.
- **`src/components/shared/QRHover.tsx`**, **`ThemeBtn.tsx`**, **`TabTitleHandler.tsx`** — pure UI primitives.
- **`src/styles/globals.css`** utility classes (`.btn-primary`, `.card`, `.section-pad`, `.eyebrow`, etc.) below the `@theme` block — design system, not brand. Tenant tweaks tokens, not class definitions.

---

## 8. Known remaining hardcodes (must fix before tenant #2)

Re-listed from `docs/site-audit-2026-05-18.md` plus a fresh sweep. The audit's blockers (global-error phone, footer About paragraph) are already fixed in the current tree.

| File:line | Hardcode | Severity | Action |
|---|---|---|---|
| `src/app/our-story/page.tsx` | Narrative prose: 13 occurrences of "Al-Baghdady", "Richardson", "Baghdad", "samoon", "baklava", "kunafa". Years "1919" and "2012" inline. | Should-fix | Page-local prose is OK to keep, but a tenant rewriting the page should template years against `RESTAURANT.familyRecipeSince` / `RESTAURANT.founded` to prevent drift. |
| `src/app/iraqi-cuisine/page.tsx:42-…` | `DISHES` array — 12 hardcoded cuisine entries (samoon, kahi & qeimar, baqila, kubba, kanafa, baklava, mabrouma, burma, ladyfingers, awama, fatayer, manakish). `SPECIALTY_LINKS` map above it. Cuisine copy also reused in `metadata.title` / `description` (`:11-13`). | Should-fix before tenant #2 of a different cuisine | Extract to a new `src/data/cuisine.ts` data file with the same shape; collapse `SPECIALTY_LINKS` into the same records. Page becomes a generic cuisine-guide renderer. |
| `src/data/metadata.ts:52-56` | `createMetadata` brand auto-append checks hardcoded literals "Al-Baghdady", "Al Baghdady", "Albaghdady". | Should-fix | Replace with a comparison against `RESTAURANT.name` only; or accept the brand variants from a `RESTAURANT.brandNameVariants[]` field. |
| `src/data/metadata.ts:90` | OG image `alt` hardcodes "halal Iraqi bakery & breakfast in Richardson, TX". | Should-fix | Build from `RESTAURANT.name` + `RESTAURANT.tagline`. |
| `src/data/metadata.ts:6` | `DEFAULT_OG = /Images/hero.webp` (no dedicated 1200×630 card). | Should-fix | Ship a real branded OG card per tenant. |
| `public/manifest.json:10-19` | Hardcoded `name`, `short_name`, `description`, `background_color`, `theme_color`, icon paths. Mismatched MIME (`type: image/png` on WebP files). | Should-fix | Regenerate per tenant; pull values from `RESTAURANT` at build time via a small script, or accept the per-tenant edit. |
| `src/app/layout.tsx:53` | `<meta name="theme-color" content="#8B1A1A">` literal — duplicate of `metadata.ts:107` and `manifest.json:8`. | Should-fix | Centralize. Either three-way swap manually or refactor to read from a single token. |
| `src/data/specialties.ts:20-21` (note) | 7 of 11 specialties reuse non-dedicated photos. | Cosmetic | Drop `/Images/specialties/<slug>.webp` per topic as photography lands. |
| `src/data/dishes.ts` | All 7 dishes have empty `intro` / `body` / `keywords`. | Blocking for mesh launch only | Populate after Tuesday 2026-05-19 confirmation; see `matrix.ts` rollout. |

---

## 9. Mechanical onboarding checklist — tenant #2

Follow top to bottom. Each step is independent unless noted.

1. **`src/data/restaurant.ts`** — replace every field. NAP, hours, geo, socials, cuisine, areas, ratings, brand strings.
2. **`src/data/menu.ts`** — replace `MENU` wholesale with the new menu's categories and items.
3. **`src/data/neighborhoods.ts`** — replace all `NEIGHBORHOODS` entries. Slugs become `/near/<slug>/` URLs.
4. **`src/data/specialties.ts`** — replace all `SPECIALTIES` entries. Slugs become `/specialties/<slug>/` URLs. Update `relatedMenuItemNames` to match item names in the new `menu.ts` exactly.
5. **`src/data/faqs.ts`** — rewrite the FAQ array. Use `${RESTAURANT.…}` interpolation for NAP-y answers.
6. **`src/data/reviews.ts`** — replace `REVIEWS` with real reviews from the new tenant's profile. Update `PRESS_QUOTES`.
7. **`src/data/schema.ts`** — update the constants at the top: `CANONICAL_NAME`, `ALTERNATE_NAMES`, `KEYWORDS_STRING`, `KNOWS_ABOUT`, `AMENITY_FEATURES`, `PRIMARY_IMAGES`. Do **not** touch the generator functions.
8. **`src/data/metadata.ts`** — update `DEFAULT_OG`, `BASE_KEYWORDS`, the brand auto-append literals (`:52-56`), and the OG `alt` text (`:90`).
9. **`src/data/dishes.ts` + `src/data/matrix.ts`** — leave empty until the mesh is greenlit for this tenant.
10. **`src/styles/globals.css`** — update the `@theme` block (`:3-27`) AND the duplicated `:root` block (`:29-41`). Change `--color-primary`, `--color-gold`, fonts, and any token the new brand needs.
11. **`src/app/layout.tsx`** — swap Inter / Fraunces imports if the brand uses different fonts (`:3`, `:18-31`, `:51`). Update `<html lang>` if non-English. Update the `<meta name="theme-color">` literal (`:53`).
12. **`public/manifest.json`** — replace `name`, `short_name`, `description`, `background_color`, `theme_color`. Fix the icon MIME if you regenerate as PNG.
13. **Replacement assets** — drop into `/public/Images/`:
    - `logo.webp` — new brand logo (~256×256).
    - `hero.webp` — wide hero photo.
    - `bakery.webp` (or rename in `menu.ts` / specialty references), `storefront.webp`, `dish-1`…`dish-4.webp`.
    - `/Images/gallery/*.webp` — replace the 15 gallery files; or remove and update `PRIMARY_IMAGES` in `schema.ts`.
    - `/Images/specialties/<slug>.webp` — one per specialty.
    - `/Images/instagram/post-{1..6}.webp` — Instagram strip.
    - `/Images/menu/*.webp` — category card images referenced from `menu.ts`.
    - **OG card** at the path you set in `metadata.ts` `DEFAULT_OG` — 1200×630.
14. **Favicons** — replace `/public/favicon.ico`, `favicon-32.png`, `favicon-192.webp`, `favicon-512.webp`, `apple-touch-icon.png`, and `src/app/icon.png`.
15. **`cp .env.local.example .env.local`** — fill in the 11 `NEXT_PUBLIC_*` keys for the new tenant. Provision a fresh Cloudflare Turnstile site key and a fresh TableTurnerr API key per tenant.
16. **`public/robots.txt`** — confirm it doesn't block anything you want indexed (currently allows everything; spot-check Sitemap URL).
17. **`npm install`** (warning about multiple lockfiles is expected).
18. **`npm run build`** — must pass. Linter + type-check + static export of all routes. If `restaurant.ts` is missing required fields, schema generators will throw here.
19. **`npm run serve-out`** — visual check at `http://localhost:3000`. Walk: `/`, `/menu/`, `/bakery/`, `/catering/`, `/our-story/`, `/iraqi-cuisine/` (or replacement), `/near/`, one `/near/<slug>/`, `/specialties/`, one `/specialties/<slug>/`, `/non-existent/` (404), force an error (`/error/`).
20. **Validate** — run the homepage and one of each dynamic route type through Google's Rich Results Test and Schema Markup Validator. Check the canonical URL, OG card preview, and that the AggregateRating renders.
