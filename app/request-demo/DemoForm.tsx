"use client";

import { useState } from "react";
import { submitDemoRequest } from "./actions";

const ORG_TYPES = [
  "Private clinic",
  "Hospital department",
  "Multi-site healthcare group",
  "University / medical school",
  "Government health authority",
  "Other",
];

const STAFF_RANGES = ["1–10", "11–25", "26–50", "51–200", "200+"];

const COUNTRIES = [
  "Qatar",
  "Saudi Arabia",
  "UAE (Dubai)",
  "UAE (Abu Dhabi)",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Multiple GCC countries",
  "Other",
];

const inputCls =
  "w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] placeholder:text-[#94a3b8] bg-white";

const labelCls = "block text-xs font-medium text-[#374151] mb-1.5";

export default function DemoForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await submitDemoRequest(new FormData(e.currentTarget));
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 text-center">
        <div className="w-14 h-14 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#111] mb-2">Demo request received</h2>
        <p className="text-sm text-[#64748b] mb-6 max-w-sm mx-auto">
          We&apos;ll email you within one business day to arrange a time.
          In the meantime, you can explore the platform for free.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/register"
            className="inline-block bg-[#1a56a0] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#154890] transition-colors"
          >
            Start free account now →
          </a>
          <a
            href="/employers"
            className="inline-block border border-[#e2e8f0] text-[#374151] font-medium text-sm px-6 py-3 rounded-xl hover:bg-[#f8fafc] transition-colors"
          >
            Back to Employer features
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Full name <span className="text-[#dc2626]">*</span></label>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Dr. Sarah Al-Mansouri"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Work email <span className="text-[#dc2626]">*</span></label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="sarah@hospital.qa"
            className={inputCls}
          />
        </div>
      </div>

      {/* Job title + Org name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Job title <span className="text-[#dc2626]">*</span></label>
          <input
            name="jobTitle"
            type="text"
            required
            placeholder="Medical Director / HR Manager"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Organisation name <span className="text-[#dc2626]">*</span></label>
          <input
            name="orgName"
            type="text"
            required
            placeholder="Hamad Medical Centre"
            className={inputCls}
          />
        </div>
      </div>

      {/* Org type */}
      <div>
        <label className={labelCls}>Organisation type <span className="text-[#dc2626]">*</span></label>
        <select name="orgType" required defaultValue="" className={inputCls + " text-[#374151]"}>
          <option value="" disabled>Select type…</option>
          {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Staff count + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Number of licensed staff <span className="text-[#dc2626]">*</span></label>
          <select name="staffCount" required defaultValue="" className={inputCls + " text-[#374151]"}>
            <option value="" disabled>Select range…</option>
            {STAFF_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Primary country <span className="text-[#dc2626]">*</span></label>
          <select name="country" required defaultValue="" className={inputCls + " text-[#374151]"}>
            <option value="" disabled>Select country…</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Optional message */}
      <div>
        <label className={labelCls}>Anything you&apos;d like us to know? <span className="text-[#94a3b8] font-normal">(optional)</span></label>
        <textarea
          name="message"
          rows={3}
          placeholder="Specific compliance requirements, current systems, questions about pricing…"
          className={inputCls + " resize-none"}
        />
      </div>

      {error && (
        <p className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#1a56a0] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#154890] disabled:opacity-60 transition-colors"
      >
        {submitting ? "Sending request…" : "Request a demo →"}
      </button>

      <p className="text-xs text-[#94a3b8] text-center">
        We typically respond within one business day. No pressure, no sales scripts.
      </p>
    </form>
  );
}
