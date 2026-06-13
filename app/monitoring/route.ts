import { NextRequest, NextResponse } from "next/server";

// Proxy Sentry events through our domain to avoid ad-blocker interference.
// Configured in sentry.client.config.ts via `tunnel: "/monitoring"`.
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    if (!body) return new NextResponse(null, { status: 204 });

    // Parse the Sentry envelope header line to extract the DSN
    const firstNewline = body.indexOf("\n");
    const headerJson = firstNewline === -1 ? body : body.slice(0, firstNewline);

    let header: { dsn?: string };
    try {
      header = JSON.parse(headerJson);
    } catch {
      return NextResponse.json({ error: "Invalid envelope" }, { status: 400 });
    }

    if (!header.dsn) return NextResponse.json({ error: "Missing DSN" }, { status: 400 });

    let dsn: URL;
    try {
      dsn = new URL(header.dsn);
    } catch {
      return NextResponse.json({ error: "Invalid DSN" }, { status: 400 });
    }

    // Only allow proxying to sentry.io — block any attempt to redirect to a malicious host
    if (!dsn.hostname.endsWith("sentry.io")) {
      return NextResponse.json({ error: "DSN host not allowed" }, { status: 400 });
    }

    const projectId = dsn.pathname.replace(/^\/+/, "").split("/")[0];
    if (!projectId || !/^\d+$/.test(projectId)) {
      return NextResponse.json({ error: "Invalid project ID in DSN" }, { status: 400 });
    }

    const upstream = `https://${dsn.hostname}/api/${projectId}/envelope/`;

    const sentryRes = await fetch(upstream, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-sentry-envelope" },
    });

    return new NextResponse(sentryRes.body, { status: sentryRes.status });
  } catch {
    // Never let tunnel errors surface to the browser — return a silent no-op
    return new NextResponse(null, { status: 204 });
  }
}
