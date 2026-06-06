import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [profileRes, walletRes, activitiesRes] = await Promise.all([
    admin.from("professional_profiles").select("*").eq("auth_id", user.id).single(),
    admin.from("cme_wallets").select("*").eq("professional_id", user.id).maybeSingle(),
    admin.from("cme_activities").select("id").eq("professional_id", user.id),
  ]);

  const profile = profileRes.data;
  const wallet = walletRes.data;
  const activityCount = activitiesRes.data?.length ?? 0;

  const completionPct = profile?.profile_completion_pct ?? 0;
  const daysToExpiry = profile?.license_expiry
    ? Math.ceil((new Date(profile.license_expiry).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111]">
          Welcome back, {profile?.full_name?.split(" ")[0] ?? "Professional"}
        </h1>
        <p className="text-[#64748b] text-sm mt-1">{profile?.profession} • {profile?.specialty}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Profile Complete"
          value={`${completionPct}%`}
          sub="Keep filling in your details"
          color={completionPct >= 80 ? "green" : "blue"}
        />
        <StatCard
          label="CME Credits"
          value={wallet ? `${wallet.completed_credits} / ${wallet.required_credits}` : "—"}
          sub={wallet ? `${wallet.required_credits - wallet.completed_credits} remaining` : "Set up CME wallet"}
          color={wallet?.compliance_status === "compliant" ? "green" : "orange"}
        />
        <StatCard
          label="License Expiry"
          value={daysToExpiry !== null ? `${daysToExpiry}d` : "—"}
          sub={profile?.license_expiry ? new Date(profile.license_expiry).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Not set"}
          color={daysToExpiry !== null && daysToExpiry < 90 ? "red" : "green"}
        />
        <StatCard
          label="CME Activities"
          value={String(activityCount)}
          sub="Logged activities"
          color="blue"
        />
      </div>

      {/* Disclaimer */}
      <div className="bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e]">
        Hayya Med PRO supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Always verify final requirements with your relevant regulatory body (e.g. QCHP).
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: {
  label: string;
  value: string;
  sub: string;
  color: "blue" | "green" | "orange" | "red";
}) {
  const colors = {
    blue: "bg-[#e8f0fe] text-[#1a56a0]",
    green: "bg-[#dcfce7] text-[#16a34a]",
    orange: "bg-[#fff7ed] text-[#d97706]",
    red: "bg-[#fef2f2] text-[#dc2626]",
  };
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold mb-1 ${colors[color].split(" ")[1]}`}>{value}</p>
      <p className="text-xs text-[#64748b]">{sub}</p>
    </div>
  );
}
