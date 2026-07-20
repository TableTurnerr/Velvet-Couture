import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "gold";

type Props = {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  showArrow?: boolean;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
  scroll?: boolean;
};

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  gold: "btn-gold",
};

export default function ThemeBtn({
  href,
  onClick,
  variant = "primary",
  children,
  showArrow = true,
  className = "",
  external = false,
  ariaLabel,
  scroll,
}: Props) {
  const cls = `${variantClass[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && <ArrowRight size={16} aria-hidden="true" />}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cls}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} scroll={scroll} className={cls} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls} aria-label={ariaLabel}>
      {content}
    </button>
  );
}
