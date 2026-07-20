import type { Metadata } from "next";
import SmartImage from "@/components/shared/SmartImage";
import ThemeBtn from "@/components/shared/ThemeBtn";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { createMetadata } from "@/data/metadata";
import { RESTAURANT } from "@/data/restaurant";
import { breadcrumbSchema, cateringServiceSchema, webPageSchema } from "@/data/schema";

export const metadata: Metadata = createMetadata({
  title: "Events & Training",
  description:
    "Group skincare events, medspa education, and provider training opportunities with Velvet Couture Medspa.",
  path: "/catering/",
});

export default function EventsTrainingPage() {
  return (
    <>
      <SchemaInjector
        schema={[
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Events & Training", url: "/catering/" }]),
          cateringServiceSchema(),
          webPageSchema({
            url: "/catering/",
            name: "Events and Training",
            description: "Group events and training opportunities at Velvet Couture Medspa.",
            primaryImage: "/Images/dish-3.webp",
          }),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad grid gap-10 lg:grid-cols-2 lg:items-center">
          <SmartImage src="/Images/dish-3.webp" alt="Velvet Couture Medspa education and treatment event" className="aspect-[4/5] rounded-[28px]" />
          <div>
            <div className="eyebrow">Events & Training</div>
            <h1 className="mb-6">Private skin events and provider training opportunities.</h1>
            <p className="mb-5 text-lg text-[var(--color-text-muted)]">
              Velvet Couture Medspa offers group skincare experiences, education-focused events, and training inquiries for providers interested in refined aesthetic technique and patient-centered care.
            </p>
            <p className="mb-7 text-[var(--color-text-muted)]">
              Tell us about your goals, group size, or training interest and the team will guide you to the next step.
            </p>
            <ThemeBtn href={RESTAURANT.orderOnline} external variant="primary">Start Inquiry</ThemeBtn>
          </div>
        </div>
      </section>
    </>
  );
}
