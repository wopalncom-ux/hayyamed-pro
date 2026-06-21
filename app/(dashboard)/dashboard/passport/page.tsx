import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { IdCard, ScanLine, ShieldCheck } from "lucide-react";
import PassportControls from "@/components/dashboard/PassportControls";
import { generatePassport } from "./actions";

export const metadata: Metadata = {
  title: "My Passport — Hayya Med Pro",
  robots: { index: false },
};

const STATUS_STYLE = {
  compliant:     { label: "CME Compliant",     dot: "bg-[#16a34a]", text: "text-[#16a34a]" },
  at_risk:       { label: "CME At Risk",        dot: "bg-[#d97706]", text: "text-[#d97706]" },
  non_compliant: { label: "Non-Compliant",      dot: "bg-[#dc2626]", text: "text-[#dc2626]" },
} as const;

function getInitials(name: string | null): string {
  if (!name) return "HP";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export default async function PassportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [profileRes, walletRes, passportRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("full_name, profession, specialty, licensing_authority, country_of_residence")
      .eq("auth_id", user.id)
      .single(),
    admin
      .from("cme_wallets")
      .select("compliance_status, required_credits, cycle_end_date")
      .eq("professional_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    admin
      .from("professional_passports")
      .select("id, passport_number, qr_token, qr_token_rotated_at, is_active, visibility_config, total_scans, created_at")
      .eq("auth_id", user.id)
      .maybeSingle(),
  ]);

  const profile = profileRes.data;
  const wallet = walletRes.data;
  const passport = passportRes.data;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

  // Generate QR code if passport exists
  let qrDataUrl: string | null = null;
  if (passport?.is_active) {
    const verifyUrl = `${appUrl}/passport/${passport.qr_token}`;
    qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 2,
      color: { dark: "#1a56a0", light: "#ffffff" },
    });
  }

  const statusKey = (wallet?.compliance_status ?? "non_compliant") as keyof typeof STATUS_STYLE;
  const statusStyle = STATUS_STYLE[statusKey] ?? STATUS_STYLE.non_compliant;
  const initials = getInitials(profile?.full_name ?? null);
  const passportUrl = passport ? `${appUrl}/passport/${passport.qr_token}` : "";

  const rotatedAt = passport?.qr_token_rotated_at
    ? new Date(passport.qr_token_rotated_at).toLocaleDateString("en", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  const issuedAt = passport?.created_at
    ? new Date(passport.created_at).toLocaleDateString("en", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-[#111] flex items-center gap-2">
          <IdCard size={22} className="text-[#1a56a0]" />
          Hayya Med Passport™
        </h1>
        <p className="text-sm text-[#64748b] mt-1">
          Your verified healthcare professional digital identity. Share the QR code at conferences, with employers, and training providers.
        </p>
      </div>

      {!passport ? (
        /* ── Empty state ── */
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 text-center">
          <div className="w-16 h-16 bg-[#f0f4f8] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IdCard size={32} className="text-[#1a56a0]" />
          </div>
          <h2 className="text-lg font-semibold text-[#111] mb-2">Generate Your Passport</h2>
          <p className="text-sm text-[#64748b] max-w-sm mx-auto mb-6">
            Create a verified digital identity card with a QR code that shows your CME compliance status in real time.
          </p>
          <ul className="text-sm text-[#64748b] text-left max-w-xs mx-auto mb-8 space-y-2">
            {[
              "Instant QR verification — no app needed",
              "Show compliance status at conferences",
              "Control exactly what verifiers can see",
              "Rotate QR code anytime to revoke access",
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <span className="text-[#16a34a] font-bold mt-0.5">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
          <form action={generatePassport}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a56a0] text-white font-semibold text-sm rounded-xl hover:bg-[#1e40af] transition-colors"
            >
              <IdCard size={16} />
              Generate My Passport
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* ── Deactivated banner ── */}
          {!passport.is_active && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
              <span className="font-semibold">Passport deactivated.</span>
              QR scans will show a deactivated message. Reactivate below to restore access.
            </div>
          )}

          {/* ── Passport card ── */}
          <div
            className="rounded-2xl overflow-hidden shadow-lg"
            style={{ background: "linear-gradient(135deg, #0f2d5e 0%, #1a56a0 60%, #2563eb 100%)" }}
          >
            {/* Header strip */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShieldCheck size={15} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm tracking-wide">HAYYA MED PASSPORT™</span>
              </div>
              <span className="text-white/60 text-xs font-mono">{profile?.country_of_residence ?? "QA"}</span>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex items-start justify-between gap-4">
              {/* Left: identity */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Initials avatar */}
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-base leading-tight truncate">
                    {profile?.full_name ?? "Healthcare Professional"}
                  </p>
                  <p className="text-blue-200 text-sm mt-0.5">
                    {profile?.profession ?? "—"}
                    {profile?.specialty ? ` · ${profile.specialty}` : ""}
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    {profile?.licensing_authority ?? "License Authority"}
                  </p>
                  {/* Compliance badge */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                    <span className={`text-xs font-semibold ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: QR code */}
              <div className="flex-shrink-0">
                {qrDataUrl ? (
                  <div className="bg-white rounded-xl p-2 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrDataUrl} alt="Passport QR Code" width={96} height={96} className="rounded" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center">
                    <ScanLine size={32} className="text-white/40" />
                  </div>
                )}
                <p className="text-white/50 text-[10px] text-center mt-1">Scan to verify</p>
              </div>
            </div>

            {/* Footer strip */}
            <div className="px-6 py-3 bg-black/20 flex items-center justify-between">
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Passport No.</p>
                <p className="text-white font-mono text-sm font-bold">{passport.passport_number}</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Issued</p>
                <p className="text-white/80 text-xs">{issuedAt}</p>
              </div>
            </div>
          </div>

          {/* ── Stats bar ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Scans",   value: passport.total_scans.toString() },
              { label: "QR Last Rotated", value: rotatedAt ?? "Never" },
              { label: "Status",        value: passport.is_active ? "Active" : "Inactive" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] px-4 py-3 text-center">
                <p className="text-xs text-[#64748b]">{label}</p>
                <p className="text-sm font-semibold text-[#111] mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Interactive controls ── */}
          <PassportControls
            initialConfig={passport.visibility_config as Record<string, boolean> & {
              show_name: boolean;
              show_specialty: boolean;
              show_profession: boolean;
              show_cme_status: boolean;
              show_cme_credits: boolean;
              show_authority: boolean;
            }}
            isActive={passport.is_active}
            passportUrl={passportUrl}
          />
        </>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-[#64748b] border-t border-[#e2e8f0] pt-4">
        Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Verifiers should confirm final requirements with the relevant regulatory body.
      </div>
    </div>
  );
}
