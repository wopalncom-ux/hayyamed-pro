import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, website_url, country_code, contact_email, is_accredited, accreditor } = body;

  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const admin = createAdminClient();

  // One registration per user
  const { data: existing } = await admin
    .from("training_providers")
    .select("id, status")
    .eq("created_by", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: existing.status === "suspended" ? "Account suspended" : "Application already submitted" },
      { status: 409 }
    );
  }

  const { data: provider, error } = await admin
    .from("training_providers")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      website_url: website_url?.trim() || null,
      country_code: country_code ?? "QA",
      contact_email: contact_email?.trim() || null,
      is_accredited: !!is_accredited,
      accreditor: is_accredited ? accreditor?.trim() || null : null,
      status: "pending",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "provider.registered",
    targetTable: "training_providers",
    targetId: provider.id,
    metadata: { name },
  });

  return NextResponse.json({ providerId: provider.id });
}
