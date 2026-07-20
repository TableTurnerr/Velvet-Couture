import Link from "next/link";

export default function AboutIntro() {
  return (
    <section className="section-pad bg-[var(--color-warm-white)]">
      <div className="container-pad grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <div className="eyebrow">A Little About Us</div>
          <h2 className="mb-5">Where beauty, health, and longevity align.</h2>
        </div>
        <div className="space-y-5 text-[var(--color-text-muted)]">
          <p>
            Velvet Couture Medspa is an aesthetics and wellness clinical boutique located in Houston Heights,
            offering a refined blend of luxury beauty and medical-grade care.
          </p>
          <p>
            We specialize in advanced injectables, regenerative aesthetics, peptides, IV hydration, HydraFacial,
            chemical peels, bioidentical hormone replacement therapy, medical-grade skincare, and customized weight
            management programs.
          </p>
          <p>
            Our approach goes beyond surface-level treatments, combining{" "}
            <Link href="/specialties/filler/" className="link-underline text-[var(--color-text)]">facial balancing</Link>,{" "}
            <Link href="/specialties/microneedling/" className="link-underline text-[var(--color-text)]">regenerative skin care</Link>, and{" "}
            <Link href="/specialties/weight-management/" className="link-underline text-[var(--color-text)]">wellness planning</Link>{" "}
            to support confidence, vitality, and natural long-term results.
          </p>
        </div>
      </div>
    </section>
  );
}
