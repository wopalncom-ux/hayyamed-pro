import { createAdminClient } from "@/lib/supabase/server";

function npsLabel(score: number): "promoter" | "passive" | "detractor" {
  if (score >= 9) return "promoter";
  if (score >= 7) return "passive";
  return "detractor";
}

export default async function AdminNpsPage() {
  const admin = createAdminClient();

  const [responsesRes, totalProfsRes] = await Promise.all([
    admin
      .from("nps_responses")
      .select("score, comment, created_at, professional_id")
      .order("created_at", { ascending: false }),
    admin.from("professional_profiles").select("id", { count: "exact", head: true }),
  ]);

  const responses = responsesRes.data ?? [];
  const totalProfessionals = totalProfsRes.count ?? 0;

  // NPS calculation
  const promoters  = responses.filter((r) => r.score >= 9).length;
  const passives   = responses.filter((r) => r.score >= 7 && r.score <= 8).length;
  const detractors = responses.filter((r) => r.score <= 6).length;
  const total      = responses.length;
  const npsScore   = total > 0
    ? Math.round(((promoters - detractors) / total) * 100)
    : null;

  const responseRate = totalProfessionals > 0
    ? Math.round((total / totalProfessionals) * 100)
    : 0;

  // Score distribution
  const distribution: Record<number, number> = {};
  for (let i = 0; i <= 10; i++) distribution[i] = 0;
  for (const r of responses) distribution[r.score] = (distribution[r.score] ?? 0) + 1;
  const maxCount = Math.max(...Object.values(distribution), 1);

  // Comments (only responses with comments, most recent first)
  const withComments = responses.filter((r) => r.comment?.trim());

  const npsColor =
    npsScore === null ? "#64748b"
    : npsScore >= 50 ? "#16a34a"
    : npsScore >= 0  ? "#d97706"
    : "#dc2626";

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-6">NPS Survey Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] mb-1">NPS Score</p>
          <p className="text-3xl font-bold" style={{ color: npsColor }}>
            {npsScore !== null ? (npsScore > 0 ? `+${npsScore}` : String(npsScore)) : "—"}
          </p>
          <p className="text-xs text-[#94a3b8] mt-1">
            {npsScore === null ? "No responses yet" : npsScore >= 50 ? "Excellent" : npsScore >= 0 ? "Good" : "Needs work"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] mb-1">Total Responses</p>
          <p className="text-3xl font-bold text-[#111]">{total}</p>
          <p className="text-xs text-[#94a3b8] mt-1">{responseRate}% response rate</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] mb-1">Promoters (9–10)</p>
          <p className="text-3xl font-bold text-[#16a34a]">{promoters}</p>
          <p className="text-xs text-[#94a3b8] mt-1">{total > 0 ? Math.round((promoters / total) * 100) : 0}% of responses</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] mb-1">Detractors (0–6)</p>
          <p className="text-3xl font-bold text-[#dc2626]">{detractors}</p>
          <p className="text-xs text-[#94a3b8] mt-1">{total > 0 ? Math.round((detractors / total) * 100) : 0}% of responses</p>
        </div>
      </div>

      {/* Score distribution */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#111] mb-5">Score Distribution</h2>
        {total === 0 ? (
          <p className="text-sm text-[#64748b]">No responses yet.</p>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 11 }, (_, i) => {
              const score = 10 - i;
              const count = distribution[score] ?? 0;
              const pct = Math.round((count / maxCount) * 100);
              const label = npsLabel(score);
              const barColor =
                label === "promoter" ? "#16a34a"
                : label === "passive"  ? "#d97706"
                : "#dc2626";
              return (
                <div key={score} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#374151] w-4 text-right">{score}</span>
                  <div className="flex-1 bg-[#f1f5f9] rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>
                  <span className="text-xs text-[#64748b] w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-sm font-semibold text-[#111] mb-4">
          Comments ({withComments.length})
        </h2>
        {withComments.length === 0 ? (
          <p className="text-sm text-[#64748b]">No comments submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {withComments.map((r) => {
              const label = npsLabel(r.score);
              const tagColor =
                label === "promoter" ? "bg-[#dcfce7] text-[#16a34a]"
                : label === "passive"  ? "bg-[#fff7ed] text-[#d97706]"
                : "bg-[#fef2f2] text-[#dc2626]";
              return (
                <div
                  key={`${r.professional_id}-${r.created_at}`}
                  className="border border-[#e2e8f0] rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagColor}`}>
                      {r.score} — {label.charAt(0).toUpperCase() + label.slice(1)}
                    </span>
                    <span className="text-xs text-[#94a3b8]">
                      {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-[#374151]">{r.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
