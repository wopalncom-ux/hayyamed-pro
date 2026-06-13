"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logAudit } from "@/lib/audit";

const UpdateProviderSchema = z.object({
  name:          z.string().min(2, "Organization name must be at least 2 characters").max(200),
  description:   z.string().max(1000).optional(),
  website_url:   z.string().url("Enter a valid URL (e.g. https://example.com)").max(500).optional().or(z.literal("")),
  contact_email: z.string().email("Enter a valid email address").max(200).optional().or(z.literal("")),
});

export type UpdateProviderState = { error?: string; success?: boolean };

export async function updateProviderSettings(
  _prev: UpdateProviderState,
  formData: FormData,
): Promise<UpdateProviderState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const raw = {
    name:          formData.get("name") as string,
    description:   (formData.get("description") as string) || undefined,
    website_url:   (formData.get("website_url") as string) || undefined,
    contact_email: (formData.get("contact_email") as string) || undefined,
  };

  const parsed = UpdateProviderSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, description, website_url, contact_email } = parsed.data;
  const admin = createAdminClient();

  // Verify ownership — provider must be active and created by this user
  const { data: provider } = await admin
    .from("training_providers")
    .select("id")
    .eq("created_by", user.id)
    .eq("status", "active")
    .single();

  if (!provider) return { error: "Provider not found" };

  const { error } = await admin
    .from("training_providers")
    .update({
      name,
      description: description ?? null,
      website_url: website_url || null,
      contact_email: contact_email || null,
    })
    .eq("id", provider.id);

  if (error) return { error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "training_provider.settings_updated",
    targetTable: "training_providers",
    targetId: provider.id,
    metadata: { name, has_description: !!description, has_website: !!website_url, has_email: !!contact_email },
  });

  revalidatePath("/provider/settings");
  revalidatePath("/provider");
  return { success: true };
}
