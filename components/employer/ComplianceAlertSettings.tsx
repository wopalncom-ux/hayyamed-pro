"use client";

import { useState, useEffect } from "react";

interface Threshold {
  threshold_pct: number;
  alert_email: string;
  enabled: boolean;
}

export default function ComplianceAlertSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [thresholdPct, setThresholdPct] = useState(80);
  const [alertEmail, setAlertEmail] = useState("");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetch("/api/employer/compliance-threshold")
      .then((r) => r.json())
      .then((data: { threshold: Threshold | null }) => {
        if (data.threshold) {
          setThresholdPct(data.threshold.threshold_pct);
          setAlertEmail(data.threshold.alert_email);
          setEnabled(data.threshold.enabled);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!alertEmail || !alertEmail.includes("@")) {
      setError("A valid alert email is required.");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/employer/compliance-threshold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threshold_pct: thresholdPct, alert_email: alertEmail, enabled }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save alert settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 animate-pulse">
        <div className="h-4 bg-[#e2e8f0] rounded w-48 mb-3" />
        <div className="h-3 bg-[#e2e8f0] rounded w-72" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0]">
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#111]">Compliance Alert Thresholds</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            Get an email alert when any staff member&apos;s CME progress drops below your threshold.
          </p>
        </div>
        <button
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:ring-offset-2 ${
            enabled ? "bg-[#1a56a0]" : "bg-[#cbd5e1]"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
          <span className="sr-only">{enabled ? "Disable alerts" : "Enable alerts"}</span>
        </button>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Threshold slider */}
        <div>
          <label htmlFor="threshold-pct" className="block text-sm font-medium text-[#111] mb-1">
            Alert when staff compliance falls below{" "}
            <span className="text-[#1a56a0] font-bold">{thresholdPct}%</span>
          </label>
          <input
            id="threshold-pct"
            type="range"
            min={0}
            max={100}
            step={5}
            value={thresholdPct}
            onChange={(e) => setThresholdPct(Number(e.target.value))}
            className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#1a56a0]"
          />
          <div className="flex justify-between text-xs text-[#94a3b8] mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <p className="text-xs text-[#64748b] mt-1.5">
            Recommended: 80% — alerts fire when a staff member completes fewer than {thresholdPct} of their required credits.
          </p>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="alert-email" className="block text-sm font-medium text-[#111] mb-1">
            Alert email address
          </label>
          <input
            id="alert-email"
            type="email"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            placeholder="hr@yourhospital.com"
            className="w-full max-w-sm border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#111] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
          />
          <p className="text-xs text-[#64748b] mt-1">
            The compliance cron runs weekly and sends a summary to this address.
          </p>
        </div>

        {/* Status messages */}
        {error && (
          <p className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {saved && (
          <p className="text-sm text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-3 py-2">
            Alert settings saved successfully.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a56a0] text-white text-sm font-semibold rounded-lg hover:bg-[#154890] disabled:opacity-60 transition-colors"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </>
          ) : (
            "Save alert settings"
          )}
        </button>
      </div>
    </div>
  );
}
