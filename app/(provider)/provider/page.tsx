import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Provider Dashboard — Hayya Med Pro" };

export default async function ProviderDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: provider } = await admin
    .from("training_providers")
    .select("id, name, is_accredited, accreditor, country_code, status")
    .eq("created_by", user.id)
    .eq("status", "active")
    .single();

  if (!provider) redirect("/provider/register");

  const [activeCourses, totalEnrollments, completions] = await Promise.all([
    admin.from("courses").select("id", { count: "exact", head: true }).eq("provider_id", provider.id).eq("status", "active"),
    admin.from("course_enrollments").select("id", { count: "exact", head: true }).in(
      "course_id",
      (await admin.from("courses").select("id").eq("provider_id", provider.id)).data?.map((c) => c.id) ?? []
    ),
    admin.from("course_enrollments").select("id", { count: "exact", head: true }).eq("status", "completed").in(
      "course_id",
      (await admin.from("courses").select("id").eq("provider_id", provider.id)).data?.map((c) => c.id) ?? []
    ),
  ]);

  const recentEnrollmentsRes = await admin
    .from("course_enrollments")
    .select("id, status, enrolled_at, professional_id, courses(title)")
    .in(
      "course_id",
      (await admin.from("courses").select("id").eq("provider_id", provider.id)).data?.map((c) => c.id) ?? []
    )
    .order("enrolled_at", { ascending: false })
    .limit(5);

  const recent = recentEnrollmentsRes.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">{provider.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            {provider.is_accredited && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a]">
                Accredited{provider.accreditor ? ` · ${provider.accreditor}` : ""}
              </span>
            )}
            <span className="text-xs text-[#64748b]">{provider.country_code}</span>
          </div>
        </div>
        <Link
          href="/provider/courses/new"
          className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors font-medium"
        >
          + New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Active Courses</p>
          <p className="text-3xl font-bold text-[#1a56a0]">{activeCourses.count ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Total Enrollments</p>
          <p className="text-3xl font-bold text-[#1a56a0]">{totalEnrollments.count ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Completions</p>
          <p className="text-3xl font-bold text-[#16a34a]">{completions.count ?? 0}</p>
        </div>
      </div>

      {/* Recent enrollments */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Recent Enrollments</h2>
          <Link href="/provider/courses" className="text-sm text-[#1a56a0] hover:underline">
            View all courses →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">
            No enrollments yet. <Link href="/provider/courses/new" className="text-[#1a56a0] hover:underline">Add your first course</Link>.
          </div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {recent.map((e) => {
              const course = Array.isArray(e.courses) ? e.courses[0] : e.courses as { title: string } | null;
              return (
                <div key={e.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#111]">{course?.title ?? "—"}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">
                      {new Date(e.enrolled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    e.status === "completed"
                      ? "bg-[#dcfce7] text-[#16a34a]"
                      : "bg-[#eff6ff] text-[#1a56a0]"
                  }`}>
                    {e.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
