"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { submitLinkRequest } from "@/app/(dashboard)/dashboard/settings/actions";

export default function AddEmployerForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<Array<{ id: string; name: string }>>([]);
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
  const [unverifiedName, setUnverifiedName] = useState("");
  const [showUnverified, setShowUnverified] = useState(false);
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
      .limit(6);
    setMatches(data ?? []);
    setSearching(false);
    if (!data?.length) setShowUnverified(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected && !unverifiedName.trim()) return;

    startTransition(async () => {
      const result = await submitLinkRequest({
        organizationId: selected?.id ?? null,
        unverifiedEmployerName: selected ? null : unverifiedName.trim(),
      });

      if (result.error) {
        toast(result.error, "error");
      } else {
        track("employer_link_requested", { verified_org: !!selected });
        toast("Employer link request submitted — pending admin approval.", "success");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
          placeholder="Search hospital or clinic name…"
          className="flex-1 px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0]"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2 bg-[#f0f4f8] text-[#1a56a0] text-sm rounded-lg border border-[#e2e8f0] hover:bg-[#e8f0fe] disabled:opacity-50 transition-colors"
        >
          {searching ? "…" : "Search"}
        </button>
      </div>

      {matches.length > 0 && (
        <div className="border border-[#e2e8f0] rounded-lg divide-y divide-[#e2e8f0] overflow-hidden">
          {matches.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => { setSelected(org); setMatches([]); setShowUnverified(false); }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#f0f4f8] text-[#111] transition-colors"
            >
              {org.name}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="flex items-center justify-between bg-[#e8f0fe] px-4 py-2.5 rounded-lg">
          <span className="text-sm font-medium text-[#1a56a0]">{selected.name}</span>
          <button type="button" onClick={() => setSelected(null)} className="text-xs text-[#64748b] hover:text-[#111]">
            Remove
          </button>
        </div>
      )}

      {showUnverified && !selected && (
        <div>
          <p className="text-xs text-[#64748b] mb-2">Not found? Enter your employer name — an admin will verify it.</p>
          <input
            type="text"
            value={unverifiedName}
            onChange={(e) => setUnverifiedName(e.target.value)}
            placeholder="Enter employer name"
            className="w-full px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0]"
          />
        </div>
      )}

      {(selected || (showUnverified && unverifiedName.trim())) && (
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#1a56a0] text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          {isPending ? "Submitting…" : "Submit link request"}
        </button>
      )}
    </form>
  );
}
