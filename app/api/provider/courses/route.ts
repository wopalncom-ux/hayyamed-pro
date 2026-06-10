import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: provider } = await admin
    .from("training_providers")
    .select("id")
    .eq("created_by", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!provider) return NextResponse.json({ error: "No active provider account" }, { status: 403 });

  const { data, error } = await admin
    .from("courses")
    .select("*")
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ courses: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { providerId, title, description, category, credits, credit_type, delivery_mode,
    duration_hours, is_free, price_usd, country_codes, start_date, end_date,
    enrollment_deadline, max_enrollments, status } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
  if (!providerId) return NextResponse.json({ error: "providerId required" }, { status: 400 });

  const admin = createAdminClient();

  // Verify provider ownership
  const { data: provider } = await admin
    .from("training_providers")
    .select("id")
    .eq("id", providerId)
    .eq("created_by", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!provider) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { data: course, error } = await admin
    .from("courses")
    .insert({
      provider_id: providerId,
      title: title.trim(),
      description: description?.trim() || null,
      category: category ?? "Other",
      credits: Number(credits),
      credit_type: credit_type ?? "CME",
      delivery_mode: delivery_mode ?? "online",
      duration_hours: duration_hours ?? null,
      is_free: !!is_free,
      price_usd: is_free ? null : price_usd,
      country_codes: country_codes ?? ["QA"],
      start_date: start_date || null,
      end_date: end_date || null,
      enrollment_deadline: enrollment_deadline || null,
      max_enrollments: max_enrollments ?? null,
      status: status ?? "draft",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: "course.created",
    targetTable: "courses",
    targetId: course.id,
    metadata: { providerId, title },
  });

  return NextResponse.json({ courseId: course.id }, { status: 201 });
}
