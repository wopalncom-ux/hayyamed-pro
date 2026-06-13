import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  // Validate: alphanumeric only, 4-32 chars — prevents injection and enumeration abuse
  if (!code || !/^[a-zA-Z0-9_-]{4,32}$/.test(code)) {
    return NextResponse.json({ firstName: null }, { status: 200 });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("professional_profiles")
    .select("full_name")
    .eq("referral_code", code)
    .maybeSingle();

  if (!data?.full_name) {
    return NextResponse.json({ firstName: null }, { status: 200 });
  }

  // Return only first name — referral code was shared intentionally, but we minimize exposure
  const firstName = data.full_name.trim().split(/\s+/)[0] ?? null;

  return NextResponse.json({ firstName }, { status: 200 });
}
