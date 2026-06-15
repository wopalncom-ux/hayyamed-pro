import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getRequestUser } from "@/lib/auth/getRequestUser";
import { generateVerificationToken } from "@/lib/verificationToken";

export const runtime = "nodejs";

export async function GET() {
  const user = await getRequestUser(await headers());
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = generateVerificationToken(user.id);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";
  const url = `${baseUrl}/verify/${token}`;

  return NextResponse.json({ url, token });
}
