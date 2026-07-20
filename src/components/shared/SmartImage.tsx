"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_FALLBACK = "/Images/hero.webp";

type SmartImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
  style?: React.CSSProperties;
  /** Inline styling for the image itself, such as a per-image focal point. */
  imgStyle?: React.CSSProperties;
  sizes?: string;
  imgClassName?: string;
  /** Image to swap in when the primary src fails to load. */
  fallbackSrc?: string;
};

export default function SmartImage({
  src,
  alt,
  priority = false,
  fetchPriority,
  className = "",
  style,
  imgStyle,
  sizes = "100vw",
  imgClassName = "",
  fallbackSrc = DEFAULT_FALLBACK,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [currentSrc]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      role="img"
      aria-label={alt}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 skeleton-shimmer transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
        sizes={sizes}
        style={imgStyle}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          } else {
            setLoaded(true);
          }
        }}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
    </div>
  );
}
