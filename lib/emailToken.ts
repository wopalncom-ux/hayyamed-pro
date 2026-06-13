import { createHmac } from "crypto";

const SECRET = process.env.CRON_SECRET ?? "dev-unsub-secret";

export type UnsubCategory = "all" | "cme" | "license" | "reminders" | "digest" | "tasks";

export function signUnsubToken(authId: string, category: UnsubCategory): string {
  const payload = `${authId}:${category}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex").slice(0, 32);
  const b64 = Buffer.from(payload).toString("base64url");
  return `${b64}.${sig}`;
}

export function verifyUnsubToken(token: string): { authId: string; category: UnsubCategory } | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const b64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let payload: string;
  try {
    payload = Buffer.from(b64, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = createHmac("sha256", SECRET).update(payload).digest("hex").slice(0, 32);
  if (sig !== expected) return null;
  const [authId, category] = payload.split(":");
  if (!authId || !category) return null;
  return { authId, category: category as UnsubCategory };
}

export function unsubUrl(authId: string, category: UnsubCategory): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://hayyamed.pro";
  return `${base}/unsubscribe?token=${signUnsubToken(authId, category)}`;
}
