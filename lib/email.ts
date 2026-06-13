import * as postmark from "postmark";
import { createAdminClient } from "@/lib/supabase/server";
import { unsubUrl } from "@/lib/emailToken";

const FROM = process.env.EMAIL_FROM ?? "Hayya Med Pro <noreply@hayyamed.pro>";

function esc(s: string | null | undefined): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function getClient() {
  return new postmark.ServerClient(process.env.POSTMARK_API_TOKEN!);
}
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";

function baseLayout(content: string, unsubscribeUrl?: string) {
  const prefsUrl = `${APP_URL}/dashboard/settings#notifications`;
  const unsubLink = unsubscribeUrl
    ? `<a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline">Unsubscribe</a> Â· `
    : "";
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px">
      <div style="background:#1a56a0;padding:20px 28px;border-radius:12px 12px 0 0">
        <span style="color:white;font-size:18px;font-weight:700;letter-spacing:-0.3px">Hayya Med Pro</span>
      </div>
      <div style="background:white;border:1px solid #e2e8f0;border-top:none;padding:32px;border-radius:0 0 12px 12px">
        ${content}
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0"/>
        <p style="color:#94a3b8;font-size:12px;margin:0 0 6px">Hayya Med Pro Â· Healthcare Professional Platform Â· Qatar</p>
        <p style="color:#94a3b8;font-size:11px;margin:0">${unsubLink}<a href="${prefsUrl}" style="color:#94a3b8;text-decoration:underline">Manage email preferences</a></p>
      </div>
    </div>`;
}

async function isSuppressed(email: string): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("professional_profiles")
      .select("email_hard_bounced, email_spam_reported")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();
    return !!(data?.email_hard_bounced || data?.email_spam_reported);
  } catch {
    return false; // fail open â€” better to attempt delivery than silently drop
  }
}

async function send(To: string, Subject: string, HtmlBody: string, unsubscribeUrl?: string) {
  try {
    if (await isSuppressed(To)) return;
    const headers = unsubscribeUrl
      ? [
          { Name: "List-Unsubscribe", Value: `<${unsubscribeUrl}>` },
          { Name: "List-Unsubscribe-Post", Value: "List-Unsubscribe=One-Click" },
        ]
      : undefined;
    await getClient().sendEmail({ From: FROM, To, Subject, HtmlBody, ...(headers ? { Headers: headers } : {}) });
  } catch { /* never crash a server action over an email */ }
}

export async function sendCmeVerifiedEmail({
  to, name, activityTitle, credits, isPro = true,
}: { to: string; name: string; activityTitle: string; credits: number; isPro?: boolean }) {
  const upgradeBlock = isPro ? "" : `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin:20px 0 0">
      <p style="margin:0 0 4px;font-weight:600;color:#1e40af;font-size:14px">Download your compliance report</p>
      <p style="margin:0 0 12px;color:#374151;font-size:13px">Pro members can download a formatted QCHP, SCFHS, or DHA-ready PDF report at any time. Upgrade to Pro to generate yours.</p>
      <a href="${APP_URL}/pricing" style="display:inline-block;background:#1a56a0;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">Upgrade to Pro â†’</a>
    </div>`;
  await send(to, `CME Activity Verified â€” +${credits} credits added`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 24px">Your CME activity has been <strong style="color:#16a34a">verified</strong> and credits added to your wallet.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0;color:#111;font-weight:600;font-size:15px">${esc(activityTitle)}</p>
      <p style="margin:6px 0 0;color:#16a34a;font-size:22px;font-weight:700">+${credits} credits</p>
    </div>
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View CME Wallet â†’</a>
    ${upgradeBlock}
  `));
}

export async function sendCmeRejectedEmail({
  to, name, activityTitle, reason,
}: { to: string; name: string; activityTitle: string; reason?: string | null }) {
  await send(to, `Action Required: CME Activity Could Not Be Verified`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 24px">Unfortunately your CME activity could not be verified. Please review the feedback below and resubmit with a valid certificate.</p>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0;color:#111;font-weight:600;font-size:15px">${esc(activityTitle)}</p>
      <p style="margin:6px 0 0;color:#dc2626;font-size:13px">Status: Not verified</p>
      ${reason ? `<p style="margin:10px 0 0;color:#374151;font-size:13px;border-top:1px solid #fecaca;padding-top:10px"><strong>Reason:</strong> ${esc(reason)}</p>` : ""}
    </div>
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Review &amp; Resubmit â†’</a>
  `));
}

export async function sendComplianceReminderEmail({
  to, staffName, senderOrgName, message, creditsCompleted, creditsRequired, daysToExpiry,
}: {
  to: string;
  staffName: string;
  senderOrgName: string;
  message: string;
  creditsCompleted: number | null;
  creditsRequired: number | null;
  daysToExpiry: number | null;
}) {
  const cmeBlock = creditsCompleted !== null && creditsRequired !== null ? `
    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 18px;margin:16px 0">
      <p style="margin:0;font-size:12px;color:#64748b">Your CPD Progress</p>
      <p style="margin:6px 0 0;font-size:22px;font-weight:700;color:#1a56a0">${creditsCompleted} <span style="font-size:14px;font-weight:400;color:#64748b">/ ${creditsRequired} credits</span></p>
      ${daysToExpiry !== null ? `<p style="margin:4px 0 0;font-size:12px;color:${daysToExpiry <= 30 ? "#dc2626" : "#d97706"}">${daysToExpiry <= 0 ? "License EXPIRED" : `${daysToExpiry} days until license renewal`}</p>` : ""}
    </div>` : "";

  await send(to, `Action Required: CPD Compliance Reminder from ${esc(senderOrgName)}`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(staffName)},</p>
    <p style="color:#374151;margin:0 0 16px">Your employer <strong>${esc(senderOrgName)}</strong> has sent you a compliance reminder:</p>
    <div style="background:#fff7ed;border-left:4px solid #d97706;padding:14px 18px;border-radius:0 8px 8px 0;margin:0 0 16px">
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.6">${esc(message)}</p>
    </div>
    ${cmeBlock}
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View My CPD Wallet â†’</a>
    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">This reminder was sent by your employer administrator via Hayya Med Pro.</p>
  `));
}

export async function sendTaskAssignedEmail({
  to, staffName, senderOrgName, taskTitle, category, creditsTarget, dueDate, message,
}: {
  to: string;
  staffName: string;
  senderOrgName: string;
  taskTitle: string;
  category: string | null;
  creditsTarget: number | null;
  dueDate: string | null;
  message: string | null;
}) {
  const meta = [
    category ? `<span style="font-size:12px;color:#374151;background:#e0f2fe;padding:2px 8px;border-radius:4px;text-transform:capitalize">${category.replace("_", " ")}</span>` : "",
    creditsTarget ? `<span style="font-size:12px;color:#1a56a0;font-weight:600">${creditsTarget} credits target</span>` : "",
    dueDate ? `<span style="font-size:12px;color:#d97706">Due: ${new Date(dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>` : "",
  ].filter(Boolean).join("&nbsp;&nbsp;");

  await send(to, `New CPD Task Assigned by ${esc(senderOrgName)}`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(staffName)},</p>
    <p style="color:#374151;margin:0 0 16px">Your employer <strong>${esc(senderOrgName)}</strong> has assigned you a CPD task:</p>
    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin:0 0 20px">
      <p style="margin:0;color:#111;font-weight:600;font-size:15px">${esc(taskTitle)}</p>
      ${meta ? `<div style="margin:10px 0 0;display:flex;gap:12px;flex-wrap:wrap">${meta}</div>` : ""}
      ${message ? `<p style="margin:12px 0 0;color:#374151;font-size:13px;border-top:1px solid #dbeafe;padding-top:12px">${esc(message)}</p>` : ""}
    </div>
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View My CPD Tasks â†’</a>
    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">This task was assigned by your employer administrator via Hayya Med Pro.</p>
  `));
}

export async function sendLicenseExpiryEmail({
  to, name, expiryDate, daysLeft, authId,
}: { to: string; name: string; expiryDate: string; daysLeft: number; authId?: string }) {
  const urgent = daysLeft <= 7;
  const color = urgent ? "#dc2626" : "#d97706";
  const unsub = authId ? unsubUrl(authId, "license") : undefined;
  await send(to, `${urgent ? "âš ï¸ Urgent: " : ""}License Expiring in ${daysLeft} Days`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 24px">Your license expires in <strong style="color:${color}">${daysLeft} days</strong> (${expiryDate}). Ensure your CME credits are complete before renewal.</p>
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Check CME Status â†’</a>
  `, unsub), unsub);
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

export async function sendWelcomeEmail({
  to, name, profession, country,
}: { to: string; name: string; profession: string | null; country: string | null }) {
  const profLine = profession ? ` as a ${esc(profession.replace(/_/g, " "))}` : "";
  const countryLine = country ? ` in ${esc(country)}` : "";
  await send(to, `Welcome to Hayya Med Pro â€” your compliance journey starts here`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 20px">Welcome to Hayya Med Pro â€” your professional CME tracking and licensing platform${profLine}${countryLine}.</p>
    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0;font-weight:600;color:#111;font-size:14px">What you can do now:</p>
      <ul style="margin:10px 0 0;padding-left:18px;color:#374151;font-size:14px;line-height:1.8">
        <li>Track and log CME activities with automatic credit calculation</li>
        <li>Monitor your license renewal timeline</li>
        <li>Get AI-powered compliance gap analysis (Pro)</li>
        <li>Download your official CPD report (Pro)</li>
      </ul>
    </div>
    <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Go to My Dashboard â†’</a>
    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Always verify final requirements with your relevant regulatory body.</p>
  `));
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
      : s.complianceStatus === "at_risk" ? "At Risk" : "â€”";
    const cmeText = s.completedCredits !== null
      ? `${s.completedCredits}/${s.requiredCredits ?? "?"} credits`
      : "Private";
    const licText = s.daysToExpiry !== null
      ? (s.daysToExpiry < 0 ? "EXPIRED" : `${s.daysToExpiry}d`)
      : "â€”";
    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#111;font-size:13px">${esc(s.name)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px">${esc(s.department ?? "â€”")}</td>
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
    </table>` : `<p style="color:#16a34a;margin:16px 0">All staff are compliant â€” no action required this week.</p>`;

  await send(to, `Weekly Compliance Digest â€” ${esc(orgName)} (${esc(weekOf)})`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 4px">Hi ${esc(adminName)},</p>
    <p style="color:#64748b;margin:0 0 24px;font-size:14px">Here is your weekly compliance snapshot for <strong style="color:#111">${esc(orgName)}</strong>.</p>

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
        <p style="margin:4px 0 0;font-size:11px;color:#64748b">License â‰¤30d</p>
      </div>` : ""}
    </div>

    ${alertSection}

    <div style="margin-top:24px">
      <a href="${APP_URL}/employer" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View Full Dashboard â†’</a>
    </div>
  `));
}

export async function sendCmeDeadlineEmail({
  to, name, daysLeft, creditsNeeded, cycleEndDate, authId,
}: { to: string; name: string; daysLeft: number; creditsNeeded: number; cycleEndDate: string; authId?: string }) {
  const urgent = daysLeft <= 7;
  const color = urgent ? "#dc2626" : "#d97706";
  const unsub = authId ? unsubUrl(authId, "cme") : undefined;
  await send(to, `${urgent ? "âš ï¸ " : ""}CME Cycle Ends in ${daysLeft} Days â€” ${creditsNeeded} Credits Still Needed`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 20px">Your CME cycle ends on <strong style="color:${color}">${cycleEndDate}</strong> â€” only <strong style="color:${color}">${daysLeft} days away</strong>.</p>
    <div style="background:${urgent ? "#fef2f2" : "#fff7ed"};border:1px solid ${urgent ? "#fecaca" : "#fed7aa"};border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0;font-size:13px;color:#64748b">Credits still needed to complete your cycle</p>
      <p style="margin:6px 0 0;font-size:28px;font-weight:700;color:${color}">${creditsNeeded}</p>
    </div>
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Log CME Activities â†’</a>
    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities.</p>
  `, unsub), unsub);
}

export async function sendTrialStartEmail({
  to, name, trialEndsAt, referralCode, trialDays = 14,
}: { to: string; name: string; trialEndsAt: string; referralCode?: string | null; trialDays?: number }) {
  const expiryDate = new Date(trialEndsAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const referralUrl = referralCode
    ? `${APP_URL}/register?ref=${esc(referralCode)}`
    : `${APP_URL}/dashboard/settings#referral`;
  const referralSection = `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:24px 0">
      <p style="margin:0 0 6px;font-weight:600;color:#15803d;font-size:14px">Earn 30 more free days â€” refer a colleague</p>
      <p style="margin:0 0 12px;font-size:13px;color:#374151">Share Hayya Med Pro with a fellow healthcare professional. Each colleague who joins extends your trial by 30 days.</p>
      ${referralCode ? `<p style="margin:0 0 10px;font-size:12px;color:#64748b">Your referral link:</p>
      <p style="margin:0 0 12px;font-family:monospace;font-size:12px;color:#111;background:#fff;border:1px solid #d1fae5;border-radius:4px;padding:8px 12px;word-break:break-all">${referralUrl}</p>` : ""}
      <a href="${referralUrl}" style="display:inline-block;background:#16a34a;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px">${referralCode ? "Copy my referral link â†’" : "Generate my referral link â†’"}</a>
    </div>`;
  await send(to, `Your ${trialDays}-day Pro trial has started â€” welcome to full access`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 20px">Your <strong>${trialDays}-day Pro trial</strong> is now active. You have full access to every Pro feature â€” no credit card required.</p>
    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin:0 0 16px">
      <p style="margin:0;font-weight:600;color:#111;font-size:14px">What's included in your Pro trial:</p>
      <ul style="margin:10px 0 0;padding-left:18px;color:#374151;font-size:14px;line-height:1.9">
        <li>Unlimited CME activity submissions</li>
        <li>AI-powered compliance gap analysis</li>
        <li>Downloadable official CPD PDF report</li>
        <li>Multi-country compliance tracking</li>
        <li>Priority support</li>
      </ul>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 18px;margin:0 0 20px">
      <p style="margin:0;font-size:13px;color:#64748b">Trial expires: <strong style="color:#111">${expiryDate}</strong></p>
    </div>
    <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Explore Pro Features â†’</a>
    ${referralSection}
    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">No charge during the trial. Upgrade any time at <a href="${APP_URL}/pricing" style="color:#94a3b8">${APP_URL}/pricing</a> to keep Pro access after ${expiryDate}.</p>
  `));
}

export async function sendTrialEndingSoonEmail({
  to, name, daysLeft, trialEndsAt, authId,
}: { to: string; name: string; daysLeft: number; trialEndsAt: string; authId?: string }) {
  const expiryDate = new Date(trialEndsAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const urgent = daysLeft <= 1;
  const color = urgent ? "#dc2626" : "#d97706";
  const unsub = authId ? unsubUrl(authId, "reminders") : undefined;
  await send(to, `${urgent ? "âš ï¸ " : ""}Your Pro trial ends ${daysLeft === 1 ? "tomorrow" : `in ${daysLeft} days`} â€” don't lose access`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 20px">Your Pro trial expires on <strong style="color:${color}">${expiryDate}</strong> â€” <strong style="color:${color}">${daysLeft === 1 ? "tomorrow" : `in ${daysLeft} days`}</strong>.</p>
    <div style="background:${urgent ? "#fef2f2" : "#fff7ed"};border:1px solid ${urgent ? "#fecaca" : "#fed7aa"};border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0;font-weight:600;color:#111;font-size:14px">After your trial you will lose access to:</p>
      <ul style="margin:10px 0 0;padding-left:18px;color:#374151;font-size:14px;line-height:1.9">
        <li>AI compliance gap analysis</li>
        <li>PDF report download</li>
        <li>Unlimited CME submissions</li>
        <li>Multi-country tracking</li>
      </ul>
    </div>
    <a href="${APP_URL}/pricing" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Upgrade Now â€” from $6/month â†’</a>
    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">Your data is always safe regardless of plan. If you don't upgrade, you'll stay on the free tier with limited access.</p>
  `, unsub), unsub);
}

export async function sendTrialExpiredEmail({
  to, name, authId,
}: { to: string; name: string; authId?: string }) {
  await send(to, `Your Pro trial has ended â€” upgrade to keep your compliance on track`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 20px">Your Pro trial has ended. Your account is now on the <strong>Free plan</strong>.</p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0;font-weight:600;color:#111;font-size:14px;margin-bottom:8px">Upgrade to Pro to restore full access:</p>
      <div style="display:flex;align-items:baseline;gap:6px;margin:12px 0">
        <span style="font-size:32px;font-weight:700;color:#1a56a0">$6</span>
        <span style="font-size:14px;color:#64748b">/month â€” or $61.20/year (save 15%)</span>
      </div>
      <ul style="margin:8px 0 0;padding-left:18px;color:#374151;font-size:13px;line-height:1.9">
        <li>Unlimited CME activity submissions</li>
        <li>AI gap analysis &amp; compliance chatbot</li>
        <li>Downloadable CPD PDF report</li>
        <li>Multi-country compliance tracking</li>
      </ul>
    </div>
    <a href="${APP_URL}/pricing" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Upgrade to Pro â†’</a>
    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">Your CME history and profile data are always retained regardless of your plan.</p>
  `, authId ? unsubUrl(authId, "reminders") : undefined), authId ? unsubUrl(authId, "reminders") : undefined);
}

export async function sendTrialDay3Email({
  to, name, trialEndsAt,
}: { to: string; name: string; trialEndsAt: string }) {
  const expiryDate = new Date(trialEndsAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const daysRemaining = Math.max(1, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000));
  await send(to, `You're on day 3 of Pro â€” have you logged your first CME activity?`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 20px">You started your Pro trial 3 days ago. Your compliance tracker is ready â€” but it looks like you haven't logged your first CME activity yet.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 20px">
      <p style="margin:0 0 8px;font-weight:600;color:#15803d;font-size:14px">Logging your first activity only takes 60 seconds:</p>
      <ol style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:2">
        <li>Go to <strong>CME Wallet</strong> in your dashboard</li>
        <li>Click <strong>Add Activity</strong></li>
        <li>Enter the title, date, and credits â€” then submit</li>
      </ol>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 18px;margin:0 0 24px">
      <p style="margin:0;font-size:13px;color:#64748b">Your Pro trial ends: <strong style="color:#111">${expiryDate}</strong> Â· ${daysRemaining} days remaining</p>
    </div>
    <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Log my first CME activity â†’</a>
    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">Your compliance snapshot updates automatically as you add activities. Every verified activity brings you closer to renewal.</p>
  `));
}

export async function sendTrialDay7Email({
  to, name, completed, required, trialEndsAt,
}: { to: string; name: string; completed: number; required: number; trialEndsAt: string }) {
  const expiryDate = new Date(trialEndsAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const pct = required > 0 ? Math.min(100, Math.round((completed / required) * 100)) : 0;
  const barWidth = Math.max(4, pct);
  await send(to, `Halfway through your trial â€” here's your compliance snapshot`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 20px">You're 7 days into your Pro trial â€” ${Math.max(1, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))} days left. Here's where your CME compliance stands right now.</p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:0 0 20px">
      <p style="margin:0 0 12px;font-weight:600;color:#111;font-size:14px">Your compliance progress</p>
      <div style="background:#e2e8f0;border-radius:999px;height:8px;margin:0 0 8px;overflow:hidden">
        <div style="background:#1a56a0;height:8px;width:${barWidth}%;border-radius:999px"></div>
      </div>
      <p style="margin:0;font-size:13px;color:#64748b"><strong style="color:#111">${completed}</strong> of <strong style="color:#111">${required}</strong> credits verified Â· <strong style="color:#1a56a0">${pct}% complete</strong></p>
    </div>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0 0 8px;font-weight:600;color:#92400e;font-size:14px">After your trial ends on ${expiryDate}:</p>
      <ul style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:1.9">
        <li>PDF compliance report locked</li>
        <li>AI gap analysis &amp; chatbot off</li>
        <li>Activity limit: 10 total (Free plan)</li>
        <li>Multi-country tracking locked</li>
      </ul>
    </div>
    <a href="${APP_URL}/pricing" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Keep Pro access â€” $6/month â†’</a>
    <p style="color:#64748b;font-size:12px;margin:16px 0 0">Or $61.20/year (save 15%) Â· 14-day money-back guarantee Â· Cancel any time</p>
    <p style="color:#94a3b8;font-size:11px;margin:12px 0 0">Your CME data and profile are always kept, regardless of plan.</p>
  `));
}

export async function sendSubscriptionActivatedEmail({
  to, name, plan, billingInterval, employerTier,
}: { to: string; name: string; plan: string; billingInterval?: string; employerTier?: string | null }) {
  const intervalLabel = billingInterval === "monthly" ? "monthly" : "annual";

  if (plan === "employer") {
    const tierLabel = employerTier
      ? { clinic: "Clinic", growth: "Growth", department: "Department", hospital: "Hospital" }[employerTier] ?? "Employer"
      : "Employer";
    await send(
      to,
      `Your ${tierLabel} employer plan is active â€” complete your setup`,
      baseLayout(`
        <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px">You're on the ${esc(tierLabel)} Employer Plan, ${esc(name)}</p>
        <p style="color:#374151;margin:0 0 20px">Your ${esc(tierLabel)} plan is active (${esc(intervalLabel)} billing). One step left before you can see your team's compliance.</p>
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px 20px;margin-bottom:24px">
          <p style="margin:0 0 10px;font-weight:700;color:#92400e;font-size:15px">Complete your setup in 2 minutes</p>
          <p style="margin:0 0 6px;color:#374151;font-size:14px"><strong>Step 1</strong> â€” Register your organization (name, type, country)</p>
          <p style="margin:0;color:#374151;font-size:14px"><strong>Step 2</strong> â€” Share your org link with staff so they can request to link their profiles</p>
        </div>
        <a href="${APP_URL}/employer/register?welcome=1" style="display:inline-block;background:#d97706;color:white;text-decoration:none;padding:13px 28px;border-radius:8px;font-weight:700;font-size:15px;margin-bottom:20px">Set up my organization â†’</a>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:14px 18px;margin-top:4px">
          <p style="margin:0 0 6px;font-weight:600;color:#111;font-size:13px">Your employer plan includes:</p>
          <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;line-height:1.8">
            <li>Real-time staff compliance grid</li>
            <li>Department grouping and analytics</li>
            <li>Bulk PDF compliance reports for audits</li>
            <li>Weekly staff compliance digest emails</li>
            <li>Required course assignment</li>
          </ul>
        </div>
        <p style="color:#64748b;font-size:12px;margin:20px 0 0">Questions? Reply to this email or visit <a href="${APP_URL}/help" style="color:#1a56a0">${APP_URL}/help</a>.</p>
      `)
    );
    return;
  }

  const planLabel = plan === "pro" ? "Pro" : plan.charAt(0).toUpperCase() + plan.slice(1);
  await send(
    to,
    `You're now on ${planLabel} â€” Hayya Med Pro`,
    baseLayout(`
      <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px">Welcome to ${esc(planLabel)}, ${esc(name)}</p>
      <p style="color:#374151;margin:0 0 20px">Your ${esc(planLabel)} subscription is now active (${esc(intervalLabel)} billing). Everything is unlocked.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0 0 8px;font-weight:600;color:#111;font-size:14px">What's now available:</p>
        <ul style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:1.8">
          <li>Unlimited CME activity tracking</li>
          <li>PDF compliance report (download anytime)</li>
          <li>AI-powered gap analysis and recommendations</li>
          <li>Compliance chatbot with country-specific rules</li>
          <li>Certificate storage with signed URLs</li>
        </ul>
      </div>
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1a56a0;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Go to dashboard â†’</a>
      <p style="color:#64748b;font-size:12px;margin:20px 0 0">Questions? Reply to this email or visit <a href="${APP_URL}/help" style="color:#1a56a0">${APP_URL}/help</a>.</p>
    `)
  );
}

export async function sendSubscriptionCanceledEmail({
  to, name, periodEnd,
}: { to: string; name: string; periodEnd?: string | null }) {
  const accessLine = periodEnd
    ? `Your Pro access continues until <strong>${new Date(periodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong>.`
    : "Your Pro access will end at the end of the current billing period.";

  await send(
    to,
    "Your Hayya Med Pro subscription has been cancelled",
    baseLayout(`
      <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px">Subscription cancelled</p>
      <p style="color:#374151;margin:0 0 16px">Hi ${esc(name)}, your Hayya Med Pro subscription has been cancelled.</p>
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:16px 20px;margin-bottom:24px">
        <p style="margin:0;color:#92400e;font-size:14px">${accessLine} After that, your account will move to the free plan and your CME data will be preserved.</p>
      </div>
      <p style="color:#374151;margin:0 0 20px">Changed your mind? You can resubscribe at any time.</p>
      <a href="${APP_URL}/pricing" style="display:inline-block;background:#1a56a0;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Resubscribe â†’</a>
      <p style="color:#64748b;font-size:12px;margin:20px 0 0">Your CME history and profile data are always preserved, regardless of plan.</p>
    `)
  );
}

export async function sendLinkApprovedEmail({
  to, name, orgName,
}: { to: string; name: string; orgName: string }) {
  await send(
    to,
    `Your employer link to ${orgName} has been approved`,
    baseLayout(`
      <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px">Employer link approved âœ“</p>
      <p style="color:#374151;margin:0 0 20px">Hi ${esc(name)}, your request to link your profile to <strong>${esc(orgName)}</strong> has been approved.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0;color:#16a34a;font-weight:600">Your employer can now see your compliance summary as permitted by your privacy settings.</p>
      </div>
      <p style="color:#374151;margin:0 0 20px">You can review what your employer can see in your <a href="${APP_URL}/dashboard/settings" style="color:#1a56a0">privacy settings</a> at any time.</p>
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1a56a0;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Go to dashboard</a>
    `)
  );
}

export async function sendLinkRejectedEmail({
  to, name,
}: { to: string; name: string }) {
  await send(
    to,
    "Your employer link request was not approved",
    baseLayout(`
      <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px">Employer link request</p>
      <p style="color:#374151;margin:0 0 20px">Hi ${esc(name)}, your employer link request was not approved at this time.</p>
      <p style="color:#64748b;margin:0 0 20px">If you believe this is an error or have questions, please contact your employer directly or reach out to our support team.</p>
      <a href="${APP_URL}/contact" style="display:inline-block;background:#1a56a0;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Contact support</a>
    `)
  );
}

export async function sendProfessionalWeeklyDigestEmail({
  to,
  name,
  completed,
  required,
  complianceStatus,
  cycleEndDate,
  lastActivityDate,
  daysSinceActivity,
  isPro,
  remainingFreeActivities,
  country,
}: {
  to: string;
  name: string;
  completed: number;
  required: number;
  complianceStatus: string;
  cycleEndDate: string | null;
  lastActivityDate: string | null;
  daysSinceActivity: number | null;
  isPro: boolean;
  remainingFreeActivities: number;
  country: string;
}) {
  const pct = required > 0 ? Math.min(100, Math.round((completed / required) * 100)) : 0;
  const remaining = Math.max(0, required - completed);

  const daysLeft = cycleEndDate
    ? Math.ceil((new Date(cycleEndDate).getTime() - Date.now()) / 86400000)
    : null;

  const statusColor =
    complianceStatus === "compliant" ? "#16a34a" :
    complianceStatus === "at_risk" ? "#d97706" : "#dc2626";

  const statusLabel =
    complianceStatus === "compliant" ? "Compliant âœ“" :
    complianceStatus === "at_risk" ? "At Risk" : "Needs Attention";

  const inactivityNote = daysSinceActivity !== null && daysSinceActivity > 14
    ? `<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:12px 16px;margin:0 0 20px">
        <p style="margin:0;font-size:13px;color:#92400e">â° You haven't logged any activities in <strong>${daysSinceActivity} days</strong>. Log one today to keep your compliance on track.</p>
      </div>`
    : "";

  const freeNote = !isPro && remainingFreeActivities <= 3
    ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px 16px;margin:0 0 20px">
        <p style="margin:0;font-size:13px;color:#1e40af">You have <strong>${remainingFreeActivities} activity slot${remainingFreeActivities === 1 ? "" : "s"} remaining</strong> on your free plan. <a href="${APP_URL}/pricing?source=digest_email" style="color:#1a56a0;font-weight:600">Upgrade to Pro</a> for unlimited tracking.</p>
      </div>`
    : "";

  const ctaHtml = isPro
    ? `<a href="${APP_URL}/api/pdf/cme-report" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Download PDF Report â†’</a>
       <a href="${APP_URL}/dashboard/cme" style="display:inline-block;margin-left:12px;background:white;color:#1a56a0;border:1px solid #1a56a0;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Log Activity â†’</a>`
    : `<a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Log CME Activity â†’</a>`;

  const subject = complianceStatus === "compliant"
    ? `Your CME is on track â€” ${pct}% complete for ${country}`
    : `Weekly CME update â€” ${pct}% complete, ${remaining} credits to go`;

  await send(to, subject, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 4px">Hi ${esc(name)},</p>
    <p style="color:#64748b;margin:0 0 24px;font-size:14px">Here is your weekly CME compliance snapshot for <strong style="color:#111">${esc(country)}</strong>.</p>

    ${inactivityNote}
    ${freeNote}

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px 24px;margin:0 0 24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div>
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600">CME Progress</p>
          <p style="margin:6px 0 0;font-size:30px;font-weight:800;color:#1a56a0;line-height:1">${completed}<span style="font-size:16px;font-weight:400;color:#64748b"> / ${required} credits</span></p>
        </div>
        <div style="text-align:right">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600">Status</p>
          <p style="margin:6px 0 0;font-size:16px;font-weight:700;color:${statusColor}">${statusLabel}</p>
        </div>
      </div>

      <div style="background:#e2e8f0;border-radius:100px;height:8px;overflow:hidden;margin-bottom:10px">
        <div style="background:${pct >= 100 ? "#16a34a" : "#1a56a0"};width:${pct}%;height:100%;border-radius:100px"></div>
      </div>
      <div style="display:flex;justify-content:space-between">
        <p style="margin:0;font-size:12px;color:#64748b">${pct}% complete</p>
        ${daysLeft !== null ? `<p style="margin:0;font-size:12px;color:${daysLeft <= 30 ? "#dc2626" : "#64748b"}">${daysLeft <= 0 ? "Cycle ended" : `${daysLeft} days to renewal`}</p>` : ""}
      </div>
    </div>

    ${complianceStatus !== "compliant" && remaining > 0 ? `
    <div style="background:white;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0;font-size:13px;color:#64748b">Still needed</p>
      <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#111">${remaining} credits</p>
      ${daysLeft && daysLeft > 0 ? `<p style="margin:6px 0 0;font-size:12px;color:#64748b">= ${(remaining / Math.max(1, daysLeft / 30.4)).toFixed(1)} credits/month at current pace</p>` : ""}
    </div>` : ""}

    <div style="margin:0 0 16px">${ctaHtml}</div>

    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">
      You're receiving this because you have an active CME wallet on Hayya Med Pro.
      <a href="${APP_URL}/dashboard/settings" style="color:#94a3b8">Manage email preferences</a>
    </p>
  `));
}

export async function sendSupportEmail({
  name, email, subject, message,
}: { name: string; email: string; subject: string; message: string }) {
  const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@hayyamed.pro";
  try {
    await getClient().sendEmail({
      From: FROM,
      To: SUPPORT_EMAIL,
      ReplyTo: email,
      Subject: `[Support] ${esc(subject)} â€” from ${esc(name)}`,
      HtmlBody: baseLayout(`
        <p style="color:#374151;margin:0 0 16px">New support request from <strong>${esc(name)}</strong> (<a href="mailto:${esc(email)}" style="color:#1a56a0">${esc(email)}</a>).</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin-bottom:16px">
          <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b">Subject</p>
          <p style="margin:0;font-weight:600;color:#111">${esc(subject)}</p>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px">
          <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b">Message</p>
          <p style="margin:0;color:#374151;white-space:pre-wrap">${esc(message)}</p>
        </div>
      `),
    });
  } catch { /* never crash a server action over an email */ }
}

export async function sendSupportConfirmationEmail({
  to, name, subject,
}: { to: string; name: string; subject: string }) {
  await send(
    to,
    `We received your message â€” Hayya Med Pro`,
    baseLayout(`
      <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 6px">Got it, ${esc(name)}.</p>
      <p style="color:#374151;margin:0 0 20px">
        We received your message about <strong>${esc(subject)}</strong>. Our team typically responds within
        <strong>24 hours</strong> for Pro accounts and <strong>72 hours</strong> for free accounts.
      </p>
      <p style="color:#374151;margin:0 0 20px">
        You can reply directly to this email if you have anything to add.
      </p>
      <a href="${APP_URL}/help"
         style="display:inline-block;background:#f0f7ff;color:#1a56a0;border:1px solid #bfdbfe;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">
        Browse Help & FAQ â†’
      </a>
    `)
  );
}

export async function sendReferralRewardEmail({
  to,
  referrerName,
  refereeName,
  bonusDays,
  newTrialEndsAt,
}: {
  to: string;
  referrerName: string;
  refereeName: string;
  bonusDays: number;
  newTrialEndsAt: string;
}) {
  const endDate = new Date(newTrialEndsAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  await send(
    to,
    `ðŸŽ‰ Your referral joined â€” you've earned ${bonusDays} free Pro days`,
    baseLayout(`
      <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(referrerName)},</p>
      <p style="color:#374151;margin:0 0 24px">
        Great news â€” <strong>${esc(refereeName)}</strong> just completed their onboarding on Hayya Med Pro
        using your referral link. As a thank you, your Pro access has been extended.
      </p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin:0 0 24px">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em">Your reward</p>
        <p style="margin:0;font-size:28px;font-weight:800;color:#111">+${bonusDays} free Pro days</p>
        <p style="margin:6px 0 0;color:#64748b;font-size:14px">Pro access extended until <strong>${esc(endDate)}</strong></p>
      </div>

      <p style="color:#374151;margin:0 0 24px;font-size:14px">
        Keep sharing your referral link â€” every colleague who joins earns you another ${bonusDays} days of Pro.
        There's no cap.
      </p>

      <a href="${APP_URL}/dashboard/settings#referral"
         style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
        View my referral link â†’
      </a>

      <p style="color:#94a3b8;font-size:12px;margin:24px 0 0">
        To manage email preferences, visit
        <a href="${APP_URL}/dashboard/settings" style="color:#1a56a0">dashboard settings</a>.
      </p>
    `)
  );
}

export async function sendOnboardingReminderEmail({
  to, name, step,
}: { to: string; name: string; step: number }) {
  const resumeStep = Math.max(1, Math.min(step, 7));
  const href = `${APP_URL}/onboarding/${resumeStep}`;
  const stepLabel =
    resumeStep <= 2 ? "your profile details"
    : resumeStep <= 4 ? "your license information"
    : resumeStep === 5 ? "your CME wallet"
    : "your final step";

  await send(to, `Finish setting up your Hayya Med Pro account`, baseLayout(`
    <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(name)},</p>
    <p style="color:#374151;margin:0 0 20px">You started setting up your Hayya Med Pro account but haven't finished yet. You're just a couple of minutes from activating your <strong>Pro trial</strong> â€” no credit card required.</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px">
      <p style="margin:0 0 8px;font-weight:600;color:#15803d;font-size:14px">Your Pro trial includes:</p>
      <ul style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:1.9">
        <li>Unlimited CME activity tracking</li>
        <li>AI compliance gap analysis (powered by Claude)</li>
        <li>Official CPD PDF report â€” ready for QCHP or SCFHS submission</li>
        <li>License expiry reminders and renewal readiness score</li>
      </ul>
    </div>
    <a href="${href}" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Continue setup â€” finish ${esc(stepLabel)} â†’</a>
    <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">Setup takes about 3 minutes total. Your Pro trial activates automatically when you finish. Your CME data is always yours on any plan.</p>
  `));
}

export async function sendAdminActivityPendingEmail({
  activityTitle,
  professionalName,
  credits,
  activityDate,
  pendingCount,
}: {
  activityTitle: string;
  professionalName: string;
  credits: number;
  activityDate: string;
  pendingCount: number;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await send(
    adminEmail,
    `[Action needed] CME activity pending verification â€” ${esc(activityTitle)}`,
    baseLayout(`
      <p style="color:#374151;font-size:16px;margin:0 0 8px">New activity pending verification</p>
      <p style="color:#374151;margin:0 0 24px;font-size:14px">
        A new CME activity has been submitted and is awaiting your review.
      </p>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px 24px;margin:0 0 24px">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#1a56a0;text-transform:uppercase;letter-spacing:0.05em">Activity Details</p>
        <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#111">${esc(activityTitle)}</p>
        <p style="margin:0 0 4px;color:#374151;font-size:14px">Professional: <strong>${esc(professionalName)}</strong></p>
        <p style="margin:0 0 4px;color:#374151;font-size:14px">Credits: <strong>${credits}</strong></p>
        <p style="margin:0;color:#374151;font-size:14px">Date: <strong>${esc(activityDate)}</strong></p>
      </div>

      ${pendingCount > 1 ? `<p style="color:#64748b;font-size:14px;margin:0 0 24px">There ${pendingCount === 1 ? "is" : "are"} <strong>${pendingCount}</strong> total activities pending verification.</p>` : ""}

      <a href="${APP_URL}/admin/cme-activities"
         style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
        Review in Admin Panel â†’
      </a>
    `)
  );
}

export async function sendDemoRequestEmail({
  name, email, jobTitle, orgName, orgType, staffCount, country, message,
}: {
  name: string;
  email: string;
  jobTitle: string;
  orgName: string;
  orgType: string;
  staffCount: string;
  country: string;
  message: string;
}) {
  const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "support@hayyamed.pro";
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 12px;font-size:13px;color:#64748b;font-weight:500;white-space:nowrap;width:140px;vertical-align:top">${esc(label)}</td><td style="padding:8px 12px;font-size:13px;color:#111;font-weight:600">${esc(value)}</td></tr>`;

  try {
    await getClient().sendEmail({
      From: FROM,
      To: SUPPORT_EMAIL,
      ReplyTo: email,
      Subject: `[Demo Request] ${esc(orgName)} â€” ${esc(staffCount)} staff â€” ${esc(country)}`,
      HtmlBody: baseLayout(`
        <p style="color:#374151;font-size:16px;margin:0 0 4px">New employer demo request</p>
        <p style="color:#64748b;font-size:14px;margin:0 0 24px">From <strong>${esc(name)}</strong> at <strong>${esc(orgName)}</strong></p>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin:0 0 24px">
          <table style="width:100%;border-collapse:collapse">
            <tbody>
              ${row("Name", name)}
              ${row("Email", email)}
              ${row("Job title", jobTitle)}
              ${row("Organisation", orgName)}
              ${row("Org type", orgType)}
              ${row("Staff count", staffCount)}
              ${row("Country", country)}
            </tbody>
          </table>
        </div>

        ${message ? `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin:0 0 24px">
          <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600">Additional message</p>
          <p style="margin:0;color:#374151;font-size:14px;white-space:pre-wrap">${esc(message)}</p>
        </div>` : ""}

        <a href="mailto:${esc(email)}"
           style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          Reply to ${esc(name)} â†’
        </a>
      `),
    });
  } catch { /* never crash a server action over an email */ }
}

export async function sendFirstActivityEmail({
  to, name, activityTitle, credits, isPro: userIsPro,
}: {
  to: string;
  name: string;
  activityTitle: string;
  credits: number;
  isPro: boolean;
}) {
  await send(
    to,
    `âœ… First activity logged â€” your CME tracker is live`,
    baseLayout(`
      <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 6px">Your first CME activity is in, ${esc(name)}.</p>
      <p style="color:#374151;margin:0 0 20px">You just logged <strong>${esc(activityTitle)}</strong> â€” <strong>${credits} credit${credits !== 1 ? "s" : ""}</strong>. Your compliance dashboard has been updated automatically.</p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 20px">
        <p style="margin:0 0 6px;font-weight:600;color:#15803d;font-size:14px">What happens next</p>
        <ul style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:2">
          <li>Your activity is queued for verification by the Hayya Med team</li>
          <li>Once verified, it counts toward your compliance total</li>
          <li>Add more activities as you complete them â€” your tracker updates in real time</li>
        </ul>
      </div>

      ${userIsPro ? `
      <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin:0 0 24px">
        <p style="margin:0 0 6px;font-weight:600;color:#1a56a0;font-size:14px">Download your compliance report any time</p>
        <p style="margin:0;color:#374151;font-size:14px">Your Pro plan includes a one-click PDF compliance report â€” formatted for QCHP, SCFHS, DHA, or any GCC authority renewal submission.</p>
      </div>
      <a href="${APP_URL}/dashboard/cme" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View my CME dashboard â†’</a>
      ` : `
      <div style="background:#fdf4ff;border:1px solid #e9d5ff;border-radius:8px;padding:16px 20px;margin:0 0 24px">
        <p style="margin:0 0 6px;font-weight:600;color:#7c3aed;font-size:14px">Upgrade to Pro to download your compliance report</p>
        <p style="margin:0;color:#374151;font-size:14px">Pro generates a one-click PDF compliance report â€” ready to attach to your QCHP, SCFHS, or DHA renewal application. From $6/month.</p>
      </div>
      <a href="${APP_URL}/pricing" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Upgrade to Pro â€” from $6/month â†’</a>
      `}

      <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">Every verified activity brings you closer to renewal. Keep going.</p>
    `),
  );
}

export async function sendAdminUnverifiedLinkRequestEmail({
  professionalName,
  unverifiedEmployerName,
  profession,
}: {
  professionalName: string;
  unverifiedEmployerName: string;
  profession: string | null;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await send(
    adminEmail,
    `[Action needed] Unverified employer link request â€” ${esc(unverifiedEmployerName)}`,
    baseLayout(`
      <p style="color:#374151;font-size:16px;margin:0 0 8px">Unverified employer link request</p>
      <p style="color:#374151;margin:0 0 24px;font-size:14px">
        A professional submitted a link request to an employer not yet in the system.
        Please create the organisation and approve or reject the request.
      </p>

      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:20px 24px;margin:0 0 24px">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#d97706;text-transform:uppercase;letter-spacing:0.05em">Request Details</p>
        <p style="margin:6px 0 4px;font-size:16px;font-weight:700;color:#111">Professional: ${esc(professionalName)}</p>
        ${profession ? `<p style="margin:0 0 4px;color:#64748b;font-size:14px">Profession: ${esc(profession)}</p>` : ""}
        <p style="margin:0;color:#374151;font-size:14px">Requested employer: <strong>${esc(unverifiedEmployerName)}</strong></p>
      </div>

      <a href="${APP_URL}/admin/link-requests"
         style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
        Review in Admin Panel â†’
      </a>
    `)
  );
}

export async function sendEmployerLinkRequestNotificationEmail({
  to,
  adminName,
  professionalName,
  profession,
  orgName,
  portalUrl = `${APP_URL}/employer`,
  portalLabel = "Review in employer dashboard",
}: {
  to: string;
  adminName: string;
  professionalName: string;
  profession: string | null;
  orgName: string;
  portalUrl?: string;
  portalLabel?: string;
}) {
  await send(
    to,
    `New link request â€” ${esc(professionalName)} wants to join ${esc(orgName)}`,
    baseLayout(`
      <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(adminName)},</p>
      <p style="color:#374151;margin:0 0 24px">A healthcare professional has requested to link their compliance profile to <strong>${esc(orgName)}</strong>.</p>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px 24px;margin:0 0 24px">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#1a56a0;text-transform:uppercase;letter-spacing:0.05em">Request Details</p>
        <p style="margin:6px 0 2px;font-size:16px;font-weight:700;color:#111">${esc(professionalName)}</p>
        ${profession ? `<p style="margin:0;color:#64748b;font-size:14px">${esc(profession)}</p>` : ""}
      </div>

      <p style="color:#374151;margin:0 0 24px;font-size:14px">Once approved, you will be able to view their CME compliance summary in your dashboard (subject to their privacy settings).</p>

      <a href="${esc(portalUrl)}"
         style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
        ${esc(portalLabel)} â†’
      </a>

      <p style="color:#94a3b8;font-size:11px;margin:20px 0 0">
        To manage email notifications, visit your
        <a href="${APP_URL}/dashboard/settings" style="color:#1a56a0">account settings</a>.
      </p>
    `)
  );
}

export async function sendUniversityRegistrationAdminEmail({
  universityName,
  adminName,
  city,
  country,
  facultyCount,
  contactName,
  contactRole,
}: {
  universityName: string;
  adminName: string;
  city: string;
  country: string;
  facultyCount?: string;
  contactName?: string;
  contactRole?: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await send(
    adminEmail,
    `[New university] ${esc(universityName)} registered on Hayya Med Pro`,
    baseLayout(`
      <p style="color:#374151;font-size:16px;margin:0 0 8px">New university registration</p>
      <p style="color:#374151;margin:0 0 24px;font-size:14px">
        A new institution has registered on Hayya Med Pro. Please verify their details and activate their account.
      </p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin:0 0 24px">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#16a34a;text-transform:uppercase;letter-spacing:0.05em">Institution Details</p>
        <p style="margin:6px 0 4px;font-size:18px;font-weight:700;color:#111">${esc(universityName)}</p>
        <p style="margin:0 0 4px;color:#374151;font-size:14px">ðŸ“ ${esc(city)}, ${esc(country)}</p>
        ${facultyCount ? `<p style="margin:0 0 4px;color:#374151;font-size:14px">Faculty size: ${esc(facultyCount)}</p>` : ""}
        ${contactName ? `<p style="margin:0 0 4px;color:#374151;font-size:14px">Contact: ${esc(contactName)}${contactRole ? ` (${esc(contactRole)})` : ""}</p>` : ""}
        <p style="margin:0 0 4px;color:#374151;font-size:14px">Registered by: ${esc(adminName)}</p>
      </div>

      <p style="color:#374151;margin:0 0 16px;font-size:14px">
        <strong>Action required:</strong> Verify the institution in the Admin â†’ Organizations panel to activate their university dashboard.
      </p>

      <a href="${APP_URL}/admin/organizations"
         style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
        Verify in Admin Panel â†’
      </a>
    `)
  );
}

export async function sendUniversityWelcomeEmail({
  to,
  adminName,
  universityName,
}: {
  to: string;
  adminName: string;
  universityName: string;
}) {
  await send(
    to,
    `Welcome to Hayya Med Pro â€” ${esc(universityName)} is registered`,
    baseLayout(`
      <p style="color:#374151;font-size:16px;margin:0 0 8px">Hi ${esc(adminName)},</p>
      <p style="color:#374151;margin:0 0 24px">
        <strong>${esc(universityName)}</strong> has been registered on Hayya Med Pro.
        Your university dashboard is active and ready to use.
      </p>

      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px 24px;margin:0 0 24px">
        <p style="margin:0 0 12px;font-size:15px;font-weight:600;color:#111">Getting started</p>
        <p style="margin:0 0 8px;color:#374151;font-size:14px">1. <strong>Copy your faculty invite link</strong> from the dashboard and share it with your faculty.</p>
        <p style="margin:0 0 8px;color:#374151;font-size:14px">2. <strong>Approve faculty requests</strong> as they link their accounts to your institution.</p>
        <p style="margin:0;color:#374151;font-size:14px">3. <strong>Track compliance</strong> in real time â€” CME credits, license expiry, and overall institutional compliance rate.</p>
      </div>

      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px 24px;margin:0 0 24px">
        <p style="margin:0;color:#92400e;font-size:13px;">
          â³ <strong>Verification pending:</strong> Our team will verify your institution details within 1 business day.
          You can add faculty and configure settings in the meantime.
        </p>
      </div>

      <a href="${APP_URL}/university"
         style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
        Go to your dashboard â†’
      </a>
    `)
  );
}

export async function sendAdminProviderPendingEmail({
  providerName, contactEmail, country, isAccredited, accreditor,
}: {
  providerName: string;
  contactEmail: string | null;
  country: string;
  isAccredited: boolean;
  accreditor: string | null;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  await send(
    adminEmail,
    `[Action needed] New training provider application â€” ${esc(providerName)}`,
    baseLayout(`
      <p style="font-size:16px;color:#374151;margin:0 0 8px">New training provider application</p>
      <p style="color:#374151;font-size:14px;margin:0 0 24px">A new training provider has applied and is awaiting your review.</p>
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px 24px;margin:0 0 24px">
        <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#1a56a0;text-transform:uppercase;letter-spacing:0.05em">Provider Details</p>
        <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#111">${esc(providerName)}</p>
        <p style="margin:0 0 4px;color:#374151;font-size:14px">Country: <strong>${esc(country)}</strong></p>
        ${contactEmail ? `<p style="margin:0 0 4px;color:#374151;font-size:14px">Contact: <strong>${esc(contactEmail)}</strong></p>` : ""}
        <p style="margin:0;color:#374151;font-size:14px">Accredited: <strong>${isAccredited ? `Yes â€” ${esc(accreditor ?? "unknown")}` : "No"}</strong></p>
      </div>
      <a href="${APP_URL}/admin/training-providers" style="display:inline-block;background:#1a56a0;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Review in Admin Panel â†’</a>
    `)
  );
}

export async function sendTrainingProviderApprovedEmail({
  to, name, providerName,
}: {
  to: string;
  name: string;
  providerName: string;
}) {
  await send(
    to,
    `${providerName} is now live on Hayya Med Pro`,
    baseLayout(`
      <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 8px">Your provider account is approved âœ“</p>
      <p style="color:#374151;margin:0 0 20px">Hi ${esc(name)}, <strong>${esc(providerName)}</strong> has been approved and is now live on the Hayya Med Pro marketplace.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:20px">
        <p style="margin:0 0 8px;font-weight:600;color:#15803d;font-size:14px">You can now:</p>
        <ul style="margin:0;padding-left:18px;color:#374151;font-size:14px;line-height:2">
          <li>Add your accredited CME courses to the marketplace</li>
          <li>Set pricing and session schedules</li>
          <li>Track enrollments from GCC healthcare professionals</li>
        </ul>
      </div>
      <a href="${APP_URL}/provider" style="display:inline-block;background:#1a56a0;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Go to provider portal â†’</a>
    `)
  );
}

export async function sendDemoRequestConfirmationEmail({
  to, name, orgName,
}: {
  to: string;
  name: string;
  orgName: string;
}) {
  await send(
    to,
    `We received your Hayya Med Pro demo request`,
    baseLayout(`
      <p style="font-size:20px;font-weight:700;color:#111;margin:0 0 6px">We've got your request, ${esc(name)}.</p>
      <p style="color:#374151;margin:0 0 20px">
        Thank you for your interest in Hayya Med Pro for <strong>${esc(orgName)}</strong>. We'll be in touch within <strong>1 business day</strong>.
      </p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin:0 0 24px">
        <p style="margin:0 0 10px;font-weight:600;color:#15803d;font-size:14px">What happens next</p>
        <ol style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:2">
          <li>Our team will review your request and reply directly to this email</li>
          <li>We'll schedule a 30-minute walkthrough tailored to your team's size and location</li>
          <li>You can start with a free account immediately â€” no payment needed to explore</li>
        </ol>
      </div>

      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin:0 0 24px">
        <p style="margin:0 0 10px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:#64748b;font-weight:600">Want to start right now?</p>
        <p style="margin:0 0 14px;color:#374151;font-size:14px">
          Create a free account while you wait â€” you'll have full access to the employer dashboard during your Pro trial (up to 30 days for referrals).
        </p>
        <a href="${APP_URL}/register"
           style="display:inline-block;background:#1a56a0;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">
          Create your free account â†’
        </a>
      </div>

      <p style="color:#64748b;font-size:13px;margin:0">
        Questions? Reply directly to this email â€” it goes straight to our team.
      </p>
    `)
  );
}
