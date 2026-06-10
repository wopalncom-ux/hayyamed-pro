import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProviderNav from "@/components/provider/ProviderNav";

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: provider } = await admin
    .from("training_providers")
    .select("id, name, status")
    .eq("created_by", user.id)
    .maybeSingle();

  // No approved provider — send to registration (except if already on /provider/register)
  if (!provider || provider.status !== "active") {
    redirect("/provider/register");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ProviderNav providerName={provider.name} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
