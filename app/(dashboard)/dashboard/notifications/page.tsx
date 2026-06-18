import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NotificationsEnableButton from "@/components/dashboard/NotificationsEnableButton";

const LICENSE_REMINDER_DAYS = [90, 60, 30, 14, 7];
const CME_REMINDER_DAYS = [30, 14, 7];

const TEMPLATE_LABELS: Record<string, string> = {
  license_expiry_90d:    "License expiry in 90 days",
  license_expiry_60d:    "License expiry in 60 days",
  license_expiry_30d:    "License expiry in 30 days",
  license_expiry_14d:    "License expiry in 14 days",
  license_expiry_7d:     "License expiry in 7 days",
  cme_deadline_reminder: "CME cycle deadline reminder",
  cme_deadline_30d:      "CME deadline in 30 days",
  cme_deadline_14d:      "CME deadline in 14 days",
  cme_deadline_7d:       "CME deadline in 7 days",
  compliance_alert:      "Compliance status alert",
  cme_verified:          "CME activity verified",
  cme_rejected:          "CME activity rejected",
  training_deadline:     "Training deadline reminder",
  cycle_renewed:         "CME cycle renewed",
  account_suspended:     "Account suspended",
  account_unsuspended:   "Account reinstated",
  drip_d1:               "Getting started with Hayya Med Pro",
  drip_d3:               "Track your first CME activity",
  drip_d7:               "Download your compliance report",
  drip_d10:              "Invite your team",
  trial_reminder:        "Trial period reminder",
  trial_ending:          "Your trial is ending soon",
};

function subtractDays(date: Date, days: number) {
  return new Date(date.getTime() - days * 86400000);
}

function fmt(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [profileRes, walletRes, recentRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("full_name, license_expiry")
      .eq("auth_id", user.id)
      .single(),
    admin.from("cme_wallets")
      .select("cycle_end_date, required_credits, completed_credits")
      .eq("professional_id", user.id)
      .maybeSingle(),
    admin.from("notification_queue")
      .select("id, channel, template_id, status, created_at, sent_at")
      .eq("professional_id", user.id)
      .in("status", ["sent", "pending", "failed"])
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const profile = profileRes.data;
  const wallet = walletRes.data;
  const recent = recentRes.data ?? [];
  const now = new Date();

  const licenseReminders: { label: string; date: Date; fired: boolean }[] = [];
  if (profile?.license_expiry) {
    const expiry = new Date(profile.license_expiry);
    for (const days of LICENSE_REMINDER_DAYS) {
      const reminderDate = subtractDays(expiry, days);
      licenseReminders.push({ label: `${days} days before expiry`, date: reminderDate, fired: reminderDate < now });
    }
  }

  const cmeReminders: { label: string; date: Date; fired: boolean }[] = [];
  if (wallet?.cycle_end_date) {
    const cycleEnd = new Date(wallet.cycle_end_date);
    for (const days of CME_REMINDER_DAYS) {
      const reminderDate = subtractDays(cycleEnd, days);
      cmeReminders.push({ label: `${days} days before cycle ends`, date: reminderDate, fired: reminderDate < now });
    }
  }

  const creditsNeeded = wallet ? Math.max(0, wallet.required_credits - wallet.completed_credits) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-2">Notifications</h1>
      <p className="text-sm text-[#64748b] mb-6">
        Manage your alerts and see your upcoming reminder schedule.
      </p>

      <div className="space-y-4">
        {/* Recent activity inbox */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-4">Recent Activity</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-[#64748b]">No notifications sent yet. Reminders and alerts will appear here once your profile is set up.</p>
          ) : (
            <div className="divide-y divide-[#f8fafc]">
              {recent.map((item) => {
                const label = TEMPLATE_LABELS[item.template_id] ?? item.template_id.replace(/_/g, " ");
                return (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      item.status === "sent" ? "bg-[#16a34a]" :
                      item.status === "pending" ? "bg-[#d97706]" :
                      "bg-[#dc2626]"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#111] leading-snug">{label}</p>
                      <p className="text-xs text-[#64748b] mt-0.5">{timeAgo(item.created_at)}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      item.channel === "email" ? "bg-[#f0f7ff] text-[#1a56a0]" :
                      item.channel === "push"  ? "bg-[#f0fdf4] text-[#15803d]" :
                                                 "bg-[#f1f5f9] text-[#64748b]"
                    }`}>
                      {item.channel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Push notifications */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-1">Push Notifications</h2>
          <p className="text-sm text-[#64748b] mb-4">
            Receive browser notifications for license expiry, CME deadlines, and compliance alerts — even when you&apos;re not on the site.
          </p>
          <NotificationsEnableButton />
        </div>

        {/* License expiry reminders */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-1">License Expiry Reminders</h2>
          {profile?.license_expiry ? (
            <>
              <p className="text-sm text-[#64748b] mb-4">
                Your license expires on <strong className="text-[#111]">{fmt(new Date(profile.license_expiry))}</strong>.
                You&apos;ll receive email reminders at each of the following dates.
              </p>
              <div className="space-y-2">
                {licenseReminders.map(({ label, date, fired }) => (
                  <div key={label} className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${fired ? "bg-[#f8fafc]" : "bg-[#f0f7ff]"}`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${fired ? "bg-[#64748b]" : "bg-[#1a56a0]"}`} />
                      <span className={`text-sm ${fired ? "text-[#64748b] line-through" : "text-[#374151]"}`}>{label}</span>
                    </div>
                    <span className={`text-xs ${fired ? "text-[#64748b]" : "text-[#64748b]"}`}>{fmt(date)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-4">
              <p className="text-sm text-[#64748b] mb-3">No license expiry date set.</p>
              <a href="/dashboard/settings" className="text-sm text-[#1a56a0] hover:underline">
                Add your license expiry date in Settings →
              </a>
            </div>
          )}
        </div>

        {/* CME deadline reminders */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-1">CME Cycle Deadline Reminders</h2>
          {wallet?.cycle_end_date ? (
            <>
              <p className="text-sm text-[#64748b] mb-4">
                Your CME cycle ends on <strong className="text-[#111]">{fmt(new Date(wallet.cycle_end_date))}</strong>.
                {creditsNeeded > 0 && (
                  <> You currently need <strong className="text-[#d97706]">{creditsNeeded} more credits</strong> to complete your cycle.</>
                )}
              </p>
              <div className="space-y-2">
                {cmeReminders.map(({ label, date, fired }) => (
                  <div key={label} className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${fired ? "bg-[#f8fafc]" : "bg-[#f0f7ff]"}`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${fired ? "bg-[#64748b]" : "bg-[#1a56a0]"}`} />
                      <span className={`text-sm ${fired ? "text-[#64748b] line-through" : "text-[#374151]"}`}>{label}</span>
                    </div>
                    <span className={`text-xs ${fired ? "text-[#64748b]" : "text-[#64748b]"}`}>{fmt(date)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-4">
              <p className="text-sm text-[#64748b] mb-3">No CME wallet found.</p>
              <a href="/dashboard/cme" className="text-sm text-[#1a56a0] hover:underline">
                Set up your CME wallet →
              </a>
            </div>
          )}
        </div>

        {/* Alert types */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
          <h2 className="text-base font-semibold text-[#111] mb-3">Active Alert Types</h2>
          <div className="space-y-2.5">
            {[
              { label: "License expiry reminders",  sub: "Email at 90, 60, 30, 14 and 7 days before expiry",                           active: !!profile?.license_expiry },
              { label: "CME cycle deadline alerts",  sub: "Email at 30, 14 and 7 days before cycle end date",                           active: !!wallet?.cycle_end_date },
              { label: "Compliance status changes",  sub: "Notified when status changes between compliant, at risk, and non-compliant", active: !!wallet },
              { label: "CME activity verified",      sub: "Email confirmation when admin verifies your activity and credits are added",  active: true },
              { label: "Employer compliance tasks",  sub: "Email when your employer sends a compliance task or reminder",               active: true },
            ].map(({ label, sub, active }) => (
              <div key={label} className="flex items-start gap-3 py-2 border-b border-[#f8fafc] last:border-0">
                <span className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${active ? "bg-[#dcfce7] text-[#16a34a]" : "bg-[#f1f5f9] text-[#64748b]"}`}>
                  {active ? "✓" : "—"}
                </span>
                <div>
                  <p className={`text-sm font-medium ${active ? "text-[#111]" : "text-[#64748b]"}`}>{label}</p>
                  <p className="text-xs text-[#64748b] mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
