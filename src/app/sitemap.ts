import type { MetadataRoute } from "next";
import { RESTAURANT } from "@/data/restaurant";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import { SPECIALTIES } from "@/data/specialties";

// Required by Next 15 when `output: "export"` is set in next.config.ts.
export const dynamic = "force-static";

type Priority = 0.3 | 0.7 | 0.75 | 0.8 | 0.9 | 1.0;
type ChangeFrequency = "weekly" | "monthly";

const STATIC_ROUTES: { path: string; priority: Priority; changeFrequency: ChangeFrequency }[] = [
  { path: "/",                 priority: 1.0,  changeFrequency: "weekly"  },
  { path: "/menu/",            priority: 0.9,  changeFrequency: "weekly"  },
  { path: "/our-story/",       priority: 0.8,  changeFrequency: "monthly" },
  { path: "/iraqi-cuisine/",   priority: 0.8,  changeFrequency: "monthly" },
  { path: "/bakery/",          priority: 0.8,  changeFrequency: "monthly" },
  { path: "/catering/",        priority: 0.8,  changeFrequency: "monthly" },
  { path: "/near/",            priority: 0.75, changeFrequency: "monthly" },
  { path: "/specialties/",     priority: 0.75, changeFrequency: "monthly" },
  { path: "/return-policy/",   priority: 0.3,  changeFrequency: "monthly" },
];

function join(path: string): string {
  return new URL(path, RESTAURANT.url).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: join(r.path),
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const neighborhoodEntries: MetadataRoute.Sitemap = NEIGHBORHOODS.map((n) => ({
    url: join(`/near/${n.slug}/`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const specialtyEntries: MetadataRoute.Sitemap = SPECIALTIES.map((s) => ({
    url: join(`/specialties/${s.slug}/`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...neighborhoodEntries, ...specialtyEntries];
}
