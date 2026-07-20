import type { Metadata } from "next";
import Link from "next/link";
import SmartImage from "@/components/shared/SmartImage";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { SPECIALTIES } from "@/data/specialties";
import { createMetadata } from "@/data/metadata";
import { breadcrumbSchema, webPageSchema } from "@/data/schema";

export const metadata: Metadata = createMetadata({
  title: "Treatments",
  description: "Explore Velvet Couture Medspa treatment spotlights for injectables, filler, HydraFacial, microneedling, weight management, peptides, and NAD+.",
  path: "/specialties/",
});

export default function TreatmentsPage() {
  return (
    <>
      <SchemaInjector
        schema={[
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Treatments", url: "/specialties/" }]),
          webPageSchema({
            url: "/specialties/",
            name: "Treatment Spotlights",
            description: "Velvet Couture Medspa treatment guide and service spotlights.",
            primaryImage: "/Images/hero.webp",
          }),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad">
          <div className="eyebrow">Treatments</div>
          <h1 className="mb-6">Treatment spotlights.</h1>
          <p className="max-w-3xl text-lg text-[var(--color-text-muted)]">
            Learn more about the aesthetic and wellness services available at Velvet Couture Medspa.
          </p>
        </div>
      </section>
      <section className="container-pad pb-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SPECIALTIES.map((item) => (
            <Link key={item.slug} href={`/specialties/${item.slug}/`} className="card block overflow-hidden">
              {item.image && <SmartImage src={item.image} alt={`${item.name} at Velvet Couture Medspa`} className="aspect-[4/3]" />}
              <div className="p-6">
                <div className="eyebrow">{item.heroEyebrow}</div>
                <h2 className="mb-3 text-2xl">{item.name}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">{item.metaDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
