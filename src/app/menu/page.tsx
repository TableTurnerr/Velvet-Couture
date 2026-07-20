import type { Metadata } from "next";
import SmartImage from "@/components/shared/SmartImage";
import ThemeBtn from "@/components/shared/ThemeBtn";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { MENU } from "@/data/menu";
import { RESTAURANT } from "@/data/restaurant";
import { breadcrumbSchema, menuSchema, webPageSchema } from "@/data/schema";
import { createMetadata } from "@/data/metadata";

export const metadata: Metadata = createMetadata({
  title: "Services",
  description:
    "Explore Velvet Couture Medspa services including injectables, facial balancing, HydraFacial, microneedling, regenerative aesthetics, peptides, NAD+, and weight management.",
  path: "/menu/",
});

export default function ServicesPage() {
  return (
    <>
      <SchemaInjector
        schema={[
          menuSchema(),
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Services", url: "/menu/" }]),
          webPageSchema({
            url: "/menu/",
            name: "Velvet Couture Medspa Services",
            description: "Aesthetic and wellness services in Houston Heights.",
            primaryImage: "/Images/hero.webp",
          }),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad">
          <div className="eyebrow">Services</div>
          <h1 className="mb-6">Aesthetic and wellness services.</h1>
          <p className="max-w-3xl text-lg text-[var(--color-text-muted)]">
            Consultation-led treatments for natural-looking injectables, skin health, regenerative aesthetics, and wellness.
          </p>
        </div>
      </section>
      <section className="container-pad pb-20">
        <div className="grid gap-8">
          {MENU.map((category) => (
            <article key={category.id} className="card overflow-hidden">
              <div className="grid md:grid-cols-[0.42fr_0.58fr]">
                <SmartImage src={category.image} alt={`${category.name} at ${RESTAURANT.name}`} className="h-full min-h-[320px]" />
                <div className="p-6 md:p-8">
                  <h2 className="mb-3">{category.name}</h2>
                  <p className="mb-6 text-[var(--color-text-muted)]">{category.description}</p>
                  <div className="grid gap-4">
                    {category.items.map((item) => (
                      <div key={item.name} className="border-t border-[var(--color-border)] pt-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3>{item.name}</h3>
                          <span className="text-sm font-semibold text-[var(--color-primary)]">{item.price}</span>
                        </div>
                        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <ThemeBtn href={RESTAURANT.orderOnline} external variant="primary" className="mt-7">
                    Book Online
                  </ThemeBtn>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
