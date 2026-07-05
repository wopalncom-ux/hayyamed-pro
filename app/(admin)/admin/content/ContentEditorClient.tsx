"use client";
import { useState, useCallback } from "react";

type ContentRow = {
  id: string;
  page_key: string;
  section_key: string;
  field_key: string;
  content_type: string;
  content_value: string | null;
  notes: string | null;
  updated_at: string;
};

type Props = {
  initial: ContentRow[];
  pages: string[];
};

const PAGE_LABELS: Record<string, string> = {
  landing: "Landing Page",
  about: "About Page",
  pricing: "Pricing Page",
  specialties: "Specialties Directory",
  contact: "Contact Page",
  help: "Help & Support",
  global: "Global / Company Info",
};

export default function ContentEditorClient({ initial, pages }: Props) {
  const [rows, setRows] = useState<ContentRow[]>(initial);
  const [activePage, setActivePage] = useState(pages[0] ?? "landing");
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Add new field state
  const [showAdd, setShowAdd] = useState(false);
  const [newField, setNewField] = useState({
    page_key: activePage,
    section_key: "",
    field_key: "",
    content_type: "text",
    content_value: "",
    notes: "",
  });

  const pageRows = rows.filter((r) => r.page_key === activePage);

  const grouped = pageRows.reduce<Record<string, ContentRow[]>>((acc, row) => {
    acc[row.section_key] = acc[row.section_key] ?? [];
    acc[row.section_key].push(row);
    return acc;
  }, {});

  const handleChange = useCallback((id: string, value: string) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, content_value: value } : r));
  }, []);

  const handleSave = async (row: ContentRow) => {
    setSaving(row.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_key: row.page_key,
          section_key: row.section_key,
          field_key: row.field_key,
          content_value: row.content_value ?? "",
          content_type: row.content_type,
          notes: row.notes,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const { data } = await res.json();
      setRows((prev) => prev.map((r) => r.id === row.id ? { ...r, ...data } : r));
      setSaved(row.id);
      setTimeout(() => setSaved(null), 2000);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (row: ContentRow) => {
    if (!confirm(`Delete "${row.page_key}.${row.section_key}.${row.field_key}"?`)) return;
    const res = await fetch(`/api/admin/content?id=${row.id}`, { method: "DELETE" });
    if (res.ok) setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleAddField = async () => {
    if (!newField.section_key || !newField.field_key) {
      setError("Section and field key are required");
      return;
    }
    setSaving("new");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newField, page_key: activePage }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const { data } = await res.json();
      setRows((prev) => [...prev, data]);
      setNewField({ page_key: activePage, section_key: "", field_key: "", content_type: "text", content_value: "", notes: "" });
      setShowAdd(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      {/* Page tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setActivePage(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activePage === p
                ? "bg-[#1a56a0] text-white"
                : "bg-white border border-[#e2e8f0] text-[#64748b] hover:border-[#1a56a0] hover:text-[#1a56a0]"
            }`}
          >
            {PAGE_LABELS[p] ?? p}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      {/* Content sections */}
      {Object.entries(grouped).map(([section, sectionRows]) => (
        <div key={section} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-semibold text-[#1a56a0] uppercase tracking-wider">{section}</h3>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>
          <div className="space-y-4">
            {sectionRows.map((row) => (
              <div key={row.id} className="bg-white border border-[#e2e8f0] rounded-xl p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-xs font-mono bg-[#f0f4f8] px-2 py-0.5 rounded text-[#1a56a0]">
                      {row.field_key}
                    </span>
                    <span className="ml-2 text-xs text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded">
                      {row.content_type}
                    </span>
                    {row.notes && (
                      <span className="ml-2 text-xs text-[#64748b] italic">{row.notes}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(row)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>

                {row.content_type === "html" ? (
                  <textarea
                    value={row.content_value ?? ""}
                    onChange={(e) => handleChange(row.id, e.target.value)}
                    rows={4}
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm font-mono text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent"
                  />
                ) : (
                  <textarea
                    value={row.content_value ?? ""}
                    onChange={(e) => handleChange(row.id, e.target.value)}
                    rows={row.content_value && row.content_value.length > 80 ? 3 : 2}
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#1a56a0] focus:border-transparent resize-none"
                  />
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[#64748b]">
                    Last updated: {new Date(row.updated_at).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <button
                    onClick={() => handleSave(row)}
                    disabled={saving === row.id}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      saved === row.id
                        ? "bg-green-500 text-white"
                        : "bg-[#1a56a0] text-white hover:bg-[#1547a0]"
                    } disabled:opacity-50`}
                  >
                    {saving === row.id ? "Saving…" : saved === row.id ? "Saved ✓" : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {pageRows.length === 0 && (
        <div className="text-center py-12 text-[#64748b]">
          No content fields for this page yet. Add the first one below.
        </div>
      )}

      {/* Add new field */}
      <div className="mt-6">
        {!showAdd ? (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-3 border-2 border-dashed border-[#e2e8f0] rounded-xl text-sm text-[#64748b] hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors"
          >
            + Add Content Field
          </button>
        ) : (
          <div className="bg-white border border-[#1a56a0] rounded-xl p-5">
            <h4 className="text-sm font-semibold text-[#0f172a] mb-4">Add New Field</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-[#64748b] mb-1 block">Section Key</label>
                <input
                  value={newField.section_key}
                  onChange={(e) => setNewField((p) => ({ ...p, section_key: e.target.value }))}
                  placeholder="hero, features, cta…"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                />
              </div>
              <div>
                <label className="text-xs text-[#64748b] mb-1 block">Field Key</label>
                <input
                  value={newField.field_key}
                  onChange={(e) => setNewField((p) => ({ ...p, field_key: e.target.value }))}
                  placeholder="headline, subtext, button_text…"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-[#64748b] mb-1 block">Content Type</label>
                <select
                  value={newField.content_type}
                  onChange={(e) => setNewField((p) => ({ ...p, content_type: e.target.value }))}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                >
                  <option value="text">text</option>
                  <option value="html">html</option>
                  <option value="url">url</option>
                  <option value="image_url">image_url</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#64748b] mb-1 block">Notes (optional)</label>
                <input
                  value={newField.notes}
                  onChange={(e) => setNewField((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Internal description…"
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs text-[#64748b] mb-1 block">Content Value</label>
              <textarea
                value={newField.content_value}
                onChange={(e) => setNewField((p) => ({ ...p, content_value: e.target.value }))}
                rows={3}
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddField}
                disabled={saving === "new"}
                className="px-4 py-2 bg-[#1a56a0] text-white rounded-lg text-sm font-medium hover:bg-[#1547a0] disabled:opacity-50"
              >
                {saving === "new" ? "Adding…" : "Add Field"}
              </button>
              <button
                onClick={() => { setShowAdd(false); setError(null); }}
                className="px-4 py-2 border border-[#e2e8f0] text-[#64748b] rounded-lg text-sm hover:bg-[#f8fafc]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
