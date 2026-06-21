"use client";

import { useActionState } from "react";
import { inviteTeamMember } from "@/app/(government)/government/actions";

type State = { success?: boolean; error?: string } | null;

export default function InviteTeamMemberForm({ organizationId: _ }: { organizationId: string }) {
  const [state, formAction, isPending] = useActionState(inviteTeamMember, null as State);

  return (
    <form action={formAction} className="space-y-4">
      {state?.success && (
        <div className="px-4 py-3 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-sm text-[#16a34a] font-medium">
          ✓ Team member added and notified by email.
        </div>
      )}
      {state?.error && (
        <div className="px-4 py-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-sm text-[#dc2626]">
          {state.error}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-[#374151] mb-1">Email address</label>
          <input
            name="email"
            type="email"
            required
            placeholder="colleague@hospital.qa"
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-[#374151] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] outline-none"
          />
        </div>

        <div className="w-40">
          <label className="block text-xs font-medium text-[#374151] mb-1">Access level</label>
          <select
            name="accessLevel"
            className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 text-[#374151] bg-white focus:ring-2 focus:ring-[#1a56a0]/20 focus:border-[#1a56a0] outline-none"
          >
            <option value="read_only">Staff (Read-only)</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="text-sm px-5 py-2.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors font-medium"
      >
        {isPending ? "Inviting…" : "Invite Team Member"}
      </button>
    </form>
  );
}
