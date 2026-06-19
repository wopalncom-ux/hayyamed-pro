"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import type { EmployerTierKey } from "@/lib/paddle";

// WhatsApp number — Qatar international format, no +, no spaces
const WHATSAPP_NUMBER = "97455234567"; // TODO: replace with real support WhatsApp
const SUPPORT_EMAIL   = "support@hayyamed.pro";

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
  const [showContactModal, setShowContactModal] = useState(false);
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
      const res = await fetch("/api/payment/qiib/create", {
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

      // Payment gateway not yet configured — show contact modal
      if (data.error === "payment_not_configured") {
        track("upgrade_payment_not_configured", { plan, billing_interval: billingInterval });
        setShowContactModal(true);
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
              className={`text-xs transition-colors w-full text-center ${variant === "white" ? "text-blue-100 hover:text-white" : "text-[#64748b] hover:text-[#1a56a0]"}`}
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
                className="flex-1 text-xs border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 placeholder:text-[#64748b] uppercase"
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

      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowContactModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#111] text-center mb-1">Online payments launching soon</h3>
            <p className="text-xs text-[#64748b] text-center mb-5 leading-relaxed">
              We&apos;re setting up payment processing. Contact us now and we&apos;ll activate your {plan === "pro" ? "Pro" : "Employer"} account within 24 hours.
            </p>
            <div className="space-y-3 mb-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I'd like to upgrade to Hayya Med Pro ${plan === "employer" ? "Employer" : ""}. Can you help?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("upgrade_whatsapp_clicked", { plan })}
                className="flex items-center justify-center gap-2.5 w-full bg-[#25d366] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#1db954] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.553 4.107 1.521 5.831L0 24l6.335-1.489A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 0 1-5.017-1.379l-.36-.213-3.73.876.944-3.643-.234-.374A9.794 9.794 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
                </svg>
                Message us on WhatsApp
              </a>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Upgrade to Hayya Med Pro")}&body=${encodeURIComponent(`Hi,\n\nI'd like to upgrade to Hayya Med Pro ${plan === "employer" ? "Employer" : `(${billingInterval})`}.\n\nPlease activate my account.\n\nThank you`)}`}
                onClick={() => track("upgrade_email_clicked", { plan })}
                className="flex items-center justify-center gap-2.5 w-full bg-[#f1f5f9] text-[#374151] font-semibold text-sm py-3 rounded-xl hover:bg-[#e2e8f0] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                Email {SUPPORT_EMAIL}
              </a>
            </div>
            <button
              type="button"
              onClick={() => setShowContactModal(false)}
              className="w-full text-xs text-[#64748b] hover:text-[#374151] transition-colors py-1"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
