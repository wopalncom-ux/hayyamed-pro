import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const Schema = z.object({
  code: z.string().min(1).max(50),
  plan: z.enum(["pro", "employer"]),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const { code, plan } = parsed.data;
  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data: discount } = await admin
    .from("discounts")
    .select("id, name, discount_type, discount_value, applicable_plans, max_uses, current_uses")
    .eq("promo_code", code.toUpperCase().trim())
    .eq("is_active", true)
    .lte("valid_from", now)
    .or(`valid_until.is.null,valid_until.gte.${now}`)
    .maybeSingle();

  if (!discount) {
    return NextResponse.json({ valid: false, error: "Invalid or expired promo code" });
  }
  if (!discount.applicable_plans.includes(plan)) {
    return NextResponse.json({ valid: false, error: `This code is not valid for the ${plan} plan` });
  }
  if (discount.max_uses !== null && discount.current_uses >= discount.max_uses) {
    return NextResponse.json({ valid: false, error: "This promo code has reached its usage limit" });
  }

  return NextResponse.json({
    valid: true,
    discount: {
      id: discount.id,
      name: discount.name,
      type: discount.discount_type,
      value: discount.discount_value,
    },
  });
}
