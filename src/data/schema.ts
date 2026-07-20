import { RESTAURANT } from "./restaurant";
import { FAQS, type FAQ } from "./faqs";
import { MENU } from "./menu";

const BASE_URL = RESTAURANT.url;

function absolute(path: string) {
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${BASE_URL}/#business`,
    name: RESTAURANT.name,
    legalName: RESTAURANT.legalName,
    url: BASE_URL,
    image: absolute("/Images/hero.webp"),
    telephone: RESTAURANT.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT.address.street,
      addressLocality: RESTAURANT.address.city,
      addressRegion: RESTAURANT.address.state,
      postalCode: RESTAURANT.address.zip,
      addressCountry: RESTAURANT.address.country,
    },
    priceRange: RESTAURANT.priceRange,
    areaServed: RESTAURANT.areasServed,
    sameAs: [RESTAURANT.socials.instagram, RESTAURANT.socials.facebook],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: RESTAURANT.name,
    publisher: { "@id": `${BASE_URL}/#business` },
  };
}

export function localBusinessSchema() {
  return organizationSchema();
}

export function restaurantSchema() {
  return organizationSchema();
}

export function menuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Velvet Couture Medspa Services",
    itemListElement: MENU.map((category) => ({
      "@type": "OfferCatalog",
      name: category.name,
      description: category.description,
      itemListElement: category.items.map((item) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.description,
        },
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          description: item.price,
        },
      })),
    })),
  };
}

export function faqSchema(faqs: FAQ[] = FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

type CateringServiceInput = {
  name?: string;
  description?: string;
};

export function cateringServiceSchema(input: CateringServiceInput = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name ?? "Group Events and Aesthetic Training",
    description:
      input.description ??
      "Group skincare events, medspa education, and provider training opportunities with Velvet Couture Medspa.",
    provider: { "@id": `${BASE_URL}/#business` },
    areaServed: RESTAURANT.areasServed,
  };
}

export function articleSchema({
  url,
  headline,
  description,
  image = "/Images/hero.webp",
}: {
  url: string;
  headline: string;
  description: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: absolute(image),
    url: absolute(url),
    author: { "@id": `${BASE_URL}/#business` },
    publisher: { "@id": `${BASE_URL}/#business` },
  };
}

export function webPageSchema({
  url,
  name,
  description,
  primaryImage = "/Images/hero.webp",
}: {
  url: string;
  name: string;
  description: string;
  primaryImage?: string;
  hasBreadcrumb?: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: absolute(url),
    name,
    description,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absolute(primaryImage),
    },
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#business` },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.url),
    })),
  };
}
