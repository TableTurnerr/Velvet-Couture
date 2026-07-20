import { Instagram } from "lucide-react";
import ThemeBtn from "../shared/ThemeBtn";
import QRHover from "../shared/QRHover";
import { RESTAURANT } from "@/data/restaurant";

export default function InstagramSection() {
  return (
    <section className="section-pad bg-white">
      <div className="container-pad grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="eyebrow">Follow Our Results</div>
          <h2 className="mb-4">Transformations, skincare journeys, and behind-the-scenes treatments.</h2>
          <p className="max-w-2xl text-[var(--color-text-muted)]">
            See real patient transformations, HydraFacial results, facial balancing, skin care education, and boutique treatment moments from Velvet Couture Medspa.
          </p>
        </div>
        <QRHover value={RESTAURANT.socials.instagram}>
          <ThemeBtn href={RESTAURANT.socials.instagram} external variant="primary">
            <Instagram size={16} aria-hidden="true" />
            Follow Velvet
          </ThemeBtn>
        </QRHover>
      </div>
    </section>
  );
}
