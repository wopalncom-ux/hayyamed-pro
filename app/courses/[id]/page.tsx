import { createAdminClient, createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import EnrollButton from "@/components/courses/EnrollButton";
import CourseReviews from "@/components/courses/CourseReviews";

const AUTHORITY_MAP: Record<string, { label: string; flag: string }> = {
  QA: { label: "QCHP", flag: "🇶🇦" },
  SA: { label: "SCFHS", flag: "🇸🇦" },
  AE: { label: "DHA/DOH", flag: "🇦🇪" },
  KW: { label: "MOH Kuwait", flag: "🇰🇼" },
  BH: { label: "NHRA", flag: "🇧🇭" },
  OM: { label: "OMSB", flag: "🇴🇲" },
};

type CourseRow = {
  id: string;
  title: string;
  description: string | null;
  credits: number;
  credit_type: string | null;
  delivery_mode: string | null;
  is_free: boolean;
  price_usd: number | null;
  category: string | null;
  start_date: string | null;
  end_date: string | null;
  enrollment_deadline: string | null;
  max_enrollments: number | null;
  accredited_countries: string[] | null;
  status: string;
  training_providers: { name: string; is_accredited: boolean; accreditor: string | null } | { name: string; is_accredited: boolean; accreditor: string | null }[] | null;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const admin = createAdminClient();
  const { data: course } = await admin
    .from("courses")
    .select("title, description, training_providers(name)")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (!course) return { title: "Course not found — Hayya Med Pro" };

  const provider = Array.isArray(course.training_providers)
    ? course.training_providers[0]
    : (course.training_providers as { name: string } | null);

  const title = `${course.title} — CME Course | Hayya Med Pro`;
  const description = course.description
    ? `${course.description.slice(0, 140)}…`
    : `Accredited CME course from ${provider?.name ?? "a GCC-approved provider"}. Accepted by QCHP, SCFHS, DHA, and other GCC health authorities.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://hayyamed.pro/courses/${id}`,
    },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: rawCourse } = await admin
    .from("courses")
    .select("id, title, description, credits, credit_type, delivery_mode, is_free, price_usd, category, start_date, end_date, enrollment_deadline, max_enrollments, accredited_countries, status, training_providers(name, is_accredited, accreditor)")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();

  if (!rawCourse) notFound();
  const course = rawCourse as CourseRow;

  const provider = Array.isArray(course.training_providers)
    ? course.training_providers[0]
    : (course.training_providers as { name: string; is_accredited: boolean; accreditor: string | null } | null);

  // Auth check — optional (page is public)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  let isEnrolled = false;
  let isCompleted = false;
  let enrollmentCount = 0;

  const [enrollCountRes, userEnrollRes, reviewsRes] = await Promise.all([
    course.max_enrollments
      ? admin.from("course_enrollments").select("id", { count: "exact", head: true }).eq("course_id", id).neq("status", "cancelled")
      : Promise.resolve({ count: 0 }),
    user
      ? admin.from("course_enrollments").select("id, status").eq("course_id", id).eq("professional_id", user.id).neq("status", "cancelled").maybeSingle()
      : Promise.resolve({ data: null }),
    admin
      .from("course_reviews")
      .select("id, rating, review_text, created_at, reviewer_id, professional_profiles(full_name, profession)")
      .eq("course_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  enrollmentCount = enrollCountRes.count ?? 0;
  isEnrolled = !!userEnrollRes.data;
  isCompleted = (userEnrollRes.data as { status?: string } | null)?.status === "completed";

  type ReviewRow = {
    id: string; rating: number; review_text: string | null; created_at: string; reviewer_id: string;
    professional_profiles: { full_name: string | null; profession: string | null } | { full_name: string | null; profession: string | null }[] | null;
  };
  const rawReviews = (reviewsRes.data ?? []) as ReviewRow[];
  const reviews = rawReviews.map((r) => {
    const prof = Array.isArray(r.professional_profiles) ? r.professional_profiles[0] : r.professional_profiles;
    return {
      id: r.id,
      rating: r.rating,
      review_text: r.review_text,
      created_at: r.created_at,
      reviewer_name: prof?.full_name ? prof.full_name.split(" ")[0] + " " + (prof.full_name.split(" ").slice(-1)[0]?.charAt(0) ?? "") + "." : "Anonymous",
      reviewer_profession: prof?.profession ?? null,
    };
  });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10) / 10 : 0;
  const existingReview = user ? rawReviews.find((r) => r.reviewer_id === user.id) : null;

  const deadlinePassed = course.enrollment_deadline ? new Date(course.enrollment_deadline) < new Date() : false;
  const isFull = course.max_enrollments ? enrollmentCount >= course.max_enrollments : false;

  const modeLabel =
    course.delivery_mode === "online" ? "Online" :
    course.delivery_mode === "in_person" ? "In-person" :
    course.delivery_mode === "hybrid" ? "Hybrid" : null;

  const countries = (course.accredited_countries ?? []) as string[];

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description ?? undefined,
    provider: provider
      ? { "@type": "Organization", name: provider.name }
      : undefined,
    courseMode: course.delivery_mode === "online" ? "online" : course.delivery_mode === "in_person" ? "onsite" : "blended",
    numberOfCredits: course.credits,
    url: `https://hayyamed.pro/courses/${id}`,
    offers: {
      "@type": "Offer",
      price: course.is_free ? "0" : (course.price_usd ?? undefined),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Header */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">
                Hayya Med <span className="text-[#1a56a0]">Pro</span>
              </span>
            </a>
            <div className="flex items-center gap-3">
              <a href="/courses" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">
                ← All courses
              </a>
              {!isAuthenticated && (
                <a
                  href="/register"
                  className="text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
                >
                  Start free
                </a>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {course.category && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
                    {course.category}
                  </span>
                )}
                {modeLabel && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]">
                    {modeLabel}
                  </span>
                )}
                {course.is_free && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
                    Free
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111] leading-tight">
                {course.title}
              </h1>

              {totalReviews > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width={14} height={14} viewBox="0 0 24 24"
                        fill={s <= Math.round(averageRating) ? "#f59e0b" : "none"}
                        stroke={s <= Math.round(averageRating) ? "#f59e0b" : "#d1d5db"}
                        strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#111]">{averageRating.toFixed(1)}</span>
                  <a href="#reviews" className="text-xs text-[#1a56a0] hover:underline">
                    ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                  </a>
                </div>
              )}

              {provider && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#1a56a0]">{provider.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111]">{provider.name}</p>
                    {provider.is_accredited && (
                      <p className="text-xs text-[#16a34a] flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        Accredited provider{provider.accreditor ? ` · ${provider.accreditor}` : ""}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {course.description && (
                <div>
                  <h2 className="text-base font-bold text-[#111] mb-2">About this course</h2>
                  <p className="text-[#374151] text-sm leading-relaxed whitespace-pre-line">
                    {course.description}
                  </p>
                </div>
              )}

              {/* Accredited countries */}
              {countries.length > 0 && (
                <div>
                  <h2 className="text-base font-bold text-[#111] mb-3">Accepted by</h2>
                  <div className="flex flex-wrap gap-2">
                    {countries.map((code) => {
                      const auth = AUTHORITY_MAP[code];
                      return auth ? (
                        <span key={code} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#e2e8f0] text-[#374151]">
                          <span>{auth.flag}</span>
                          {auth.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Key details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "CME Credits", value: `${course.credits} ${course.credit_type ?? "credits"}` },
                  { label: "Delivery", value: modeLabel ?? "Not specified" },
                  { label: "Price", value: course.is_free ? "Free" : course.price_usd ? `$${course.price_usd}` : "Contact provider" },
                  ...(course.start_date ? [{ label: "Start date", value: fmtDate(course.start_date) }] : []),
                  ...(course.end_date ? [{ label: "End date", value: fmtDate(course.end_date) }] : []),
                  ...(course.enrollment_deadline ? [{ label: "Enroll by", value: fmtDate(course.enrollment_deadline) }] : []),
                  ...(course.max_enrollments ? [{ label: "Seats remaining", value: Math.max(0, course.max_enrollments - enrollmentCount).toString() }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-xl border border-[#e2e8f0] p-4">
                    <p className="text-xs text-[#64748b] mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-[#111]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sticky top-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-[#1a56a0]">{course.credits}</p>
                  <p className="text-xs text-[#64748b]">{course.credit_type ?? "CME credits"}</p>
                </div>

                <div className="border-t border-[#f1f5f9] pt-4">
                  <p className="text-lg font-bold text-[#111] text-center mb-1">
                    {course.is_free ? "Free" : course.price_usd ? `$${course.price_usd}` : "Contact provider"}
                  </p>
                  {modeLabel && (
                    <p className="text-xs text-[#64748b] text-center mb-4">{modeLabel}</p>
                  )}

                  <EnrollButton
                    courseId={course.id}
                    isAuthenticated={isAuthenticated}
                    initialEnrolled={isEnrolled}
                    deadlinePassed={deadlinePassed}
                    isFull={isFull}
                    isFree={course.is_free}
                    priceUsd={course.price_usd}
                  />
                </div>

                {isAuthenticated && !isEnrolled && !deadlinePassed && !isFull && (
                  <p className="text-xs text-[#64748b] text-center">
                    Credits are automatically tracked in your CME wallet after completion.
                  </p>
                )}

                {course.enrollment_deadline && !deadlinePassed && (
                  <p className="text-xs text-[#d97706] text-center">
                    Enrollment closes {fmtDate(course.enrollment_deadline)}
                  </p>
                )}

                <div className="border-t border-[#f1f5f9] pt-3">
                  <a
                    href="/courses"
                    className="block text-center text-xs text-[#64748b] hover:text-[#1a56a0] transition-colors"
                  >
                    ← Browse all courses
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div id="reviews" className="mt-10 bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <h2 className="text-base font-bold text-[#111] mb-5">
              Reviews {totalReviews > 0 && <span className="text-[#64748b] font-normal">({totalReviews})</span>}
            </h2>
            <CourseReviews
              courseId={id}
              reviews={reviews}
              averageRating={averageRating}
              totalCount={totalReviews}
              completed={isCompleted}
              existingReview={existingReview ? { rating: existingReview.rating, review_text: existingReview.review_text } : null}
            />
            {!isCompleted && !user && (
              <p className="text-xs text-[#64748b] mt-4">
                <a href="/register" className="text-[#1a56a0] hover:underline font-medium">Create a free account</a>
                {" "}to enroll and review this course.
              </p>
            )}
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
