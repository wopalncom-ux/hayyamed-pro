"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PROFESSIONS = ["Doctor (MD/MBBS)", "Dentist", "Pharmacist", "Nurse", "Physiotherapist", "Dietitian", "Radiologist", "Lab Technician", "Other"];
const AUTHORITIES = ["QCHP (Qatar)", "DHA (Dubai)", "HAAD (Abu Dhabi)", "MOH (Saudi Arabia)", "MOH (UAE)", "CPHQ (Kuwait)", "NHRA (Bahrain)", "OMSB (Oman)", "Other"];

export default function Step3Professional({ profile, userId }: { profile: Record<string, unknown> | null; userId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    profession: String(profile?.profession ?? ""),
    specialty: String(profile?.specialty ?? ""),
    subspecialty: String(profile?.subspecialty ?? ""),
    license_number: String(profile?.license_number ?? ""),
    licensing_authority: String(profile?.licensing_authority ?? ""),
    license_expiry: String(profile?.license_expiry ?? ""),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("professional_profiles")
      .update({ ...form, onboarding_step: 4 })
      .eq("auth_id", userId);

    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/onboarding/4");
  }

  const textField = (id: string, label: string, placeholder = "") => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#374151] mb-1">{label}</label>
      <input
        id={id}
        type="text"
        value={form[id as keyof typeof form]}
        onChange={(e) => setForm(f => ({ ...f, [id]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#111] mb-2">Professional Information</h2>

      <div>
        <label htmlFor="profession" className="block text-sm font-medium text-[#374151] mb-1">Profession</label>
        <select
          id="profession"
          value={form.profession}
          onChange={(e) => setForm(f => ({ ...f, profession: e.target.value }))}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
          required
        >
          <option value="">Select profession</option>
          {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {textField("specialty", "Specialty", "e.g. Cardiology")}
      {textField("subspecialty", "Subspecialty (optional)", "e.g. Interventional Cardiology")}
      {textField("license_number", "License number", "e.g. QCHP-12345")}

      <div>
        <label htmlFor="licensing_authority" className="block text-sm font-medium text-[#374151] mb-1">Licensing authority</label>
        <select
          id="licensing_authority"
          value={form.licensing_authority}
          onChange={(e) => setForm(f => ({ ...f, licensing_authority: e.target.value }))}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
        >
          <option value="">Select authority</option>
          {AUTHORITIES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="license_expiry" className="block text-sm font-medium text-[#374151] mb-1">License expiry date</label>
        <input
          id="license_expiry"
          type="date"
          value={form.license_expiry}
          onChange={(e) => setForm(f => ({ ...f, license_expiry: e.target.value }))}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
        />
      </div>

      {error && <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.push("/onboarding/2")} className="px-4 py-2 text-sm text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]">
          Back
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
