import { createAdminClient } from "@/lib/supabase/server";
import SiteFooter from "@/components/SiteFooter";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accredited CME Courses for GCC Healthcare Professionals 2026 | Hayya Med Pro",
  description:
    "Browse accredited Continuing Medical Education (CME) and CPD courses from GCC-approved training providers. Online, in-person, and hybrid courses for QCHP, SCFHS, DHA, DOH, NHRA, and OMSB renewal.",
  openGraph: {
    title: "Accredited CME Courses — GCC Healthcare Professionals 2026",
    description:
      "Find CME courses accepted by QCHP, SCFHS, DHA, DOH, NHRA, and OMSB. Online and in-person options for physicians, nurses, pharmacists, and allied health professionals.",
    type: "website",
    url: "https://hayyamed.pro/courses",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Accredited CME Courses for GCC Healthcare Professionals",
  url: "https://hayyamed.pro/courses",
  description: "Browse accredited CME and CPD courses from GCC-approved training providers.",
  publisher: { "@type": "Organization", name: "Hayya Med Pro", url: "https://hayyamed.pro" },
};

const CATEGORIES = ["All", "Clinical", "Emergency", "Pharmacy", "Nursing", "Ethics", "Management", "Technology", "Research", "Wellness"];
const MODES = [
  { value: "", label: "All modes" },
  { value: "online", label: "Online" },
  { value: "in_person", label: "In-person" },
  { value: "hybrid", label: "Hybrid" },
];

const AUTHORITY_MAP: Record<string, { label: string; flag: string }> = {
  QA: { label: "QCHP", flag: "🇶🇦" },
  SA: { label: "SCFHS", flag: "🇸🇦" },
  AE: { label: "DHA/DOH", flag: "🇦🇪" },
  KW: { label: "MOH", flag: "🇰🇼" },
  BH: { label: "NHRA", flag: "🇧🇭" },
  OM: { label: "OMSB", flag: "🇴🇲" },
};

interface Course {
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
  training_providers: { name: string; is_accredited: boolean } | { name: string; is_accredited: boolean }[] | null;
}

interface SearchParams {
  category?: string;
  mode?: string;
  free?: string;
  q?: string;
}

export default async function PublicCoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from("courses")
    .select("id, title, description, credits, credit_type, delivery_mode, is_free, price_usd, category, start_date, end_date, training_providers(name, is_accredited)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(60);

  if (sp.category && sp.category !== "All") query = query.eq("category", sp.category);
  if (sp.mode) query = query.eq("delivery_mode", sp.mode);
  if (sp.free === "1") query = query.eq("is_free", true);
  if (sp.q?.trim()) {
    const q = sp.q.trim();
    if (q.length >= 3) {
      query = query.textSearch("search_vector", q, { type: "websearch", config: "english" });
    } else {
      query = query.ilike("title", `%${q}%`);
    }
  }

  const { data: courses } = await query;
  const courseList = (courses ?? []) as Course[];

  const activeCategory = sp.category ?? "All";
  const activeMode = sp.mode ?? "";
  const isFreeOnly = sp.free === "1";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* Header */}
        <header className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1a56a0] flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
              </div>
              <span className="font-bold text-base text-[#111]">
                Hayya Med <span className="text-[#1a56a0]">Pro</span>
              </span>
            </a>
            <div className="flex items-center gap-3">
              <a href="/login" className="text-sm text-[#64748b] hover:text-[#111] transition-colors">Sign in</a>
              <a
                href="/register"
                className="text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#154890] transition-colors"
              >
                Start free
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-10">
          {/* Hero */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] text-[#1e40af] text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-[#bfdbfe]">
              GCC-accredited CME courses
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111] mb-3 tracking-tight">
              CME Courses for GCC<br className="hidden sm:block" /> Healthcare Professionals
            </h1>
            <p className="text-[#64748b] text-base max-w-2xl">
              Browse accredited Continuing Medical Education courses accepted by QCHP, SCFHS, DHA, DOH, NHRA, and OMSB.
              Enroll and have credits automatically tracked in your compliance wallet.
            </p>
          </div>

          {/* Authority quick reference */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
            {Object.entries(AUTHORITY_MAP).map(([code, { label, flag }]) => (
              <div key={code} className="bg-white rounded-xl border border-[#e2e8f0] p-2.5 text-center">
                <div className="text-lg mb-0.5">{flag}</div>
                <p className="text-[10px] font-bold text-[#111]">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar filters */}
            <aside className="lg:w-56 flex-shrink-0">
              <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 sticky top-4">
                {/* Search */}
                <form method="get" action="/courses">
                  {sp.category && sp.category !== "All" && <input type="hidden" name="category" value={sp.category} />}
                  {sp.mode && <input type="hidden" name="mode" value={sp.mode} />}
                  {sp.free && <input type="hidden" name="free" value={sp.free} />}
                  <div className="mb-4">
                    <label htmlFor="course-search" className="block text-xs font-semibold text-[#374151] mb-1.5">
                      Search courses
                    </label>
                    <input
                      id="course-search"
                      name="q"
                      type="search"
                      defaultValue={sp.q ?? ""}
                      placeholder="e.g. ACLS, pharmacology…"
                      className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]"
                    />
                  </div>
                  <button type="submit" className="w-full text-sm font-semibold bg-[#1a56a0] text-white py-2 rounded-lg hover:bg-[#154890] transition-colors">
                    Search
                  </button>
                </form>

                <div className="mt-5">
                  <p className="text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wide">Category</p>
                  <div className="flex flex-col gap-1">
                    {CATEGORIES.map((cat) => {
                      const params = new URLSearchParams();
                      if (cat !== "All") params.set("category", cat);
                      if (sp.mode) params.set("mode", sp.mode);
                      if (sp.free) params.set("free", sp.free);
                      if (sp.q) params.set("q", sp.q);
                      const href = `/courses${params.toString() ? `?${params}` : ""}`;
                      return (
                        <a
                          key={cat}
                          href={href}
                          className={`text-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                            activeCategory === cat
                              ? "bg-[#eff6ff] text-[#1a56a0] font-semibold"
                              : "text-[#374151] hover:bg-[#f8fafc]"
                          }`}
                        >
                          {cat}
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wide">Delivery</p>
                  <div className="flex flex-col gap-1">
                    {MODES.map(({ value, label }) => {
                      const params = new URLSearchParams();
                      if (sp.category && sp.category !== "All") params.set("category", sp.category);
                      if (value) params.set("mode", value);
                      if (sp.free) params.set("free", sp.free);
                      if (sp.q) params.set("q", sp.q);
                      const href = `/courses${params.toString() ? `?${params}` : ""}`;
                      return (
                        <a
                          key={value}
                          href={href}
                          className={`text-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                            activeMode === value
                              ? "bg-[#eff6ff] text-[#1a56a0] font-semibold"
                              : "text-[#374151] hover:bg-[#f8fafc]"
                          }`}
                        >
                          {label}
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wide">Price</p>
                  {(() => {
                    const params = new URLSearchParams();
                    if (sp.category && sp.category !== "All") params.set("category", sp.category);
                    if (sp.mode) params.set("mode", sp.mode);
                    if (!isFreeOnly) params.set("free", "1");
                    if (sp.q) params.set("q", sp.q);
                    return (
                      <a
                        href={`/courses${params.toString() ? `?${params}` : ""}`}
                        className={`text-sm px-2.5 py-1.5 rounded-lg block transition-colors ${
                          isFreeOnly
                            ? "bg-[#eff6ff] text-[#1a56a0] font-semibold"
                            : "text-[#374151] hover:bg-[#f8fafc]"
                        }`}
                      >
                        Free courses only
                      </a>
                    );
                  })()}
                </div>

                {(sp.category || sp.mode || sp.free || sp.q) && (
                  <a
                    href="/courses"
                    className="mt-4 block text-center text-xs text-[#64748b] hover:text-[#dc2626] transition-colors"
                  >
                    Clear all filters
                  </a>
                )}
              </div>
            </aside>

            {/* Course grid */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#64748b]">
                  {sp.q?.trim()
                    ? `${courseList.length} result${courseList.length !== 1 ? "s" : ""} for "${sp.q.trim()}"`
                    : `${courseList.length} course${courseList.length !== 1 ? "s" : ""} available`}
                </p>
                <a
                  href="/provider/register"
                  className="text-xs text-[#64748b] hover:text-[#1a56a0] border border-[#e2e8f0] px-3 py-1.5 rounded-lg hover:border-[#1a56a0] transition-colors"
                >
                  List your courses →
                </a>
              </div>

              {courseList.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
                  <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h2 className="text-base font-semibold text-[#111] mb-2">No courses found</h2>
                  <p className="text-sm text-[#64748b] max-w-sm mx-auto">
                    {sp.q?.trim()
                      ? `No courses match "${sp.q.trim()}". Try a different search term or clear filters.`
                      : "We&apos;re onboarding accredited training providers. Check back soon, or list your courses on our platform."}
                  </p>
                  {(sp.q || sp.category || sp.mode || sp.free) && (
                    <a href="/courses" className="inline-block mt-4 text-sm text-[#1a56a0] hover:underline">
                      Clear all filters
                    </a>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {courseList.map((course) => {
                    const provider = Array.isArray(course.training_providers)
                      ? course.training_providers[0]
                      : (course.training_providers as { name: string; is_accredited: boolean } | null);
                    const modeLabel =
                      course.delivery_mode === "online" ? "Online" :
                      course.delivery_mode === "in_person" ? "In-person" :
                      course.delivery_mode === "hybrid" ? "Hybrid" : null;

                    return (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:shadow-md hover:border-[#1a56a0]/30 transition-all block group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex flex-wrap gap-1.5">
                            {course.category && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
                                {course.category}
                              </span>
                            )}
                            {modeLabel && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0]">
                                {modeLabel}
                              </span>
                            )}
                            {course.is_free && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]">
                                Free
                              </span>
                            )}
                          </div>
                          <span className="text-base font-black text-[#1a56a0] flex-shrink-0">{course.credits}</span>
                        </div>

                        <h3 className="text-sm font-semibold text-[#111] mb-2 leading-snug group-hover:text-[#1a56a0] transition-colors line-clamp-2">
                          {course.title}
                        </h3>

                        {course.description && (
                          <p className="text-xs text-[#64748b] mb-3 leading-relaxed line-clamp-2">
                            {course.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#f1f5f9]">
                          <div>
                            {provider && (
                              <p className="text-xs text-[#64748b] flex items-center gap-1">
                                {provider.is_accredited && (
                                  <svg className="w-3 h-3 text-[#16a34a]" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {provider.name}
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-[#374151]">
                            {course.is_free ? "Free" : course.price_usd ? `$${course.price_usd}` : "Contact provider"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* CTA for training providers */}
              <div className="mt-10 bg-[#0f1f3d] rounded-2xl p-7 text-center">
                <h2 className="text-white text-xl font-bold mb-2">Are you a training provider?</h2>
                <p className="text-[#94a3b8] text-sm mb-5 max-w-md mx-auto">
                  List your accredited CME courses on Hayya Med Pro and reach thousands of GCC healthcare professionals
                  actively tracking their compliance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/provider/register"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#0f1f3d] text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#f0f4f8] transition-colors"
                  >
                    List your courses →
                  </a>
                  <a
                    href="/register"
                    className="inline-flex items-center justify-center text-sm text-[#94a3b8] hover:text-white transition-colors"
                  >
                    Or register as a professional
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* SEO content */}
          <div className="mt-12 bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <h2 className="text-lg font-bold text-[#111] mb-4">About CME Courses on Hayya Med Pro</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-[#64748b]">
              <div>
                <p className="font-semibold text-[#111] mb-1.5">GCC-accepted accreditation</p>
                <p className="leading-relaxed">
                  All listed courses carry accreditation accepted by at least one GCC healthcare licensing authority — QCHP, SCFHS, DHA, DOH, NHRA, or OMSB.
                  Provider accreditation status is verified before listing.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#111] mb-1.5">Automatic CME tracking</p>
                <p className="leading-relaxed">
                  When you complete a course through Hayya Med Pro, the credits are automatically added to your CME wallet for the relevant country.
                  No manual entry required — your compliance percentage updates instantly.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#111] mb-1.5">Online and in-person options</p>
                <p className="leading-relaxed">
                  Browse online courses for flexible self-paced learning, hybrid workshops, and in-person conferences.
                  Filter by delivery mode to find options that fit your schedule and specialty.
                </p>
              </div>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
