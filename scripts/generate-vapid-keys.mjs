#!/usr/bin/env node
/**
 * Run once to generate VAPID keys for web push notifications.
 * Usage: node scripts/generate-vapid-keys.mjs
 *
 * Output: exact values to paste into GCP Secret Manager and Cloud Run env vars.
 */

import { generateVAPIDKeys } from "web-push";

const keys = generateVAPIDKeys();

console.log("\n────────────────────────────────────────────────────────────────");
console.log("  VAPID Keys — generated for Hayya Med Pro push notifications");
console.log("────────────────────────────────────────────────────────────────\n");

console.log("1. GCP Secret Manager (server-only):");
console.log("   gcloud secrets versions add hayyamed-pro-vapid-private --data-file=-");
console.log("   Paste value:", keys.privateKey);
console.log("");
console.log("2. Cloud Run env var (NEXT_PUBLIC — baked into client at build time):");
console.log("   In cloudbuild.yaml → --set-env-vars add:");
console.log(`   NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log("");
console.log("3. Cloud Run env var (server-only):");
console.log("   In cloudbuild.yaml → --set-env-vars add:");
console.log("   VAPID_SUBJECT=mailto:support@hayyamed.pro");
console.log("");
console.log("────────────────────────────────────────────────────────────────");
console.log("  Copy these raw values:");
console.log("────────────────────────────────────────────────────────────────\n");
console.log("NEXT_PUBLIC_VAPID_PUBLIC_KEY=" + keys.publicKey);
console.log("VAPID_PRIVATE_KEY=" + keys.privateKey);
console.log("VAPID_SUBJECT=mailto:support@hayyamed.pro");
console.log("\n  IMPORTANT: Keep VAPID_PRIVATE_KEY in Secret Manager only.");
console.log("  Never commit it to git or expose it client-side.\n");
