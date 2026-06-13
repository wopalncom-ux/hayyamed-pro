"use client";

import { useState } from "react";
import { submitContactForm } from "./actions";

const SUBJECTS = [
  "CME or compliance question",
  "Technical issue",
  "Billing or subscription",
  "Account access",
  "Feature request",
  "Partnership inquiry",
  "Other",
];

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await submitContactForm(new FormData(e.currentTarget));
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center">
        <div className="w-12 h-12 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-[#111] mb-2">Message sent</h2>
        <p className="text-sm text-[#64748b] mb-5">
          We&apos;ve received your message and will reply to your email within 24 hours.
        </p>
        <a
          href="/dashboard"
          className="text-sm text-[#1a56a0] hover:underline font-medium"
        >
          Back to dashboard →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Full name <span className="text-[#dc2626]">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Dr. Sarah Al-Mansouri"
            className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] placeholder:text-[#94a3b8]"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            Email address <span className="text-[#dc2626]">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@hospital.qa"
            className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] placeholder:text-[#94a3b8]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#374151] mb-1.5">
          Subject <span className="text-[#dc2626]">*</span>
        </label>
        <select
          name="subject"
          required
          defaultValue=""
          className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] text-[#374151]"
        >
          <option value="" disabled>Select a topic…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#374151] mb-1.5">
          Message <span className="text-[#dc2626]">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Describe your question or issue in detail…"
          className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] placeholder:text-[#94a3b8] resize-none"
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
        className="w-full bg-[#1a56a0] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
      >
        {submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
