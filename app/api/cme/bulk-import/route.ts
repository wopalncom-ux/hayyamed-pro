import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { isPro } from "@/lib/planUtils";
import { z } from "zod";

const RowSchema = z.object({
  title:         z.string().min(1).max(300),
  credits:       z.string().regex(/^\d+(\.\d+)?$/).transform(Number).pipe(z.number().min(0.1).max(100)),
  activity_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((d) => !isNaN(new Date(d).getTime())),
  category:      z.string().optional().default("clinical"),
  provider:      z.string().max(200).optional().default(""),
  accreditor:    z.string().max(200).optional().default(""),
});

const BodySchema = z.object({
  rows: z.array(RowSchema).min(1).max(200),
});

export async function POST(req: Request) {
  const user = await getRequestUser(await headers());
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Pro check
  const [subRes, profileRes] = await Promise.all([
    admin.from("subscriptions").select("plan").eq("professional_id", user.id).maybeSingle(),
    admin.from("professional_profiles").select("pro_trial_ends_at").eq("auth_id", user.id).single(),
  ]);

  const plan = subRes.data?.plan ?? "free";
  const trialActive = profileRes.data?.pro_trial_ends_at
    ? new Date(profileRes.data.pro_trial_ends_at) > new Date()
    : false;

  if (!isPro(plan) && !trialActive) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  // Validate body
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body", detail: String(err) }, { status: 400 });
  }

  // Validate dates are not in the future
  const now = new Date();
  for (const row of body.rows) {
    if (new Date(row.activity_date) > now) {
      return NextResponse.json({ error: `activity_date cannot be in the future: ${row.activity_date}` }, { status: 400 });
    }
  }

  // Bulk insert
  const records = body.rows.map((row) => ({
    professional_id:     user.id,
    title:               row.title,
    credits:             row.credits,
    activity_date:       row.activity_date,
    category:            row.category,
    provider:            row.provider || null,
    accreditor:          row.accreditor || null,
    activity_type:       "other",
    verification_status: "pending",
    source:              "bulk_import",
  }));

  const { error: insertError, count } = await admin
    .from("cme_activities")
    .insert(records, { count: "exact" });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  await admin.from("audit_logs").insert({
    actor_auth_id: user.id,
    action: "cme.bulk_import",
    metadata: { count: records.length },
  });

  return NextResponse.json({ count: count ?? records.length });
}
