"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function generatePassport() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  const year = new Date().getFullYear();
  const shortId = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  const passportNumber = `HMP-${year}-${shortId}`;

  const { error } = await admin
    .from("professional_passports")
    .insert({ auth_id: user.id, passport_number: passportNumber });

  if (error) throw error;
  revalidatePath("/dashboard/passport");
}

export async function rotateQR() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  const { error } = await admin
    .from("professional_passports")
    .update({
      qr_token: crypto.randomUUID(),
      qr_token_rotated_at: new Date().toISOString(),
    })
    .eq("auth_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/passport");
}

export async function updateVisibility(config: Record<string, boolean>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  const { error } = await admin
    .from("professional_passports")
    .update({ visibility_config: config })
    .eq("auth_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/passport");
}

export async function setPassportActive(active: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const admin = createAdminClient();
  const { error } = await admin
    .from("professional_passports")
    .update({ is_active: active })
    .eq("auth_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/passport");
}
