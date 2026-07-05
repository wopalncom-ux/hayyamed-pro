import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const BUCKET = "media-library";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members")
    .select("role")
    .eq("auth_id", user.id)
    .in("role", ["founder", "master_admin", "super_admin"])
    .maybeSingle();
  return member ? user : null;
}

// POST /api/admin/media/upload-url
// Body: { file_name: string, content_type: string, category?: string }
// Returns: { upload_url, path, public_url }
export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { file_name, content_type, category = "general" } = await req.json();
  if (!file_name || !content_type) {
    return NextResponse.json({ error: "file_name and content_type required" }, { status: 400 });
  }

  // Sanitize filename, add timestamp prefix to avoid collisions
  const safe = file_name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${category}/${Date.now()}_${safe}`;

  const admin = createAdminClient();

  // Ensure bucket exists
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await admin.storage.createBucket(BUCKET, { public: true, fileSizeLimit: 10485760 });
  }

  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;

  return NextResponse.json({
    upload_url: data.signedUrl,
    path,
    public_url: publicUrl,
  });
}
