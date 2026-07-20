"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SmartImage from "../shared/SmartImage";

type GalleryImage = { src: string; alt: string; caption: string; fit?: "cover" | "contain" };

const IMAGES: GalleryImage[] = [
  { src: "/Images/gallery/skin-texture-glow.webp", alt: "Glowing skin treatment result", caption: "Skin texture and glow" },
  { src: "/Images/gallery/natural-refinement.webp", alt: "Natural-looking aesthetic result", caption: "Natural-looking refinement" },
  { src: "/Images/gallery/wrinkle-relaxer-results.webp", alt: "Wrinkle relaxer treatment result", caption: "Wrinkle relaxer results" },
  { src: "/Images/gallery/facial-balancing.webp", alt: "Facial balancing treatment result", caption: "Facial balancing" },
  { src: "/Images/gallery/education-events.webp", alt: "Velvet Couture Medspa education event", caption: "Education and events", fit: "contain" },
  { src: "/Images/gallery/community-moments.webp", alt: "Velvet Couture Medspa community moment", caption: "Community moments", fit: "contain" },
];

// The four treatment results are square source images. Giving each a square
// desktop tile preserves the full face rather than forcing it into a wide crop.
const SPANS = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const close = useCallback(() => setLightboxIdx(null), []);
  const next = useCallback(() => setLightboxIdx((index) => index === null ? null : (index + 1) % IMAGES.length), []);
  const prev = useCallback(() => setLightboxIdx((index) => index === null ? null : (index - 1 + IMAGES.length) % IMAGES.length), []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxIdx, close, next, prev]);

  return (
    <section className="section-pad">
      <div className="container-pad">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="eyebrow">Results &amp; Transformations</div>
          <h2 className="mb-4">Refined results, thoughtfully tailored.</h2>
          <p className="text-[var(--color-text-muted)]">Explore real skincare journeys, facial balancing, and the Velvet Couture Medspa experience.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 lg:auto-rows-[280px]">
          {IMAGES.map((image, index) => (
            <button key={image.src} type="button" onClick={() => setLightboxIdx(index)} aria-label={`Open photo: ${image.caption}`} className={`relative block rounded-2xl overflow-hidden cursor-pointer group bg-white border border-[var(--color-border)] aspect-square lg:aspect-auto lg:h-full ${SPANS[index]}`}>
              <SmartImage src={image.src} alt={image.alt} sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" className={`w-full h-full ${image.fit === "contain" ? "bg-[var(--color-sand)]" : ""}`} imgClassName={`gallery-img ${image.fit === "contain" ? "object-contain" : ""}`} fetchPriority="low" />
              <div aria-hidden="true" className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-100" style={{ background: "linear-gradient(180deg, rgba(26,20,16,0) 40%, rgba(26,20,16,0.55) 75%, rgba(26,20,16,0.85) 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 transition-all duration-500 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"><p className="text-[0.95rem] leading-snug font-medium text-left text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}>{image.caption}</p></div>
            </button>
          ))}
        </div>
      </div>

      {lightboxIdx !== null && (
        <div role="dialog" aria-modal="true" aria-label="Results gallery viewer" onClick={close} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <button type="button" onClick={(event) => { event.stopPropagation(); close(); }} aria-label="Close gallery" className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"><X size={20} strokeWidth={2} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); prev(); }} aria-label="Previous photo" className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"><ChevronLeft size={22} strokeWidth={2} /></button>
          <button type="button" onClick={(event) => { event.stopPropagation(); next(); }} aria-label="Next photo" className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"><ChevronRight size={22} strokeWidth={2} /></button>
          <div onClick={(event) => event.stopPropagation()} className="relative w-full max-w-5xl flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES[lightboxIdx].src} alt={IMAGES[lightboxIdx].alt} className="w-auto max-w-full max-h-[78vh] object-contain rounded-lg gallery-img" />
            <div className="text-center mt-4 text-sm px-6 text-white/90">{IMAGES[lightboxIdx].caption}<span className="block text-xs mt-1 text-white/55">{lightboxIdx + 1} / {IMAGES.length}</span></div>
          </div>
        </div>
      )}
    </section>
  );
}
