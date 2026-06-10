import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

// Admin only — no role table, we protect via createAdminClient being service-key only on server
// Page already calls createAdminClient so this route uses the same pattern

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("training_providers")
    .select("*, courses(id)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ providers: data });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { providerId, action } = await req.json();
  if (!providerId || !action) return NextResponse.json({ error: "providerId + action required" }, { status: 400 });
  if (!["approve", "suspend", "reactivate"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const statusMap: Record<string, string> = {
    approve: "active",
    suspend: "suspended",
    reactivate: "active",
  };

  const admin = createAdminClient();
  const { error } = await admin
    .from("training_providers")
    .update({ status: statusMap[action] })
    .eq("id", providerId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: `provider.${action}`,
    targetTable: "training_providers",
    targetId: providerId,
    metadata: { newStatus: statusMap[action] },
  });

  return NextResponse.json({ ok: true });
}
