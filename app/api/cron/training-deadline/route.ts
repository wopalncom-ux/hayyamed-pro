import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendTaskDeadlineReminderEmail } from "@/lib/email";
import { pingCronMonitor } from "@/lib/cronMonitor";
import { logAudit } from "@/lib/audit";
import { sendPushNotification } from "@/lib/push";

export const runtime = "nodejs";

/**
 * GET /api/cron/training-deadline
 *
 * Runs daily. Finds employer_tasks due within 7 days that are still pending
 * and haven't had a reminder sent in the last 23 hours. Emails the assigned
 * staff member if they have email_employer_tasks enabled.
 *
 * Triggered by Cloud Scheduler — add to GCP with:
 *   gcloud scheduler jobs create http training-deadline \
 *     --schedule="0 9 * * *" \
 *     --uri="https://hayyamed.pro/api/cron/training-deadline" \
 *     --headers="Authorization=Bearer CRON_SECRET" \
 *     --location=us-central1
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const sevenDaysStr = new Date(now.getTime() + 7 * 86_400_000).toISOString().slice(0, 10);
  const windowStart = new Date(now.getTime() - 23 * 3_600_000).toISOString();

  // Fetch pending tasks due within 7 days
  const { data: tasks, error: tasksErr } = await admin
    .from("employer_tasks")
    .select("id, organization_id, assigned_to, title, message, category, credits_target, due_date")
    .eq("status", "pending")
    .gte("due_date", todayStr)
    .lte("due_date", sevenDaysStr);

  if (tasksErr || !tasks?.length) {
    await pingCronMonitor("training-deadline");
    return NextResponse.json({ checked: 0, reminders_sent: 0 });
  }

  // Find which tasks already had a reminder sent in the last 23 hours
  const taskIds = tasks.map((t) => t.id);
  const { data: recentLogs } = await admin
    .from("audit_logs")
    .select("target_id")
    .eq("action", "task.deadline_reminder")
    .in("target_id", taskIds)
    .gte("created_at", windowStart);

  const alreadyNotified = new Set((recentLogs ?? []).map((l) => l.target_id));

  // Get unique assignees
  const assigneeIds = [...new Set(tasks.map((t) => t.assigned_to))];

  const [profilesRes, orgsRes, pushSubsRes] = await Promise.all([
    admin
      .from("professional_profiles")
      .select("auth_id, full_name, email, email_employer_tasks, push_employer_tasks")
      .in("auth_id", assigneeIds),
    admin
      .from("organizations")
      .select("id, name"),
    admin
      .from("push_subscriptions")
      .select("professional_id, endpoint, p256dh, auth")
      .in("professional_id", assigneeIds),
  ]);

  const profileMap = Object.fromEntries(
    (profilesRes.data ?? []).map((p) => [p.auth_id, p])
  );
  const orgMap = Object.fromEntries(
    (orgsRes.data ?? []).map((o) => [o.id, o.name as string])
  );
  const pushMap = new Map<string, { endpoint: string; p256dh: string; auth: string }[]>();
  for (const ps of pushSubsRes.data ?? []) {
    if (!pushMap.has(ps.professional_id)) pushMap.set(ps.professional_id, []);
    pushMap.get(ps.professional_id)!.push(ps);
  }

  let remindersSent = 0;

  for (const task of tasks) {
    if (alreadyNotified.has(task.id)) continue;

    const profile = profileMap[task.assigned_to];
    if (!profile?.email) continue;

    // Respect email preferences (column on professional_profiles, default true)
    if (profile.email_employer_tasks === false) continue;

    const dueDate = task.due_date as string;
    const daysLeft = Math.ceil(
      (new Date(dueDate).getTime() - now.setHours(0, 0, 0, 0)) / 86_400_000
    );

    try {
      await sendTaskDeadlineReminderEmail({
        to: profile.email,
        staffName: profile.full_name ?? "Healthcare Professional",
        orgName: orgMap[task.organization_id] ?? "Your employer",
        taskTitle: task.title,
        dueDate,
        daysLeft,
        category: task.category ?? null,
        creditsTarget: task.credits_target ?? null,
        message: task.message ?? null,
      });

      remindersSent++;

      logAudit({
        actorAuthId: "system",
        action: "task.deadline_reminder",
        targetTable: "employer_tasks",
        targetId: task.id,
        metadata: { assigned_to: task.assigned_to, days_left: daysLeft },
      }).catch(() => {});
    } catch {
      // Email failure is non-fatal — continue processing other tasks
    }

    // Push notification — respect push_employer_tasks preference
    if (profile.push_employer_tasks !== false) {
      const pushSubs = pushMap.get(task.assigned_to) ?? [];
      for (const pushSub of pushSubs) {
        ;(async () => {
          try {
            const { expired } = await sendPushNotification(pushSub, {
              title: `Task due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
              body: `"${task.title}" from ${orgMap[task.organization_id] ?? "your employer"} is due on ${task.due_date}.`,
              url: "/dashboard/tasks",
            });
            if (expired) {
              await admin.from("push_subscriptions").delete()
                .eq("professional_id", task.assigned_to)
                .eq("endpoint", pushSub.endpoint);
            }
          } catch {}
        })();
      }
    }
  }

  await pingCronMonitor("training-deadline");
  return NextResponse.json({ checked: tasks.length, reminders_sent: remindersSent });
}
