"use server";

import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function updatePlatformSettings(updates: Record<string, string>) {
  const user = await requireAdminUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  for (const [key, value] of Object.entries(updates)) {
    await admin
      .from("platform_settings")
      .upsert({ key, value, updated_by: user.id }, { onConflict: "key" });
  }
  await logAudit({ actorAuthId: user.id, action: "admin.platform_settings.update", targetTable: "platform_settings", metadata: { keys: Object.keys(updates) } });
  revalidatePath("/admin/settings");
}
