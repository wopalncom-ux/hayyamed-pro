"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "cookie_consent_v1";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none">
      <div className="bg-white border border-[#e2e8f0] shadow-xl rounded-xl max-w-xl w-full px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 pointer-events-auto">
        <p className="text-sm text-[#374151] flex-1 leading-relaxed">
          We use essential cookies for authentication and secure session management only. No advertising or tracking cookies.{" "}
          <a href="/privacy" className="text-[#1a56a0] underline hover:no-underline">Privacy Policy</a>
        </p>
        <button
          onClick={accept}
          className="shrink-0 bg-[#1a56a0] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1547a0] transition-colors whitespace-nowrap"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
