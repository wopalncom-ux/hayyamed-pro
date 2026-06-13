import Link from "next/link";

export default function TrialBanner({ daysLeft }: { daysLeft: number }) {
  const urgent = daysLeft <= 3;
  const expiring = daysLeft <= 7;

  if (daysLeft <= 0) return null;

  return (
    <div className={`rounded-xl border px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 ${
      urgent
        ? "bg-[#fff7ed] border-[#fed7aa]"
        : expiring
          ? "bg-[#fefce8] border-[#fef08a]"
          : "bg-[#f0f7ff] border-[#bfdbfe]"
    }`}>
      <div className="flex-1">
        <p className={`font-semibold text-sm ${urgent ? "text-[#92400e]" : expiring ? "text-[#854d0e]" : "text-[#1e3a5f]"}`}>
          {urgent ? "⚠️ " : ""}
          {daysLeft === 1
            ? "Last day of your Pro trial"
            : `${daysLeft} days left in your 14-day Pro trial`}
        </p>
        <p className={`text-xs mt-0.5 ${urgent ? "text-[#b45309]" : expiring ? "text-[#a16207]" : "text-[#3b5a8a]"}`}>
          {urgent
            ? "Your trial expires soon — upgrade now to keep Pro features. From $6/month."
            : "You have full access to all Pro features. Upgrade before your trial ends — from $6/month, cancel anytime."}
        </p>
      </div>
      <Link
        href="/pricing?source=trial_banner"
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          urgent
            ? "bg-[#d97706] text-white hover:bg-[#b45309]"
            : "bg-[#1a56a0] text-white hover:bg-[#1547a0]"
        }`}
      >
        Upgrade to Pro →
      </Link>
    </div>
  );
}
