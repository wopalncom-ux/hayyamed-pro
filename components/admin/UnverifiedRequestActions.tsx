"use client";

import { useState } from "react";
import { approveUnverifiedRequest, rejectAdminRequest } from "@/app/(admin)/admin/link-requests/actions";

const ORG_TYPES = ["hospital", "clinic", "pharmacy", "university", "lab", "other"];

export default function UnverifiedRequestActions({
  requestId,
  suggestedName,
  professionalId,
}: {
  requestId: string;
  suggestedName: string;
  professionalId: string;
}) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [orgName, setOrgName] = useState(suggestedName);
  const [orgType, setOrgType] = useState("clinic");
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setLoading("approve");
    setError(null);
    const result = await approveUnverifiedRequest(requestId, orgName, orgType, professionalId);
    setLoading(null);
    if (result?.error) { setError(result.error); return; }
    setShowApproveModal(false);
    setDone("approved");
  }

  async function handleReject() {
    setLoading("reject");
    setError(null);
    const result = await rejectAdminRequest(requestId);
    setLoading(null);
    if (result?.error) { setError(result.error); return; }
    setDone("rejected");
  }

  if (done) {
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
        done === "approved" ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#fef2f2] text-[#dc2626]"
      }`}>
        {done}
      </span>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-red-500 mr-1">{error}</span>}
        <button
          onClick={handleReject}
          disabled={!!loading}
          className="text-xs px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-[#64748b] hover:bg-[#f8fafc] disabled:opacity-50 transition-colors"
        >
          {loading === "reject" ? "..." : "Reject"}
        </button>
        <button
          onClick={() => setShowApproveModal(true)}
          disabled={!!loading}
          className="text-xs px-3 py-1.5 bg-[#1a56a0] text-white rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
        >
          Create & Approve
        </button>
      </div>

      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h2 className="text-sm font-semibold text-[#111]">Create Organization & Approve</h2>
              <button onClick={() => setShowApproveModal(false)} className="text-[#64748b] hover:text-[#111]">✕</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Organization Name</label>
                <input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">Organization Type</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
                >
                  {ORG_TYPES.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 border border-[#e2e8f0] text-sm text-[#374151] px-4 py-2 rounded-lg hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={loading === "approve" || !orgName.trim()}
                  className="flex-1 bg-[#1a56a0] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#1547a0] disabled:opacity-60 transition-colors"
                >
                  {loading === "approve" ? "Creating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
