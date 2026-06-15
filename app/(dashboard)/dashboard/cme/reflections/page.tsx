import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import ReflectionJournal from "@/components/dashboard/ReflectionJournal";

export const metadata = { title: "CPD Reflection Journal — Hayya Med Pro" };

export default async function ReflectionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  // Fetch recent verified/pending CME activities to let user link reflections
  const { data: activities } = await admin
    .from("cme_activities")
    .select("id, title, activity_date, credits")
    .eq("professional_id", user.id)
    .in("verification_status", ["verified", "pending"])
    .order("activity_date", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111]">CPD Reflection Journal</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Record reflective practice entries linked to your CME activities — required for GMC, AHPRA, and NMC revalidation.
        </p>
      </div>

      <ReflectionJournal
        activities={(activities ?? []).map((a) => ({
          id: a.id,
          title: a.title,
          activity_date: a.activity_date,
          credits: a.credits,
        }))}
      />
    </div>
  );
}
