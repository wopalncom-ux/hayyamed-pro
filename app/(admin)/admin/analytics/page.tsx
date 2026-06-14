import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function pct(num: number, den: number) {
  if (!den) return 0;
  return Math.round((num / den) * 100);
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default async function AdminAnalyticsPage() {
  const admin = createAdminClient();

  const now = new Date();
  const day1  = new Date(now.getTime() -  1 * 86400000).toISOString();
  const day7  = new Date(now.getTime() -  7 * 86400000).toISOString();
  const day30 = new Date(now.getTime() - 30 * 86400000).toISOString();
  const day90 = new Date(now.getTime() - 90 * 86400000).toISOString();

  // Signup cohort — 30 days
  const [
    signupsRes,
    activatedRes,
    onboardingRes,
    dauRes,
    wauRes,
    mauRes,
    paidRes,
    trialingRes,
    totalRes,
    recentCmeRes,
    npsRes,
  ] = await Promise.all([
    // All signups last 30 days with created_at
    admin
      .from("professional_profiles")
      .select("created_at, onboarding_complete")
      .gte("created_at", day30)
      .order("created_at", { ascending: true }),

    // Total who completed onboarding ever
    admin
      .from("professional_profiles")
      .select("id", { count: "exact", head: true })
      .eq("onboarding_complete", true),

    // Onboarding funnel — step distribution (last 30 days)
    admin
      .from("professional_profiles")
      .select("onboarding_step, onboarding_complete")
      .gte("created_at", day30),

    // DAU: unique users who submitted CME today
    admin
      .from("cme_activities")
      .select("auth_id")
      .gte("created_at", day1),

    // WAU: unique users who submitted CME in last 7 days
    admin
      .from("cme_activities")
      .select("auth_id")
      .gte("created_at", day7),

    // MAU: unique users who submitted CME in last 30 days
    admin
      .from("cme_activities")
      .select("auth_id")
      .gte("created_at", day30),

    // Active paying subscriptions
    admin
      .from("subscriptions")
      .select("plan, employer_tier, billing_interval, created_at")
      .eq("status", "active"),

    // Trialing
    admin
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("status", "trialing"),

    // Total all-time signups
    admin
      .from("professional_profiles")
      .select("id", { count: "exact", head: true }),

    // Recent CME activity timeline (last 30 days) — for trend chart
    admin
      .from("cme_activities")
      .select("created_at")
      .gte("created_at", day30)
      .order("created_at", { ascending: true }),

    // NPS responses — last 90 days
    admin
      .from("nps_responses")
      .select("score, created_at")
      .gte("created_at", day90)
      .order("created_at", { ascending: false }),
  ]);

  const signups30 = signupsRes.data ?? [];
  const totalSignups = totalRes.count ?? 0;
  const activatedTotal = activatedRes.count ?? 0;
  const trialingCount = trialingRes.count ?? 0;

  // DAU/WAU/MAU — unique users
  const dauSet = new Set((dauRes.data ?? []).map((r) => r.auth_id));
  const wauSet = new Set((wauRes.data ?? []).map((r) => r.auth_id));
  const mauSet = new Set((mauRes.data ?? []).map((r) => r.auth_id));

  // Paid breakdown
  const paid = paidRes.data ?? [];
  const paidPro      = paid.filter((s) => s.plan === "pro").length;
  const paidEmployer = paid.filter((s) => s.plan === "employer").length;
  const paidTotal    = paid.length;

  // Funnel: last 30-day signup cohort
  const cohort30 = signups30.length;
  const cohortActivated = signups30.filter((s) => s.onboarding_complete).length;

  // Build daily signup chart data (last 30 days)
  const signupByDay: Record<string, number> = {};
  const cmeByDay: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const k = `${d.getMonth() + 1}/${d.getDate()}`;
    signupByDay[k] = 0;
    cmeByDay[k] = 0;
  }
  for (const s of signups30) {
    const k = dayLabel(s.created_at);
    if (k in signupByDay) signupByDay[k]++;
  }
  for (const c of recentCmeRes.data ?? []) {
    const k = dayLabel(c.created_at);
    if (k in cmeByDay) cmeByDay[k]++;
  }

  // NPS scoring
  const npsData      = npsRes.data ?? [];
  const npsPromoters = npsData.filter((r) => r.score >= 9).length;
  const npsPassives  = npsData.filter((r) => r.score >= 7 && r.score <= 8).length;
  const npsDetractors = npsData.filter((r) => r.score <= 6).length;
  const npsTotal     = npsData.length;
  const npsScore     = npsTotal > 0 ? Math.round(((npsPromoters - npsDetractors) / npsTotal) * 100) : null;
  const npsDistribution = Array.from({ length: 11 }, (_, i) => ({
    score: i,
    count: npsData.filter((r) => r.score === i).length,
  }));
  const npsMaxBucket = Math.max(...npsDistribution.map((d) => d.count), 1);

  const signupDays = Object.entries(signupByDay);
  const cmeDays    = Object.entries(cmeByDay);
  const maxSignups = Math.max(...Object.values(signupByDay), 1);
  const maxCme     = Math.max(...Object.values(cmeByDay), 1);

  // Onboarding step funnel (last 30 days)
  const stepFunnel = onboardingRes.data ?? [];
  const stepCounts: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "complete": 0 };
  for (const p of stepFunnel) {
    if (p.onboarding_complete) { stepCounts["complete"]++; continue; }
    const s = String(p.onboarding_step ?? 1);
    if (s in stepCounts) stepCounts[s]++;
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Platform Analytics</h1>
          <p className="text-sm text-[#64748b] mt-1">Signup cohorts, activation funnel, engagement trends — last 30 days.</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Signups" value={totalSignups} color="blue" sub="all time" />
        <KpiCard label="Activation Rate" value={`${pct(activatedTotal, totalSignups)}%`} color="green" sub={`${activatedTotal} onboarded`} />
        <KpiCard label="Paid Conversion" value={`${pct(paidTotal, totalSignups)}%`} color="green" sub={`${paidTotal} paying`} />
        <KpiCard label="Active Trials" value={trialingCount} color="orange" sub="ongoing" />
      </div>

      {/* Engagement row */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Engagement (CME Activity)</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard label="Active Today (DAU)" value={dauSet.size} color="blue" sub="submitted CME today" />
        <KpiCard label="Active 7 Days (WAU)" value={wauSet.size} color="blue" sub="submitted CME this week" />
        <KpiCard label="Active 30 Days (MAU)" value={mauSet.size} color="blue" sub="submitted CME this month" />
      </div>

      {/* Revenue breakdown */}
      <h2 className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Revenue Breakdown</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard label="Pro Active" value={paidPro} color="green" sub="paid subscriptions" />
        <KpiCard label="Employer Active" value={paidEmployer} color="green" sub="paid subscriptions" />
        <KpiCard label="Total Paid" value={paidTotal} color="green" sub="Pro + Employer" />
      </div>

      {/* Signup trend chart */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#111] mb-1">Daily Signups — Last 30 Days</h2>
        <p className="text-xs text-[#64748b] mb-5">{cohort30} signups in this period · {cohortActivated} activated ({pct(cohortActivated, cohort30)}%)</p>
        <BarChart days={signupDays} max={maxSignups} color="#1a56a0" />
      </div>

      {/* CME activity trend chart */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#111] mb-1">Daily CME Submissions — Last 30 Days</h2>
        <p className="text-xs text-[#64748b] mb-5">{(recentCmeRes.data ?? []).length} total CME submissions this period</p>
        <BarChart days={cmeDays} max={maxCme} color="#16a34a" />
      </div>

      {/* Onboarding funnel */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#111] mb-1">Onboarding Funnel — Last 30 Days</h2>
        <p className="text-xs text-[#64748b] mb-5">Where new signups stopped. Completed = reached step 7 and activated.</p>
        <div className="space-y-3">
          {(["complete", "7", "6", "5", "4", "3", "2", "1"] as const).map((step) => {
            const count = stepCounts[step] ?? 0;
            const share = cohort30 > 0 ? Math.round((count / cohort30) * 100) : 0;
            const label = step === "complete" ? "Completed onboarding" : `Stopped at step ${step}`;
            return (
              <div key={step} className="flex items-center gap-3">
                <span className="text-xs text-[#64748b] w-40 flex-shrink-0 truncate">{label}</span>
                <div className="flex-1 bg-[#f1f5f9] rounded-full h-2 min-w-0">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${share}%`,
                      backgroundColor: step === "complete" ? "#16a34a" : "#1a56a0",
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#374151] w-16 text-right flex-shrink-0">
                  {count} ({share}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* NPS widget */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#111] mb-1">Net Promoter Score (NPS) — Last 90 Days</h2>
        <p className="text-xs text-[#64748b] mb-5">{npsTotal} responses · Promoters (9–10) minus Detractors (0–6) ÷ Total × 100</p>
        {npsTotal === 0 ? (
          <p className="text-sm text-[#94a3b8]">No responses yet.</p>
        ) : (
          <div className="flex gap-8 items-start flex-wrap">
            <div className="text-center min-w-[80px]">
              <p className={`text-4xl font-bold ${npsScore !== null && npsScore >= 50 ? "text-[#16a34a]" : npsScore !== null && npsScore >= 0 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
                {npsScore !== null ? (npsScore > 0 ? `+${npsScore}` : npsScore) : "—"}
              </p>
              <p className="text-xs text-[#64748b] mt-1">NPS Score</p>
            </div>
            <div className="flex gap-4 text-center text-sm flex-wrap">
              <div>
                <p className="text-xl font-bold text-[#16a34a]">{npsPromoters}</p>
                <p className="text-xs text-[#64748b]">Promoters<br />(9–10)</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#d97706]">{npsPassives}</p>
                <p className="text-xs text-[#64748b]">Passives<br />(7–8)</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#dc2626]">{npsDetractors}</p>
                <p className="text-xs text-[#64748b]">Detractors<br />(0–6)</p>
              </div>
            </div>
            <div className="flex-1 min-w-[180px]">
              <p className="text-[11px] text-[#64748b] uppercase tracking-wide mb-2">Score distribution</p>
              <div className="flex items-end gap-0.5 h-12">
                {npsDistribution.map(({ score, count }) => {
                  const h = npsMaxBucket > 0 ? Math.max(Math.round((count / npsMaxBucket) * 100), count > 0 ? 8 : 0) : 0;
                  const color = score >= 9 ? "#16a34a" : score >= 7 ? "#d97706" : "#dc2626";
                  return (
                    <div key={score} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="w-full rounded-t-sm" style={{ height: `${h}%`, backgroundColor: color, minHeight: count > 0 ? "3px" : "0" }} />
                      <span className="text-[8px] text-[#94a3b8]">{score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conversion funnel */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-sm font-semibold text-[#111] mb-1">All-Time Conversion Funnel</h2>
        <p className="text-xs text-[#64748b] mb-5">Signup → activation → paying</p>
        <div className="space-y-3">
          {[
            { label: "Signed up", count: totalSignups, share: 100 },
            { label: "Completed onboarding", count: activatedTotal, share: pct(activatedTotal, totalSignups) },
            { label: "Active trial or paid", count: paidTotal + trialingCount, share: pct(paidTotal + trialingCount, totalSignups) },
            { label: "Paying customer", count: paidTotal, share: pct(paidTotal, totalSignups) },
          ].map(({ label, count, share }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-[#64748b] w-48 flex-shrink-0 truncate">{label}</span>
              <div className="flex-1 bg-[#f1f5f9] rounded-full h-2.5 min-w-0">
                <div
                  className="h-2.5 rounded-full bg-[#1a56a0] transition-all"
                  style={{ width: `${share}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[#374151] w-20 text-right flex-shrink-0">
                {count} ({share}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, color, sub }: {
  label: string;
  value: number | string;
  color: "blue" | "green" | "orange";
  sub?: string;
}) {
  const c = { blue: "text-[#1a56a0]", green: "text-[#16a34a]", orange: "text-[#d97706]" }[color];
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${c}`}>{value}</p>
      {sub && <p className="text-xs text-[#94a3b8] mt-1">{sub}</p>}
    </div>
  );
}

function BarChart({ days, max, color }: { days: [string, number][]; max: number; color: string }) {
  const show = days.filter((_, i) => i % 5 === 0 || i === days.length - 1).map(([k]) => k);
  return (
    <div className="flex items-end gap-0.5 h-24">
      {days.map(([day, count]) => {
        const h = max > 0 ? Math.max(Math.round((count / max) * 100), count > 0 ? 4 : 0) : 0;
        return (
          <div key={day} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full rounded-t-sm transition-all"
              style={{ height: `${h}%`, backgroundColor: color, opacity: count > 0 ? 0.8 : 0.15, minHeight: count > 0 ? "3px" : "0" }}
            />
            {show.includes(day) && (
              <span className="text-[9px] text-[#94a3b8] absolute -bottom-4 whitespace-nowrap">{day}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
