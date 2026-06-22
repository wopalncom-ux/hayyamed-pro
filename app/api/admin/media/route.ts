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
    .in("role", ["master_admin", "super_admin"])
    .maybeSingle();
  return member ? user : null;
}

async function ensureBucket(admin: ReturnType<typeof createAdminClient>) {
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await admin.storage.createBucket(BUCKET, { public: true, fileSizeLimit: 10485760 }); // 10MB
  }
}

// GET /api/admin/media?category=team&search=photo
export async function GET(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const category = req.nextUrl.searchParams.get("category");
  const search = req.nextUrl.searchParams.get("search");

  let query = admin
    .from("media_library")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== "all") query = query.eq("category", category);
  if (search) query = query.ilike("file_name", `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/admin/media — register file metadata after client-side upload
export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { file_name, file_path, public_url, mime_type, file_size, alt_text, category, tags } = body;

  if (!file_name || !file_path) {
    return NextResponse.json({ error: "file_name and file_path required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("media_library")
    .insert({
      file_name,
      file_path,
      bucket_name: BUCKET,
      public_url: public_url ?? null,
      mime_type: mime_type ?? null,
      file_size: file_size ?? null,
      alt_text: alt_text ?? null,
      category: category ?? "general",
      tags: tags ?? [],
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/admin/media?id=uuid
export async function DELETE(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createAdminClient();

  // Get file path first
  const { data: file } = await admin
    .from("media_library")
    .select("file_path, bucket_name")
    .eq("id", id)
    .single();

  if (file) {
    await admin.storage.from(file.bucket_name).remove([file.file_path]);
  }

  const { error } = await admin.from("media_library").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
