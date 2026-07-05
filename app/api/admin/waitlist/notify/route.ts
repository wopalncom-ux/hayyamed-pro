import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendWaitlistLaunchEmail } from "@/lib/email";

// POST /api/admin/waitlist/notify
// Sends launch notification to all unnotified waitlist signups.
// Marks each as notified after successful send.
// Admin-only. Max 500 per call to avoid Postmark rate limits.

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .maybeSingle();
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Fetch unnotified signups (up to 500)
  const { data: signups, error } = await admin
    .from("waitlist_signups")
    .select("id, email")
    .eq("notified", false)
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!signups?.length) return NextResponse.json({ sent: 0, message: "No unnotified signups." });

  let sent = 0;
  let failed = 0;

  for (const signup of signups) {
    try {
      await sendWaitlistLaunchEmail({ to: signup.email });
      await admin.from("waitlist_signups").update({ notified: true }).eq("id", signup.id);
      sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({
    sent,
    failed,
    message: `Sent ${sent} launch emails. ${failed > 0 ? `${failed} failed — re-run to retry.` : ""}`,
  });
}
