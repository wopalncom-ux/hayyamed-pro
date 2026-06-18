"use client";

import { useState, useRef } from "react";
import { submitBetaFeedback } from "./actions";

const ROLES = [
  "Physician / Doctor",
  "Nurse / Midwife",
  "Pharmacist",
  "Dentist",
  "Allied Health Professional",
  "Hospital Administrator",
  "Medical Educator",
  "Other",
];

const AREAS = [
  "CME activity logging",
  "License tracking & renewal",
  "AI gap analysis",
  "Employer / compliance dashboard",
  "Onboarding experience",
  "PDF compliance report",
  "Overall UI / ease of use",
  "Mobile / PWA experience",
  "Other",
];

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating."); return; }
    setStatus("submitting");
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set("rating", String(rating));
    const result = await submitBetaFeedback(fd);
    if (result.ok) {
      setStatus("done");
      formRef.current?.reset();
      setRating(0);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h2 className="text-lg font-semibold text-[#111] mb-2">Thank you for your feedback!</h2>
        <p className="text-sm text-[#64748b] mb-5">
          Your response helps us improve Hayya Med Pro for every healthcare professional in Qatar and the GCC.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-[#1a56a0] hover:underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-semibold text-[#111] mb-1.5">
          Your role <span className="text-[#dc2626]">*</span>
        </label>
        <select
          id="role"
          name="role"
          required
          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
        >
          <option value="">Select your profession</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Area */}
      <div>
        <label htmlFor="area" className="block text-sm font-semibold text-[#111] mb-1.5">
          What did you test? <span className="text-[#dc2626]">*</span>
        </label>
        <select
          id="area"
          name="area"
          required
          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
        >
          <option value="">Select an area</option>
          {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Star rating */}
      <div>
        <p className="text-sm font-semibold text-[#111] mb-1.5">
          Overall rating <span className="text-[#dc2626]">*</span>
        </p>
        <div className="flex gap-1" role="group" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              className="text-3xl leading-none transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] rounded"
              style={{ color: n <= (hovered || rating) ? "#d97706" : "#e2e8f0" }}
            >
              ★
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-[#64748b] self-center">
              {["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-[#111] mb-1.5">
          Your feedback <span className="text-[#dc2626]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="What worked well? What was confusing? What would you change? Any bugs you noticed?"
          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#111] placeholder:text-[#64748b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent resize-y"
        />
        <p className="text-xs text-[#64748b] mt-1">Min 10 characters, max 2,000</p>
      </div>

      {/* Optional email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#111] mb-1.5">
          Your email <span className="text-[#64748b] font-normal">(optional — for follow-up)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          maxLength={200}
          placeholder="you@example.com"
          className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm text-[#111] placeholder:text-[#64748b] bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-[#1a56a0] text-white font-semibold text-sm py-3 rounded-lg hover:bg-[#1547a0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending…" : "Submit feedback"}
      </button>
    </form>
  );
}
