import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const PrefsSchema = z.object({
  push_license_expiry:    z.boolean().optional(),
  push_cme_deadline:      z.boolean().optional(),
  push_employer_tasks:    z.boolean().optional(),
  push_compliance_alerts: z.boolean().optional(),
});

export async function GET(_req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("professional_profiles")
    .select("push_license_expiry, push_cme_deadline, push_employer_tasks, push_compliance_alerts")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  return NextResponse.json({ preferences: data });
}

export async function PATCH(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PrefsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("professional_profiles")
    .update(parsed.data)
    .eq("auth_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
