import type { Metadata } from "next";
import { RESTAURANT } from "./restaurant";

const BASE_URL = RESTAURANT.url;
const DEFAULT_OG = `${BASE_URL}/Images/hero.webp`;

export type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
  noindex?: boolean;
};

const BASE_KEYWORDS = [
  "Velvet Couture Medspa",
  "Houston medspa",
  "Houston Heights medspa",
  "Botox Houston",
  "Jeuveau Houston",
  "Daxxify Houston",
  "dermal filler Houston",
  "facial balancing Houston",
  "HydraFacial Houston",
  "chemical peel Houston",
  "microneedling Houston",
  "PRP facial Houston",
  "PRF EZ Gel Houston",
  "medical weight loss Houston",
  "peptides Houston",
  "NAD Houston",
  "IV hydration Houston",
  "hormone replacement therapy Houston",
  "medical grade skincare Houston",
];

export function createMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG,
  keywords,
  noindex = false,
}: PageMetaInput): Metadata {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const fullTitle = title.includes(RESTAURANT.name) ? title : `${title} | ${RESTAURANT.name}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: fullTitle,
    description,
    keywords: [...BASE_KEYWORDS, ...(keywords ?? [])],
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: RESTAURANT.name,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${RESTAURANT.name} in Houston Heights`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    icons: {
      icon: "/icon.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
    other: {
      "theme-color": "#56242d",
    },
  };
}
