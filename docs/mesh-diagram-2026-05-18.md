# City × dish mesh — structural diagram

**Status:** Pre-scaffold. Dish axis pending Tuesday 2026-05-19 confirmation.
Update this diagram whenever the structure changes (per brief: "Extend the diagram if structure shifts.")

## Data inputs

```mermaid
flowchart LR
  subgraph data["/src/data/"]
    R[restaurant.ts<br/>NAP · hours · brand]
    M[menu.ts<br/>7 board categories]
    N[neighborhoods.ts<br/>10 cities]
    S[specialties.ts<br/>11 topics]
    D[dishes.ts<br/>7 hero dishes — NEW]
    A[matrix.ts<br/>MATRIX_ALLOWLIST — NEW]
    F[faqs.ts]
    SC[schema.ts<br/>JSON-LD generators]
    MT[metadata.ts]
  end

  D -.gated by.-> A
  N -.gated by.-> A
```

## Route generation

```mermaid
flowchart TD
  classDef existing fill:#F7F4EE,stroke:#8B1A1A,color:#111110
  classDef new fill:#FFF7DE,stroke:#C9A84C,color:#111110,stroke-dasharray: 5 3
  classDef gated fill:#FBE9E9,stroke:#8B1A1A,color:#111110,stroke-dasharray: 5 3

  N[neighborhoods.ts<br/>10 entries]
  S[specialties.ts<br/>11 entries]
  D[dishes.ts<br/>7 candidates]
  A[MATRIX_ALLOWLIST<br/>start: empty]

  N -->|generateStaticParams| RNEAR["/near/[city]/<br/>× 10 pages"]
  S -->|generateStaticParams| RSPEC["/specialties/[topic]/<br/>× 11 pages"]
  D -->|cartesian × N| CROSS["DISHES × NEIGHBORHOODS<br/>70 combinations"]
  CROSS -->|filtered by| A
  A --> RMATRIX["/[dish]-in-[city]/<br/>× allowlist length"]

  STATIC["Static routes<br/>/  /menu/  /bakery/<br/>/catering/  /our-story/<br/>/iraqi-cuisine/<br/>/near/  /specialties/"]

  STATIC:::existing
  RNEAR:::existing
  RSPEC:::existing
  RMATRIX:::gated
  CROSS:::new
  D:::new
  A:::new
  N:::existing
  S:::existing
```

## Internal-link backbone

Each `/[dish]-in-[city]/` page is a leaf — it must crosslink upward (to canonical dish and canonical city) and laterally (to sibling combinations) to distribute authority and let crawlers traverse the mesh.

```mermaid
flowchart LR
  classDef leaf fill:#FBE9E9,stroke:#8B1A1A,color:#111110,stroke-dasharray: 5 3
  classDef canonical fill:#F7F4EE,stroke:#8B1A1A,color:#111110
  classDef hub fill:#FFF7DE,stroke:#C9A84C,color:#111110

  HOME["/ (home)"]:::canonical
  HUB_DISH["/specialties/"]:::hub
  HUB_CITY["/near/"]:::hub

  DISH_PAGE["/specialties/baklava/<br/>(canonical for Baklava)"]:::canonical
  CITY_PAGE["/near/plano-tx/<br/>(canonical for Plano)"]:::canonical

  LEAF["/baklava-in-plano/<br/>(mesh leaf)"]:::leaf
  SIB_DISH["/kanafa-in-plano/<br/>(same city, sibling dish)"]:::leaf
  SIB_CITY["/baklava-in-frisco/<br/>(same dish, sibling city)"]:::leaf

  HOME --> HUB_DISH --> DISH_PAGE
  HOME --> HUB_CITY --> CITY_PAGE

  DISH_PAGE -->|"links to siblings in same dish"| LEAF
  CITY_PAGE -->|"links to siblings in same city"| LEAF

  LEAF -->|"canonical upward"| DISH_PAGE
  LEAF -->|"canonical upward"| CITY_PAGE
  LEAF -->|"lateral: other dishes in this city"| SIB_DISH
  LEAF -->|"lateral: this dish in other cities"| SIB_CITY
```

## Schema strategy per mesh leaf

Each `/[dish]-in-[city]/` page should inject:

| Schema | Source |
|---|---|
| `BreadcrumbList` | Home → Service Areas → [City] → [Dish], or Home → Specialties → [Dish] → [City] (pick one canonical; mirror `/specialties/[topic]/`'s pattern) |
| `WebPage` | `webPageSchema()` |
| `Article` | `articleSchema()` if body copy is long-form, like `/specialties/[topic]/` |
| `Restaurant` / `LocalBusiness` | inherited from global layout — no per-page injection needed |
| `FAQPage` | optional, if `DISHES[dish].faqs?.[city]` provides city-specific Q&A |
| `Menu` | optional, if dish maps to specific menu items — reuse `relatedItemsSchema` pattern from `/specialties/[topic]/` |

## Gating model

```mermaid
stateDiagram-v2
  [*] --> Empty: MATRIX_ALLOWLIST = []
  Empty --> Pilot: Tuesday confirmation
  Pilot --> RollingOut: copy + photos per leaf
  RollingOut --> Full: 70 leaves live
  Full --> [*]

  note right of Empty
    Route registered.
    generateStaticParams returns [].
    Zero pages rendered.
  end note

  note right of Pilot
    1–3 leaves enabled
    (e.g. baklava-in-plano).
    Verify SEO, crawl, internal links.
  end note

  note right of RollingOut
    Allowlist grows as copy lands.
    Each addition triggers sitemap rebuild.
  end note

  note right of Full
    All 70 combinations live.
    Decision point: lift the gate,
    or keep allowlist as the API.
  end note
```

## Open questions surfaced by the diagram

1. **Canonical breadcrumb path** — is the mesh leaf a child of `/specialties/` (dish-first) or `/near/` (city-first)? Pick one and stick with it for `BreadcrumbList`. Recommendation: dish-first (`Specialties → Dish → in [City]`) because the dish is the searchable noun.
2. **Slug format** — `/baklava-in-plano/` is more SEO-natural than `/plano/baklava/` or `/baklava/plano/`. Confirm Tuesday.
3. **Lateral link budget** — linking to 9 sibling cities × 6 sibling dishes = 15 internal links per leaf, before any other content links. Keep it scannable.
4. **Allowlist shape** — `Array<[dishSlug, citySlug]>` or `Record<dishSlug, citySlug[]>`? Record form is easier to grep, array form is easier to extend by-row. Going with array of tuples for now.
