"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  value: string;
  children: ReactNode;
  className?: string;
  block?: boolean;
};

const PANEL_W = 180;
const PANEL_H = 220;
const OFFSET = 18;

export default function QRHover({ value, children, className = "", block = false }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hoverCapable, setHoverCapable] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHoverCapable(mq.matches);
    const handler = (e: MediaQueryListEvent) => setHoverCapable(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const updatePos = (clientX: number, clientY: number) => {
    if (typeof window === "undefined") return;
    let x = clientX + OFFSET;
    let y = clientY + OFFSET;
    if (x + PANEL_W > window.innerWidth - 8) x = clientX - PANEL_W - OFFSET;
    if (y + PANEL_H > window.innerHeight - 8) y = clientY - PANEL_H - OFFSET;
    if (x < 8) x = 8;
    if (y < 8) y = 8;
    setPos({ x, y });
  };

  const displayStyle = block ? "block" : "inline-flex";

  if (!hoverCapable) {
    return (
      <span className={className} style={{ display: displayStyle }}>
        {children}
      </span>
    );
  }

  const panel = visible && mounted ? (
    <div
      aria-hidden="true"
      className="pointer-events-none"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: PANEL_W,
        zIndex: 9999,
      }}
    >
      <div className="bg-white border border-[var(--color-border)] rounded-[14px] shadow-[0_18px_40px_rgba(26,20,16,0.18)] p-3 flex flex-col items-center gap-2.5">
        <div className="bg-white rounded-md p-1">
          <QRCodeSVG
            value={value}
            size={140}
            level="M"
            bgColor="#ffffff"
            fgColor="#1A1410"
          />
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)] text-center leading-tight">
          Scan to View on Phone
        </div>
      </div>
    </div>
  ) : null;

  return (
    <span
      className={className}
      style={{ display: displayStyle }}
      onMouseEnter={(e) => {
        updatePos(e.clientX, e.clientY);
        setVisible(true);
      }}
      onMouseMove={(e) => {
        if (visible) updatePos(e.clientX, e.clientY);
      }}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {mounted && panel && createPortal(panel, document.body)}
    </span>
  );
}
