import type { Metadata } from "next";
import Link from "next/link";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { createMetadata } from "@/data/metadata";
import { breadcrumbSchema, webPageSchema } from "@/data/schema";

const topics = [
  ["Wrinkle Relaxers", "Botox, Jeuveau, Dysport, and Daxxify soften expression lines while preserving natural movement.", "/specialties/botox/"],
  ["Facial Balancing", "A full-face approach to lips, cheeks, chin, jawline, and profile refinement.", "/specialties/filler/"],
  ["HydraFacial & Skin Care", "Glow-focused skin services for hydration, texture, tone, and clarity.", "/specialties/hydrafacial/"],
  ["Regenerative Skin", "Microneedling, PRP, PRF, EZ Gel, PDRN, and biostimulators support collagen and skin quality.", "/specialties/microneedling/"],
  ["Wellness", "Weight management, peptides, NAD+, IV hydration, and hormone support begin with personalized consultation.", "/specialties/weight-management/"],
];

export const metadata: Metadata = createMetadata({
  title: "Aesthetic & Wellness Guide",
  description: "A guide to Velvet Couture Medspa aesthetics and wellness treatments in Houston Heights.",
  path: "/iraqi-cuisine/",
});

export default function GuidePage() {
  return (
    <>
      <SchemaInjector
        schema={[
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Aesthetic & Wellness Guide", url: "/iraqi-cuisine/" }]),
          webPageSchema({
            url: "/iraqi-cuisine/",
            name: "Aesthetic and Wellness Guide",
            description: "Velvet Couture Medspa guide to treatments and wellness services.",
            primaryImage: "/Images/hero.webp",
          }),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad">
          <div className="eyebrow">Guide</div>
          <h1 className="mb-6">Aesthetic and wellness treatment guide.</h1>
          <p className="max-w-3xl text-lg text-[var(--color-text-muted)]">
            Learn how Velvet Couture Medspa approaches natural-looking injectable care, skin health, regenerative aesthetics, and wellness planning.
          </p>
        </div>
      </section>
      <section className="container-pad pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map(([title, body, href]) => (
            <Link key={title} href={href} className="card block p-6">
              <h2 className="mb-3 text-2xl">{title}</h2>
              <p className="text-[var(--color-text-muted)]">{body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
