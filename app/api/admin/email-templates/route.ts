import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .maybeSingle();
  return member ? user : null;
}

const POSTMARK_BASE = "https://api.postmarkapp.com";

function postmarkHeaders() {
  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN ?? "",
  };
}

// GET /api/admin/email-templates — list all templates
// GET /api/admin/email-templates?id=123 — get one template with body
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.POSTMARK_SERVER_TOKEN) {
    return NextResponse.json({ error: "POSTMARK_SERVER_TOKEN not configured" }, { status: 503 });
  }

  const id = req.nextUrl.searchParams.get("id");

  if (id) {
    const res = await fetch(`${POSTMARK_BASE}/templates/${id}`, { headers: postmarkHeaders() });
    const json = await res.json();
    if (!res.ok) return NextResponse.json({ error: json.Message }, { status: res.status });
    return NextResponse.json({ template: json });
  }

  // List all templates (max 500)
  const res = await fetch(`${POSTMARK_BASE}/templates?Count=500&Offset=0`, { headers: postmarkHeaders() });
  const json = await res.json();
  if (!res.ok) return NextResponse.json({ error: json.Message }, { status: res.status });
  return NextResponse.json({ templates: json.Templates ?? [], total: json.TotalCount ?? 0 });
}

// PUT /api/admin/email-templates?id=123 — update subject + html/text body
export async function PUT(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.POSTMARK_SERVER_TOKEN) {
    return NextResponse.json({ error: "POSTMARK_SERVER_TOKEN not configured" }, { status: 503 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const body = await req.json();
  // Only allow updating safe fields
  const patch: Record<string, string> = {};
  if (body.Subject)  patch.Subject  = body.Subject;
  if (body.HtmlBody) patch.HtmlBody = body.HtmlBody;
  if (body.TextBody) patch.TextBody = body.TextBody;
  if (body.Name)     patch.Name     = body.Name;

  const res = await fetch(`${POSTMARK_BASE}/templates/${id}`, {
    method: "PUT",
    headers: postmarkHeaders(),
    body: JSON.stringify(patch),
  });
  const json = await res.json();
  if (!res.ok) return NextResponse.json({ error: json.Message }, { status: res.status });
  return NextResponse.json({ template: json });
}

// POST /api/admin/email-templates/send-test — send a test email
export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.POSTMARK_SERVER_TOKEN) {
    return NextResponse.json({ error: "POSTMARK_SERVER_TOKEN not configured" }, { status: 503 });
  }

  const { template_id, to_email } = await req.json();
  if (!template_id || !to_email) {
    return NextResponse.json({ error: "template_id and to_email required" }, { status: 400 });
  }

  // Only allow sending test to the admin themselves
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (authUser?.email && to_email !== authUser.email) {
    return NextResponse.json({ error: "Test emails can only be sent to your own address" }, { status: 403 });
  }

  const res = await fetch(`${POSTMARK_BASE}/email/withTemplate`, {
    method: "POST",
    headers: postmarkHeaders(),
    body: JSON.stringify({
      TemplateId: template_id,
      TemplateModel: {},
      From: process.env.POSTMARK_FROM_EMAIL ?? "noreply@hayyamed.pro",
      To: to_email,
    }),
  });
  const json = await res.json();
  if (!res.ok) return NextResponse.json({ error: json.Message }, { status: res.status });
  return NextResponse.json({ success: true, message_id: json.MessageID });
}
