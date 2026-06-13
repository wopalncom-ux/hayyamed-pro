import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  all:       "all email notifications",
  cme:       "CME activity emails",
  license:   "license expiry emails",
  reminders: "trial and reminder emails",
  digest:    "weekly digest emails",
  tasks:     "employer task emails",
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; category?: string }>;
}) {
  const { success, error, category } = await searchParams;

  if (success === "1") {
    const label = CATEGORY_LABELS[category ?? "all"] ?? "selected emails";
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 shadow-sm">
            <div className="w-14 h-14 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#111] mb-2">Unsubscribed</h1>
            <p className="text-sm text-[#64748b] mb-8">
              You have been unsubscribed from <strong className="text-[#374151]">{label}</strong>
              {" "}from Hayya Med Pro. You can re-enable notifications at any time from your account settings.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/settings#notifications"
                className="block bg-[#1a56a0] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#1746883] transition-colors"
              >
                Manage email preferences
              </Link>
              <Link
                href="/dashboard"
                className="block text-[#64748b] font-medium py-2 text-sm hover:text-[#374151] transition-colors"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
          <p className="text-xs text-[#94a3b8] mt-6">
            Hayya Med Pro · Healthcare Professional Platform
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 shadow-sm">
            <div className="w-14 h-14 bg-[#fef2f2] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-7 h-7 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#111] mb-2">Invalid Link</h1>
            <p className="text-sm text-[#64748b] mb-8">
              This unsubscribe link is invalid or has expired. Please log in to manage your email preferences.
            </p>
            <Link
              href="/dashboard/settings#notifications"
              className="block bg-[#1a56a0] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#1746883] transition-colors"
            >
              Manage email preferences
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No params — redirect to settings
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-10 shadow-sm">
          <h1 className="text-xl font-bold text-[#111] mb-2">Email Preferences</h1>
          <p className="text-sm text-[#64748b] mb-6">
            Manage which emails you receive from Hayya Med Pro.
          </p>
          <Link
            href="/dashboard/settings#notifications"
            className="block bg-[#1a56a0] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#174688] transition-colors"
          >
            Go to notification settings
          </Link>
        </div>
      </div>
    </div>
  );
}
