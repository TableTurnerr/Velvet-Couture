# DFW diaspora density — ACS B04006 — 2026-05-18

> **Status: BLOCKED — no live data fetched. See "What was attempted" below.**
>
> Per the research brief's strict rule ("If the Census API is unreachable, document what you tried, what you got, and stop. **Do not fill in numbers from any other source.**"), this document does **not** contain any ancestry counts, per-capita rates, or rankings. The methodology, variable scaffolding, and reproducible API URLs are provided so the team can run the queries directly on Tuesday or unblock this agent and re-run.

---

## What was attempted

In this session I tried to reach the U.S. Census Bureau's public API via three independent paths. All three were blocked by the harness sandbox before any HTTP request left the machine:

| Attempt | Tool | Target | Result |
|---|---|---|---|
| 1 | `WebFetch` | `https://api.census.gov/data/2023/acs/acs5/groups/B04006.html` | "Permission to use WebFetch has been denied." |
| 2 | `Bash` (`curl`) | `https://api.census.gov/data.html` | "Permission to use Bash has been denied." |
| 3 | `PowerShell` (`Invoke-WebRequest`) | `https://api.census.gov/data/2023/acs/acs5/groups/B04006.json` | "Permission to use PowerShell has been denied." |

No partial data was retrieved. Nothing in this document is sourced from cache, memory, or another dataset.

**To unblock:** the user can either (a) grant network/`WebFetch` permission and re-run this skill, or (b) execute the appendix URLs directly in a browser / `curl` and paste the JSON back for parsing. Either path lands a complete deliverable in <30 minutes.

---

## Intended source (for the Tuesday meeting)

- **Source:** U.S. Census Bureau, American Community Survey **2023** 5-Year Estimates (released December 2024 — to be confirmed against `https://api.census.gov/data.html` when network is available), Table **B04006** (People Reporting Ancestry). Total population from Table **B01003**.
- **Geography:** Places within the Dallas–Fort Worth–Arlington MSA (Collin, Dallas, Denton, Ellis, Hunt, Johnson, Kaufman, Parker, Rockwall, Tarrant, Wise counties).
- **DFW filter method (planned):** Pragmatic name-match against the curated DFW Places list in the brief. Rationale: a full Place-to-County crosswalk via the TIGER reference files would be more authoritative but adds ~1 extra fetch + parse step for a rounding-error number of edge cases; the curated list already covers every DFW Place ≥5,000 population that the SEO mesh would plausibly target. Note the chosen method in the final doc and list any Places excluded.
- **MOE handling (planned):** Pull `B04006_xxxM` alongside each `_E` estimate. Flag any top-20 entry where `MOE >= 0.5 * estimate` with `⚠`. For Iranian alone in small Places, expect many flags.

---

## Variables to pull (IDs to confirm against live API)

The exact `B04006_xxxE` codes shift between ACS vintages, so **these labels must be re-verified against `https://api.census.gov/data/2023/acs/acs5/groups/B04006.json` before use.** Do not hard-code codes from memory.

Required labels to locate in the B04006 group:

| Scope | Ancestry label (verbatim from B04006) | Variable (TBD) | MOE (TBD) |
|---|---|---|---|
| (a), (b), (c) | Iranian | `B04006_???E` | `B04006_???M` |
| (b) | Afghan | `B04006_???E` | `B04006_???M` |
| (b) | Tajik *(if present; note absence and proceed with Iranian + Afghan only)* | `B04006_???E` | `B04006_???M` |
| (c) | Iraqi | `B04006_???E` | `B04006_???M` |
| (c) | Lebanese | `B04006_???E` | `B04006_???M` |
| (c) | Syrian | `B04006_???E` | `B04006_???M` |
| (c) | Palestinian | `B04006_???E` | `B04006_???M` |
| denominator | Total population | `B01003_001E` | `B01003_001M` |

When filling these in, paste the API's exact label text (e.g. "Estimate!!Total:!!Iranian") next to each code, verbatim, so the audit trail is unambiguous.

---

## Side-by-side summary

*(Pending data. Structure preserved so the team can drop values straight in.)*

| Rank | Scope (a) Strict Iranian — by count | Scope (b) Persian-speaking — by count | Scope (c) Middle-Eastern pool — by count |
|------|---|---|---|
| 1 | — | — | — |
| 2 | — | — | — |
| 3 | — | — | — |
| 4 | — | — | — |
| 5 | — | — | — |
| 6 | — | — | — |
| 7 | — | — | — |
| 8 | — | — | — |
| 9 | — | — | — |
| 10 | — | — | — |

| Rank | Scope (a) — per 1,000 | Scope (b) — per 1,000 | Scope (c) — per 1,000 |
|------|---|---|---|
| 1 | — | — | — |
| 2 | — | — | — |
| 3 | — | — | — |
| 4 | — | — | — |
| 5 | — | — | — |
| 6 | — | — | — |
| 7 | — | — | — |
| 8 | — | — | — |
| 9 | — | — | — |
| 10 | — | — | — |

---

## Scope (a) — Strict Iranian-American
Variable used: `B04006_???E` (label: "Iranian"). **Not yet fetched.**

### By raw count (top 20)
| Rank | Place | Iranian (est.) | MOE | Total pop | per 1,000 |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

### By per-capita rate (top 20)
| Rank | Place | per 1,000 | Iranian (est.) | MOE | Total pop |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

---

## Scope (b) — Persian-speaking diaspora (Iranian + Afghan [+ Tajik])
Variables used: `B04006_???E` (Iranian), `B04006_???E` (Afghan), `B04006_???E` (Tajik — confirm presence). **Not yet fetched.**

If Tajik is not a distinct B04006 code at the 2023 vintage, the scope collapses to Iranian + Afghan and the change must be noted in this section header before the final tables are added.

### By raw count (top 20)
| Rank | Place | Persian-speaking (est.) | Combined MOE¹ | Total pop | per 1,000 |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

### By per-capita rate (top 20)
| Rank | Place | per 1,000 | Persian-speaking (est.) | Combined MOE¹ | Total pop |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

¹ Combined MOE for a sum of independent estimates is `sqrt(MOE_a² + MOE_b² + …)` per Census ACS guidance.

---

## Scope (c) — Practical Middle-Eastern pool (Iranian + Iraqi + Lebanese + Syrian + Palestinian)
Variables used: `B04006_???E` × 5 (one per ancestry above). **Not yet fetched.**

### By raw count (top 20)
| Rank | Place | ME pool (est.) | Combined MOE¹ | Total pop | per 1,000 |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

### By per-capita rate (top 20)
| Rank | Place | per 1,000 | ME pool (est.) | Combined MOE¹ | Total pop |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

---

## Methodology notes

- **DFW filter method:** Pragmatic name-match planned (see brief's curated list of ~60 Places). Authoritative Place-to-County crosswalk via TIGER is a fallback if name collisions appear (e.g. "Lancaster" exists in multiple TX metros — the crosswalk disambiguates by state-place FIPS).
- **Vintage:** Target ACS 2023 5-Year Estimates. Confirm release date and freshest available vintage from `https://api.census.gov/data.html` before locking the doc — if 2024 5-Year has shipped, switch to that.
- **MOE handling:** Per-variable MOE pulled alongside each estimate. Flag `⚠` on rows where `MOE ≥ 0.5 × estimate`. For summed scopes, propagate MOE as quadrature sum.
- **Sub-threshold exclusions:** Drop Places with total population < 5,000 from per-capita rankings to avoid noisy rates (e.g. a Place with 800 residents and an estimated 12 Iranians would post a misleading 15 per 1,000). Keep them in the raw-count ranking if they make the top 20 there.
- **No data inferred from non-ACS sources.** If a number is not in the API response, the cell stays blank.

---

## Appendix — API queries (reproducible)

These are the URLs to execute once network is available. Substitute the actual variable IDs after consulting the variables endpoint.

### 1. Variables list (find the codes)

```
https://api.census.gov/data/2023/acs/acs5/groups/B04006.json
```

Open this in a browser or `curl` it. Search the JSON for the labels "Iranian", "Iraqi", "Lebanese", "Syrian", "Palestinian", "Afghan", "Tajik" and record the variable IDs.

Human-readable group page (same content, formatted):

```
https://api.census.gov/data/2023/acs/acs5/groups/B04006.html
```

### 2. Data pull — all TX Places, all needed ancestries + total pop

Once codes are confirmed, batch into one request (well under the ~50-variable limit). Template:

```
https://api.census.gov/data/2023/acs/acs5?get=NAME,B01003_001E,B01003_001M,B04006_IRANE,B04006_IRANM,B04006_AFGHE,B04006_AFGHM,B04006_TAJKE,B04006_TAJKM,B04006_IRAQE,B04006_IRAQM,B04006_LEBNE,B04006_LEBNM,B04006_SYRNE,B04006_SYRNM,B04006_PALSE,B04006_PALSM&for=place:*&in=state:48
```

Replace the placeholder `B04006_xxxx` strings with the real codes pulled from step 1. A Census API key is optional for low-volume queries but recommended (`&key=YOUR_KEY`); request one at `https://api.census.gov/data/key_signup.html`.

### 3. Optional — Place-to-County crosswalk (only if name-match collisions appear)

```
https://www2.census.gov/geo/docs/maps-data/data/rel2020/place/tab20_place20_county20_natl.txt
```

Filter to `STATEFP_PLACE = 48` and join on the 11 DFW county FIPS codes (Collin 085, Dallas 113, Denton 121, Ellis 139, Hunt 231, Johnson 251, Kaufman 257, Parker 367, Rockwall 397, Tarrant 439, Wise 497).

### 4. Verifying the freshest vintage

```
https://api.census.gov/data.html
```

Look for the latest `acs/acs5` row. If 2024 5-Year is listed (typically released early-to-mid December), use `data/2024/acs/acs5` in place of `data/2023/acs/acs5` throughout.

---

## Hand-off checklist for whoever finishes this

1. Hit the variables endpoint in §Appendix-1, fill in the real `B04006_xxxE` / `_M` codes in the variable table above.
2. Hit the data endpoint in §Appendix-2. Save the raw JSON next to this doc as `density-research-2026-05-18.raw.json` for audit trail.
3. Parse: filter rows to DFW Places (name-match list from brief). Compute scope sums and per-1,000 rates. Drop pop < 5,000 from per-capita rankings.
4. Apply MOE flags (`⚠` where MOE ≥ 50% of estimate; quadrature-sum for combined scopes).
5. Fill the three "Scope" sections and the side-by-side summary. Delete the "BLOCKED" banner at the top.
6. Commit with a message noting the ACS vintage actually used.
