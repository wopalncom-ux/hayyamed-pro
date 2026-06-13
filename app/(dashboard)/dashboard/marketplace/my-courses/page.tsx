import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import MarkCourseCompleteButton from "@/components/marketplace/MarkCourseCompleteButton";

export const metadata = {
  title: "My Courses — Hayya Med Pro",
};

export default async function MyCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // Get enrollments and approved employer org in parallel
  const [enrollmentsRes, employerLinkRes] = await Promise.all([
    admin
      .from("course_enrollments")
      .select("id, status, enrolled_at, completed_at, credits_issued, courses(id, title, category, credits, credit_type, delivery_mode, training_providers(name))")
      .eq("professional_id", user.id)
      .neq("status", "cancelled")
      .order("enrolled_at", { ascending: false }),
    admin
      .from("employer_link_requests")
      .select("organization_id")
      .eq("professional_id", user.id)
      .eq("status", "approved")
      .maybeSingle(),
  ]);

  const all = enrollmentsRes.data ?? [];
  const orgId = (employerLinkRes.data as { organization_id: string } | null)?.organization_id ?? null;

  // Get employer-required courses for this org
  const requiredMap = new Map<string, { due_date: string | null; org_name: string }>();
  if (orgId) {
    const [reqRes, orgRes] = await Promise.all([
      admin.from("employer_required_courses").select("course_id, due_date").eq("org_id", orgId),
      admin.from("organizations").select("name").eq("id", orgId).maybeSingle(),
    ]);
    const orgName = (orgRes.data as { name: string } | null)?.name ?? "Your employer";
    (reqRes.data ?? []).forEach((r) => {
      requiredMap.set(r.course_id as string, { due_date: r.due_date as string | null, org_name: orgName });
    });
  }

  // Required courses not yet enrolled in
  const enrolledCourseIds = new Set(all.map((e) => {
    const c = Array.isArray(e.courses) ? e.courses[0] : e.courses as { id: string } | null;
    return c?.id;
  }));

  const unenrolledRequiredIds = [...requiredMap.keys()].filter((id) => !enrolledCourseIds.has(id));

  // Fetch unenrolled required course details
  let unenrolledRequired: { id: string; title: string; category: string; credits: number; credit_type: string; training_providers: { name: string } | null }[] = [];
  if (unenrolledRequiredIds.length > 0) {
    const { data: reqCourses } = await admin
      .from("courses")
      .select("id, title, category, credits, credit_type, training_providers(name)")
      .in("id", unenrolledRequiredIds);
    unenrolledRequired = (reqCourses ?? []) as unknown as typeof unenrolledRequired;
  }

  const active = all.filter((e) => e.status !== "completed");
  const completed = all.filter((e) => e.status === "completed");

  function EnrollmentRow({ e }: { e: typeof all[0] }) {
    const course = Array.isArray(e.courses) ? e.courses[0] : e.courses as {
      id: string; title: string; category: string; credits: number;
      credit_type: string; delivery_mode: string;
      training_providers: { name: string } | { name: string }[] | null;
    } | null;
    const provider = course
      ? (Array.isArray(course.training_providers) ? course.training_providers[0] : course.training_providers as { name: string } | null)
      : null;
    const req = course ? requiredMap.get(course.id) : undefined;
    const overdue = req?.due_date && new Date(req.due_date) < new Date();

    return (
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <Link
              href={`/dashboard/marketplace/${course?.id}`}
              className="text-sm font-medium text-[#111] hover:text-[#1a56a0] hover:underline line-clamp-1"
            >
              {course?.title ?? "—"}
            </Link>
            {req && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                overdue ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#fff7ed] text-[#d97706]"
              }`}>
                Required{req.due_date ? ` · Due ${req.due_date}` : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-[#64748b]">{provider?.name ?? "—"}</p>
            {course?.category && (
              <>
                <span className="text-xs text-[#94a3b8]">·</span>
                <span className="text-xs text-[#64748b]">{course.category}</span>
              </>
            )}
          </div>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Enrolled {new Date(e.enrolled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            {e.completed_at && (
              <> · Completed {new Date(e.completed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-[#1a56a0]">
            +{e.credits_issued ?? course?.credits} {course?.credit_type}
          </span>
          {e.status === "completed" ? (
            <span className="text-xs bg-[#dcfce7] text-[#16a34a] font-medium px-2.5 py-1 rounded-full">
              Completed
            </span>
          ) : (
            <MarkCourseCompleteButton enrollmentId={e.id} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">My Courses</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {all.length} course{all.length !== 1 ? "s" : ""} · {completed.length} completed
            {requiredMap.size > 0 && ` · ${requiredMap.size} required by employer`}
          </p>
        </div>
        <Link href="/dashboard/marketplace" className="text-sm text-[#1a56a0] hover:underline">
          ← Browse marketplace
        </Link>
      </div>

      {/* Unenrolled required courses — call to action */}
      {unenrolledRequired.length > 0 && (
        <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-[#92400e] mb-3">
            {unenrolledRequired.length} required course{unenrolledRequired.length > 1 ? "s" : ""} — not yet enrolled
          </h2>
          <div className="space-y-2">
            {unenrolledRequired.map((c) => {
              const req = requiredMap.get(c.id);
              const provider = Array.isArray(c.training_providers) ? c.training_providers[0] : c.training_providers;
              return (
                <div key={c.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#111]">{c.title}</p>
                    <p className="text-xs text-[#64748b]">
                      {provider?.name ?? "—"} · +{c.credits} {c.credit_type}
                      {req?.due_date && ` · Due ${req.due_date}`}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/marketplace/${c.id}`}
                    className="text-xs bg-[#d97706] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#b45309] transition-colors whitespace-nowrap"
                  >
                    Enroll →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {all.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h2 className="text-base font-semibold text-[#111] mb-2">No enrollments yet</h2>
          <p className="text-sm text-[#64748b] mb-4">Browse accredited CME courses to get started.</p>
          <Link
            href="/dashboard/marketplace"
            className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {active.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e2e8f0]">
              <div className="px-6 py-4 border-b border-[#e2e8f0]">
                <h2 className="text-base font-semibold text-[#111]">In Progress</h2>
              </div>
              <div className="divide-y divide-[#e2e8f0]">
                {active.map((e) => <EnrollmentRow key={e.id} e={e} />)}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e2e8f0]">
              <div className="px-6 py-4 border-b border-[#e2e8f0]">
                <h2 className="text-base font-semibold text-[#111]">Completed</h2>
              </div>
              <div className="divide-y divide-[#e2e8f0]">
                {completed.map((e) => <EnrollmentRow key={e.id} e={e} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
