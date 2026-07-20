import type { Metadata } from "next";
import SmartImage from "@/components/shared/SmartImage";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { createMetadata } from "@/data/metadata";
import { breadcrumbSchema, webPageSchema, articleSchema } from "@/data/schema";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Learn about Velvet Couture Medspa, Houston Heights' aesthetics and wellness clinical boutique.",
  path: "/our-story/",
});

export default function AboutPage() {
  return (
    <>
      <SchemaInjector
        schema={[
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "About", url: "/our-story/" }]),
          webPageSchema({
            url: "/our-story/",
            name: "About Velvet Couture Medspa",
            description: "Aesthetics and wellness clinical boutique in Houston Heights.",
            primaryImage: "/Images/storefront.webp",
          }),
          articleSchema({
            url: "/our-story/",
            headline: "About Velvet Couture Medspa",
            description: "Luxury beauty and medical-grade care in Houston Heights.",
            image: "/Images/storefront.webp",
          }),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow">About Velvet</div>
            <h1 className="mb-6">Luxury meets clinical precision.</h1>
            <div className="space-y-5 text-lg text-[var(--color-text-muted)]">
              <p>
                Velvet Couture Medspa is an aesthetics and wellness clinical boutique located in Houston Heights.
                The practice blends luxury beauty with medical-grade care for clients seeking natural, long-term results.
              </p>
              <p>
                Services include advanced injectables, regenerative aesthetics, peptides, IV hydration, HydraFacial,
                chemical peels, hormone replacement therapy, medical-grade skincare, and customized weight management.
              </p>
              <p>
                Every plan is thoughtfully designed and medically guided to support confidence, vitality, and overall well-being.
              </p>
            </div>
          </div>
          <SmartImage src="/Images/storefront.webp" alt="Velvet Couture Medspa provider in a refined clinical boutique" className="aspect-[4/5] rounded-[28px]" />
        </div>
      </section>
    </>
  );
}
