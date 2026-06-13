import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Postmark sends a configurable header — set POSTMARK_WEBHOOK_TOKEN in your account
// Webhook → Outbound → Bounces & Spam Complaints. Set X-Webhook-Token header.
const WEBHOOK_TOKEN = process.env.POSTMARK_WEBHOOK_TOKEN;

interface PostmarkBouncePayload {
  RecordType: "Bounce" | "SpamComplaint" | "SubscriptionChange";
  Type?: string;       // e.g. "HardBounce", "SoftBounce", "SpamNotification"
  Email?: string;
  Recipient?: string;  // SpamComplaint uses Recipient
  BouncedAt?: string;
}

export async function POST(request: NextRequest) {
  // Authenticate webhook — Postmark sends a custom header
  if (WEBHOOK_TOKEN) {
    const token = request.headers.get("x-webhook-token");
    if (token !== WEBHOOK_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let payload: PostmarkBouncePayload;
  try {
    payload = (await request.json()) as PostmarkBouncePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { RecordType, Type, Email, Recipient } = payload;
  const email = (Email ?? Recipient ?? "").toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ ok: true, action: "no_email" });
  }

  const admin = createAdminClient();

  if (RecordType === "Bounce" && Type === "HardBounce") {
    await admin
      .from("professional_profiles")
      .update({ email_hard_bounced: true, updated_at: new Date().toISOString() })
      .eq("email", email);

    await admin.from("audit_logs").insert({
      actor_id: null,
      action: "email_hard_bounce",
      target_type: "professional_profile",
      target_id: null,
      metadata: { email, bounce_type: Type, record_type: RecordType },
    });

    return NextResponse.json({ ok: true, action: "marked_hard_bounced", email });
  }

  if (RecordType === "SpamComplaint") {
    await admin
      .from("professional_profiles")
      .update({ email_spam_reported: true, updated_at: new Date().toISOString() })
      .eq("email", email);

    await admin.from("audit_logs").insert({
      actor_id: null,
      action: "email_spam_complaint",
      target_type: "professional_profile",
      target_id: null,
      metadata: { email, record_type: RecordType },
    });

    return NextResponse.json({ ok: true, action: "marked_spam_reported", email });
  }

  // SoftBounce, SubscriptionChange, etc. — log but take no action
  return NextResponse.json({ ok: true, action: "ignored", record_type: RecordType });
}
