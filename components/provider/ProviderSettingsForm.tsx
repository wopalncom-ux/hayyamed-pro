"use client";

import { useActionState } from "react";
import { updateProviderSettings } from "@/app/(provider)/provider/settings/actions";
import type { UpdateProviderState } from "@/app/(provider)/provider/settings/actions";

interface Props {
  provider: {
    name: string;
    description: string | null;
    website_url: string | null;
    contact_email: string | null;
    country_code: string;
    is_accredited: boolean;
    accreditor: string | null;
  };
}

const inputClass =
  "w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/30 focus:border-[#1a56a0] transition-colors";
const labelClass = "block text-xs font-medium text-[#374151] mb-1.5";

export default function ProviderSettingsForm({ provider }: Props) {
  const [state, action, pending] = useActionState<UpdateProviderState, FormData>(
    updateProviderSettings,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      {state.success && (
        <div className="text-xs text-[#16a34a] bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg px-3 py-2">
          Settings saved successfully.
        </div>
      )}
      {state.error && (
        <div className="text-xs text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      <div>
        <label className={labelClass}>Organization Name *</label>
        <input
          name="name"
          className={inputClass}
          defaultValue={provider.name}
          required
          maxLength={200}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          className={`${inputClass} resize-none`}
          rows={3}
          defaultValue={provider.description ?? ""}
          maxLength={1000}
          placeholder="Brief description of your organization and the courses you offer…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Contact Email</label>
          <input
            name="contact_email"
            type="email"
            className={inputClass}
            defaultValue={provider.contact_email ?? ""}
            placeholder="info@provider.com"
            maxLength={200}
          />
        </div>
        <div>
          <label className={labelClass}>Website URL</label>
          <input
            name="website_url"
            type="url"
            className={inputClass}
            defaultValue={provider.website_url ?? ""}
            placeholder="https://www.provider.com"
            maxLength={500}
          />
        </div>
      </div>

      {/* Read-only fields managed by admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#f1f5f9]">
        <div>
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Country</p>
          <p className="text-sm text-[#374151]">{provider.country_code}</p>
        </div>
        {provider.is_accredited && (
          <div>
            <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Accreditation</p>
            <p className="text-sm text-[#374151]">{provider.accreditor ?? "Accredited"}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-[#94a3b8]">
        To update country or accreditation details, contact{" "}
        <a href="mailto:support@hayyamed.com" className="text-[#1a56a0] hover:underline">
          support@hayyamed.com
        </a>
      </p>

      <button
        type="submit"
        disabled={pending}
        className="bg-[#1a56a0] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
