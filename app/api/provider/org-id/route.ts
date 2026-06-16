import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";

export const runtime = "nodejs";

export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return new Response("Unauthorized", { status: 401 });

  const admin = createAdminClient();
  const { data: provider } = await admin
    .from("training_providers")
    .select("id, name")
    .eq("created_by", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!provider) return Response.json({ error: "No active provider account" }, { status: 403 });

  return Response.json({ organizationId: provider.id, name: provider.name });
}
