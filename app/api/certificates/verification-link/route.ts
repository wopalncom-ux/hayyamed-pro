import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateVerificationToken } from "@/lib/verificationToken";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = generateVerificationToken(user.id);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";
  const url = `${baseUrl}/verify/${token}`;

  return NextResponse.json({ url, token });
}
