import Link from "next/link";

export default function TrialBanner({ daysLeft }: { daysLeft: number }) {
  if (daysLeft <= 0) return null;

  const urgent = daysLeft <= 3;
  const expiring = daysLeft <= 7;
  const TRIAL_DAYS = 14;
  const pctUsed = Math.round(((TRIAL_DAYS - daysLeft) / TRIAL_DAYS) * 100);

  return (
    <div className={`rounded-xl border px-5 py-4 mb-6 ${
      urgent
        ? "bg-[#fff7ed] border-[#fed7aa]"
        : expiring
          ? "bg-[#fefce8] border-[#fef08a]"
          : "bg-[#f0f7ff] border-[#bfdbfe]"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className={`font-semibold text-sm ${
              urgent ? "text-[#92400e]" : expiring ? "text-[#854d0e]" : "text-[#1e3a5f]"
            }`}>
              {urgent && "⚠️ "}
              {daysLeft === 1
                ? "Last day of your Pro trial"
                : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left in your Pro trial`}
            </p>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              urgent ? "bg-[#fed7aa] text-[#92400e]" : expiring ? "bg-[#fef08a] text-[#854d0e]" : "bg-[#bfdbfe] text-[#1e3a5f]"
            }`}>
              PRO
            </span>
          </div>

          {/* Progress bar: trial consumed */}
          <div className="w-full max-w-xs bg-white/60 rounded-full h-1.5 mb-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                urgent ? "bg-[#d97706]" : expiring ? "bg-[#ca8a04]" : "bg-[#1a56a0]"
              }`}
              style={{ width: `${pctUsed}%` }}
            />
          </div>

          <p className={`text-xs ${urgent ? "text-[#b45309]" : expiring ? "text-[#a16207]" : "text-[#3b5a8a]"}`}>
            {urgent
              ? "Upgrade now to keep your PDF reports, AI analysis, and unlimited tracking."
              : "You have full Pro access. Add a card before your trial ends — from $6/month, cancel anytime."}
          </p>
        </div>

        <Link
          href="/pricing?source=trial_banner"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors flex-shrink-0 ${
            urgent
              ? "bg-[#d97706] text-white hover:bg-[#b45309]"
              : "bg-[#1a56a0] text-white hover:bg-[#1547a0]"
          }`}
        >
          {urgent ? "Upgrade now →" : "Upgrade to Pro →"}
        </Link>
      </div>
    </div>
  );
}
