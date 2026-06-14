import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Certificates — Hayya Med Pro",
  robots: { index: false },
};

type ActivityWithUrl = {
  id: string;
  title: string;
  activity_date: string | null;
  credits_claimed: number | null;
  certificate_url: string;
  signedUrl: string | null;
};

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: activities } = await admin
    .from("cme_activities")
    .select("id, title, activity_date, credits_claimed, certificate_url")
    .eq("professional_id", user.id)
    .not("certificate_url", "is", null)
    .order("activity_date", { ascending: false });

  // Generate signed URLs server-side — never expose raw storage paths to the client
  const withUrls: ActivityWithUrl[] = await Promise.all(
    (activities ?? []).map(async (act) => {
      const path = act.certificate_url as string;
      // If it's already an https URL (external), use as-is. Otherwise generate signed URL.
      if (path.startsWith("http")) {
        return { ...act, certificate_url: path, signedUrl: path };
      }
      const { data } = await admin.storage
        .from("certificates")
        .createSignedUrl(path, 3600);
      return { ...act, certificate_url: path, signedUrl: data?.signedUrl ?? null };
    })
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111] tracking-tight">My Certificates</h1>
          <p className="text-sm text-[#64748b] mt-1">
            CME and CPD certificates uploaded to your profile.
          </p>
        </div>
        <Link
          href="/cme"
          className="text-sm font-semibold text-[#1a56a0] hover:underline"
        >
          Add CME activity
        </Link>
      </div>

      {withUrls.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#f0f4f8] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#374151] mb-1">No certificates yet</p>
          <p className="text-xs text-[#64748b] mb-4">
            When you log a CME activity and upload a certificate, it appears here.
          </p>
          <Link
            href="/cme"
            className="inline-block text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2.5 rounded-lg hover:bg-[#154890] transition-colors"
          >
            Log your first CME activity
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withUrls.map((act) => (
            <div key={act.id} className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden hover:shadow-sm transition-shadow">
              {/* Certificate preview area */}
              <div className="h-32 bg-gradient-to-br from-[#f0f4f8] to-[#e8f0f8] flex items-center justify-center border-b border-[#e2e8f0]">
                <svg className="w-10 h-10 text-[#1a56a0] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              {/* Details */}
              <div className="p-4 space-y-1">
                <p className="text-sm font-semibold text-[#111] line-clamp-2">{act.title}</p>
                <div className="flex items-center gap-2 text-xs text-[#64748b]">
                  {act.activity_date && (
                    <span>
                      {new Date(act.activity_date).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  )}
                  {act.credits_claimed != null && (
                    <>
                      <span className="text-[#d1d5db]">·</span>
                      <span>{act.credits_claimed} credit{act.credits_claimed === 1 ? "" : "s"}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="px-4 pb-4">
                {act.signedUrl ? (
                  <a
                    href={act.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-sm font-semibold text-[#1a56a0] border border-[#1a56a0] rounded-lg py-2 hover:bg-[#eff6ff] transition-colors"
                  >
                    View certificate
                  </a>
                ) : (
                  <p className="text-xs text-[#dc2626] text-center">Certificate unavailable</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {withUrls.length > 0 && (
        <p className="text-xs text-center text-[#64748b]">
          Certificate links expire after 1 hour for security. Refresh the page to regenerate them.
        </p>
      )}
    </div>
  );
}
