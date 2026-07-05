import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GovernmentChatClient from "@/components/government/GovernmentChatClient";

export const metadata = { title: "AI Assistant — Hayya Med Pro" };

export default async function GovernmentAIAssistantPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .in("role", ["government_admin", "government_staff"])
    .maybeSingle();

  if (!member) redirect("/government");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#111]">AI Compliance Assistant</h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Ask questions about your workforce data in plain English
          </p>
        </div>
        <span className="text-xs bg-[#e8f0fe] text-[#1a56a0] px-2.5 py-1 rounded-full font-medium border border-[#bfdbfe]">
          Powered by Gemini Flash Lite
        </span>
      </div>
      <GovernmentChatClient organizationId={member.organization_id} />
    </div>
  );
}
