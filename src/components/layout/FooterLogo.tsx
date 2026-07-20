"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  version: string;
};

const REQUIRED_CLICKS = 7;
const RESET_MS = 2000;

export default function FooterLogo({ version }: Props) {
  const [clicks, setClicks] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    if (!devMode) return;
    const tick = () => setNow(new Date().toISOString());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [devMode]);

  useEffect(() => {
    if (clicks === 0 || devMode) return;
    const id = window.setTimeout(() => setClicks(0), RESET_MS);
    return () => window.clearTimeout(id);
  }, [clicks, devMode]);

  const handleClick = () => {
    if (devMode) return;
    const next = clicks + 1;
    if (next >= REQUIRED_CLICKS) {
      setDevMode(true);
      setClicks(0);
    } else {
      setClicks(next);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Velvet Couture Medspa logo"
        className="p-0 m-0 bg-transparent border-0 cursor-pointer focus:outline-none"
      >
        <Image
          src="/Images/logo.webp"
          alt="Velvet Couture Medspa logo"
          width={200}
          height={200}
          draggable={false}
          className="object-cover w-auto h-[160px] md:h-[200px] aspect-square rounded-full ring-1 ring-white/10 select-none"
        />
      </button>

      {devMode && (
        <div
          className="fixed bottom-3 right-3 z-[9999] font-mono text-[11px] leading-tight rounded-md px-3 py-2 shadow-lg"
          style={{
            background: "rgba(0,0,0,0.85)",
            color: "#9CFF9C",
            border: "1px solid #2a2a2a",
            maxWidth: "260px",
          }}
        >
          <div style={{ color: "#C9A84C", fontWeight: 700 }}>DEV MODE</div>
          <div>version: v{version}</div>
          <div>env: {process.env.NODE_ENV}</div>
          <div>path: {typeof window !== "undefined" ? window.location.pathname : ""}</div>
          <div>viewport: {typeof window !== "undefined" ? `${window.innerWidth}×${window.innerHeight}` : ""}</div>
          <div>ua: {typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 40) + "…" : ""}</div>
          <div>now: {now}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 4 }}>refresh to exit</div>
        </div>
      )}
    </>
  );
}
