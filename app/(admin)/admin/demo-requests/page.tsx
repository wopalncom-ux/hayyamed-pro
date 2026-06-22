import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["new", "contacted", "qualified", "closed_won", "closed_lost"] as const;
type DemoStatus = typeof VALID_STATUSES[number];

const STATUS_COLORS: Record<DemoStatus, string> = {
  new:         "bg-[#dbeafe] text-[#1e40af]",
  contacted:   "bg-[#fef9c3] text-[#854d0e]",
  qualified:   "bg-[#dcfce7] text-[#15803d]",
  closed_won:  "bg-[#bbf7d0] text-[#15803d]",
  closed_lost: "bg-[#fee2e2] text-[#b91c1c]",
};

const STATUS_LABELS: Record<DemoStatus, string> = {
  new:         "New",
  contacted:   "Contacted",
  qualified:   "Qualified",
  closed_won:  "Won",
  closed_lost: "Lost",
};

async function updateStatus(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members").select("role")
    .eq("auth_id", user.id).in("role", ["master_admin", "super_admin"]).maybeSingle();
  if (!member) redirect("/dashboard");

  const id     = formData.get("id") as string;
  const status = formData.get("status") as string;
  if (!id || !(VALID_STATUSES as readonly string[]).includes(status)) return;

  await admin.from("demo_requests").update({
    status,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  revalidatePath("/admin/demo-requests");
}

async function updateNotes(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("organization_members").select("role")
    .eq("auth_id", user.id).in("role", ["master_admin", "super_admin"]).maybeSingle();
  if (!member) redirect("/dashboard");

  const id    = formData.get("id") as string;
  const notes = (formData.get("notes") as string | null)?.trim() ?? "";
  if (!id) return;

  await admin.from("demo_requests").update({
    notes: notes || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  revalidatePath("/admin/demo-requests");
}

export const metadata = { title: "Demo Requests" };

export default async function DemoRequestsPage() {
  const admin = createAdminClient();

  const { data: requests, error } = await admin
    .from("demo_requests")
    .select("id, name, email, job_title, org_name, org_type, staff_count, country, message, status, notes, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const total    = requests?.length ?? 0;
  const newCount = requests?.filter((r) => r.status === "new").length ?? 0;
  const wonCount = requests?.filter((r) => r.status === "closed_won").length ?? 0;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Demo Requests</h1>
          <p className="text-sm text-[#64748b] mt-1">Enterprise leads from /request-demo. DB is source of truth — email is secondary.</p>
        </div>
        <a
          href="/api/admin/demo-requests/export"
          className="text-sm font-medium text-white bg-[#1a56a0] hover:bg-[#1547a0] px-4 py-2 rounded-lg transition-colors"
        >
          Export CSV ({total})
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Total requests</p>
          <p className="text-3xl font-bold text-[#1a56a0]">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Needs follow-up</p>
          <p className={`text-3xl font-bold ${newCount > 0 ? "text-[#d97706]" : "text-[#16a34a]"}`}>{newCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide mb-1">Won</p>
          <p className="text-3xl font-bold text-[#16a34a]">{wonCount}</p>
        </div>
      </div>

      {error && (
        <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-sm px-4 py-3 rounded-lg mb-6">
          Failed to load demo requests: {error.message}
        </div>
      )}

      {total === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <p className="text-[#64748b] text-sm">No demo requests yet. Share /request-demo with clinic directors and hospital HR contacts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests?.map((r) => {
            const statusKey = (VALID_STATUSES as readonly string[]).includes(r.status)
              ? (r.status as DemoStatus)
              : "new";
            return (
              <div key={r.id} className="bg-white rounded-xl border border-[#e2e8f0] p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Contact info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-[#111]">{r.name}</p>
                      <span className="text-xs text-[#64748b]">·</span>
                      <p className="text-xs text-[#64748b]">{r.job_title}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <a href={`mailto:${r.email}`} className="text-sm text-[#1a56a0] hover:underline">{r.email}</a>
                      <span className="text-xs text-[#64748b]">|</span>
                      <span className="text-sm font-medium text-[#374151]">{r.org_name}</span>
                      <span className="text-xs text-[#64748b]">·</span>
                      <span className="text-xs text-[#64748b]">{r.org_type}</span>
                      <span className="text-xs text-[#64748b]">·</span>
                      <span className="text-xs text-[#64748b]">{r.staff_count} staff</span>
                      <span className="text-xs text-[#64748b]">·</span>
                      <span className="text-xs text-[#64748b]">{r.country}</span>
                    </div>
                    {r.message && (
                      <p className="text-xs text-[#374151] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 leading-relaxed">
                        {r.message}
                      </p>
                    )}
                    <p className="text-xs text-[#64748b] mt-2">
                      {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {/* Status changer */}
                  <div className="flex-shrink-0">
                    <form action={updateStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={r.id} />
                      <select
                        name="status"
                        defaultValue={statusKey}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer ${STATUS_COLORS[statusKey]}`}
                      >
                        {VALID_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="text-xs text-white bg-[#1a56a0] hover:bg-[#1547a0] px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        Save
                      </button>
                    </form>
                  </div>
                </div>

                {/* Internal notes */}
                <form action={updateNotes} className="mt-3 pt-3 border-t border-[#f1f5f9]">
                  <input type="hidden" name="id" value={r.id} />
                  <label htmlFor={`notes-${r.id}`} className="block text-xs font-medium text-[#374151] mb-1">
                    Internal notes
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      id={`notes-${r.id}`}
                      name="notes"
                      defaultValue={r.notes ?? ""}
                      rows={2}
                      placeholder="Call notes, qualification details, next steps…"
                      className="flex-1 text-xs border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a56a0] resize-none text-[#374151] placeholder:text-[#64748b]"
                    />
                    <button
                      type="submit"
                      className="self-end text-xs text-white bg-[#64748b] hover:bg-[#475569] px-3 py-2 rounded-lg transition-colors font-medium flex-shrink-0"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            );
          })}
          {total >= 200 && (
            <p className="text-xs text-[#64748b] text-center py-2">Showing first 200 requests. Export CSV for the full list.</p>
          )}
        </div>
      )}
    </div>
  );
}
