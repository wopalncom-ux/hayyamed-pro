export default function EmployerSetupBanner({ employerTier }: { employerTier?: string | null }) {
  const tierLabel = employerTier
    ? ({ clinic: "Clinic", growth: "Growth", department: "Department", hospital: "Hospital" }[employerTier] ?? "Employer")
    : "Employer";

  return (
    <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#92400e]">
          {tierLabel} Employer Plan is active — one step left
        </p>
        <p className="text-xs text-[#78350f] mt-0.5">
          Register your organization to unlock the employer dashboard and start tracking your team&apos;s compliance.
        </p>
      </div>
      <a
        href="/employer/register?welcome=1"
        className="flex-shrink-0 inline-flex items-center gap-1.5 bg-[#d97706] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#b45309] transition-colors whitespace-nowrap"
      >
        Set up my organization →
      </a>
    </div>
  );
}
