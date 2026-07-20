export type Specialty = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroEyebrow?: string;
  heroHeadline: string;
  heroSubheadline?: string;
  primaryBlock: { heading: string; body: string };
  image?: string;
  relatedMenuItemNames?: string[];
  faqs?: { question: string; answer: string }[];
};

export const SPECIALTIES: Specialty[] = [
  {
    slug: "botox",
    name: "Wrinkle Relaxer",
    metaTitle: "Botox, Jeuveau & Daxxify in Houston Heights | Velvet Couture Medspa",
    metaDescription:
      "Natural-looking wrinkle relaxer treatments in Houston Heights for forehead lines, 11s, crow's feet, brow lift, and expression softening.",
    keywords: ["Botox Houston", "Jeuveau Houston", "Daxxify Houston", "wrinkle relaxer Houston"],
    heroEyebrow: "NATURAL MOVEMENT",
    heroHeadline: "Wrinkle relaxers in Houston Heights",
    primaryBlock: {
      heading: "Softened lines without an overdone look",
      body: "Velvet Couture Medspa offers Botox, Jeuveau, Dysport, and Daxxify plans tailored to your anatomy and expression patterns. Treatments can address forehead lines, 11s, crow's feet, brow lift, and other areas where subtle refinement makes the face look refreshed.",
    },
    image: "/Images/specialties/botox.webp",
    relatedMenuItemNames: ["Wrinkle Relaxer"],
    faqs: [
      { question: "When will I see results?", answer: "Most clients begin seeing results in 3 to 5 days, with full effect around 10 to 14 days." },
      { question: "How long does it last?", answer: "Most wrinkle relaxer results last about 3 to 4 months." },
    ],
  },
  {
    slug: "filler",
    name: "Facial Balancing & Filler",
    metaTitle: "Facial Balancing & Filler in Houston | Velvet Couture Medspa",
    metaDescription:
      "Facial balancing and dermal filler treatments in Houston for lips, cheeks, chin, jawline, and profile refinement.",
    keywords: ["filler Houston", "facial balancing Houston", "lip filler Houston", "jawline filler Houston"],
    heroEyebrow: "ANATOMY-LED",
    heroHeadline: "Facial balancing with refined filler planning",
    primaryBlock: {
      heading: "Structure, symmetry, and refreshed volume",
      body: "Filler at Velvet Couture Medspa is planned around the whole face rather than isolated features. Treatment may support lips, cheeks, chin, jawline, and profile balancing while preserving natural proportions.",
    },
    image: "/Images/specialties/filler.webp",
    relatedMenuItemNames: ["Facial Balancing & Filler"],
    faqs: [
      { question: "Will I see results immediately?", answer: "Yes. Results are visible immediately, with swelling settling over 1 to 2 weeks." },
      { question: "How long does filler last?", answer: "Depending on area and product, results can last about 6 to 18 months." },
    ],
  },
  {
    slug: "hydrafacial",
    name: "HydraFacial",
    metaTitle: "HydraFacial in Houston Heights | Velvet Couture Medspa",
    metaDescription:
      "HydraFacial and facial treatments in Houston Heights for glow, hydration, clarity, and smoother skin.",
    keywords: ["HydraFacial Houston", "facial Houston Heights", "dermaplaning Houston", "chemical peel Houston"],
    heroEyebrow: "GLOW50",
    heroHeadline: "HydraFacial and skin glow treatments",
    primaryBlock: {
      heading: "Skin treatments for glow, clarity, and texture",
      body: "HydraFacial, dermaplaning, chemical peels, and medical-grade skincare are customized to your skin goals. New skin clients can use code GLOW50 for $50 off eligible first facial services with Brooke.",
    },
    image: "/Images/specialties/hydrafacial.webp",
    relatedMenuItemNames: ["HydraFacial", "Dermaplaning Facial", "Chemical Peel"],
  },
  {
    slug: "microneedling",
    name: "Microneedling & Regenerative Skin",
    metaTitle: "Microneedling, PRP, PRF & PDRN Houston | Velvet Couture Medspa",
    metaDescription:
      "Regenerative skin treatments in Houston including SkinPen microneedling, PRP, PRF, EZ Gel, and Salmon PDRN.",
    keywords: ["microneedling Houston", "PRP facial Houston", "PDRN Houston", "PRF EZ Gel Houston"],
    heroEyebrow: "COLLAGEN SUPPORT",
    heroHeadline: "Regenerative skin treatments for long-term quality",
    primaryBlock: {
      heading: "Collagen-focused care for texture, glow, and firmness",
      body: "Regenerative treatments include SkinPen microneedling, PRP, PRF, EZ Gel, Salmon PDRN, and biostimulators. Plans may target fine lines, acne scarring, laxity, under-eye quality, dullness, and overall skin rejuvenation.",
    },
    image: "/Images/specialties/microneedling.webp",
    relatedMenuItemNames: ["SkinPen Microneedling", "Velvet DNA Revive", "PRF EZ Gel Under-Eye Rejuvenation"],
  },
  {
    slug: "weight-management",
    name: "Weight Management",
    metaTitle: "Medical Weight Management Houston | Velvet Couture Medspa",
    metaDescription:
      "Customized medical weight management programs in Houston with wellness-focused clinical support.",
    keywords: ["medical weight loss Houston", "weight management Houston", "wellness clinic Houston"],
    heroEyebrow: "WELLNESS",
    heroHeadline: "Medical weight management with clinical support",
    primaryBlock: {
      heading: "Personalized plans for sustainable progress",
      body: "Weight management programs are customized around your goals, health history, lifestyle, and provider recommendations. Velvet Couture Medspa supports progress with monitoring, education, and wellness planning.",
    },
    image: "/Images/specialties/weight-management.webp",
    relatedMenuItemNames: ["Medical Weight Management"],
  },
  {
    slug: "peptides",
    name: "Peptides & NAD+",
    metaTitle: "Peptides & NAD+ Houston | Velvet Couture Medspa",
    metaDescription:
      "Peptide and NAD+ wellness protocols in Houston for energy, recovery, metabolism, clarity, and longevity support.",
    keywords: ["peptides Houston", "NAD Houston", "wellness injections Houston"],
    heroEyebrow: "LONGEVITY",
    heroHeadline: "Peptides and NAD+ for wellness optimization",
    primaryBlock: {
      heading: "Support for energy, recovery, and vitality",
      body: "Peptides and NAD+ protocols are selected after consultation and may support recovery, metabolism, cognitive clarity, cellular energy, and longevity-focused goals.",
    },
    image: "/Images/specialties/peptides.webp",
    relatedMenuItemNames: ["Peptides & NAD+"],
  },
];

export const SPECIALTY_SLUGS = SPECIALTIES.map((s) => s.slug);
