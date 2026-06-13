import { createClient, createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .maybeSingle();

  if (!member) return Response.json({ error: "Not an employer admin" }, { status: 403 });

  const orgName =
    (member.organizations as unknown as { name: string } | null)?.name ?? "Organization";

  return Response.json({ organizationId: member.organization_id, name: orgName });
}
