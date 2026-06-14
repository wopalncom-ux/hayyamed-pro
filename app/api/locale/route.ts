import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const locale = body?.locale === "ar" ? "ar" : "en";

  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
