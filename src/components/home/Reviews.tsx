import { Star } from "lucide-react";
import ThemeBtn from "../shared/ThemeBtn";
import QRHover from "../shared/QRHover";
import { REVIEWS } from "@/data/reviews";
import { RESTAURANT } from "@/data/restaurant";

export default function Reviews() {
  return (
    <section className="bg-[var(--color-warm-white)] section-pad">
      <div className="container-pad">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow">Customer Reviews</div>
          <h2 className="mb-4">Loved by {RESTAURANT.reviewCount.toLocaleString()}+ guests.</h2>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className="fill-[var(--color-gold)] text-[var(--color-gold)]"
                />
              ))}
            </div>
            <span className="font-semibold">{RESTAURANT.ratingValue}</span>
            <span className="text-[var(--color-text-muted)]">on Google</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {[...REVIEWS].sort((a, b) => b.text.length - a.text.length).map((r, i) => (
            <article
              key={r.author}
              className={`flex flex-col w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] rounded-2xl border border-[var(--color-border)] bg-white p-7 transition-all duration-500 hover:border-transparent hover:shadow-[var(--shadow-lift)] hover:-translate-y-1${i >= 3 ? " hidden md:flex" : ""}`}
            >
              <div className="flex mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className="fill-[var(--color-gold)] text-[var(--color-gold)]"
                  />
                ))}
              </div>
              <blockquote className="flex-1 text-[var(--color-text)] mb-5 leading-relaxed text-[0.97rem]">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <cite className="not-italic font-semibold text-sm">{r.author}</cite>
                <span className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">{r.source}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 mt-12">
          <QRHover value={`${RESTAURANT.url}/?review=open`}>
            <ThemeBtn href="/?review=open" variant="primary" scroll={false}>
              Leave a Review
            </ThemeBtn>
          </QRHover>
          <a
            href={RESTAURANT.socials.googleBusinessProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-primary)] underline underline-offset-2 hover:opacity-75 transition-opacity"
          >
            Read all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
