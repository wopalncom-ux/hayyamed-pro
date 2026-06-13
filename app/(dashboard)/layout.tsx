import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/dashboard/DashboardNav";
import NpsSurvey from "@/components/dashboard/NpsSurvey";
import PostHogIdentify from "@/components/PostHogIdentify";
import HayyaVoiceOrb from "@/components/ai/HayyaVoiceOrb";
import { ToastProvider } from "@/components/ui/toast";
import { getUserPlan } from "@/lib/subscription";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [profileRes, orgLogoRes, employerMemberRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("full_name, onboarding_complete, onboarding_step, created_at")
      .eq("auth_id", user.id)
      .single(),
    // Fetch the org partner logo if this user is linked to an employer org that has a partner entry
    admin
      .from("employer_link_requests")
      .select("organization_id")
      .eq("professional_id", user.id)
      .eq("status", "approved")
      .maybeSingle()
      .then(async ({ data: link }) => {
        if (!link?.organization_id) return null;
        const { data } = await admin
          .from("partners")
          .select("name, logo_url")
          .eq("organization_id", link.organization_id)
          .eq("is_active", true)
          .eq("show_on_dashboard", true)
          .maybeSingle();
        return data;
      }),
    admin
      .from("organization_members")
      .select("role")
      .eq("auth_id", user.id)
      .eq("role", "employer_admin")
      .maybeSingle(),
  ]);

  const profile = profileRes.data;
  const isEmployerAdmin = !!employerMemberRes?.data;
  const userPlan = await getUserPlan(user.id);

  if (!profile?.onboarding_complete) {
    redirect(`/onboarding/${profile?.onboarding_step ?? 1}`);
  }

  return (
    <ToastProvider>
      <PostHogIdentify userId={user.id} />
      <div className="min-h-screen bg-[#f8fafc]">
        <DashboardNav
          userName={profile?.full_name ?? user.email ?? "Professional"}
          orgName={orgLogoRes?.name ?? undefined}
          orgLogoUrl={orgLogoRes?.logo_url ?? undefined}
          isEmployerAdmin={isEmployerAdmin}
        />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        {profile?.created_at && <NpsSurvey createdAt={profile.created_at} />}
        <HayyaVoiceOrb plan={userPlan} />
        <footer className="border-t border-[#e2e8f0] mt-4">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-[#94a3b8]">
            <span>Hayya Med Pro supports CME tracking only. Verify requirements with your regulatory authority.</span>
            <a href="/help" className="hover:text-[#374151] transition-colors whitespace-nowrap ml-4">Help & FAQ</a>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
