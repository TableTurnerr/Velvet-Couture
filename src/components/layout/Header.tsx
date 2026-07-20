"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import ThemeBtn from "../shared/ThemeBtn";
import QRHover from "../shared/QRHover";
import { RESTAURANT } from "@/data/restaurant";

const NAV_LINKS = [
  { href: "/menu/", label: "Services" },
  { href: "/specialties/", label: "Treatments" },
  { href: "/our-story/", label: "About" },
  { href: "/iraqi-cuisine/", label: "Wellness Guide" },
  { href: "/bakery/", label: "Skin Care" },
  { href: "/catering/", label: "Events & Training" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/85 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-b border-[var(--color-border)] shadow-[0_1px_0_rgba(26,20,16,0.04)]" : "border-b border-transparent"
      }`}
    >
      <div className="container-pad flex items-center justify-between h-[72px]">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Velvet Couture Medspa home">
          <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-[var(--color-border)] transition-transform duration-300 group-hover:scale-105 shrink-0">
            <Image
              src="/Images/logo.webp"
              alt="Velvet Couture Medspa logo"
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-[1.05rem] tracking-tight">
              Velvet Couture
            </div>
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.15em]">
              Aesthetics & Wellness
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-9" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-[0.9rem] font-medium text-[var(--color-text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <QRHover value={`tel:${RESTAURANT.phoneRaw}`}>
            <a
              href={`tel:${RESTAURANT.phoneRaw}`}
              className="flex items-center gap-2 text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
            >
              <Phone size={15} strokeWidth={1.75} aria-hidden="true" />
              {RESTAURANT.phone}
            </a>
          </QRHover>
          <QRHover value={RESTAURANT.orderOnline}>
            <ThemeBtn href={RESTAURANT.orderOnline} external variant="primary">
              Book Online
            </ThemeBtn>
          </QRHover>
        </div>

        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-out ${
          open ? "max-h-[500px] border-t border-[var(--color-border)]" : "max-h-0"
        }`}
      >
        <nav className="container-pad py-5 flex flex-col gap-1" aria-label="Mobile">
          <Link
            href="/"
            className="py-3 text-base font-medium border-b border-[var(--color-border)]"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 text-base font-medium border-b border-[var(--color-border)] last:border-0"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <QRHover value={`tel:${RESTAURANT.phoneRaw}`} block>
            <a
              href={`tel:${RESTAURANT.phoneRaw}`}
              className="py-3 flex items-center gap-2 text-base font-medium border-b border-[var(--color-border)]"
            >
              <Phone size={16} /> {RESTAURANT.phone}
            </a>
          </QRHover>
          <ThemeBtn href={RESTAURANT.orderOnline} external variant="primary" className="mt-4 justify-center">
            Book Online
          </ThemeBtn>
        </nav>
      </div>
    </header>
  );
}
