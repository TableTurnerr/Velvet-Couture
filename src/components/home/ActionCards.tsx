import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import ThemeBtn from "../shared/ThemeBtn";
import QRHover from "../shared/QRHover";
import { RESTAURANT } from "@/data/restaurant";

const cards = [
  {
    icon: CalendarDays,
    title: "Book Online",
    body: "Reserve a consultation, skin service, injectable visit, or wellness appointment through Jane.",
    cta: "Book Now",
    href: RESTAURANT.orderOnline,
    external: true,
  },
  {
    icon: Sparkles,
    title: "Not Sure Where To Start?",
    body: "Begin with an initial aesthetic and wellness consultation for a personalized treatment plan.",
    cta: "View Services",
    href: "/menu/",
  },
  {
    icon: MapPin,
    title: "Houston Heights",
    body: RESTAURANT.address.full,
    cta: "Location",
    href: "/near/houston-heights-tx/",
  },
];

export default function ActionCards() {
  return (
    <section className="container-pad -mt-10 relative z-10">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, body, cta, href, external }) => (
          <div key={title} className="card p-6 bg-white">
            <Icon size={24} className="mb-4 text-[var(--color-primary)]" aria-hidden="true" />
            <h3 className="mb-2">{title}</h3>
            <p className="mb-5 text-sm text-[var(--color-text-muted)]">{body}</p>
            <QRHover value={href} block>
              <ThemeBtn href={href} external={external} variant="secondary" className="w-full justify-center">
                {cta}
              </ThemeBtn>
            </QRHover>
          </div>
        ))}
      </div>
    </section>
  );
}
