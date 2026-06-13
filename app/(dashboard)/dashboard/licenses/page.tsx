import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LicenseCountdownCard from "@/components/dashboard/LicenseCountdownCard";
import LicenseEditForm from "@/components/dashboard/LicenseEditForm";
import { getUserPlan, isPro } from "@/lib/subscription";
import { toCountryCode } from "@/lib/countryCode";

export const metadata = { title: "License Management — Hayya Med Pro" };

export default async function LicensesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [profileRes, walletRes, plan] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("license_number, licensing_authority, license_expiry, profession, specialty, country_of_residence")
      .eq("auth_id", user.id)
      .single(),
    admin
      .from("cme_wallets")
      .select("id, cycle_start_date, cycle_end_date, completed_credits, required_credits, country, compliance_status")
      .eq("professional_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    getUserPlan(user.id),
  ]);

  const profile = profileRes.data;
  const wallet = walletRes.data;

  // Fetch activities + category rules for the primary wallet in parallel
  type CatRule = { category_name: string; min_credits_per_cycle: number; max_credits_per_cycle: number | null };
  type Activity = { credits: number; category: string | null; verification_status: string };

  let activities: Activity[] = [];
  let categoryRules: CatRule[] = [];

  if (wallet) {
    const countryCode = toCountryCode(wallet.country ?? "QA");
    const [actRes, catRes] = await Promise.all([
      admin
        .from("cme_activities")
        .select("credits, category, verification_status")
        .eq("professional_id", user.id)
        .eq("wallet_id", wallet.id),
      admin
        .from("compliance_activity_categories")
        .select("category_name, min_credits_per_cycle, max_credits_per_cycle")
        .eq("country_code", countryCode)
        .gt("min_credits_per_cycle", 0)
        .order("category_name"),
    ]);
    activities = (actRes.data ?? []) as Activity[];
    categoryRules = (catRes.data ?? []) as CatRule[];
  }

  const daysToExpiry = profile?.license_expiry
    ? Math.ceil((new Date(profile.license_expiry).getTime() - Date.now()) / 86400000)
    : null;

  // ── Renewal Readiness Computation ──────────────────────────────────────
  const validActivities = activities.filter((a) => a.verification_status !== "rejected");
  const creditsByCategory: Record<string, number> = {};
  for (const a of validActivities) {
    if (a.category) {
      creditsByCategory[a.category] = (creditsByCategory[a.category] ?? 0) + a.credits;
    }
  }
  const totalEarned = validActivities.reduce((s, a) => s + a.credits, 0);
  const required = wallet?.required_credits ?? 0;

  interface CheckItem {
    label: string;
    detail: string;
    pass: boolean;
    critical: boolean;
  }

  const checklist: CheckItem[] = [];

  // 1. License validity
  if (daysToExpiry !== null) {
    const licenseOk = daysToExpiry > 0;
    checklist.push({
      label: "License not expired",
      detail: daysToExpiry < 0
        ? "Expired"
        : daysToExpiry <= 30
        ? `Expires in ${daysToExpiry} days — urgent`
        : `Expires in ${daysToExpiry} days`,
      pass: licenseOk,
      critical: true,
    });
  }

  // 2. CME cycle active
  if (wallet?.cycle_end_date) {
    const cycleEnd = new Date(wallet.cycle_end_date);
    const cycleOk = cycleEnd >= new Date();
    const cycleStart = wallet.cycle_start_date ? new Date(wallet.cycle_start_date) : null;
    const withinCycle = cycleStart ? new Date() >= cycleStart : true;
    checklist.push({
      label: "CME cycle active",
      detail: cycleOk && withinCycle
        ? `Active · ends ${wallet.cycle_end_date}`
        : cycleOk
        ? `Not yet started · begins ${wallet.cycle_start_date}`
        : `Cycle ended ${wallet.cycle_end_date}`,
      pass: cycleOk && withinCycle,
      critical: false,
    });
  }

  // 3. Total credits
  if (required > 0) {
    checklist.push({
      label: `Total CME credits`,
      detail: `${totalEarned} / ${required} required`,
      pass: totalEarned >= required,
      critical: true,
    });
  }

  // 4. Per-category minimums
  for (const rule of categoryRules) {
    const earned = creditsByCategory[rule.category_name] ?? 0;
    const pass = earned >= rule.min_credits_per_cycle;
    checklist.push({
      label: rule.category_name.replace(/_/g, " "),
      detail: `${earned} / ${rule.min_credits_per_cycle} minimum`,
      pass,
      critical: false,
    });
  }

  const criticalFailed = checklist.filter((c) => c.critical && !c.pass).length;
  const totalFailed = checklist.filter((c) => !c.pass).length;
  const allPassed = totalFailed === 0 && checklist.length > 0;
  const readinessScore = checklist.length > 0
    ? Math.round((checklist.filter((c) => c.pass).length / checklist.length) * 100)
    : null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-2">License Management</h1>
      <p className="text-sm text-[#64748b] mb-6">
        Track your professional license and renewal status.
      </p>

      {/* Visual countdown */}
      <div className="mb-6">
        <LicenseCountdownCard
          licenseExpiry={profile?.license_expiry ?? null}
          licenseNumber={profile?.license_number ?? null}
          authority={profile?.licensing_authority ?? null}
          profession={profile?.profession ?? null}
          cycleEnd={wallet?.cycle_end_date ?? null}
          cmeCompleted={wallet?.completed_credits ?? 0}
          cmeRequired={wallet?.required_credits ?? 50}
        />
      </div>

      {/* Renewal Readiness Checklist */}
      {checklist.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#111]">Renewal Readiness</h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                {checklist.filter((c) => c.pass).length}/{checklist.length} requirements met
              </p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              allPassed
                ? "bg-[#dcfce7] text-[#16a34a]"
                : criticalFailed > 0
                ? "bg-[#fef2f2] text-[#dc2626]"
                : "bg-[#fff7ed] text-[#d97706]"
            }`}>
              {allPassed
                ? "Ready to renew"
                : criticalFailed > 0
                ? `${criticalFailed} critical gap${criticalFailed > 1 ? "s" : ""}`
                : `${totalFailed} gap${totalFailed > 1 ? "s" : ""} remaining`}
            </span>
          </div>

          {/* Readiness score bar */}
          {readinessScore !== null && (
            <div className="px-6 pt-4 pb-2">
              <div className="flex items-center justify-between mb-1.5 text-xs text-[#64748b]">
                <span>Overall readiness</span>
                <span className="font-semibold text-[#111]">{readinessScore}%</span>
              </div>
              <div className="w-full bg-[#e2e8f0] rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    allPassed ? "bg-[#16a34a]" : criticalFailed > 0 ? "bg-[#dc2626]" : "bg-[#d97706]"
                  }`}
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
            </div>
          )}

          <div className="divide-y divide-[#f1f5f9]">
            {checklist.map((item, i) => (
              <div key={i} className="px-6 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.pass
                      ? "bg-[#dcfce7] text-[#16a34a]"
                      : item.critical
                      ? "bg-[#fef2f2] text-[#dc2626]"
                      : "bg-[#fff7ed] text-[#d97706]"
                  }`}>
                    {item.pass ? "✓" : "✗"}
                  </span>
                  <span className={`text-sm font-medium capitalize ${item.pass ? "text-[#374151]" : item.critical ? "text-[#dc2626]" : "text-[#92400e]"}`}>
                    {item.label}
                  </span>
                </div>
                <span className={`text-xs flex-shrink-0 ${item.pass ? "text-[#64748b]" : item.critical ? "text-[#dc2626] font-medium" : "text-[#d97706]"}`}>
                  {item.detail}
                </span>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-between gap-4">
            <p className="text-xs text-[#64748b]">
              {allPassed
                ? "All requirements are met. Download your renewal package to submit to your licensing authority."
                : "Complete the gaps above, then download your renewal package."}
            </p>
            {isPro(plan) ? (
              <a
                href="/api/pdf/cme-report"
                className="flex-shrink-0 text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1547a0] transition-colors"
              >
                Download Package
              </a>
            ) : (
              <a
                href="/pricing?source=renewal_package"
                className="flex-shrink-0 text-sm bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] px-4 py-2 rounded-lg font-medium hover:border-[#1a56a0] hover:text-[#1a56a0] transition-colors"
              >
                Upgrade for PDF →
              </a>
            )}
          </div>
        </div>
      )}

      {/* License details card */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-base font-semibold text-[#111] mb-4">License Details</h2>

        {!profile?.license_number && (
          <div className="flex items-start gap-3 bg-[#fff7ed] border border-[#fed7aa] rounded-lg px-4 py-3 mb-4">
            <span className="text-[#d97706] text-base mt-0.5">⚠</span>
            <p className="text-sm text-[#92400e]">
              No license details saved yet. Add your license number and expiry date so we can track your renewal countdown.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <Field label="License Number"      value={profile?.license_number      ?? "Not set"} />
          <Field label="Licensing Authority" value={profile?.licensing_authority ?? "Not set"} />
          <Field label="Profession"          value={profile?.profession          ?? "Not set"} />
          <Field label="Specialty"           value={profile?.specialty           ?? "Not set"} />
          <Field
            label="Expiry Date"
            value={profile?.license_expiry
              ? new Date(profile.license_expiry).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
              : "Not set"}
            highlight={daysToExpiry !== null && daysToExpiry <= 30}
          />
          {daysToExpiry !== null && (
            <Field
              label="Days Until Expiry"
              value={daysToExpiry < 0 ? "EXPIRED" : `${daysToExpiry} days`}
              highlight={daysToExpiry <= 30}
            />
          )}
        </div>

        <LicenseEditForm
          licenseNumber={profile?.license_number ?? null}
          licensingAuthority={profile?.licensing_authority ?? null}
          licenseExpiry={profile?.license_expiry ?? null}
          profession={profile?.profession ?? null}
          specialty={profile?.specialty ?? null}
        />
      </div>

      {/* Reminder schedule */}
      {profile?.license_expiry && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
          <h2 className="text-base font-semibold text-[#111] mb-3">Reminder Schedule</h2>
          <p className="text-sm text-[#64748b] mb-4">
            You&apos;ll receive email reminders at the following dates before your license expires.
          </p>
          <div className="space-y-2">
            {[90, 60, 30, 14, 7].map((d) => {
              const reminderDate = new Date(new Date(profile.license_expiry!).getTime() - d * 86400000);
              const fired = reminderDate < new Date();
              return (
                <div key={d} className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${fired ? "bg-[#f8fafc]" : "bg-[#f0f7ff]"}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${fired ? "bg-[#94a3b8]" : "bg-[#1a56a0]"}`} />
                    <span className={fired ? "text-[#94a3b8] line-through" : "text-[#374151]"}>
                      {d} days before expiry
                    </span>
                  </div>
                  <span className={`text-xs ${fired ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                    {reminderDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e]">
        Hayya Med Pro tracks license readiness only. It does not issue or renew licenses.
        Always verify final requirements with your licensing authority (e.g. QCHP, SCFHS, DHA).
      </div>
    </div>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-sm font-medium ${highlight ? "text-[#dc2626]" : "text-[#111]"}`}>{value}</p>
    </div>
  );
}
