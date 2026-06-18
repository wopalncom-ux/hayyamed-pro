"use server";

import { sendAdminNotification } from "@/lib/email";
import { z } from "zod";

const FeedbackSchema = z.object({
  role: z.string().min(1).max(50),
  area: z.string().min(1).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().min(10).max(2000),
  email: z.string().email().optional().or(z.literal("")),
});

export async function submitBetaFeedback(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const raw = {
    role: formData.get("role"),
    area: formData.get("area"),
    rating: formData.get("rating"),
    message: formData.get("message"),
    email: formData.get("email") ?? "",
  };

  const parsed = FeedbackSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  const { role, area, rating, message, email } = parsed.data;
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1a56a0;margin-bottom:4px">Beta Feedback Received</h2>
      <p style="color:#64748b;font-size:13px;margin-top:0">${new Date().toISOString().slice(0, 19).replace("T", " ")} UTC</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
        <tr><td style="padding:8px 12px;background:#f0f4f8;font-weight:600;width:120px">Role</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${role}</td></tr>
        <tr><td style="padding:8px 12px;background:#f0f4f8;font-weight:600">Area tested</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${area}</td></tr>
        <tr><td style="padding:8px 12px;background:#f0f4f8;font-weight:600">Rating</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:16px;color:#d97706">${stars} (${rating}/5)</td></tr>
        <tr><td style="padding:8px 12px;background:#f0f4f8;font-weight:600">Contact</td><td style="padding:8px 12px">${email || "—"}</td></tr>
      </table>
      <div style="background:#f8fafc;border-left:4px solid #1a56a0;padding:12px 16px;border-radius:0 8px 8px 0">
        <p style="margin:0;font-size:14px;color:#374151;white-space:pre-wrap">${message}</p>
      </div>
    </div>
  `;

  await sendAdminNotification({
    to: "support@hayyamed.pro",
    subject: `[Beta Feedback] ${stars} — ${role} / ${area}`,
    html,
    replyTo: email || undefined,
  });

  return { ok: true };
}
