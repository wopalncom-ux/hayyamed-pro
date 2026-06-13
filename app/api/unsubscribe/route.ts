import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyUnsubToken } from "@/lib/emailToken";

export const runtime = "nodejs";

const CATEGORY_COLUMNS: Record<string, string[]> = {
  all:      ["email_cme_verified", "email_cme_deadline", "email_license_expiry", "email_trial_reminders", "email_employer_tasks"],
  cme:      ["email_cme_verified", "email_cme_deadline"],
  license:  ["email_license_expiry"],
  reminders:["email_trial_reminders"],
  digest:   ["email_cme_deadline"],
  tasks:    ["email_employer_tasks"],
};

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const verified = verifyUnsubToken(token);
  if (!verified) {
    return NextResponse.redirect(new URL("/unsubscribe?error=invalid", request.url));
  }

  const columns = CATEGORY_COLUMNS[verified.category];
  if (!columns) {
    return NextResponse.redirect(new URL("/unsubscribe?error=invalid", request.url));
  }

  const admin = createAdminClient();
  const updates = Object.fromEntries(columns.map((col) => [col, false]));
  await admin
    .from("professional_profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("auth_id", verified.authId);

  return NextResponse.redirect(
    new URL(`/unsubscribe?success=1&category=${verified.category}`, request.url)
  );
}
