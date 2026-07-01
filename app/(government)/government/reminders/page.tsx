import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAuthorityForUser, getJurisdictionProfessionals, countryName } from "@/lib/government/jurisdiction";
import ReminderClient from "@/components/government/ReminderClient";

export const metadata = { title: "Send Reminder — Hayya Med Pro" };

export default async function GovernmentRemindersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const authority = await getAuthorityForUser(user.id);
  if (!authority) redirect("/government/register");

  const pros = await getJurisdictionProfessionals(authority, user.id);

  const counts = {
    all:              pros.length,
    license_expired:  pros.filter((p) => p.daysToExpiry !== null && p.daysToExpiry < 0).length,
    license_critical: pros.filter((p) => p.daysToExpiry !== null && p.daysToExpiry >= 0 && p.daysToExpiry < 30 && p.complianceStatus !== "compliant").length,
    license_warning:  pros.filter((p) => p.daysToExpiry !== null && p.daysToExpiry >= 30 && p.daysToExpiry < 60 && p.complianceStatus !== "compliant").length,
    compliant:        pros.filter((p) => p.complianceStatus === "compliant").length,
  };
  const employers = [...new Set(pros.map((p) => p.employer).filter((x): x is string => !!x))].sort();

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Send Reminder</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Send a direct compliance reminder to professionals in {countryName(authority.jurisdictionCountry)}. Delivered to their inbox, email, and device.
        </p>
      </div>
      <ReminderClient counts={counts} employers={employers} authorityName={authority.orgName} />
      <p className="text-xs text-[#64748b] mt-4">
        Every reminder is audit-logged. Recipients are limited to professionals in your jurisdiction.
      </p>
    </div>
  );
}
