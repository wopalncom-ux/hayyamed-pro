import { NextResponse } from "next/server";

// Served at /.well-known/apple-app-site-association
// Required for iOS Universal Links and PassKit (Sign in with Apple, Passkeys).
// The apple-app-site-association file MUST NOT have a .json extension —
// iOS fetches the exact path /.well-known/apple-app-site-association.
// Content-Type must be application/json (or application/pkcs7-mime for signed).
//
// TODO before React Native launch: replace TEAMID with the Apple Developer
// Team ID from https://developer.apple.com/account → Membership → Team ID.
// Example: "ABCDE12345.pro.hayyamed.app"

const AASA = {
  applinks: {
    details: [
      {
        appIDs: ["TEAMID.pro.hayyamed.app"],
        components: [
          // Auth flows
          { "/": "/auth/callback*" },
          { "/": "/verify-email*" },
          { "/": "/reset-password*" },
          // Professional public profiles
          { "/": "/p/*" },
          // Referral invite links
          { "/": "/r/*" },
          { "/": "/invite/*" },
          // Core dashboard paths
          { "/": "/dashboard*" },
          { "/": "/cme*" },
          { "/": "/licenses*" },
          { "/": "/settings*" },
          // Employer paths
          { "/": "/employer*" },
        ],
      },
    ],
  },
  webcredentials: {
    apps: ["TEAMID.pro.hayyamed.app"],
  },
};

export function GET() {
  return NextResponse.json(AASA, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
