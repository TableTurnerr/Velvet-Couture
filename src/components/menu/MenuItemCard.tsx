import Link from "next/link";
import { Star, Leaf } from "lucide-react";
import type { MenuItem } from "@/data/menu";

type MenuItemCardProps = {
  item: MenuItem;
  categoryLabel?: string;
  href?: string;
  showTags?: boolean;
};

export default function MenuItemCard({
  item,
  categoryLabel,
  href,
  showTags = true,
}: MenuItemCardProps) {
  const content = (
    <>
      {categoryLabel && (
        <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.15em] mb-2">
          {categoryLabel}
        </div>
      )}
      <h3
        className="text-lg mb-3"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
      >
        {item.name}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-2">
        {item.description}
      </p>
      <div className="text-sm font-semibold text-[var(--color-text)] mb-4">
        {item.price}
      </div>
      {showTags && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.popular && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-dark)] uppercase tracking-wider">
              <Star size={10} className="fill-current" /> Popular
            </span>
          )}
          {item.vegetarian && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-800 uppercase tracking-wider">
              <Leaf size={10} /> Vegetarian
            </span>
          )}
          <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider px-2.5 py-1">
            Consultation-led
          </span>
        </div>
      )}
    </>
  );

  const baseClass =
    "rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-all duration-500 hover:border-transparent hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5";

  if (href) {
    return (
      <Link href={href} className={`block ${baseClass}`}>
        {content}
      </Link>
    );
  }

  return <article className={baseClass}>{content}</article>;
}
