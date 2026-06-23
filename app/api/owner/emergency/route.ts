import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  field: z.enum([
    "maintenance_mode",
    "disable_registrations",
    "disable_payments",
    "disable_ai",
    "disable_email_notifications",
    "emergency_banner_active",
    "maintenance_message",
    "emergency_banner_message",
    "emergency_banner_type",
  ]),
  value: z.union([z.boolean(), z.string()]),
});

async function getOwnerSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: roleData } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .maybeSingle();

  if (!roleData) return null;
  return { user, role: roleData.role, admin };
}

export async function POST(req: NextRequest) {
  const session = await getOwnerSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { field, value } = parsed.data;
  const { user, role, admin } = session;

  const { error } = await admin
    .from("platform_emergency_controls")
    .update({
      [field]: value,
      updated_by_auth_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .not("id", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from("audit_logs").insert({
    actor_auth_id: user.id,
    action: `emergency.${field}`,
    target_table: "platform_emergency_controls",
    metadata: { field, value, role },
  });

  return NextResponse.json({ ok: true, field, value });
}

export async function GET() {
  const session = await getOwnerSession();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await session.admin
    .from("platform_emergency_controls")
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
