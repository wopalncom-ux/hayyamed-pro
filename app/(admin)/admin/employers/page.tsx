import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const admin = createAdminClient();
  const { data } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();
  if (!data) redirect("/dashboard");
}

function pct(num: number, den: number) {
  if (!den) return 0;
  return Math.round((num / den) * 100);
}

function statusColor(s: string) {
  if (s === "compliant")     return "text-[#16a34a] bg-[#dcfce7] border-[#bbf7d0]";
  if (s === "at_risk")       return "text-[#d97706] bg-[#fff7ed] border-[#fed7aa]";
  return                            "text-[#dc2626] bg-[#fef2f2] border-[#fecaca]";
}

export default async function AdminEmployersPage() {
  await requireAdmin();
  const admin = createAdminClient();

  // All employer orgs with their admin count and subscription
  const [orgsRes, membersRes, linksRes, walletsRes, thresholdsRes, webhooksRes, apiKeysRes] = await Promise.all([
    admin.from("organizations").select("id, name, country, type, verified, created_at"),

    admin
      .from("organization_members")
      .select("organization_id, auth_id, role")
      .eq("role", "employer_admin"),

    admin
      .from("employer_link_requests")
      .select("organization_id, professional_id, status"),

    admin
      .from("cme_wallets")
      .select("professional_id, compliance_status"),

    admin
      .from("employer_compliance_thresholds")
      .select("organization_id, threshold_pct, enabled"),

    admin
      .from("webhook_endpoints")
      .select("organization_id, is_active"),

    admin
      .from("api_keys")
      .select("organization_id, is_active"),
  ]);

  const orgs = orgsRes.data ?? [];
  const members = membersRes.data ?? [];
  const links = linksRes.data ?? [];
  const wallets = walletsRes.data ?? [];
  const thresholds = thresholdsRes.data ?? [];
  const webhooks = webhooksRes.data ?? [];
  const apiKeys = apiKeysRes.data ?? [];

  // Build wallet map for compliance lookup
  const walletMap: Record<string, string> = {};
  for (const w of wallets) walletMap[w.professional_id] = w.compliance_status;

  // Aggregate per org
  const orgRows = orgs.map((org) => {
    const staffLinks = links.filter((l) => l.organization_id === org.id);
    const approvedLinks = staffLinks.filter((l) => l.status === "approved");
    const pendingLinks  = staffLinks.filter((l) => l.status === "pending");

    const staffIds = approvedLinks.map((l) => l.professional_id);
    const compliant    = staffIds.filter((id) => walletMap[id] === "compliant").length;
    const atRisk       = staffIds.filter((id) => walletMap[id] === "at_risk").length;
    const nonCompliant = staffIds.filter((id) => walletMap[id] === "non_compliant").length;
    const compliancePct = pct(compliant, staffIds.length);

    const adminCount = members.filter((m) => m.organization_id === org.id).length;
    const threshold  = thresholds.find((t) => t.organization_id === org.id);
    const hasWebhook = webhooks.some((w) => w.organization_id === org.id && w.is_active);
    const hasApiKey  = apiKeys.some((k) => k.organization_id === org.id && k.is_active);

    let overallStatus = "non_compliant";
    if (staffIds.length === 0) overallStatus = "no_staff";
    else if (compliancePct >= 90) overallStatus = "compliant";
    else if (compliancePct >= 60) overallStatus = "at_risk";

    return {
      org,
      staffCount: staffIds.length,
      pendingCount: pendingLinks.length,
      adminCount,
      compliant,
      atRisk,
      nonCompliant,
      compliancePct,
      overallStatus,
      threshold,
      hasWebhook,
      hasApiKey,
    };
  }).filter((r) => r.adminCount > 0 || r.staffCount > 0); // Only orgs with employer activity

  // Aggregate totals
  const totalOrgs    = orgRows.length;
  const totalStaff   = orgRows.reduce((s, r) => s + r.staffCount, 0);
  const totalCompliant = orgRows.reduce((s, r) => s + r.compliant, 0);
  const totalAtRisk  = orgRows.reduce((s, r) => s + r.atRisk, 0);
  const totalNonCompliant = orgRows.reduce((s, r) => s + r.nonCompliant, 0);
  const withWebhooks = orgRows.filter((r) => r.hasWebhook).length;
  const withApiKeys  = orgRows.filter((r) => r.hasApiKey).length;

  // Sort: non-compliant first, then at-risk, then compliant
  const sortOrder: Record<string, number> = { non_compliant: 0, at_risk: 1, no_staff: 2, compliant: 3 };
  const sorted = [...orgRows].sort((a, b) =>
    (sortOrder[a.overallStatus] ?? 4) - (sortOrder[b.overallStatus] ?? 4)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f1f3d] mb-1">Employer Overview</h1>
        <p className="text-sm text-[#64748b]">
          Compliance health across all employer organisations. Only orgs with active employer admins or linked staff are shown.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Employer orgs</p>
          <p className="text-2xl font-bold text-[#0f1f3d]">{totalOrgs}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">Linked staff</p>
          <p className="text-2xl font-bold text-[#0f1f3d]">{totalStaff}</p>
          <p className="text-xs text-[#64748b] mt-1">{totalCompliant} compliant</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">With webhooks</p>
          <p className="text-2xl font-bold text-[#1a56a0]">{withWebhooks}</p>
          <p className="text-xs text-[#64748b] mt-1">of {totalOrgs} orgs</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">With API keys</p>
          <p className="text-2xl font-bold text-[#1a56a0]">{withApiKeys}</p>
          <p className="text-xs text-[#64748b] mt-1">of {totalOrgs} orgs</p>
        </div>
      </div>

      {/* Staff compliance totals */}
      {totalStaff > 0 && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-6">
          <h2 className="text-sm font-semibold text-[#0f1f3d] mb-4">Staff compliance — all orgs</h2>
          <div className="grid grid-cols-3 gap-4 text-center text-sm mb-4">
            <div>
              <p className="text-2xl font-bold text-[#16a34a]">{totalCompliant}</p>
              <p className="text-xs text-[#64748b] mt-0.5">Compliant</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#d97706]">{totalAtRisk}</p>
              <p className="text-xs text-[#64748b] mt-0.5">At risk</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#dc2626]">{totalNonCompliant}</p>
              <p className="text-xs text-[#64748b] mt-0.5">Non-compliant</p>
            </div>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-[#f1f5f9]">
            {totalStaff > 0 && (
              <>
                <div className="bg-[#16a34a]" style={{ width: `${pct(totalCompliant, totalStaff)}%` }} />
                <div className="bg-[#d97706]" style={{ width: `${pct(totalAtRisk, totalStaff)}%` }} />
                <div className="bg-[#dc2626]" style={{ width: `${pct(totalNonCompliant, totalStaff)}%` }} />
              </>
            )}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-[#64748b]">
            <span>{pct(totalCompliant, totalStaff)}% compliant</span>
            <span>{pct(totalAtRisk, totalStaff)}% at risk</span>
            <span>{pct(totalNonCompliant, totalStaff)}% non-compliant</span>
          </div>
        </div>
      )}

      {/* Per-org table */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center text-sm text-[#64748b]">
          No employer organisations yet. Organisations appear here once an employer admin registers.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Organisation</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Staff</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Pending</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide">Compliance</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden sm:table-cell">Health</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden md:table-cell">Threshold</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden lg:table-cell">Webhook</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#64748b] uppercase tracking-wide hidden lg:table-cell">API Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {sorted.map(({ org, staffCount, pendingCount, adminCount, compliant, atRisk, nonCompliant, compliancePct, overallStatus, threshold, hasWebhook, hasApiKey }) => (
                  <tr key={org.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#111]">{org.name}</p>
                      <p className="text-xs text-[#64748b]">{org.country ?? "—"} · {adminCount} admin{adminCount !== 1 ? "s" : ""}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-[#374151]">{staffCount}</td>
                    <td className="px-4 py-3 text-center">
                      {pendingCount > 0 ? (
                        <span className="text-xs font-medium text-[#d97706] bg-[#fff7ed] border border-[#fed7aa] px-2 py-0.5 rounded-full">
                          {pendingCount} pending
                        </span>
                      ) : (
                        <span className="text-xs text-[#64748b]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {staffCount === 0 ? (
                        <span className="text-xs text-[#64748b]">No staff</span>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColor(overallStatus)}`}>
                            {compliancePct}%
                          </span>
                          <div className="flex h-1.5 w-20 rounded-full overflow-hidden bg-[#f1f5f9]">
                            <div className="bg-[#16a34a]" style={{ width: `${pct(compliant, staffCount)}%` }} />
                            <div className="bg-[#d97706]" style={{ width: `${pct(atRisk, staffCount)}%` }} />
                            <div className="bg-[#dc2626]" style={{ width: `${pct(nonCompliant, staffCount)}%` }} />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {staffCount > 0 ? (
                        <div className="text-xs text-[#64748b] space-y-0.5">
                          <div className="text-[#16a34a] font-medium">{compliant} ✓</div>
                          <div className="text-[#d97706]">{atRisk} risk</div>
                          <div className="text-[#dc2626]">{nonCompliant} fail</div>
                        </div>
                      ) : (
                        <span className="text-xs text-[#64748b]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      {threshold ? (
                        <span className="text-xs font-medium text-[#374151]">{threshold.threshold_pct}%</span>
                      ) : (
                        <span className="text-xs text-[#64748b]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      {hasWebhook ? (
                        <span className="text-xs font-medium text-[#16a34a]">Active</span>
                      ) : (
                        <span className="text-xs text-[#64748b]">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      {hasApiKey ? (
                        <span className="text-xs font-medium text-[#16a34a]">Active</span>
                      ) : (
                        <span className="text-xs text-[#64748b]">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
