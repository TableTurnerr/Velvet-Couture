import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { createMetadata } from "@/data/metadata";

export const metadata: Metadata = createMetadata({
  title: "Page Not Found",
  description: "Return to Velvet Couture Medspa or book a consultation.",
  path: "/404/",
  noindex: true,
});

export default function NotFound() {
  return (
    <section className="section-pad bg-white">
      <div className="container-pad max-w-3xl text-center">
        <div className="eyebrow">404</div>
        <h1 className="mb-6">Page not found.</h1>
        <p className="mb-8 text-lg text-[var(--color-text-muted)]">
          This page is not available. Return home or book a consultation with Velvet Couture Medspa.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Back Home <ArrowRight size={16} /></Link>
          <a href="https://velvetcouturemedspa.janeapp.com/" className="btn-secondary">Book Online</a>
        </div>
      </div>
    </section>
  );
}
