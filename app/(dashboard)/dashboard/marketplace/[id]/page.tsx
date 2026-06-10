import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import EnrollButton from "@/components/marketplace/EnrollButton";

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

  const [{ data: course }, { data: enrollment }] = await Promise.all([
    admin
      .from("courses")
      .select("*, training_providers(name, description, is_accredited, accreditor, website_url, logo_url)")
      .eq("id", id)
      .eq("status", "active")
      .maybeSingle(),
    admin
      .from("course_enrollments")
      .select("id, status")
      .eq("course_id", id)
      .eq("professional_id", user.id)
      .maybeSingle(),
  ]);

  if (!course) notFound();

  const provider = Array.isArray(course.training_providers)
    ? course.training_providers[0]
    : course.training_providers as {
        name: string; description: string | null; is_accredited: boolean;
        accreditor: string | null; website_url: string | null; logo_url: string | null;
      } | null;

  const enrolled = !!enrollment && enrollment.status !== "cancelled";
  const completed = enrollment?.status === "completed";

  const deadlinePassed = course.enrollment_deadline && new Date(course.enrollment_deadline) < new Date();

  return (
    <div className="max-w-3xl">
      <div className="mb-4">
        <Link href="/dashboard/marketplace" className="text-sm text-[#64748b] hover:text-[#111]">
          ← Back to Marketplace
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#e2e8f0]">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff6ff] text-[#1a56a0]">
              {course.category}
            </span>
            {provider?.is_accredited && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#dcfce7] text-[#16a34a]">
                Accredited
              </span>
            )}
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#f1f5f9] text-[#374151] capitalize">
              {course.delivery_mode.replace("_", " ")}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#111] mb-1">{course.title}</h1>
          {provider && (
            <p className="text-sm text-[#64748b]">by {provider.name}</p>
          )}
        </div>

        {/* Key facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-[#e2e8f0] border-b border-[#e2e8f0]">
          <div className="p-4">
            <p className="text-xs text-[#64748b] mb-1">CME Credits</p>
            <p className="text-lg font-bold text-[#1a56a0]">+{course.credits} {course.credit_type}</p>
          </div>
          <div className="p-4">
            <p className="text-xs text-[#64748b] mb-1">Price</p>
            <p className="text-lg font-bold text-[#111]">
              {course.is_free ? "Free" : `$${course.price_usd}`}
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs text-[#64748b] mb-1">Duration</p>
            <p className="text-lg font-bold text-[#111]">
              {course.duration_hours ? `${course.duration_hours}h` : "—"}
            </p>
          </div>
          <div className="p-4">
            <p className="text-xs text-[#64748b] mb-1">
              {course.end_date ? "End Date" : "Enroll By"}
            </p>
            <p className="text-sm font-semibold text-[#111]">
              {course.end_date
                ? new Date(course.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                : course.enrollment_deadline
                ? new Date(course.enrollment_deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                : "Open"}
            </p>
          </div>
        </div>

        {/* Description */}
        {course.description && (
          <div className="p-6 border-b border-[#e2e8f0]">
            <h2 className="text-sm font-semibold text-[#111] mb-2">About this course</h2>
            <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{course.description}</p>
          </div>
        )}

        {/* Provider info */}
        {provider && (
          <div className="p-6 border-b border-[#e2e8f0]">
            <h2 className="text-sm font-semibold text-[#111] mb-2">Provider</h2>
            <div className="flex items-start gap-3">
              <div>
                <p className="text-sm font-medium text-[#111]">{provider.name}</p>
                {provider.is_accredited && provider.accreditor && (
                  <p className="text-xs text-[#16a34a] mt-0.5">Accredited by {provider.accreditor}</p>
                )}
                {provider.description && (
                  <p className="text-xs text-[#64748b] mt-1">{provider.description}</p>
                )}
                {provider.website_url && (
                  <a
                    href={provider.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#1a56a0] hover:underline mt-1 block"
                  >
                    Visit website →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enroll CTA */}
        <div className="p-6">
          {deadlinePassed && !enrolled ? (
            <p className="text-sm text-[#dc2626]">Enrollment deadline has passed.</p>
          ) : (
            <EnrollButton courseId={course.id} enrolled={enrolled} completed={completed} />
          )}
        </div>
      </div>
    </div>
  );
}
