import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ThemeBtn from "@/components/shared/ThemeBtn";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { NEIGHBORHOODS, NEIGHBORHOOD_SLUGS } from "@/data/neighborhoods";
import { RESTAURANT } from "@/data/restaurant";
import { breadcrumbSchema, localBusinessSchema, webPageSchema } from "@/data/schema";
import { createMetadata } from "@/data/metadata";

export function generateStaticParams() {
  return NEIGHBORHOOD_SLUGS.map((city) => ({ city }));
}

function getArea(city: string) {
  return NEIGHBORHOODS.find((area) => area.slug === city);
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const area = getArea(city);
  if (!area) return {};
  return createMetadata({
    title: area.metaTitle,
    description: area.metaDescription,
    path: `/near/${area.slug}/`,
    keywords: area.keywords,
  });
}

export default async function ServiceAreaDetailPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const area = getArea(city);
  if (!area) notFound();

  return (
    <>
      <SchemaInjector
        schema={[
          localBusinessSchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Service Areas", url: "/near/" },
            { name: area.city, url: `/near/${area.slug}/` },
          ]),
          webPageSchema({
            url: `/near/${area.slug}/`,
            name: area.metaTitle,
            description: area.metaDescription,
            primaryImage: "/Images/hero.webp",
          }),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad max-w-4xl">
          <div className="eyebrow">{area.driveTime}</div>
          <h1 className="mb-6">{area.heroHeadline}</h1>
          <p className="mb-5 text-lg text-[var(--color-text-muted)]">{area.heroSubheadline}</p>
          <p className="mb-5 text-[var(--color-text-muted)]">{area.intro}</p>
          <p className="mb-8 text-[var(--color-text-muted)]">{area.body}</p>
          <ThemeBtn href={RESTAURANT.orderOnline} external variant="primary">Book Consultation</ThemeBtn>
        </div>
      </section>
    </>
  );
}
