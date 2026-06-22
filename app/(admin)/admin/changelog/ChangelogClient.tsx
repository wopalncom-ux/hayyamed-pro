"use client";
import { useState } from "react";

type ChangelogItem = { type: "feature" | "improvement" | "fix" | "security"; text: string };
type Entry = {
  id: string; version: string; title: string; summary: string | null;
  items: ChangelogItem[]; is_published: boolean; published_at: string | null; created_at: string;
};

const ITEM_COLORS: Record<string, string> = {
  feature:     "bg-[#dbeafe] text-[#1d4ed8]",
  improvement: "bg-[#dcfce7] text-[#15803d]",
  fix:         "bg-[#fef9c3] text-[#92400e]",
  security:    "bg-[#fee2e2] text-[#dc2626]",
};

const blank = { version: "", title: "", summary: "", items: [] as ChangelogItem[], is_published: false };

type Props = { initial: Entry[] };

export default function ChangelogClient({ initial }: Props) {
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [form, setForm]       = useState({ ...blank });
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [newItem, setNewItem] = useState<ChangelogItem>({ type: "feature", text: "" });

  const resetForm = () => { setForm({ ...blank }); setEditing(null); setShowForm(false); setError(null); };

  const openEdit = (e: Entry) => {
    setForm({ version: e.version, title: e.title, summary: e.summary ?? "", items: [...e.items], is_published: e.is_published });
    setEditing(e.id); setShowForm(true);
  };

  const addItem = () => {
    if (!newItem.text.trim()) return;
    setForm((p) => ({ ...p, items: [...p.items, { ...newItem }] }));
    setNewItem({ type: "feature", text: "" });
  };

  const removeItem = (i: number) => setForm((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    if (!form.version || !form.title || !form.items.length) {
      setError("Version, title, and at least one item are required."); return;
    }
    setSaving(true); setError(null);
    try {
      const payload = { ...form, summary: form.summary || null };
      if (editing) {
        const res = await fetch(`/api/admin/changelog?id=${editing}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setEntries((prev) => prev.map((e) => e.id === editing ? json.data : e));
      } else {
        const res = await fetch("/api/admin/changelog", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setEntries((prev) => [json.data, ...prev]);
      }
      resetForm();
    } catch (e) { setError((e as Error).message); }
    setSaving(false);
  };

  const handlePublishToggle = async (id: string, publish: boolean) => {
    const res = await fetch(`/api/admin/changelog?id=${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: publish, published_at: publish ? new Date().toISOString() : null }),
    });
    if (res.ok) setEntries((prev) => prev.map((e) => e.id === id ? { ...e, is_published: publish, published_at: publish ? new Date().toISOString() : null } : e));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this changelog entry?")) return;
    const res = await fetch(`/api/admin/changelog?id=${id}`, { method: "DELETE" });
    if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      {!showForm && (
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-[#1a56a0] text-white text-sm font-medium rounded-xl hover:bg-[#1547a0]">
          + New Release Entry
        </button>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-[#0f172a]">{editing ? "Edit Entry" : "New Changelog Entry"}</h2>
            <button onClick={resetForm} className="text-[#94a3b8] hover:text-[#374151] text-xl">×</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Version <span className="text-[#94a3b8]">e.g. v1.4.0</span></label>
              <input value={form.version} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))}
                placeholder="v1.0.0"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm font-mono outline-none focus:border-[#1a56a0]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#374151] mb-1">Release Title</label>
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. CPD Tracker + Saudi CME Rules"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#374151] mb-1">Summary <span className="text-[#94a3b8]">(optional)</span></label>
              <input value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                placeholder="One-line summary shown in the What's New widget"
                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1a56a0]" />
            </div>
          </div>

          {/* Items list */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#374151] mb-2">Release Items</label>
            <div className="space-y-2 mb-3">
              {form.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 capitalize ${ITEM_COLORS[item.type]}`}>{item.type}</span>
                  <span className="text-xs text-[#374151] flex-1">{item.text}</span>
                  <button onClick={() => removeItem(i)} className="text-[#94a3b8] hover:text-[#dc2626] text-sm">×</button>
                </div>
              ))}
              {form.items.length === 0 && <p className="text-xs text-[#94a3b8]">No items yet — add below</p>}
            </div>
            <div className="flex gap-2">
              <select value={newItem.type} onChange={(e) => setNewItem((p) => ({ ...p, type: e.target.value as ChangelogItem["type"] }))}
                className="text-xs border border-[#e2e8f0] rounded-lg px-2 py-2 outline-none focus:border-[#1a56a0] capitalize">
                {["feature", "improvement", "fix", "security"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input value={newItem.text} onChange={(e) => setNewItem((p) => ({ ...p, text: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                placeholder="Describe this change…"
                className="flex-1 text-xs border border-[#e2e8f0] rounded-lg px-3 py-2 outline-none focus:border-[#1a56a0]" />
              <button onClick={addItem} className="px-3 py-2 bg-[#f0f4f8] text-[#374151] text-xs rounded-lg hover:bg-[#e2e8f0]">+ Add</button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
              className="accent-[#1a56a0]" />
            <span className="text-xs text-[#374151]">Publish immediately (visible to all users)</span>
          </label>

          {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2.5 bg-[#1a56a0] text-white text-sm font-medium rounded-xl hover:bg-[#1547a0] disabled:opacity-50">
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Entry"}
            </button>
            <button onClick={resetForm} className="px-5 py-2.5 border border-[#e2e8f0] text-[#64748b] text-sm rounded-xl hover:bg-[#f8fafc]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Entry list */}
      {entries.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#e2e8f0]">
          <p className="text-3xl mb-3">📝</p>
          <p className="text-[#64748b] text-sm">No changelog entries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((e) => (
            <div key={e.id} className={`bg-white rounded-xl border p-5 ${e.is_published ? "border-[#e2e8f0]" : "border-dashed border-[#d1d5db] opacity-70"}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono font-bold text-[#1a56a0] bg-[#eff6ff] px-2 py-0.5 rounded">{e.version}</span>
                    <h3 className="text-sm font-semibold text-[#0f172a]">{e.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${e.is_published ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f1f5f9] text-[#64748b]"}`}>
                      {e.is_published ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </div>
                  {e.summary && <p className="text-xs text-[#64748b] mb-2">{e.summary}</p>}
                  <div className="flex flex-wrap gap-1.5">
                    {(e.items as ChangelogItem[]).map((item, i) => (
                      <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ITEM_COLORS[item.type]}`}>
                        {item.type}: {item.text}
                      </span>
                    ))}
                  </div>
                  {e.published_at && (
                    <p className="text-[10px] text-[#94a3b8] mt-2">
                      Published {new Date(e.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handlePublishToggle(e.id, !e.is_published)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${e.is_published ? "border-[#d97706] text-[#d97706] hover:bg-amber-50" : "border-[#16a34a] text-[#16a34a] hover:bg-green-50"}`}>
                    {e.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => openEdit(e)} className="text-xs px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-[#374151] hover:bg-[#f0f4f8]">Edit</button>
                  <button onClick={() => handleDelete(e.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
