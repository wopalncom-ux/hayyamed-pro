import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const RegisterSchema = z.object({
  device_token: z.string().min(1).max(512),
  platform: z.enum(["ios", "android"]),
  app_version: z.string().max(20).optional(),
  os_version: z.string().max(20).optional(),
  device_model: z.string().max(50).optional(),
});

// POST /api/mobile/register-device
// Upserts a device token for push notifications (FCM for Android, APNs for iOS).
// Called by the React Native app on launch after requesting push permission.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
  }

  const { device_token, platform, app_version, os_version, device_model } = parsed.data;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("mobile_device_registrations")
    .upsert(
      {
        professional_id: user.id,
        device_token,
        platform,
        app_version: app_version ?? null,
        os_version: os_version ?? null,
        device_model: device_model ?? null,
        is_active: true,
        last_active_at: new Date().toISOString(),
      },
      { onConflict: "professional_id,device_token" }
    )
    .select("id")
    .single();

  if (error) {
    console.error("Device registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id, ok: true });
}

// DELETE /api/mobile/register-device
// Marks a device token inactive on logout or when the user revokes push permission.
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json().catch(() => null);
  const token = raw?.device_token as string | undefined;
  if (!token) return NextResponse.json({ error: "device_token required" }, { status: 400 });

  const admin = createAdminClient();
  await admin
    .from("mobile_device_registrations")
    .update({ is_active: false })
    .eq("professional_id", user.id)
    .eq("device_token", token);

  return NextResponse.json({ ok: true });
}
