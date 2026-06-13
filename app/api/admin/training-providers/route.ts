import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { requireAdminUser } from "@/lib/adminAuth";
import { sendTrainingProviderApprovedEmail } from "@/lib/email";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("training_providers")
    .select("*, courses(id)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ providers: data });
}

export async function PATCH(req: NextRequest) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { providerId, action } = await req.json();
  if (!providerId || !action) return NextResponse.json({ error: "providerId + action required" }, { status: 400 });
  if (!["approve", "suspend", "reactivate"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const statusMap: Record<string, string> = {
    approve: "active",
    suspend: "suspended",
    reactivate: "active",
  };

  const admin = createAdminClient();

  const { data: provider, error: fetchErr } = await admin
    .from("training_providers")
    .select("name, created_by")
    .eq("id", providerId)
    .single();

  if (fetchErr || !provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });

  const { error } = await admin
    .from("training_providers")
    .update({ status: statusMap[action] })
    .eq("id", providerId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit({
    actorAuthId: user.id,
    action: `provider.${action}`,
    targetTable: "training_providers",
    targetId: providerId,
    metadata: { newStatus: statusMap[action] },
  });

  // Notify the provider owner when their account is approved
  if (action === "approve" && provider.created_by) {
    Promise.resolve(
      admin.from("professional_profiles")
        .select("email, full_name")
        .eq("auth_id", provider.created_by)
        .maybeSingle()
    ).then(({ data: ownerProfile }) => {
      if (!ownerProfile?.email) return;
      sendTrainingProviderApprovedEmail({
        to: ownerProfile.email,
        name: ownerProfile.full_name ?? "Provider",
        providerName: provider.name,
      }).catch(() => {});
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
