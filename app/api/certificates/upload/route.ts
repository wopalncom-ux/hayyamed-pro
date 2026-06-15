import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getUserPlan, isPro } from "@/lib/subscription";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

// POST /api/certificates/upload
// Uploads a certificate file to Supabase Storage and records it in
// certificate_storage_records for audit trail (SOC 2 / storage cost control).
// Returns the storage path — caller links it to a cme_activity via PATCH.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Only Pro users may store certificates
  const plan = await getUserPlan(user.id);
  if (!isPro(plan)) {
    return NextResponse.json({ error: "Certificate storage requires a Pro plan" }, { status: 403 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = formData.get("file") as File | null;
  const cmeActivityId = formData.get("cme_activity_id") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Allowed: JPEG, PNG, WebP, PDF" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 413 });
  }

  // Sanitize filename — no path traversal
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
  const timestamp = Date.now();
  const storagePath = `${user.id}/${timestamp}_${safeName}`;

  const buffer = await file.arrayBuffer();

  const admin = createAdminClient();

  // Upload to private certificates bucket
  const { error: uploadError } = await admin.storage
    .from("certificates")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Certificate upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  // Record the upload in the audit trail
  const { error: recordError } = await admin
    .from("certificate_storage_records")
    .insert({
      professional_id: user.id,
      cme_activity_id: cmeActivityId ?? null,
      storage_path: storagePath,
      file_name: safeName,
      file_size_bytes: file.size,
      mime_type: file.type,
    });

  if (recordError) {
    // Non-fatal — storage succeeded; log and continue
    console.error("Certificate storage record error:", recordError);
  }

  return NextResponse.json({ path: storagePath, ok: true });
}

// PATCH /api/certificates/upload
// Links an uploaded certificate (storage_path) to a CME activity after it is created.
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { storage_path, cme_activity_id } = await req.json().catch(() => ({}));
  if (!storage_path || !cme_activity_id) {
    return NextResponse.json({ error: "storage_path and cme_activity_id required" }, { status: 400 });
  }

  // Path traversal guard
  if (
    !storage_path.startsWith(`${user.id}/`) ||
    storage_path.includes("..") ||
    storage_path.includes("\0")
  ) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify the CME activity belongs to this user before linking
  const { data: activity } = await admin
    .from("cme_activities")
    .select("id")
    .eq("id", cme_activity_id)
    .eq("professional_id", user.id)
    .maybeSingle();

  if (!activity) return NextResponse.json({ error: "Activity not found" }, { status: 404 });

  await admin
    .from("certificate_storage_records")
    .update({ cme_activity_id })
    .eq("storage_path", storage_path)
    .eq("professional_id", user.id)
    .is("cme_activity_id", null);

  return NextResponse.json({ ok: true });
}
