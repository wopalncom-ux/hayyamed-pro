import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  // Route Sentry events through the app's own domain to avoid ad-blockers
  tunnel: "/monitoring",
  debug: false,
  // Session replay: capture all error sessions, no idle sessions (no overhead)
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,
  integrations: [
    Sentry.replayIntegration({
      // Block all media and mask all text to comply with healthcare data handling rules
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
