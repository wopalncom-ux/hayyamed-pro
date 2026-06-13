"use server";

import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const NpsSchema = z.object({
  score: z.number().int().min(0).max(10),
  comment: z.string().max(1000).optional(),
});

export async function submitNpsResponse(
  score: number,
  comment?: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const parsed = NpsSchema.safeParse({ score, comment });
  if (!parsed.success) return { ok: false, error: "Invalid score value" };

  // Check for a recent response within the last 365 days
  const cutoff = new Date(Date.now() - 365 * 86400000).toISOString();
  const { data: existing } = await supabase
    .from("nps_responses")
    .select("id")
    .eq("professional_id", user.id)
    .gte("created_at", cutoff)
    .maybeSingle();

  if (existing) return { ok: false, error: "Already submitted" };

  const { error } = await supabase.from("nps_responses").insert({
    professional_id: user.id,
    score: parsed.data.score,
    comment: parsed.data.comment ?? null,
  });

  if (error) return { ok: false, error: error.message };

  await logAudit({
    actorAuthId: user.id,
    action: "nps.submitted",
    targetTable: "nps_responses",
    targetId: user.id,
    metadata: { score: parsed.data.score },
  });

  return { ok: true };
}

export async function dismissNpsSurvey(): Promise<void> {
  // Stored client-side in localStorage — this action is a no-op server stub
  // so the component can call it as a server action if needed in future.
}
