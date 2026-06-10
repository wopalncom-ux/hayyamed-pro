"use client";

import { useState, useRef } from "react";

const DEPT_SUGGESTIONS = [
  "Emergency", "Cardiology", "Oncology", "Pediatrics", "Surgery",
  "Nursing", "Pharmacy", "Radiology", "ICU", "Obstetrics",
  "Orthopedics", "Neurology", "Psychiatry", "Administration",
];

export default function AssignDepartmentButton({
  linkId,
  initialDepartment,
}: {
  linkId: string;
  initialDepartment: string | null;
}) {
  const [dept, setDept] = useState(initialDepartment ?? "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialDepartment ?? "");
  const [saving, setSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = draft.length > 0
    ? DEPT_SUGGESTIONS.filter((d) => d.toLowerCase().startsWith(draft.toLowerCase()) && d !== draft)
    : [];

  function openEditor() {
    setDraft(dept);
    setEditing(true);
    setShowSuggestions(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function save(value: string) {
    setSaving(true);
    setShowSuggestions(false);
    try {
      await fetch("/api/employer/department", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link_id: linkId, department: value || null }),
      });
      setDept(value);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); save(draft); }
    if (e.key === "Escape") { setEditing(false); setDraft(dept); setShowSuggestions(false); }
  }

  if (!editing) {
    return (
      <button
        onClick={openEditor}
        className="text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors border border-dashed border-[#cbd5e1] hover:border-[#1a56a0] rounded px-2 py-0.5 whitespace-nowrap"
      >
        {dept || "Assign dept"}
      </button>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => { setDraft(e.target.value); setShowSuggestions(true); }}
        onKeyDown={handleKeyDown}
        onBlur={() => { setTimeout(() => { setEditing(false); setShowSuggestions(false); }, 150); }}
        placeholder="Department…"
        disabled={saving}
        className="text-xs border border-[#1a56a0] rounded px-2 py-0.5 w-28 outline-none bg-white text-[#111]"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-lg min-w-max">
          {suggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              onMouseDown={(e) => { e.preventDefault(); save(s); }}
              className="block w-full text-left text-xs px-3 py-1.5 hover:bg-[#f0f7ff] text-[#374151]"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
