import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { checkAndLogRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

// GET /api/export/my-data
// PDPL (Qatar Law No. 13/2016) Article 12 + GDPR Article 15/20 — Right to access
// and portability of personal data. Returns all personal data held for the
// authenticated professional as a structured JSON file.
export async function GET(request: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Prevent abuse: data export is expensive (11 table joins) and sensitive.
  // Limit to 3 requests per hour per user.
  const rl = await checkAndLogRateLimit({ action: "export.my_data", userId: user.id, maxPerHour: 3 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many export requests. Please wait before requesting your data again." },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSeconds ?? 3600) },
      }
    );
  }

  const admin = createAdminClient();

  const [
    profileRes,
    walletsRes,
    activitiesRes,
    reflectionsRes,
    licensesRes,
    achievementsRes,
    enrollmentsRes,
    pushSubsRes,
    privacyRes,
    referralsRes,
    npsRes,
  ] = await Promise.all([
    admin
      .from("professional_profiles")
      .select(
        "full_name, email, date_of_birth, nationality, country_of_residence, mobile, profession, specialty, subspecialty, license_number, licensing_authority, license_expiry, onboarding_step, onboarding_complete, profile_completion_pct, referral_code, pro_trial_ends_at, email_cme_verified, email_cme_deadline, email_license_expiry, email_trial_reminders, email_employer_tasks, created_at, updated_at"
      )
      .eq("auth_id", user.id)
      .single(),
    admin
      .from("cme_wallets")
      .select("country, profession, specialty, required_credits, completed_credits, renewal_cycle_years, cycle_start_date, cycle_end_date, compliance_status, created_at")
      .eq("professional_id", user.id),
    admin
      .from("cme_activities")
      .select("title, provider, activity_date, credits, category, verification_status, certificate_url, employer_visible, created_at")
      .eq("professional_id", user.id)
      .order("activity_date", { ascending: false }),
    admin
      .from("cpd_reflections")
      .select("reflection_date, reflection_type, what_learned, how_applied, impact_on_practice, further_learning, created_at")
      .eq("professional_id", user.id)
      .order("reflection_date", { ascending: false }),
    admin
      .from("professional_licenses")
      .select("license_number, licensing_authority, country_code, profession, specialty, issue_date, expiry_date, is_primary, notes, created_at")
      .eq("professional_id", user.id),
    admin
      .from("professional_achievements")
      .select("badge_key, awarded_at")
      .eq("professional_id", user.id),
    admin
      .from("course_enrollments")
      .select("enrolled_at, completed_at, credits_issued, status, course_id")
      .eq("professional_id", user.id),
    admin
      .from("push_subscriptions")
      .select("endpoint, created_at")
      .eq("professional_id", user.id),
    admin
      .from("profile_privacy_settings")
      .select("employer_can_view_cme_summary, employer_can_view_certificates, employer_can_view_license_expiry, employer_can_view_detailed_cme_activities, employer_can_view_profile_details, updated_at")
      .eq("professional_id", user.id)
      .maybeSingle(),
    admin
      .from("referrals")
      .select("referral_code, status, created_at, converted_at")
      .eq("referrer_auth_id", user.id),
    admin
      .from("nps_responses")
      .select("score, comment, created_at")
      .eq("professional_id", user.id),
  ]);

  const dataPackage = {
    export_info: {
      generated_at: new Date().toISOString(),
      data_controller: "Hayya Med Pro — hayyamed.pro",
      legal_basis: "Qatar PDPL Law No. 13/2016 Article 12 — Right to Access",
      subject_auth_id: user.id,
      subject_email: user.email,
    },
    profile: profileRes.data ?? null,
    compliance_wallets: walletsRes.data ?? [],
    cme_activities: activitiesRes.data ?? [],
    cpd_reflections: reflectionsRes.data ?? [],
    licenses: licensesRes.data ?? [],
    achievements: achievementsRes.data ?? [],
    course_enrollments: enrollmentsRes.data ?? [],
    push_subscriptions: (pushSubsRes.data ?? []).map((s) => ({
      endpoint_prefix: s.endpoint.slice(0, 60) + "…",
      registered_at: s.created_at,
    })),
    privacy_settings: privacyRes.data ?? null,
    referrals_made: referralsRes.data ?? [],
    nps_responses: npsRes.data ?? [],
  };

  await logAudit({
    actorAuthId: user.id,
    action: "export.personal_data",
    targetTable: "professional_profiles",
    targetId: user.id as unknown as string,
    metadata: { legal_basis: "PDPL Article 12" },
  });

  const fileName = `hayyamed-pro-data-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(dataPackage, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
