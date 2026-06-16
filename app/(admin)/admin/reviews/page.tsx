import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReviewModerationClient from "./ReviewModerationClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Course Reviews — Admin" };

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ course_id?: string; rating?: string }>;
}) {
  const sp = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // Fetch all reviews with course title and reviewer profession
  let query = admin
    .from("course_reviews")
    .select("id, course_id, reviewer_id, rating, review_text, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (sp.rating) query = query.eq("rating", parseInt(sp.rating));
  if (sp.course_id) query = query.eq("course_id", sp.course_id);

  const { data: reviews } = await query;

  // Enrich with course titles
  const courseIds = [...new Set((reviews ?? []).map((r) => r.course_id))];
  const reviewerIds = [...new Set((reviews ?? []).map((r) => r.reviewer_id))];

  const [coursesRes, profilesRes] = await Promise.all([
    courseIds.length
      ? admin.from("courses").select("id, title, provider_id").in("id", courseIds)
      : Promise.resolve({ data: [] }),
    reviewerIds.length
      ? admin.from("professional_profiles").select("auth_id, full_name, profession").in("auth_id", reviewerIds)
      : Promise.resolve({ data: [] }),
  ]);

  const courseMap = Object.fromEntries(
    (coursesRes.data ?? []).map((c) => [c.id, c.title])
  );
  const profileMap = Object.fromEntries(
    (profilesRes.data ?? []).map((p) => [p.auth_id, { name: p.full_name, profession: p.profession }])
  );

  // Aggregate stats
  const totalReviews = (reviews ?? []).length;
  const avgRating = totalReviews > 0
    ? ((reviews ?? []).reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : "—";
  const ratingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews ?? []) ratingDist[r.rating] = (ratingDist[r.rating] ?? 0) + 1;

  const enriched = (reviews ?? []).map((r) => {
    const profile = profileMap[r.reviewer_id];
    const nameParts = (profile?.name ?? "").trim().split(" ");
    const anonName = nameParts.length >= 2
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
      : (profile?.name ?? "Anonymous");
    return {
      ...r,
      course_title: courseMap[r.course_id] ?? "Unknown course",
      reviewer_anon: anonName,
      profession: profile?.profession ?? null,
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Course Reviews</h1>
        <p className="text-sm text-[#64748b] mt-1">Moderate marketplace reviews. Remove inappropriate content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Reviews", value: totalReviews.toString() },
          { label: "Average Rating", value: avgRating },
          { label: "5★ Reviews", value: ratingDist[5].toString() },
          { label: "1★ Reviews", value: ratingDist[1].toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] px-4 py-4">
            <p className="text-xs text-[#64748b] mb-1">{label}</p>
            <p className="text-2xl font-bold text-[#111]">{value}</p>
          </div>
        ))}
      </div>

      {/* Rating distribution */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] px-6 py-4 mb-6">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-3">Rating distribution</p>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDist[star];
            const pct   = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="text-xs text-[#64748b] w-8 flex-shrink-0">{star}★</span>
                <div className="flex-1 bg-[#f1f5f9] rounded-full h-2">
                  <div
                    className="bg-[#1a56a0] h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-[#64748b] w-12 text-right">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      <ReviewModerationClient reviews={enriched} />
    </div>
  );
}
