"use client";

import { useState } from "react";
import { verifyOrganization, unverifyOrganization } from "@/app/(admin)/admin/organizations/actions";

export default function OrgVerifyButton({
  orgId,
  verified,
}: {
  orgId: string;
  verified: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setLoading(true);
    setError(null);
    const result = verified
      ? await unverifyOrganization(orgId)
      : await verifyOrganization(orgId);
    if (result.error) setError(result.error);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={loading}
        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors disabled:opacity-50 ${
          verified
            ? "bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2]"
            : "bg-[#f0fdf4] text-[#16a34a] hover:bg-[#dcfce7]"
        }`}
      >
        {loading ? "..." : verified ? "Unverify" : "Verify"}
      </button>
      {error && <span className="text-xs text-[#dc2626]">{error}</span>}
    </div>
  );
}
