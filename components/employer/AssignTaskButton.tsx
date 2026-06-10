"use client";
import { useState } from "react";

const CATEGORIES = [
  { value: "conference", label: "Conference / Symposium" },
  { value: "online", label: "Online / E-Learning" },
  { value: "workshop", label: "Workshop / Hands-on" },
  { value: "journal", label: "Journal Article Review" },
  { value: "teaching", label: "Teaching / Lecturing" },
  { value: "simulation", label: "Simulation / Lab" },
  { value: "mandatory", label: "Mandatory Training" },
  { value: "patient_safety", label: "Patient Safety" },
  { value: "other", label: "Other" },
];

export default function AssignTaskButton({
  professionalId,
  staffName,
}: {
  professionalId: string;
  staffName: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    credits_target: "",
    due_date: "",
    message: "",
  });

  function close() {
    setOpen(false);
    setDone(false);
    setForm({ title: "", category: "", credits_target: "", due_date: "", message: "" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/employer/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professional_id: professionalId,
          title: form.title,
          message: form.message || null,
          category: form.category || null,
          credits_target: form.credits_target ? parseInt(form.credits_target) : null,
          due_date: form.due_date || null,
        }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(close, 1800);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-[#1a56a0] hover:bg-[#eff6ff] px-2 py-1 rounded transition-colors border border-[#bfdbfe] whitespace-nowrap"
      >
        Assign Task
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={close}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-[#e2e8f0]" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#111]">Assign CPD Task</h2>
                <p className="text-xs text-[#64748b] mt-0.5">{staffName}</p>
              </div>
              <button onClick={close} className="text-[#94a3b8] hover:text-[#374151] text-xl leading-none">×</button>
            </div>

            {done ? (
              <div className="px-6 py-10 text-center">
                <p className="text-[#16a34a] font-medium text-sm">Task assigned — notification sent to {staffName.split(" ")[0]}.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Task Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Complete 10 mandatory CPD credits"
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a56a0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a56a0]"
                    >
                      <option value="">Any category</option>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">Credits Target</label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={form.credits_target}
                      onChange={e => setForm(f => ({ ...f, credits_target: e.target.value }))}
                      placeholder="e.g. 10"
                      className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a56a0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a56a0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">Message (optional)</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Add context or instructions for this task..."
                    className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a56a0] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button type="button" onClick={close} className="text-sm text-[#64748b] hover:text-[#374151]">Cancel</button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#1a56a0] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Sending..." : "Assign & Notify"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
