"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import type { Plan } from "@/lib/planUtils";
import { isPro } from "@/lib/planUtils";

interface Props {
  professionalId: string;
  plan: Plan;
  name: string;
  pct: number;
  complianceStatus: string;
  referralCode?: string | null;
}

export default function ComplianceBadgeCard({ professionalId, plan, name, pct, complianceStatus, referralCode }: Props) {
  const [copied, setCopied] = useState(false);
  const [profileCopied, setProfileCopied] = useState(false);
  const [postCopied, setPostCopied] = useState(false);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://hayyamed.pro";
  const badgeUrl = `/api/badge/compliance?id=${encodeURIComponent(professionalId)}`;
  const absoluteUrl = `${appUrl}${badgeUrl}`;
  const profileUrl = `${appUrl}/p/${professionalId}`;
  const referralUrl = referralCode ? `${appUrl}/register?ref=${referralCode}` : `${appUrl}/register`;
  const profileLinkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl)}`;

  const linkedInPostText = `I'm tracking my CME compliance with Hayya Med Pro â€” keeping my renewal on track.\n\n${pct}% complete Â· ${complianceStatus === "compliant" ? "Compliant âœ“" : complianceStatus === "at_risk" ? "At Risk âš ï¸" : "In Progress"}\n\nFree to start for GCC healthcare professionals: ${referralUrl}`;

  const whatsappText = `I'm using Hayya Med Pro to track my CME compliance â€” ${pct}% complete. Free to start for GCC healthcare professionals: ${referralUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      track("badge_link_copied", { pct, status: complianceStatus });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text in a temporary input
      const input = document.createElement("input");
      input.value = absoluteUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function copyProfileLink() {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setProfileCopied(true);
      track("profile_link_copied", { pct, status: complianceStatus });
      setTimeout(() => setProfileCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = profileUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setProfileCopied(true);
      setTimeout(() => setProfileCopied(false), 2000);
    }
  }

  async function downloadBadge() {
    track("badge_downloaded", { pct, status: complianceStatus });
    const res = await fetch(badgeUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hayya-med-pro-compliance-badge-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyLinkedInPost() {
    try {
      await navigator.clipboard.writeText(linkedInPostText);
    } catch {
      const input = document.createElement("textarea");
      input.value = linkedInPostText;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setPostCopied(true);
    track("badge_shared_linkedin", { pct, status: complianceStatus, method: "copy_post" });
    setTimeout(() => setPostCopied(false), 3000);
  }

  const statusLabel =
    complianceStatus === "compliant" ? "Compliant" :
    complianceStatus === "at_risk" ? "At Risk" :
    "Non-Compliant";

  const statusColor =
    complianceStatus === "compliant" ? "text-[#16a34a]" :
    complianceStatus === "at_risk" ? "text-[#d97706]" :
    "text-[#dc2626]";

  if (!isPro(plan)) {
    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6 relative overflow-hidden">
        {/* Blurred badge preview */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          {/* Fake badge preview using CSS */}
          <div className="w-full h-full bg-gradient-to-br from-[#0f1f3d] to-[#1a2f5a] opacity-30" />
        </div>
        <div className="relative z-10 text-center py-4">
          <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[#1a56a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[#111] mb-1">Share Your Compliance Badge</h3>
          <p className="text-sm text-[#64748b] max-w-xs mx-auto mb-4">
            Generate a shareable compliance certificate for LinkedIn and WhatsApp. Available on Pro.
          </p>
          <a
            href="/pricing?source=compliance_badge"
            onClick={() => track("upgrade_clicked", { source: "compliance_badge" })}
            className="inline-block text-sm font-semibold bg-[#1a56a0] text-white px-5 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors"
          >
            Upgrade to Pro â†’
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-[#111]">Compliance Badge</h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Share your {pct}% compliance status â€” {" "}
            <span className={statusColor + " font-medium"}>{statusLabel}</span>
          </p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-[#eff6ff] text-[#1a56a0] uppercase tracking-wide">
          Pro
        </span>
      </div>

      {/* Badge preview */}
      <div className="rounded-xl overflow-hidden border border-[#e2e8f0] mb-4 bg-[#0f1f3d]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={badgeUrl}
          alt={`Compliance badge for ${name}`}
          className="w-full object-cover"
          style={{ aspectRatio: "1200/628" }}
          loading="lazy"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copyLink}
          className="flex items-center gap-1.5 text-xs font-medium bg-[#1a56a0] text-white px-3.5 py-2 rounded-lg hover:bg-[#1547a0] transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              Copy badge link
            </>
          )}
        </button>

        <a
          href={linkedInShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("badge_shared_linkedin", { pct, status: complianceStatus })}
          className="flex items-center gap-1.5 text-xs font-medium border border-[#e2e8f0] text-[#374151] px-3.5 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share on LinkedIn
        </a>

        <button
          onClick={downloadBadge}
          className="flex items-center gap-1.5 text-xs font-medium border border-[#e2e8f0] text-[#374151] px-3.5 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download PNG
        </button>

        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("badge_shared_whatsapp", { pct, status: complianceStatus })}
          className="flex items-center gap-1.5 text-xs font-medium border border-[#e2e8f0] text-[#374151] px-3.5 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-[#16a34a]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </a>

        <button
          onClick={copyLinkedInPost}
          className="flex items-center gap-1.5 text-xs font-medium border border-[#e2e8f0] text-[#374151] px-3.5 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
        >
          {postCopied ? (
            <>
              <svg className="w-3.5 h-3.5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Post text copied!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              Copy LinkedIn post
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-[#94a3b8] mt-3">
        Anyone with the badge link can view your compliance status. Share it with employers, licensing authorities, or on social media.
      </p>

      {/* Public profile sharing */}
      <div className="mt-4 pt-4 border-t border-[#f1f5f9]">
        <p className="text-xs font-medium text-[#374151] mb-2">Public profile page</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={copyProfileLink}
            className="flex items-center gap-1.5 text-xs font-medium border border-[#e2e8f0] text-[#374151] px-3.5 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
          >
            {profileCopied ? (
              <>
                <svg className="w-3.5 h-3.5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Copy profile link
              </>
            )}
          </button>
          <a
            href={profileLinkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("profile_shared_linkedin", { pct, status: complianceStatus })}
            className="flex items-center gap-1.5 text-xs font-medium border border-[#e2e8f0] text-[#374151] px-3.5 py-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Share profile on LinkedIn
          </a>
        </div>
        <p className="text-[11px] text-[#94a3b8] mt-2">
          Your public profile shows your compliance status without revealing personal details.
        </p>
      </div>
    </div>
  );
}
