import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const UpdateSchema = z.object({
  updates: z.record(z.string(), z.string()),
});

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const admin = createAdminClient();
  const { data, error: dbErr } = await admin
    .from("platform_settings")
    .select("*")
    .order("key");

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function POST(req: NextRequest) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const admin = createAdminClient();

  for (const [key, value] of Object.entries(parsed.data.updates)) {
    await admin
      .from("platform_settings")
      .upsert({ key, value, updated_by: user.id }, { onConflict: "key" });
  }

  await logAudit({ actorAuthId: user.id, action: "admin.platform_settings.update", targetTable: "platform_settings", metadata: { keys: Object.keys(parsed.data.updates) } });

  return NextResponse.json({ success: true });
}
