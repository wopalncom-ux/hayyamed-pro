import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";

export const runtime = "nodejs";

export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return new Response("Unauthorized", { status: 401 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "training_provider_admin")
    .maybeSingle();

  if (!member) return Response.json({ error: "Not a training provider admin" }, { status: 403 });

  const orgName =
    (member.organizations as unknown as { name: string } | null)?.name ?? "Organization";

  return Response.json({ organizationId: member.organization_id, name: orgName });
}
