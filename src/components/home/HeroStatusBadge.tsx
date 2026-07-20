import { CalendarDays } from "lucide-react";

export default function HeroStatusBadge() {
  return (
    <div className="absolute -bottom-5 left-6 right-6 rounded-2xl bg-white p-4 shadow-[var(--shadow-lift)] md:left-8 md:right-auto md:w-72">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-primary)]">
          <CalendarDays size={18} aria-hidden="true" />
        </span>
        <div>
          <div className="text-sm font-semibold text-[var(--color-text)]">By appointment only</div>
          <div className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)]">
            New skin clients can use code GLOW50 for eligible first facial services.
          </div>
        </div>
      </div>
    </div>
  );
}
