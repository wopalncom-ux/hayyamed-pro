import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendDripDay1Email,
  sendDripDay3Email,
  sendDripDay7Email,
  sendDripDay10Email,
} from "@/lib/email";
import { unsubUrl } from "@/lib/emailToken";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

// Runs daily — sends onboarding drip emails at D+1, D+3, D+7, D+10 post-signup.
// Uses created_at as a proxy for onboarding completion date (accurate within ~24h for most users).
// UNIQUE (user_id, sequence_day) in drip_email_log prevents double-sends.

const SEQUENCE = [
  { day: 1,  fn: "day1"  },
  { day: 3,  fn: "day3"  },
  { day: 7,  fn: "day7"  },
  { day: 10, fn: "day10" },
] as const;

function dayWindow(now: Date, daysBack: number): { start: string; end: string } {
  const d = new Date(now);
  d.setDate(d.getDate() - daysBack);
  const base = d.toISOString().slice(0, 10);
  return { start: `${base}T00:00:00.000Z`, end: `${base}T23:59:59.999Z` };
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const results: Record<string, number> = { day1: 0, day3: 0, day7: 0, day10: 0 };

  for (const { day, fn } of SEQUENCE) {
    const { start, end } = dayWindow(now, day);

    // Professionals who completed onboarding in the target window
    const { data: candidates } = await admin
      .from("professional_profiles")
      .select("auth_id, full_name, email, licensing_authority, email_hard_bounced, email_spam_reported")
      .eq("onboarding_complete", true)
      .gte("created_at", start)
      .lte("created_at", end);

    if (!candidates?.length) continue;

    // Which of these have already received this drip email?
    const userIds = candidates.map((p) => p.auth_id);
    const { data: alreadySent } = await admin
      .from("drip_email_log")
      .select("user_id")
      .in("user_id", userIds)
      .eq("sequence_day", day);

    const sentSet = new Set((alreadySent ?? []).map((r) => r.user_id));

    for (const profile of candidates) {
      if (sentSet.has(profile.auth_id)) continue;
      if (!profile.email) continue;
      if (profile.email_hard_bounced || profile.email_spam_reported) continue;

      const unsub = unsubUrl(profile.auth_id, "reminders");

      try {
        if (fn === "day1") {
          await sendDripDay1Email({ to: profile.email, name: profile.full_name ?? "Healthcare Professional", unsubscribeUrl: unsub });
        } else if (fn === "day3") {
          await sendDripDay3Email({ to: profile.email, name: profile.full_name ?? "Healthcare Professional", unsubscribeUrl: unsub });
        } else if (fn === "day7") {
          await sendDripDay7Email({ to: profile.email, name: profile.full_name ?? "Healthcare Professional", authority: profile.licensing_authority, unsubscribeUrl: unsub });
        } else if (fn === "day10") {
          await sendDripDay10Email({ to: profile.email, name: profile.full_name ?? "Healthcare Professional", unsubscribeUrl: unsub });
        }

        // Log the send — ON CONFLICT DO NOTHING prevents double-sends in race conditions
        await admin
          .from("drip_email_log")
          .upsert({ user_id: profile.auth_id, sequence_day: day }, { onConflict: "user_id,sequence_day", ignoreDuplicates: true });

        results[fn]++;
      } catch (err) {
        console.error(`[drip] Failed to send day ${day} to ${profile.auth_id}:`, err);
      }
    }
  }

  await pingCronMonitor("onboarding-drip", { sent: Object.values(results).reduce((a, b) => a + b, 0) });
  return NextResponse.json({ ok: true, sent: results });
}
