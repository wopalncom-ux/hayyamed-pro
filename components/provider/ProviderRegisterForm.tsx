"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const COUNTRIES = [
  { code: "QA", label: "Qatar" },
  { code: "SA", label: "Saudi Arabia" },
  { code: "AE", label: "UAE" },
  { code: "KW", label: "Kuwait" },
  { code: "BH", label: "Bahrain" },
  { code: "OM", label: "Oman" },
];

export default function ProviderRegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    website_url: "",
    country_code: "QA",
    contact_email: "",
    is_accredited: false,
    accreditor: "",
  });

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Organization name is required"); return; }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/provider/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Registration failed");
    } else {
      router.refresh();
    }
  }

  const inputClass = "w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30 focus:border-[#1a56a0] transition-colors";
  const labelClass = "block text-xs font-medium text-[#374151] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-4">
      <div>
        <label className={labelClass}>Organization Name *</label>
        <input
          className={inputClass}
          placeholder="e.g. Qatar Medical Education Centre"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Brief description of your organization and the courses you offer…"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Country</label>
          <select
            className={inputClass}
            value={form.country_code}
            onChange={(e) => set("country_code", e.target.value)}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Contact Email</label>
          <input
            type="email"
            className={inputClass}
            placeholder="info@provider.com"
            value={form.contact_email}
            onChange={(e) => set("contact_email", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Website URL</label>
        <input
          type="url"
          className={inputClass}
          placeholder="https://www.provider.com"
          value={form.website_url}
          onChange={(e) => set("website_url", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 py-1">
        <input
          type="checkbox"
          id="is_accredited"
          checked={form.is_accredited}
          onChange={(e) => set("is_accredited", e.target.checked)}
          className="w-4 h-4 rounded border-[#e2e8f0] accent-[#1a56a0]"
        />
        <label htmlFor="is_accredited" className="text-sm text-[#374151] cursor-pointer">
          Our organization is accredited by a recognized authority
        </label>
      </div>

      {form.is_accredited && (
        <div>
          <label className={labelClass}>Accreditation Authority</label>
          <input
            className={inputClass}
            placeholder="e.g. QCHP, SCFHS, DHA, CME Dubai"
            value={form.accreditor}
            onChange={(e) => set("accreditor", e.target.value)}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1a56a0] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit Application"}
      </button>
      <p className="text-xs text-[#94a3b8] text-center">
        Applications are reviewed within 1–2 business days.
      </p>
    </form>
  );
}
