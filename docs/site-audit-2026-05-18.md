# Site audit — 2026-05-18

Pre-mesh audit of every current route. Read-only pass; no edits made.
Driving question: **what must be true before we start scaffolding `/[dish]-in-[city]/` and turning these sites into rentable templates?**

## Summary

- **One real template-readiness blocker:** `src/app/global-error.tsx` hardcodes the phone number in three places (`:145`, `:147`, `:157`). Must pull from `RESTAURANT`.
- **CLAUDE.md is stale on the route count** — says 7 `/near/[city]/` pages (actually 10) and doesn't mention the `/near/` index or `/specialties/` + `/specialties/[topic]/`. Update when we touch CLAUDE.md next.
- **Two routes exist that the brief didn't list:** `/near/` (neighborhoods index) and `/specialties/` + `/specialties/[topic]/` (11 topic pages). Both are healthy, already in sitemap, and produce schema. They're prior art for the mesh structure.
- **Footer description and OG image** are the only meaningful non-data hardcodes outside the error pages. Neither blocks template reuse but both are worth fixing before tenant #2.
- **Sitemap is hand-maintained.** Currently in sync (24 URLs, all reachable). Mesh rollout will multiply this by ~70× — we should generate it from data before that lands, not after.

## Global

### Layout / Header / Footer

- `src/app/layout.tsx` — Calls `createMetadata()`, injects `organizationSchema`, `websiteSchema`, `localBusinessSchema`. Theme color, manifest, format-detection all set. Clean.
- `src/components/layout/Header.tsx` — All copy via `RESTAURANT`; nav URLs all trailing-slashed; mobile toggle in place. No drift.
- `src/components/layout/Footer.tsx:31` — Footer "About" paragraph is a hand-written string (mentions samoon, baklava, kunafa, mabrouma, Richardson by name). Not pulled from `RESTAURANT.shortDescription` or `longDescription`. Doesn't break tenants, but it's the largest non-data string in the layout.
  - **Action:** add `RESTAURANT.footerDescription` (or reuse `longDescription`) and render it.

### Data layer (`src/data/`)

| File | State | Notes |
|---|---|---|
| `restaurant.ts` | Healthy | NAP, hours, socials, geo, areas, rating/review counts, env-driven secrets. |
| `menu.ts` | Healthy, bakery-only | 7 board categories. No kabob/shawarma/mains. No TODOs. |
| `neighborhoods.ts` | **10 entries, not 7** (CLAUDE.md is stale) | plano-tx, garland-tx, addison-tx, north-dallas-tx, allen-tx, mckinney-tx, far-north-dallas-tx, irving-tx, carrollton-tx, frisco-tx. |
| `specialties.ts` | 11 entries | bread, chai, burma, lady-fingers, samosa, kunafa, baklava, breakfast, manakish, fatayer, halal-food. Some images still use `/Images/gallery/` placeholders per the in-file note at `:20`. |
| `schema.ts` | Comprehensive | `Organization`, `Restaurant`, `LocalBusiness`, `Menu`, `FAQPage`, `BreadcrumbList`, `Article`, `WebPage`, `CateringService`, `ItemList` (specialties + service areas). `alternateName` lists 11 brand variants for Knowledge Graph consolidation. |
| `metadata.ts` | One TODO at `:5` | Default OG image is `/Images/hero.webp`. Awaiting a real 1200×630 card. |
| `faqs.ts` | Healthy | 18 FAQs, markdown links stripped for schema, trailing slashes consistent. |
| `reviews.ts` | Healthy | 5 real Google reviews. |

### Sitemap / config / version

- `public/sitemap.xml` — 24 URLs, all `lastmod=2026-05-13`. In sync with current routes. All 10 neighborhoods present; all 11 specialty topics present. Manually maintained — **this is the part most likely to drift once mesh lands.**
- `next.config.ts` — `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`, `basePath` env-overridable. Correct.
- `package.json` — v1.31, Next 15.5.16, React 19, Tailwind 4.2.4, sharp 0.34.5.

## Per-page

### `/` — Homepage
- **SEO:** `createMetadata()` ✓. Injects `restaurantSchema`, `faqSchema` (6 FAQs), `webPageSchema`. Single H1 (hero), H2s on every section. Internal links all trailing-slashed. Hero image is `SmartImage` with `priority`.
- **Content:** Brand voice consistent. `FeaturedDishes` filters `MENU` for `popular: true` — auto-tracks menu repositioning. Press quote (D Magazine "treasure") in place.
- **UX:** `ActionCards` for order/menu/catering, `QRHover` for scan-to-order, `Reviews` carousel, `OurLocation` map block.
- **Template-readiness:** All strings via `RESTAURANT`. Clean.
- **Verdict:** Ship.

### `/menu/`
- **SEO:** `createMetadata()` ✓. `menuSchema`, `breadcrumbSchema`, `webPageSchema`. H1 "Authentic Iraqi Cuisine & Bakery", H2 per category.
- **Content:** All 7 categories, breakfast service callout (10am–12:30pm except Monday) sourced from `RESTAURANT.breakfastHours`.
- **UX:** Sticky `CategoryNav` (client), 3-col grid on lg, dietary badges.
- **Template-readiness:** Fully data-driven.
- **Verdict:** Ship.

### `/bakery/`
- **SEO:** `createMetadata()` ✓. `breadcrumbSchema`, `webPageSchema`. H1, three H2s.
- **Content:** "Four Generations · Since 1919" narrative, family bakery framing. Featured items filtered from `MENU` `bakery-sweets` popular. Links to 7 specialty pages.
- **UX:** Two-column featured grid, three-column specialty grid, custom-tray CTA section linking to `/catering/`.
- **Template-readiness:** Clean.
- **Verdict:** Ship.

### `/catering/`
- **SEO:** `createMetadata()` ✓. `cateringServiceSchema`, `breadcrumbSchema`, `webPageSchema`. H1, H2s.
- **Content:** Eid/wedding/Ramadan/corporate framing. `SERVICES` and `STEPS` arrays are page-local but describe process, not brand — acceptable hardcodes.
- **UX:** Two-column layout, mailto-based `CateringForm`.
- **Template-readiness:** Process copy is page-local. Form is reusable.
- **Verdict:** Ship.

### `/iraqi-cuisine/`
- **SEO:** `createMetadata()` ✓. `breadcrumbSchema`, `webPageSchema`. H1, 12 H2s (one per dish).
- **Content:** 12 dish entries (samoon, kahi & qeimar, baqila, kubba, kanafa, baklava, mabrouma, burma, ladyfingers, awama, fatayer, manakish). `SPECIALTY_LINKS` map crosslinks to `/specialties/[slug]/`.
- **UX:** Alternating image/text cards, 6 reused gallery images cycling — visually thin if a user scrolls the whole page.
- **Template-readiness:** `DISHES` array is page-local reference content. Could move to a new data file (`cuisine.ts`) to be tenant-swappable, but currently acceptable.
- **Verdict:** Ship. *Flag for mesh:* this page overlaps conceptually with `/specialties/` — confirm with client whether both stay, or `/iraqi-cuisine/` becomes the cuisine hub and specialties become children.

### `/our-story/`
- **SEO:** `createMetadata()` ✓. `breadcrumbSchema`, `webPageSchema`, `articleSchema` (author: Salah Hassan). H1, ~6 H2s.
- **Content:** Baghdad 1919 → Texas 2012 → ضيافة (diyafa / hospitality) arc. Years "1919" and "2012" are hardcoded in prose but match `RESTAURANT.familyRecipeSince` / `foundingDate`.
- **UX:** Single column prose with one hero image (priority).
- **Template-readiness:** Prose copy is page-local and intentionally narrative. Years could be templated.
- **Verdict:** Ship.

### `/near/` — Service areas index
- **SEO:** `createMetadata()` ✓. `breadcrumbSchema`, `serviceAreasItemListSchema` (`ItemList`), `webPageSchema`. H1 single.
- **Content:** Intro + grid of 10 neighborhood cards from `NEIGHBORHOODS`.
- **UX:** 3-col grid on lg, hover lift, "Visit page →" CTA per card.
- **Template-readiness:** Fully data-driven.
- **Verdict:** Ship.

### `/near/[city]/` — Neighborhood pages (×10)
- **SEO:** `generateStaticParams` over `NEIGHBORHOODS` ✓. `generateMetadata` dynamic from `n.metaTitle/metaDescription/keywords`. Injects global `restaurantSchema`, dynamic `breadcrumbSchema`, `webPageSchema`. H1 dynamic, ~4 H2s.
- **Content:** Hero, intro, body, popular dishes, address/drive-time block, "Other DFW Neighborhoods" cross-links to the 9 siblings.
- **UX:** Two-column hero, image with `priority`, warm-white detail section.
- **Template-readiness:** All from `NEIGHBORHOODS`. Direct prior art for `/[dish]-in-[city]/`.
- **Verdict:** Ship. *Mesh note:* the "Other Neighborhoods" cross-link pattern is exactly what the dish×city pages will need.

### `/specialties/`
- **SEO:** `createMetadata()` ✓. `specialtiesListSchema` (`ItemList`), `breadcrumbSchema`, `webPageSchema`. H1 single.
- **Content:** Intro + 11 cards from `SPECIALTIES`.
- **UX:** 3-col grid, hover state, excerpt + "Learn more".
- **Template-readiness:** Fully data-driven.
- **Verdict:** Ship.

### `/specialties/[topic]/` — Specialty pages (×11)
- **SEO:** `generateStaticParams` over `SPECIALTIES` ✓. Dynamic `generateMetadata`. `breadcrumbSchema`, `webPageSchema`, `articleSchema`, conditional `faqSchema`, conditional `relatedItemsSchema`. H1 dynamic, H2s from `primaryBlock`/`pickupBlock`/related items/FAQ section.
- **Content:** Hero + primary block + related menu items + pickup block + optional FAQs.
- **UX:** Two-column hero, related-items grid, optional FAQ accordion.
- **Template-readiness:** All from `SPECIALTIES`. **This is the closest analog to the planned `/[dish]-in-[city]/` route — reuse its shape.**
- **Verdict:** Ship.

### `/404` — `app/not-found.tsx`
- **SEO:** `noindex: true` ✓. No schema (correct for 404).
- **Content:** Brand-themed copy ("This dish isn't on our menu", "the bread is still warm"). Quick links to `/`, `/menu/`, `/our-story/`, `/catering/`. Phone via `RESTAURANT`.
- **UX:** Centered, animated decorative gradients, clear CTAs.
- **Verdict:** Ship.

### `/error` — `app/error.tsx`
- **SEO:** No metadata (correct — error boundary).
- **Content:** Brand-themed ("Something burned in the oven"). Error digest exposed for debugging. Reset CTA + home link + phone.
- **UX:** Centered, gradients, clear actions.
- **Verdict:** Ship.

### `app/global-error.tsx` — **Needs fix**
- **Blocker for template-readiness:** phone is hardcoded at three lines:
  - `:145` — `<QRHover value="tel:+14695472042">`
  - `:147` — `href="tel:+14695472042"`
  - `:157` — display text `(469) 547-2042`
- **Fix:** import `RESTAURANT` and use `RESTAURANT.phoneRaw` (with `tel:+1` prefix or stored as `tel:` URL) and `RESTAURANT.phone` for display.

## Issues by severity

### Blockers (must fix before mesh launches under a second tenant)

1. **`src/app/global-error.tsx` hardcodes phone** at `:145`, `:147`, `:157`. Replace with `RESTAURANT.phoneRaw` / `RESTAURANT.phone`.

### Should-fix before mesh launches

2. **Sitemap is manually maintained.** Currently in sync, but the mesh will add ~70 routes (10 cities × 7 dishes) and continue to grow. Generate `sitemap.xml` at build time from `RESTAURANT.url` + route data files. Do this before scaffolding the mesh route, not after.
3. **Footer "About" paragraph is hardcoded** at `src/components/layout/Footer.tsx:31`. Move into `RESTAURANT` (e.g. `footerDescription`) or reuse `longDescription`.
4. **CLAUDE.md route count is stale** — says 7 `/near/[city]/` pages (actually 10) and doesn't mention `/near/` index or `/specialties/` routes. Update next time CLAUDE.md is touched.

### Nice-to-have

5. **OG image is the hero photo, not a branded card.** `src/data/metadata.ts:5` carries the TODO. Ask client for a real 1200×630 OG card before promoting links.
6. **Specialty images** — some still `/Images/gallery/` placeholders per the note at `src/data/specialties.ts:20`. Swap when client provides photography.
7. **`/iraqi-cuisine/` reuses 6 gallery images** cycled across 12 dishes. Visually thin on scroll; would benefit from dish-specific photos once available.
8. **`/our-story/`** hardcodes "1919" and "2012" in prose. Could template against `RESTAURANT.familyRecipeSince` / `foundingDate`. Low priority.
9. **Conceptual overlap:** `/iraqi-cuisine/` and `/specialties/` cover similar ground. Confirm with client whether to keep both, redirect one, or restructure as parent/child.

## Template-readiness checklist

Catalogue of restaurant-specific strings found outside `/src/data/`:

| File:line | String | Severity | Action |
|---|---|---|---|
| `src/app/global-error.tsx:145, 147` | `tel:+14695472042` | Blocker | Use `RESTAURANT.phoneRaw` |
| `src/app/global-error.tsx:157` | `(469) 547-2042` (display) | Blocker | Use `RESTAURANT.phone` |
| `src/components/layout/Footer.tsx:31` | Footer "About" paragraph (mentions samoon, baklava, kunafa, mabrouma, Richardson) | Should-fix | Add `RESTAURANT.footerDescription` |
| `src/app/our-story/page.tsx` | Years "1919", "2012" in narrative | Nice-to-have | Template against `RESTAURANT.familyRecipeSince` / `foundingDate` |
| `src/app/iraqi-cuisine/page.tsx:25–102` | `DISHES` array (12 dish entries) | Acceptable for now | If we ever swap tenants with different cuisine, extract to `src/data/cuisine.ts` |
| `src/app/catering/page.tsx` | `SERVICES`, `STEPS` arrays | Acceptable | Process copy, not brand-specific |
| `src/app/not-found.tsx` | `QUICK_LINKS` | Acceptable | UI copy, route-based |

Everything else is already data-driven via `RESTAURANT`, `MENU`, `NEIGHBORHOODS`, `SPECIALTIES`, `FAQS`, `REVIEWS`, `schema.ts`, `metadata.ts`.

## Mesh-rollout implications

Based on the audit, before `/[dish]-in-[city]/` lands:

1. **Convert sitemap generation to build-time.** Pull from `RESTAURANT.url` + the four route-driving arrays (`NEIGHBORHOODS`, `SPECIALTIES`, future `DISHES`, plus static routes). Without this, every dish×city PR will require a 70+-line sitemap edit.
2. **Fix `global-error.tsx`.** Small, blocking, do it first.
3. **Confirm `/iraqi-cuisine/` vs `/specialties/` overlap with client** before the dish axis lands — the mesh sits on top of the dish axis, so we need a clean conceptual model.
4. **Reuse `/specialties/[topic]/` as the structural template** for `/[dish]-in-[city]/`. It already handles dynamic params, dynamic metadata, conditional FAQ/related schema, and breadcrumbs.
5. **Reuse `/near/[city]/`'s "other neighborhoods" cross-link pattern** for the dish×city mesh's internal linking.

---

## Second-pass deepening (2026-05-18)

Re-walked thin per-page sections with a Lighthouse-class lens and a template-string sweep. Two first-pass findings need correction up front.

### Corrections to first pass

- **`global-error.tsx` is already fixed.** First pass listed phone hardcodes at `:145`, `:147`, `:157` as a Blocker. As of HEAD it imports `RESTAURANT` and uses `RESTAURANT.phoneRaw` at `src/app/global-error.tsx:146,148` and `RESTAURANT.phone` at `:158`. The only remaining hardcodes in that file are the maroon `#8B1A1A` swatch at `:44` and gold `#A88838` at `:73,75` (inline styles — can't reference CSS vars because this is the html-root fallback that runs without globals.css), and the brand-agnostic prose at `:47,59`. **No longer a blocker.** Should-fix list (#2 sitemap, #3 footer) is also outdated — see below.
- **Footer "About" paragraph is already fixed.** First pass flagged `Footer.tsx:31` as a hand-written hardcoded paragraph (Should-fix #3). As of HEAD `:31` reads `{RESTAURANT.footerDescription}`, sourced from `src/data/restaurant.ts:9-10`. **No longer an issue.** The Footer still has the wordmark "Al-Baghdady" hardcoded at `:28` and copyright "Al-Baghdady Restaurant & Bakery" at `:164,175` — see template sweep below.
- **`RESTAURANT.foundingDate` does not exist.** First-pass nice-to-have #8 suggested templating "1919/2012" against `RESTAURANT.familyRecipeSince` / `foundingDate`. The actual field is `RESTAURANT.founded` (`restaurant.ts:37`), not `foundingDate`. `familyRecipeSince` does exist (`:38`). Use those names when actioning.

### Homepage `/` (deepened 2026-05-18)

- **LCP candidate:** Hero baklava image at `src/components/home/HeroBanner.tsx:75-81` — `SmartImage` with `priority` (which sets `loading="eager"` + `fetchPriority="high"` via `SmartImage.tsx:63,65`). Container has `aspect-[4/5]` so the slot is reserved. **Assessment: good.** The image is above the fold on desktop (right column) but on mobile it's the second column and pushes below the H1, headline copy, buttons, ratings, breakfast hours — so on mobile the LCP element is more likely the H1 text node at `HeroBanner.tsx:23-32`, not the image. Worth measuring; the `priority` hint is still correct for desktop.
- **CLS risk — `HeroStatusBadge`:** The "Open Now / Breakfast Now" pill at `HeroStatusBadge.tsx:84-161` mounts after hydration (it's `useEffect`-driven), but `:97-104` correctly renders a same-sized skeleton (`min-w-[9rem]`, two pulse bars) so layout is stable. **Clean.**
- **CLS risk — Instagram tiles:** `InstagramSection.tsx:96-99` computes per-tile heights (`360 / 460 / 300`) based on `hoveredId` state. On first render `hoveredId === null` so every tile is 360px — stable. Hover-driven height changes happen after user input so they don't count toward CLS. The `columns` `useEffect` at `:60-69` runs `setColumns(...)` based on `window.innerWidth` and **will shift layout once on hydration** if the SSR snapshot (which defaults to `columns = 3`, `useState(3)` at `:58`) doesn't match. On a phone (`< 640px`) hydration drops 3 cols → 1 col, which is a real CLS event below the fold. Low priority but worth noting.
- **CLS risk — Gallery:** `Gallery.tsx:117-161` uses `lg:auto-rows-[220px]` plus explicit `aspect-square lg:aspect-auto` per tile. Heights are reserved. **Clean.**
- **CLS risk — FeaturedDishes:** `FeaturedDishes.tsx:124-128` horizontal scroller with fixed `w-[280px] md:w-[320px]` cards and `aspect-[4/3]` image slots (`:135`). **Clean.**
- **CLS risk — OurLocation iframe:** `OurLocation.tsx:20-33` map iframe has `aspect-video lg:aspect-auto lg:min-h-[440px]` plus `style={{ minHeight: 440 }}`. Slot reserved. **Clean.**
- **Alt-text completeness:**
  - Hero image alt is rich and descriptive (`HeroBanner.tsx:77`): "Fresh pistachio baklava on a plate at Al-Baghdady, an Iraqi bakery in Richardson, TX". Good.
  - BakerySpotlight alt at `BakerySpotlight.tsx:11` describes scene. Good.
  - All 9 Gallery images have rich descriptive alt text (`Gallery.tsx:13-58`). Good.
  - 6 Instagram tiles use the caption string as alt at `InstagramSection.tsx:122` — captions are marketing copy not image descriptions ("#dfweats #foodiefinds #yum"). **Gap.** Alt should describe the image, not repeat hashtags.
  - FeaturedDishes alt at `FeaturedDishes.tsx:138` is `${dish.name} at Al-Baghdady` — minimal, not scene-descriptive. Acceptable for a thumbnail.
  - Decorative gradients use `aria-hidden="true"` consistently (e.g. `HeroBanner.tsx:48-55` star icons are aria-hidden via Lucide default; the gradient divs use it explicitly).
- **Internal anchor density:** Hero (2 CTAs) + ActionCards (2 external) + 6 featured-dish cards (no links per card, only `View Full Menu`) + BakerySpotlight (2) + Gallery (button-based, lightbox only, **0 internal navigations**) + 6 Reviews (no links per review) + Reviews CTA (1 to `/?review=open`, 1 external Google) + 6 Instagram tiles (all external) + 6 FAQ items (no links unless answers contain markdown) + OurLocation (1 directions, external). **Roughly 8–12 internal anchors on a long page** — low for a hub. Hub-strength gain would come from per-FAQ deep-links and per-Review byline links, plus Gallery captions linking to relevant specialty pages.
- **Template strings outside /src/data/:**
  - `HeroBanner.tsx:22` — `"Iraqi Bakery & Café · Halal · Family-Owned Since 2012"` (hard)
  - `HeroBanner.tsx:31` — `"Baklava<br />in All of Richardson, Texas"` (hard, in H1)
  - `HeroBanner.tsx:34` — full intro paragraph mentions "Richardson, TX, Albaghdady…since 2012…since 1919" (hard)
  - `HeroBanner.tsx:77` — alt mentions Al-Baghdady + Iraqi + Richardson (hard)
  - `HeroBanner.tsx:92` — `1919` in "Since" badge (hard; should use `RESTAURANT.familyRecipeSince`)
  - `TrustBar.tsx:6,7` — `"Authentic Iraqi"`, `"Since 2012"` in `ITEMS` array (hard)
  - `BakerySpotlight.tsx:11` — alt "Iraqi…Al-Baghdady bakery" (hard)
  - `BakerySpotlight.tsx:18,21` — eyebrow `"Since 1919 · Four Generations"`, body mentions "since 1919" (hard)
  - `Gallery.tsx:41,46` — two alt strings include "Al-Baghdady" (hard)
  - `Gallery.tsx:112` — caption mentions "since 1919" (hard)
  - `InstagramSection.tsx:17-54` — entire `POSTS` array is page-local content (URLs, captions, image paths) (hard; candidate for `src/data/instagram.ts`)
  - `InstagramSection.tsx:82,161-164,193` — `@albaghdadyrestaurant` handle hardcoded 4× (hard; should derive from `RESTAURANT.socials.instagram`)
  - `OurLocation.tsx:16` — `"Visit us in Richardson."` H2 (hard)
  - `OurLocation.tsx:22` — iframe title `"Al-Baghdady Restaurant location map"` (hard)
  - `OurLocation.tsx:68-70` — three hardcoded hours rows (`Mon–Thu · 11 AM – 10 PM`, etc.) — **data drift:** `RESTAURANT.hours` has Mon-Thu opening at 10:00, not 11:00, and Sunday is `10:00`–`22:00`, not `12 PM – 10 PM`. **Hard hardcode + factually inconsistent with the data file.**
  - `FeaturedDishes.tsx:138` — alt suffix `at Al-Baghdady` (hard)

### `/menu/` (deepened 2026-05-18)

- **LCP candidate:** No hero image on this route. LCP is almost certainly the H1 at `src/app/menu/page.tsx:67` ("Authentic Iraqi Cuisine & Bakery") or the eyebrow div above it. Text LCP — no image priority needed.
- **CLS risk:** `CategoryNav` is a client component (`src/components/menu/CategoryNav.tsx`) mounted between the intro and the first category section. If it renders nothing on SSR and hydrates into a sticky bar, it would push content. Need to confirm — but the page already has `scroll-mt-[152px]` on every category section (`:98`), implying CategoryNav is the source of that 152px offset and is expected to be present at SSR. Menu item card images are inside `MenuItemCard` which itself doesn't render an image (no `card-img` block) — so there are no image-driven layout shifts on this page.
- **Alt-text completeness:** No `<img>` or `SmartImage` calls in the menu page itself. `MenuItemCard.tsx` is text-only. **No alt-text surface.**
- **Internal anchor density:** 7 category-nav anchors (in `CategoryNav`) + 1 `Order Online` external + 1 `Catering` internal + 1 per item × ~30 items as text-only cards (none link out unless `href` is passed — and the menu page does **not** pass `href`, see `:106`). **Net internal anchors: ~2 plus the category-nav.** Items themselves are dead-ends. Linking each menu item to its specialty page (where one exists) would densify substantially.
- **Template strings outside /src/data/:**
  - `menu/page.tsx:24,26,50,52` — title/description repeat "Al-Baghdady…Iraqi…Richardson TX" (hard, but these are metadata strings; acceptable as template inputs)
  - `menu/page.tsx:67` — H1 `"Authentic Iraqi Cuisine & Bakery"` (hard)
  - `menu/page.tsx:69-71` — intro mentions "Iraqi spices…samoon bread" (hard)

### `/bakery/` (deepened 2026-05-18)

- **LCP candidate:** No `priority` image on this route — the first image is inside the `featuredBakeryItems.map` (`src/app/bakery/page.tsx:91-96`) and uses default lazy loading. Above-the-fold is the H1 at `:76` and the intro paragraphs at `:77-82` — LCP is the H1 text. The 3-up bakery card grid begins after the intro section. **Recommend marking the first card's image with `priority` if it lands in the initial viewport on common breakpoints.**
- **CLS risk:** All image slots use `aspect-[4/3]` (`:90`). All grids are pre-sized. **Clean.**
- **Alt-text completeness:** All `SmartImage` calls use `alt={item.name}` (`:93`) — short but accurate. Specialty cards (`:120-139`) render no images, only text — fine.
- **Internal anchor density:** 6 featured-dish cards (no per-card links) + 7 specialty cards (each links to `/specialties/${slug}/`) + 2 CTAs (`/catering/`, `tel:`). **~9 internal anchors** — healthy for a hub.
- **Template strings outside /src/data/:**
  - `bakery/page.tsx:14` — `BAKERY_CATEGORY_IMAGE = "/Images/gallery/baklava-tiered-tray.webp"` (soft — image path)
  - `bakery/page.tsx:20-28` — `BAKERY_SPECIALTY_SLUGS` array picks 7 specific slugs (hard — `bread`, `manakish`, etc. — coupled to the cuisine; for templating should be derived from a SPECIALTIES tag or category)
  - `bakery/page.tsx:35,37,60,62` — title/description (hard; metadata)
  - `bakery/page.tsx:75` — eyebrow `"Four Generations · Since 1919"` (hard; year should template against `RESTAURANT.familyRecipeSince`)
  - `bakery/page.tsx:76` — H1 `"Our Bakery — Fresh Iraqi Sweets, Bread & Breakfast"` (hard)
  - `bakery/page.tsx:78,81` — intro paragraphs mention "Albaghdady", "since 1919", tandoor, samoon, kunafa, baklava, burma, ladyfingers, fatayer, manakish (hard; cuisine-specific copy)
  - `bakery/page.tsx:143-147` — custom-tray CTA mentions "Eid party, wedding, baby shower or corporate event…kanafa, baklava, ladyfingers and ma'amoul" (hard)

### `/catering/` (deepened 2026-05-18)

- **LCP candidate:** No hero image. LCP is the H1 at `src/app/catering/page.tsx:83`. Text LCP. The form (`CateringForm`) is a client component on the right column at lg, below H1 on mobile.
- **CLS risk:** The `CateringForm` is a client component with `Turnstile` widget embedded (per the import at `CateringForm.tsx:5`). Turnstile injects a script that mounts an iframe — if the form doesn't reserve space for it, it'll push the submit button down on hydration. Worth checking the form's Turnstile container.
- **Alt-text completeness:** Zero `<img>` or `SmartImage` calls in the catering page or `CateringForm`. **No alt-text surface.**
- **Internal anchor density:** 2 CTA-style links (form submit is mailto, not an anchor). Service list and steps are non-linked. **~1 internal anchor (`/catering/`-self is N/A).** Very low — could cross-link `Plano`, `Garland`, `Addison`, `Carrollton`, `Frisco` mentioned in `SERVICES[5]` (`:34`) to their `/near/[city]/` pages.
- **Template strings outside /src/data/:**
  - `catering/page.tsx:14,16,67,69` — title/description (hard; metadata)
  - `catering/page.tsx:28-35` — `SERVICES` array mentions Eid, weddings, Ramadan iftars, "samoon, fatayer, manakish", and a literal city list "Richardson, Plano, Garland, Addison, Carrollton, Frisco" (hard, especially the city list — overlaps `RESTAURANT.cateringAreas` at `restaurant.ts:113-114` but isn't sourced from it)
  - `catering/page.tsx:37-53` — `STEPS` array: process copy, **soft** (brand-agnostic)
  - `catering/page.tsx:46` — `"halal Iraqi spread"` inside STEPS (hard)
  - `catering/page.tsx:83` — H1 `"Iraqi Dessert Catering in Dallas — Authentic Kunafa, Baklava Trays and More"` (hard)
  - `catering/page.tsx:85,88` — intro paragraphs mention "Albaghdady…Richardson, Texas…baklava trays, kunafa platters, ladyfingers, burma, fatayer, manakish, samoon…mabrouma, awama" (hard)
  - `catering/page.tsx:123` — `"48 hours in advance"` (soft — process)

### `/iraqi-cuisine/` (deepened 2026-05-18)

- **LCP candidate:** No `priority` image on this page. The first `SmartImage` is inside the dish loop at `src/app/iraqi-cuisine/page.tsx:150-155` (lazy by default). LCP is most likely the H1 at `:132` or the first dish's H2 (`:161`). **No image-LCP — consider marking the first dish image priority** since the intro section is short (just eyebrow + H1 + lede).
- **CLS risk:** Image slots use `aspect-square` (`:149`). Grid is `md:grid-cols-3`. **Clean.**
- **Alt-text completeness:** `alt={dish.name}` at `:152` — short, dish-name only. Acceptable but not scene-descriptive ("Samoon" vs "Diamond-faceted samoon bread fresh from the tandoor"). **Mild gap** given that the same 6 images cycle through 12 dishes — many alt strings will be misleading (e.g. a "hero.webp" image cycled in for dish "Mabrouma" will carry alt "Mabrouma" but actually be a baklava plate).
- **Internal anchor density:** 8 `SPECIALTY_LINKS` (`:25-40`, "Read more about our X →" — one per dish that has a matching specialty page) + 2 CTAs at the bottom (`/menu/`, `/specialties/`). **~10 internal anchors** — healthy.
- **Template strings outside /src/data/:**
  - `iraqi-cuisine/page.tsx:11,13` — title/description (hard; metadata)
  - `iraqi-cuisine/page.tsx:25-40` — `SPECIALTY_LINKS` map keyed by dish name (hard — both keys and `label` strings reference Iraqi dishes by name)
  - `iraqi-cuisine/page.tsx:42-103` — entire `DISHES` array (12 dishes × ~80 words each = ~1000 words of page-local cuisine content) (hard; **largest single hardcoded content block on the site**)
  - `iraqi-cuisine/page.tsx:131` — eyebrow `"From Baghdad to Richardson"` (hard)
  - `iraqi-cuisine/page.tsx:132` — H1 `"Iraqi Cuisine — A Guide to the Iraqi Bakery & Breakfast Tradition"` (hard)
  - `iraqi-cuisine/page.tsx:134` — intro paragraph (hard)
  - `iraqi-cuisine/page.tsx:141` — image pool array with 6 file paths (soft — paths)

### `/our-story/` (deepened 2026-05-18)

- **LCP candidate:** Hero image at `src/app/our-story/page.tsx:56-62` — `SmartImage` with `priority` + `aspect-[16/9]` + `sizes="(min-width: 768px) 768px, 100vw"`. Single-column layout (`max-w-3xl`), image sits below H1 — H1 likely paints first, hero image is a close second. **Assessment: good.** `priority` is correctly applied.
- **CLS risk:** Hero `aspect-[16/9]` reserves slot. Prose is text-only. **Clean.**
- **Heading hierarchy:** H1 at `:54`, then 6 H2s at `:65, :70, :75, :83, :88, :93`. **Clean cascade.** No skipped levels.
- **Alt-text completeness:** Hero alt at `:58`: "Al-Baghdady Restaurant family kitchen" — generic, doesn't describe what's in the kitchen or who's pictured. **Mild gap.** "Master baker Salah Hassan kneading samoon dough in the Al-Baghdady kitchen" would be richer.
- **Internal anchor density:** 2 CTAs at `:100-101` (`/menu/`, `/catering/`). **Just 2 internal anchors on a 700-word narrative page.** Very low. This is a deep-content page that should cross-link to `/specialties/baklava/`, `/specialties/bread/` (samoon), `/specialties/kunafa/`, `/specialties/lady-fingers/` (the dishes name-checked in the prose), plus `/iraqi-cuisine/` for the hospitality framing. **Largest internal-linking gain on the site.**
- **Template strings outside /src/data/:**
  - `our-story/page.tsx:10,12` — title/description (hard; metadata)
  - `our-story/page.tsx:36,38` — articleSchema headline/description (hard)
  - `our-story/page.tsx:40` — `datePublished: "2012-01-01"` (hard — should derive from `RESTAURANT.founded`)
  - `our-story/page.tsx:41` — `authorName: "Salah Hassan"` (hard — should live in `RESTAURANT.owner` or similar)
  - `our-story/page.tsx:54` — H1 mentions "Dallas's BEST Iraqi Bakery and Breakfast Café" (hard)
  - `our-story/page.tsx:58` — alt "Al-Baghdady Restaurant family kitchen" (hard)
  - `our-story/page.tsx:65-96` — the entire narrative prose: "Baghdad", "1919", "البغدادي", "Albaghdady", "Salah Hassan", "50 years", "D Magazine", "2012", "Greenville Avenue", "Richardson", "ḍiyāfa", "samoon", "baklava", "ladyfinger", "chai", "kunafa". (hard; this is the brand's voice. Acceptable as page-local narrative but tenant-coupled.)

### `/near/` index (deepened 2026-05-18)

- **LCP candidate:** No hero image. LCP is the H1 at `src/app/near/page.tsx:68`. Text LCP.
- **CLS risk:** Card grid, no images. **Clean.**
- **Alt-text completeness:** No images. N/A.
- **Internal anchor density:** 10 neighborhood cards (1 link each = 10 internal anchors) + 2 CTAs at top. **~12 internal anchors.** Healthy for an index.
- **Template strings outside /src/data/:**
  - `near/page.tsx:13,15` — title/description; `:15` enumerates 10 cities (hard)
  - `near/page.tsx:67` — eyebrow `"Across the DFW Metroplex"` (hard)
  - `near/page.tsx:68` — H1 `"Iraqi Food, Halal Bakery & Catering — Serving DFW"` (hard)
  - `near/page.tsx:70-73` — intro mentions "Richardson" and "Dallas-Fort Worth" (hard)

### `/near/[city]/` (deepened 2026-05-18)

- **LCP candidate:** Hero image at `src/app/near/[city]/page.tsx:95-101` — `SmartImage` with `priority`, `aspect-[4/5]`, `sizes="(min-width: 1024px) 50vw, 100vw"`. **Assessment: good.** Same pattern as homepage.
- **CLS risk:** Two-column hero grid with reserved image slot. Clean.
- **Breadcrumb bug:** `[city]/page.tsx:49-53` injects a `breadcrumbSchema` with `{ name: "Service Areas", url: "/" }` — that URL should be `/near/` not `/`. The on-page `BreadcrumbNav` (`:62-67`) **drops the Service Areas crumb entirely** and renders just `Home › City`. Schema vs. visual breadcrumb are inconsistent, and schema URL is wrong. **Real bug, not just a hardcode.**
- **Alt-text completeness:** Hero alt at `:97`: `Iraqi food served from ${n.city}, ${n.state}` — generic for 10 pages that all use the same `hero.webp`. Not technically wrong but misleading (all 10 cities use the same baklava photo with alt that implies city-specific content). The shared image is itself a tenant-coupling concern.
- **Internal anchor density:** 2 hero CTAs (`/menu/`, external order) + 1 popular-dishes CTA (`/menu/`) + 1 Google Maps directions (external) + 1 catering CTA (`/catering/`) + 9 other-neighborhood chips (`/near/[other]/`) + 1 `/near/` rollup. **~14 internal anchors.** Excellent — this is the linking model the mesh should copy.
- **Template strings outside /src/data/:**
  - `[city]/page.tsx:97` — alt `"Iraqi food served from..."` (hard — "Iraqi" should pull from `RESTAURANT.servesCuisine`)
  - `[city]/page.tsx:107,111,126,139` — H2 templates with "Iraqi Food" / "Iraqi food" / "Visit Us" (hard)
  - `[city]/page.tsx:128-130` — copy mentions "samoon, kanafa", "halal" (hard, cuisine-specific)
  - `[city]/page.tsx:139` — CTA `Catering for {n.city}` (soft — uses data, just literal "Catering")
  - `[city]/page.tsx:147` — "Authentic Iraqi food, halal bakery and catering" (hard)
  - `[city]/page.tsx:156` — `Iraqi food in {other.city}` chip label (hard)

### `/specialties/` index (deepened 2026-05-18)

- **LCP candidate:** No `priority` image. The first card image at `src/app/specialties/page.tsx:84-89` is lazy. LCP is the H1 at `:68` ("Our Specialties"). Text LCP. **Consider priority on first card image** — page has very short intro (one paragraph) so the first card lands at the fold.
- **CLS risk:** Card images have `aspect-[4/3]` (`:83`). Grid sized. **Clean.**
- **Alt-text completeness:** `alt={`${s.name} at ${RESTAURANT.name}`}` at `:86` — short, brand-suffixed. Acceptable.
- **Internal anchor density:** 11 specialty cards (1 link each) + 2 CTAs at bottom. **~13 internal anchors.** Healthy.
- **Template strings outside /src/data/:** Nearly clean. Only:
  - `specialties/page.tsx:14` — title `"Our Specialties — Iraqi Sweets, Breakfast & Halal Café"` (hard — "Iraqi", "Halal")
  - `specialties/page.tsx:18-24` — keywords array hardcodes "iraqi specialties dallas" etc. (hard)
  - `specialties/page.tsx:67` — eyebrow `"Our Craft"` (soft)
  - `specialties/page.tsx:68` — H1 `"Our Specialties"` (soft — brand-agnostic)

### `/specialties/[topic]/` (deepened 2026-05-18)

- **LCP candidate:** Hero image at `src/app/specialties/[topic]/page.tsx:150-158` — `SmartImage` with `priority`, `aspect-[4/5]`. Conditionally rendered (`specialty.image &&`). **Assessment: good** when image exists; for any specialty without an image the LCP falls to the H1 at `:136`.
- **CLS risk:** Hero has `aspect-[4/5]` slot. The conditional rendering at `:150` means specialties without `image` will collapse to a single-column hero (the `lg:grid-cols-2` stays but the right column is empty) — that's a layout style decision not a CLS issue per se. **Clean.**
- **Alt-text completeness:** `alt={`${specialty.name} at ${RESTAURANT.name}`}` at `:153` — short. Acceptable.
- **Internal anchor density:** Per page: 2 hero CTAs (`/menu/`, external order) + up to 3 related-item cards (linking to `/menu/`) + 1 view-full-menu link in related section + 3 bottom CTAs (`/menu/`, external, tel). **~6–9 internal anchors.** Healthy. **Notably missing:** cross-links to sibling specialties (the `/near/[city]/` pattern of "other neighborhoods" chips would translate cleanly to "other specialties").
- **Template strings outside /src/data/:** Cleanest dynamic route on the site. Only:
  - `[topic]/page.tsx:175` — H2 `"On the menu"` (soft)
  - `[topic]/page.tsx:199-201` — pickupBlock heading/body **come from data** — clean
  - `[topic]/page.tsx:209-210` — FAQ section eyebrow `"Common questions about ${specialty.name.toLowerCase()}"` and title `"Frequently asked questions."` (soft; data-driven name interpolation)

### `/404` `not-found.tsx` (deepened 2026-05-18)

- **CLS risk:** Decorative blur gradients are `pointer-events-none absolute` (`:48-62`) — no layout impact. No images. **Clean.**
- **Heading hierarchy:** H1 at `:67` (numeric "404") with `aria-label="404"`, H2 at `:109`. Clean.
- **Alt-text completeness:** No images.
- **Internal anchor density:** 2 primary CTAs + 1 tel + 3 quick-links cards. **~6 internal anchors** — appropriate for a 404.
- **Template strings outside /src/data/:**
  - `not-found.tsx:16` — title mentions "Al-Baghdady Bakery & Café" (hard; metadata)
  - `not-found.tsx:18` — description mentions "Iraqi bakery, café and catering" (hard; metadata)
  - `not-found.tsx:23-42` — `QUICK_LINKS` body strings mention "Iraqi sweets, daily breakfast", "Baghdad in 1919 to Richardson — four generations", "Iraqi catering" (hard)

### `/error` `app/error.tsx` (deepened 2026-05-18)

- **CLS risk:** Decorative gradients, no images. **Clean.**
- **Alt-text:** None.
- **Internal anchor density:** 1 reset button + 1 home link + 1 tel. Minimal — appropriate for an error boundary.
- **Template strings outside /src/data/:** Surprisingly clean. The error page's prose is brand-agnostic ("Something burned in the oven", "head back to the home page"). Phone derived from `RESTAURANT`. **No hard hardcodes.** The "burned in the oven" wording is bakery-themed but generic enough to read fine for any bakery tenant.

### `app/global-error.tsx` (deepened 2026-05-18)

- **CLS risk:** No images, no async mounts, no fonts (uses system stack). **Clean.**
- **Alt-text:** None.
- **Internal anchor density:** 1 button + 1 link + 1 tel. Minimal — appropriate.
- **Template strings outside /src/data/:** As corrected above — phone is already from data. Remaining:
  - `global-error.tsx:44` — `color: "#8B1A1A"` (hard color; can't reference CSS var since globals.css may not have loaded)
  - `global-error.tsx:73,75` — `background: "#A88838"` (same constraint)
  - `global-error.tsx:47,59` — `"A Small Kitchen Mishap"`, `"Something burned in the oven."` (soft; brand-agnostic prose)
  - The hex colors mirror `--color-primary` (`#8B1A1A`) and `--color-gold-dark` (`#A88838`). Acceptable given the constraint that globals.css may not have parsed when global-error fires.

### Root layout `app/layout.tsx` (deepened 2026-05-18)

- **Fonts:** `Inter` and `Fraunces` loaded via `next/font/google` at `src/app/layout.tsx:18-31`, both with `display: "swap"`. **CLAUDE.md is stale on this too** — it says "Playfair Display is loaded from Google Fonts and used for all headings" (CLAUDE.md "Styling" section), but actually `--font-display` points to Inter (`globals.css:16`) and Fraunces is the accent. No Playfair anywhere. Update CLAUDE.md.
- **CLS risk — fonts:** `swap` means FOUT not FOIT. Inter and system-ui have similar metrics; Fraunces is italic accent only. **Low CLS risk.**
- **CLS risk — `<ReviewModal>`:** Mounted unconditionally via `<Suspense fallback={null}>` at `:69-71`. Modal is fixed-position and gated on `?review=open` query param. **No layout impact.**
- **Head links:** Favicon, apple-touch-icon, manifest all present at `:55-59`. `theme-color` at `:53`, `format-detection` at `:54`. Clean.
- **Template strings outside /src/data/:** None — all metadata flows through `createMetadata({title: \`${RESTAURANT.name} | ${RESTAURANT.tagline}\`...})`. Keywords array at `:37-46` is page-local but they're SEO keywords (acceptable). **Layout is template-clean.**

---

### Aggregate template-readiness sweep (hard hardcodes only)

Compounding the first-pass table with second-pass findings. Severity legend: **Blocker** = breaks tenant swap; **High** = wrong on swap or data drift; **Med** = cosmetic on swap; **Low** = SEO copy / metadata.

| File:line | String / pattern | Severity | Action |
|---|---|---|---|
| `src/components/home/OurLocation.tsx:68-70` | Hardcoded hours `Mon–Thu · 11 AM – 10 PM` etc. | **High (data drift)** | Render from `RESTAURANT.hours` — values disagree with `restaurant.ts:41-48` (10:00 open, not 11:00; Sunday 10–10, not 12–10) |
| `src/app/near/[city]/page.tsx:51` | Breadcrumb schema points "Service Areas" → `/` instead of `/near/` | **High (SEO bug)** | Fix to `/near/`; also add the crumb to the visual `BreadcrumbNav` at `:62-67` |
| `src/components/home/InstagramSection.tsx:17-54` | `POSTS` array (6 posts × ~6 fields) | High | Move to `src/data/instagram.ts`; already a soft convention via `add-instagram-post` skill |
| `src/components/home/InstagramSection.tsx:82,161-164,193` | `@albaghdadyrestaurant` handle hardcoded 4× | High | Derive from `RESTAURANT.socials.instagram` URL slug (or add `RESTAURANT.socials.instagramHandle`) |
| `src/components/layout/Footer.tsx:28` | Wordmark `Al-Baghdady` (display-only, not the alt-text logo) | High | Use `RESTAURANT.name` or new `RESTAURANT.wordmark` |
| `src/components/layout/Footer.tsx:164,175` | Copyright `Al-Baghdady Restaurant & Bakery` | High | Use `RESTAURANT.legalName` (already exists at `restaurant.ts:3`) |
| `src/components/layout/Header.tsx:38,42,50,53` | aria-label, alt, wordmark, sub-wordmark — 4 hardcodes | High | Use `RESTAURANT.name` / `RESTAURANT.legalName` / `RESTAURANT.tagline` |
| `src/components/home/OurLocation.tsx:16` | H2 `Visit us in Richardson.` | High | Template against `RESTAURANT.address.city` |
| `src/components/home/OurLocation.tsx:22` | iframe `title="Al-Baghdady Restaurant location map"` | High | Use `${RESTAURANT.legalName} location map` |
| `src/components/home/HeroBanner.tsx:22,31,34,77,92` | Multiple hardcodes (`Since 2012`, `Richardson, Texas`, `since 1919`, hero alt, Since badge year) | High | Largest cluster on homepage; template against `RESTAURANT.founded`, `familyRecipeSince`, `address.city/state`, `name` |
| `src/components/home/BakerySpotlight.tsx:11,18,21` | alt + eyebrow `Since 1919` + body | High | Use `RESTAURANT.familyRecipeSince` |
| `src/components/home/TrustBar.tsx:6,7` | `Authentic Iraqi`, `Since 2012` | High | Template against `RESTAURANT.servesCuisine`, `RESTAURANT.founded` |
| `src/components/home/Gallery.tsx:41,46,112` | Alt mentions Al-Baghdady × 2 + caption mentions 1919 | Med | Localize to brand via data, or accept as Gallery is a tenant-specific asset anyway |
| `src/components/home/FeaturedDishes.tsx:138` | Alt suffix `at Al-Baghdady` | Med | Use `RESTAURANT.name` |
| `src/app/our-story/page.tsx:40` | `datePublished: "2012-01-01"` | High | Derive from `RESTAURANT.founded` |
| `src/app/our-story/page.tsx:41` | `authorName: "Salah Hassan"` | High | Add `RESTAURANT.master` / `RESTAURANT.owner` |
| `src/app/our-story/page.tsx:54` | H1 mentions `Dallas's BEST Iraqi Bakery` | High | Template (likely needs page-level config) |
| `src/app/our-story/page.tsx:65-96` | Full narrative prose | Page-local (tenant copy) | Acceptable as page-local content per tenant; extract to `src/data/story.ts` for rentable swap |
| `src/app/iraqi-cuisine/page.tsx:25-103` | `SPECIALTY_LINKS` + `DISHES` (~1000 words) | Page-local (largest block) | Extract to `src/data/cuisine.ts` per first-pass nice-to-have #9 |
| `src/app/iraqi-cuisine/page.tsx:131,132,134` | Eyebrow + H1 + intro | High | Page-level config |
| `src/app/iraqi-cuisine/page.tsx:141` | 6-image rotation pool | Med | Page-local image paths; tolerable but visually thin per first-pass note |
| `src/app/bakery/page.tsx:20-28` | `BAKERY_SPECIALTY_SLUGS` (7 Iraqi-specific slugs) | High | Derive from a tag/category on `SPECIALTIES` instead of hand-picked slugs |
| `src/app/bakery/page.tsx:75,76,78,81,143-147` | Eyebrow + H1 + intro + custom-tray block | High | Page-level config; mentions samoon, tandoor, kunafa, baklava, ladyfingers, fatayer, manakish, ma'amoul |
| `src/app/catering/page.tsx:28-35` | `SERVICES` array — including literal city list overlapping `RESTAURANT.cateringAreas` | High | Use `RESTAURANT.cateringAreas`; rewrite `SERVICES` against data |
| `src/app/catering/page.tsx:46,83,85,88` | `STEPS[1].body` + H1 + intro paragraphs | High | Page-level config |
| `src/app/near/[city]/page.tsx:97,107,111,128-130,139,147,156` | 8 sites where "Iraqi" is hardcoded into hero alt, H2s, body, and chip labels | High | Template `RESTAURANT.servesCuisine`; chip label should be `${RESTAURANT.servesCuisine} food in {other.city}` |
| `src/app/near/page.tsx:67,68,70-73,15` | Eyebrow + H1 + intro + meta description (city enumeration) | High | Page-level config; build city list from `NEIGHBORHOODS` (already done in JSON-LD, not in meta) |
| `src/app/specialties/page.tsx:14,18-24` | Title + keywords | Med | Page-level / metadata |
| `src/app/not-found.tsx:16,18,23-42` | Title, description, `QUICK_LINKS` body strings | Med | Body strings reference Baghdad/1919/Richardson; template via data |

### Single most impactful finding (second pass)

**`src/components/home/OurLocation.tsx:68-70` ships hardcoded hours that disagree with `RESTAURANT.hours`.** The home page tells visitors `Mon–Thu · 11 AM – 10 PM` and `Sunday · 12 PM – 10 PM`, but `restaurant.ts:41-48` says open at 10:00 AM every day. `HeroStatusBadge` (also on the home page) reads from `RESTAURANT.hours` and will show a different status during the 10–11 AM window than the location card claims. This is a live data-integrity bug visible above the fold — higher priority than any of the template-readiness items.

**Runner-up:** `src/app/near/[city]/page.tsx:51` injects a `BreadcrumbList` schema with a wrong URL (`Service Areas` → `/` instead of `/near/`) for all 10 neighborhood pages, and the visual `BreadcrumbNav` drops the crumb entirely. Search engines see one breadcrumb shape; users see another.

---

## Nitpick pass 2026-05-20 (Hasham bar)

A user's-eye bug hunt, distinct from the structural audit above. Bar: "anything that catches the eye where you think *why is this like this?*" Findings grouped **BUG** (wrong / broken / duplicate) / **POLISH** (weak but not broken) / **NIT** (minor consistency).

**Method & limits:** Static analysis of source + built `/out/` HTML (H1/H2 quality, thin/duplicate copy, anchor & alt text, trailing slashes, JSON-LD structure extracted from built pages). **Not verified here — needs a human at a real browser:** runtime console errors during navigation, visual mobile breakage at 360/390/414px, and live Google Rich Results validation. Those are listed at the bottom as an explicit to-do.

**Already fixed this cycle (do not re-triage):** OurLocation hardcoded hours (now reads `RESTAURANT.hours`), and the `/near/[city]/` breadcrumb URL + missing visual crumb (now `/near/` in both schema and nav).

### Cross-cutting (hits many routes)

- **BUG — Duplicate `BreadcrumbList` JSON-LD on every sub-page.** `BreadcrumbNav` injects its own `breadcrumbSchema(items)` at [BreadcrumbNav.tsx:31](../src/components/layout/BreadcrumbNav.tsx#L31), but every content page *also* injects `breadcrumbSchema([...])` through its page-level `<SchemaInjector>` (e.g. `our-story/page.tsx:22`, `near/[city]/page.tsx:49`, `specialties/[topic]/page.tsx`, `bakery/page.tsx`, `catering/page.tsx`, `menu/page.tsx`, `near/page.tsx`, `specialties/page.tsx`, `return-policy/page.tsx`). Confirmed in built output: `out/specialties/baklava/index.html` contains **2 `BreadcrumbList` blocks**. Fix once, centrally: drop the manual `breadcrumbSchema()` from page-level injectors and let `BreadcrumbNav` be the single source — or vice-versa. One or the other, not both.
- **BUG — Templated/near-duplicate `pickupBlock` copy across all 11 specialty pages.** [specialties.ts](../src/data/specialties.ts) — every `pickupBlock.heading` is `"Convenient Pickup and Delivery Options for {X}"` (11×), and every `body` follows the same spun template: *"Craving {X}? We offer pickup and delivery for our {X} across Richardson and the Dallas area. Enjoy [adjectives] from the comfort of your home. Order online for quick pickup, or have our {X} delivered straight to your door."* (lines 45-46, 92-93, 140-141, 189-190, 238-239, 290-291, 349-350, 405-406, 459-460, 510-511, 560-561). Google reads near-identical blocks across 11 URLs as thin/duplicate content — it *dilutes* the per-page authority the mesh is trying to build. Rewrite each with genuinely distinct copy, or collapse the boilerplate into a shared component and make only the dish-specific sentence unique.
- **POLISH — Generic alt-text formulas.** Several images use `{name} at {RESTAURANT.name}` or bare `{name}`:
  - [FeaturedDishes.tsx:138](../src/components/home/FeaturedDishes.tsx#L138) `{dish.name} at Al-Baghdady`
  - [specialties/page.tsx:95](../src/app/specialties/page.tsx#L95) and [specialties/[topic]/page.tsx:153](../src/app/specialties/[topic]/page.tsx#L153) `{name} at {RESTAURANT.name}`
  - [bakery/page.tsx:107](../src/app/bakery/page.tsx#L107) and [iraqi-cuisine/page.tsx:159](../src/app/iraqi-cuisine/page.tsx#L159) bare `{item.name}` / `{dish.name}`
  - None are *wrong*, but they're scene-blind. "Diamond-cut pistachio baklava in a copper tray" beats "Baklava at Al-Baghdady" for image search.

### `/` Homepage
- **POLISH — Instagram alt = hashtag captions.** [InstagramSection.tsx:122](../src/components/home/InstagramSection.tsx#L122) sets `alt={post.caption}`; captions are marketing hashtags ("#dfweats #foodiefinds"), not image descriptions. Accessibility + image-SEO miss.
- **NIT — H2s all end with a period** ("Featured dishes.", "A closer look at the counter.", "Visit us in Richardson."). Deliberate style, consistent — flagging only so it reads as intentional, not as stray punctuation. No action.
- H1 is strong ("The most *Authentic* Baklava in All of Richardson, Texas"). No issue.

### `/menu/`
- **NIT — H1 "Authentic Iraqi Cuisine & Bakery"** is generic and location-less while the meta title targets "Iraqi Bakery, Breakfast & Sweets". Consider adding Richardson or "Bakery & Breakfast" to align H1 with title intent. Low priority.

### `/bakery/`
- No new nitpicks beyond the cross-cutting alt formula. H1 and intro are strong.

### `/catering/`
- **POLISH — City list duplicated, not sourced.** `SERVICES` array hardcodes "Richardson, Plano, Garland, Addison, Carrollton, Frisco" ([catering/page.tsx:28-35](../src/app/catering/page.tsx#L34)) which overlaps `RESTAURANT.cateringAreas` (`restaurant.ts:111-112`) — two copies of the same fact that can drift. (Also in the template sweep above; repeating here as a content nit.)

### `/iraqi-cuisine/`
- **BUG — Alt text mismatches image.** [iraqi-cuisine/page.tsx:159](../src/app/iraqi-cuisine/page.tsx#L159) sets `alt={dish.name}` but the page cycles 6 images across 12 dishes (`:141` image pool, `images[i % images.length]`), so e.g. the "Mabrouma" entry can carry alt "Mabrouma" over a photo that's actually baklava. Misleading alt = accessibility + SEO problem.

### `/our-story/`
- **NIT — All-caps "BEST" in H1.** "The 100-Year Story of Dallas's **BEST** Iraqi Bakery..." ([our-story/page.tsx:54](../src/app/our-story/page.tsx#L54)) reads as keyword-stuffy / shouty. "Best" in title case is enough; the all-caps is the kind of thing a client *will* nitpick.

### `/near/` index
- No new nitpicks. H1 strong.

### `/near/[city]/` (×10)
- **POLISH — `heroHeadline` preposition & casing inconsistency** across the 10 entries in [neighborhoods.ts](../src/data/neighborhoods.ts): "Iraqi Bakery & Breakfast **for** Plano" (`:35`), "...Café **near** Garland" (`:62`), "Halal Iraqi Bakery **Near** Addison" (`:89`, capital N), "**Best** Iraqi Bakery in Far North Dallas" (`:197`, superlative). Pick one pattern ("near {City}") and apply it across all 10 so the set reads as a system, not ten one-offs.
- **POLISH — Hero alt is misleading + awkward.** [near/[city]/page.tsx:98](../src/app/near/[city]/page.tsx#L98) `alt={`Iraqi food served from ${n.city}, ${n.state}`}` — all 10 pages render the *same* `hero.webp`, so 10 different alts describe one image; and "served from Plano" is backwards (you serve *to* Plano, from Richardson).

### `/specialties/` index
- **BUG — Weak H1 "Our Specialties"** ([specialties/page.tsx:77](../src/app/specialties/page.tsx#L77)). Two words, zero keyword, doesn't match the meta title's intent ("Our Specialties — Iraqi Sweets, Breakfast & Halal Café"). This is precisely Hasham's example bar — an H1 carrying no SEO weight on a hub page. Suggest "Our Iraqi Bakery & Breakfast Specialties" or similar.
- **POLISH — Vague "Learn more" anchor (×11).** [specialties/page.tsx:117](../src/app/specialties/page.tsx#L117) — every specialty card's link text is just "Learn more". Anchor text is a ranking signal; make it "Learn more about {s.name}" (visually can stay compact, but the link text should name the subject).

### `/specialties/[topic]/` (×11)
- **NIT — `heroHeadline` pattern break.** Most are "{Dish} in Richardson, TX" but `samosa` is "**Best samosa in Texas**" ([specialties.ts:232](../src/data/specialties.ts#L232)) — different geo ("Texas" vs "Richardson, TX") and a "Best" superlative the others don't use. Also "**Lady fingers** in Richardson, TX" (`:183`) spaces a word the dish name renders as "Lady Fingers". Align the set.
- **CONTENT NIT — samosa authenticity.** Samosa is South Asian, not Iraqi; it sits in a list framed as Iraqi specialties. They do serve it, so it's defensible, but a sharp client may ask. Worth a deliberate decision, not a silent inclusion.
- Plus the cross-cutting `pickupBlock` duplication and generic alt noted above.

### `/return-policy/`
- Clean. H1 "Return & Refund Policy" is appropriate for a policy page (keyword value not expected here). Content is substantive (food/catering/contact sections), not thin.

### `/404`, `/error`, `/global-error`
- No nitpicks. Branded, appropriately minimal, noindex where it matters.

### Needs a human at a browser (could not verify statically)
1. **Console errors/warnings** during click-through of all 35 routes (`npm run serve-out`, open devtools, navigate).
2. **Mobile layout** at 360 / 390 / 414px — particularly the homepage hero (2-col → 1-col reflow), the Instagram tile column-count hydration shift flagged in the deepening pass (`InstagramSection.tsx:60-69`), and the menu `CategoryNav` sticky bar.
3. **Live JSON-LD validation** — paste each page type into Google Rich Results Test / schema.org validator. The duplicate `BreadcrumbList` (above) is the first thing to confirm there; also verify the `FAQPage`, `Article`, and `ItemList` blocks pass without warnings.

### Triage priority (my read)
1. **Duplicate `BreadcrumbList`** — one-line-ish central fix, hits every sub-page, real schema correctness issue.
2. **`pickupBlock` duplicate copy ×11** — biggest content-quality drag; the client *will* notice if they read more than one specialty page.
3. **`/specialties/` weak H1** — exactly the bar Hasham set; quick win.
4. **iraqi-cuisine alt/image mismatch** — correctness bug, quick once dish images exist.
5. Everything else is POLISH/NIT — batch it.