"use client";

import { useEffect, useState } from "react";
import { getSoundEnabled, setSoundEnabled } from "@/lib/sounds";

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(getSoundEnabled());
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
          <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3M6.343 9.657a8 8 0 000 11.314" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10v4a1 1 0 001 1h2l3.5 3.5V5.5L6 9H4a1 1 0 00-1 1z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-[#111]">Sound Effects</p>
          <p className="text-xs text-[#64748b]">Chimes for activity submissions, milestones, and alerts</p>
        </div>
      </div>
      <button
        onClick={toggle}
        role="switch"
        aria-checked={enabled}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56a0] ${
          enabled ? "bg-[#1a56a0]" : "bg-[#e2e8f0]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
