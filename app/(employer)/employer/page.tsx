import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EmployerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) redirect("/dashboard");

  const { data: staffLinks } = await admin
    .from("employer_link_requests")
    .select("id, professional_id, status")
    .eq("organization_id", member.organization_id)
    .eq("status", "approved");

  const staffCount = staffLinks?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#111] mb-2">Staff Compliance Overview</h1>
      <p className="text-sm text-[#64748b] mb-8">
        Approved staff members and their compliance status. You can only view data that professionals have consented to share.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs text-[#64748b] font-medium uppercase tracking-wide mb-2">Linked Staff</p>
          <p className="text-2xl font-bold text-[#1a56a0]">{staffCount}</p>
        </div>
      </div>

      {staffCount === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center text-[#64748b] text-sm">
          No approved staff yet. Staff members request to link to your organization during onboarding.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0]">
          <div className="px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="text-base font-semibold text-[#111]">Linked Staff</h2>
          </div>
          <div className="divide-y divide-[#e2e8f0]">
            {staffLinks!.map((link) => (
              <div key={link.id} className="px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-[#111]">Professional #{link.professional_id.slice(0, 8)}</p>
                <span className="text-xs bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded-full">Linked</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
