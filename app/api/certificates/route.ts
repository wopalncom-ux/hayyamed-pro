import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const path = request.nextUrl.searchParams.get("path");

  // Reject empty, null-bytes, traversal attempts
  if (!path || path.includes("..") || path.includes("\0") || path.includes("//")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Either the path belongs to the requesting user, or they are a platform admin
  if (!path.startsWith(`${user.id}/`)) {
    const { data: adminMember } = await admin
      .from("organization_members")
      .select("role")
      .eq("auth_id", user.id)
      .in("role", ["master_admin", "super_admin"])
      .maybeSingle();

    if (!adminMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Signed URL valid for 1 hour — never expose raw storage paths to the client
  const { data, error } = await admin.storage
    .from("certificates")
    .createSignedUrl(path, 3600);

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to generate URL" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
