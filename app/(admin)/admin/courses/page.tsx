import { createAdminClient } from "@/lib/supabase/server";
import CourseStatusActions from "@/components/admin/CourseStatusActions";
import Link from "next/link";

export const metadata = { title: "Course Moderation — Admin" };

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-[#fff7ed] text-[#d97706]",
  active: "bg-[#dcfce7] text-[#16a34a]",
  closed: "bg-[#f1f5f9] text-[#64748b]",
  cancelled: "bg-[#fef2f2] text-[#dc2626]",
};

type Course = {
  id: string;
  title: string;
  category: string;
  credits: number;
  credit_type: string;
  delivery_mode: string;
  is_free: boolean;
  price_usd: number | null;
  status: string;
  created_at: string;
  training_providers: { name: string; is_accredited: boolean } | { name: string; is_accredited: boolean }[] | null;
};

function CourseRow({ c }: { c: Course }) {
  const provider = Array.isArray(c.training_providers) ? c.training_providers[0] : c.training_providers;

  return (
    <div className="px-6 py-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-[#111] truncate">{c.title}</p>
          <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[c.status]}`}>
            {c.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#64748b]">
          <span>{provider?.name ?? "—"}</span>
          {provider?.is_accredited && (
            <span className="text-[#16a34a] font-medium">· Accredited</span>
          )}
          <span>· {c.category}</span>
          <span>· +{c.credits} {c.credit_type}</span>
          <span>· {c.delivery_mode.replace("_", " ")}</span>
          <span>· {c.is_free ? "Free" : `$${c.price_usd}`}</span>
        </div>
        <p className="text-xs text-[#94a3b8] mt-0.5">
          Submitted {new Date(c.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
      <div className="flex-shrink-0">
        <CourseStatusActions courseId={c.id} status={c.status} />
      </div>
    </div>
  );
}

export default async function AdminCoursesPage() {
  const admin = createAdminClient();

  const { data: courses } = await admin
    .from("courses")
    .select("id, title, category, credits, credit_type, delivery_mode, is_free, price_usd, status, created_at, training_providers(name, is_accredited)")
    .order("created_at", { ascending: false });

  const all = (courses ?? []) as Course[];
  const drafts = all.filter((c) => c.status === "draft");
  const active = all.filter((c) => c.status === "active");
  const closed = all.filter((c) => c.status === "closed" || c.status === "cancelled");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Course Moderation</h1>
          <p className="text-sm text-[#64748b] mt-1">
            {drafts.length} pending · {active.length} active · {closed.length} closed
          </p>
        </div>
        <Link href="/admin/training-providers" className="text-sm text-[#1a56a0] hover:underline">
          ← Providers
        </Link>
      </div>

      {drafts.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#111]">Pending Review</h2>
            <span className="text-xs bg-[#fff7ed] text-[#d97706] font-medium px-2 py-0.5 rounded-full">{drafts.length}</span>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {drafts.map((c) => <CourseRow key={c.id} c={c} />)}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
        <div className="px-6 py-4 border-b border-[#e2e8f0]">
          <h2 className="text-base font-semibold text-[#111]">Active Courses</h2>
        </div>
        {active.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748b]">No active courses yet.</div>
        ) : (
          <div className="divide-y divide-[#e2e8f0]">
            {active.map((c) => <CourseRow key={c.id} c={c} />)}
          </div>
        )}
      </div>

      {closed.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#111]">Closed / Cancelled</h2>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {closed.map((c) => <CourseRow key={c.id} c={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
