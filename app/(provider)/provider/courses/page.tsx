import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "My Courses — Provider Portal" };

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-[#f1f5f9] text-[#64748b]",
  active: "bg-[#dcfce7] text-[#16a34a]",
  closed: "bg-[#fff7ed] text-[#d97706]",
  cancelled: "bg-[#fef2f2] text-[#dc2626]",
};

export default async function ProviderCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: provider } = await admin
    .from("training_providers")
    .select("id")
    .eq("created_by", user.id)
    .eq("status", "active")
    .single();

  if (!provider) redirect("/provider/register");

  const { data: courses } = await admin
    .from("courses")
    .select("id, title, category, credits, credit_type, delivery_mode, is_free, price_usd, status, created_at")
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: false });

  const courseList = courses ?? [];

  // Enrollment counts
  const courseIds = courseList.map((c) => c.id);
  const enrollmentCounts: Record<string, number> = {};
  if (courseIds.length > 0) {
    const { data: counts } = await admin
      .from("course_enrollments")
      .select("course_id")
      .in("course_id", courseIds)
      .neq("status", "cancelled");
    (counts ?? []).forEach((e) => {
      enrollmentCounts[e.course_id] = (enrollmentCounts[e.course_id] ?? 0) + 1;
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Courses</h1>
          <p className="text-sm text-[#64748b] mt-1">{courseList.length} courses</p>
        </div>
        <Link
          href="/provider/courses/new"
          className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors font-medium"
        >
          + New Course
        </Link>
      </div>

      {courseList.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <h2 className="text-base font-semibold text-[#111] mb-2">No courses yet</h2>
          <p className="text-sm text-[#64748b] mb-4">Create your first CME course to get started.</p>
          <Link
            href="/provider/courses/new"
            className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors"
          >
            + New Course
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="divide-y divide-[#e2e8f0]">
            {courseList.map((course) => (
              <div key={course.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/provider/courses/${course.id}`}
                    className="text-sm font-medium text-[#111] hover:text-[#1a56a0] hover:underline"
                  >
                    {course.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#64748b]">{course.category}</span>
                    <span className="text-xs text-[#94a3b8]">·</span>
                    <span className="text-xs font-semibold text-[#1a56a0]">+{course.credits} {course.credit_type}</span>
                    <span className="text-xs text-[#94a3b8]">·</span>
                    <span className="text-xs text-[#64748b] capitalize">{course.delivery_mode.replace("_", " ")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-[#64748b]">
                    {enrollmentCounts[course.id] ?? 0} enrolled
                  </span>
                  <span className="text-sm font-medium text-[#111]">
                    {course.is_free ? "Free" : `$${course.price_usd}`}
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[course.status]}`}>
                    {course.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
