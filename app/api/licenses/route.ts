import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getUserPlan, isPro } from "@/lib/subscription";
import { FREE_LICENSE_LIMIT } from "@/lib/planLimits";
import { z } from "zod";

const LicenseSchema = z.object({
  license_number:      z.string().min(1).max(100),
  licensing_authority: z.string().min(1).max(100),
  country_code:        z.string().length(2),
  profession:          z.string().max(100).optional(),
  specialty:           z.string().max(100).optional(),
  issue_date:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  expiry_date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notes:               z.string().max(500).optional().nullable(),
  is_primary:          z.boolean().optional(),
});

export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("professional_licenses")
    .select("*")
    .eq("professional_id", user.id)
    .order("is_primary", { ascending: false })
    .order("expiry_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ licenses: data ?? [] });
}

export async function POST(req: Request) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = LicenseSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 });

  const admin = createAdminClient();

  // Enforce Free tier license cap server-side
  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    const { count } = await admin
      .from("professional_licenses")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", user.id);
    if ((count ?? 0) >= FREE_LICENSE_LIMIT) {
      return NextResponse.json({ error: "FREE_LIMIT_REACHED" }, { status: 403 });
    }
  }

  // If this is primary, unset existing primaries first
  if (parsed.data.is_primary) {
    await admin
      .from("professional_licenses")
      .update({ is_primary: false })
      .eq("professional_id", user.id);
  }

  const { data, error } = await admin
    .from("professional_licenses")
    .insert({ ...parsed.data, professional_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ license: data }, { status: 201 });
}
