# Matrix page template — `/[dish]-in-[city]/`

**Status:** Locks the structural skeleton every mesh leaf will follow.
Tenant-agnostic: drives off `DISHES` (`src/data/dishes.ts`) × `NEIGHBORHOODS` (`src/data/neighborhoods.ts`) — no restaurant-specific JSX.
Companion to [mesh-diagram-2026-05-18.md](./mesh-diagram-2026-05-18.md) and the route shell stashed in [src/data/matrix.ts](../src/data/matrix.ts).

## Breadcrumb decision — dish-first

**Path:** Home → Specialties → \[Dish\] → in \[City\]

**Why dish-first wins:**
Mesh leaves exist to capture transactional intent like "baklava plano" or "kunafa frisco" — the dish is the searchable noun, the city is the modifier. By nesting under `/specialties/[dish]/` in the breadcrumb, we tell Google the canonical dish page is the parent and each city leaf is a deep cut. Authority flows down from a stable, evergreen specialty page rather than competing with `/near/[city]/` (which already owns the city-first intent: "iraqi food near me in plano"). Same-dish leaves naturally cluster as siblings; per-dish topical clusters are what mesh-style SEO actually rewards. The lateral link to `/near/[city]/` still appears as a body link, just not in the breadcrumb spine.

**Implementation:** `breadcrumbSchema()` items array = `[Home, Specialties, Dish, "in [City]"]`. The visible `BreadcrumbNav` mirrors this — last segment is the city label, not clickable.

## Section order & heading hierarchy

| # | Section | Heading | Notes |
|---|---|---|---|
| 1 | Breadcrumb | (nav) | `BreadcrumbNav` component, also injects `BreadcrumbList` |
| 2 | Hero | **H1** "\[Dish\] in \[City\], TX" | Eyebrow shows city/state; hero image is LCP |
| 3 | Intro / primary block | **H2** "Authentic \[Dish\] for \[City\]" | 1–2 paragraphs, dish-led copy from `DISH.intro` |
| 4 | Local angle | **H2** "Why \[City\] residents come to us" | Pulls `NEIGHBORHOOD.driveTime`, `RESTAURANT.address.full`, delivery zone |
| 5 | On the menu | **H2** "Find \[Dish\] on our menu" | Related-item cards from `MENU` filtered via `DISH.relatedMenuItemNames` |
| 6 | Pickup / delivery | **H2** "Order \[Dish\] for pickup or delivery in \[City\]" | Order-online button, phone, address, hours |
| 7 | FAQs (optional) | **H2** "\[Dish\] in \[City\] — Common Questions" | Only renders if `DISH.faqs?.[citySlug]` exists |
| 8 | Sibling dishes in same city | **H2** "Other Iraqi specialties for \[City\]" | Up to 6 cards linking `/{other-dish}-in-{citySlug}/` |
| 9 | Sibling cities for same dish | **H2** "\[Dish\] in other DFW cities" | Up to 9 links to `/{dishSlug}-in-{other-citySlug}/` |
| 10 | Footer | (global) | Inherited from root layout |

**H1 rule:** exactly one `<h1>` per page, in the hero. All section headings are `<h2>`. No `<h3>` unless a section needs nested groupings (avoid by default — keeps the outline scannable for crawlers).

## Required schema blocks

| Schema | Source | Required? | Rationale |
|---|---|---|---|
| `BreadcrumbList` | `breadcrumbSchema([{name:"Home", url:"/"}, {name:"Specialties", url:"/specialties/"}, {name: dish.name, url:`/specialties/${dish.slug}/`}, {name:`in ${city.city}`, url:`/${meshSlug}/`}])` | **Yes** | Mirrors visible breadcrumb |
| `WebPage` | `webPageSchema()` | **Yes** | Page-type baseline |
| `Article` | `articleSchema({ headline, author, datePublished })` | **Yes** if body > 300 words | Mesh leaves are long-form; matches `/specialties/[topic]/` pattern |
| `FAQPage` | `faqSchema(dish.faqs[citySlug])` | **Conditional** | Only if per-city FAQs exist |
| `ItemList` | `relatedItemsSchema(dish.relatedMenuItemNames)` | **Conditional** | Only if dish maps to menu items |

**Do NOT inject per leaf:**
- `Restaurant` / `LocalBusiness` — already injected at root layout (`src/app/layout.tsx`). Duplicating creates conflicting signals.
- `Menu` — owned by `/menu/`. Mesh leaves point to it via internal link, don't restate it.
- `Product` — tempting but wrong. The dish isn't a discrete product with SKU/price/availability per city. The Menu schema at `/menu/` already covers offering-level data. Adding `Product` here risks Google flagging conflicting/duplicate offerings across 70+ leaves.

## Internal link contract

Every leaf must contain, in this order of importance:

1. **Breadcrumb spine** (3 clickable links): Home, Specialties, \[Dish canonical\]
2. **Canonical-dish link** in the intro block: "Read more about \[Dish\]" → `/specialties/[dish]/`
3. **Canonical-city link** in the local-angle block: "What we serve in \[City\]" → `/near/[city]/`
4. **Menu link** in the related-items block: "See full menu" → `/menu/`
5. **Catering link** in the pickup block, IF the dish is catering-relevant (flag on `DISH` later — for now: baklava, kunafa, mabrouma): "Order a tray for your event" → `/catering/`
6. **Order-online external link** (CTA): `RESTAURANT.orderOnline` — not internal, but the most clicked link on the page
7. **6 sibling-dish links** (same city): `/{other-dish}-in-{citySlug}/` — only those in `MATRIX_ALLOWLIST`
8. **9 sibling-city links** (same dish): `/{dishSlug}-in-{other-citySlug}/` — only those in `MATRIX_ALLOWLIST`

**Total internal links:** ~14–20, plus 1 external CTA. Comfortably below the "too many links" anti-pattern threshold (~100) and dense enough to distribute authority across the mesh.

**Gating sibling links by `MATRIX_ALLOWLIST`:**
Critical — never link to a leaf that doesn't exist. During phased rollout the allowlist will be partial; the helper must filter siblings to only those actually pre-rendered. Add a helper to `matrix.ts`:

```ts
export function siblingsForDish(dishSlug: string, excludeCitySlug: string): MatrixEntry[]
export function siblingsForCity(citySlug: string, excludeDishSlug: string): MatrixEntry[]
```

Both filter against `MATRIX_ALLOWLIST` so the page never emits a dead internal link.

## Photo slots

| Slot | Source | Loading | Dimensions | Purpose |
|---|---|---|---|---|
| Hero | `DISH.heroImage` | `priority`, `fetchpriority="high"` | ~1200×800 | LCP candidate; eager-load |
| Related-item cards (2–4) | `MENU[relatedItem].image` | lazy | ~600×400 | Visual menu cross-link |
| (Optional) Gallery (3–6) | `/Images/gallery/*` | lazy | mixed | Atmosphere; only if needed for visual weight |

**Always use `SmartImage`.** Always pass explicit `width`/`height` to prevent CLS. Alt text must describe the dish (e.g. "Pistachio baklava cut into diamond squares"), not be generic ("dish image").

**No per-city photography.** Producing 70 city-specific dish photos isn't realistic. Reuse the dish-canonical image across all city variants — the city differentiation is in copy, not visuals.

## CTA placement

| Position | CTA | Style |
|---|---|---|
| Hero (primary) | "Order Online" → `RESTAURANT.orderOnline` (external) | `.btn-primary` (maroon, prominent) |
| Hero (secondary) | "Call Us" → `tel:${RESTAURANT.phoneRaw}` | `.btn-secondary` |
| Hero (tertiary) | "Directions" → Google Maps URL from `RESTAURANT.geo` | text link or `.btn-gold` |
| Pickup block (repeat) | "Order Online" + "Call Us" | Same styles |
| Footer (global) | Inherited | — |

**No sticky mobile CTA bar** for v1 — none of the other pages have one and adding it just for mesh leaves creates UX inconsistency. Revisit after the first batch of leaves ships if mobile conversion is weak.

**Catering CTA** sits in the pickup block, only for catering-relevant dishes (see Internal Link Contract #5).

## Component structure

Recommend a **separate page component**, not a shared one with `/specialties/[topic]/`. Reasoning:

- The two routes serve different intent and need different schema arrays (mesh leaf adds city to breadcrumb, opens new FAQ shape).
- Sharing risks accumulating `if (city)` branches that obscure both flows.
- Code-volume cost is low; the leaf is mostly composition of existing primitives (`SmartImage`, `BreadcrumbNav`, `SchemaInjector`).

**Suggested file:** `src/app/(matrix)/[meshSlug]/page.tsx` (already designed in the embedded comment block at [src/data/matrix.ts:25](../src/data/matrix.ts#L25)).

**Reusable primitives to lean on:**
- `BreadcrumbNav` — pass items array
- `SchemaInjector` — pass schema array
- `SmartImage` — hero + related cards
- `QRHover` — phone/order links

**No new shared components needed for v1.** If we hit duplicated blocks across 70 leaves, extract then — not pre-emptively.

## Per-leaf body-copy contract

For each `DISH` entry that goes into the allowlist, the populated fields must include:

| Field | Length | Purpose |
|---|---|---|
| `intro` | 60–120 words | Lede paragraph, seeds meta description |
| `keywords` | 6–12 entries | Long-tail, city-agnostic — combined with city axis at render |
| `body` (NEW field — add to `Dish` type when needed) | 200–400 words | Section 3 body |
| `faqs[citySlug]` (optional) | 3–6 Q&A pairs | City-specific FAQ block |

**City-axis copy** (sections 4, 6) is generated from `NEIGHBORHOOD` data — no per-leaf authoring needed. That's the leverage: 7 dishes × 10 cities = 70 leaves built from 7 + 10 = 17 data records, not 70.

## Tenant-agnostic verification

This template is tenant-ready if all of the following are true (none are JSX-level restaurant-specific):

- ✅ Section heading templates use `{DISH.name}` / `{NEIGHBORHOOD.city}` substitution, never literal "Baklava" or "Plano"
- ✅ Schema generators in `src/data/schema.ts` accept dish + neighborhood records, don't reference Al-Baghdady by name
- ✅ Photo paths come from `DISH.heroImage`, not hardcoded
- ✅ All CTAs use `RESTAURANT` constants (phone, order URL, address)
- ✅ Breadcrumb labels come from data (`dish.name`, `city.city`)

A tenant-#2 setup person swaps `dishes.ts` + `neighborhoods.ts` + `restaurant.ts` and the entire mesh re-skins.

## Open follow-ups (carry to Tuesday)

1. **Add `Dish.body` and `Dish.faqs` fields** to the type in `dishes.ts` once dish axis is confirmed.
2. **Add `Dish.cateringRelevant?: boolean`** flag to drive the conditional catering CTA.
3. **Decide on URL format ambiguity:** `/baklava-in-plano-tx/` (current plan) keeps the `-tx` suffix for unambiguity. Alternative `/baklava-in-plano/` reads better but breaks if multi-state tenants emerge. Recommend keeping `-tx` for now; trivial to swap later by editing `meshSlug()`.
4. **Sticky mobile CTA bar** — defer. Revisit after first batch ships with real mobile traffic data.
