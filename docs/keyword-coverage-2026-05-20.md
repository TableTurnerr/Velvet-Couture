# Keyword coverage audit — 2026-05-20 (Hasham request)

**Question:** for every keyword we target, are we actually *using* it in body copy — or just stuffing it into meta-tag `keywords` arrays (which carry almost no ranking weight today)?

**Method:** case-insensitive substring match across `src/**/*.{ts,tsx}` (excludes `/docs`). Two usage classes:
- **META** — match sits inside a `keywords:` array (`metadata.ts` `BASE_KEYWORDS`, a page's `createMetadata({keywords})`, or a specialty's `keywords`). Low SEO value.
- **BODY** — match appears in real content: headings, visible JSX text, data-file content fields (`intro`, `body`, `heroHeadline`, `primaryBlock`, `pickupBlock`), FAQ Q&A, image `alt`, or metadata `title`/`description`. Real SEO value.

A keyword's **stem** can be covered even when the exact **qualified phrase** is not — e.g. body says "Iraqi breakfast **in** Richardson, TX" so the stem "iraqi breakfast" is covered but the exact meta phrase "iraqi breakfast Richardson" is not. That distinction drives the priority split below.

## Summary

- **Unique keywords analyzed:** 91 (BASE_KEYWORDS 46 + per-page arrays + 11 specialty arrays + Aleee's GKP list, deduped)
- **COVERED in body (stem or phrase):** ~30
- **GAP — claimed but not used (meta only):** ~56, but most are geo-suffixed phrases whose stem *is* covered. The genuinely actionable subset (concept absent from body) is ~14 — listed in Priority 1.
- **GAP — GKP term used nowhere (not even meta):** 5 — Priority 2.

## Priority 1 — Claimed but the concept is absent from body copy

These are real losses: the term is in a `keywords` array but the idea never appears in visible/structured content, so we get zero ranking signal for it. Sorted by value.

| Keyword | Claimed in (meta) | In body? | Natural home for a body fix |
|---|---|---|---|
| `turkish baklava` | metadata.ts:55, bakery:47, specialties.ts:326 | No¹ | `/specialties/baklava/` `primaryBlock.body` + a "Is baklava Turkish or Greek?" FAQ |
| `greek baklava dessert` | specialties.ts:327 | No | Same baklava FAQ ("…neither — ours is Iraqi-style") |
| `baklava filo` / `filo baklava richardson` / `baklava filo pastry` | specialties.ts:328-330 | No² | Baklava body — add one sentence using "filo (phyllo)" so both spellings are present |
| `baklava dessert` | metadata.ts:57 | No | Baklava intro/body |
| `baklava cafe` | specialties.ts:339 | No | Homepage hero eyebrow or `/bakery/` intro |
| `halal cake shop near me` | metadata.ts:34, bakery:57 | No | `/bakery/` intro + a `/bakery/` FAQ |
| `halal bread` / `halal bread shop richardson` | metadata.ts:72, specialties.ts:32-33 | No³ | `/specialties/bread/` body — body only ever says "Iraqi bread"/"samoon" |
| `baklawa` (alt spelling) | metadata.ts:52 + GKP | No | One parenthetical in baklava body: "baklava (also spelled baklawa)" |
| `knafeh` (alt spelling) | metadata.ts:64 | No | Kunafa body: "kunafa (knafeh)" |
| `manakeesh` (alt spelling) | metadata.ts:69 | No⁴ | Manakish body: "manakish (manakeesh)" |

¹ "Turkish" *does* appear in body, but as "Burma (Turkish Style)" ([menu.ts:130](../src/data/menu.ts#L130)) — not "Turkish baklava." The baklava concept is what's missing.
² Body consistently uses "phyllo," never "filo." Adding "filo (phyllo)" once captures the whole filo cluster + the GKP typo `balaclava` searches.
³ Confirmed: `halal bread` is meta-only across the site.
⁴ `manakeesh` also appears in `src/data/dishes.ts`, but that file is **unwired** (not imported anywhere — verified), so it does not count as live body.

### The other ~42 "gaps" — geo-suffixed phrases, stem already covered (low priority)

Most of BASE_KEYWORDS is exact city-qualified phrasing like `iraqi bakery Richardson TX`, `halal bakery Dallas`, `iraqi breakfast Richardson`, `samoon bread Dallas`, `iraqi sweets Dallas`. Body copy covers the **stem** ("Iraqi bakery", "halal bakery", "Iraqi breakfast", "samoon", "Iraqi sweets") but phrases the geo naturally ("…in Richardson, TX") rather than as the compressed meta string. **This is fine and not worth chasing** — Google matches stems + location context, not exact contiguous phrases. Listed here so the count reconciles, not as an action list.

## Priority 2 — GKP terms used nowhere (not in meta OR body)

Real search terms from Aleee's Keyword Planner export that appear nowhere on the site:

| Keyword | In GKP? | Anywhere on site? | Note / suggested home |
|---|---|---|---|
| `baklava lady` | Yes | No | Brand-association term ("the baklava lady"). Only worth targeting if the client wants to lean into that persona — ask. |
| `the baklava lady` | Yes | No | Same. |
| `baklava house` | Yes | No | Competitor-ish brand term; low priority unless deliberately targeting. |
| `balaclava dessert` | Yes | No | Common misspelling of baklava. Don't write the typo in copy; the `filo (phyllo)` + baklava body usually catches typo searches via Google's fuzzy matching. Skip. |
| `halal bread shop` | Yes | No | Covered if we action `halal bread` in Priority 1 (the bread page fix lands "halal bread shop" too). |

## The 3 highest-value fixes (do these first)

1. **`/specialties/baklava/` baklava body + one FAQ.** A single rewrite of `primaryBlock.body` ([specialties.ts:343-350 area](../src/data/specialties.ts)) plus a new FAQ ("Is baklava Greek or Turkish? Filo or phyllo?") captures ~7 claimed-not-used terms (`turkish baklava`, `greek baklava dessert`, the 3-term filo cluster, `baklava dessert`, `baklava pastry`) AND the GKP typo `balaclava`. Highest leverage on the page that matters most.
2. **`/specialties/bread/` body — say "halal bread."** Body currently only says "Iraqi bread"/"samoon." One sentence captures `halal bread` + `halal bread shop` (both GKP terms). [specialties.ts:39-46 area](../src/data/specialties.ts).
3. **`baklava cafe` + `halal cake shop near me` — commercial intent, zero body.** Natural homes: homepage hero eyebrow / `/bakery/` intro + a `/bakery/` FAQ. These are buy-intent terms we're claiming and not using.

## Methodology notes for Hasham

- **The dominant "stuffing" pattern is geo-suffixed phrasing**, not random keyword spam. The dish stems are well covered in body; the exact city-qualified meta phrases aren't, because body writes the location naturally. Classified strictly by contiguous-substring match and marked "stem covered" where that applies — so the headline "56 claimed-not-used" overstates the real problem; the actionable count is ~14.
- **`src/data/dishes.ts` and `matrix.ts` are unwired** (not imported anywhere — verified). Alias keywords living there (`manakeesh`, `knafeh`) do NOT count as live body. They'll start counting once the matrix route ships.
- **Correction to an earlier draft finding:** the `schema.ts` `KEYWORDS_STRING` entries `awama luqaimat`, `leblebi chickpea soup`, `kibbeh richardson`, `yemeni coffee` are **NOT stale / off-menu** — all are real menu items (`menu.ts`: "Kibbeh" :276, "Chickpea Soup (Leblebi)" :282, "Yemeni Coffee" :316; "awama" appears in the menu schema description at `schema.ts:274`). **Do not remove them.** They're legitimately claimed; whether they're in *body* is a separate question (kibbeh and leblebi are, via `faqs.ts:56` and `iraqi-cuisine` body; awama and yemeni coffee are menu-only).

## Appendix — BASE_KEYWORDS (metadata.ts) classification

COVERED in body (stem or phrase): `albaghdady`, `al-baghdady`, `al baghdady`, `baklava`, `pistachio baklava` (HeroBanner alt), `kunafa`, `kanafa`, `fatayer`, `manakish`, `iraqi samoon` (stem "samoon"), `iraqi sweets Dallas` (stem), `iraqi breakfast Richardson` (stem), `iraqi bakery …` (stem), `halal bakery …` (stem), `iraqi catering Dallas` (stem).

META-ONLY, actionable (concept absent — see Priority 1): `turkish baklava`, `baklava dessert`, `baklawa`, `knafeh`, `manakeesh`, `halal bread`, `halal cake shop near me`.

META-ONLY, low-priority (stem covered, geo phrase only): `iraqi bakery Richardson TX`, `iraqi bakery Dallas`, `halal bakery Richardson TX`, `halal bakery Dallas`, `halal bakery near me`, `arabic bakery Richardson`, `middle eastern bakery Dallas`, `zabihah verified Richardson`, `iraqi cafe Richardson TX`, `middle eastern cafe Dallas`, `arabic cafe Richardson`, `halal cafe near me`, `baghdadi cafe Texas`, `halal breakfast Dallas`, `iraqi breakfast cafe DFW`, `baklava near me`, `baklava bakery`, `kanafa Dallas`, `kunafa Dallas`, `samoon bread Dallas`, `arabic sweets Dallas`, `middle eastern sweets Richardson`, `al-baghdady bakery`, `al baghdady bakery and cafe`, `al baghdady richardson`.

Per-specialty and per-page keyword arrays follow the same pattern — dish stem covered in that page's body, geo/modifier variants meta-only. The baklava specialty (21-entry array at `specialties.ts:319-341`) is the densest and the source of most Priority-1 items.