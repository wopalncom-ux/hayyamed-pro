"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Cardiology", "Oncology", "Pediatrics", "Surgery", "Nursing", "Pharmacy",
  "Emergency Medicine", "Radiology", "Mental Health", "Patient Safety", "Ethics",
  "Dermatology", "Orthopedics", "Obstetrics", "Internal Medicine", "Other",
];

const DELIVERY_MODES = [
  { value: "online", label: "Online" },
  { value: "in_person", label: "In Person" },
  { value: "hybrid", label: "Hybrid" },
];

const CREDIT_TYPES = ["CME", "CPD", "CNE", "CPE"];
const COUNTRY_CODES = ["QA", "SA", "AE", "KW", "BH", "OM", "all"];

interface Props {
  providerId: string;
  initial?: {
    id?: string;
    title?: string;
    description?: string | null;
    category?: string;
    credits?: number;
    credit_type?: string;
    delivery_mode?: string;
    duration_hours?: number | null;
    price_usd?: number | null;
    is_free?: boolean;
    country_codes?: string[];
    start_date?: string | null;
    end_date?: string | null;
    enrollment_deadline?: string | null;
    max_enrollments?: number | null;
    status?: string;
  };
}

export default function CourseForm({ providerId, initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "Other",
    credits: initial?.credits ?? 1,
    credit_type: initial?.credit_type ?? "CME",
    delivery_mode: initial?.delivery_mode ?? "online",
    duration_hours: initial?.duration_hours ?? "",
    is_free: initial?.is_free ?? true,
    price_usd: initial?.price_usd ?? "",
    country_codes: initial?.country_codes ?? ["QA"],
    start_date: initial?.start_date ?? "",
    end_date: initial?.end_date ?? "",
    enrollment_deadline: initial?.enrollment_deadline ?? "",
    max_enrollments: initial?.max_enrollments ?? "",
    status: initial?.status ?? "draft",
  });

  function setField(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleCountry(code: string) {
    setForm((f) => {
      const codes = f.country_codes.includes(code)
        ? f.country_codes.filter((c) => c !== code)
        : [...f.country_codes, code];
      return { ...f, country_codes: codes.length ? codes : ["QA"] };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    if (!form.is_free && !form.price_usd) { setError("Price is required for paid courses"); return; }

    setLoading(true);
    setError(null);

    const body = {
      ...form,
      providerId,
      duration_hours: form.duration_hours ? Number(form.duration_hours) : null,
      price_usd: form.is_free ? null : Number(form.price_usd),
      max_enrollments: form.max_enrollments ? Number(form.max_enrollments) : null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      enrollment_deadline: form.enrollment_deadline || null,
    };

    const url = isEdit ? `/api/provider/courses/${initial!.id}` : "/api/provider/courses";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to save course");
    } else {
      router.push("/provider/courses");
      router.refresh();
    }
  }

  const inputClass = "w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30 focus:border-[#1a56a0] transition-colors";
  const labelClass = "block text-xs font-medium text-[#374151] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#111]">Course Details</h2>

        <div>
          <label className={labelClass}>Title *</label>
          <input className={inputClass} value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Course title" required />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea className={`${inputClass} resize-none`} rows={4} value={form.description as string} onChange={(e) => setField("description", e.target.value)} placeholder="Describe what learners will gain…" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Category</label>
            <select className={inputClass} value={form.category} onChange={(e) => setField("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Delivery Mode</label>
            <select className={inputClass} value={form.delivery_mode} onChange={(e) => setField("delivery_mode", e.target.value)}>
              {DELIVERY_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Credits *</label>
            <input type="number" min="0.5" step="0.5" className={inputClass} value={form.credits} onChange={(e) => setField("credits", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Credit Type</label>
            <select className={inputClass} value={form.credit_type} onChange={(e) => setField("credit_type", e.target.value)}>
              {CREDIT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Duration (hours)</label>
            <input type="number" min="0" step="0.5" className={inputClass} value={form.duration_hours as string} onChange={(e) => setField("duration_hours", e.target.value)} placeholder="Optional" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#111]">Pricing & Availability</h2>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_free" checked={form.is_free} onChange={(e) => setField("is_free", e.target.checked)} className="w-4 h-4 rounded accent-[#1a56a0]" />
          <label htmlFor="is_free" className="text-sm text-[#374151] cursor-pointer">Free course</label>
        </div>

        {!form.is_free && (
          <div className="w-48">
            <label className={labelClass}>Price (USD) *</label>
            <input type="number" min="0" step="0.01" className={inputClass} value={form.price_usd as string} onChange={(e) => setField("price_usd", e.target.value)} placeholder="0.00" />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Start Date</label>
            <input type="date" className={inputClass} value={form.start_date as string} onChange={(e) => setField("start_date", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>End Date</label>
            <input type="date" className={inputClass} value={form.end_date as string} onChange={(e) => setField("end_date", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Enroll By</label>
            <input type="date" className={inputClass} value={form.enrollment_deadline as string} onChange={(e) => setField("enrollment_deadline", e.target.value)} />
          </div>
        </div>

        <div className="w-48">
          <label className={labelClass}>Max Enrollments</label>
          <input type="number" min="1" className={inputClass} value={form.max_enrollments as string} onChange={(e) => setField("max_enrollments", e.target.value)} placeholder="Unlimited" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 space-y-3">
        <h2 className="text-sm font-semibold text-[#111]">Target Countries</h2>
        <div className="flex flex-wrap gap-2">
          {COUNTRY_CODES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => toggleCountry(code)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                form.country_codes.includes(code)
                  ? "bg-[#1a56a0] text-white border-[#1a56a0]"
                  : "bg-white text-[#374151] border-[#e2e8f0] hover:border-[#1a56a0]"
              }`}
            >
              {code === "all" ? "Global" : code}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-sm font-semibold text-[#111] mb-4">Publish Status</h2>
        <div className="flex gap-3">
          {["draft", "active"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setField("status", s)}
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                form.status === s
                  ? s === "active"
                    ? "bg-[#dcfce7] text-[#16a34a] border-[#16a34a]"
                    : "bg-[#f1f5f9] text-[#374151] border-[#374151]"
                  : "bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#374151]"
              }`}
            >
              {s === "active" ? "Publish" : "Save as Draft"}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#94a3b8] mt-2">
          Published courses are visible to all healthcare professionals in the marketplace.
        </p>
      </div>

      {error && (
        <p className="text-xs text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-[#64748b] hover:text-[#111] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1a56a0] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors disabled:opacity-60"
        >
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Course"}
        </button>
      </div>
    </form>
  );
}
