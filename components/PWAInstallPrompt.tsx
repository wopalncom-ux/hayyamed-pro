"use client";

import { useEffect, useState } from "react";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "pwa-install-dismissed-until";
const DISMISS_DAYS = 7;

export function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissedUntil = localStorage.getItem(DISMISSED_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return;

    const isIOS =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as { standalone?: boolean }).standalone;

    if (isIOS) {
      setShowIOSGuide(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(
      DISMISSED_KEY,
      String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000)
    );
  }

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setInstallEvent(null);
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm"
    >
      <div className="rounded-2xl border border-blue-100 bg-white shadow-2xl shadow-blue-900/10 overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-700" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-700" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                Install Hayya Med Pro
              </p>
              {showIOSGuide ? (
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Tap{" "}
                  <span className="font-medium text-gray-700">Share</span> then{" "}
                  <span className="font-medium text-gray-700">
                    Add to Home Screen
                  </span>{" "}
                  for faster access and offline use.
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-0.5">
                  Faster access, works offline. No App Store needed.
                </p>
              )}
            </div>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Install button — only for non-iOS */}
          {!showIOSGuide && (
            <button
              onClick={install}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 active:bg-blue-900 transition-colors"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
