import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Required Training — University Portal" };

export default async function UniversityRequiredTrainingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "university_admin")
    .maybeSingle();

  if (!member) redirect("/dashboard");

  const orgId = member.organization_id;

  const { data: required } = await admin
    .from("employer_required_courses")
    .select("id, course_id, department, due_date, created_at, courses(title, credits, credit_type, delivery_mode)")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const courses = required ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Required Training</h1>
          <p className="text-sm text-[#64748b] mt-1">Assign mandatory CME courses to faculty by school or department.</p>
        </div>
      </div>

      <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold text-[#1e40af] mb-1">How required training works</p>
        <p className="text-xs text-[#374151] leading-relaxed">
          Assign a marketplace course as required for your institution or a specific department.
          Faculty see a &quot;Required&quot; badge on their dashboard and get notified of upcoming deadlines.
          Completion is automatically tracked when they finish the course on the marketplace.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0]">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#111]">Assigned Courses</h2>
          <Link
            href="/dashboard/marketplace"
            className="text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors font-medium"
          >
            Browse marketplace →
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-base font-semibold text-[#111] mb-2">No required courses assigned</h3>
            <p className="text-sm text-[#64748b] max-w-sm mx-auto mb-6">
              Browse the marketplace and assign mandatory CME courses to your faculty.
            </p>
            <Link
              href="/dashboard/marketplace"
              className="inline-block text-sm bg-[#1a56a0] text-white px-5 py-2.5 rounded-lg hover:bg-[#1547a0] transition-colors font-medium"
            >
              Browse CME marketplace
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {courses.map((r) => {
              const course = Array.isArray(r.courses) ? r.courses[0] : r.courses as { title: string; credits: number; credit_type: string; delivery_mode: string } | null;
              const daysUntilDue = r.due_date
                ? Math.ceil((new Date(r.due_date).getTime() - Date.now()) / 86400000)
                : null;

              return (
                <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111]">{course?.title ?? "—"}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs font-semibold text-[#1a56a0]">+{course?.credits} {course?.credit_type}</span>
                      <span className="text-xs text-[#94a3b8]">·</span>
                      <span className="text-xs text-[#64748b] capitalize">{course?.delivery_mode?.replace("_", " ")}</span>
                      {r.department && (
                        <>
                          <span className="text-xs text-[#94a3b8]">·</span>
                          <span className="text-xs bg-[#f1f5f9] text-[#374151] px-1.5 py-0.5 rounded font-medium">{r.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {daysUntilDue !== null ? (
                      <span className={`text-xs font-medium ${
                        daysUntilDue < 0 ? "text-[#dc2626]" :
                        daysUntilDue <= 14 ? "text-[#dc2626]" :
                        daysUntilDue <= 30 ? "text-[#d97706]" : "text-[#16a34a]"
                      }`}>
                        {daysUntilDue < 0 ? "OVERDUE" : `Due in ${daysUntilDue}d`}
                      </span>
                    ) : (
                      <span className="text-xs text-[#94a3b8]">No deadline</span>
                    )}
                    <p className="text-xs text-[#94a3b8] mt-0.5">
                      Assigned {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
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
