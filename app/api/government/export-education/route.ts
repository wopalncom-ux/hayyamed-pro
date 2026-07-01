import { NextResponse } from "next/server";
import { headers } from "next/headers";
import ExcelJS from "exceljs";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getAuthorityForUser } from "@/lib/government/jurisdiction";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const MODE_LABEL: Record<string, string> = { online: "Online", in_person: "In-person", hybrid: "Hybrid" };

// GET /api/government/export-education — Education Oversight (CME activities) as Excel.
// Mirrors the Education page query + its ?q=&mode= filters so the report matches the screen.
export async function GET(req: Request): Promise<NextResponse> {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const authority = await getAuthorityForUser(user.id);
  if (!authority) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const params = new URL(req.url).searchParams;
  const q = (params.get("q") ?? "").toLowerCase().trim();
  const mode = params.get("mode") ?? "";

  const admin = createAdminClient();
  const { data: courseRows } = await admin
    .from("courses")
    .select("title, category, credits, credit_type, delivery_mode, duration_hours, start_date, end_date, status, professions, training_providers(name, is_accredited, accreditor)")
    .contains("country_codes", [authority.jurisdictionCountry])
    .in("status", ["active", "closed"])
    .order("start_date", { ascending: false, nullsFirst: false });

  type Row = { title: string; category: string; credits: number; credit_type: string; delivery_mode: string; duration_hours: number | null; start_date: string | null; end_date: string | null; status: string; provider: string; accredited: boolean; accreditor: string | null };
  let courses: Row[] = (courseRows ?? []).map((c) => {
    const _p = c.training_providers as { name: string; is_accredited: boolean; accreditor: string | null }[] | { name: string; is_accredited: boolean; accreditor: string | null } | null;
    const p = Array.isArray(_p) ? _p[0] : _p;
    return { title: c.title, category: c.category, credits: Number(c.credits), credit_type: c.credit_type, delivery_mode: c.delivery_mode, duration_hours: c.duration_hours, start_date: c.start_date, end_date: c.end_date, status: c.status, provider: p?.name ?? "—", accredited: p?.is_accredited ?? false, accreditor: p?.accreditor ?? null };
  });
  if (mode) courses = courses.filter((c) => c.delivery_mode === mode);
  if (q) courses = courses.filter((c) => c.title.toLowerCase().includes(q) || c.provider.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const accredited = courses.filter((c) => c.accredited).length;

  const wb = new ExcelJS.Workbook();
  wb.creator = "Hayya Med Pro";
  wb.created = new Date();

  const summary = wb.addWorksheet("Summary");
  summary.columns = [{ width: 30 }, { width: 18 }];
  summary.addRow([`${authority.authorityCode ?? authority.orgName} — Education Oversight`]);
  summary.getCell("A1").font = { bold: true, size: 14, color: { argb: "FF1A56A0" } };
  summary.addRow([`Jurisdiction: ${authority.jurisdictionCountry}`]);
  summary.addRow([`Generated: ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`]);
  if (mode || q) summary.addRow([`Filtered — ${[mode ? `Mode: ${MODE_LABEL[mode] ?? mode}` : null, q ? `Search: ${q}` : null].filter(Boolean).join(" · ")}`]);
  summary.addRow([]);
  ([["Total activities", courses.length], ["Accredited", accredited], ["Total CME credits", totalCredits]] as [string, number][]).forEach(([k, v]) => {
    const row = summary.addRow([k, v]);
    row.getCell(1).font = { color: { argb: "FF64748B" } };
    row.getCell(2).font = { bold: true };
  });

  const ws = wb.addWorksheet("Activities");
  ws.columns = [
    { header: "Activity", key: "title", width: 40 },
    { header: "Provider", key: "provider", width: 28 },
    { header: "Accreditor", key: "accreditor", width: 14 },
    { header: "Category", key: "category", width: 18 },
    { header: "Mode", key: "mode", width: 12 },
    { header: "Credits", key: "credits", width: 10 },
    { header: "Type", key: "type", width: 8 },
    { header: "Hours", key: "hours", width: 8 },
    { header: "Start", key: "start", width: 12 },
    { header: "End", key: "end", width: 12 },
    { header: "Status", key: "status", width: 10 },
  ];
  ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1A56A0" } };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  for (const c of courses) {
    ws.addRow({
      title: c.title, provider: c.provider, accreditor: c.accredited ? (c.accreditor ?? "Accredited") : "",
      category: c.category, mode: MODE_LABEL[c.delivery_mode] ?? c.delivery_mode,
      credits: c.credits, type: c.credit_type, hours: c.duration_hours ?? "",
      start: c.start_date ?? "", end: c.end_date ?? "", status: c.status,
    });
  }
  ws.autoFilter = { from: "A1", to: "K1" };

  const buffer = await wb.xlsx.writeBuffer();

  logAudit({
    actorAuthId: user.id,
    action: "government.education_exported",
    targetTable: "courses",
    targetId: authority.organizationId,
    metadata: { format: "xlsx", rows: courses.length, jurisdiction: authority.jurisdictionCountry },
  });

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="education-${authority.jurisdictionCountry}-${date}.xlsx"`,
    },
  });
}
