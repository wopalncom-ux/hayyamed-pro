import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { pingCronMonitor } from "@/lib/cronMonitor";

export const runtime = "nodejs";

const BUCKET = "certificates";
// Files uploaded more than this many days ago without a linked CME activity are orphaned
const ORPHAN_GRACE_DAYS = 7;
const BATCH_SIZE = 100;

// GET /api/cron/storage-cleanup
// Removes orphaned certificate files from Supabase Storage:
//   - certificate_storage_records with no cme_activity_id, not yet deleted,
//     uploaded more than ORPHAN_GRACE_DAYS days ago
// Called by Cloud Scheduler weekly (Sunday 03:00 GST).
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - ORPHAN_GRACE_DAYS * 86_400_000).toISOString();

  const { data: orphans, error: fetchError } = await admin
    .from("certificate_storage_records")
    .select("id, storage_path, file_size_bytes")
    .is("cme_activity_id", null)
    .eq("is_deleted", false)
    .lt("uploaded_at", cutoff)
    .limit(BATCH_SIZE);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!orphans?.length) {
    await pingCronMonitor("storage-cleanup");
    return NextResponse.json({ cleaned: 0, errors: 0, storage_bytes_freed: 0 });
  }

  const paths = orphans.map((r) => r.storage_path);
  const ids = orphans.map((r) => r.id);
  const totalBytes = orphans.reduce((sum, r) => sum + (r.file_size_bytes ?? 0), 0);

  let storageErrors = 0;

  // Delete files from Supabase Storage — failure is non-fatal; records are still soft-deleted
  // to prevent the same files being retried every run if storage deletion is flaky.
  const { error: storageError } = await admin.storage.from(BUCKET).remove(paths);
  if (storageError) {
    storageErrors = 1;
  }

  // Soft-delete the DB records
  const { error: updateError } = await admin
    .from("certificate_storage_records")
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .in("id", ids);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await pingCronMonitor("storage-cleanup");

  return NextResponse.json({
    cleaned: ids.length,
    storage_bytes_freed: totalBytes,
    storage_kb_freed: Math.round(totalBytes / 1024),
    errors: storageErrors,
  });
}
