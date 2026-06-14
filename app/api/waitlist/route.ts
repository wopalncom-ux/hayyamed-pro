import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  email:      z.string().email().max(254),
  profession: z.string().max(100).optional(),
  country:    z.string().max(100).optional(),
});

export async function POST(req: NextRequest) {
  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return new Response("Invalid request", { status: 400 });

  const { email, profession, country } = parsed.data;
  const admin = createAdminClient();

  // Upsert — idempotent if same email submits twice
  const { error } = await admin
    .from("waitlist_signups")
    .upsert(
      { email: email.toLowerCase().trim(), profession: profession ?? null, country: country ?? null },
      { onConflict: "email", ignoreDuplicates: true }
    );

  if (error) {
    console.error("Waitlist insert error:", error.message);
    return Response.json({ error: "Failed to join waitlist" }, { status: 500 });
  }

  // Notify admin — fire-and-forget, never block the response
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (adminEmail && process.env.POSTMARK_API_TOKEN) {
    const { default: postmark } = await import("postmark");
    const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);
    client.sendEmail({
      From: process.env.EMAIL_FROM ?? "Hayya Med Pro <noreply@hayyamed.pro>",
      To: adminEmail,
      Subject: `New waitlist signup: ${email}`,
      HtmlBody: `<p>Email: <strong>${email}</strong></p>${profession ? `<p>Profession: ${profession}</p>` : ""}${country ? `<p>Country: ${country}</p>` : ""}<p>Time: ${new Date().toISOString()}</p>`,
    }).catch(() => {});
  }

  return Response.json({ ok: true });
}
