export type MenuItem = {
  name: string;
  description: string;
  price: string;
  image?: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
  items: MenuItem[];
};

export const MENU: MenuCategory[] = [
  {
    id: "injectables",
    name: "Injectables",
    description:
      "Wrinkle relaxers and facial balancing treatments designed for refreshed, natural-looking results.",
    image: "/Images/hero.webp",
    items: [
      {
        name: "Wrinkle Relaxer",
        description:
          "Botox, Jeuveau, Dysport, and Daxxify plans for forehead lines, 11s, crow's feet, brow lift, and expression softening.",
        price: "Consultation based",
        popular: true,
        image: "/Images/specialties/botox.webp",
      },
      {
        name: "Facial Balancing & Filler",
        description:
          "A full-face approach to lips, cheeks, chin, jawline, and profile balancing using anatomy-led planning.",
        price: "Consultation based",
        popular: true,
        image: "/Images/specialties/filler.webp",
      },
      {
        name: "Clarius L20 Ultrasound Guidance",
        description:
          "Advanced handheld ultrasound support for safer, more precise injectable assessment and treatment planning.",
        price: "Included when appropriate",
        image: "/Images/dish-1.webp",
      },
    ],
  },
  {
    id: "skin-care",
    name: "Facials & Skin Care",
    description:
      "HydraFacial, dermaplaning, chemical peels, and medical-grade skincare for glow, clarity, and texture.",
    image: "/Images/menu/bakery-sweets.webp",
    items: [
      {
        name: "HydraFacial",
        description:
          "A deeply cleansing and hydrating facial treatment customized for smoother, brighter, more refreshed skin.",
        price: "Book online",
        popular: true,
        image: "/Images/specialties/hydrafacial.webp",
      },
      {
        name: "Dermaplaning Facial",
        description:
          "Exfoliation and skin-smoothing facial care for a polished glow and better product absorption.",
        price: "Book online",
        image: "/Images/specialties/skin-care.webp",
      },
      {
        name: "Chemical Peel",
        description:
          "Customized peel treatments for tone, texture, pigmentation, congestion, and skin renewal.",
        price: "Book online",
        popular: true,
        image: "/Images/specialties/chemical-peel.webp",
      },
      {
        name: "Velvet Skin Launch Special",
        description:
          "$50 off your first facial, HydraFacial, dermaplaning facial, or chemical peel with Brooke. Use code GLOW50.",
        price: "GLOW50",
        popular: true,
        image: "/Images/gallery/natural-refinement.webp",
      },
    ],
  },
  {
    id: "regenerative",
    name: "Regenerative Aesthetics",
    description:
      "Microneedling, PRP, PRF, EZ Gel, PDRN, and biostimulators for collagen support and long-term skin quality.",
    image: "/Images/bakery.webp",
    items: [
      {
        name: "SkinPen Microneedling",
        description:
          "Collagen induction treatment for texture, pores, fine lines, acne scarring, and overall skin rejuvenation.",
        price: "Book consultation",
        popular: true,
        image: "/Images/specialties/microneedling.webp",
      },
      {
        name: "Velvet DNA Revive",
        description:
          "Medical microneedling with Salmon PDRN to support repair, elasticity, brightness, and radiance.",
        price: "From $550",
      },
      {
        name: "Velvet Couture DNA Lift",
        description:
          "PRP plus Salmon PDRN microneedling for collagen stimulation, healing support, and full-face glow.",
        price: "From $650",
        popular: true,
        image: "/Images/gallery/facial-balancing.webp",
      },
      {
        name: "PRF EZ Gel Under-Eye Rejuvenation",
        description:
          "Natural biostimulatory under-eye care designed to soften hollowness, brighten dark circles, and improve fine lines.",
        price: "From $500",
      },
      {
        name: "Radiesse & Sculptra",
        description:
          "Biostimulators that restore structure and stimulate collagen for gradual, long-lasting rejuvenation.",
        price: "From $850",
      },
    ],
  },
  {
    id: "wellness",
    name: "Wellness",
    description:
      "Medical wellness programs for metabolism, energy, recovery, hormones, and longevity-focused support.",
    image: "/Images/dish-2.webp",
    items: [
      {
        name: "Medical Weight Management",
        description:
          "Customized weight management programs with clinical oversight, progress monitoring, and long-term strategy.",
        price: "Consultation based",
        popular: true,
        image: "/Images/specialties/weight-management.webp",
      },
      {
        name: "Peptides & NAD+",
        description:
          "Personalized protocols for recovery, clarity, metabolism, energy, and wellness optimization.",
        price: "Consultation based",
        image: "/Images/specialties/peptides.webp",
      },
      {
        name: "IV Hydration & Wellness Injections",
        description:
          "Hydration and nutrient support designed around your goals and provider recommendations.",
        price: "Book online",
      },
      {
        name: "Hormone Replacement Therapy",
        description:
          "Bioidentical hormone optimization planning for appropriate candidates after consultation.",
        price: "Consultation based",
      },
    ],
  },
  {
    id: "memberships",
    name: "Memberships & Events",
    description:
      "Maintenance options, payment support, specials, group events, and training opportunities.",
    image: "/Images/dish-3.webp",
    items: [
      {
        name: "Velvet Tox Bank Membership",
        description:
          "A membership option for clients who want to maintain consistent wrinkle relaxer care.",
        price: "See membership details",
        popular: true,
        image: "/Images/gallery/community-moments.webp",
      },
      {
        name: "Payment Plans",
        description:
          "Flexible payment options for larger treatment plans and long-term aesthetic goals.",
        price: "Available",
      },
      {
        name: "Specials & Events",
        description:
          "Seasonal offers, launch specials, skincare events, and community experiences.",
        price: "Varies",
      },
      {
        name: "Train with Natilia",
        description:
          "Training opportunities for providers focused on aesthetic skill, treatment planning, and patient-centered technique.",
        price: "Inquiry based",
      },
    ],
  },
];
