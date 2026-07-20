"use client";

import { useState } from "react";
import { RESTAURANT } from "@/data/restaurant";
import Turnstile from "@/components/shared/Turnstile";
import QRHover from "@/components/shared/QRHover";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const EVENT_TYPES = [
  "Wedding",
  "Corporate Lunch",
  "Ramadan Iftar",
  "Eid Celebration",
  "Birthday / Family Party",
  "Baby Shower",
  "Other",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  eventType?: string;
  guests?: string;
  message?: string;
};

function buildMailto(values: {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  guests: string;
  message: string;
}) {
  const subject = `Catering Inquiry — ${values.eventType} for ${values.guests} guests`;
  const body = `Name: ${values.name}
Email: ${values.email}
Phone: ${values.phone}
Event Type: ${values.eventType}
Date: ${values.date}
Guests: ${values.guests}

Message:
${values.message}`;
  return `mailto:${RESTAURANT.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export default function CateringForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showMailtoFallback, setShowMailtoFallback] = useState(false);
  const [mailtoHref, setMailtoHref] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const eventType = String(data.get("eventType") ?? "").trim();
    const date = String(data.get("date") ?? "").trim();
    const guestsRaw = String(data.get("guests") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const errors: FieldErrors = {};
    if (!name) errors.name = "Please enter your name.";
    if (!email) {
      errors.email = "Please enter your email.";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (!phone) {
      errors.phone = "Please enter your phone number.";
    } else if (!/^[\d\s()+\-.]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.phone = "Please enter a valid phone number (7-15 digits).";
    }
    if (!eventType) errors.eventType = "Please select an event type.";
    if (!guestsRaw) errors.guests = "Please enter a guest count.";
    if (!message) errors.message = "Please include a short message.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError(null);
      setShowMailtoFallback(false);
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setShowMailtoFallback(false);

    const mailtoValues = { name, email, phone, eventType, date, guests: guestsRaw, message };
    const mailto = buildMailto(mailtoValues);

    const apiUrl = process.env.NEXT_PUBLIC_REVIEW_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_REVIEW_API_KEY;

    if (!apiUrl || !apiKey) {
      setFormError(
        `Couldn't reach our server. Email us directly at ${RESTAURANT.email} or call ${RESTAURANT.phone}.`
      );
      setMailtoHref(mailto);
      setShowMailtoFallback(true);
      return;
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setFormError("Please complete the security check before submitting.");
      return;
    }

    const guestsNum = Number(guestsRaw);
    const body = {
      form_type: "catering",
      payload: {
        eventType,
        date,
        guests: Number.isFinite(guestsNum) ? guestsNum : guestsRaw,
        message,
      },
      contact_name: name,
      contact_email: email,
      contact_phone: phone,
      location_slug: null,
      ...(turnstileToken ? { turnstile_token: turnstileToken } : {}),
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/ingest/form-submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSubmitted(true);
        return;
      }

      let serverMsg = "Something went wrong. Please try again.";
      try {
        const json = (await res.json()) as { error?: string };
        if (json && typeof json.error === "string" && json.error.trim()) {
          serverMsg = json.error;
        }
      } catch {
        // ignore JSON parse errors and use default message
      }
      setFormError(serverMsg);
    } catch {
      setFormError(
        `Couldn't reach our server. Email us directly at ${RESTAURANT.email} or call ${RESTAURANT.phone}.`
      );
      setMailtoHref(mailto);
      setShowMailtoFallback(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text)] transition-colors focus:outline-none focus:border-[var(--color-text)]";
  const labelCls = "block text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)] mb-2";
  const fieldErrorCls = "mt-1 text-xs text-[var(--color-primary)]";

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-section)] border border-[var(--color-border)] bg-[var(--color-warm-white)] p-10 text-center">
        <h3 className="!text-2xl mb-3">Thank you.</h3>
        <p className="text-[var(--color-text-muted)] leading-relaxed">
          We&apos;ve received your inquiry and will be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[var(--radius-section)] border border-[var(--color-border)] bg-[var(--color-warm-white)] p-7 md:p-10 grid gap-5"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>Your Name *</span>
          <input name="name" required type="text" className={inputCls} />
          {fieldErrors.name && <span className={fieldErrorCls}>{fieldErrors.name}</span>}
        </label>
        <label className="block">
          <span className={labelCls}>Email *</span>
          <input name="email" required type="email" className={inputCls} />
          {fieldErrors.email && <span className={fieldErrorCls}>{fieldErrors.email}</span>}
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>Phone *</span>
          <input name="phone" required type="tel" className={inputCls} />
          {fieldErrors.phone && <span className={fieldErrorCls}>{fieldErrors.phone}</span>}
        </label>
        <label className="block">
          <span className={labelCls}>Event Type *</span>
          <select name="eventType" required className={inputCls} defaultValue="">
            <option value="" disabled>Choose an option</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {fieldErrors.eventType && <span className={fieldErrorCls}>{fieldErrors.eventType}</span>}
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className={labelCls}>Event Date</span>
          <input name="date" type="date" className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Guest Count *</span>
          <input name="guests" required type="number" min={5} placeholder="e.g. 50" className={inputCls} />
          {fieldErrors.guests && <span className={fieldErrorCls}>{fieldErrors.guests}</span>}
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>Message</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us about your event — preferred dishes, dietary needs, delivery vs. pickup, etc."
          className={inputCls}
        />
        {fieldErrors.message && <span className={fieldErrorCls}>{fieldErrors.message}</span>}
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

      {formError && (
        <div
          role="alert"
          className="text-sm text-[var(--color-primary)] bg-red-50 border border-red-100 rounded-xl px-4 py-3"
        >
          <p>{formError}</p>
          {showMailtoFallback && mailtoHref && (
            <button
              type="button"
              onClick={() => {
                window.location.href = mailtoHref;
              }}
              className="mt-3 inline-flex items-center text-xs font-semibold uppercase tracking-[0.15em] underline"
            >
              Open email draft instead
            </button>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
        className="btn-primary justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending…" : "Send Catering Inquiry"}
      </button>

      <p className="text-xs text-[var(--color-text-muted)] text-center">
        For urgent requests, please call{" "}
        <QRHover value={`tel:${RESTAURANT.phoneRaw}`}>
          <a
            href={`tel:${RESTAURANT.phoneRaw}`}
            className="font-semibold text-[var(--color-text)] link-underline"
          >
            {RESTAURANT.phone}
          </a>
        </QRHover>
        .
      </p>
    </form>
  );
}
