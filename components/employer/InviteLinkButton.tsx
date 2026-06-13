"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

interface Props {
  organizationId: string;
  orgName: string;
}

export default function InviteLinkButton({ organizationId, orgName }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://hayyamed.pro";
    const url = `${origin}/invite/${organizationId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    track("employer_invite_link_copied", { organizationId, orgName });
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg border border-[#1a56a0] text-[#1a56a0] hover:bg-[#e8f0fe] transition-colors"
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
      {copied ? "Link copied!" : "Copy invite link"}
    </button>
  );
}
