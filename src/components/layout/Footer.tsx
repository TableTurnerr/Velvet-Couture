import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import QRHover from "../shared/QRHover";
import FooterLogo from "./FooterLogo";
import { RESTAURANT } from "@/data/restaurant";
import pkg from "../../../package.json";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu/", label: "Services" },
  { href: "/specialties/", label: "Treatments" },
  { href: "/our-story/", label: "Our Story" },
  { href: "/bakery/", label: "Skin Care" },
  { href: "/catering/", label: "Events & Training" },
  { href: "/near/", label: "Service Areas" },
  { href: "/?review=open", label: "Leave a Review" },
  { href: "/return-policy/", label: "Booking Policy" },
];

export default function Footer() {
  return (
    <footer className="w-full px-[10px] md:px-[50px] lg:px-[70px] pt-12 md:pt-16 pb-[20px] sm:pb-[10px] mt-12" style={{ background: "var(--color-text)", color: "rgba(255,255,255,0.78)" }}>
      <div className="text-4xl sm:text-5xl md:text-6xl w-full text-white leading-none text-center" style={{ letterSpacing: "-0.04em", fontWeight: 700 }}>Velvet Couture Medspa</div>
      <div className="mt-3 mb-10 max-w-4xl mx-auto text-sm md:text-base leading-relaxed text-center text-white/60">{RESTAURANT.footerDescription}</div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 min-h-[100px] lg:grid-cols-3 gap-[10px] lg:gap-8">
          <div className="col-span-2 lg:col-span-1 mx-auto flex flex-row items-center lg:items-start gap-4">
            <FooterLogo version={pkg.version} />
            <div className="flex h-[120px] justify-evenly gap-[10px] flex-col my-auto max-w-100">
              <a href={RESTAURANT.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Velvet Couture Medspa on Instagram" className="min-w-[100px] p-2 py-4 h-full w-full items-center justify-center flex rounded-lg group transition-colors duration-300 bg-white/5 hover:bg-[var(--color-primary)]/85"><Instagram size={22} className="text-white/80 group-hover:text-white" /></a>
              <a href={RESTAURANT.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Velvet Couture Medspa on Facebook" className="p-2 py-4 h-full w-full items-center justify-center flex rounded-lg group transition-colors duration-300 bg-white/5 hover:bg-[var(--color-primary)]/85"><Facebook size={22} className="text-white/80 group-hover:text-white" /></a>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 flex flex-row justify-evenly w-full mb-8 lg:mb-0">
            <div className="col-span-1 text-center h-full lg:mr-10 mr-0"><div className="flex h-full flex-col items-center justify-center"><div className="text-base font-semibold mb-[22px] text-white tracking-tight">Contact Us</div><div className="text-sm text-white/60"><div className="flex flex-col items-center gap-[10px]"><QRHover value={`tel:${RESTAURANT.phoneRaw}`}><a href={`tel:${RESTAURANT.phoneRaw}`} className="hover:text-[var(--color-gold)] hover:underline transition-colors">{RESTAURANT.phone}</a></QRHover><QRHover value={`mailto:${RESTAURANT.email}`}><a href={`mailto:${RESTAURANT.email}`} className="hover:text-[var(--color-gold)] hover:underline transition-colors">{RESTAURANT.email}</a></QRHover><span className="max-w-[220px] leading-snug">{RESTAURANT.address.full}</span></div></div></div></div>
            <div className="col-span-1 text-center h-full"><div className="flex h-full flex-col items-center justify-center"><div className="text-base text-white font-semibold mb-[22px] tracking-tight">Quick Links</div><div className="text-sm text-white/60"><div className="text-center grid grid-cols-2 gap-x-6 gap-y-[10px]">{QUICK_LINKS.map((link) => <Link key={link.href} href={link.href} scroll={link.href === "/?review=open" ? false : undefined} className="hover:text-[var(--color-gold)] transition-colors"><span className="hover:underline">{link.label}</span></Link>)}</div></div></div></div>
          </div>
        </div>
      </div>

      <div className="h-[60px]" />
      <div className="rounded-full text-white w-[90%] mx-auto min-h-[37px] py-[10px] sm:px-[50px] md:px-[100px]" style={{ background: "var(--color-primary-dark)" }}><div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-center text-xs gap-[20px] text-white/90"><p className="hidden sm:block text-white/90">Velvet Couture Medspa © {new Date().getFullYear()}. All Rights Reserved.</p><p className="text-nowrap text-white/90">Made with <a target="_blank" href="http://tableturnerr.com" rel="noopener noreferrer" className="hover:underline"><u>TableTurnerr.com</u></a></p></div></div>
      <div className="block sm:hidden w-full text-center text-[10px] mt-2 text-white/90">Velvet Couture Medspa © {new Date().getFullYear()}. All Rights Reserved.</div>
    </footer>
  );
}
