export const RESTAURANT = {
  name: "Velvet Couture Medspa",
  legalName: "Velvet Couture Medspa",
  tagline: "Aesthetics & Wellness Clinical Boutique in Houston Heights",
  shortDescription:
    "Houston Heights boutique medspa specializing in natural-looking injectables, facial balancing, HydraFacial, microneedling, regenerative aesthetics, peptides, NAD+, IV hydration, hormone replacement therapy, medical-grade skincare, and customized weight management.",
  longDescription:
    "Velvet Couture Medspa is an aesthetics and wellness clinical boutique located in Houston Heights, offering a refined blend of luxury beauty and medical-grade care. Our approach combines facial balancing, advanced injectables, regenerative aesthetics, skin health, and longevity-focused wellness planning to support confidence, vitality, and natural-looking results.",
  footerDescription:
    "Velvet Couture Medspa brings luxury beauty and clinical precision together in Houston Heights. Every consultation and treatment plan is customized around your anatomy, skin, wellness goals, and long-term confidence.",

  address: {
    street: "535 W 20th St. Suite 6",
    city: "Houston",
    state: "TX",
    zip: "77008",
    country: "US",
    full: "535 W 20th St. Suite 6, Houston, TX 77008",
  },

  geo: {
    latitude: 29.8036,
    longitude: -95.4066,
  },

  phone: process.env.NEXT_PUBLIC_PHONE ?? "(713) 555-0130",
  phoneRaw: process.env.NEXT_PUBLIC_PHONE_RAW ?? "+17135550130",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hello@velvetcouturemedspa.com",
  url: "https://www.velvetcouturemedspa.com",

  priceRange: "$$",
  cuisine: ["Aesthetics", "Wellness", "Injectables", "Skin Care"],
  servesCuisine: "Aesthetics and wellness services",
  paymentAccepted: "Cash, Credit Card, Payment Plans",
  currenciesAccepted: "USD",

  founded: "2026",
  familyRecipeSince: "2026",

  hours: [
    { day: "Monday", open: "10:00", close: "18:00" },
    { day: "Tuesday", open: "10:00", close: "18:00" },
    { day: "Wednesday", open: "10:00", close: "18:00" },
    { day: "Thursday", open: "10:00", close: "18:00" },
    { day: "Friday", open: "10:00", close: "17:00" },
    { day: "Saturday", open: "10:00", close: "15:00" },
    { day: "Sunday", open: "00:00", close: "00:00" },
  ],

  breakfastHours: {
    note: "Consultations and treatments by appointment only",
    open: "10:00",
    close: "18:00",
    closedDays: ["Sunday"] as string[],
  },

  ratingValue: 5.0,
  reviewCount: 80,

  socials: {
    instagram:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/velvetcouturemedspa/",
    facebook:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/velvetcouturemedspa/",
    googleBusinessProfile:
      process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ?? "https://www.google.com/search?q=Velvet+Couture+Medspa+Houston",
    googleReview:
      process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? "https://www.google.com/search?q=Velvet+Couture+Medspa+reviews",
  },

  orderOnline:
    process.env.NEXT_PUBLIC_ORDER_ONLINE_URL ?? "https://velvetcouturemedspa.janeapp.com/",

  features: [
    "Natural-Looking Injectables",
    "Facial Balancing",
    "HydraFacial",
    "SkinPen Microneedling",
    "PRP, PRF, EZ Gel & PDRN",
    "Peptides & NAD+",
    "Medical Weight Management",
    "Hormone Replacement Therapy",
    "By Appointment Only",
    "Houston Heights",
  ],

  areasServed: [
    "Houston Heights",
    "The Heights",
    "Montrose",
    "River Oaks",
    "Memorial",
    "Garden Oaks",
    "Oak Forest",
    "Downtown Houston",
    "Midtown Houston",
    "Greater Houston",
  ],

  cateringAreas:
    "Houston Heights, Montrose, River Oaks, Memorial, Garden Oaks, Oak Forest, Downtown Houston, Midtown, and Greater Houston",

  pressQuote: {
    text: "Ranked #1 among Houston's Top 5 Medspas for Natural Results.",
    source: "PeekWire",
  },
} as const;

export type RestaurantHours = (typeof RESTAURANT.hours)[number];
