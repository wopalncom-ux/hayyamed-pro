"use client";

import { useEffect, useRef, useState } from "react";
import { playSound } from "@/lib/sounds";

const CONFETTI_COLORS = ["#1a56a0", "#16a34a", "#d97706", "#e879f9", "#f97316", "#14b8a6", "#f59e0b"];
const MILESTONES = [25, 50, 75, 100] as const;

function milestoneKey(walletId: string, m: number) {
  return `hm_ms_${walletId}_${m}`;
}

function hasSeen(walletId: string, m: number) {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(milestoneKey(walletId, m)) === "1";
}

function markSeen(walletId: string, m: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(milestoneKey(walletId, m), "1");
}

const MESSAGES: Record<number, string> = {
  25: "Great start — 25% of your cycle complete!",
  50: "Halfway there — keep the momentum going!",
  75: "Almost there — 75% complete!",
  100: "Outstanding! You've completed your compliance cycle!",
};

export default function MilestoneCelebration({
  walletId,
  completed,
  required,
}: {
  walletId: string;
  completed: number;
  required: number;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [burst, setBurst] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (required === 0 || firedRef.current) return;
    const pct = (completed / required) * 100;

    for (const m of [...MILESTONES].reverse()) {
      if (pct >= m && !hasSeen(walletId, m)) {
        firedRef.current = true;
        markSeen(walletId, m);
        setActive(m);
        setBurst(true);
        playSound(m === 100 ? "complete" : "milestone");
        setTimeout(() => setBurst(false), 1000);
        setTimeout(() => { setActive(null); firedRef.current = false; }, 5500);
        break;
      }
    }
  }, [completed, required, walletId]);

  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes hm-confetti-fall {
          0%   { transform: translateY(-8px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(90px)  rotate(540deg); opacity: 0; }
        }
        @keyframes hm-toast-in {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-12px) scale(0.95); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0)     scale(1); }
        }
        @keyframes hm-toast-out {
          0%   { opacity: 1; }
          100% { opacity: 0; transform: translateX(-50%) translateY(-8px); }
        }
      `}</style>

      <div
        className="fixed top-5 left-1/2 z-[9999] pointer-events-none"
        style={{ animation: "hm-toast-in 0.35s ease forwards, hm-toast-out 0.3s ease 5.2s forwards" }}
      >
        <div className={`relative bg-white shadow-2xl rounded-2xl px-5 py-3.5 flex items-center gap-3 border ${
          active === 100 ? "border-[#bbf7d0]" : "border-[#bfdbfe]"
        }`}>
          {burst && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {Array.from({ length: 22 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${4 + i * 4.4}%`,
                    top: "0px",
                    width: i % 3 === 0 ? "6px" : "8px",
                    height: i % 3 === 0 ? "6px" : "8px",
                    backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    borderRadius: i % 2 === 0 ? "50%" : "2px",
                    animation: `hm-confetti-fall 0.85s ease-in ${i * 0.035}s forwards`,
                    opacity: 0,
                  }}
                />
              ))}
            </div>
          )}
          <span className="text-2xl select-none">{active === 100 ? "🏆" : "⭐"}</span>
          <div>
            <p className="text-sm font-semibold text-[#111]">{active}% Complete!</p>
            <p className="text-xs text-[#64748b]">{MESSAGES[active]}</p>
          </div>
        </div>
      </div>
    </>
  );
}
