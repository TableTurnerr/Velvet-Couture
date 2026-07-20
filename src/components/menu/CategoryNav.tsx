"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuCategory } from "@/data/menu";

type Props = {
  categories: Pick<MenuCategory, "id" | "name">[];
};

export default function CategoryNav({ categories }: Props) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "");
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = activeId;
        let bestRatio = -1;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0 && bestId !== activeId) {
          setActiveId(bestId);
        }
      },
      {
        rootMargin: "-140px 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories, activeId]);

  useEffect(() => {
    const link = linkRefs.current.get(activeId);
    const list = listRef.current;
    if (!link || !list) return;
    const target = link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2;
    list.scrollTo({ left: target, behavior: "smooth" });
  }, [activeId]);

  return (
    <nav className="sticky top-[72px] bg-white/85 backdrop-blur-md z-30 border-b border-[var(--color-border)]">
      <div className="container-pad">
        <ul ref={listRef} className="flex gap-2 overflow-x-auto py-3 -mx-5 px-5 scroll-snap-x">
          {categories.map((category) => {
            const isActive = activeId === category.id;
            return (
              <li key={category.id}>
                <a
                  ref={(el) => {
                    if (el) linkRefs.current.set(category.id, el);
                    else linkRefs.current.delete(category.id);
                  }}
                  href={`#${category.id}`}
                  aria-current={isActive ? "true" : undefined}
                  style={
                    isActive
                      ? { background: "var(--color-primary)", color: "#fff", borderColor: "var(--color-primary)" }
                      : undefined
                  }
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? ""
                      : "border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:!text-white hover:border-[var(--color-primary)]"
                  }`}
                >
                  {category.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
