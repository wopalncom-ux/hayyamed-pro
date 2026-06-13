import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RequireCourseButton, UnrequireCourseButton } from "@/components/employer/RequireCourseButton";

export const metadata = { title: "Required Training — Employer" };

export default async function RequiredTrainingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) redirect("/employer/register");

  const orgId = (member as { organization_id: string }).organization_id;

  // Get staff count
  const { count: staffCount } = await admin
    .from("employer_link_requests")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const staffIds = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const staffProfessionalIds = (staffIds.data ?? []).map((s) => s.professional_id as string);

  // Get required courses for this org
  const { data: requirements } = await admin
    .from("employer_required_courses")
    .select("id, course_id, due_date, note, created_at, courses(id, title, category, credits, credit_type, delivery_mode, training_providers(name))")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  const reqs = requirements ?? [];
  const requiredCourseIds = new Set(reqs.map((r) => r.course_id));

  // For each required course, count completions among staff
  const completionCounts: Record<string, { enrolled: number; completed: number }> = {};
  if (reqs.length > 0 && staffProfessionalIds.length > 0) {
    const reqCourseIds = reqs.map((r) => r.course_id);
    const { data: enrollments } = await admin
      .from("course_enrollments")
      .select("course_id, professional_id, status")
      .in("course_id", reqCourseIds)
      .in("professional_id", staffProfessionalIds)
      .neq("status", "cancelled");

    (enrollments ?? []).forEach((e) => {
      if (!completionCounts[e.course_id]) completionCounts[e.course_id] = { enrolled: 0, completed: 0 };
      completionCounts[e.course_id].enrolled++;
      if (e.status === "completed") completionCounts[e.course_id].completed++;
    });
  }

  // Get all active marketplace courses (excluding already required)
  const { data: allCourses } = await admin
    .from("courses")
    .select("id, title, category, credits, credit_type, delivery_mode, is_free, price_usd, training_providers(name, is_accredited)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(50);

  const availableCourses = (allCourses ?? []).filter((c) => !requiredCourseIds.has(c.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Required Training</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Assign mandatory courses for your {staffCount ?? 0} staff members.
          </p>
        </div>
        <a href="/employer" className="text-sm text-[#1a56a0] hover:underline">← Dashboard</a>
      </div>

      {/* Currently required courses */}
      {reqs.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] mb-8">
          <div className="px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#111]">Required Courses</h2>
            <p className="text-xs text-[#64748b] mt-0.5">{reqs.length} assigned · {staffCount ?? 0} staff</p>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {reqs.map((req) => {
              const course = Array.isArray(req.courses) ? req.courses[0] : req.courses as {
                id: string; title: string; category: string; credits: number;
                credit_type: string; delivery_mode: string;
                training_providers: { name: string } | { name: string }[] | null;
              } | null;
              const provider = course ? (Array.isArray(course.training_providers) ? course.training_providers[0] : course.training_providers as { name: string } | null) : null;
              const stats = completionCounts[req.course_id] ?? { enrolled: 0, completed: 0 };
              const pct = (staffCount ?? 0) > 0 ? Math.round((stats.completed / (staffCount ?? 1)) * 100) : 0;
              const overdue = req.due_date && new Date(req.due_date) < new Date();

              return (
                <div key={req.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[#111]">{course?.title ?? "—"}</p>
                      {req.due_date && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          overdue ? "bg-[#fef2f2] text-[#dc2626]" : "bg-[#f1f5f9] text-[#64748b]"
                        }`}>
                          {overdue ? "Overdue" : `Due ${req.due_date}`}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748b]">
                      {provider?.name ?? "—"} · {course?.category} · +{course?.credits} {course?.credit_type}
                    </p>
                  </div>

                  {/* Completion progress */}
                  <div className="flex items-center gap-3 flex-shrink-0 min-w-[160px]">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#64748b]">{stats.completed}/{staffCount ?? 0} done</span>
                        <span className={`text-xs font-semibold ${pct === 100 ? "text-[#16a34a]" : pct >= 50 ? "text-[#d97706]" : "text-[#dc2626]"}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#e2e8f0] rounded-full">
                        <div
                          className={`h-1.5 rounded-full ${pct === 100 ? "bg-[#16a34a]" : "bg-[#1a56a0]"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <UnrequireCourseButton requirementId={req.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add from marketplace */}
      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Add from Marketplace</h2>
          <p className="text-xs text-[#64748b] mt-0.5">Select an active course to require for all staff.</p>
        </div>

        {availableCourses.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">
            {allCourses?.length === 0
              ? "No active marketplace courses yet. Check back after the admin activates courses."
              : "All active courses are already required."}
          </div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {availableCourses.map((course) => {
              const provider = Array.isArray(course.training_providers)
                ? course.training_providers[0]
                : course.training_providers as { name: string; is_accredited: boolean } | null;

              return (
                <div key={course.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[#111]">{course.title}</p>
                      {provider?.is_accredited && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-[#dcfce7] text-[#16a34a]">Accredited</span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748b]">
                      {provider?.name ?? "—"} · {course.category} · +{course.credits} {course.credit_type}
                      · {course.is_free ? "Free" : `$${course.price_usd}`}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <RequireCourseButton courseId={course.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
