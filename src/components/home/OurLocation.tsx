import { MapPin, Phone, Clock } from "lucide-react";
import ThemeBtn from "../shared/ThemeBtn";
import QRHover from "../shared/QRHover";
import { RESTAURANT } from "@/data/restaurant";

const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(RESTAURANT.address.full)}`;

function formatHour(time: string) {
  const hour = Number.parseInt(time.split(":")[0], 10);
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

export default function OurLocation() {
  const weekday = RESTAURANT.hours[0];
  const friday = RESTAURANT.hours[4];
  const saturday = RESTAURANT.hours[5];

  return (
    <section className="bg-white section-pad">
      <div className="container-pad">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow">Find Us</div>
          <h2>Visit us in Houston Heights.</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-[var(--radius-section)] overflow-hidden border border-[var(--color-border)] aspect-video lg:aspect-auto lg:min-h-[440px] bg-[var(--color-sand)]">
            <iframe title="Velvet Couture Medspa location map" src={`https://www.google.com/maps?q=${encodeURIComponent(RESTAURANT.address.full)}&output=embed`} width="100%" height="100%" style={{ border: 0, minHeight: 440 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>

          <div className="rounded-[var(--radius-section)] border border-[var(--color-border)] p-8 flex flex-col gap-6 bg-[var(--color-warm-white)]">
            <div className="flex items-start gap-3"><MapPin size={18} strokeWidth={1.75} className="text-[var(--color-primary)] shrink-0 mt-1" /><div><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5">Address</div><QRHover value={DIRECTIONS}><span className="text-[var(--color-text)] leading-relaxed">{RESTAURANT.address.full}</span></QRHover></div></div>
            <div className="flex items-start gap-3"><Phone size={18} strokeWidth={1.75} className="text-[var(--color-primary)] shrink-0 mt-1" /><div><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5">Call or text</div><QRHover value={`tel:${RESTAURANT.phoneRaw}`}><a href={`tel:${RESTAURANT.phoneRaw}`} className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">{RESTAURANT.phone}</a></QRHover></div></div>
            <div className="flex items-start gap-3"><Clock size={18} strokeWidth={1.75} className="text-[var(--color-primary)] shrink-0 mt-1" /><div><div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)] mb-1.5">Hours</div><div className="text-[var(--color-text)] space-y-1 text-sm"><div>Mon–Thu · {formatHour(weekday.open)} – {formatHour(weekday.close)}</div><div>Friday · {formatHour(friday.open)} – {formatHour(friday.close)}</div><div>Saturday · {formatHour(saturday.open)} – {formatHour(saturday.close)}</div><div>Sunday · Closed</div></div></div></div>
            <div className="mt-auto pt-2"><QRHover value={DIRECTIONS} block><ThemeBtn href={DIRECTIONS} external variant="primary" className="w-full justify-center">Get Directions</ThemeBtn></QRHover></div>
          </div>
        </div>
      </div>
    </section>
  );
}
