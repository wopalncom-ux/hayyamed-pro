"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();

  if (!member) redirect("/dashboard");
  return { user, admin };
}

export async function saveAIModuleSettings(
  entries: { key: string; value: string }[]
): Promise<void> {
  const { user, admin } = await assertAdmin();

  // Upsert each setting into platform_settings
  for (const { key, value } of entries) {
    await admin
      .from("platform_settings")
      .upsert(
        { key, value, updated_by: user.id },
        { onConflict: "key" }
      );
  }

  // Audit log
  await admin.from("audit_logs").insert({
    actor_id: user.id,
    action: "ai_module_settings_updated",
    target_type: "platform_settings",
    metadata: { keys: entries.map((e) => e.key) },
  });
}

export async function getAIModuleSettings(): Promise<Record<string, string>> {
  const { admin } = await assertAdmin();

  const { data } = await admin
    .from("platform_settings")
    .select("key, value")
    .like("key", "ai_%");

  if (!data) return {};
  return Object.fromEntries(data.map((row: { key: string; value: string }) => [row.key, row.value]));
}
