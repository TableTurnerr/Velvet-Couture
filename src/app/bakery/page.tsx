import type { Metadata } from "next";
import SmartImage from "@/components/shared/SmartImage";
import ThemeBtn from "@/components/shared/ThemeBtn";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { createMetadata } from "@/data/metadata";
import { RESTAURANT } from "@/data/restaurant";
import { breadcrumbSchema, webPageSchema } from "@/data/schema";

export const metadata: Metadata = createMetadata({
  title: "Skin Care & Facials",
  description:
    "HydraFacial, dermaplaning, chemical peels, and medical-grade skincare at Velvet Couture Medspa in Houston Heights.",
  path: "/bakery/",
});

export default function SkinCarePage() {
  return (
    <>
      <SchemaInjector
        schema={[
          breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Skin Care", url: "/bakery/" }]),
          webPageSchema({
            url: "/bakery/",
            name: "Skin Care and Facials",
            description: "HydraFacial, dermaplaning, peels, and skin care at Velvet Couture Medspa.",
            primaryImage: "/Images/bakery.webp",
          }),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow">Skin Care</div>
            <h1 className="mb-6">HydraFacial, dermaplaning, peels, and medical-grade skincare.</h1>
            <p className="mb-6 text-lg text-[var(--color-text-muted)]">
              Glow season starts now. Enjoy $50 off your first facial, HydraFacial, dermaplaning facial,
              or chemical peel with Brooke. Use code GLOW50 when booking.
            </p>
            <ThemeBtn href={RESTAURANT.orderOnline} external variant="primary">Book Skin Service</ThemeBtn>
          </div>
          <SmartImage src="/Images/bakery.webp" alt="HydraFacial skin treatment at Velvet Couture Medspa" className="aspect-[4/5] rounded-[28px]" />
        </div>
      </section>
    </>
  );
}
