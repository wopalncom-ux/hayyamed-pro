import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendTaskAssignedEmail } from "@/lib/email";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

export const runtime = "nodejs";

const CreateTaskSchema = z.object({
  professional_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  message: z.string().max(1000).nullable().optional(),
  category: z.string().nullable().optional(),
  credits_target: z.number().int().positive().max(200).nullable().optional(),
  due_date: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = CreateTaskSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { professional_id, title, message, category, credits_target, due_date } = parsed.data;
  const orgId = member.organization_id;
  const orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = Array.isArray(orgs) ? orgs[0]?.name : (orgs as { name: string } | null)?.name ?? "Your Organization";

  const { data: link } = await admin
    .from("employer_link_requests")
    .select("id")
    .eq("organization_id", orgId)
    .eq("professional_id", professional_id)
    .eq("status", "approved")
    .maybeSingle();

  if (!link) return NextResponse.json({ error: "Staff member not linked to your organization" }, { status: 404 });

  const { data: task, error } = await admin
    .from("employer_tasks")
    .insert({
      organization_id: orgId,
      assigned_to: professional_id,
      assigned_by: user.id,
      title,
      message: message ?? null,
      category: category ?? null,
      credits_target: credits_target ?? null,
      due_date: due_date ?? null,
    })
    .select()
    .single();

  if (error || !task) return NextResponse.json({ error: "Failed to create task" }, { status: 500 });

  const { data: notif } = await admin
    .from("employer_notifications")
    .insert({
      organization_id: orgId,
      recipient_id: professional_id,
      sender_id: user.id,
      type: "task_assigned",
      subject: `New task: ${title}`,
      message: message ?? `Your employer has assigned you a new CPD task: ${title}`,
      sent_via_email: false,
    })
    .select("id")
    .single();

  const { data: staffProfile } = await admin
    .from("professional_profiles")
    .select("email, full_name")
    .eq("auth_id", professional_id)
    .maybeSingle();

  const email = staffProfile?.email;
  const name = staffProfile?.full_name;

  if (email && name) {
    await sendTaskAssignedEmail({
      to: email,
      staffName: name,
      senderOrgName: orgName,
      taskTitle: title,
      category: category ?? null,
      creditsTarget: credits_target ?? null,
      dueDate: due_date ?? null,
      message: message ?? null,
    });
    if (notif?.id) {
      await admin.from("employer_notifications").update({ sent_via_email: true }).eq("id", notif.id);
    }
  }

  await logAudit({
    actorAuthId: user.id,
    action: "employer_task_assigned",
    targetTable: "employer_tasks",
    targetId: task.id,
    metadata: { organization_id: orgId, assigned_to: professional_id, title },
  });

  return NextResponse.json({ task }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const professionalId = searchParams.get("professional_id");

  let query = admin
    .from("employer_tasks")
    .select("*")
    .eq("organization_id", member.organization_id)
    .order("created_at", { ascending: false });

  if (professionalId) query = query.eq("assigned_to", professionalId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });

  return NextResponse.json({ tasks: data ?? [] });
}
