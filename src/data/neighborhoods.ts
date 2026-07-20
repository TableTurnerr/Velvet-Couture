export type Neighborhood = {
  slug: string;
  city: string;
  state: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroHeadline: string;
  heroSubheadline: string;
  driveTime: string;
  intro: string;
  body: string;
  popularDishes: string[];
};

const topics = ["Botox", "HydraFacial", "Facial Balancing", "Weight Management"];

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: "houston-heights-tx",
    city: "Houston Heights",
    state: "TX",
    metaTitle: "Houston Heights Medspa | Velvet Couture Medspa",
    metaDescription: "Boutique medspa in Houston Heights for injectables, HydraFacial, microneedling, weight management, peptides, and wellness.",
    keywords: ["Houston Heights medspa", "Botox Houston Heights", "HydraFacial Houston Heights"],
    heroHeadline: "A refined medspa in Houston Heights",
    heroSubheadline: "Aesthetics and wellness care by appointment at 535 W 20th St. Suite 6.",
    driveTime: "Located in Houston Heights",
    intro: "Velvet Couture Medspa serves clients in the Heights with natural-looking aesthetic and wellness care.",
    body: "Clients visit for wrinkle relaxers, facial balancing, HydraFacial, regenerative aesthetics, peptides, NAD+, IV hydration, hormone optimization, and customized weight management.",
    popularDishes: topics,
  },
  {
    slug: "montrose-tx",
    city: "Montrose",
    state: "TX",
    metaTitle: "Montrose Medspa Near You | Velvet Couture Medspa",
    metaDescription: "Medspa near Montrose for Botox, filler, HydraFacial, microneedling, and wellness treatments.",
    keywords: ["Montrose medspa", "Botox Montrose", "filler Montrose"],
    heroHeadline: "Medspa care near Montrose",
    heroSubheadline: "Natural-looking injectables and wellness support minutes from Montrose.",
    driveTime: "About 15 minutes from Montrose",
    intro: "Montrose clients choose Velvet Couture Medspa for thoughtful aesthetic planning and clinical precision.",
    body: "Book a consultation for facial balancing, wrinkle relaxers, skin treatments, regenerative aesthetics, and wellness programs tailored to your goals.",
    popularDishes: topics,
  },
  {
    slug: "river-oaks-tx",
    city: "River Oaks",
    state: "TX",
    metaTitle: "River Oaks Medspa | Velvet Couture Medspa Houston",
    metaDescription: "Boutique Houston medspa near River Oaks for facial balancing, wrinkle relaxer, skincare, and wellness.",
    keywords: ["River Oaks medspa", "Botox River Oaks", "facial balancing River Oaks"],
    heroHeadline: "Aesthetic and wellness care near River Oaks",
    heroSubheadline: "Refined treatment planning for clients seeking subtle, natural results.",
    driveTime: "About 15 minutes from River Oaks",
    intro: "Velvet Couture Medspa supports River Oaks clients with personalized aesthetics and wellness care.",
    body: "The clinical boutique experience includes injectables, HydraFacial, microneedling, peptides, NAD+, and weight management programs.",
    popularDishes: topics,
  },
  {
    slug: "memorial-tx",
    city: "Memorial",
    state: "TX",
    metaTitle: "Memorial Houston Medspa | Velvet Couture Medspa",
    metaDescription: "Houston medspa near Memorial for Botox, dermal filler, HydraFacial, microneedling, peptides, and wellness.",
    keywords: ["Memorial medspa", "Botox Memorial Houston", "HydraFacial Memorial Houston"],
    heroHeadline: "Medspa care for Memorial clients",
    heroSubheadline: "Consultation-led aesthetics and wellness programs in Houston Heights.",
    driveTime: "About 20 minutes from Memorial",
    intro: "Memorial clients visit Velvet Couture Medspa for careful assessment and long-term care planning.",
    body: "Services include wrinkle relaxers, filler, regenerative skin treatments, wellness injections, hormone support, and medical weight management.",
    popularDishes: topics,
  },
];

export const NEIGHBORHOOD_SLUGS = NEIGHBORHOODS.map((n) => n.slug);
