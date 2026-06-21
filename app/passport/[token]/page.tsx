import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Passport Verification — Hayya Med Pro",
  description: "Verify a healthcare professional's Hayya Med Passport.",
  robots: { index: false, follow: false },
};

// Force dynamic so each scan gets a fresh DB read and logs correctly
export const dynamic = "force-dynamic";

const STATUS_CONFIG = {
  compliant:     { label: "CME Compliant",   icon: "✓", bg: "bg-green-50",  border: "border-green-200",  text: "text-green-700",  dot: "bg-[#16a34a]" },
  at_risk:       { label: "CME At Risk",      icon: "⚠", bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", dot: "bg-[#d97706]"  },
  non_compliant: { label: "Non-Compliant",    icon: "✕", bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    dot: "bg-[#dc2626]"  },
} as const;

function getInitials(name: string | null): string {
  if (!name) return "HP";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export default async function PassportVerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Validate token format — must be a UUID
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(token)) notFound();

  const admin = createAdminClient();

  // Fetch passport by QR token
  const { data: passport } = await admin
    .from("professional_passports")
    .select("id, auth_id, passport_number, is_active, visibility_config, created_at")
    .eq("qr_token", token)
    .maybeSingle();

  if (!passport) notFound();

  // Deactivated passport shows a clear message — do not log as a successful scan
  if (!passport.is_active) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="https://hayyamed.pro" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</a>
            <span className="text-xs text-[#64748b]">Passport Verification</span>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl font-bold">✕</span>
            </div>
            <h1 className="text-lg font-bold text-[#111] mb-2">Passport Deactivated</h1>
            <p className="text-sm text-[#64748b]">This passport has been deactivated by its holder. Please contact the professional directly.</p>
          </div>
        </main>
      </div>
    );
  }

  // Log the verification (fire-and-forget — don't block render on failure)
  void admin
    .from("passport_verifications")
    .insert({ passport_id: passport.id });

  // Fetch professional profile and CME wallet in parallel
  const cfg = passport.visibility_config as Record<string, boolean>;

  const [profileRes, walletRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("full_name, profession, specialty, licensing_authority, country_of_residence")
      .eq("auth_id", passport.auth_id)
      .single(),
    admin
      .from("cme_wallets")
      .select("compliance_status, required_credits, cycle_end_date")
      .eq("professional_id", passport.auth_id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const profile = profileRes.data;
  const wallet = walletRes.data;

  const statusKey = (wallet?.compliance_status ?? "non_compliant") as keyof typeof STATUS_CONFIG;
  const statusCfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.non_compliant;
  const initials = getInitials(cfg.show_name ? (profile?.full_name ?? null) : null);

  const verifiedAt = new Date().toLocaleDateString("en", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });

  const issuedAt = new Date(passport.created_at).toLocaleDateString("en", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <a href="https://hayyamed.pro" className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</a>
          <span className="text-xs text-[#64748b]">Passport Verification</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* Verification card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm">
          {/* Blue banner */}
          <div className="bg-[#1a56a0] px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">Hayya Med Passport™</p>
              <p className="text-blue-200 text-xs">Verified Digital Healthcare Identity</p>
            </div>
          </div>

          {/* Professional identity */}
          <div className="px-6 py-5 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-4">
              {/* Initials avatar */}
              <div className="w-14 h-14 bg-[#1a56a0] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">{initials}</span>
              </div>
              <div>
                {cfg.show_name && profile?.full_name && (
                  <h1 className="text-lg font-bold text-[#111]">{profile.full_name}</h1>
                )}
                {cfg.show_profession && profile?.profession && (
                  <p className="text-sm text-[#64748b]">
                    {profile.profession}
                    {cfg.show_specialty && profile?.specialty ? ` · ${profile.specialty}` : ""}
                  </p>
                )}
                {cfg.show_authority && profile?.licensing_authority && (
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    {profile.licensing_authority}
                    {profile?.country_of_residence ? ` — ${profile.country_of_residence}` : ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CME compliance */}
          {cfg.show_cme_status && (
            <div className="px-6 py-4 border-b border-[#f1f5f9]">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${statusCfg.bg} ${statusCfg.border}`}>
                <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                <span className={`text-sm font-semibold ${statusCfg.text}`}>{statusCfg.label}</span>
              </div>
              {wallet?.cycle_end_date && (
                <p className="text-xs text-[#64748b] mt-2">
                  Renewal cycle ends:{" "}
                  <span className="font-medium text-[#374151]">
                    {new Date(wallet.cycle_end_date).toLocaleDateString("en", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Passport metadata */}
          <div className="px-6 py-4 bg-[#f8fafc] flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest">Passport No.</p>
              <p className="text-xs font-mono font-semibold text-[#374151]">{passport.passport_number}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest">Issued</p>
              <p className="text-xs text-[#374151]">{issuedAt}</p>
            </div>
          </div>

          {/* Verification timestamp */}
          <div className="px-6 py-3 border-t border-[#e2e8f0]">
            <p className="text-xs text-[#64748b]">
              Scanned and verified at {verifiedAt}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4">
          <p className="text-xs text-yellow-800 leading-relaxed">
            <strong>Disclaimer:</strong> This passport reflects information self-declared and tracked by the professional on Hayya Med Pro. Hayya Med Pro does not issue licenses and does not replace official licensing authorities. Verify final requirements with the relevant regulatory body.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center py-2">
          <p className="text-xs text-[#64748b] mb-2">Track your own CME compliance with Hayya Med Pro</p>
          <a
            href="https://hayyamed.pro/register"
            className="inline-block px-5 py-2.5 bg-[#1a56a0] text-white text-sm font-semibold rounded-xl hover:bg-[#1e40af] transition-colors"
          >
            Get started — it&apos;s free
          </a>
        </div>
      </main>
    </div>
  );
}
