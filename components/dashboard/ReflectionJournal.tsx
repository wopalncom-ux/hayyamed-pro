"use client";

import { useState, useEffect, useCallback } from "react";

type ReflectionActivity = { title: string; credits: number; activity_date: string } | null;

type Reflection = {
  id: string;
  reflection_date: string;
  reflection_type: string;
  what_learned: string;
  how_applied: string | null;
  impact_on_practice: string | null;
  further_learning: string | null;
  created_at: string;
  cme_activity_id: string | null;
  cme_activities: ReflectionActivity;
};

type Activity = { id: string; title: string; activity_date: string; credits: number };

const TYPE_META: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  learning:          { label: "Learning",         bg: "#e8f0fe", text: "#1a56a0", icon: "📖" },
  practice_change:   { label: "Practice Change",  bg: "#f0fdf4", text: "#16a34a", icon: "🔄" },
  significant_event: { label: "Significant Event",bg: "#fef3c7", text: "#d97706", icon: "⭐" },
  feedback:          { label: "Feedback",          bg: "#fce7f3", text: "#be185d", icon: "💬" },
  research:          { label: "Research",          bg: "#f3e8ff", text: "#7c3aed", icon: "🔬" },
};

const BLANK_FORM = {
  reflection_date: new Date().toISOString().slice(0, 10),
  reflection_type: "learning" as Reflection["reflection_type"],
  cme_activity_id: "" as string,
  what_learned: "",
  how_applied: "",
  impact_on_practice: "",
  further_learning: "",
};

export default function ReflectionJournal({ activities }: { activities: Activity[] }) {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/cme/reflections");
      if (res.ok) {
        const data = await res.json();
        setReflections(data.reflections ?? []);
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/cme/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cme_activity_id: form.cme_activity_id || null,
          how_applied: form.how_applied || null,
          impact_on_practice: form.impact_on_practice || null,
          further_learning: form.further_learning || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setSaveError(err.error ?? "Failed to save — please try again.");
        return;
      }
      setShowModal(false);
      setForm(BLANK_FORM);
      await load();
    } catch {
      setSaveError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this reflection? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`/api/cme/reflections/${id}`, { method: "DELETE" });
      setReflections((prev) => prev.filter((r) => r.id !== id));
      if (expanded === id) setExpanded(null);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#64748b]">
            {reflections.length} reflection{reflections.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <button
          onClick={() => { setShowModal(true); setSaveError(null); setForm(BLANK_FORM); }}
          className="flex items-center gap-1.5 text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-xl hover:bg-[#1547a0] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Reflection
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3 flex items-start gap-3">
        <svg className="w-4 h-4 text-[#1a56a0] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <p className="text-xs text-[#1e40af] leading-relaxed">
          Reflective practice journals are required for GMC revalidation, AHPRA CPD portfolios, and NMC revalidation.
          Link reflections to your CME activities to build a complete evidence portfolio.
        </p>
      </div>

      {/* List */}
      {loadingList ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#f1f5f9] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reflections.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <div className="w-12 h-12 bg-[#f0f4f8] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-sm font-semibold text-[#111] mb-1.5">No reflections yet</h3>
          <p className="text-sm text-[#64748b] max-w-xs mx-auto mb-5">
            Start your reflective practice journal. Link reflections to CME activities to build your revalidation portfolio.
          </p>
          <button
            onClick={() => { setShowModal(true); setSaveError(null); setForm(BLANK_FORM); }}
            className="text-sm font-semibold text-[#1a56a0] hover:underline"
          >
            Write your first reflection →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reflections.map((r) => {
            const meta = TYPE_META[r.reflection_type] ?? TYPE_META.learning;
            const isExpanded = expanded === r.id;
            return (
              <div key={r.id} className="bg-white rounded-xl border border-[#e2e8f0]">
                <button
                  className="w-full text-left px-5 py-4"
                  onClick={() => setExpanded(isExpanded ? null : r.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-xl mt-0.5 flex-shrink-0">{meta.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: meta.bg, color: meta.text }}>
                            {meta.label}
                          </span>
                          <span className="text-xs text-[#94a3b8]">{r.reflection_date}</span>
                          {r.cme_activities && (
                            <span className="text-xs bg-[#f1f5f9] text-[#374151] px-2 py-0.5 rounded-full truncate max-w-[160px]">
                              🔗 {(r.cme_activities as { title: string }).title}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#374151] line-clamp-2 text-left">{r.what_learned}</p>
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 text-[#94a3b8] flex-shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 border-t border-[#f1f5f9] space-y-3">
                    <div className="pt-3">
                      <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-1">What I learned</p>
                      <p className="text-sm text-[#374151] whitespace-pre-wrap">{r.what_learned}</p>
                    </div>
                    {r.how_applied && (
                      <div>
                        <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-1">How I applied it</p>
                        <p className="text-sm text-[#374151] whitespace-pre-wrap">{r.how_applied}</p>
                      </div>
                    )}
                    {r.impact_on_practice && (
                      <div>
                        <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-1">Impact on practice</p>
                        <p className="text-sm text-[#374151] whitespace-pre-wrap">{r.impact_on_practice}</p>
                      </div>
                    )}
                    {r.further_learning && (
                      <div>
                        <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-1">Further learning needed</p>
                        <p className="text-sm text-[#374151] whitespace-pre-wrap">{r.further_learning}</p>
                      </div>
                    )}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deleting === r.id}
                        className="text-xs text-[#dc2626] hover:underline disabled:opacity-50"
                      >
                        {deleting === r.id ? "Deleting…" : "Delete reflection"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New reflection modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-base font-semibold text-[#111]">New Reflection</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-[#f8fafc] transition-colors" aria-label="Close">
                <svg className="w-5 h-5 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rf-date" className="block text-xs font-semibold text-[#374151] mb-1">Date</label>
                  <input
                    id="rf-date"
                    type="date"
                    value={form.reflection_date}
                    onChange={(e) => setForm((f) => ({ ...f, reflection_date: e.target.value }))}
                    className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rf-type" className="block text-xs font-semibold text-[#374151] mb-1">Type</label>
                  <select
                    id="rf-type"
                    value={form.reflection_type}
                    onChange={(e) => setForm((f) => ({ ...f, reflection_type: e.target.value }))}
                    className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                  >
                    <option value="learning">Learning</option>
                    <option value="practice_change">Practice Change</option>
                    <option value="significant_event">Significant Event</option>
                    <option value="feedback">Feedback</option>
                    <option value="research">Research</option>
                  </select>
                </div>
              </div>

              {activities.length > 0 && (
                <div>
                  <label htmlFor="rf-activity" className="block text-xs font-semibold text-[#374151] mb-1">
                    Link to CME Activity <span className="font-normal text-[#94a3b8]">(optional)</span>
                  </label>
                  <select
                    id="rf-activity"
                    value={form.cme_activity_id}
                    onChange={(e) => setForm((f) => ({ ...f, cme_activity_id: e.target.value }))}
                    className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                  >
                    <option value="">No linked activity</option>
                    {activities.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title} — {a.activity_date} ({a.credits} credits)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="rf-learned" className="block text-xs font-semibold text-[#374151] mb-1">
                  What did you learn? <span className="text-[#dc2626]">*</span>
                </label>
                <textarea
                  id="rf-learned"
                  rows={4}
                  value={form.what_learned}
                  onChange={(e) => setForm((f) => ({ ...f, what_learned: e.target.value }))}
                  placeholder="Describe what you learned from this experience, activity, or event…"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
                  required
                  minLength={10}
                />
              </div>

              <div>
                <label htmlFor="rf-applied" className="block text-xs font-semibold text-[#374151] mb-1">
                  How have you applied this? <span className="font-normal text-[#94a3b8]">(optional)</span>
                </label>
                <textarea
                  id="rf-applied"
                  rows={3}
                  value={form.how_applied}
                  onChange={(e) => setForm((f) => ({ ...f, how_applied: e.target.value }))}
                  placeholder="Describe how you applied this learning to your clinical practice…"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
                />
              </div>

              <div>
                <label htmlFor="rf-impact" className="block text-xs font-semibold text-[#374151] mb-1">
                  Impact on practice <span className="font-normal text-[#94a3b8]">(optional)</span>
                </label>
                <textarea
                  id="rf-impact"
                  rows={2}
                  value={form.impact_on_practice}
                  onChange={(e) => setForm((f) => ({ ...f, impact_on_practice: e.target.value }))}
                  placeholder="What changed in the way you work as a result?"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
                />
              </div>

              <div>
                <label htmlFor="rf-further" className="block text-xs font-semibold text-[#374151] mb-1">
                  Further learning needed <span className="font-normal text-[#94a3b8]">(optional)</span>
                </label>
                <textarea
                  id="rf-further"
                  rows={2}
                  value={form.further_learning}
                  onChange={(e) => setForm((f) => ({ ...f, further_learning: e.target.value }))}
                  placeholder="What do you still need to learn or explore?"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0] resize-none"
                />
              </div>

              {saveError && <p className="text-sm text-[#dc2626]">{saveError}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 text-sm border border-[#e2e8f0] text-[#374151] px-4 py-2.5 rounded-xl hover:bg-[#f8fafc] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 text-sm bg-[#1a56a0] text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
                >
                  {saving ? "Saving…" : "Save Reflection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
