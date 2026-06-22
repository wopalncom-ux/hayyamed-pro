"use client";
import { useState, useRef } from "react";

type ProfileHit = { auth_id: string; full_name: string | null; profession: string | null; country_of_residence: string | null };

export default function ReportsSearchPage() {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<ProfileHit[]>([]);
  const [searching, setSearching] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (debounce.current) clearTimeout(debounce.current);
    if (!q.trim()) { setResults([]); return; }
    debounce.current = setTimeout(async () => {
      setSearching(true);
      const res = await fetch(`/api/admin/user-actions?q=${encodeURIComponent(q)}`);
      if (res.ok) { const j = await res.json(); setResults(j.data ?? []); }
      setSearching(false);
    }, 350);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Compliance Report Generator</h1>
        <p className="text-[#64748b] mt-1">Search for a user and generate their printable CME compliance report.</p>
      </div>

      <div className="max-w-xl">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, or profession…"
            className="w-full border border-[#e2e8f0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a56a0] bg-white shadow-sm"
          />
          {searching && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#94a3b8]">Searching…</span>}
        </div>

        {results.length > 0 && (
          <div className="mt-3 bg-white rounded-xl border border-[#e2e8f0] shadow-sm divide-y divide-[#f8fafc]">
            {results.map((r) => (
              <a
                key={r.auth_id}
                href={`/admin/reports/${r.auth_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-[#f8fafc] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center text-xs font-bold text-[#1a56a0] flex-shrink-0">
                  {(r.full_name ?? "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0f172a]">{r.full_name ?? "Unknown"}</p>
                  <p className="text-xs text-[#64748b] capitalize">{r.profession ?? "—"} · {r.country_of_residence ?? "—"}</p>
                </div>
                <span className="text-xs text-[#1a56a0] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  Open report →
                </span>
              </a>
            ))}
          </div>
        )}

        {query && results.length === 0 && !searching && (
          <p className="mt-3 text-sm text-[#64748b] text-center">No users found for &ldquo;{query}&rdquo;</p>
        )}
      </div>

      <div className="mt-10 p-5 bg-[#eff6ff] rounded-xl border border-[#bfdbfe] max-w-xl">
        <h2 className="text-xs font-semibold text-[#1d4ed8] mb-2">About Compliance Reports</h2>
        <ul className="text-xs text-[#374151] space-y-1">
          <li>• Reports open in a new tab — use browser Print → Save as PDF</li>
          <li>• Shows verified CME activities, credit totals, and compliance status</li>
          <li>• Employers can request reports for any linked staff member</li>
          <li>• Free users see a watermarked preview; Pro users get the clean version</li>
          <li>• Reports are generated in real-time from live database data</li>
        </ul>
      </div>
    </div>
  );
}
