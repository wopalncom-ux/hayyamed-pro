import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import CourseForm from "@/components/provider/CourseForm";
import ProviderMarkCompleteButton from "@/components/provider/ProviderMarkCompleteButton";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  const { data: course } = await admin
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("provider_id", provider.id)
    .maybeSingle();

  if (!course) notFound();

  const { data: enrollments } = await admin
    .from("course_enrollments")
    .select("id, status, enrolled_at, completed_at, credits_issued, professional_id")
    .eq("course_id", id)
    .neq("status", "cancelled")
    .order("enrolled_at", { ascending: false });

  // Fetch professional names
  const profIds = (enrollments ?? []).map((e) => e.professional_id);
  const profileMap: Record<string, string> = {};
  if (profIds.length > 0) {
    const { data: profiles } = await admin
      .from("professional_profiles")
      .select("auth_id, full_name")
      .in("auth_id", profIds);
    (profiles ?? []).forEach((p) => { profileMap[p.auth_id] = p.full_name ?? "—"; });
  }

  const allEnrollments = enrollments ?? [];
  const pendingEnrollments = allEnrollments.filter((e) => e.status !== "completed");
  const completedEnrollments = allEnrollments.filter((e) => e.status === "completed");

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/provider/courses" className="text-sm text-[#64748b] hover:text-[#111]">
          ← Courses
        </Link>
        <span className="text-[#e2e8f0]">/</span>
        <span className="text-sm text-[#111] font-medium line-clamp-1">{course.title}</span>
      </div>

      {/* Enrollments panel */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Enrollments</h2>
          <p className="text-xs text-[#64748b] mt-0.5">
            {allEnrollments.length} total · {completedEnrollments.length} completed
          </p>
        </div>

        {allEnrollments.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">No enrollments yet.</div>
        ) : (
          <>
            {pendingEnrollments.length > 0 && (
              <div>
                <div className="px-6 py-2 bg-[#f8fafc] border-b border-[#e2e8f0]">
                  <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide">In Progress</p>
                </div>
                <div className="divide-y divide-[#e2e8f0]">
                  {pendingEnrollments.map((e) => (
                    <div key={e.id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#111]">{profileMap[e.professional_id] ?? "—"}</p>
                        <p className="text-xs text-[#94a3b8]">
                          Enrolled {new Date(e.enrolled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <ProviderMarkCompleteButton enrollmentId={e.id} professionalId={e.professional_id} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {completedEnrollments.length > 0 && (
              <div>
                <div className="px-6 py-2 bg-[#f8fafc] border-b border-[#e2e8f0]">
                  <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide">Completed</p>
                </div>
                <div className="divide-y divide-[#e2e8f0]">
                  {completedEnrollments.map((e) => (
                    <div key={e.id} className="px-6 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#111]">{profileMap[e.professional_id] ?? "—"}</p>
                        <p className="text-xs text-[#94a3b8]">
                          Completed {e.completed_at ? new Date(e.completed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </p>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#16a34a]">
                        +{e.credits_issued} credits issued
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit form */}
      <div>
        <h2 className="text-base font-semibold text-[#111] mb-4">Edit Course</h2>
        <CourseForm
          providerId={provider.id}
          initial={{
            id: course.id,
            title: course.title,
            description: course.description,
            category: course.category,
            credits: course.credits,
            credit_type: course.credit_type,
            delivery_mode: course.delivery_mode,
            duration_hours: course.duration_hours,
            price_usd: course.price_usd,
            is_free: course.is_free,
            country_codes: course.country_codes,
            start_date: course.start_date,
            end_date: course.end_date,
            enrollment_deadline: course.enrollment_deadline,
            max_enrollments: course.max_enrollments,
            status: course.status,
          }}
        />
      </div>
    </div>
  );
}
