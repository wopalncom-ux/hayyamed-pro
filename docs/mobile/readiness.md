# Hayya Med Pro — Mobile App Readiness Report
_Generated: 2026-06-15_

---

## Executive Summary

| Platform | Status | Blocker |
|----------|--------|---------|
| Web (Next.js) | ✅ Production | None |
| PWA | ✅ Ready | Service worker + manifest live |
| React Native / Expo | 🟡 Architecture ready | App not built yet |
| iOS (App Store) | 🔴 Not started | React Native app required first |
| Android (Google Play) | 🔴 Not started | React Native app required first |

**Foundation is mobile-ready.** The API layer uses Bearer tokens. Offline CME queue is implemented. The primary gap is the React Native app itself — not the backend.

---

## Authentication — Mobile Readiness

### Supabase Auth for Mobile

| Feature | Web | Mobile API | Status |
|---------|-----|------------|--------|
| Email + password login | ✅ | ✅ Bearer token | Ready |
| Magic link | ✅ | ✅ Deep link to `/auth/callback` | ✅ Ready |
| Google OAuth | ✅ | ⚠️ Needs `expo-auth-session` | 🟡 Architecture ready |
| TOTP MFA | ✅ | ✅ Same Supabase MFA API | Ready |
| Passkeys/WebAuthn | ✅ Web only | 🔴 Native biometric instead | Not implemented |
| Session persistence | Cookies (web) | Secure storage (mobile) | 🟡 Not implemented |

### Mobile Auth Pattern (Required)

```typescript
// React Native: lib/supabase-mobile.ts
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Use SecureStore for tokens (iOS Keychain / Android Keystore)
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabaseMobile = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,  // No cookies on mobile
    },
  }
);
```

### API Routes — Cookie vs Bearer Token

All existing API routes use `createClient()` from `@/lib/supabase/server` which reads the session from cookies. Mobile clients must use Bearer token auth instead.

**Current status:** Most API routes use `supabase.auth.getUser()` which works with both cookies AND Bearer tokens when using Supabase's standard client. ✅

**Risk:** Routes that explicitly read cookies will fail on mobile. Audit needed.

---

## API Route Mobile Compatibility Audit

### Routes confirmed Bearer-token compatible ✅

These routes call `supabase.auth.getUser()` without cookie-specific code:

| Route | Purpose |
|-------|---------|
| `POST /api/cme/activities` | Log CME activity |
| `GET /api/cme/wallet` | Get wallet credits |
| `POST /api/ai/compliance-chat` | AI chatbot (SSE) |
| `POST /api/ai/ocr-certificate` | Certificate OCR |
| `GET /api/licenses` | Get licenses |
| `POST /api/licenses` | Add license |
| `GET /api/push` | Get push subscription status |
| `POST /api/push` | Register push endpoint |
| `POST /api/cme/submit-queued` | Flush offline queue |
| `GET /api/referral/generate` | Get referral code |

### Routes that need mobile audit ⚠️

| Route | Risk | Fix |
|-------|------|-----|
| `/api/paddle/webhooks` | Webhook-only (no user auth needed) | N/A |
| `/api/qpay/*` | Web checkout only — correct | Web WebView |
| `POST /api/auth/mfa/*` | Uses `supabase.auth.getSession()` | Audit — may need update |
| `/api/admin/*` | Admin only — mobile app won't need | No change |

---

## Offline Support

### Implemented ✅

**Offline CME Queue** (`app/offline-queue.ts` + `app/api/cme/submit-queued/route.ts`)

```typescript
// Offline: store in localStorage
export function queueCmeActivity(activity: OfflineCmeActivity) {
  const queue = getQueue();
  queue.push({ ...activity, queuedAt: new Date().toISOString() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

// Online: flush queue on reconnect
window.addEventListener("online", async () => {
  const queue = getQueue();
  if (queue.length > 0) {
    await fetch("/api/cme/submit-queued", {
      method: "POST",
      body: JSON.stringify({ activities: queue }),
    });
    clearQueue();
  }
});
```

### React Native: Requires AsyncStorage Instead of localStorage

```typescript
// app/offline-queue-native.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export async function queueCmeActivity(activity: OfflineCmeActivity) {
  const raw = await AsyncStorage.getItem("cme_offline_queue");
  const queue = raw ? JSON.parse(raw) : [];
  queue.push(activity);
  await AsyncStorage.setItem("cme_offline_queue", JSON.stringify(queue));
}

// Subscribe to network state
NetInfo.addEventListener(async (state) => {
  if (state.isConnected) {
    await flushQueue();
  }
});
```

---

## Push Notifications

### Web Push (Current) ✅

- VAPID keys configured
- Service worker (`/public/sw.js`) registered
- `push_subscriptions` table stores endpoints
- License expiry cron sends push via `web-push` library

### React Native Push — FCM + APNs (Missing) 🔴

**Required packages:**
```
expo install expo-notifications
```

**Required DB table:** `mobile_device_registrations` (migration 043 — not yet created)

**Required GCP:** Firebase project for FCM credentials

**Architecture:**

```typescript
// React Native: Register device token on app launch
import * as Notifications from "expo-notifications";

async function registerMobilePushToken(supabase: SupabaseClient) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  const platform = Platform.OS as "ios" | "android";

  await supabase.from("mobile_device_registrations").upsert({
    professional_id: (await supabase.auth.getUser()).data.user?.id,
    device_token: token,
    platform,
    app_version: Constants.expoConfig?.version,
    is_active: true,
    last_active_at: new Date().toISOString(),
  }, { onConflict: "professional_id,device_token" });
}
```

---

## Deep Linking

### Required for React Native

| URL | Purpose | Status |
|-----|---------|--------|
| `hayyamed://auth/callback` | OAuth + magic link redirect | 🔴 Not configured |
| `hayyamed://dashboard` | Home screen after login | 🔴 Not configured |
| `hayyamed://cme/add` | Open CME add form | 🔴 Not configured |
| `hayyamed://verify/{code}` | Certificate verification | 🔴 Not configured |
| `hayyamed://invite/{code}` | Employer invite | 🔴 Not configured |

**Implementation:**
```typescript
// app.json (Expo config)
{
  "expo": {
    "scheme": "hayyamed",
    "ios": {
      "bundleIdentifier": "pro.hayyamed.app",
      "associatedDomains": ["applinks:hayyamed.pro"]
    },
    "android": {
      "package": "pro.hayyamed.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{ "scheme": "hayyamed" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

---

## In-App Purchase Compliance

### Rule: No In-App Purchases

Per CLAUDE.md: "No in-app subscription purchases — web checkout only (App Store reader app exemption)."

**Implementation:**
- All subscription flows open a WebView pointing to `https://hayyamed.pro/checkout?plan=pro`
- No `StoreKit` (iOS) or Google Play Billing SDK
- App qualifies as "reader app" — content created outside app, accessed within

```typescript
// React Native: Open web checkout
import { WebBrowser } from "expo-web-browser";

async function handleUpgrade(plan: "pro" | "employer") {
  const user = await supabase.auth.getUser();
  const checkoutUrl = `https://hayyamed.pro/checkout?plan=${plan}&mobile=true`;
  await WebBrowser.openBrowserAsync(checkoutUrl);
}
```

---

## Screen-by-Screen Mobile Assessment

### Dashboard (/)
| Feature | Mobile Status | Notes |
|---------|--------------|-------|
| Compliance ring | ✅ SVG — mobile compatible | |
| CME wallet summary | ✅ API + UI | |
| Quick Add CME button | ✅ Implemented | |
| Achievement badges | ✅ Implemented | |
| First activity prompt | ✅ Implemented | |
| Renewal Calendar | ✅ Implemented | |
| Gap Analysis | ✅ Implemented (Pro) | |

### CME (/cme)
| Feature | Mobile Status | Notes |
|---------|--------------|-------|
| Activity list | ✅ | |
| Search + filter | ✅ | |
| Add activity form | ✅ | |
| OCR certificate | ✅ Camera on mobile | Needs `expo-image-picker` for native |
| Offline queue | ✅ localStorage | Needs AsyncStorage for RN |
| Heatmap | ✅ | |

### Licenses (/licenses)
| Feature | Mobile Status | Notes |
|---------|--------------|-------|
| License list | ✅ | |
| Add license | ✅ | |
| Renewal calendar | ✅ | |
| Multi-license wallet | ✅ | |

### Marketplace (/dashboard/marketplace)
| Feature | Mobile Status | Notes |
|---------|--------------|-------|
| Course browsing | ✅ | |
| Enrollment | ✅ | |
| Course completion | ✅ | |
| Provider view | ✅ | |

### Settings (/settings)
| Feature | Mobile Status | Notes |
|---------|--------------|-------|
| MFA/TOTP | ✅ Works in WebView | |
| Passkeys | ✅ Web only (biometric native instead) | |
| Push notification settings | ✅ (Web Push) | FCM needed for native |
| Language toggle (AR/EN) | ✅ | |

---

## React Native App — Minimum Viable Screens

Priority order for initial RN app release:

| # | Screen | API Dependency | Effort |
|---|--------|---------------|--------|
| 1 | Login / Register | `/api/auth/*` | 1d |
| 2 | Dashboard (compliance ring + quick add) | `/api/cme/wallet` | 2d |
| 3 | CME Activity List + Add | `/api/cme/activities` | 2d |
| 4 | CME Offline Queue | localStorage → AsyncStorage migration | 1d |
| 5 | License List + Add | `/api/licenses` | 1d |
| 6 | Push Notification Register | Migration 043 required | 1d |
| 7 | Web Checkout (WebView) | Web only | 0.5d |
| 8 | Settings | `/api/auth/mfa/*` | 1d |

**Total MVP estimate: ~10 developer days**

---

## React Native App — Technology Stack (Recommended)

```
Framework:    Expo SDK 52 (managed workflow)
Navigation:   Expo Router (file-based, mirrors Next.js App Router)
State:        Zustand (minimal, no Redux complexity)
HTTP:         Supabase JS client (same as web)
Storage:      expo-secure-store (auth tokens) + AsyncStorage (app state)
Push:         expo-notifications (FCM + APNs via Expo push service)
Camera:       expo-image-picker (certificate photos)
Biometric:    expo-local-authentication (Touch ID / Face ID for login)
Analytics:    PostHog React Native SDK (same PostHog project)
Errors:       Sentry React Native SDK (same Sentry project)
OTA Updates:  expo-updates (no App Store review for JS changes)
```

---

## App Store Compliance Checklist

### iOS App Store
| Requirement | Status |
|-------------|--------|
| Bundle ID: `pro.hayyamed.app` | 🔴 Not registered |
| Privacy Nutrition Label (Data collected) | 🔴 Draft needed |
| APNs certificate | 🔴 Not configured |
| Universal Links (`apple-app-site-association`) | 🔴 Not deployed |
| Medical category classification | 🟡 Review needed |
| No in-app purchase | ✅ Web checkout only |
| HTTPS only | ✅ |
| Privacy Policy URL | ✅ `/privacy` exists |

### Google Play Store
| Requirement | Status |
|-------------|--------|
| Package: `pro.hayyamed.app` | 🔴 Not registered |
| Data Safety section | 🔴 Not drafted |
| FCM credentials | 🔴 Not configured |
| App Links (`assetlinks.json`) | 🔴 Not deployed |
| Content rating (PEGI / ESRB equivalent) | 🔴 Not filed |
| Target API level 34+ | ✅ (Expo default) |
| Privacy Policy URL | ✅ `/privacy` exists |

---

## PWA Status ✅

The web app already meets PWA requirements:

| PWA Requirement | Status |
|----------------|--------|
| `manifest.webmanifest` | ✅ Live |
| Service worker (`/sw.js`) | ✅ Live |
| HTTPS | ✅ Cloud Run |
| Icons (192px, 512px) | ✅ |
| Offline fallback | ✅ CME queue |
| Install prompt | ✅ Browser handles |
| iOS Safari: add to home screen | ✅ Works (no install prompt due to Safari limitation) |

---

## React Native Trigger Conditions

Per MOBILE_APP_STRATEGY.md, the React Native trigger is:

> First 100 paying Pro subscribers OR first employer account signed.

**Current status:** Pre-launch. React Native app should begin architecture/MVP sprint in parallel with first 50 Pro subscribers.

**Recommended:** Begin Expo project setup and auth screens now so the foundation is ready when the trigger is hit.
