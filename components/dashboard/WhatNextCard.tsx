import type { Plan } from "@/lib/planUtils";
import { isPro } from "@/lib/planUtils";

interface Step {
  id: string;
  done: boolean;
  icon: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
  primary: boolean;
}

interface Props {
  hasWallet: boolean;
  hasLicense: boolean;
  profilePct: number;
  activityCount: number;
  hasEmployerLink: boolean;
  plan: Plan;
  referralCount?: number;
}

export default function WhatNextCard({
  hasWallet,
  hasLicense,
  profilePct,
  activityCount,
  hasEmployerLink,
  plan,
  referralCount = 0,
}: Props) {
  const pro = isPro(plan);

  const steps: Step[] = [
    {
      id: "wallet",
      done: hasWallet,
      icon: "◎",
      title: "Set up your CME wallet",
      detail: "Configure your country and profession to start tracking credits.",
      href: "/onboarding/5",
      cta: "Set up wallet",
      primary: true,
    },
    {
      id: "license",
      done: hasLicense,
      icon: "⊞",
      title: "Add your license details",
      detail: "Track your renewal deadline and receive expiry reminders.",
      href: "/dashboard/licenses",
      cta: "Add license",
      primary: true,
    },
    {
      id: "profile",
      done: profilePct >= 80,
      icon: "◑",
      title: "Complete your profile",
      detail: "Reach 80% to unlock all compliance recommendations.",
      href: "/dashboard/settings",
      cta: "Complete profile",
      primary: false,
    },
    {
      id: "first_activity",
      done: activityCount >= 1,
      icon: "✦",
      title: "Log your first CME activity",
      detail: "Start earning credits toward your renewal requirement.",
      href: "/dashboard/cme",
      cta: "Log activity",
      primary: false,
    },
    {
      id: "employer",
      done: hasEmployerLink,
      icon: "⊕",
      title: "Link to your employer",
      detail: "Share compliance visibility with your hospital or clinic.",
      href: "/dashboard/settings",
      cta: "Link employer",
      primary: false,
    },
    {
      id: "refer",
      done: referralCount > 0,
      icon: "◈",
      title: referralCount > 0
        ? `${referralCount} colleague${referralCount === 1 ? "" : "s"} referred — ${referralCount * 30} days earned`
        : "Refer a colleague — earn 30 more days",
      detail: referralCount > 0
        ? "Keep sharing your referral link to earn more free Pro time."
        : "Share your referral link and extend your trial by 30 days per colleague who joins.",
      href: "/dashboard/settings#referral",
      cta: referralCount > 0 ? "Share again" : "Get my link",
      primary: false,
    },
    {
      id: "pdf",
      done: false,
      icon: "⬇",
      title: pro ? "Download your compliance report" : "Unlock your compliance PDF",
      detail: pro
        ? "Generate your official CME compliance PDF for your licensing authority."
        : "Upgrade to Pro to download your official compliance report.",
      href: pro ? "/api/pdf/cme-report" : "/pricing?source=what_next_pdf",
      cta: pro ? "Download PDF" : "Upgrade to Pro →",
      primary: true,
    },
  ];

  const criticalSteps = steps.filter((s) => s.id !== "pdf" && s.id !== "refer");
  const doneCount = criticalSteps.filter((s) => s.done).length;
  const totalCount = criticalSteps.length;
  const allCriticalDone = doneCount === totalCount;
  const pct = Math.round((doneCount / totalCount) * 100);

  // Once all critical steps done and user is Pro with activities, hide the card
  if (allCriticalDone && pro && activityCount >= 5) return null;

  // Show only incomplete setup steps + always show refer + PDF
  const visibleSteps = [
    ...steps.filter((s) => s.id !== "pdf" && s.id !== "refer" && !s.done),
    steps.find((s) => s.id === "refer")!,
    steps.find((s) => s.id === "pdf")!,
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] mb-6">
      <div className="px-6 py-4 border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#111]">
              {allCriticalDone ? "Setup complete" : "Your setup progress"}
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              {doneCount}/{totalCount} steps completed
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${
              allCriticalDone
                ? "bg-[#dcfce7] text-[#16a34a]"
                : pct >= 60
                ? "bg-[#fff7ed] text-[#d97706]"
                : "bg-[#f1f5f9] text-[#64748b]"
            }`}
          >
            {pct}%
          </span>
        </div>

        <div className="mt-3 w-full bg-[#e2e8f0] rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              allCriticalDone ? "bg-[#16a34a]" : "bg-[#1a56a0]"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="divide-y divide-[#f1f5f9]">
        {visibleSteps.map((step) => (
          <div key={step.id} className="px-6 py-4 flex items-center gap-4">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                step.done
                  ? "bg-[#dcfce7] text-[#16a34a]"
                  : step.id === "pdf"
                  ? pro
                    ? "bg-[#e8f0fe] text-[#1a56a0]"
                    : "bg-[#fffbeb] text-[#d97706]"
                  : "bg-[#f1f5f9] text-[#64748b]"
              }`}
            >
              {step.done ? "✓" : step.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111]">{step.title}</p>
              <p className="text-xs text-[#64748b] mt-0.5">{step.detail}</p>
            </div>

            {!step.done && (
              <a
                href={step.href}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  step.primary
                    ? step.id === "pdf" && !pro
                      ? "bg-[#d97706] text-white hover:bg-[#b45309]"
                      : "bg-[#1a56a0] text-white hover:bg-[#1547a0]"
                    : "border border-[#e2e8f0] text-[#374151] hover:bg-[#f8fafc]"
                }`}
              >
                {step.cta}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
