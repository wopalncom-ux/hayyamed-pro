import { createAdminClient } from "@/lib/supabase/server";
import PerformanceClient from "./PerformanceClient";

export const metadata = { title: "Performance Dashboard — Admin" };
export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("performance_snapshots")
    .select("id, page_url, page_label, strategy, performance_score, accessibility_score, seo_score, best_practices_score, lcp_ms, cls_score, fid_ms, ttfb_ms, fcp_ms, si_ms, tbt_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Performance Dashboard</h1>
        <p className="text-[#64748b] mt-1">
          Lighthouse scores and Core Web Vitals for every public page — tracked over time.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-800">Good</p>
            <p className="text-green-700">Score 90–100 · LCP &lt;2.5s · CLS &lt;0.1</p>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="font-semibold text-amber-800">Needs Improvement</p>
            <p className="text-amber-700">Score 50–89 · LCP 2.5–4s · CLS 0.1–0.25</p>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-semibold text-red-800">Poor</p>
            <p className="text-red-700">Score &lt;50 · LCP &gt;4s · CLS &gt;0.25</p>
          </div>
        </div>
      </div>

      <PerformanceClient initial={data ?? []} />
    </div>
  );
}
