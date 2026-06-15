import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan, isPro } from "@/lib/subscription";
import ReflectionJournal from "@/components/dashboard/ReflectionJournal";
import DownloadPortfolioButton from "@/components/dashboard/DownloadPortfolioButton";

export const metadata = { title: "CPD Reflection Journal — Hayya Med Pro" };

export default async function ReflectionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const [activitiesRes, reflectionsRes, plan] = await Promise.all([
    admin
      .from("cme_activities")
      .select("id, title, activity_date, credits")
      .eq("professional_id", user.id)
      .in("verification_status", ["verified", "pending"])
      .order("activity_date", { ascending: false })
      .limit(50),
    admin
      .from("cpd_reflections")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id),
    getUserPlan(user.id),
  ]);

  const reflectionCount = reflectionsRes.count ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">CPD Reflection Journal</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Record reflective practice entries linked to your CME activities — required for GMC, AHPRA, and NMC revalidation.
          </p>
        </div>
        <DownloadPortfolioButton isPro={isPro(plan)} reflectionCount={reflectionCount} />
      </div>

      <ReflectionJournal
        activities={(activitiesRes.data ?? []).map((a) => ({
          id: a.id,
          title: a.title,
          activity_date: a.activity_date,
          credits: a.credits,
        }))}
      />
    </div>
  );
}
