"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { FAQ } from "@/data/faqs";

type Props = { faqs: FAQ[]; title?: string; eyebrow?: string };

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderAnswer(answer: string) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(answer)) !== null) {
    if (match.index > lastIndex) {
      parts.push(answer.slice(lastIndex, match.index));
    }
    const [, text, href] = match;
    const isExternal = /^https?:\/\//.test(href);
    parts.push(
      isExternal ? (
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="faq-link"
        >
          {text}
        </a>
      ) : (
        <Link key={key++} href={href} className="faq-link">
          {text}
        </Link>
      )
    );
    lastIndex = LINK_RE.lastIndex;
  }
  if (lastIndex < answer.length) parts.push(answer.slice(lastIndex));
  return parts;
}

export default function FAQSection({
  faqs,
  title = "Frequently asked questions.",
  eyebrow = "Got Questions?",
}: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[var(--color-warm-white)] section-pad">
      <div className="container-pad max-w-3xl">
        <div className="text-center mb-14">
          <div className="eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>

        <div className="border-t border-[var(--color-border)]">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className="border-b border-[var(--color-border)]"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span
                    className="font-medium text-lg md:text-xl text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-[var(--color-text)] border-[var(--color-text)] text-white rotate-45"
                        : "text-[var(--color-text)] group-hover:border-[var(--color-text)]"
                    }`}
                    aria-hidden="true"
                  >
                    <Plus size={16} strokeWidth={2} />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="text-[var(--color-text-muted)] leading-relaxed pr-12">
                      {renderAnswer(faq.answer)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
