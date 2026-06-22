import EmailTemplatesClient from "./EmailTemplatesClient";

export const metadata = { title: "Email Templates — Admin" };
export const dynamic = "force-dynamic";

async function fetchTemplates() {
  try {
    if (!process.env.POSTMARK_SERVER_TOKEN) return { templates: [], total: 0 };
    const res = await fetch("https://api.postmarkapp.com/templates?Count=500&Offset=0", {
      headers: {
        Accept: "application/json",
        "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN,
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return { templates: [], total: 0 };
    const json = await res.json();
    return { templates: json.Templates ?? [], total: json.TotalCount ?? 0 };
  } catch {
    return { templates: [], total: 0 };
  }
}

export default async function EmailTemplatesPage() {
  const { templates, total } = await fetchTemplates();
  const hasToken = !!process.env.POSTMARK_SERVER_TOKEN;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Email Templates</h1>
        <p className="text-[#64748b] mt-1">
          View and edit all Postmark transactional email templates — subject lines, HTML body, and text fallback.
        </p>
        {!hasToken && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <strong>POSTMARK_SERVER_TOKEN</strong> is not set. Add it to your environment variables to manage email templates.
          </div>
        )}
        {hasToken && total === 0 && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            No templates found in Postmark. Create your first template in the{" "}
            <a href="https://account.postmarkapp.com" target="_blank" rel="noopener" className="underline">Postmark dashboard</a>.
          </div>
        )}
      </div>
      <EmailTemplatesClient initial={templates} total={total} />
    </div>
  );
}
