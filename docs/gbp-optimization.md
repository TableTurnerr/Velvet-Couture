# Google Business Profile Optimization — Al-Baghdady

**Owner:** Aleee (per Hisham's allocation 2026-05-13)
**Status:** GBP currently incomplete — primary category is "Cafe", description is decent, opening date wrong, almost no photos, only one menu item populated.

This document is a punch list of the changes that move the needle most, in priority order. The website (al-baghdady.com) has been aligned to whatever GBP says — if you change GBP, ping me and I'll re-align the site schema.

---

## 1. Primary category change (biggest single SEO win)

**Currently:** Primary = `Cafe`

**Change to:** Primary = `Iraqi restaurant`

### Why this matters more than anything else here

Google's local pack ranks businesses by relevance to the **primary category** above all else. "Cafe" is the most competitive category in the US — there are 3,000+ cafes in DFW. "Iraqi restaurant" has maybe 6 in DFW. You go from competing against Starbucks for "cafe near me" to *being one of three options* for "iraqi restaurant near me", "iraqi food dallas", "iraqi food richardson".

### Keep these as secondaries

- Bakery (already there ✓)
- Breakfast restaurant (already there ✓)
- **Add: Halal restaurant** — separate Google category, massive halal-search audience in DFW
- **Add: Middle Eastern restaurant** — broader catch-all
- **Add: Caterer** — separate searchable category, real catering revenue stream

You can have up to 9 secondary categories. Use them all.

---

## 2. Founding date fix

**Currently:** Opening date = June 1, 2013

**Change to:** January 1, 2012 (or whatever specific date the client gives — but the year is 2012, per client confirmation)

The website has been corrected to 2012 throughout. Need GBP to match for NAP consistency.

---

## 3. Business name — leave as-is for now

**Currently:** "Al Baghdady | Bakery and Cafe"

This is what we matched the website schema to. **Don't change it** unless you want a different canonical brand name across web + GBP. If you do change it, tell me and I'll update `CANONICAL_NAME` in `src/data/schema.ts`.

---

## 4. Description rewrite

The current description is decent but undersells some SEO terms. Here's a sharper version under the 750-character limit:

```
Al Baghdady is a family-owned Iraqi bakery and breakfast café in Richardson, TX — 100% halal, Zabihah-verified, with recipes carried over from Baghdad since 1919. Master baker Salah Hassan has spent 50 years perfecting the family trade: fresh samoon from the tandoor, hand-stretched fatayer and manakish, kibbeh, samosas, leblebi (chickpea soup), and Iraq's most beloved sweets — pistachio and walnut baklava, kunafa, mabrouma, ladyfingers (znood al sit), bird's nest, and awama (luqaimat). Traditional Iraqi breakfast served daily except Monday — Albaghdady Plate, Kahi & Qeimar, Baqila, Kubba — paired with karak chai, Yemeni coffee, dried-lime (loomi) and apricot torshana. Catering for weddings, Eid, corporate events, and the wider DFW metroplex.
```

Word count: ~145. Character count: ~727. Hits all the high-value keywords: halal, Zabihah, samoon, fatayer, manakish, kibbeh, leblebi, baklava, kunafa, mabrouma, ladyfingers, znood al sit, awama, luqaimat, Albaghdady plate, Kahi Qeimar, baqila, kubba, karak chai, Yemeni coffee, loomi, torshana, catering.

---

## 5. Photos — even mediocre ones beat zero

**Current GBP photos:** Effectively none / no owner uploads.

**Target:** Upload 12-15 owner-tagged photos minimum across these categories Google exposes:

- **Logo** (1) — square, transparent or white background
- **Cover photo** (1) — wide hero shot (kabob platter, baklava tray, or shopfront)
- **Exterior** (2-3) — shopfront, signage, parking lot
- **Interior** (2-3) — dining area, bakery counter, tandoor if visible
- **Food** (5-7) — one each: baklava, kunafa, samoon, kabob platter, Albaghdady plate, kahi & qeimar, dolma/quzi if available
- **Team / at-work** (1-2) — Salah Hassan at the oven (huge for "family-owned" trust signals)

### Where to get them right now

- The repo already has 6 baklava photos in `/public/Images/gallery/` — those should be uploaded to GBP as well. They're owner-quality.
- The 6 Instagram thumbnails in `/public/Images/instagram/`
- One field visit with a phone camera fills the rest in 20 minutes.

**Important:** Upload as the owner (signed-in to GBP), not as a user. Owner uploads get priority in carousel + don't get filtered.

---

## 6. Menu population

**Currently:** One menu item with name and price.

**Target:** All categories from the website's `MENU` array populated in GBP's menu editor.

Easiest path: open `src/data/menu.ts`, walk through each category, copy the name + price + description into GBP. Categories to mirror in GBP:

1. Kabob & Grill Platters
2. Iraqi Breakfast
3. Shawarma & Sandwiches
4. Traditional Iraqi Specialties
5. Appetizers & Mezze
6. Bakery & Iraqi Sweets
7. Beverages
8. Ice Cream

The GBP menu editor is clunky but you only do this once. It also feeds Google's "Order online" panel, the "Menu" tab in the Knowledge Panel, and the "View menu" CTA.

---

## 7. Attributes to enable

In GBP → Edit Profile → Attributes, turn on:

**Service options**
- Dine-in ✓
- Takeout ✓
- Delivery ✓
- Curbside pickup (if you offer it)
- No-contact delivery (if via Postmates)

**Health & safety** — only if accurate; don't fake these.

**Offerings**
- Halal food ✓ (huge one)
- Vegetarian options ✓
- Late-night food (if hours support)
- Coffee ✓
- Quick bite ✓
- Dessert ✓
- Comfort food ✓
- Catering ✓

**Dining options**
- Breakfast ✓
- Brunch (if applicable)
- Lunch ✓
- Dinner ✓
- Catering ✓
- Dessert ✓

**Amenities**
- Wi-Fi (if applicable)
- High chairs ✓
- Restroom ✓

**Crowd**
- Family-friendly ✓
- Groups ✓
- Tourists (helps with travel-Google searches)

**Planning**
- Accepts reservations: No (matches website acceptsReservations: False)
- Accepts walk-ins: Yes

**Payments**
- Credit cards ✓
- Debit cards ✓
- Mobile NFC payments (if applicable)
- Cash ✓

---

## 8. Q&A seeding

Under Q&A on the GBP, seed your own questions and answer them as the owner. This populates the Knowledge Panel with relevant info before random users do it badly.

Seed these 8-10 questions verbatim (they're the same FAQs from the website, so we're double-dipping the SEO):

1. Is everything halal? → Yes. 100% halal, Zabihah-verified. Whole kitchen and bakery are halal-certified.
2. Do you serve breakfast? → Yes, Iraqi breakfast daily except Monday, 10 AM - 12:30 PM.
3. What's your most popular dish? → Mixed baklava and our pistachio kanafa. The Albaghdady Plate is the signature breakfast.
4. Do you take reservations? → No reservations, walk-ins only. Most parties seated within 15 minutes.
5. Do you deliver? → Yes — directly via our website, or via Postmates.
6. Do you cater for weddings/Eid? → Yes, catering from 20 to 500+ guests. Call (469) 547-2042.
7. What is samoon? → Iraq's traditional oval-shaped bread, baked fresh in our tandoor throughout the day.
8. Is there parking? → Free on-site parking on N Greenville Ave plus adjacent street parking.

---

## 9. Posts (ongoing — weekly cadence ideal)

GBP Posts surface in the Knowledge Panel and have a 7-day shelf life. Keep them rolling:

- **Weekly:** photo + 1-2 sentences highlighting one dish ("Fresh samoon out of the tandoor right now")
- **Events:** Eid, Ramadan iftars ("Special iftar trays — order by Friday")
- **Offers:** if you ever run any
- **Updates:** new menu items, holiday hours

Even one post a week meaningfully bumps engagement signals.

---

## 10a. Women-owned attestation — REQUIRES OWNER LOGIN

Al-Baghdady is owned by **Shahad** (woman-owned business). When her credentials are active in GBP:

1. Edit profile → From the business → "Identifies as women-owned" → Yes
2. A dialog will appear asking her to attest:
   - At least 51% owned by women
   - Women hold management control
   - The business operates independently
3. Tick all three boxes, save.

The dialog only opens when the **legal owner** is signed in. Managers and editors only see plain Yes/No buttons and trigger an "Inapplicable" save error. This is why I temporarily set women-owned to No during initial setup — it's a 2-minute task for Shahad to flip back on the right way.

This is high-value SEO — Google promotes women-owned businesses with a visible badge in the Knowledge Panel and search results.

---

## 10. Reviews — the long game

Current: 1,892 reviews, 4.4 stars. Healthy.

**Don't ask for reviews in bulk** — Google detects and filters them. Instead:

- Print a tiny QR card to the canonical Google review URL (it's in `RESTAURANT.socials.googleReview`)
- Train staff to mention it to happy customers ("if you have a sec, a Google review really helps")
- Respond to every single review — positive and negative — within 48 hours. Response rate is a ranking signal.
- For negative reviews, respond professionally and offer to fix it offline. Don't get into arguments.

---

## Order of operations (suggested)

If you only do three things this week:

1. **Change primary category to "Iraqi restaurant"** (5 minutes)
2. **Upload 8-12 photos from the repo's gallery + one in-person visit** (30 minutes)
3. **Fix the founding date to 2012** (1 minute)

Those three alone will measurably move local rankings within 2-4 weeks.

Then in week 2:

4. Replace description with the optimized copy above
5. Populate menu items
6. Enable attributes
7. Seed Q&A

Week 3+: weekly posts, ongoing review engagement.

---

## When you've done any of this, tell me

I want to keep the site schema and the GBP saying the same thing. If GBP brand name changes, primary category changes, or description gets a major update, ping me and I'll mirror it in `src/data/restaurant.ts` and `src/data/schema.ts`.
