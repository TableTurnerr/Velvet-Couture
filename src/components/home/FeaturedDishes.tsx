import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SmartImage from "../shared/SmartImage";
import { MENU } from "@/data/menu";

const featured = MENU.flatMap((category) =>
  category.items
    .filter((item) => item.popular)
    .map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      category: category.name,
      image: item.image,
    })),
).slice(0, 6);

export default function FeaturedDishes() {
  return (
    <section className="bg-white section-pad">
      <div className="container-pad">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Signature Services</div>
            <h2>Featured treatments.</h2>
          </div>
          <Link href="/menu/" className="link-underline text-sm font-medium text-[var(--color-text)]">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <article key={service.name} className="card">
              {service.image && (
                <div className="card-img aspect-[4/3]">
                  <SmartImage
                    src={service.image}
                    alt={`${service.name} at Velvet Couture Medspa in Houston Heights`}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                  {service.category}
                </div>
                <h3 className="mb-2 text-xl" style={{ fontFamily: "var(--font-display)" }}>
                  {service.name}
                </h3>
                <p className="mb-4 text-sm text-[var(--color-text-muted)]">{service.description}</p>
                <div className="font-semibold text-[var(--color-text)]">{service.price}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
