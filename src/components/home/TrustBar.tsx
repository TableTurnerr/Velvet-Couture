import { HeartPulse, ShieldCheck, Sparkles, Syringe } from "lucide-react";

const ITEMS = [
  { icon: Syringe, label: "Injectables", sub: "Natural-looking plans" },
  { icon: Sparkles, label: "Skin Health", sub: "HydraFacial & peels" },
  { icon: HeartPulse, label: "Wellness", sub: "Weight, NAD+ & peptides" },
  { icon: ShieldCheck, label: "Clinical Care", sub: "Ultrasound-supported precision" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-[var(--color-border)] bg-white">
      <div className="container-pad grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-primary)]">
              <Icon size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[var(--color-text)]">{label}</span>
              <span className="block text-xs text-[var(--color-text-muted)]">{sub}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
