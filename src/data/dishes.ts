export type DishEntry = {
  slug: string;
  name: string;
  aliases: string[];
  heroImage: string;
  shortDescription: string;
  relatedSpecialtySlug?: string;
  relatedMenuItemNames?: string[];
};

export const DISHES: DishEntry[] = [
  {
    slug: "botox",
    name: "Wrinkle Relaxer",
    aliases: ["Botox", "Jeuveau", "Daxxify", "Dysport"],
    heroImage: "/Images/specialties/botox.webp",
    shortDescription: "Natural-looking wrinkle relaxer treatment planning.",
    relatedSpecialtySlug: "botox",
    relatedMenuItemNames: ["Wrinkle Relaxer"],
  },
  {
    slug: "hydrafacial",
    name: "HydraFacial",
    aliases: ["Facial", "Skin Treatment"],
    heroImage: "/Images/specialties/hydrafacial.webp",
    shortDescription: "Hydrating skin treatment for glow, clarity, and texture.",
    relatedSpecialtySlug: "hydrafacial",
    relatedMenuItemNames: ["HydraFacial"],
  },
];
