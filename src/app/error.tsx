"use client";

import { useEffect } from "react";
import { Phone, RefreshCw } from "lucide-react";
import ThemeBtn from "@/components/shared/ThemeBtn";
import QRHover from "@/components/shared/QRHover";
import { RESTAURANT } from "@/data/restaurant";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative overflow-hidden bg-[var(--color-sand)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,26,26,0.30), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(201,168,76,0.35), transparent 70%)",
        }}
      />

      <div className="container-pad relative section-pad text-center">
        <div className="eyebrow">A Small Kitchen Mishap</div>

        <h1
          className="mx-auto max-w-3xl animate-fade-up"
          style={{ letterSpacing: "-0.04em" }}
        >
          Something{" "}
          <em
            className="text-[var(--color-primary)]"
            style={{
              fontFamily: "var(--font-accent)",
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            burned
          </em>{" "}
          in the oven.
        </h1>

        <div
          className="mx-auto my-7 flex items-center justify-center gap-3 text-[var(--color-gold-dark)]"
          aria-hidden="true"
        >
          <span className="h-px w-12 bg-[var(--color-gold-dark)] opacity-60" />
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-accent)", fontStyle: "italic" }}
          >
            ◆
          </span>
          <span className="h-px w-12 bg-[var(--color-gold-dark)] opacity-60" />
        </div>

        <p className="mx-auto max-w-xl text-lg text-[var(--color-text-muted)] leading-relaxed">
          We ran into an unexpected error loading this page. Give it another
          try — or head back to the home page and we&apos;ll get you sorted.
        </p>

        {error?.digest && (
          <p className="mx-auto mt-4 max-w-md text-xs text-[var(--color-text-muted)] opacity-70">
            Reference:{" "}
            <span className="font-mono">{error.digest}</span>
          </p>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary" aria-label="Try again">
            <RefreshCw size={16} aria-hidden="true" />
            <span>Try Again</span>
          </button>
          <ThemeBtn href="/" variant="secondary">
            Back to Home
          </ThemeBtn>
        </div>

        <QRHover value={`tel:${RESTAURANT.phoneRaw}`} className="mt-8">
          <a
            href={`tel:${RESTAURANT.phoneRaw}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Phone size={14} aria-hidden="true" />
            <span>
              Or call us at{" "}
              <span className="font-semibold">{RESTAURANT.phone}</span>
            </span>
          </a>
        </QRHover>
      </div>
    </section>
  );
}
