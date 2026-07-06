import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import QRCode from "qrcode";

export async function GET(request: Request) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const { data: member } = await admin
    .from("organization_members")
    .select("organization_id, role")
    .eq("auth_id", user.id)
    .eq("role", "employer_admin")
    .limit(1)
    .maybeSingle();

  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { origin } = new URL(request.url);
  const inviteUrl = `${origin}/invite/${member.organization_id}`;

  const svgString = await QRCode.toString(inviteUrl, {
    type: "svg",
    width: 300,
    margin: 2,
    color: { dark: "#0f1f3d", light: "#ffffff" },
  });

  return new NextResponse(svgString, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
