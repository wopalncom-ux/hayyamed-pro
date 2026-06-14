type ComplianceStatus = "compliant" | "at_risk" | "non_compliant" | "unknown";

interface StaffMember {
  complianceStatus: ComplianceStatus;
  daysToExpiry: number | null;
}

interface DeptGroup {
  name: string;
  members: StaffMember[];
}

const STATUSES: ComplianceStatus[] = ["compliant", "at_risk", "non_compliant", "unknown"];

const STATUS_META: Record<ComplianceStatus, { label: string; cell: string; header: string }> = {
  compliant:     { label: "Compliant",     cell: "bg-[#dcfce7] text-[#15803d]",  header: "text-[#15803d]" },
  at_risk:       { label: "At Risk",       cell: "bg-[#fff7ed] text-[#c2410c]",  header: "text-[#d97706]" },
  non_compliant: { label: "Non-Compliant", cell: "bg-[#fef2f2] text-[#dc2626]",  header: "text-[#dc2626]" },
  unknown:       { label: "No Data",       cell: "bg-[#f1f5f9] text-[#64748b]",  header: "text-[#64748b]" },
};

function cellIntensity(count: number, total: number): string {
  if (count === 0 || total === 0) return "opacity-0";
  const pct = count / total;
  if (pct >= 0.75) return "opacity-100";
  if (pct >= 0.5)  return "opacity-80";
  if (pct >= 0.25) return "opacity-60";
  return "opacity-40";
}

export default function ComplianceHeatmap({ deptGroups }: { deptGroups: DeptGroup[] }) {
  const namedDepts = deptGroups.filter((d) => d.name !== "Unassigned" && d.name !== "");
  if (namedDepts.length < 2) return null;

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 mb-8">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#111]">Department Compliance Heatmap</h2>
        <p className="text-xs text-[#64748b] mt-0.5">Staff compliance status across departments — darker = higher proportion</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left font-medium text-[#64748b] pb-2 pr-3 min-w-[120px]">Department</th>
              {STATUSES.map((s) => (
                <th key={s} className={`text-center font-semibold pb-2 px-2 whitespace-nowrap ${STATUS_META[s].header}`}>
                  {STATUS_META[s].label}
                </th>
              ))}
              <th className="text-center font-medium text-[#64748b] pb-2 px-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {namedDepts.map((dept) => {
              const total = dept.members.length;
              const counts = Object.fromEntries(
                STATUSES.map((s) => [s, dept.members.filter((m) => m.complianceStatus === s).length])
              ) as Record<ComplianceStatus, number>;

              return (
                <tr key={dept.name}>
                  <td className="pr-3 py-1 font-medium text-[#374151] max-w-[160px] truncate" title={dept.name}>
                    {dept.name}
                  </td>
                  {STATUSES.map((s) => {
                    const count = counts[s];
                    const meta = STATUS_META[s];
                    return (
                      <td key={s} className="text-center py-1 px-1">
                        {count > 0 ? (
                          <span
                            className={`inline-flex items-center justify-center w-10 h-8 rounded-lg font-bold text-sm ${meta.cell} ${cellIntensity(count, total)}`}
                            title={`${count} ${meta.label} in ${dept.name}`}
                          >
                            {count}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-10 h-8 text-[#e2e8f0]">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="text-center py-1 px-2 font-semibold text-[#64748b]">{total}</td>
                </tr>
              );
            })}
          </tbody>
          {/* Footer totals */}
          <tfoot>
            <tr className="border-t border-[#e2e8f0]">
              <td className="pr-3 pt-2 font-semibold text-[#374151]">All departments</td>
              {STATUSES.map((s) => {
                const total = namedDepts.reduce(
                  (sum, d) => sum + d.members.filter((m) => m.complianceStatus === s).length, 0
                );
                return (
                  <td key={s} className="text-center pt-2 px-2 font-bold text-[#374151]">
                    {total > 0 ? total : "—"}
                  </td>
                );
              })}
              <td className="text-center pt-2 px-2 font-bold text-[#111]">
                {namedDepts.reduce((sum, d) => sum + d.members.length, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#f1f5f9]">
        <span className="text-xs text-[#64748b]">Legend:</span>
        {STATUSES.map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className={`w-4 h-4 rounded ${STATUS_META[s].cell} opacity-100 flex-shrink-0`} />
            <span className="text-xs text-[#64748b]">{STATUS_META[s].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
