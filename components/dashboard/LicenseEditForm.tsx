"use client";

import { useState, useRef } from "react";
import { updateLicenseDetails, AUTHORITIES } from "@/app/(dashboard)/dashboard/licenses/actions";
import { useRouter } from "next/navigation";

interface Props {
  licenseNumber: string | null;
  licensingAuthority: string | null;
  licenseExpiry: string | null;
  profession: string | null;
  specialty: string | null;
}

export default function LicenseEditForm({
  licenseNumber, licensingAuthority, licenseExpiry, profession, specialty
}: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const fd = new FormData(e.currentTarget);
    const result = await updateLicenseDetails(fd);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      setOpen(false);
      setSuccess(false);
      router.refresh();
    }, 800);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-[#1a56a0] hover:underline"
      >
        Edit license details
      </button>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-[#e2e8f0] space-y-4">
      <h3 className="text-sm font-semibold text-[#111]">Edit License Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">
            License Number *
          </label>
          <input
            name="license_number"
            type="text"
            defaultValue={licenseNumber ?? ""}
            required
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            placeholder="e.g. QMC-12345"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">
            Licensing Authority
          </label>
          <select
            name="licensing_authority"
            defaultValue={licensingAuthority ?? ""}
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
          >
            <option value="">Select authority…</option>
            {AUTHORITIES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">
            Expiry Date
          </label>
          <input
            name="license_expiry"
            type="date"
            defaultValue={licenseExpiry ?? ""}
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">
            Profession
          </label>
          <input
            name="profession"
            type="text"
            defaultValue={profession ?? ""}
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            placeholder="e.g. Physician"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">
            Specialty
          </label>
          <input
            name="specialty"
            type="text"
            defaultValue={specialty ?? ""}
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white"
            placeholder="e.g. Cardiology"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-[#16a34a] bg-[#dcfce7] border border-[#bbf7d0] rounded-lg px-3 py-2">
          License details saved.
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => { setOpen(false); setError(null); }}
          disabled={saving}
          className="text-sm px-4 py-2 rounded-lg border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc] disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || success}
          className="text-sm font-semibold px-5 py-2 rounded-lg bg-[#1a56a0] text-white hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : success ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
