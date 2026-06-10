import * as postmark from "postmark";

const FROM = "Hayya Med Pro <noreply@hayyamed.ai>";

function getClient() {
  return new postmark.ServerClient(process.env.POSTMARK_API_KEY!);
}
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://pro.hayyamed.pro";

function baseLayout(content: string) {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px">
      <div style="background:#1a56a0;padding:20px 28px;border-radius:12px 12px 0 0">
        <span style="color:white;font-size:18px;font-weight:700;letter-spacing:-0.3px">Hayya Med Pro</span>
      </div>
      <div style="background:white;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 12px 12px">
        ${content}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0"/>
        <p style="color:#94a3b8;font-size:12px;margin:0">Hayya Med Pro · Healthcare Professional Platform · Qatar</p>
      </div>
    </div>`;
}

async function send(To: string, Subject: string, HtmlBody: string) {
  try {
    await getClient().sendEmail({ From: FROM, To, Subject, HtmlBody });
  } catch { /* never crash a server action over an email */ }
}

export async function sendCmeVerifiedEmail({
  to, name, activityTitle, credits,
}: { to: string; name: string; activityTitle: string; credits: number }) {
  await send(to, `CME Activity Verified — +${credits} credits added`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${name},</p>
    <p style="color:#374151;margin:0 0 24px">Your CME activity has been <strong style="color:#16a34a">verified</strong> and credits added to your wallet.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0;color:#111;font-weight:600;font-size:15px">${activityTitle}</p>
      <p style="margin:6px 0 0;color:#16a34a;font-size:22px;font-weight:700">+${credits} credits</p>
    </div>
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View CME Wallet →</a>
  `));
}

export async function sendCmeRejectedEmail({
  to, name, activityTitle,
}: { to: string; name: string; activityTitle: string }) {
  await send(to, `Action Required: CME Activity Could Not Be Verified`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${name},</p>
    <p style="color:#374151;margin:0 0 24px">Unfortunately your CME activity could not be verified. Please review and resubmit with a valid certificate.</p>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0;color:#111;font-weight:600;font-size:15px">${activityTitle}</p>
      <p style="margin:6px 0 0;color:#dc2626;font-size:13px">Status: Not verified — certificate required</p>
    </div>
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Review &amp; Resubmit →</a>
  `));
}

export async function sendLicenseExpiryEmail({
  to, name, expiryDate, daysLeft,
}: { to: string; name: string; expiryDate: string; daysLeft: number }) {
  const urgent = daysLeft <= 7;
  const color = urgent ? "#dc2626" : "#d97706";
  await send(to, `${urgent ? "⚠️ Urgent: " : ""}License Expiring in ${daysLeft} Days`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${name},</p>
    <p style="color:#374151;margin:0 0 24px">Your license expires in <strong style="color:${color}">${daysLeft} days</strong> (${expiryDate}). Ensure your CME credits are complete before renewal.</p>
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Check CME Status →</a>
  `));
}

export interface DigestStaffAlert {
  name: string;
  profession: string;
  department: string | null;
  complianceStatus: "compliant" | "at_risk" | "non_compliant" | "unknown";
  completedCredits: number | null;
  requiredCredits: number | null;
  daysToExpiry: number | null;
}

export async function sendEmployerDigestEmail({
  to,
  adminName,
  orgName,
  total,
  compliant,
  atRisk,
  nonCompliant,
  expiringSoon,
  alerts,
  weekOf,
}: {
  to: string;
  adminName: string;
  orgName: string;
  total: number;
  compliant: number;
  atRisk: number;
  nonCompliant: number;
  expiringSoon: number;
  alerts: DigestStaffAlert[];
  weekOf: string;
}) {
  const pct = total > 0 ? Math.round((compliant / total) * 100) : 0;
  const pctColor = pct >= 80 ? "#16a34a" : pct >= 60 ? "#d97706" : "#dc2626";

  const alertRows = alerts.slice(0, 10).map((s) => {
    const statusColor = s.complianceStatus === "non_compliant" ? "#dc2626"
      : s.complianceStatus === "at_risk" ? "#d97706" : "#374151";
    const statusLabel = s.complianceStatus === "non_compliant" ? "Non-Compliant"
      : s.complianceStatus === "at_risk" ? "At Risk" : "—";
    const cmeText = s.completedCredits !== null
      ? `${s.completedCredits}/${s.requiredCredits ?? "?"} credits`
      : "Private";
    const licText = s.daysToExpiry !== null
      ? (s.daysToExpiry < 0 ? "EXPIRED" : `${s.daysToExpiry}d`)
      : "—";
    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#111;font-size:13px">${s.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">${s.department ?? "—"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:${statusColor};font-size:13px;font-weight:500">${statusLabel || cmeText}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:${s.daysToExpiry !== null && s.daysToExpiry <= 30 ? "#dc2626" : "#374151"};font-size:13px">${licText}</td>
      </tr>`;
  }).join("");

  const alertSection = alerts.length > 0 ? `
    <p style="font-weight:600;color:#111;margin:24px 0 8px">Staff Needing Attention (${Math.min(alerts.length, 10)} of ${alerts.length})</p>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
      <thead>
        <tr style="background:#f8fafc">
          <th style="text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600">Name</th>
          <th style="text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600">Dept</th>
          <th style="text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600">CME Status</th>
          <th style="text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600">License</th>
        </tr>
      </thead>
      <tbody>${alertRows}</tbody>
    </table>` : `<p style="color:#16a34a;margin:16px 0">All staff are compliant — no action required this week.</p>`;

  await send(to, `Weekly Compliance Digest — ${orgName} (${weekOf})`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 4px">Hi ${adminName},</p>
    <p style="color:#64748b;margin:0 0 24px;font-size:14px">Here is your weekly compliance snapshot for <strong style="color:#111">${orgName}</strong>.</p>

    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px">
      <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 20px;text-align:center;min-width:80px">
        <p style="margin:0;font-size:22px;font-weight:700;color:#1a56a0">${total}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#64748b">Total Staff</p>
      </div>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 20px;text-align:center;min-width:80px">
        <p style="margin:0;font-size:22px;font-weight:700;color:${pctColor}">${pct}%</p>
        <p style="margin:4px 0 0;font-size:11px;color:#64748b">Compliant</p>
      </div>
      ${atRisk > 0 ? `<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 20px;text-align:center;min-width:80px">
        <p style="margin:0;font-size:22px;font-weight:700;color:#d97706">${atRisk}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#64748b">At Risk</p>
      </div>` : ""}
      ${nonCompliant > 0 ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 20px;text-align:center;min-width:80px">
        <p style="margin:0;font-size:22px;font-weight:700;color:#dc2626">${nonCompliant}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#64748b">Non-Compliant</p>
      </div>` : ""}
      ${expiringSoon > 0 ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 20px;text-align:center;min-width:80px">
        <p style="margin:0;font-size:22px;font-weight:700;color:#dc2626">${expiringSoon}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#64748b">License ≤30d</p>
      </div>` : ""}
    </div>

    ${alertSection}

    <div style="margin-top:24px">
      <a href="${APP_URL}/employer" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View Full Dashboard →</a>
    </div>
  `));
}
