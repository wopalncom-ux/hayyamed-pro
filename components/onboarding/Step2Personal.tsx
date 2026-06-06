"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NATIONALITIES = ["Qatari", "Saudi", "Emirati", "Jordanian", "Egyptian", "Lebanese", "Syrian", "Indian", "Pakistani", "Filipino", "British", "American", "Other"];

export default function Step2Personal({ profile, userId }: { profile: Record<string, unknown> | null; userId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: String(profile?.full_name ?? ""),
    date_of_birth: String(profile?.date_of_birth ?? ""),
    nationality: String(profile?.nationality ?? ""),
    country_of_residence: String(profile?.country_of_residence ?? "Qatar"),
    mobile: String(profile?.mobile ?? ""),
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
      .update({ ...form, onboarding_step: 3 })
      .eq("auth_id", userId);

    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/onboarding/3");
  }

  const field = (id: string, label: string, type = "text", placeholder = "") => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#374151] mb-1">{label}</label>
      <input
        id={id}
        type={type}
        value={form[id as keyof typeof form]}
        onChange={(e) => setForm(f => ({ ...f, [id]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#111] mb-2">Personal Information</h2>
      {field("full_name", "Full name", "text", "Dr. First Last")}
      {field("date_of_birth", "Date of birth", "date")}
      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-[#374151] mb-1">Nationality</label>
        <select
          id="nationality"
          value={form.nationality}
          onChange={(e) => setForm(f => ({ ...f, nationality: e.target.value }))}
          className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
        >
          <option value="">Select nationality</option>
          {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      {field("country_of_residence", "Country of residence", "text", "Qatar")}
      {field("mobile", "Mobile number", "tel", "+974 XXXX XXXX")}

      {error && <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.push("/onboarding/1")} className="px-4 py-2 text-sm text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]">
          Back
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
