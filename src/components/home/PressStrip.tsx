import { RESTAURANT } from "@/data/restaurant";

export default function PressStrip() {
  const { text, source } = RESTAURANT.pressQuote;

  return (
    <section className="bg-[var(--color-sand)] border-y border-[var(--color-border)] mb-5 md:mb-7">
      <div className="container-pad py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-center md:text-left">
          <span
            className="text-[var(--color-gold)] text-4xl md:text-5xl leading-none italic shrink-0"
            style={{ fontFamily: "var(--font-accent)", fontWeight: 500 }}
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <blockquote
            className="text-lg md:text-xl text-[var(--color-text)] italic max-w-3xl leading-snug"
            style={{ fontFamily: "var(--font-accent)", fontWeight: 400 }}
          >
            {text}
          </blockquote>
          <cite className="text-[11px] not-italic font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)] shrink-0">
            — {source}
          </cite>
        </div>
      </div>
    </section>
  );
}
