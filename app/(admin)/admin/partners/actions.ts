"use server";

import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createPartner(formData: FormData) {
  const user = await requireAdminUser();
  if (!user) throw new Error("Unauthorized");

  const payload = {
    name:             formData.get("name") as string,
    logo_url:         (formData.get("logo_url") as string) || null,
    website_url:      (formData.get("website_url") as string) || null,
    country_code:     (formData.get("country_code") as string) || null,
    partner_type:     (formData.get("partner_type") as string) || null,
    organization_id:  (formData.get("organization_id") as string) || null,
    display_order:    parseInt((formData.get("display_order") as string) ?? "0"),
    tagline:          (formData.get("tagline") as string) || null,
    show_on_landing:  formData.get("show_on_landing") === "true",
    show_on_dashboard: formData.get("show_on_dashboard") === "true",
  };

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from("partners")
    .insert(payload)
    .select()
    .single();

  if (dbErr) throw new Error(dbErr.message);

  await logAudit({ actorAuthId: user.id, action: "admin.partner.create", targetTable: "partners", targetId: data.id, metadata: { name: data.name } });
  revalidatePath("/admin/partners");
}

export async function togglePartner(id: string, is_active: boolean) {
  const user = await requireAdminUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  await admin.from("partners").update({ is_active }).eq("id", id);
  await logAudit({ actorAuthId: user.id, action: is_active ? "admin.partner.activate" : "admin.partner.deactivate", targetTable: "partners", targetId: id });
  revalidatePath("/admin/partners");
}
