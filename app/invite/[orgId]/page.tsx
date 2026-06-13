import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ orgId: string }>;
}

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

interface OrgInfo {
  name: string;
  org_type: string | null;
  city: string | null;
  country_code: string | null;
}

async function getOrg(orgId: string): Promise<OrgInfo | null> {
  if (!/^[0-9a-f-]{36}$/.test(orgId)) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from("organizations")
    .select("name, org_type, city, country_code")
    .eq("id", orgId)
    .eq("verified", true)
    .maybeSingle();
  return data ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgId } = await params;
  const org = await getOrg(orgId);
  const title = org
    ? `${org.name} has invited you to Hayya Med Pro`
    : "You've been invited to join a healthcare compliance platform";
  return {
    title,
    description: "Track your CME credits, stay compliant with your licensing authority, and let your employer monitor team compliance. Join your organization on Hayya Med Pro.",
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description: "Your employer uses Hayya Med Pro for healthcare compliance. Join their team — free for you to start.",
      url: `${BASE}/invite/${orgId}`,
    },
  };
}

function orgTypeLabel(type: string | null): string {
  switch (type) {
    case "hospital":           return "Hospital";
    case "clinic":             return "Clinic";
    case "university":         return "University";
    case "government":         return "Government";
    case "training_provider":  return "Training Provider";
    default:                   return "Healthcare Organization";
  }
}

export default async function InvitePage({ params }: Props) {
  const { orgId } = await params;

  if (!/^[0-9a-f-]{36}$/.test(orgId)) {
    redirect("/register");
  }

  const org = await getOrg(orgId);

  if (!org) {
    redirect("/register");
  }

  const registerUrl = `/register?invite=${encodeURIComponent(orgId)}`;
  const locationStr = [org.city, org.country_code].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </div>
        <span className="text-base font-bold text-[#111]">Hayya Med <span className="text-[#1a56a0]">Pro</span></span>
      </a>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] px-8 py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[#1a56a0] border-2 border-[rgba(255,255,255,0.2)] mx-auto mb-4 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <p className="text-[rgba(255,255,255,0.7)] text-sm mb-1">Invitation from</p>
            <h1 className="text-xl font-bold text-white">{org.name}</h1>
            {locationStr && (
              <p className="text-[rgba(255,255,255,0.5)] text-xs mt-1">{orgTypeLabel(org.org_type)} · {locationStr}</p>
            )}
          </div>

          <div className="px-8 py-7">
            <h2 className="text-lg font-bold text-[#111] text-center mb-1">
              You&rsquo;ve been invited to join
            </h2>
            <p className="text-sm text-[#64748b] text-center mb-6">
              {org.name} uses Hayya Med Pro to manage their team&rsquo;s CME compliance. Join to connect your compliance record with their dashboard.
            </p>

            {/* What your employer sees */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-4 mb-6">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">What {org.name} can see</p>
              <ul className="space-y-2">
                {[
                  "Your overall compliance status",
                  "CME credit progress (if you allow it)",
                  "License expiry date (if you allow it)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-[#1a56a0] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-[#374151]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#94a3b8] mt-3">
                You control your privacy settings. Your CME activities and certificates are always private to you.
              </p>
            </div>

            {/* Your own benefits */}
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3.5 mb-6">
              <p className="text-xs font-semibold text-[#1a56a0] uppercase tracking-wide mb-2">Your own free account includes</p>
              <ul className="space-y-1.5">
                {[
                  "Track CME credits for QCHP, SCFHS, DHA, and more",
                  "License expiry countdown and renewal reminders",
                  "14-day Pro trial — AI compliance tools + PDF reports",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-[#1a56a0] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-xs text-[#1e3a5f]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={registerUrl}
              className="block w-full bg-[#1a56a0] hover:bg-[#154890] text-white font-semibold text-sm text-center py-3.5 rounded-xl transition-colors"
            >
              Join {org.name} on Hayya Med Pro →
            </a>
            <p className="text-center text-xs text-[#94a3b8] mt-3">
              Free account · 14-day Pro trial · No credit card required
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-[#94a3b8]">
          <span>Privacy-first · Your data stays yours</span>
          <span>·</span>
          <a href="/privacy" className="hover:text-[#64748b]">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
