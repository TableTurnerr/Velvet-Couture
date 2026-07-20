"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Star, X } from "lucide-react";
import { RESTAURANT } from "@/data/restaurant";
import QRHover from "@/components/shared/QRHover";
import Turnstile from "@/components/shared/Turnstile";

const LOW_STAR_THRESHOLD = 4;
const GOOGLE_REVIEW_URL = RESTAURANT.socials.googleBusinessProfile;
const API_URL = process.env.NEXT_PUBLIC_REVIEW_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_REVIEW_API_KEY;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s()+\-.]{7,24}$/;

type Step = "rating" | "thanks-google" | "form" | "thanks-low";

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text)] transition-colors focus:outline-none focus:border-[var(--color-text)]";
const labelCls =
  "block text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2";

export default function ReviewModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("review") === "open";

  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState("");

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const closeModal = useCallback(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("review");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  useEffect(() => {
    if (!isOpen) {
      setStep("rating");
      setRating(0);
      setHover(0);
      setName("");
      setEmail("");
      setPhone("");
      setFeedback("");
      setEmailError("");
      setPhoneError("");
      setSubmitError("");
      setSubmitting(false);
      setTurnstileToken("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (step !== "thanks-google") return;
    const t = window.setTimeout(() => {
      window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
      closeModal();
    }, 1200);
    return () => window.clearTimeout(t);
  }, [step, closeModal]);

  if (!isOpen) return null;

  const handleStarClick = (n: number) => {
    setRating(n);
    if (n >= LOW_STAR_THRESHOLD) {
      setStep("thanks-google");
    } else {
      setStep("form");
    }
  };

  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPhoneError("");

    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (phone.trim()) {
      const digits = phone.replace(/\D/g, "");
      if (!PHONE_RE.test(phone.trim()) || digits.length < 7 || digits.length > 15) {
        setPhoneError("Please enter a valid phone number.");
        valid = false;
      }
    }
    if (!name.trim()) valid = false;
    const fb = feedback.trim();
    if (fb.length < 3 || fb.length > 2000) valid = false;
    return valid;
  };

  const mailtoFallback = () => {
    const subject = `Feedback from ${name || "a guest"} — ${rating} star${rating === 1 ? "" : "s"}`;
    const body = `Rating: ${rating}/5
Name: ${name}
Email: ${email}
Phone: ${phone}

Feedback:
${feedback}`;
    return `mailto:${RESTAURANT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateForm()) return;
    if (!API_URL || !API_KEY) {
      setSubmitError("Something went wrong, please try again.");
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setSubmitError("Please complete the security check before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/ingest/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify({
          rating,
          feedback: feedback.trim(),
          name: name.trim(),
          ...(email.trim() ? { email: email.trim() } : {}),
          ...(phone.trim() ? { phone: phone.trim() } : {}),
          ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
        }),
      });
      if (res.ok) {
        setStep("thanks-low");
      } else {
        let msg = "Something went wrong, please try again.";
        try {
          const data = (await res.json()) as { error?: string };
          if (data?.error) msg = data.error;
        } catch {}
        setSubmitError(msg);
      }
    } catch {
      setSubmitError("Something went wrong, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = feedback.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div
        className="bg-white rounded-[var(--radius-section)] shadow-[var(--shadow-lift)] w-full max-w-md p-7 md:p-10 relative animate-fade-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1 rounded-full"
          aria-label="Close review dialog"
        >
          <X size={18} />
        </button>

        {step === "rating" && (
          <>
            <h3 id="review-modal-title" className="!text-2xl md:!text-3xl mb-2">
              How was your visit?
            </h3>
            <p className="text-[var(--color-text-muted)] mb-7">Tap a star to share.</p>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = (hover || rating) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleStarClick(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onFocus={() => setHover(n)}
                    onBlur={() => setHover(0)}
                    className="p-1 rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                    aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  >
                    <Star
                      size={40}
                      className={
                        filled
                          ? "fill-[var(--color-gold)] text-[var(--color-gold)]"
                          : "text-[var(--color-border)]"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === "thanks-google" && (
          <div className="text-center py-4">
            <h3 id="review-modal-title" className="!text-2xl mb-3">
              Thanks!
            </h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Sharing on Google helps us most. Opening Google now…
            </p>
            <div className="flex justify-center gap-1 mt-6">
              {Array.from({ length: rating }).map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className="fill-[var(--color-gold)] text-[var(--color-gold)]"
                />
              ))}
            </div>
          </div>
        )}

        {step === "form" && (
          <>
            <h3 id="review-modal-title" className="!text-2xl mb-2">
              Tell us what went wrong.
            </h3>
            <p className="text-[var(--color-text-muted)] mb-6">
              We read every note and respond personally.
            </p>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="block">
                <span className={labelCls}>Your Name *</span>
                <input
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                />
              </label>

              <label className="block">
                <span className={labelCls}>Email</span>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  className={inputCls}
                />
                {emailError && (
                  <span className="mt-1 block text-xs text-[var(--color-primary)]">
                    {emailError}
                  </span>
                )}
              </label>

              <label className="block">
                <span className={labelCls}>Phone</span>
                <input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError("");
                  }}
                  className={inputCls}
                />
                {phoneError && (
                  <span className="mt-1 block text-xs text-[var(--color-primary)]">
                    {phoneError}
                  </span>
                )}
              </label>

              <label className="block">
                <span className={labelCls}>Your Feedback *</span>
                <textarea
                  name="feedback"
                  required
                  rows={5}
                  minLength={3}
                  maxLength={2000}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className={inputCls}
                />
                <span className="mt-1 block text-xs text-[var(--color-text-muted)] text-right">
                  {charCount}/2000
                </span>
              </label>

              {TURNSTILE_SITE_KEY && (
                <Turnstile
                  siteKey={TURNSTILE_SITE_KEY}
                  onVerify={setTurnstileToken}
                  onExpire={() => setTurnstileToken("")}
                  onError={() => setTurnstileToken("")}
                  theme="light"
                  appearance="interaction-only"
                />
              )}

              {submitError && (
                <div className="text-sm text-[var(--color-primary)] bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl px-4 py-3">
                  {submitError}
                  <br />
                  <a
                    href={mailtoFallback()}
                    className="underline mt-1 inline-block"
                  >
                    Email us directly instead
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
                className="btn-primary justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending…" : "Send feedback"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("rating");
                  setSubmitError("");
                }}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-center"
              >
                ← Change rating
              </button>
            </form>
          </>
        )}

        {step === "thanks-low" && (
          <div className="text-center py-4">
            <h3 id="review-modal-title" className="!text-2xl mb-3">
              Thank you.
            </h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-7">
              We&apos;ve received your note.{" "}
              <QRHover value={`mailto:${RESTAURANT.email}`}>
                <a
                  href={`mailto:${RESTAURANT.email}`}
                  className="text-[var(--color-primary)] underline"
                >
                  {RESTAURANT.email}
                </a>
              </QRHover>{" "}
              will be in touch within one business day.
            </p>
            <button
              type="button"
              onClick={closeModal}
              className="btn-primary justify-center"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
