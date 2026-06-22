"use client";

import { useState } from "react";

interface BrandingData {
  brand_color:         string | null;
  brand_logo_url:      string | null;
  brand_name_override: string | null;
  brand_email_from:    string | null;
}

const DEFAULT_COLOR = "#1a56a0";

export default function BrandingSettings({
  organizationId,
  orgName,
  initial,
}: {
  organizationId: string;
  orgName: string;
  initial: BrandingData;
}) {
  const [color,    setColor]    = useState(initial.brand_color ?? DEFAULT_COLOR);
  const [logoUrl,  setLogoUrl]  = useState(initial.brand_logo_url ?? "");
  const [nameOverride, setNameOverride] = useState(initial.brand_name_override ?? "");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const hasChanges =
    color !== (initial.brand_color ?? DEFAULT_COLOR) ||
    logoUrl !== (initial.brand_logo_url ?? "") ||
    nameOverride !== (initial.brand_name_override ?? "");

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/employer/branding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_color:         color !== DEFAULT_COLOR ? color : null,
          brand_logo_url:      logoUrl.trim() || null,
          brand_name_override: nameOverride.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setColor(DEFAULT_COLOR);
    setLogoUrl("");
    setNameOverride("");
  }

  // Live preview color
  const previewColor = /^#[0-9a-fA-F]{6}$/.test(color) ? color : DEFAULT_COLOR;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[#f1f5f9]">
        <h3 className="text-sm font-semibold text-[#111]">Organisation branding</h3>
        <p className="text-xs text-[#64748b] mt-0.5">
          Customise how your organisation appears on the employer dashboard. Changes apply immediately.
        </p>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Brand color */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-2">Brand colour</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded-lg border border-[#e2e8f0] cursor-pointer p-0.5 bg-transparent"
              aria-label="Pick brand colour"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#1a56a0"
              maxLength={7}
              className="w-28 border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm font-mono text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30"
              aria-label="Brand colour hex value"
            />
            <div
              className="flex-1 h-10 rounded-lg border border-[#e2e8f0] transition-colors"
              style={{ background: previewColor }}
              title="Colour preview"
            />
          </div>
          <p className="text-xs text-[#94a3b8] mt-1.5">
            Used for the dashboard header, buttons, and progress indicators. Must be a valid hex colour (#RRGGBB).
          </p>
        </div>

        {/* Logo URL */}
        <div>
          <label htmlFor="brand-logo" className="block text-xs font-semibold text-[#374151] mb-2">
            Logo URL
          </label>
          <input
            id="brand-logo"
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://your-hospital.qa/logo.png"
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30"
          />
          <p className="text-xs text-[#94a3b8] mt-1.5">
            Public URL to your hospital or organisation logo. Recommended: PNG or SVG, 200×60 px, transparent background.
          </p>
          {logoUrl && /^https?:\/\/.+/.test(logoUrl) && (
            <div className="mt-3 p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg inline-flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Logo preview"
                className="h-8 max-w-[160px] object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <span className="text-xs text-[#64748b]">Preview</span>
            </div>
          )}
        </div>

        {/* Display name */}
        <div>
          <label htmlFor="brand-name" className="block text-xs font-semibold text-[#374151] mb-2">
            Display name override
          </label>
          <input
            id="brand-name"
            type="text"
            value={nameOverride}
            onChange={(e) => setNameOverride(e.target.value)}
            placeholder={orgName}
            maxLength={80}
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30"
          />
          <p className="text-xs text-[#94a3b8] mt-1.5">
            Shown in the dashboard header instead of the default organisation name. Leave blank to use the registered name ({orgName}).
          </p>
        </div>

        {/* Live preview */}
        <div>
          <p className="text-xs font-semibold text-[#374151] mb-2">Dashboard header preview</p>
          <div
            className="rounded-xl p-4 flex items-center gap-3 transition-colors"
            style={{ backgroundColor: previewColor }}
          >
            {logoUrl && /^https?:\/\/.+/.test(logoUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="h-7 max-w-[120px] object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
            )}
            <span className="text-white font-bold text-sm">
              {nameOverride.trim() || orgName}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-[#f1f5f9]">
          <button
            onClick={save}
            disabled={saving || !hasChanges}
            className={`text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
              saved
                ? "bg-[#dcfce7] text-[#16a34a]"
                : "bg-[#1a56a0] text-white hover:bg-[#1547a0] disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {saving ? "Saving…" : saved ? "Saved!" : "Save branding"}
          </button>
          <button
            onClick={reset}
            disabled={saving}
            className="text-xs text-[#94a3b8] hover:text-[#64748b] transition-colors"
          >
            Reset to defaults
          </button>
          {error && <p className="text-xs text-[#dc2626]">{error}</p>}
        </div>
      </div>
    </div>
  );
}
