"use client";

import { useState, useTransition } from "react";
import { deleteCmeActivity, editCmeActivity } from "@/app/(dashboard)/dashboard/cme/actions";

const CATEGORIES = [
  { value: "", label: "— No category —" },
  { value: "conference",    label: "Conference" },
  { value: "online",        label: "Online" },
  { value: "workshop",      label: "Workshop" },
  { value: "journal",       label: "Journal" },
  { value: "teaching",      label: "Teaching" },
  { value: "simulation",    label: "Simulation" },
  { value: "mandatory",     label: "Mandatory" },
  { value: "patient_safety",label: "Patient Safety" },
  { value: "other",         label: "Other" },
];

interface Props {
  id: string;
  status: string;
  title: string;
  provider: string | null;
  activityDate: string;
  credits: number;
  category: string | null;
}

export default function CmeActivityActions({ id, status, title, provider, activityDate, credits, category }: Props) {
  const canEdit = status === "pending";
  const canDelete = status === "pending" || status === "rejected";

  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState(title);
  const [editProvider, setEditProvider] = useState(provider ?? "");
  const [editDate, setEditDate] = useState(activityDate);
  const [editCredits, setEditCredits] = useState(String(credits));
  const [editCategory, setEditCategory] = useState(category ?? "");

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCmeActivity(id);
      if (result.error) setError(result.error);
      else setConfirmDelete(false);
    });
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await editCmeActivity(id, {
        title: editTitle,
        provider: editProvider || null,
        activity_date: editDate,
        credits: parseFloat(editCredits),
        category: editCategory || null,
      });
      if (result.error) setError(result.error);
      else setShowEdit(false);
    });
  }

  if (!canEdit && !canDelete) return null;

  return (
    <div className="mt-2">
      {!showEdit && !confirmDelete && (
        <div className="flex items-center gap-3">
          {canEdit && (
            <button
              onClick={() => setShowEdit(true)}
              className="text-xs text-[#1a56a0] hover:underline"
            >
              Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-[#dc2626] hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      )}

      {confirmDelete && (
        <div className="mt-2 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-lg">
          <p className="text-xs text-[#dc2626] mb-2">Delete this activity? This cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-xs font-semibold bg-[#dc2626] text-white px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              {isPending ? "Deleting…" : "Confirm delete"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-[#64748b] px-3 py-1.5 rounded-lg border border-[#e2e8f0]"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-[11px] text-[#dc2626] mt-1">{error}</p>}
        </div>
      )}

      {showEdit && (
        <form onSubmit={handleEdit} className="mt-3 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg space-y-3">
          <p className="text-xs font-semibold text-[#374151] mb-1">Edit activity</p>
          <div>
            <label className="text-[11px] text-[#64748b] block mb-1">Title *</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-[#64748b] block mb-1">Provider</label>
              <input
                value={editProvider}
                onChange={(e) => setEditProvider(e.target.value)}
                placeholder="Optional"
                className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#64748b] block mb-1">Date *</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
                className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-[#64748b] block mb-1">Credits *</label>
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={editCredits}
                onChange={(e) => setEditCredits(e.target.value)}
                required
                className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#64748b] block mb-1">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="text-[11px] text-[#dc2626]">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="text-xs font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => { setShowEdit(false); setError(null); }}
              className="text-xs text-[#64748b] px-4 py-2 rounded-lg border border-[#e2e8f0]"
            >
              Cancel
            </button>
          </div>
          <p className="text-[11px] text-[#94a3b8]">Saving will reset this activity to pending re-verification.</p>
        </form>
      )}
    </div>
  );
}
