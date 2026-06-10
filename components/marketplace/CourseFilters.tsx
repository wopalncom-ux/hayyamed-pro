"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

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
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Category pills */}
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

      {/* Separator */}
      <div className="w-full border-t border-[#f1f5f9]" />

      {/* Delivery mode */}
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

      {/* Free only toggle */}
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
  );
}
