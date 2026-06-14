import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) {
    return NextResponse.json({ error: "Not an employer admin" }, { status: 403 });
  }

  const orgId = (member as { organization_id: string }).organization_id;
  const _orgs = (member as { organizations: { name: string } | { name: string }[] | null }).organizations;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Organization";

  // Required courses for this org
  const { data: reqs } = await admin
    .from("employer_required_courses")
    .select("id, course_id, due_date, courses(title)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });

  if (!reqs || reqs.length === 0) {
    return new NextResponse("No required courses configured.", {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="training-completion-${orgId.slice(0, 8)}.txt"`,
      },
    });
  }

  // Staff members
  const { data: staffLinks } = await admin
    .from("employer_link_requests")
    .select("professional_id")
    .eq("organization_id", orgId)
    .eq("status", "approved");

  const staffIds = (staffLinks ?? []).map((s) => s.professional_id as string);

  if (staffIds.length === 0) {
    return new NextResponse("No approved staff members.", {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="training-completion-empty.txt"`,
      },
    });
  }

  // Staff profiles
  const { data: profiles } = await admin
    .from("professional_profiles")
    .select("auth_id, full_name, profession, licensing_authority, license_number")
    .in("auth_id", staffIds);

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.auth_id, p]));

  // Course enrollments for all staff + required courses
  const courseIds = reqs.map((r) => r.course_id);
  const { data: enrollments } = await admin
    .from("course_enrollments")
    .select("course_id, professional_id, status, completed_at")
    .in("course_id", courseIds)
    .in("professional_id", staffIds)
    .neq("status", "cancelled");

  // Build completion map: professional_id → course_id → { status, completed_at }
  type EnrollRecord = { status: string; completed_at: string | null };
  const completionMap: Record<string, Record<string, EnrollRecord>> = {};
  (enrollments ?? []).forEach((e) => {
    if (!completionMap[e.professional_id]) completionMap[e.professional_id] = {};
    completionMap[e.professional_id][e.course_id] = {
      status: e.status,
      completed_at: e.completed_at ?? null,
    };
  });

  // Build CSV
  const courseHeaders = reqs.map((r) => {
    const course = Array.isArray(r.courses) ? r.courses[0] : r.courses as { title: string } | null;
    const title = course?.title ?? r.course_id;
    const due = r.due_date ? ` (due ${r.due_date})` : "";
    return `"${(title + due).replace(/"/g, '""')}"`;
  });

  const headers = [
    "Name",
    "Profession",
    "Authority",
    "License No.",
    ...courseHeaders,
    "Courses Completed",
    "Courses Total",
    "Completion %",
  ];

  const rows = staffIds.map((profId) => {
    const prof = profileMap[profId];
    const name = prof?.full_name ?? profId;
    const profession = prof?.profession ?? "—";
    const authority = prof?.licensing_authority ?? "—";
    const licenseNo = prof?.license_number ?? "—";

    let completedCount = 0;
    const courseStatuses = reqs.map((r) => {
      const enroll = completionMap[profId]?.[r.course_id];
      if (enroll?.status === "completed") {
        completedCount++;
        const date = enroll.completed_at ? new Date(enroll.completed_at).toLocaleDateString("en-GB") : "";
        return `Completed${date ? " " + date : ""}`;
      }
      if (enroll?.status === "in_progress") return "In progress";
      if (enroll?.status === "enrolled") return "Enrolled";
      return "Not started";
    });

    const pct = reqs.length > 0 ? Math.round((completedCount / reqs.length) * 100) : 0;

    return [
      `"${name.replace(/"/g, '""')}"`,
      `"${profession}"`,
      `"${authority}"`,
      `"${licenseNo}"`,
      ...courseStatuses.map((s) => `"${s}"`),
      completedCount,
      reqs.length,
      `${pct}%`,
    ].join(",");
  });

  const url = new URL(req.url);
  const paramOrgId = url.searchParams.get("orgId");
  if (paramOrgId && paramOrgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="training-completion-${dateStr}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
