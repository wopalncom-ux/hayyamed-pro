import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint, p256dh, auth } = await request.json();
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  const admin = createAdminClient();
  await admin.from("push_subscriptions").upsert(
    { professional_id: user.id, endpoint, p256dh, auth, updated_at: new Date().toISOString() },
    { onConflict: "professional_id,endpoint" }
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint } = await request.json();
  const admin = createAdminClient();
  await admin.from("push_subscriptions").delete()
    .eq("professional_id", user.id).eq("endpoint", endpoint);

  return NextResponse.json({ ok: true });
}
