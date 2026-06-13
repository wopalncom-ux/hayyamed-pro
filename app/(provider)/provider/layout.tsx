import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ProviderNav from "@/components/provider/ProviderNav";

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Allow the registration page through regardless of provider status
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? "";
  const isRegisterPage = pathname.endsWith("/provider/register");

  const admin = createAdminClient();
  const { data: provider } = await admin
    .from("training_providers")
    .select("id, name, status")
    .eq("created_by", user.id)
    .maybeSingle();

  // Not approved and not on the register page — redirect to register
  if (!isRegisterPage && (!provider || provider.status !== "active")) {
    redirect("/provider/register");
  }

  // On register page or has an active provider — render appropriately
  if (isRegisterPage || !provider || provider.status !== "active") {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <ProviderNav providerName={provider.name} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
