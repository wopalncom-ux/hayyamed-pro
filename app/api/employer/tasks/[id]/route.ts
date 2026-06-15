import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { dispatchWebhook } from "@/lib/webhooks/dispatch";
import { z } from "zod";

export const runtime = "nodejs";

const UpdateSchema = z.object({
  status: z.enum(["acknowledged", "completed"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const update: Record<string, unknown> = {
    status: parsed.data.status,
    updated_at: now,
  };

  if (parsed.data.status === "acknowledged") update.acknowledged_at = now;
  if (parsed.data.status === "completed") {
    update.acknowledged_at = now;
    update.completed_at = now;
  }

  const { data: updated, error } = await admin
    .from("employer_tasks")
    .update(update)
    .eq("id", id)
    .eq("assigned_to", user.id)
    .select("organization_id, title")
    .maybeSingle();

  if (error || !updated) return NextResponse.json({ error: "Failed to update task" }, { status: 500 });

  if (parsed.data.status === "completed") {
    dispatchWebhook(updated.organization_id, "staff.task_completed", {
      professional_id: user.id,
      task_id: id,
      task_title: updated.title,
      completed_at: now,
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
