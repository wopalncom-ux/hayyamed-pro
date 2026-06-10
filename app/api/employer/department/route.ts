import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { link_id, department } = await req.json();
  if (!link_id) return NextResponse.json({ error: "link_id required" }, { status: 400 });

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await admin
    .from("employer_link_requests")
    .update({ department: department || null })
    .eq("id", link_id)
    .eq("organization_id", member.organization_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
