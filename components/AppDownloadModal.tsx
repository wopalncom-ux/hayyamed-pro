"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Download, Smartphone, Wifi, Zap, ShieldCheck } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY   = "hmp-download-modal-dismissed-until";
const DISMISS_DAYS  = 30;
const AUTO_DELAY_MS = 3000;

// Any button site-wide can open this modal by dispatching this event.
const OPEN_EVENT = "hmp:open-download";

export function AppDownloadModal() {
  const pathname = usePathname();
  const [open, setOpen]           = useState(false);
  const [isIOS, setIsIOS]         = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef  = useRef<HTMLButtonElement>(null);

  // One-time setup: detect platform, capture install event
  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as { standalone?: boolean }).standalone;
    setIsIOS(ios);

    const installed =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    setIsInstalled(installed);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Auto-show on landing page only, after delay, if not dismissed
  useEffect(() => {
    if (pathname !== "/") return;
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed && Date.now() < Number(dismissed)) return;

    const timer = setTimeout(() => {
      // Only auto-show if there's something to offer
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) &&
        !(window.navigator as { standalone?: boolean }).standalone;
      const installed = window.matchMedia("(display-mode: standalone)").matches;
      if (!installed) setOpen(true);
      setIsIOS(ios);
    }, AUTO_DELAY_MS);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Listen for manual trigger from any button site-wide
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  // Focus trap + Escape key
  useEffect(() => {
    if (!open) return;
    // Focus the close button on open
    requestAnimationFrame(() => closeRef.current?.focus());

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { dismiss(); return; }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function dismiss() {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_DAYS * 86_400_000));
  }

  async function handleInstall() {
    if (installEvent) {
      await installEvent.prompt();
      const { outcome } = await installEvent.userChoice;
      if (outcome === "accepted") {
        setOpen(false);
        setInstallEvent(null);
      }
    }
  }

  if (!open) return null;

  const canInstall = !isInstalled && (isIOS || !!installEvent);

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center px-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-modal-title"
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "hmpModalIn 0.25s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#1a56a0] to-[#3b82f6]" aria-hidden="true" />

        {/* Close */}
        <button
          ref={closeRef}
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#374151] transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="px-6 pt-6 pb-7">
          {/* Brand logo block */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#1a56a0] flex items-center justify-center shadow-lg shadow-blue-900/25 flex-shrink-0">
              <span className="text-white text-2xl font-bold" aria-hidden="true">H</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest">Hayya Med</p>
              <p className="text-xl font-bold text-[#111]">Pro</p>
            </div>
          </div>

          {/* Headline */}
          <h2 id="app-modal-title" className="text-lg font-bold text-[#111] leading-snug">
            Download Hayya Med Pro App
          </h2>
          <p className="text-sm text-[#64748b] mt-1.5 leading-relaxed">
            Track CME credits, manage license renewals, and stay compliant with QCHP, SCFHS, and DHA — right from your phone.
          </p>

          {/* Benefits */}
          <ul className="mt-4 space-y-2.5" role="list">
            {[
              { icon: Wifi,        text: "Works offline — no internet required" },
              { icon: Zap,         text: "Instant access, no App Store needed" },
              { icon: ShieldCheck, text: "Secure, private, and always up to date" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#1a56a0]" aria-hidden="true" />
                </div>
                <span className="text-sm text-[#374151]">{text}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-6 space-y-2.5">
            {isInstalled ? (
              <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#dcfce7] text-[#16a34a] text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                App is already installed
              </div>
            ) : isIOS ? (
              <div className="rounded-xl bg-[#f0f4f8] px-4 py-3.5 text-sm text-[#374151] leading-relaxed">
                <p className="font-semibold text-[#111] mb-1.5 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#1a56a0]" aria-hidden="true" />
                  Add to Home Screen
                </p>
                <p>
                  Tap the <span className="font-semibold">Share</span> icon{" "}
                  <span aria-label="share icon">⎙</span> in Safari, then tap{" "}
                  <span className="font-semibold">Add to Home Screen</span>.
                </p>
              </div>
            ) : canInstall ? (
              <button
                onClick={handleInstall}
                className="w-full flex items-center justify-center gap-2 bg-[#1a56a0] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#1547a0] active:bg-[#1240a0] transition-colors shadow-md shadow-blue-900/20"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Download App — Free
              </button>
            ) : (
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    // Try to prompt Chrome's native install via address bar
                    window.dispatchEvent(new Event("beforeinstallprompt"));
                    // If that doesn't work, show browser address bar hint
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a56a0] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#1547a0] active:bg-[#1240a0] transition-colors shadow-md shadow-blue-900/20"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Download Now — Free
                </button>
                <p className="text-xs text-[#64748b] text-center leading-relaxed">
                  On desktop: click the <span className="font-semibold">⊕</span> icon in your browser&apos;s address bar.<br />
                  On mobile: open <span className="font-semibold">hayyamed.pro</span> in Chrome or Safari.
                </p>
              </div>
            )}

            <button
              onClick={dismiss}
              className="w-full py-2.5 rounded-xl text-sm text-[#64748b] hover:text-[#374151] hover:bg-[#f8fafc] transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hmpModalIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes hmpModalIn { from { opacity: 0; } to { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}

/** Fire this from any "Download App" button site-wide */
export function triggerAppDownloadModal() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}
