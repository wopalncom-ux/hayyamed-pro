"use server";

import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createDiscount(formData: FormData) {
  const user = await requireAdminUser();
  if (!user) throw new Error("Unauthorized");

  const discount_type = formData.get("discount_type") as string;
  const target_type   = formData.get("target_type")   as string;
  const target_id_raw = formData.get("target_id")     as string;
  const plans_raw     = formData.get("applicable_plans") as string;

  const payload = {
    name:             formData.get("name") as string,
    description:      (formData.get("description") as string) || null,
    discount_type,
    discount_value:   parseFloat(formData.get("discount_value") as string) || 0,
    target_type,
    target_id:        target_id_raw || null,
    applicable_plans: plans_raw ? plans_raw.split(",").map((s) => s.trim()) : ["pro"],
    valid_until:      (formData.get("valid_until") as string) || null,
    max_uses:         formData.get("max_uses") ? parseInt(formData.get("max_uses") as string) : null,
    promo_code:       (formData.get("promo_code") as string) || null,
    notes:            (formData.get("notes") as string) || null,
    created_by:       user.id,
  };

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from("discounts")
    .insert(payload)
    .select()
    .single();

  if (dbErr) throw new Error(dbErr.message);

  await logAudit({ actorAuthId: user.id, action: "admin.discount.create", targetTable: "discounts", targetId: data.id, metadata: { name: data.name, discount_type: data.discount_type } });
  revalidatePath("/admin/discounts");
}

export async function toggleDiscount(id: string, is_active: boolean) {
  const user = await requireAdminUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  await admin.from("discounts").update({ is_active }).eq("id", id);
  await logAudit({ actorAuthId: user.id, action: is_active ? "admin.discount.activate" : "admin.discount.deactivate", targetTable: "discounts", targetId: id });
  revalidatePath("/admin/discounts");
}
