import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAuthorityForUser, countryName } from "@/lib/government/jurisdiction";
import { logAudit } from "@/lib/audit";

export const metadata = { title: "Education Oversight — Hayya Med Pro" };

export default async function GovernmentEducationPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const authority = await getAuthorityForUser(user.id);
  if (!authority) redirect("/government/register");

  const admin = createAdminClient();
  const { data: courseRows } = await admin
    .from("courses")
    .select("id, title, category, credits, credit_type, delivery_mode, duration_hours, start_date, end_date, status, professions, training_providers(name, is_accredited, accreditor)")
    .contains("country_codes", [authority.jurisdictionCountry])
    .in("status", ["active", "closed"])
    .order("start_date", { ascending: false, nullsFirst: false });

  type Row = {
    id: string; title: string; category: string; credits: number; credit_type: string;
    delivery_mode: string; duration_hours: number | null; start_date: string | null; end_date: string | null;
    status: string; provider: string; accredited: boolean; accreditor: string | null;
  };

  let courses: Row[] = (courseRows ?? []).map((c) => {
    const _p = c.training_providers as { name: string; is_accredited: boolean; accreditor: string | null }[] | { name: string; is_accredited: boolean; accreditor: string | null } | null;
    const p = Array.isArray(_p) ? _p[0] : _p;
    return {
      id: c.id, title: c.title, category: c.category, credits: Number(c.credits), credit_type: c.credit_type,
      delivery_mode: c.delivery_mode, duration_hours: c.duration_hours, start_date: c.start_date, end_date: c.end_date,
      status: c.status, provider: p?.name ?? "—", accredited: p?.is_accredited ?? false, accreditor: p?.accreditor ?? null,
    };
  });

  logAudit({
    actorAuthId: user.id,
    action: "government.education_view",
    targetTable: "courses",
    targetId: authority.organizationId,
    metadata: { jurisdiction: authority.jurisdictionCountry, count: courses.length },
  });

  if (sp.mode) courses = courses.filter((c) => c.delivery_mode === sp.mode);
  if (sp.q) {
    const q = sp.q.toLowerCase();
    courses = courses.filter((c) => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  }

  const total = courseRows?.length ?? 0;
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const accreditedCount = courses.filter((c) => c.accredited).length;

  const MODE_LABEL: Record<string, string> = { online: "Online", in_person: "In-person", hybrid: "Hybrid" };

  const exportParams = new URLSearchParams();
  if (sp.q) exportParams.set("q", sp.q);
  if (sp.mode) exportParams.set("mode", sp.mode);
  const exportQs = exportParams.toString();

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Education Oversight</h1>
          <p className="text-sm text-[#64748b] mt-1">
            CME activities — courses, conferences & webinars — offered to professionals in {countryName(authority.jurisdictionCountry)}
          </p>
        </div>
        {total > 0 && (
          <a
            href={`/api/government/export-education${exportQs ? `?${exportQs}` : ""}`}
            className="self-start sm:self-auto text-sm bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Generate Report
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Activities" value={total.toString()} />
        <Stat label="Accredited" value={accreditedCount.toString()} />
        <Stat label="Total CME credits" value={totalCredits.toFixed(0)} />
        <Stat label="Jurisdiction" value={countryName(authority.jurisdictionCountry)} />
      </div>

      <form method="GET" className="bg-white rounded-xl border border-[#e2e8f0] p-4 mb-5">
        <div className="flex flex-wrap gap-3">
          <input name="q" defaultValue={sp.q ?? ""} placeholder="Search title, provider, category..." suppressHydrationWarning className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20" />
          <select name="mode" defaultValue={sp.mode ?? ""} suppressHydrationWarning className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20">
            <option value="">All delivery modes</option>
            <option value="online">Online</option>
            <option value="in_person">In-person</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <button type="submit" suppressHydrationWarning className="bg-[#1a56a0] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1547a0] transition-colors">Apply</button>
          {(sp.mode || sp.q) && <a href="/government/education" className="text-sm text-[#64748b] px-3 py-2 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors">Clear</a>}
        </div>
      </form>

      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        {courses.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#e8f0fe] flex items-center justify-center mx-auto mb-3"><span className="text-2xl">🎓</span></div>
            <p className="text-sm font-semibold text-[#111]">No education activities found</p>
            <p className="text-xs text-[#64748b] mt-1">No courses, conferences, or webinars are currently listed for {countryName(authority.jurisdictionCountry)}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0]">
                  {["Activity", "Provider", "Category", "Mode", "Credits", "Dates", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors align-top">
                    <td className="px-5 py-4 font-medium text-[#111] max-w-xs">{c.title}</td>
                    <td className="px-5 py-4 text-[#374151]">
                      {c.provider}
                      {c.accredited && (
                        <span className="ml-1.5 text-[10px] font-medium bg-[#dcfce7] text-[#16a34a] px-1.5 py-0.5 rounded">
                          {c.accreditor ?? "Accredited"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-[#374151] capitalize">{c.category}</td>
                    <td className="px-5 py-4 text-[#374151]">{MODE_LABEL[c.delivery_mode] ?? c.delivery_mode}</td>
                    <td className="px-5 py-4"><span className="font-medium text-[#1a56a0]">{c.credits}</span> <span className="text-[#64748b] text-xs">{c.credit_type}</span></td>
                    <td className="px-5 py-4 text-xs text-[#64748b]">{c.start_date ?? "—"}{c.end_date ? ` → ${c.end_date}` : ""}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f1f5f9] text-[#64748b]"}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-[#64748b] mt-4 text-center">
        Read-only view of CME activities listed by training providers and universities for your jurisdiction.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center">
      <p className="text-2xl font-bold text-[#1a56a0]">{value}</p>
      <p className="text-xs text-[#64748b] mt-1 leading-tight">{label}</p>
    </div>
  );
}
