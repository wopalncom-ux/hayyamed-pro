"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Authority {
  id: string;
  abbreviation: string;
  authority_name: string;
}

interface Category {
  id: string;
  country_code: string;
  authority_id: string | null;
  category_name: string;
  max_credits_per_cycle: number | null;
  min_credits_per_cycle: number;
  credits_per_hour: number;
  accreditation_required: boolean;
  notes: string | null;
}

interface Props {
  countryCode: string;
  categories: Category[];
  authorities: Authority[];
}

const CATEGORY_OPTIONS = [
  "conference", "online", "workshop", "journal", "teaching",
  "simulation", "mandatory", "patient_safety", "other",
];

function CategoryRow({
  cat,
  authorities,
  onSaved,
  onDeleted,
}: {
  cat: Category;
  authorities: Authority[];
  onSaved: () => void;
  onDeleted: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    max_credits_per_cycle: cat.max_credits_per_cycle ?? "",
    min_credits_per_cycle: cat.min_credits_per_cycle,
    credits_per_hour: cat.credits_per_hour,
    accreditation_required: cat.accreditation_required,
    notes: cat.notes ?? "",
    authority_id: cat.authority_id ?? "",
  });

  function setField(key: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/activity-categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        max_credits_per_cycle: form.max_credits_per_cycle === "" ? null : Number(form.max_credits_per_cycle),
        authority_id: form.authority_id || null,
        notes: form.notes || null,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Save failed");
    } else {
      setSaved(true);
      setEditing(false);
      onSaved();
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${cat.category_name}" category?`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/activity-categories/${cat.id}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      onDeleted(cat.id);
    }
  }

  const inputClass = "text-sm border border-[#e2e8f0] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1a56a0]/30 focus:border-[#1a56a0] transition-colors w-full";

  if (!editing) {
    return (
      <tr className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc]">
        <td className="px-4 py-3 text-sm font-medium text-[#111] capitalize">
          {cat.category_name.replace("_", " ")}
        </td>
        <td className="px-4 py-3 text-sm text-center text-[#374151]">
          {cat.min_credits_per_cycle > 0 ? (
            <span className="text-[#d97706] font-medium">{cat.min_credits_per_cycle} min</span>
          ) : "—"}
        </td>
        <td className="px-4 py-3 text-sm text-center text-[#374151]">
          {cat.max_credits_per_cycle != null ? cat.max_credits_per_cycle : <span className="text-[#94a3b8]">No cap</span>}
        </td>
        <td className="px-4 py-3 text-sm text-center text-[#374151]">{cat.credits_per_hour}</td>
        <td className="px-4 py-3 text-center">
          {cat.accreditation_required ? (
            <span className="text-xs bg-[#eff6ff] text-[#1a56a0] font-medium px-2 py-0.5 rounded-full">Required</span>
          ) : (
            <span className="text-xs text-[#94a3b8]">Optional</span>
          )}
        </td>
        <td className="px-4 py-3 text-xs text-[#64748b] max-w-[200px] truncate">{cat.notes ?? "—"}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2 justify-end">
            {saved && <span className="text-xs text-[#16a34a]">Saved</span>}
            <button onClick={() => setEditing(true)} className="text-xs text-[#1a56a0] hover:underline">Edit</button>
            <button onClick={handleDelete} disabled={loading} className="text-xs text-[#dc2626] hover:underline disabled:opacity-40">Delete</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-[#f1f5f9] bg-[#eff6ff]/30">
      <td className="px-4 py-3 text-sm font-medium text-[#111] capitalize">
        {cat.category_name.replace("_", " ")}
      </td>
      <td className="px-4 py-2">
        <input type="number" min="0" className={inputClass} value={form.min_credits_per_cycle}
          onChange={(e) => setField("min_credits_per_cycle", Number(e.target.value))} />
      </td>
      <td className="px-4 py-2">
        <input type="number" min="0" className={inputClass} value={form.max_credits_per_cycle}
          onChange={(e) => setField("max_credits_per_cycle", e.target.value)}
          placeholder="No cap" />
      </td>
      <td className="px-4 py-2">
        <input type="number" min="0" step="0.1" className={inputClass} value={form.credits_per_hour}
          onChange={(e) => setField("credits_per_hour", Number(e.target.value))} />
      </td>
      <td className="px-4 py-2 text-center">
        <input type="checkbox" checked={form.accreditation_required}
          onChange={(e) => setField("accreditation_required", e.target.checked)}
          className="w-4 h-4 accent-[#1a56a0]" />
      </td>
      <td className="px-4 py-2">
        <input className={inputClass} value={form.notes}
          onChange={(e) => setField("notes", e.target.value)} placeholder="Notes…" />
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-xs bg-[#1a56a0] text-white px-2.5 py-1 rounded hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
          >
            {loading ? "…" : "Save"}
          </button>
          <button onClick={() => setEditing(false)} className="text-xs text-[#64748b] hover:text-[#111]">Cancel</button>
        </div>
        {error && <p className="text-xs text-[#dc2626] mt-1">{error}</p>}
      </td>
    </tr>
  );
}

export default function CategoryRulesTable({ countryCode, categories, authorities }: Props) {
  const router = useRouter();
  const [cats, setCats] = useState(categories);
  const [adding, setAdding] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [newForm, setNewForm] = useState({
    category_name: "other",
    min_credits_per_cycle: 0,
    max_credits_per_cycle: "",
    credits_per_hour: 1,
    accreditation_required: false,
    notes: "",
  });

  function setNewField(key: string, value: string | number | boolean) {
    setNewForm((f) => ({ ...f, [key]: value }));
  }

  async function handleAdd() {
    setAddLoading(true);
    setAddError(null);
    const res = await fetch("/api/admin/activity-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country_code: countryCode,
        ...newForm,
        max_credits_per_cycle: newForm.max_credits_per_cycle === "" ? null : Number(newForm.max_credits_per_cycle),
        notes: newForm.notes || null,
      }),
    });
    const data = await res.json();
    setAddLoading(false);
    if (!res.ok) {
      setAddError(data.error ?? "Failed");
    } else {
      setAdding(false);
      setNewForm({ category_name: "other", min_credits_per_cycle: 0, max_credits_per_cycle: "", credits_per_hour: 1, accreditation_required: false, notes: "" });
      router.refresh();
    }
  }

  const inputClass = "text-sm border border-[#e2e8f0] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1a56a0]/30 focus:border-[#1a56a0] transition-colors w-full";

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
        <p className="text-sm font-medium text-[#111]">{cats.length} categories configured</p>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-sm font-medium text-[#1a56a0] hover:underline"
        >
          {adding ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {cats.length === 0 && !adding ? (
        <div className="px-6 py-10 text-center text-sm text-[#64748b]">
          No activity categories yet. Add one above.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-4 py-2 text-xs font-medium text-[#64748b] uppercase tracking-wide">Category</th>
                <th className="px-4 py-2 text-xs font-medium text-[#64748b] uppercase tracking-wide text-center">Min</th>
                <th className="px-4 py-2 text-xs font-medium text-[#64748b] uppercase tracking-wide text-center">Max</th>
                <th className="px-4 py-2 text-xs font-medium text-[#64748b] uppercase tracking-wide text-center">Cr/Hr</th>
                <th className="px-4 py-2 text-xs font-medium text-[#64748b] uppercase tracking-wide text-center">Accred.</th>
                <th className="px-4 py-2 text-xs font-medium text-[#64748b] uppercase tracking-wide">Notes</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {cats.map((cat) => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  authorities={authorities}
                  onSaved={() => router.refresh()}
                  onDeleted={(id) => setCats((c) => c.filter((x) => x.id !== id))}
                />
              ))}

              {adding && (
                <tr className="border-b border-[#f1f5f9] bg-[#dcfce7]/20">
                  <td className="px-4 py-2">
                    <select className={inputClass} value={newForm.category_name}
                      onChange={(e) => setNewField("category_name", e.target.value)}>
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c.replace("_", " ")}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min="0" className={inputClass} value={newForm.min_credits_per_cycle}
                      onChange={(e) => setNewField("min_credits_per_cycle", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min="0" className={inputClass} value={newForm.max_credits_per_cycle}
                      onChange={(e) => setNewField("max_credits_per_cycle", e.target.value)} placeholder="No cap" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min="0" step="0.1" className={inputClass} value={newForm.credits_per_hour}
                      onChange={(e) => setNewField("credits_per_hour", Number(e.target.value))} />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input type="checkbox" checked={newForm.accreditation_required}
                      onChange={(e) => setNewField("accreditation_required", e.target.checked)}
                      className="w-4 h-4 accent-[#1a56a0]" />
                  </td>
                  <td className="px-4 py-2">
                    <input className={inputClass} value={newForm.notes}
                      onChange={(e) => setNewField("notes", e.target.value)} placeholder="Notes…" />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={handleAdd}
                      disabled={addLoading}
                      className="text-xs bg-[#16a34a] text-white px-2.5 py-1 rounded hover:bg-[#15803d] disabled:opacity-60 transition-colors"
                    >
                      {addLoading ? "…" : "Add"}
                    </button>
                    {addError && <p className="text-xs text-[#dc2626] mt-1">{addError}</p>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
