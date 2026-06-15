import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import WeeklyEnrollmentChart, { WeekBucket } from "@/components/provider/WeeklyEnrollmentChart";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics — Hayya Med Pro Provider" };

function pct(num: number, den: number) {
  return den > 0 ? Math.round((num / den) * 100) : 0;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default async function ProviderAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: provider } = await admin
    .from("training_providers")
    .select("id, name")
    .eq("created_by", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!provider) redirect("/provider/register");

  const now = new Date();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400_000).toISOString();
  const sixtyDaysAgo  = new Date(Date.now() - 60 * 86400_000).toISOString();
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400_000).toISOString();

  // Fetch all data in parallel
  const [coursesRes, allEnrollmentsRes, recentEnrollmentsRes] = await Promise.all([
    admin
      .from("courses")
      .select("id, title, status, cme_credits, category, created_at")
      .eq("provider_id", provider.id)
      .order("created_at", { ascending: false }),

    admin
      .from("course_enrollments")
      .select("id, course_id, status, enrolled_at, completed_at, professional_id")
      .eq("courses.provider_id", provider.id)
      .order("enrolled_at", { ascending: false })
      // Supabase requires join filter differently — use RPC or filter by course IDs below
    ,

    admin
      .from("course_enrollments")
      .select("id, course_id, status, enrolled_at, completed_at, professional_id")
      .gte("enrolled_at", ninetyDaysAgo)
      .order("enrolled_at", { ascending: false }),
  ]);

  const courses = coursesRes.data ?? [];
  const courseIds = courses.map((c) => c.id);

  // Filter enrollments to only this provider's courses
  const allEnrollments = courseIds.length
    ? (await admin
        .from("course_enrollments")
        .select("id, course_id, status, enrolled_at, completed_at, professional_id")
        .in("course_id", courseIds)
        .order("enrolled_at", { ascending: false })
      ).data ?? []
    : [];

  // Fetch country+profession breakdown for enrolled professionals
  const professionalIds = [...new Set(allEnrollments.map((e) => e.professional_id).filter(Boolean))];
  const profilesData = professionalIds.length
    ? (await admin
        .from("professional_profiles")
        .select("auth_id, country, profession")
        .in("auth_id", professionalIds)
      ).data ?? []
    : [];

  const profileMap = Object.fromEntries(profilesData.map((p) => [p.auth_id, p]));

  // ── Core metrics ─────────────────────────────────────────────────────────────
  const totalEnrollments = allEnrollments.length;
  const totalCompletions = allEnrollments.filter((e) => e.status === "completed").length;
  const overallCompletionRate = pct(totalCompletions, totalEnrollments);

  // This month vs last month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const thisMonthEnrollments = allEnrollments.filter((e) => e.enrolled_at >= monthStart).length;
  const lastMonthEnrollments = allEnrollments.filter((e) => e.enrolled_at >= lastMonthStart && e.enrolled_at < monthStart).length;
  const monthGrowthPct = lastMonthEnrollments > 0
    ? Math.round(((thisMonthEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100)
    : null;

  // Credit hours delivered (completions × credits)
  const courseCreditsMap = Object.fromEntries(courses.map((c) => [c.id, c.cme_credits ?? 0]));
  const creditHoursDelivered = allEnrollments
    .filter((e) => e.status === "completed")
    .reduce((sum, e) => sum + (courseCreditsMap[e.course_id] ?? 0), 0);

  // ── 4-week enrollment trend ───────────────────────────────────────────────────
  const weekBuckets: WeekBucket[] = [];
  for (let i = 3; i >= 0; i--) {
    const weekEnd   = new Date(Date.now() - i * 7 * 86400_000);
    const weekStart = new Date(Date.now() - (i + 1) * 7 * 86400_000);
    const label = `${weekEnd.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
    const count = allEnrollments.filter((e) => {
      const d = new Date(e.enrolled_at);
      return d >= weekStart && d < weekEnd;
    }).length;
    weekBuckets.push({ label, count });
  }

  // ── 30-day daily trend ────────────────────────────────────────────────────────
  const dailyCounts: Record<string, number> = {};
  const recentEnrollments = allEnrollments.filter((e) => e.enrolled_at >= thirtyDaysAgo);
  for (const e of recentEnrollments) {
    const day = e.enrolled_at.slice(0, 10);
    dailyCounts[day] = (dailyCounts[day] ?? 0) + 1;
  }
  const last30Days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    last30Days.push(new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10));
  }
  const maxDaily = Math.max(...last30Days.map((d) => dailyCounts[d] ?? 0), 1);

  // ── Per-course performance table ─────────────────────────────────────────────
  const coursePerf = courses.map((c) => {
    const enrolled = allEnrollments.filter((e) => e.course_id === c.id);
    const completed = enrolled.filter((e) => e.status === "completed").length;
    const thisMonth = enrolled.filter((e) => e.enrolled_at >= monthStart).length;
    const credits = (c.cme_credits ?? 0) * completed;
    return {
      id: c.id,
      title: c.title,
      status: c.status,
      cme_credits: c.cme_credits ?? 0,
      enrolled: enrolled.length,
      completed,
      completionRate: pct(completed, enrolled.length),
      creditsDelivered: credits,
      thisMonth,
    };
  }).sort((a, b) => b.enrolled - a.enrolled);

  // ── Country breakdown ─────────────────────────────────────────────────────────
  const countryCounts: Record<string, number> = {};
  for (const e of allEnrollments) {
    const country = profileMap[e.professional_id]?.country ?? "Unknown";
    countryCounts[country] = (countryCounts[country] ?? 0) + 1;
  }
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // ── Profession breakdown ──────────────────────────────────────────────────────
  const professionCounts: Record<string, number> = {};
  for (const e of allEnrollments) {
    const profession = profileMap[e.professional_id]?.profession ?? "Unknown";
    professionCounts[profession] = (professionCounts[profession] ?? 0) + 1;
  }
  const topProfessions = Object.entries(professionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxCountry    = topCountries[0]?.[1] ?? 1;
  const maxProfession = topProfessions[0]?.[1] ?? 1;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1f3d] mb-1">Analytics</h1>
          <p className="text-sm text-[#64748b]">
            Enrollment performance, completion rates, and learner demographics across all your courses.
          </p>
        </div>
        <span className="text-xs text-[#94a3b8] mt-1 whitespace-nowrap">
          Updated {now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Total Enrollments</p>
          <p className="text-3xl font-bold text-[#1a56a0]">{totalEnrollments.toLocaleString()}</p>
          <p className="text-xs text-[#94a3b8] mt-1">all time</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">This Month</p>
          <p className="text-3xl font-bold text-[#0f1f3d]">{thisMonthEnrollments}</p>
          {monthGrowthPct !== null && (
            <p className={`text-xs mt-1 font-medium ${monthGrowthPct >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
              {monthGrowthPct >= 0 ? "+" : ""}{monthGrowthPct}% vs last month
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Completion Rate</p>
          <p className={`text-3xl font-bold ${overallCompletionRate >= 70 ? "text-[#16a34a]" : overallCompletionRate >= 40 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
            {overallCompletionRate}%
          </p>
          <p className="text-xs text-[#94a3b8] mt-1">{totalCompletions} completions</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">CME Credits Delivered</p>
          <p className="text-3xl font-bold text-[#0f1f3d]">{creditHoursDelivered.toLocaleString()}</p>
          <p className="text-xs text-[#94a3b8] mt-1">via completed courses</p>
        </div>
      </div>

      {/* 30-day enrollment trend */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
        <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">Daily enrollments — last 30 days</h2>
        {recentEnrollments.length === 0 ? (
          <p className="text-sm text-[#94a3b8]">No enrollments in the last 30 days.</p>
        ) : (
          <div className="flex items-end gap-0.5 h-20 overflow-x-auto">
            {last30Days.map((day) => {
              const count = dailyCounts[day] ?? 0;
              const heightPct = (count / maxDaily) * 100;
              const isToday = day === now.toISOString().slice(0, 10);
              const dayLabel = new Date(day + "T12:00:00Z").getDate();
              return (
                <div key={day} className="flex flex-col items-center flex-1 min-w-[8px] gap-0.5" title={`${day}: ${count}`}>
                  <div
                    className={`w-full rounded-t-sm transition-all ${isToday ? "bg-[#d97706]" : count > 0 ? "bg-[#1a56a0]" : "bg-[#f1f5f9]"}`}
                    style={{ height: `${Math.max(heightPct, count > 0 ? 4 : 2)}%` }}
                  />
                  {(dayLabel === 1 || dayLabel % 7 === 0) && (
                    <span className="text-[8px] text-[#94a3b8]">{dayLabel}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Course performance table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-sm font-semibold text-[#0f1f3d]">Course performance</h2>
        </div>
        {coursePerf.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-[#94a3b8]">No courses yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  <th className="text-left text-xs text-[#64748b] px-6 py-3 font-medium">Course</th>
                  <th className="text-right text-xs text-[#64748b] px-4 py-3 font-medium">Enrolled</th>
                  <th className="text-right text-xs text-[#64748b] px-4 py-3 font-medium">Completed</th>
                  <th className="text-right text-xs text-[#64748b] px-4 py-3 font-medium">Rate</th>
                  <th className="text-right text-xs text-[#64748b] px-4 py-3 font-medium">Credits delivered</th>
                  <th className="text-right text-xs text-[#64748b] px-6 py-3 font-medium">This month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {coursePerf.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-medium text-[#0f1f3d] truncate max-w-[220px]">{c.title}</p>
                      <p className="text-xs text-[#94a3b8]">{c.cme_credits} credits · {c.status}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#0f1f3d]">{c.enrolled}</td>
                    <td className="px-4 py-3 text-right text-[#16a34a] font-medium">{c.completed}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        c.completionRate >= 70 ? "bg-[#dcfce7] text-[#15803d]"
                        : c.completionRate >= 40 ? "bg-[#fef9c3] text-[#92400e]"
                        : c.enrolled === 0 ? "bg-[#f1f5f9] text-[#94a3b8]"
                        : "bg-[#fee2e2] text-[#dc2626]"
                      }`}>
                        {c.completionRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#64748b] font-medium">{c.creditsDelivered}</td>
                    <td className="px-6 py-3 text-right">
                      {c.thisMonth > 0 ? (
                        <span className="text-xs font-semibold text-[#1a56a0]">+{c.thisMonth}</span>
                      ) : (
                        <span className="text-xs text-[#94a3b8]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Country + Profession breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">Learners by country</h2>
          {topCountries.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">No enrollment data yet.</p>
          ) : (
            <div className="space-y-3">
              {topCountries.map(([country, count]) => (
                <div key={country}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#374151]">{country}</span>
                    <span className="text-xs text-[#64748b]">{count} ({pct(count, totalEnrollments)}%)</span>
                  </div>
                  <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a56a0] rounded-full" style={{ width: `${pct(count, maxCountry)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">Learners by profession</h2>
          {topProfessions.length === 0 ? (
            <p className="text-sm text-[#94a3b8]">No enrollment data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProfessions.map(([profession, count]) => (
                <div key={profession}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[#374151] capitalize">{profession.replace(/_/g, " ")}</span>
                    <span className="text-xs text-[#64748b]">{count} ({pct(count, totalEnrollments)}%)</span>
                  </div>
                  <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#d97706] rounded-full" style={{ width: `${pct(count, maxProfession)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4-week trend */}
      {weekBuckets.some((b) => b.count > 0) && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">Weekly enrollment trend</h2>
          <WeeklyEnrollmentChart data={weekBuckets} />
        </div>
      )}

      {totalEnrollments === 0 && (
        <div className="mt-4 bg-[#fffbeb] border border-[#fde68a] rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-[#92400e]">No enrollments yet.</p>
          <p className="text-xs text-[#92400e] mt-1">
            Analytics will populate as learners enroll in your courses.
            Make sure your courses are published and visible in the marketplace.
          </p>
        </div>
      )}
    </div>
  );
}
