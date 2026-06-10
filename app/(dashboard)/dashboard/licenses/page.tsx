import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LicenseCountdownCard from "@/components/dashboard/LicenseCountdownCard";

export default async function LicensesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [profileRes, walletRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("license_number, licensing_authority, license_expiry, profession, specialty")
      .eq("auth_id", user.id)
      .single(),
    admin.from("cme_wallets").select("cycle_end_date, completed_credits, required_credits").eq("professional_id", user.id).maybeSingle(),
  ]);

  const profile = profileRes.data;
  const wallet = walletRes.data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-2">License Management</h1>
      <p className="text-sm text-[#64748b] mb-6">
        Track your professional license and renewal status.
      </p>

      {/* Visual countdown */}
      <div className="mb-6">
        <LicenseCountdownCard
          licenseExpiry={profile?.license_expiry ?? null}
          licenseNumber={profile?.license_number ?? null}
          authority={profile?.licensing_authority ?? null}
          profession={profile?.profession ?? null}
          cycleEnd={wallet?.cycle_end_date ?? null}
          cmeCompleted={wallet?.completed_credits ?? 0}
          cmeRequired={wallet?.required_credits ?? 50}
        />
      </div>

      {/* License details */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-6">
        <h2 className="text-base font-semibold text-[#111] mb-4">License Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="License Number" value={profile?.license_number ?? "Not set"} />
          <Field label="Licensing Authority" value={profile?.licensing_authority ?? "Not set"} />
          <Field label="Profession" value={profile?.profession ?? "Not set"} />
          <Field label="Specialty" value={profile?.specialty ?? "Not set"} />
        </div>

        <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
          <a href="/onboarding/3" className="text-sm text-[#1a56a0] hover:underline">
            Update license details
          </a>
        </div>
      </div>

      <div className="mt-6 bg-[#fef9c3] border border-[#fde68a] rounded-lg px-4 py-3 text-xs text-[#92400e]">
        Hayya Med PRO tracks license readiness only. It does not issue or renew licenses.
        Contact your licensing authority (e.g. QCHP) for official renewal.
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-[#111]">{value}</p>
    </div>
  );
}
