"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Step4Employer({ profile, userId }: { profile: Record<string, unknown> | null; userId: string; authorities?: unknown[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<Array<{ id: string; name: string }>>([]);
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
  const [unverifiedName, setUnverifiedName] = useState("");
  const [mode, setMode] = useState<"search" | "unverified" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!search.trim()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("organizations")
      .select("id, name")
      .ilike("name", `%${search}%`)
      .limit(5);
    setMatches(data ?? []);
    setMode("search");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (selected) {
      const { error } = await supabase.from("employer_link_requests").insert({
        professional_id: userId,
        organization_id: selected.id,
        status: "pending",
      });
      if (error) { setError(error.message); setLoading(false); return; }
    } else if (unverifiedName) {
      const { error } = await supabase.from("employer_link_requests").insert({
        professional_id: userId,
        unverified_employer_name: unverifiedName,
        status: "pending",
      });
      if (error) { setError(error.message); setLoading(false); return; }
    }

    await supabase.from("professional_profiles").update({ onboarding_step: 5 }).eq("auth_id", userId);
    router.push("/onboarding/5");
  }

  async function handleSkip() {
    const supabase = createClient();
    await supabase.from("professional_profiles").update({ onboarding_step: 5 }).eq("auth_id", userId);
    router.push("/onboarding/5");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#111] mb-1">Employer Linking</h2>
      <p className="text-sm text-[#64748b] mb-4">
        Link to your employer so they can view your compliance status (based on your privacy settings).
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hospital or clinic name..."
          className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-[#f0f4f8] text-[#1a56a0] text-sm rounded-lg border border-[#e2e8f0] hover:bg-[#e8f0fe]"
        >
          Search
        </button>
      </div>

      {mode === "search" && matches.length > 0 && (
        <div className="border border-[#e2e8f0] rounded-lg divide-y divide-[#e2e8f0]">
          {matches.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => { setSelected(org); setMode(null); }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-[#f0f4f8] transition-colors ${selected?.id === org.id ? "bg-[#e8f0fe] text-[#1a56a0]" : "text-[#111]"}`}
            >
              {org.name}
            </button>
          ))}
        </div>
      )}

      {mode === "search" && matches.length === 0 && (
        <div className="text-sm text-[#64748b]">
          No match found.{" "}
          <button type="button" onClick={() => setMode("unverified")} className="text-[#1a56a0] hover:underline">
            Add as unverified employer
          </button>
        </div>
      )}

      {selected && (
        <div className="flex items-center justify-between bg-[#e8f0fe] px-4 py-3 rounded-lg">
          <span className="text-sm font-medium text-[#1a56a0]">{selected.name}</span>
          <button type="button" onClick={() => setSelected(null)} className="text-xs text-[#64748b] hover:text-[#111]">Remove</button>
        </div>
      )}

      {mode === "unverified" && (
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Employer name (will be reviewed by admin)</label>
          <input
            type="text"
            value={unverifiedName}
            onChange={(e) => setUnverifiedName(e.target.value)}
            placeholder="Enter your employer's name"
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
          />
        </div>
      )}

      {error && <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.push("/onboarding/3")} className="px-4 py-2 text-sm text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]">
          Back
        </button>
        <button type="button" onClick={handleSkip} className="px-4 py-2 text-sm text-[#64748b] hover:underline">
          Skip for now
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
