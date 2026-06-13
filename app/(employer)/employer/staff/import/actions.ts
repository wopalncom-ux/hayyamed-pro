"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import * as postmark from "postmark";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

type ImportRow = {
  email: string;
  first_name: string;
  last_name: string;
  department?: string;
};

export type ImportResult = {
  email: string;
  outcome: "linked" | "invited" | "already_linked" | "error";
  reason?: string;
};

async function sendStaffInviteEmail(to: string, name: string, orgName: string) {
  const token = process.env.POSTMARK_API_TOKEN;
  if (!token) return;

  const client = new postmark.ServerClient(token);
  const FROM = process.env.EMAIL_FROM ?? "Hayya Med Pro <noreply@hayyamed.pro>";
  const registerUrl = `${APP_URL}/register?invited=1&org=${encodeURIComponent(orgName)}`;

  await client.sendEmail({
    From: FROM,
    To: to,
    Subject: `You've been added to Hayya Med Pro by ${orgName}`,
    HtmlBody: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px">
        <div style="background:#1a56a0;padding:20px 28px;border-radius:12px 12px 0 0">
          <span style="color:white;font-size:18px;font-weight:700">Hayya Med Pro</span>
        </div>
        <div style="background:white;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
            Hi${name ? " " + name : ""},
          </p>
          <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px">
            <strong>${orgName}</strong> has added you to Hayya Med Pro â€” a platform for tracking CME/CPD compliance and managing your healthcare license renewals.
          </p>
          <a href="${registerUrl}" style="display:inline-block;background:#1a56a0;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:15px">
            Create Account â†’
          </a>
          <p style="color:#94a3b8;font-size:12px;margin:28px 0 0">If you did not expect this, you can safely ignore this email.</p>
        </div>
      </div>`,
    TextBody: `Hi${name ? " " + name : ""},\n\n${orgName} has added you to Hayya Med Pro.\n\nCreate your account: ${registerUrl}`,
    MessageStream: "outbound",
  });
}

export async function importStaffCsv(
  csvText: string,
): Promise<{ results: ImportResult[] } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return { error: "Not an employer admin." };

  const orgId = (member as { organization_id: string }).organization_id;
  const _orgs = member.organizations as { name: string }[] | { name: string } | null;
  const orgName = (Array.isArray(_orgs) ? _orgs[0]?.name : (_orgs as { name: string } | null)?.name) ?? "Your Organization";

  // Parse CSV (comma or semicolon delimited)
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return { error: "CSV must have a header row and at least one data row." };

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase().replace(/[^a-z_]/g, ""));

  const emailIdx = headers.findIndex((h) => h === "email");
  const firstIdx = headers.findIndex((h) => h.includes("first") || h === "firstname");
  const lastIdx = headers.findIndex((h) => h.includes("last") || h === "lastname");
  const deptIdx = headers.findIndex((h) => h.includes("dept") || h.includes("department"));

  if (emailIdx === -1) return { error: "CSV must have an 'email' column." };

  const rows: ImportRow[] = lines
    .slice(1)
    .map((line) => line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, "")))
    .filter((cols) => cols[emailIdx]?.includes("@"))
    .map((cols) => ({
      email: cols[emailIdx].toLowerCase(),
      first_name: firstIdx >= 0 ? (cols[firstIdx] ?? "") : "",
      last_name: lastIdx >= 0 ? (cols[lastIdx] ?? "") : "",
      department: deptIdx >= 0 ? (cols[deptIdx] || undefined) : undefined,
    }));

  if (rows.length === 0) return { error: "No valid email addresses found in CSV." };
  if (rows.length > 200) return { error: "Maximum 200 rows per import." };

  const results: ImportResult[] = [];

  for (const row of rows) {
    try {
      // Look up whether this email has an existing Supabase user via SQL helper
      const { data: foundId } = await admin.rpc("get_auth_user_id_by_email", { p_email: row.email });
      const professionalId = foundId as string | null;

      if (professionalId) {

        // Check for existing link
        const { data: existing } = await admin
          .from("employer_link_requests")
          .select("id, status")
          .eq("professional_id", professionalId)
          .eq("organization_id", orgId)
          .maybeSingle();

        if (existing && (existing.status === "approved" || existing.status === "pending")) {
          results.push({ email: row.email, outcome: "already_linked" });
          continue;
        }

        // Employer-initiated link = auto-approved
        await admin.from("employer_link_requests").upsert({
          professional_id: professionalId,
          organization_id: orgId,
          status: "approved",
          requested_by: "employer",
          department: row.department ?? null,
        }, { onConflict: "professional_id,organization_id" });

        results.push({ email: row.email, outcome: "linked" });
      } else {
        // Not on platform yet â€” send invite
        const name = [row.first_name, row.last_name].filter(Boolean).join(" ");
        await sendStaffInviteEmail(row.email, name, orgName).catch(() => {});
        results.push({ email: row.email, outcome: "invited" });
      }
    } catch {
      results.push({ email: row.email, outcome: "error", reason: "Processing failed." });
    }
  }

  await logAudit({
    actorAuthId: user.id,
    action: "employer.staff_import",
    targetTable: "organization_members",
    metadata: {
      orgId,
      total: rows.length,
      linked: results.filter((r) => r.outcome === "linked").length,
      invited: results.filter((r) => r.outcome === "invited").length,
    },
  });

  return { results };
}
