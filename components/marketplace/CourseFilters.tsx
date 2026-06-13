"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const CATEGORIES = [
  "All",
  "Cardiology",
  "Oncology",
  "Pediatrics",
  "Surgery",
  "Nursing",
  "Pharmacy",
  "Emergency Medicine",
  "Radiology",
  "Mental Health",
  "Patient Safety",
  "Ethics",
  "Other",
];

const DELIVERY_MODES = [
  { value: "", label: "All Formats" },
  { value: "online", label: "Online" },
  { value: "in_person", label: "In Person" },
  { value: "hybrid", label: "Hybrid" },
];

export default function CourseFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const activeCategory = params.get("category") ?? "All";
  const activeMode = params.get("mode") ?? "";
  const activeFree = params.get("free") === "1";

  const [searchInput, setSearchInput] = useState(params.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Read current URL at fire-time to preserve category/mode/free
      const p = new URLSearchParams(window.location.search);
      if (value.trim()) {
        p.set("q", value.trim());
      } else {
        p.delete("q");
      }
      router.push(`/dashboard/marketplace?${p.toString()}`);
    }, 350);
  }

  const update = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(params.toString());
      if (value) {
        p.set(key, value);
      } else {
        p.delete(key);
      }
      router.push(`/dashboard/marketplace?${p.toString()}`);
    },
    [params, router]
  );

  return (
    <div className="mb-6 space-y-4">
      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8] pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
        </svg>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search courses by title…"
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30 focus:border-[#1a56a0] placeholder-[#94a3b8] transition-colors"
        />
        {searchInput && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#374151] transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category pills + delivery mode + free toggle */}
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => update("category", cat === "All" ? "" : cat)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat || (cat === "All" && activeCategory === "All")
                  ? "bg-[#1a56a0] text-white border-[#1a56a0]"
                  : "bg-white text-[#374151] border-[#e2e8f0] hover:border-[#1a56a0] hover:text-[#1a56a0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full border-t border-[#f1f5f9]" />

        <div className="flex gap-2">
          {DELIVERY_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => update("mode", m.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeMode === m.value
                  ? "bg-[#374151] text-white border-[#374151]"
                  : "bg-white text-[#374151] border-[#e2e8f0] hover:border-[#374151]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => update("free", activeFree ? "" : "1")}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            activeFree
              ? "bg-[#dcfce7] text-[#16a34a] border-[#16a34a]"
              : "bg-white text-[#374151] border-[#e2e8f0] hover:border-[#16a34a] hover:text-[#16a34a]"
          }`}
        >
          Free only
        </button>
      </div>
    </div>
  );
}
