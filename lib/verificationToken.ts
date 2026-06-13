import { createHmac } from "crypto";

function getSecret(): string {
  return process.env.CRON_SECRET ?? "dev-verify-secret-change-in-prod";
}

export function generateVerificationToken(professionalId: string): string {
  const sig = createHmac("sha256", getSecret())
    .update(`hayya-verify:${professionalId}`)
    .digest("hex")
    .slice(0, 32);
  return Buffer.from(`${professionalId}:${sig}`).toString("base64url");
}

export function validateVerificationToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon === -1) return null;

    const professionalId = decoded.slice(0, lastColon);
    const sig = decoded.slice(lastColon + 1);

    if (!professionalId || sig.length !== 32) return null;

    const expectedSig = createHmac("sha256", getSecret())
      .update(`hayya-verify:${professionalId}`)
      .digest("hex")
      .slice(0, 32);

    if (sig !== expectedSig) return null;
    return professionalId;
  } catch {
    return null;
  }
}
