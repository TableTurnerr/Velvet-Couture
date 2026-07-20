"use client";

import { useEffect, useId, useRef } from "react";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_ID = "cf-turnstile-script";

type TurnstileTheme = "light" | "dark" | "auto";
type TurnstileAppearance = "always" | "execute" | "interaction-only";

type RenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  theme?: TurnstileTheme;
  appearance?: TurnstileAppearance;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: RenderOptions) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.turnstile) {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("turnstile script failed to load")),
          { once: true },
        );
      }
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => {
        scriptPromise = null;
        reject(new Error("turnstile script failed to load"));
      },
      { once: true },
    );
    document.head.appendChild(script);
  });

  return scriptPromise;
}

type Props = {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: TurnstileTheme;
  appearance?: TurnstileAppearance;
  className?: string;
};

export default function Turnstile({
  siteKey,
  onVerify,
  onExpire,
  onError,
  theme = "light",
  appearance = "interaction-only",
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const id = useId();

  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onVerifyRef.current(token),
          "expired-callback": () => onExpireRef.current?.(),
          "error-callback": () => onErrorRef.current?.(),
          "timeout-callback": () => onExpireRef.current?.(),
          theme,
          appearance,
        });
      })
      .catch(() => {
        onErrorRef.current?.();
      });

    return () => {
      cancelled = true;
      const widgetId = widgetIdRef.current;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          // ignore — widget may already be torn down
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, theme, appearance]);

  return <div ref={containerRef} id={`ts-${id}`} className={className} />;
}
