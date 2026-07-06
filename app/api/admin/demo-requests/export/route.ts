import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .limit(1)
    .maybeSingle();
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: requests, error } = await admin
    .from("demo_requests")
    .select("name, email, job_title, org_name, org_type, staff_count, country, message, status, notes, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = [
    ["Name", "Email", "Job Title", "Organisation", "Org Type", "Staff Count", "Country", "Message", "Status", "Notes", "Submitted"],
    ...(requests ?? []).map((r) => [
      r.name, r.email, r.job_title, r.org_name, r.org_type,
      r.staff_count, r.country, r.message ?? "", r.status, r.notes ?? "",
      new Date(r.created_at).toISOString(),
    ]),
  ];

  const csvCell = (cell: unknown) => {
    const s = String(cell);
    const safe = /^[=+\-@\t\r]/.test(s) ? `\t${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const csv = rows
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  const filename = `demo-requests-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
