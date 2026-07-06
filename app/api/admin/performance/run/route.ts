import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

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
    .limit(1)
    .maybeSingle();
  return member ? user : null;
}

const PSI_BASE = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

function extractCoreWebVitals(audits: Record<string, { numericValue?: number }>) {
  const get = (key: string) => Math.round(audits[key]?.numericValue ?? 0);
  return {
    lcp_ms:    get("largest-contentful-paint"),
    fcp_ms:    get("first-contentful-paint"),
    tbt_ms:    get("total-blocking-time"),
    si_ms:     get("speed-index"),
    ttfb_ms:   get("server-response-time"),
    cls_score: parseFloat((audits["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(4)),
    fid_ms:    get("max-potential-fid"),
  };
}

// POST /api/admin/performance/run
// Body: { url: string, strategy: 'desktop' | 'mobile', page_label?: string }
export async function POST(req: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url, strategy = "desktop", page_label } = await req.json();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  // Validate URL is hayyamed.pro to avoid SSRF
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("hayyamed.pro") && parsed.hostname !== "localhost") {
      return NextResponse.json({ error: "Only hayyamed.pro URLs are allowed" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY ?? "";
  const psiUrl = `${PSI_BASE}?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=seo&category=best-practices${apiKey ? `&key=${apiKey}` : ""}`;

  let psiData: Record<string, unknown>;
  try {
    const res = await fetch(psiUrl, { next: { revalidate: 0 } });
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `PageSpeed API error: ${err.slice(0, 200)}` }, { status: 502 });
    }
    psiData = await res.json();
  } catch (e) {
    return NextResponse.json({ error: `Fetch failed: ${(e as Error).message}` }, { status: 502 });
  }

  // Extract scores
  const cats = (psiData as { lighthouseResult?: { categories?: Record<string, { score?: number }> } })
    ?.lighthouseResult?.categories ?? {};
  const audits = (psiData as { lighthouseResult?: { audits?: Record<string, { numericValue?: number }> } })
    ?.lighthouseResult?.audits ?? {};

  const scoreOf = (key: string) =>
    cats[key]?.score != null ? Math.round((cats[key].score ?? 0) * 100) : null;

  const vitals = extractCoreWebVitals(audits);

  const snapshot = {
    page_url:             url,
    page_label:           page_label ?? url,
    strategy,
    performance_score:    scoreOf("performance"),
    accessibility_score:  scoreOf("accessibility"),
    seo_score:            scoreOf("seo"),
    best_practices_score: scoreOf("best-practices"),
    ...vitals,
    raw_data: {
      fetchTime:    (psiData as { analysisUTCTimestamp?: string }).analysisUTCTimestamp,
      finalUrl:     (psiData as { id?: string }).id,
    },
    run_by: user.id,
  };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("performance_snapshots")
    .insert(snapshot)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
