import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  compliant:     { label: "Compliant",     color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  at_risk:       { label: "At Risk",       color: "#d97706", bg: "#fff7ed", border: "#fed7aa" },
  non_compliant: { label: "Tracking",      color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
};

function toCountryFlagAndName(country: string): { flag: string; name: string } {
  const map: Record<string, { flag: string; name: string }> = {
    "Qatar":           { flag: "🇶🇦", name: "Qatar" },
    "Saudi Arabia":    { flag: "🇸🇦", name: "Saudi Arabia" },
    "UAE":             { flag: "🇦🇪", name: "UAE" },
    "UAE — Dubai":     { flag: "🇦🇪", name: "UAE — Dubai" },
    "UAE — Abu Dhabi": { flag: "🇦🇪", name: "UAE — Abu Dhabi" },
    "Kuwait":          { flag: "🇰🇼", name: "Kuwait" },
    "Bahrain":         { flag: "🇧🇭", name: "Bahrain" },
    "Oman":            { flag: "🇴🇲", name: "Oman" },
    "United Kingdom":  { flag: "🇬🇧", name: "United Kingdom" },
    "India":           { flag: "🇮🇳", name: "India" },
    "Australia":       { flag: "🇦🇺", name: "Australia" },
  };
  return map[country] ?? { flag: "🌍", name: country };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const isUuid = /^[0-9a-f-]{36}$/i.test(id);

  const admin = createAdminClient();
  const { data: profile } = isUuid
    ? await admin
        .from("professional_profiles")
        .select("full_name, profession, specialty, country_of_residence, auth_id")
        .eq("auth_id", id)
        .maybeSingle()
    : await admin
        .from("professional_profiles")
        .select("full_name, profession, specialty, country_of_residence, auth_id")
        .eq("referral_code", id.toUpperCase())
        .maybeSingle();

  if (!profile) return { title: "Profile — Hayya Med Pro" };

  const name = profile.full_name ?? "Healthcare Professional";
  const subtitle = [profile.profession, profile.specialty, profile.country_of_residence]
    .filter(Boolean)
    .join(" · ");
  const profileId = profile.auth_id ?? id;
  const badgeUrl = `${APP_URL}/api/badge/compliance?id=${profileId}`;

  return {
    title: `${name} — CME Compliance Profile`,
    description: `${name}${subtitle ? ` · ${subtitle}` : ""} · Verified CME compliance profile on Hayya Med Pro.`,
    openGraph: {
      title: `${name} — CME Compliance Profile`,
      description: subtitle,
      images: [{ url: badgeUrl, width: 1200, height: 628, alt: `${name} compliance badge` }],
      url: `${APP_URL}/p/${profileId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — CME Compliance Profile`,
      description: subtitle,
      images: [badgeUrl],
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isUuid = /^[0-9a-f-]{36}$/i.test(id);

  const admin = createAdminClient();

  let profileId: string | null = null;
  let profileData: { full_name: string | null; profession: string | null; specialty: string | null; country_of_residence: string | null; onboarding_complete: boolean | null; auth_id?: string } | null = null;

  if (isUuid) {
    const { data } = await admin
      .from("professional_profiles")
      .select("full_name, profession, specialty, country_of_residence, onboarding_complete, auth_id")
      .eq("auth_id", id)
      .maybeSingle();
    profileData = data;
    profileId = id;
  } else {
    // Look up by referral code
    const { data } = await admin
      .from("professional_profiles")
      .select("full_name, profession, specialty, country_of_residence, onboarding_complete, auth_id")
      .eq("referral_code", id.toUpperCase())
      .maybeSingle();
    profileData = data;
    profileId = data?.auth_id ?? null;
  }

  const [walletsRes] = await Promise.all([
    profileId
      ? admin
          .from("cme_wallets")
          .select("country, compliance_status, required_credits, completed_credits, cycle_end_date, profession")
          .eq("professional_id", profileId)
          .order("is_primary", { ascending: false })
          .order("created_at", { ascending: true })
      : Promise.resolve({ data: [] }),
  ]);

  const profile = profileData;
  if (!profile || !profile.onboarding_complete) notFound();

  const wallets = walletsRes.data ?? [];
  const primaryWallet = wallets[0] ?? null;

  const name = profile.full_name ?? "Healthcare Professional";
  const profession = profile.profession ?? null;
  const specialty = profile.specialty ?? null;
  const country = profile.country_of_residence ?? primaryWallet?.country ?? null;
  const countryMeta = country ? toCountryFlagAndName(country) : null;

  const overallStatus = primaryWallet?.compliance_status ?? "non_compliant";
  const sc = STATUS_CONFIG[overallStatus] ?? STATUS_CONFIG.non_compliant;

  const pct = primaryWallet && primaryWallet.required_credits > 0
    ? Math.min(100, Math.round((primaryWallet.completed_credits / primaryWallet.required_credits) * 100))
    : 0;

  const issuedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Nav */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="font-bold text-base text-[#111]">
              Hayya Med <span className="text-[#1a56a0]">Pro</span>
            </span>
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold text-white bg-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
          >
            Track your compliance free →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-6 shadow-sm">
          {/* Header band */}
          <div className="bg-gradient-to-br from-[#0f1f3d] to-[#1a3563] px-8 py-8">
            <div className="flex items-start gap-6">
              {/* Avatar initials */}
              <div className="w-16 h-16 rounded-2xl bg-[#1a56a0] border-2 border-[rgba(255,255,255,0.15)] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-2xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white mb-1 leading-tight">{name}</h1>
                {(profession || specialty) && (
                  <p className="text-[rgba(255,255,255,0.7)] text-sm mb-2">
                    {[profession, specialty].filter(Boolean).join(" · ")}
                  </p>
                )}
                {countryMeta && (
                  <p className="text-[rgba(255,255,255,0.5)] text-sm">
                    {countryMeta.flag} {countryMeta.name}
                  </p>
                )}
              </div>

              {/* Status badge */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0"
                style={{ background: sc.color + "22", border: `1.5px solid ${sc.color}55` }}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: sc.color }} />
                <span className="text-sm font-semibold" style={{ color: sc.color }}>
                  {sc.label}
                </span>
              </div>
            </div>
          </div>

          {/* Compliance summary */}
          {primaryWallet && (
            <div className="px-8 py-6 border-b border-[#f1f5f9]">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-4">
                CME Compliance — {primaryWallet.country}
              </p>

              <div className="flex items-center gap-6">
                {/* Ring percentage */}
                <div
                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 flex-shrink-0"
                  style={{ borderColor: sc.color + "33", background: sc.color + "0d" }}
                >
                  <span className="text-2xl font-black" style={{ color: sc.color }}>{pct}%</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="w-full bg-[#e2e8f0] rounded-full h-2.5 mb-3">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: pct >= 100 ? "#16a34a" : "#1a56a0" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#64748b]">
                    <span>Verified CME progress</span>
                    {primaryWallet.cycle_end_date && (
                      <span>Renewal: {primaryWallet.cycle_end_date}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Multiple wallets summary */}
          {wallets.length > 1 && (
            <div className="px-8 py-5 border-b border-[#f1f5f9]">
              <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">
                All Compliance Jurisdictions
              </p>
              <div className="flex flex-wrap gap-2">
                {wallets.map((w) => {
                  const ws = STATUS_CONFIG[w.compliance_status] ?? STATUS_CONFIG.non_compliant;
                  const wMeta = toCountryFlagAndName(w.country);
                  const wPct = w.required_credits > 0
                    ? Math.min(100, Math.round((w.completed_credits / w.required_credits) * 100))
                    : 0;
                  return (
                    <div
                      key={w.country}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                      style={{ background: ws.bg, borderColor: ws.border }}
                    >
                      <span className="text-base leading-none">{wMeta.flag}</span>
                      <span className="text-xs font-medium text-[#374151]">{w.country}</span>
                      <span className="text-xs font-semibold" style={{ color: ws.color }}>{wPct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 py-4 bg-[#f8fafc] flex items-center justify-between">
            <p className="text-xs text-[#94a3b8]">
              Verified by Hayya Med Pro · {issuedDate}
            </p>
            <p className="text-xs text-[#94a3b8]">hayyamed.pro</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e] mb-8">
          This profile reflects CME tracking data submitted and verified within the Hayya Med Pro platform. It does not constitute an official licensing authority record. Always verify final requirements with the relevant regulatory body.
        </div>

        {/* CTA for non-users */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#1a56a0] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-lg font-bold">H</span>
          </div>
          <h2 className="text-lg font-bold text-[#111] mb-2">Track your own CME compliance</h2>
          <p className="text-sm text-[#64748b] mb-6 max-w-sm mx-auto">
            Join GCC healthcare professionals tracking CPD credits across QCHP, SCFHS, DHA, DOH, NHRA, OMSB and more — free to start.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold bg-[#1a56a0] text-white px-6 py-3 rounded-xl hover:bg-[#154890] transition-colors"
          >
            Create free account →
          </Link>
          <p className="text-xs text-[#94a3b8] mt-3">No credit card · 14-day Pro trial included</p>
        </div>
      </main>
    </div>
  );
}
