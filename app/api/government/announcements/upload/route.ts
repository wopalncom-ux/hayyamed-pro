import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { getAuthorityForUser } from "@/lib/government/jurisdiction";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

// POST /api/government/announcements/upload
// Uploads an attachment (PDF circular / image) for a jurisdiction announcement.
// government_admin only. Returns a public URL stored on the announcement.
export async function POST(req: NextRequest) {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "government_admin")
    .maybeSingle();
  if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const authority = await getAuthorityForUser(user.id);
  if (!authority) return NextResponse.json({ error: "Authority not found" }, { status: 403 });

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Allowed: PDF, JPEG, PNG, WebP" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 413 });
  }

  // Sanitize filename — no path traversal
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100) || "attachment";
  const storagePath = `${authority.organizationId}/${Date.now()}_${safeName}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("announcement-files")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("Announcement attachment upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: pub } = admin.storage.from("announcement-files").getPublicUrl(storagePath);

  logAudit({
    actorAuthId: user.id,
    action: "government.announcement_attachment_uploaded",
    targetTable: "authority_announcements",
    targetId: authority.organizationId,
    metadata: { file_name: safeName, size: file.size, type: file.type },
  });

  return NextResponse.json({ url: pub.publicUrl, name: safeName, ok: true });
}
