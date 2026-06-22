import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import WebhooksClient from "./WebhooksClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Webhooks" };

export default async function EmployerWebhooksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) redirect("/employer/register");

  // Fetch endpoints with delivery stats
  const { data: endpoints } = await admin
    .from("webhook_endpoints")
    .select("id, url, events, description, is_active, created_at")
    .eq("organization_id", member.organization_id)
    .order("created_at", { ascending: false });

  const ids = (endpoints ?? []).map((e) => e.id);
  const { data: deliveries } = ids.length
    ? await admin
        .from("webhook_deliveries")
        .select("endpoint_id, status")
        .in("endpoint_id", ids)
        .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString())
    : { data: [] };

  const deliveryMap: Record<string, { delivered: number; failed: number; pending: number }> = {};
  for (const d of deliveries ?? []) {
    deliveryMap[d.endpoint_id] = deliveryMap[d.endpoint_id] ?? { delivered: 0, failed: 0, pending: 0 };
    const s = d.status as "delivered" | "failed" | "pending";
    if (s in deliveryMap[d.endpoint_id]) deliveryMap[d.endpoint_id][s]++;
  }

  const enriched = (endpoints ?? []).map((ep) => ({
    ...ep,
    deliveries_7d: deliveryMap[ep.id] ?? { delivered: 0, failed: 0, pending: 0 },
  }));

  return <WebhooksClient initialEndpoints={enriched} />;
}
