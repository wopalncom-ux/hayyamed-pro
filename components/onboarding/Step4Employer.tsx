"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";
import { submitLinkRequest } from "@/app/(dashboard)/dashboard/settings/actions";

export default function Step4Employer({ profile: _profile, userId }: { profile: Record<string, unknown> | null; userId: string; authorities?: unknown[] }) {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<Array<{ id: string; name: string }>>([]);
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
  const [unverifiedName, setUnverifiedName] = useState("");
  const [mode, setMode] = useState<"search" | "unverified" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSearch() {
    if (!search.trim()) return;
    setSearching(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("organizations")
      .select("id, name")
      .ilike("name", `%${search}%`)
      .limit(5);
    setMatches(data ?? []);
    setMode("search");
    setSearching(false);
  }

  async function advanceStep() {
    const supabase = createClient();
    await supabase.from("professional_profiles").update({ onboarding_step: 5 }).eq("auth_id", userId);
    router.push("/onboarding/5");
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError(null);

    if (!selected && !unverifiedName.trim()) {
      void advanceStep();
      return;
    }

    startTransition(async () => {
      const result = await submitLinkRequest({
        organizationId: selected?.id ?? null,
        unverifiedEmployerName: selected ? null : unverifiedName.trim(),
      });

      // "already active or pending" is fine during onboarding — just continue
      if (result.error && !result.error.includes("already have an active or pending")) {
        setError(result.error);
        return;
      }

      track("onboarding_step_completed", { step: 4, step_name: "employer", employer_linked: !!(selected || unverifiedName) });
      await advanceStep();
    });
  }

  async function handleSkip() {
    track("onboarding_step_completed", { step: 4, step_name: "employer", employer_linked: false, skipped: true });
    await advanceStep();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-[#111] mb-1">{t("step4.heading")}</h2>
      <p className="text-sm text-[#64748b] mb-4">{t("step4.subtitle")}</p>

      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleSearch(); } }}
          placeholder={t("step4.search_placeholder")}
          className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2 bg-[#f0f4f8] text-[#1a56a0] text-sm rounded-lg border border-[#e2e8f0] hover:bg-[#e8f0fe] disabled:opacity-50"
        >
          {searching ? "..." : t("step4.search_btn")}
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
          {t("step4.no_match")}{" "}
          <button type="button" onClick={() => setMode("unverified")} className="text-[#1a56a0] hover:underline">
            {t("step4.add_unverified")}
          </button>
        </div>
      )}

      {selected && (
        <div className="flex items-center justify-between bg-[#e8f0fe] px-4 py-3 rounded-lg">
          <span className="text-sm font-medium text-[#1a56a0]">{selected.name}</span>
          <button type="button" onClick={() => setSelected(null)} className="text-xs text-[#64748b] hover:text-[#111]">{t("step4.remove")}</button>
        </div>
      )}

      {mode === "unverified" && (
        <div>
          <label htmlFor="employer-unverified-name" className="block text-sm font-medium text-[#374151] mb-1">{t("step4.unverified_label")}</label>
          <input
            id="employer-unverified-name"
            type="text"
            value={unverifiedName}
            onChange={(e) => setUnverifiedName(e.target.value)}
            placeholder={t("step4.unverified_placeholder")}
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
          />
        </div>
      )}

      {error && <p className="text-sm text-[#dc2626] bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.push("/onboarding/3")} className="px-4 py-2 text-sm text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]">
          {t("back")}
        </button>
        <button type="button" onClick={handleSkip} className="px-4 py-2 text-sm text-[#64748b] hover:underline">
          {t("skip_for_now")}
        </button>
        <button type="submit" disabled={isPending} className="flex-1 bg-[#1a56a0] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors">
          {isPending ? t("saving") : t("continue")}
        </button>
      </div>
    </form>
  );
}
