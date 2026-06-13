// Shown on dashboard when profile is incomplete. Each gap links to where it can be filled.

const FIELD_GUIDANCE: Record<string, { label: string; action: string; href: string }> = {
  full_name:           { label: "Full name",              action: "Add in Settings",    href: "/dashboard/settings" },
  date_of_birth:       { label: "Date of birth",          action: "Add in Settings",    href: "/dashboard/settings" },
  nationality:         { label: "Nationality",             action: "Add in Settings",    href: "/dashboard/settings" },
  mobile:              { label: "Mobile number",           action: "Add in Settings",    href: "/dashboard/settings" },
  profession:          { label: "Profession",              action: "Add in Settings",    href: "/dashboard/settings" },
  specialty:           { label: "Specialty",               action: "Add in Settings",    href: "/dashboard/settings" },
  license_number:      { label: "License number",          action: "Add in Settings",    href: "/dashboard/settings" },
  licensing_authority: { label: "Licensing authority",     action: "Add in Settings",    href: "/dashboard/settings" },
  license_expiry:      { label: "License expiry date",     action: "Add in Settings",    href: "/dashboard/settings" },
  country_of_residence:{ label: "Country of residence",    action: "Add in Settings",    href: "/dashboard/settings" },
  cme_wallet:          { label: "CME wallet configured",   action: "Set up CME wallet",  href: "/dashboard/cme" },
  employer_link:       { label: "Employer linked",         action: "Link employer",       href: "/dashboard/settings" },
};

interface ProfileGap {
  key: string;
  label: string;
  action: string;
  href: string;
  points: number;
}

interface Props {
  pct: number;
  gaps: ProfileGap[];
}

export default function ProfileCompletionCard({ pct, gaps }: Props) {
  if (pct >= 100 || gaps.length === 0) return null;

  // Show at most 5 gaps, sorted by points descending
  const topGaps = [...gaps].sort((a, b) => b.points - a.points).slice(0, 5);
  const pointsRemaining = gaps.reduce((s, g) => s + g.points, 0);

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[#111]">Complete your profile</h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            {pointsRemaining} points remaining — improves your compliance reports
          </p>
        </div>
        <span className="text-sm font-bold text-[#1a56a0]">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#e2e8f0] rounded-full h-1.5 mb-4">
        <div
          className="bg-[#1a56a0] h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Gap list */}
      <div className="space-y-2">
        {topGaps.map((gap) => (
          <a
            key={gap.key}
            href={gap.href}
            className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-[#f0f4f8] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-full border-2 border-[#e2e8f0] group-hover:border-[#1a56a0] flex-shrink-0 transition-colors" />
              <span className="text-sm text-[#374151]">{gap.label}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#94a3b8] group-hover:text-[#1a56a0] transition-colors">
              <span>+{gap.points}pts</span>
              <span>→</span>
            </div>
          </a>
        ))}
      </div>

      {gaps.length > 5 && (
        <p className="text-xs text-[#94a3b8] mt-2 px-3">
          + {gaps.length - 5} more in{" "}
          <a href="/dashboard/settings" className="text-[#1a56a0] hover:underline">
            Settings
          </a>
        </p>
      )}
    </div>
  );
}

// ── Helper exported for use in the dashboard page ──────────────────────────

const FIELD_WEIGHTS: Array<{ key: string; weight: number }> = [
  { key: "full_name",           weight: 10 },
  { key: "date_of_birth",       weight: 5 },
  { key: "nationality",         weight: 5 },
  { key: "mobile",              weight: 5 },
  { key: "profession",          weight: 15 },
  { key: "specialty",           weight: 10 },
  { key: "license_number",      weight: 10 },
  { key: "licensing_authority", weight: 10 },
  { key: "license_expiry",      weight: 10 },
  { key: "country_of_residence",weight: 5 },
];

export function buildProfileGaps(
  profile: Record<string, unknown>,
  extras: { hasCmeWallet: boolean; hasEmployerLink: boolean }
): ProfileGap[] {
  const gaps: ProfileGap[] = [];

  for (const { key, weight } of FIELD_WEIGHTS) {
    if (!profile[key]) {
      gaps.push({ key, points: weight, ...FIELD_GUIDANCE[key] });
    }
  }

  if (!extras.hasCmeWallet) {
    gaps.push({ key: "cme_wallet", points: 10, ...FIELD_GUIDANCE.cme_wallet });
  }
  if (!extras.hasEmployerLink) {
    gaps.push({ key: "employer_link", points: 5, ...FIELD_GUIDANCE.employer_link });
  }

  return gaps;
}
