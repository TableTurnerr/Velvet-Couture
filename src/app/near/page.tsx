import type { Metadata } from "next";
import Link from "next/link";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import { createMetadata } from "@/data/metadata";
import { breadcrumbSchema, webPageSchema } from "@/data/schema";

export const metadata: Metadata = createMetadata({
  title: "Houston Service Areas",
  description: "Velvet Couture Medspa serves Houston Heights, Montrose, River Oaks, Memorial, and greater Houston.",
  path: "/near/",
});

export default function ServiceAreasPage() {
  return (
    <>
      <SchemaInjector
        schema={[
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Service Areas", url: "/near/" }]),
          webPageSchema({
            url: "/near/",
            name: "Houston Service Areas",
            description: "Houston neighborhoods served by Velvet Couture Medspa.",
          }),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad">
          <div className="eyebrow">Service Areas</div>
          <h1 className="mb-6">Medspa care for Houston neighborhoods.</h1>
          <p className="max-w-3xl text-lg text-[var(--color-text-muted)]">
            Velvet Couture Medspa is located in Houston Heights and welcomes clients from surrounding Houston neighborhoods.
          </p>
        </div>
      </section>
      <section className="container-pad pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {NEIGHBORHOODS.map((area) => (
            <Link key={area.slug} href={`/near/${area.slug}/`} className="card block p-6">
              <h2 className="mb-3 text-2xl">{area.city}</h2>
              <p className="text-[var(--color-text-muted)]">{area.heroSubheadline}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
