import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import BulkCmeImport from "@/components/dashboard/BulkCmeImport";
import { isPro } from "@/lib/planUtils";

export const metadata = {
  title: "Bulk CME Import — Hayya Med Pro",
};

export default async function CmeBulkImportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan, status")
    .eq("professional_id", user.id)
    .maybeSingle();

  const { data: profile } = await admin
    .from("professional_profiles")
    .select("pro_trial_ends_at")
    .eq("auth_id", user.id)
    .single();

  const plan = sub?.plan ?? "free";
  const trialActive = profile?.pro_trial_ends_at
    ? new Date(profile.pro_trial_ends_at) > new Date()
    : false;

  const proAccess = isPro(plan) || trialActive;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/cme" className="text-sm text-[#1a56a0] hover:underline">
          ← CME Activities
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111]">Bulk CME Import</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Import multiple CME activities at once from a CSV file. Ideal for backfilling historical records.
        </p>
      </div>

      {!proAccess ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#fffbeb] flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#111] mb-2">Pro feature</h2>
          <p className="text-sm text-[#64748b] mb-6 max-w-sm mx-auto">
            Bulk CSV import is available on the Pro plan. Upgrade to import your historical CME records in seconds.
          </p>
          <Link
            href="/pricing?source=bulk_cme_import"
            className="inline-flex items-center gap-2 text-sm font-bold bg-[#1a56a0] text-white px-6 py-3 rounded-xl hover:bg-[#154890] transition-colors"
          >
            Upgrade to Pro →
          </Link>
        </div>
      ) : (
        <BulkCmeImport />
      )}
    </div>
  );
}
