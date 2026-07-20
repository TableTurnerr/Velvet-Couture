import SmartImage from "../shared/SmartImage";
import ThemeBtn from "../shared/ThemeBtn";
import QRHover from "../shared/QRHover";
import { RESTAURANT } from "@/data/restaurant";

export default function BakerySpotlight() {
  return (
    <section className="section-pad bg-white">
      <div className="container-pad grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <SmartImage
          src="/Images/bakery.webp"
          alt="HydraFacial treatment technology used for skin health services"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-[4/3] rounded-[24px] shadow-[var(--shadow-lift)]"
        />
        <div>
          <div className="eyebrow">Velvet Skin Launch Special</div>
          <h2 className="mb-5">Glow season starts now.</h2>
          <p className="mb-6 text-[var(--color-text-muted)]">
            Enjoy $50 off your first facial, HydraFacial, dermaplaning facial, or chemical peel with Brooke.
            Use code <strong>GLOW50</strong> when booking. Valid for new skin clients only.
          </p>
          <div className="flex flex-wrap gap-3">
            <QRHover value={RESTAURANT.orderOnline}>
              <ThemeBtn href={RESTAURANT.orderOnline} external variant="primary">Book Skin Service</ThemeBtn>
            </QRHover>
            <ThemeBtn href="/bakery/" variant="secondary">Explore Skin Care</ThemeBtn>
          </div>
        </div>
      </div>
    </section>
  );
}
