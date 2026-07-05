import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : "ulevibytaxocdvdfmfaq.supabase.co";

const csp = [
  "default-src 'self'",
  // unsafe-eval only in dev (Next.js Turbopack hot-reload needs it)
  `script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${supabaseHost}`,
  "font-src 'self'",
  `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://cloudflareinsights.com https://static.cloudflareinsights.com https://us.i.posthog.com https://us-assets.i.posthog.com`,
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS: 2 years, including subdomains, eligible for preload list
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Keep node_modules junction inside the Windows tmp distDir alive across builds.
  // In Docker/GCP the dist dir is always fresh, so this is a no-op there.
  cleanDistDir: false,
  typescript: {
    // On Windows, the junction-based distDir causes Next.js to generate type files
    // with relative paths that resolve outside the project tree, breaking build-time
    // TypeScript. Types are enforced via `npx tsc --noEmit` and in Docker/GCP builds
    // (Linux has no junction, so this flag is false there).
    ignoreBuildErrors: process.platform === "win32",
  },
  experimental: {
    serverActions: {
      // Cloud Run sits behind Cloudflare; the x-forwarded-host header
      // arrives as the internal Cloud Run URL rather than hayyamed.pro.
      // Listing both ensures Next.js CSRF check passes in all paths.
      allowedOrigins: [
        "hayyamed.pro",
        "www.hayyamed.pro",
        "hayyamed-pro-543551932098.me-central1.run.app",
      ],
    },
  },
  // In development, build outside OneDrive to prevent EBUSY file-lock errors.
  // OneDrive syncs files in the project tree; this moves the build output outside it.
  // The node_modules junction at C:\Users\<user>\tmp\hayyamed-next\node_modules
  // ensures webpack-compiled server bundles can still resolve packages at runtime.
  // Run scripts/setup-dev.ps1 once before first `npm run dev` to create junctions.
  distDir: isDev ? (process.env.NEXT_DIST_DIR ?? "../../../../tmp/hayyamed-next") : ".next",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHost,
        pathname: "/storage/v1/object/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    // /owner/* was merged into /admin/* on 2026-07-05 — keep old bookmarks working.
    return [
      { source: "/owner", destination: "/admin", permanent: true },
      { source: "/owner/command-center", destination: "/admin", permanent: true },
      { source: "/owner/ai", destination: "/admin/ai-training", permanent: true },
      { source: "/owner/audit", destination: "/admin/audit-logs", permanent: true },
      { source: "/owner/compliance", destination: "/admin/compliance", permanent: true },
      { source: "/owner/emergency", destination: "/admin/emergency", permanent: true },
      { source: "/owner/integrations", destination: "/admin/integrations", permanent: true },
      { source: "/owner/monitoring", destination: "/admin/monitoring", permanent: true },
      { source: "/owner/revenue", destination: "/admin/revenue", permanent: true },
      { source: "/owner/users", destination: "/admin/professionals", permanent: true },
    ];
  },
};

export default withNextIntl(withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Proxy Sentry events through /monitoring to bypass ad-blockers
  tunnelRoute: "/monitoring",
  // Don't show Sentry CLI output during every build
  silent: !process.env.CI,
  // Disable Sentry telemetry from the build tool
  telemetry: false,
  // Skip source map upload if no auth token (local dev + unset envs)
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
}));
