import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProviderRegisterForm from "@/components/provider/ProviderRegisterForm";

export const metadata = {
  title: "Register as Training Provider — Hayya Med Pro",
};

export default async function ProviderRegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("training_providers")
    .select("id, name, status")
    .eq("created_by", user.id)
    .maybeSingle();

  // Already active → go to portal
  if (existing?.status === "active") redirect("/provider");

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-start justify-center pt-12 px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <span className="text-base font-bold text-[#1a56a0]">Hayya Med Pro</span>
          <h1 className="text-2xl font-bold text-[#111] mt-3 mb-1">Register as a Training Provider</h1>
          <p className="text-sm text-[#64748b]">
            List your accredited CME courses for GCC healthcare professionals.
          </p>
        </div>

        {existing?.status === "pending" ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 text-center">
            <div className="w-12 h-12 bg-[#fff7ed] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏳</span>
            </div>
            <h2 className="text-base font-semibold text-[#111] mb-2">Application Under Review</h2>
            <p className="text-sm text-[#64748b] mb-1">
              <strong>{existing.name}</strong> is pending admin approval.
            </p>
            <p className="text-sm text-[#64748b]">
              You&apos;ll be notified by email once your account is approved.
            </p>
          </div>
        ) : (
          <ProviderRegisterForm />
        )}
      </div>
    </div>
  );
}
