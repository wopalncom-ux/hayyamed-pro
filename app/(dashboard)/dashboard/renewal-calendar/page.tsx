import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Renewal Calendar — Hayya Med Pro",
  description: "All your upcoming renewal deadlines, license expiry dates, and CME cycle end dates in one timeline view.",
};

type RenewalEvent = {
  id: string;
  label: string;
  sublabel: string;
  date: Date;
  type: "license" | "cme" | "certification";
  country?: string;
  authority?: string;
};

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / 86400000);
}

function urgencyClass(days: number): { badge: string; dot: string; row: string } {
  if (days < 0)   return { badge: "bg-[#f1f5f9] text-[#94a3b8]",    dot: "bg-[#94a3b8]",    row: "opacity-60" };
  if (days <= 30)  return { badge: "bg-[#fef2f2] text-[#dc2626]",    dot: "bg-[#dc2626]",    row: "" };
  if (days <= 90)  return { badge: "bg-[#fff7ed] text-[#d97706]",    dot: "bg-[#d97706]",    row: "" };
  return               { badge: "bg-[#f0fdf4]  text-[#16a34a]",    dot: "bg-[#16a34a]",    row: "" };
}

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function badgeLabel(days: number) {
  if (days < 0) return "Expired";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 30) return `${days}d`;
  if (days <= 90) return `${days}d`;
  return `${days}d`;
}

const COUNTRY_LABELS: Record<string, string> = {
  QA: "Qatar (QCHP)", SA: "Saudi Arabia (SCFHS)", AE: "UAE (DHA/DOH)",
  KW: "Kuwait (MOH)", BH: "Bahrain (NHRA)", OM: "Oman (OMSB)",
  GB: "UK (GMC/NMC)", AU: "Australia (AHPRA)", IN: "India (NMC)",
};

export default async function RenewalCalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [profileRes, walletsRes, licensesRes] = await Promise.all([
    admin.from("professional_profiles")
      .select("license_expiry, full_name")
      .eq("auth_id", user.id)
      .maybeSingle(),
    admin.from("cme_wallets")
      .select("id, country, label, cycle_end_date, required_credits, completed_credits, compliance_status")
      .eq("professional_id", user.id)
      .order("created_at", { ascending: true }),
    admin.from("professional_licenses")
      .select("id, licensing_authority, country_code, profession, expiry_date, license_number, is_primary")
      .eq("professional_id", user.id)
      .order("expiry_date", { ascending: true }),
  ]);

  const profile = profileRes.data;
  const wallets = walletsRes.data ?? [];
  const licenses = licensesRes.data ?? [];

  const events: RenewalEvent[] = [];

  // Primary license expiry from profile
  if (profile?.license_expiry) {
    events.push({
      id: "primary-license",
      label: "Primary License Expiry",
      sublabel: "GCC Medical License",
      date: new Date(profile.license_expiry),
      type: "license",
    });
  }

  // CME wallet cycle end dates
  for (const wallet of wallets) {
    if (wallet.cycle_end_date) {
      const remaining = Math.max(0, wallet.required_credits - wallet.completed_credits);
      const country = COUNTRY_LABELS[wallet.country] ?? wallet.country;
      events.push({
        id: `wallet-${wallet.id}`,
        label: wallet.label ? `CME Cycle End — ${wallet.label}` : "CME Cycle Deadline",
        sublabel: `${country} · ${remaining} credit${remaining !== 1 ? "s" : ""} remaining`,
        date: new Date(wallet.cycle_end_date),
        type: "cme",
        country: wallet.country,
      });
    }
  }

  // Additional licenses from multi-license wallet
  for (const lic of licenses) {
    if (lic.expiry_date) {
      const country = COUNTRY_LABELS[lic.country_code] ?? lic.country_code;
      events.push({
        id: `lic-${lic.id}`,
        label: `${lic.licensing_authority} License Expiry`,
        sublabel: `${country}${lic.profession ? ` · ${lic.profession}` : ""}${lic.is_primary ? " · Primary" : ""}`,
        date: new Date(lic.expiry_date),
        type: "license",
        country: lic.country_code,
        authority: lic.licensing_authority,
      });
    }
  }

  // Sort chronologically
  events.sort((a, b) => a.date.getTime() - b.date.getTime());

  const upcoming = events.filter((e) => daysUntil(e.date) >= 0);
  const expired = events.filter((e) => daysUntil(e.date) < 0);

  const TYPE_ICON: Record<RenewalEvent["type"], string> = {
    license:       "📋",
    cme:           "🎓",
    certification: "🏅",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111] mb-1">Renewal Calendar</h1>
        <p className="text-sm text-[#64748b]">
          All your upcoming renewal deadlines in one timeline view.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-base font-semibold text-[#111] mb-2">No dates tracked yet</h2>
          <p className="text-sm text-[#64748b] max-w-sm mx-auto mb-6">
            Add your license expiry date, set up a CME wallet, or add multiple licenses to see your renewal timeline here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/dashboard/settings"
              className="text-sm font-medium text-[#1a56a0] border border-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#f0f4f8] transition-colors"
            >
              Add license expiry
            </a>
            <a
              href="/dashboard/licenses"
              className="text-sm font-medium text-[#1a56a0] border border-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#f0f4f8] transition-colors"
            >
              Manage licenses
            </a>
            <a
              href="/dashboard/cme"
              className="text-sm font-medium text-[#1a56a0] border border-[#1a56a0] px-4 py-2 rounded-lg hover:bg-[#f0f4f8] transition-colors"
            >
              Set up CME wallet
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming events */}
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-[#374151] uppercase tracking-wide mb-4">
                Upcoming — {upcoming.length} deadline{upcoming.length !== 1 ? "s" : ""}
              </h2>
              <div className="space-y-3">
                {upcoming.map((event) => {
                  const days = daysUntil(event.date);
                  const urg = urgencyClass(days);
                  return (
                    <div key={event.id} className={`bg-white border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-4 ${urg.row}`}>
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 flex flex-col items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${urg.dot}`} />
                      </div>

                      {/* Icon */}
                      <div className="flex-shrink-0 text-xl">{TYPE_ICON[event.type]}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111] truncate">{event.label}</p>
                        <p className="text-xs text-[#64748b] mt-0.5">{event.sublabel}</p>
                        <p className="text-xs text-[#94a3b8] mt-0.5">{fmtDate(event.date)}</p>
                      </div>

                      {/* Countdown badge */}
                      <div className="flex-shrink-0">
                        <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${urg.badge}`}>
                          {badgeLabel(days)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Expired events */}
          {expired.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-[#94a3b8] uppercase tracking-wide mb-4">
                Expired / Past
              </h2>
              <div className="space-y-2">
                {expired.map((event) => {
                  const days = daysUntil(event.date);
                  const urg = urgencyClass(days);
                  return (
                    <div key={event.id} className={`bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 flex items-center gap-4 ${urg.row}`}>
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${urg.dot}`} />
                      </div>
                      <div className="flex-shrink-0 text-xl opacity-40">{TYPE_ICON[event.type]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#94a3b8] truncate line-through">{event.label}</p>
                        <p className="text-xs text-[#94a3b8] mt-0.5">{event.sublabel}</p>
                        <p className="text-xs text-[#94a3b8] mt-0.5">{fmtDate(event.date)}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${urg.badge}`}>
                        Expired
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Quick actions */}
          <div className="bg-[#f0f4f8] border border-[#e2e8f0] rounded-xl p-5">
            <p className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-3">Add more dates</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="/dashboard/settings"
                className="text-xs font-medium text-[#1a56a0] border border-[#1a56a0] px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
              >
                Update license expiry
              </a>
              <a
                href="/dashboard/licenses"
                className="text-xs font-medium text-[#1a56a0] border border-[#1a56a0] px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
              >
                Add license
              </a>
              <a
                href="/dashboard/cme"
                className="text-xs font-medium text-[#1a56a0] border border-[#1a56a0] px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
              >
                CME wallet
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
