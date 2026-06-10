import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { ToastProvider } from "@/components/ui/toast";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("professional_profiles")
    .select("full_name, onboarding_complete, onboarding_step")
    .eq("auth_id", user.id)
    .single();

  if (!profile?.onboarding_complete) {
    redirect(`/onboarding/${profile?.onboarding_step ?? 1}`);
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f8fafc]">
        <DashboardNav userName={profile?.full_name ?? user.email ?? "Professional"} />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
