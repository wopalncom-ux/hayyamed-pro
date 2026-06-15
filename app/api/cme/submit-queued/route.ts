import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getUserPlan, isPro } from "@/lib/subscription";
import { FREE_ACTIVITY_LIMIT } from "@/lib/planLimits";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  walletId: z.string().uuid(),
  title: z.string().min(1).max(300),
  provider: z.string().max(200).nullable(),
  activityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  credits: z.number().min(0.25).max(500),
  category: z.string().max(100).nullable(),
});

export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return new Response("Unauthorized", { status: 401 });

  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return new Response("Invalid request", { status: 400 });

  const { walletId, title, provider, activityDate, credits, category } = parsed.data;

  const admin = createAdminClient();

  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    const { count } = await admin
      .from("cme_activities")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id);

    if ((count ?? 0) >= FREE_ACTIVITY_LIMIT) {
      return Response.json({ error: "FREE_LIMIT_REACHED" }, { status: 422 });
    }
  }

  // Verify wallet belongs to this user
  const { data: walletCheck } = await admin
    .from("cme_wallets")
    .select("id")
    .eq("id", walletId)
    .eq("professional_id", user.id)
    .single();

  if (!walletCheck) return new Response("Invalid wallet", { status: 403 });

  const { error } = await admin.from("cme_activities").insert({
    wallet_id: walletId,
    professional_id: user.id,
    title,
    provider: provider || null,
    activity_date: activityDate,
    credits,
    certificate_url: null,
    category: category || null,
  });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
