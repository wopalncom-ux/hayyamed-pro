"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { deleteAccount } from "@/app/(dashboard)/dashboard/settings/actions";

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (confirm !== "DELETE") return;
    setLoading(true);
    setError(null);

    const result = await deleteAccount();
    if (result?.error) {
      setLoading(false);
      setError(result.error);
      return;
    }

    // Session is now invalid — sign out the client and redirect to home
    const supabase = createClient();
    await supabase.auth.signOut().catch(() => {});
    window.location.href = "/";
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-[#dc2626] hover:underline"
      >
        Delete my account
      </button>
    );
  }

  return (
    <div className="border border-[#fecaca] rounded-xl p-4 bg-[#fff5f5]">
      <p className="text-sm font-semibold text-[#dc2626] mb-1">Delete account permanently?</p>
      <p className="text-xs text-[#64748b] mb-4">
        This will permanently delete your profile, CME records, licenses, and all associated data.
        This action cannot be undone. Type <strong>DELETE</strong> to confirm.
      </p>
      <input
        type="text"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Type DELETE to confirm"
        className="w-full text-sm px-3 py-2 border border-[#e2e8f0] rounded-lg mb-3 focus:outline-none focus:border-[#dc2626]"
      />
      {error && <p className="text-xs text-[#dc2626] mb-2">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={() => { setOpen(false); setConfirm(""); setError(null); }}
          disabled={loading}
          className="flex-1 text-sm px-4 py-2 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading || confirm !== "DELETE"}
          className="flex-1 text-sm px-4 py-2 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Deleting..." : "Delete account"}
        </button>
      </div>
    </div>
  );
}
