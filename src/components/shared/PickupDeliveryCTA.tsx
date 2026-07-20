import ThemeBtn from "./ThemeBtn";
import QRHover from "./QRHover";
import { RESTAURANT } from "@/data/restaurant";

export default function PickupDeliveryCTA() {
  return (
    <section className="section-pad bg-[var(--color-sand)]">
      <div className="container-pad text-center">
        <div className="eyebrow">Book Online</div>
        <h2 className="mx-auto mb-5 max-w-3xl">Ready for a personalized aesthetic and wellness plan?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-[var(--color-text-muted)]">
          Schedule a consultation through Jane and the Velvet Couture Medspa team will help guide your next step.
        </p>
        <QRHover value={RESTAURANT.orderOnline}>
          <ThemeBtn href={RESTAURANT.orderOnline} external variant="primary">Book Consultation</ThemeBtn>
        </QRHover>
      </div>
    </section>
  );
}
