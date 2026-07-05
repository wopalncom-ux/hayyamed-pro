"use client";

import { useEffect, useState, useTransition } from "react";
import type { Metadata } from "next";

// This page is intentionally a client component — it manages live toggles

type Controls = {
  id: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  disable_registrations: boolean;
  disable_payments: boolean;
  disable_ai: boolean;
  disable_email_notifications: boolean;
  emergency_banner_active: boolean;
  emergency_banner_message: string | null;
  emergency_banner_type: string;
  updated_at: string;
};

function Toggle({
  checked,
  onChange,
  danger = false,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${
        checked
          ? danger
            ? "bg-red-600 focus:ring-red-500"
            : "bg-[#1a56a0] focus:ring-[#1a56a0]"
          : "bg-gray-200 focus:ring-gray-400"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function EmergencyControlsPage() {
  const [controls, setControls] = useState<Controls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [confirmField, setConfirmField] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<boolean | string | null>(null);

  useEffect(() => {
    fetch("/api/owner/emergency")
      .then((r) => r.json())
      .then((data) => { setControls(data); setLoading(false); })
      .catch(() => { setError("Failed to load emergency controls"); setLoading(false); });
  }, []);

  async function toggle(field: string, value: boolean | string) {
    setSaving(field);
    setConfirmField(null);
    try {
      const res = await fetch("/api/owner/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      if (!res.ok) throw new Error(await res.text());
      setControls((prev) => prev ? { ...prev, [field]: value } : prev);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSaving(null);
    }
  }

  function requestToggle(field: string, value: boolean, isDangerous: boolean) {
    if (isDangerous && value === true) {
      setConfirmField(field);
      setPendingValue(value);
    } else {
      toggle(field, value);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#1a56a0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !controls) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-700">Error: {error}</p>
        <p className="text-xs text-red-500 mt-1">
          The emergency controls table may not exist yet. Run migration 082 in Supabase.
        </p>
      </div>
    );
  }

  const dangerSwitches = [
    {
      field: "maintenance_mode",
      label: "Maintenance Mode",
      desc: "Takes the entire platform offline. All requests return a maintenance page.",
      value: controls?.maintenance_mode ?? false,
      danger: true,
    },
    {
      field: "disable_registrations",
      label: "Disable Registrations",
      desc: "New user sign-ups are blocked. Existing users can still log in.",
      value: controls?.disable_registrations ?? false,
      danger: true,
    },
    {
      field: "disable_payments",
      label: "Disable Payments",
      desc: "All Paddle checkout flows are disabled. No new subscriptions or upgrades.",
      value: controls?.disable_payments ?? false,
      danger: true,
    },
    {
      field: "disable_ai",
      label: "Disable AI Features",
      desc: "All AI endpoints (Gemini) return fallback responses immediately.",
      value: controls?.disable_ai ?? false,
      danger: false,
    },
    {
      field: "disable_email_notifications",
      label: "Disable Email Notifications",
      desc: "Stops all outbound Postmark emails. Queued emails are not delivered.",
      value: controls?.disable_email_notifications ?? false,
      danger: false,
    },
  ];

  const labelMap: Record<string, string> = {
    maintenance_mode: "Maintenance Mode",
    disable_registrations: "Disable Registrations",
    disable_payments: "Disable Payments",
    disable_ai: "Disable AI Features",
    disable_email_notifications: "Disable Email Notifications",
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a]">Emergency Control Center</h1>
            <p className="text-sm text-[#64748b]">Owner-only. All changes are audited and irreversible until toggled back.</p>
          </div>
        </div>
        {controls?.updated_at && (
          <p className="text-xs text-[#94a3b8] mt-2">
            Last updated: {new Date(controls.updated_at).toLocaleString("en-GB")}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Confirmation dialog */}
      {confirmField && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#0f172a] text-center mb-2">
              Confirm: Enable {labelMap[confirmField] ?? confirmField}
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-6">
              This will immediately affect all users on the platform. Are you sure you want to proceed?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmField(null); setPendingValue(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-semibold text-[#374151] hover:bg-[#f8fafc] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { if (confirmField && pendingValue !== null) toggle(confirmField, pendingValue as boolean | string); }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Enable Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kill switches */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] divide-y divide-[#f1f5f9]">
        <div className="px-6 py-4">
          <h2 className="text-sm font-semibold text-[#0f172a]">Platform Kill Switches</h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">Immediate effect. Logged to audit trail.</p>
        </div>
        {dangerSwitches.map((sw) => (
          <div key={sw.field} className="px-6 py-5 flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-semibold ${sw.value ? (sw.danger ? "text-red-700" : "text-amber-700") : "text-[#0f172a]"}`}>
                  {sw.label}
                </p>
                {sw.value && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    sw.danger ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    ACTIVE
                  </span>
                )}
                {sw.danger && (
                  <span className="text-[10px] font-semibold text-[#94a3b8] border border-[#e2e8f0] px-1.5 py-0.5 rounded">
                    HIGH IMPACT
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748b] leading-relaxed">{sw.desc}</p>
            </div>
            <div className="flex-shrink-0">
              <Toggle
                checked={sw.value}
                onChange={(v) => requestToggle(sw.field, v, sw.danger)}
                danger={sw.danger}
                disabled={saving === sw.field}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Emergency banner */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#0f172a]">Emergency Banner</h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">Shown as a full-width banner to all logged-in users</p>
          </div>
          <Toggle
            checked={controls?.emergency_banner_active ?? false}
            onChange={(v) => toggle("emergency_banner_active", v)}
            disabled={saving === "emergency_banner_active"}
          />
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Banner Type</label>
            <select
              value={controls?.emergency_banner_type ?? "warning"}
              onChange={(e) => toggle("emergency_banner_type", e.target.value)}
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
            >
              <option value="info">Info (blue)</option>
              <option value="warning">Warning (amber)</option>
              <option value="error">Error (red)</option>
              <option value="success">Success (green)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Banner Message</label>
            <textarea
              value={controls?.emergency_banner_message ?? ""}
              onChange={(e) => setControls((prev) => prev ? { ...prev, emergency_banner_message: e.target.value } : prev)}
              onBlur={(e) => toggle("emergency_banner_message", e.target.value)}
              rows={2}
              placeholder="We are aware of a current issue and working to resolve it..."
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Maintenance message */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-6 py-4 border-b border-[#f1f5f9]">
          <h2 className="text-sm font-semibold text-[#0f172a]">Maintenance Mode Message</h2>
          <p className="text-xs text-[#94a3b8] mt-0.5">Shown when maintenance mode is active</p>
        </div>
        <div className="px-6 py-5">
          <textarea
            value={controls?.maintenance_message ?? ""}
            onChange={(e) => setControls((prev) => prev ? { ...prev, maintenance_message: e.target.value } : prev)}
            onBlur={(e) => toggle("maintenance_message", e.target.value)}
            rows={3}
            placeholder="The platform is currently under maintenance..."
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
          />
        </div>
      </div>

      {/* Warning note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <p className="text-sm font-semibold text-amber-800 mb-1">Security Notice</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          All emergency control changes are permanently logged in the audit trail with your user ID,
          timestamp, and previous value. These actions cannot be deleted. If you need to reverse a change,
          toggle the switch off — the audit log will record both the enable and disable events.
        </p>
      </div>
    </div>
  );
}
