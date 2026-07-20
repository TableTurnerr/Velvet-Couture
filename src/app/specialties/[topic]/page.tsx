import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SmartImage from "@/components/shared/SmartImage";
import ThemeBtn from "@/components/shared/ThemeBtn";
import SchemaInjector from "@/components/shared/SchemaInjector";
import { SPECIALTIES, SPECIALTY_SLUGS } from "@/data/specialties";
import { RESTAURANT } from "@/data/restaurant";
import { articleSchema, breadcrumbSchema, faqSchema, webPageSchema } from "@/data/schema";
import { createMetadata } from "@/data/metadata";

export function generateStaticParams() {
  return SPECIALTY_SLUGS.map((topic) => ({ topic }));
}

function getSpecialty(topic: string) {
  return SPECIALTIES.find((item) => item.slug === topic);
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const specialty = getSpecialty(topic);
  if (!specialty) return {};
  return createMetadata({
    title: specialty.metaTitle,
    description: specialty.metaDescription,
    path: `/specialties/${specialty.slug}/`,
    ogImage: specialty.image,
    keywords: specialty.keywords,
  });
}

export default async function TreatmentDetailPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const specialty = getSpecialty(topic);
  if (!specialty) notFound();

  return (
    <>
      <SchemaInjector
        schema={[
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Treatments", url: "/specialties/" },
            { name: specialty.name, url: `/specialties/${specialty.slug}/` },
          ]),
          webPageSchema({
            url: `/specialties/${specialty.slug}/`,
            name: specialty.metaTitle,
            description: specialty.metaDescription,
            primaryImage: specialty.image ?? "/Images/hero.webp",
          }),
          articleSchema({
            url: `/specialties/${specialty.slug}/`,
            headline: specialty.heroHeadline,
            description: specialty.metaDescription,
            image: specialty.image ?? "/Images/hero.webp",
          }),
          ...(specialty.faqs?.length ? [faqSchema(specialty.faqs)] : []),
        ]}
      />
      <section className="section-pad bg-white">
        <div className="container-pad grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow">{specialty.heroEyebrow}</div>
            <h1 className="mb-6">{specialty.heroHeadline}</h1>
            {specialty.heroSubheadline && <p className="mb-6 text-lg text-[var(--color-text-muted)]">{specialty.heroSubheadline}</p>}
            <ThemeBtn href={RESTAURANT.orderOnline} external variant="primary">Book Consultation</ThemeBtn>
          </div>
          {specialty.image && (
            <SmartImage
              src={specialty.image}
              alt={`${specialty.name} at ${RESTAURANT.name} in ${RESTAURANT.address.city}, ${RESTAURANT.address.state}`}
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[4/5] rounded-[var(--radius-section)] shadow-[0_30px_80px_-30px_rgba(26,20,16,0.35)]"
            />
          )}
        </div>
      </section>
      <section className="section-pad bg-[var(--color-warm-white)]">
        <div className="container-pad max-w-4xl">
          <h2 className="mb-5">{specialty.primaryBlock.heading}</h2>
          <p className="text-lg text-[var(--color-text-muted)]">{specialty.primaryBlock.body}</p>
        </div>
      </section>
      {specialty.faqs?.length ? (
        <section className="section-pad bg-white">
          <div className="container-pad grid gap-4 md:grid-cols-2">
            {specialty.faqs.map((faq) => (
              <article key={faq.question} className="card p-6">
                <h3 className="mb-3">{faq.question}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
