import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { validateVerificationToken } from "@/lib/verificationToken";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance Verification — Hayya Med Pro",
  description: "Verify a healthcare professional's CME compliance status.",
  robots: { index: false, follow: false },
};

const STATUS_CONFIG = {
  compliant: {
    label: "Compliant",
    icon: "✓",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    bar: "bg-green-500",
  },
  at_risk: {
    label: "At Risk",
    icon: "⚠",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    iconBg: "bg-yellow-100",
    iconText: "text-yellow-600",
    bar: "bg-yellow-400",
  },
  non_compliant: {
    label: "Non-Compliant",
    icon: "✕",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    bar: "bg-red-500",
  },
} as const;

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const professionalId = validateVerificationToken(token);
  if (!professionalId) notFound();

  const admin = createAdminClient();

  const [profileRes, walletsRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("full_name, profession, specialty, country")
      .eq("auth_id", professionalId)
      .maybeSingle(),
    admin
      .from("cme_wallets")
      .select("id, country, profession, specialty, required_credits, compliance_status, cycle_end_date")
      .eq("professional_id", professionalId)
      .order("created_at", { ascending: false }),
  ]);

  if (!profileRes.data) notFound();

  const profile = profileRes.data;
  const wallets = walletsRes.data ?? [];

  // Fetch completed credits for each wallet
  const walletData = await Promise.all(
    wallets.map(async (w) => {
      const { data: acts } = await admin
        .from("cme_activities")
        .select("credits")
        .eq("professional_id", professionalId)
        .eq("wallet_id", w.id)
        .in("verification_status", ["verified", "approved"]);

      const earned = (acts ?? []).reduce((s, a) => s + a.credits, 0);
      const pct = Math.min(100, Math.round((earned / (w.required_credits || 1)) * 100));
      return { ...w, earned, pct };
    })
  );

  const verifiedAt = new Date().toLocaleDateString("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="https://hayyamed.pro" className="text-base font-bold text-[#1a56a0]">
            Hayya Med Pro
          </a>
          <span className="text-xs text-[#64748b]">Compliance Verification</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Verification badge */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden mb-6">
          {/* Top banner */}
          <div className="bg-[#1a56a0] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                ✓
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Verified by Hayya Med Pro</p>
                <p className="text-blue-200 text-xs">Real-time CME compliance data</p>
              </div>
            </div>
          </div>

          {/* Professional details */}
          <div className="px-6 py-5 border-b border-[#e2e8f0]">
            <h1 className="text-xl font-bold text-[#111] mb-1">{profile.full_name}</h1>
            <p className="text-sm text-[#64748b]">
              {profile.profession}
              {profile.specialty ? ` — ${profile.specialty}` : ""}
            </p>
          </div>

          {/* Wallets */}
          {walletData.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-[#64748b]">No compliance wallets configured.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f1f5f9]">
              {walletData.map((w) => {
                const statusKey = (w.compliance_status ?? "non_compliant") as keyof typeof STATUS_CONFIG;
                const cfg = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.non_compliant;
                const renewalDate = w.cycle_end_date
                  ? new Date(w.cycle_end_date).toLocaleDateString("en", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : null;

                return (
                  <div key={w.id} className="px-6 py-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-[#111]">{w.country}</p>
                        <p className="text-xs text-[#64748b]">
                          {w.profession}
                          {w.specialty ? ` · ${w.specialty}` : ""}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-[#64748b] mb-1">
                        <span>{w.earned} credits earned</span>
                        <span>{w.required_credits} required</span>
                      </div>
                      <div className="w-full bg-[#e2e8f0] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${cfg.bar}`}
                          style={{ width: `${w.pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#94a3b8] mt-1">{w.pct}% complete</p>
                    </div>

                    {renewalDate && (
                      <p className="text-xs text-[#64748b]">
                        Renewal cycle ends: <span className="font-medium text-[#374151]">{renewalDate}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Verification timestamp */}
          <div className="px-6 py-3 bg-[#f8fafc] border-t border-[#e2e8f0]">
            <p className="text-xs text-[#94a3b8]">
              Verified at {verifiedAt} · Data reflects verified activities only
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 mb-6">
          <p className="text-xs text-yellow-800 leading-relaxed">
            <strong>Disclaimer:</strong> Hayya Med Pro supports CME tracking and licensing readiness.
            It does not issue licenses and does not replace official licensing authorities.
            Recipients should verify final requirements with the relevant regulatory body.
          </p>
        </div>

        {/* About */}
        <div className="text-center">
          <p className="text-xs text-[#94a3b8] mb-1">
            This verification is generated by the professional and reflects data they have chosen to share.
          </p>
          <a
            href="https://hayyamed.pro"
            className="text-xs text-[#1a56a0] hover:underline"
          >
            Learn about Hayya Med Pro →
          </a>
        </div>
      </main>
    </div>
  );
}
