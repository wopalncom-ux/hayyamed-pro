import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { authLimiter, aiLimiter, webhookLimiter } from "@/lib/rateLimit";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

async function tryLimit(
  limiter: { limit: (id: string) => Promise<{ success: boolean; reset: number }> } | null,
  identifier: string
): Promise<NextResponse | null> {
  if (!limiter) return null;
  try {
    const { success, reset } = await limiter.limit(identifier);
    if (!success) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        },
      });
    }
  } catch {
    // Upstash unavailable — fail open (never block legitimate traffic)
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = clientIp(request);

  if (pathname.startsWith("/api/auth/")) {
    const blocked = await tryLimit(authLimiter, ip);
    if (blocked) return blocked;
  }

  if (pathname.startsWith("/api/ai/")) {
    const blocked = await tryLimit(aiLimiter, ip);
    if (blocked) return blocked;
  }

  if (
    pathname === "/api/paddle/webhook" ||
    pathname === "/api/push/webhook" ||
    pathname === "/api/qpay/webhook"
  ) {
    const blocked = await tryLimit(webhookLimiter, ip);
    if (blocked) return blocked;
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|\\.well-known).*)",
  ],
};
