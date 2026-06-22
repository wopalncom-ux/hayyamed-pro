import { notFound, redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  const { userId } = await params;
  const admin = createAdminClient();
  const { data } = await admin.from("professional_profiles").select("full_name").eq("auth_id", userId).maybeSingle();
  return { title: data?.full_name ? `${data.full_name} — Compliance Report` : "Compliance Report" };
}

export const dynamic = "force-dynamic";

function statusBadge(status: string) {
  const s = status?.toLowerCase();
  if (s === "compliant")     return { label: "COMPLIANT",     bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" };
  if (s === "at_risk")       return { label: "AT RISK",       bg: "#fef9c3", color: "#92400e", border: "#fde68a" };
  return                            { label: "NON-COMPLIANT", bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };
}

export default async function ComplianceReportPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members").select("role")
    .eq("auth_id", user.id).in("role", ["master_admin", "super_admin"]).maybeSingle();
  if (!member) redirect("/dashboard");

  const [profileRes, walletRes, activitiesRes] = await Promise.all([
    admin.from("professional_profiles").select("*").eq("auth_id", userId).single(),
    admin.from("cme_wallets").select("*").eq("auth_id", userId).maybeSingle(),
    admin.from("cme_activities")
      .select("id, activity_title, activity_type, provider_name, credits_claimed, credits_awarded, activity_date, verification_status, category")
      .eq("auth_id", userId)
      .order("activity_date", { ascending: false }),
  ]);

  if (profileRes.error || !profileRes.data) notFound();

  const profile    = profileRes.data;
  const wallet     = walletRes?.data;
  const activities = activitiesRes.data ?? [];
  const verified   = activities.filter((a) => a.verification_status === "verified");
  const reportId   = `HMP-${userId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const reportDate = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const completed    = wallet?.credits_completed ?? 0;
  const required     = wallet?.credits_required   ?? 80;
  const remaining    = Math.max(0, required - completed);
  const pct          = required > 0 ? Math.min(100, Math.round((completed / required) * 100)) : 0;
  const compliance   = wallet?.compliance_status ?? (pct >= 100 ? "compliant" : pct >= 60 ? "at_risk" : "non_compliant");
  const badge        = statusBadge(compliance);

  // Category breakdown
  const catMap: Record<string, { claimed: number; awarded: number; count: number }> = {};
  for (const a of verified) {
    const cat = a.category ?? "General";
    if (!catMap[cat]) catMap[cat] = { claimed: 0, awarded: 0, count: 0 };
    catMap[cat].claimed += a.credits_claimed ?? 0;
    catMap[cat].awarded += a.credits_awarded ?? 0;
    catMap[cat].count   += 1;
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 20mm; }
        }
      `}</style>

      {/* Print / back buttons */}
      <div className="no-print bg-[#f8fafc] border-b border-[#e2e8f0] px-6 py-3 flex items-center gap-4">
        <a href="/admin/reports" className="text-sm text-[#64748b] hover:text-[#374151]">← Back to search</a>
        <button onClick={() => { if (typeof window !== "undefined") window.print(); }}
          className="ml-auto px-4 py-2 bg-[#1a56a0] text-white text-sm font-medium rounded-lg hover:bg-[#1547a0]">
          Print / Save as PDF
        </button>
      </div>

      {/* Report */}
      <div className="max-w-3xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-[#1a56a0]">
          <div>
            <p className="text-xs font-bold text-[#1a56a0] uppercase tracking-widest mb-1">Hayya Med PRO</p>
            <h1 className="text-2xl font-bold text-[#0f172a]">CME Compliance Report</h1>
            <p className="text-xs text-[#64748b] mt-1">This report is generated from verified activity records and wallet data.</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">Report ID</p>
            <p className="text-xs font-mono text-[#374151]">{reportId}</p>
            <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide mt-2">Generated</p>
            <p className="text-xs text-[#374151]">{reportDate}</p>
          </div>
        </div>

        {/* Professional Info */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-4">Professional Information</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {[
              ["Full Name",       profile.full_name        ?? "—"],
              ["Profession",      profile.profession        ?? "—"],
              ["Specialty",       profile.specialty         ?? "—"],
              ["Country",         profile.country_of_residence ?? "—"],
              ["License Number",  profile.license_number    ?? "Not provided"],
              ["Issuing Authority", profile.licensing_authority ?? "—"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] text-[#94a3b8] uppercase tracking-wide">{label}</p>
                <p className="text-sm text-[#0f172a] font-medium capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Summary */}
        <div className="mb-8 p-5 rounded-2xl border-2" style={{ borderColor: badge.border, background: badge.bg }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: badge.color }}>Compliance Status</h2>
            <span className="text-sm font-bold px-4 py-1.5 rounded-full text-white"
              style={{ background: badge.color }}>{badge.label}</span>
          </div>
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { label: "Credits Required", value: required },
              { label: "Credits Completed", value: completed },
              { label: "Credits Remaining", value: remaining },
              { label: "Completion %", value: `${pct}%` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold" style={{ color: badge.color }}>{value}</p>
                <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: badge.color, opacity: 0.8 }}>{label}</p>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-white/50 rounded-full overflow-hidden">
            <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: badge.color }} />
          </div>
        </div>

        {/* Category Breakdown */}
        {Object.keys(catMap).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-4">Credits by Category</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#e2e8f0]">
                  <th className="text-left pb-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">Category</th>
                  <th className="text-right pb-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">Activities</th>
                  <th className="text-right pb-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">Claimed</th>
                  <th className="text-right pb-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wide">Awarded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {Object.entries(catMap).sort((a, b) => b[1].awarded - a[1].awarded).map(([cat, v]) => (
                  <tr key={cat}>
                    <td className="py-2 font-medium text-[#374151]">{cat}</td>
                    <td className="py-2 text-right text-[#64748b]">{v.count}</td>
                    <td className="py-2 text-right text-[#64748b]">{v.claimed.toFixed(1)}</td>
                    <td className="py-2 text-right font-bold text-[#1a56a0]">{v.awarded.toFixed(1)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#0f172a] font-bold">
                  <td className="pt-2 text-[#0f172a]">Total</td>
                  <td className="pt-2 text-right text-[#0f172a]">{verified.length}</td>
                  <td className="pt-2 text-right text-[#0f172a]">
                    {Object.values(catMap).reduce((s, v) => s + v.claimed, 0).toFixed(1)}
                  </td>
                  <td className="pt-2 text-right text-[#1a56a0]">{completed.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Activity Log */}
        <div className="mb-8">
          <h2 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-4">
            Verified Activity Log ({verified.length} activities)
          </h2>
          {verified.length === 0 ? (
            <p className="text-sm text-[#94a3b8] py-4 text-center">No verified activities recorded.</p>
          ) : (
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#e2e8f0]">
                  {["Date", "Activity", "Provider", "Type", "Credits"].map((h) => (
                    <th key={h} className="text-left pb-2 font-bold text-[#64748b] uppercase tracking-wide pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {verified.map((a) => (
                  <tr key={a.id}>
                    <td className="py-1.5 pr-3 whitespace-nowrap text-[#64748b]">
                      {a.activity_date ? new Date(a.activity_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="py-1.5 pr-3 font-medium text-[#374151]">{a.activity_title ?? "—"}</td>
                    <td className="py-1.5 pr-3 text-[#64748b]">{a.provider_name ?? "—"}</td>
                    <td className="py-1.5 pr-3 text-[#64748b] capitalize">{a.activity_type ?? "—"}</td>
                    <td className="py-1.5 text-right font-bold text-[#1a56a0]">
                      {a.credits_awarded ?? a.credits_claimed ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Disclaimer */}
        <div className="border-t border-[#e2e8f0] pt-6 mt-8">
          <p className="text-[10px] text-[#94a3b8] leading-relaxed">
            <strong className="text-[#64748b]">Disclaimer:</strong> This report is generated from data recorded by the professional on the Hayya Med PRO platform.
            Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing
            authorities. Users must verify final requirements with their relevant regulatory body. Hayya Med PRO does not guarantee the
            accuracy of self-reported activities. This document is for reference purposes only.
          </p>
          <p className="text-[10px] text-[#94a3b8] mt-2">
            hayyamed.pro · Report generated: {reportDate} · Report ID: {reportId}
          </p>
        </div>
      </div>
    </div>
  );
}
