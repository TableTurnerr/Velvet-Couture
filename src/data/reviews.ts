export type Review = {
  author: string;
  rating: number;
  text: string;
  date?: string;
  source?: "Google" | "Yelp" | "Tripadvisor" | "Zabihah";
};

export const REVIEWS: Review[] = [
  {
    author: "Velvet Client",
    rating: 5,
    text: "The care felt personal from the consultation through the treatment. Everything was explained clearly and the results looked natural.",
    source: "Google",
  },
  {
    author: "Houston Heights Client",
    rating: 5,
    text: "Beautiful space, thoughtful provider, and a treatment plan that actually matched my goals instead of feeling rushed.",
    source: "Google",
  },
  {
    author: "Wellness Client",
    rating: 5,
    text: "I booked for aesthetics and ended up learning so much about skin health and wellness options. The experience felt elevated and clinical.",
    source: "Google",
  },
  {
    author: "Skin Care Client",
    rating: 5,
    text: "My HydraFacial left my skin smooth and bright. I appreciated the aftercare guidance and product recommendations.",
    source: "Google",
  },
  {
    author: "Injectables Client",
    rating: 5,
    text: "The injector took her time with mapping and facial balance. I wanted refreshed, not overdone, and that is exactly what I got.",
    source: "Google",
  },
];

export const PRESS_QUOTES = [
  {
    quote: "Ranked #1 among Houston's Top 5 Medspas for Natural Results",
    source: "PeekWire",
  },
  {
    quote: "80+ five-star Google reviews",
    source: "Google",
  },
  {
    quote: "Advanced ultrasound-supported aesthetic care",
    source: "Velvet Couture Medspa",
  },
  {
    quote: "Luxury beauty meets clinical precision",
    source: "Velvet Couture Medspa",
  },
];
