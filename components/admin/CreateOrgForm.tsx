"use client";

import { useState } from "react";
import { createOrganization } from "@/app/(admin)/admin/organizations/actions";

const ORG_TYPES = ["hospital", "clinic", "pharmacy", "university", "lab", "other"];

export default function CreateOrgForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await createOrganization(fd);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0] transition-colors"
      >
        + Create Organization
      </button>
    );
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 mb-4">
      <h3 className="text-sm font-semibold text-[#111] mb-4">Create Organization</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1" htmlFor="org-name">
            Name *
          </label>
          <input
            id="org-name"
            name="name"
            type="text"
            required
            placeholder="e.g. Hamad Medical Corporation"
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1" htmlFor="org-type">
              Type
            </label>
            <select
              id="org-type"
              name="type"
              defaultValue="hospital"
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white capitalize"
            >
              {ORG_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1" htmlFor="org-country">
              Country
            </label>
            <input
              id="org-country"
              name="country"
              type="text"
              placeholder="Qatar"
              defaultValue="Qatar"
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1" htmlFor="org-city">
              City
            </label>
            <input
              id="org-city"
              name="city"
              type="text"
              placeholder="Doha"
              className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            />
          </div>

          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="hidden"
                name="verified"
                value="false"
              />
              <input
                id="org-verified"
                type="checkbox"
                name="verified"
                value="true"
                defaultChecked
                className="w-4 h-4 rounded border-[#e2e8f0] text-[#1a56a0] focus:ring-[#1a56a0]"
              />
              <span className="text-xs font-medium text-[#374151]">Mark as verified</span>
            </label>
          </div>
        </div>

        {error && <p className="text-xs text-[#dc2626]">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => { setOpen(false); setError(null); }}
            disabled={loading}
            className="flex-1 text-sm px-4 py-2 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 text-sm font-semibold px-4 py-2 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
