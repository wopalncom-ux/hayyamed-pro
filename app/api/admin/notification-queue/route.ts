import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  ids:    z.array(z.string().uuid()).min(1).max(100),
  action: z.enum(["retry", "cancel"]),
});

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { ids, action } = parsed.data;

  const update =
    action === "retry"
      ? { status: "pending" as const, attempts: 0, error_message: null as string | null, next_retry_at: null as string | null }
      : { status: "cancelled" as const };

  const { error } = await admin
    .from("notification_queue")
    .update(update)
    .in("id", ids);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: `admin.notification_queue.${action}`,
    targetTable: "notification_queue",
    metadata: { count: ids.length, action },
  });

  return NextResponse.json({ ok: true, updated: ids.length });
}
