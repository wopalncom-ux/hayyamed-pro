"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import type { EmployerTierKey } from "@/lib/paddle";

interface Props {
  plan: "pro" | "employer";
  billingInterval?: "monthly" | "annual";
  employerTier?: EmployerTierKey;
  label?: string;
  variant?: "primary" | "white";
}

interface AppliedDiscount {
  id: string;
  name: string;
  type: string;
  value: number;
}

export default function UpgradeButton({
  plan,
  billingInterval = "annual",
  employerTier,
  label = "Get Started",
  variant = "primary",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);

  async function applyPromoCode() {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    setPromoError(null);
    setAppliedDiscount(null);
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, plan }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedDiscount(data.discount);
        track("promo_code_applied", { plan, code, discount_type: data.discount.type });
      } else {
        setPromoError(data.error ?? "Invalid promo code");
      }
    } catch {
      setPromoError("Could not validate code — try again");
    }
    setPromoLoading(false);
  }

  async function handleClick() {
    setLoading(true);
    setErrorMsg(null);
    track("upgrade_clicked", { source: "pricing_page", plan, billing_interval: billingInterval, employer_tier: employerTier });
    try {
      const res = await fetch("/api/paddle/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing_interval: billingInterval,
          employer_tier: employerTier,
          ...(appliedDiscount ? { promo_code: promoInput.trim().toUpperCase() } : {}),
        }),
      });

      if (res.status === 401) {
        window.location.href = `/login?next=/pricing`;
        return;
      }

      const data = await res.json();
      if (data.url) {
        track("subscription_started", { plan, billing_interval: billingInterval });
        window.location.href = data.url;
        return;
      }

      setErrorMsg("Could not start checkout — please try again.");
    } catch {
      setErrorMsg("Network error — please try again.");
    }
    setLoading(false);
  }

  const primaryCls = "w-full bg-[#1a56a0] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1547a0] disabled:opacity-60 transition-all";
  const whiteCls   = "w-full bg-white text-[#1a56a0] py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 disabled:opacity-60 transition-all";

  function discountLabel(d: AppliedDiscount): string {
    if (d.type === "free_upgrade") return "Free upgrade applied";
    if (d.type === "percentage") return `${d.value}% off applied`;
    return `$${d.value} off applied`;
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={variant === "white" ? whiteCls : primaryCls}
      >
        {loading ? "Redirecting…" : label}
      </button>

      {/* Promo code section */}
      {!appliedDiscount ? (
        <div>
          {!showPromo ? (
            <button
              type="button"
              onClick={() => setShowPromo(true)}
              className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors w-full text-center"
            >
              Have a promo code?
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null); }}
                onKeyDown={(e) => e.key === "Enter" && applyPromoCode()}
                placeholder="PROMO CODE"
                className="flex-1 text-xs border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 placeholder:text-[#94a3b8] uppercase"
                maxLength={50}
                autoFocus
              />
              <button
                type="button"
                onClick={applyPromoCode}
                disabled={promoLoading || !promoInput.trim()}
                className="text-xs font-semibold px-3 py-2 rounded-lg bg-[#f1f5f9] text-[#374151] hover:bg-[#e2e8f0] disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {promoLoading ? "…" : "Apply"}
              </button>
            </div>
          )}
          {promoError && (
            <p className="text-[11px] text-[#dc2626] text-center">{promoError}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-3 py-2">
          <span className="text-xs font-semibold text-[#16a34a]">✓ {discountLabel(appliedDiscount)}</span>
          <button
            type="button"
            onClick={() => { setAppliedDiscount(null); setPromoInput(""); }}
            className="text-[10px] text-[#64748b] hover:text-[#dc2626] transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs text-[#dc2626] text-center">{errorMsg}</p>
      )}
    </div>
  );
}
