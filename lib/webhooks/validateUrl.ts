const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
  "metadata.gcp.internal",
  "169.254.169.254", // AWS/GCP instance metadata (also covered by IP pattern)
]);

// Patterns that match private / reserved IPv4 and IPv6 ranges
const BLOCKED_IP_PREFIXES = [
  /^127\./,                         // IPv4 loopback
  /^169\.254\./,                    // link-local (GCP/AWS metadata endpoint lives here)
  /^10\./,                          // RFC 1918 class A
  /^172\.(1[6-9]|2\d|3[01])\./,    // RFC 1918 class B (172.16–172.31)
  /^192\.168\./,                    // RFC 1918 class C
  /^0\./,                           // "this" network
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,  // RFC 6598 shared address space
  /^fc00:/i,                        // IPv6 unique local
  /^fe80:/i,                        // IPv6 link-local
  /^::1$/,                          // IPv6 loopback
];

export type UrlValidationResult = { ok: true } | { ok: false; error: string };

/**
 * Validates that a webhook URL is safe to call from the server.
 * Blocks:
 *   - Non-HTTPS URLs
 *   - localhost and known metadata hostnames
 *   - Private / reserved IP ranges (SSRF protection)
 *   - Internal network suffixes (.internal, .local)
 *
 * Called at both registration time AND delivery time (defense in depth).
 */
export function validateWebhookUrl(urlStr: string): UrlValidationResult {
  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return { ok: false, error: "Invalid URL format" };
  }

  if (url.protocol !== "https:") {
    return { ok: false, error: "Webhook URLs must use HTTPS" };
  }

  const host = url.hostname.toLowerCase();

  if (BLOCKED_HOSTS.has(host)) {
    return { ok: false, error: "Webhook URL points to a blocked host" };
  }

  if (host.endsWith(".internal") || host.endsWith(".local") || host.endsWith(".localhost")) {
    return { ok: false, error: "Webhook URL points to an internal network host" };
  }

  for (const pattern of BLOCKED_IP_PREFIXES) {
    if (pattern.test(host)) {
      return { ok: false, error: "Webhook URL points to a private or reserved IP range" };
    }
  }

  return { ok: true };
}
