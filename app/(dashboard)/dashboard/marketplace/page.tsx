import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import DashboardSubNav from "@/components/dashboard/DashboardSubNav";
import CourseFilters from "@/components/marketplace/CourseFilters";
import { Suspense } from "react";

export const metadata = {
  title: "Training Marketplace — Hayya Med Pro",
  description: "Browse accredited CME courses and training programs from GCC healthcare providers.",
};

interface SearchParams {
  category?: string;
  mode?: string;
  free?: string;
  q?: string;
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [t, sp] = await Promise.all([
    getTranslations("marketplace"),
    searchParams,
  ]);

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

  const [{ data: courses }, { data: myEnrollments }] = await Promise.all([
    query,
    admin
      .from("course_enrollments")
      .select("course_id, status")
      .eq("professional_id", user.id)
      .neq("status", "cancelled"),
  ]);

  const courseList = courses ?? [];
  const enrollmentMap = new Map((myEnrollments ?? []).map((e) => [e.course_id, e.status]));

  const modeLabel = (mode: string) => {
    if (mode === "online") return t("mode_online");
    if (mode === "in_person") return t("mode_in_person");
    if (mode === "hybrid") return t("mode_hybrid");
    if (mode === "self_paced") return t("mode_self_paced");
    return mode.replace(/_/g, " ");
  };

  const searchQuery = sp.q?.trim();

  return (
    <div>
      <DashboardSubNav items={[
        { href: "/dashboard/marketplace",            label: t("subnav_browse") },
        { href: "/dashboard/marketplace/my-courses", label: t("subnav_my_courses") },
      ]} />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">{t("heading")}</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {searchQuery
              ? t("search_results", { n: courseList.length, s: courseList.length !== 1 ? "s" : "" })
              : t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/marketplace/my-courses"
            className="text-sm text-[#1a56a0] hover:underline font-medium"
          >
            {t("my_courses_link")}
          </Link>
          <a
            href="/provider/register"
            className="text-sm text-[#64748b] hover:text-[#111] border border-[#e2e8f0] px-3 py-1.5 rounded-lg hover:border-[#374151] transition-colors"
          >
            {t("list_courses")}
          </a>
        </div>
      </div>

      <Suspense>
        <CourseFilters />
      </Suspense>

      {courseList.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <div className="w-12 h-12 bg-[#eff6ff] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h2 className="text-base font-semibold text-[#111] mb-2">{t("empty_heading")}</h2>
          <p className="text-sm text-[#64748b] max-w-sm mx-auto">
            {searchQuery
              ? t("empty_search", { q: searchQuery })
              : sp.category || sp.mode || sp.free
              ? t("empty_filters")
              : t("empty_default")}
          </p>
          {(sp.q || sp.category || sp.mode || sp.free) && (
            <Link
              href="/dashboard/marketplace"
              className="inline-block mt-4 text-sm text-[#1a56a0] hover:underline"
            >
              {t("clear_filters")}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseList.map((course) => {
            const provider = Array.isArray(course.training_providers)
              ? course.training_providers[0]
              : course.training_providers as { name: string; is_accredited: boolean } | null;
            const enrollStatus = enrollmentMap.get(course.id);

            return (
              <Link
                key={course.id}
                href={`/dashboard/marketplace/${course.id}`}
                className="bg-white rounded-xl border border-[#e2e8f0] p-5 hover:shadow-md hover:border-[#1a56a0]/30 transition-all block"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#1a56a0]">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {provider?.is_accredited && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a]">
                        {t("badge_accredited")}
                      </span>
                    )}
                    {enrollStatus && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        enrollStatus === "completed"
                          ? "bg-[#dcfce7] text-[#16a34a]"
                          : "bg-[#eff6ff] text-[#1a56a0]"
                      }`}>
                        {enrollStatus === "completed" ? t("badge_done") : t("badge_enrolled")}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-[#111] mb-1 line-clamp-2 leading-snug">
                  {course.title}
                </h3>
                {provider && (
                  <p className="text-xs text-[#64748b] mb-2">{provider.name}</p>
                )}
                {course.description && (
                  <p className="text-xs text-[#64748b] mb-4 line-clamp-2">{course.description}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
                  <div className="flex items-center gap-2 text-xs text-[#64748b]">
                    <span className="font-semibold text-[#1a56a0]">+{course.credits} {course.credit_type}</span>
                    <span>·</span>
                    <span>{modeLabel(course.delivery_mode)}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#111]">
                    {course.is_free ? t("price_free") : `$${course.price_usd}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
