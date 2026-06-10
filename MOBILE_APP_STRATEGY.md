# Hayya Med Pro — Mobile App Strategy

## Strategic Principle

Every API, authentication flow, dashboard, notification system, data model, and user journey must be designed mobile-ready from day one. Mobile is not an afterthought — it is the primary delivery channel for healthcare professionals in GCC markets.

---

## Market Reality

- 95%+ smartphone penetration in GCC
- Healthcare professionals spend 8–12 hours/day away from desks
- Certificate uploads happen in conference halls and training rooms
- License renewal panic happens at 11pm on the last day before expiry
- Mobile-first = more engagement = better retention = lower churn

---

## Phase 1: PWA (Progressive Web App) — Now

**Cost:** Zero additional development cost
**Timeline:** Available from first deployment

### What PWA Delivers
- **Installable** — "Add to Home Screen" on iOS and Android
- **Offline access** — Dashboard and CME list visible without internet
- **Push notifications** — License expiry alerts, CME deadlines
- **Camera access** — Certificate upload from phone camera
- **Fast loading** — Service worker caches app shell
- **No App Store** — No Apple 30% fee. No review delays.

### Implementation Requirements
- `manifest.json` — App name, icons, theme color, display mode
- Service Worker — Cache static assets, offline fallback page
- HTTPS — Required (GCP Cloud Run handles this)
- Icons — 192×192 and 512×512 PNG (Hayya Med Pro branding)
- Add-to-homescreen prompt — Triggered after 2nd visit or first key action

### PWA Implementation Checklist
- [ ] manifest.json at `/public/manifest.json`
- [ ] Service worker at `/public/sw.js`
- [ ] `next-pwa` package configured
- [ ] Offline fallback page `/offline`
- [ ] Push notification subscription (Web Push API + Supabase Edge Functions)
- [ ] Camera upload tested on iOS Safari and Android Chrome
- [ ] Lighthouse PWA score: 100

---

## Phase 2: React Native (Year 1–2 — When Revenue Justifies)

**Trigger:** $200,000 ARR or 2,000 active users — whichever comes first

### Why React Native (not Native iOS/Android)
- Shared business logic with web (TypeScript)
- Shared Supabase client
- Shared API layer
- Single team can maintain web + mobile
- ~70% code reuse
- Faster time to market vs native

### Architecture Requirements
- API-first backend — all features accessible via REST/RPC
- No web-only patterns (no cookies — use Bearer tokens in mobile)
- Supabase `@supabase/supabase-js` works natively in React Native
- Deep linking via Expo Router or React Navigation
- Biometric authentication via `expo-local-authentication`
- Push notifications via `expo-notifications` + Firebase Cloud Messaging

### Features Prioritized for Mobile App
1. Dashboard — compliance score, days to expiry
2. CME activity submission with camera upload
3. Push notifications — license expiry, CME deadlines
4. Certificate viewer
5. PDF report download
6. License wallet
7. Employer linking requests

---

## Phase 3: Native iOS / Android (Year 3+)

**Trigger:** $2M ARR or government contract requiring App Store presence

- iOS: Swift / SwiftUI
- Android: Kotlin / Jetpack Compose
- Dedicated mobile engineering team required

---

## App Store Strategy

### Apple 30% Fee Problem
Apple takes 30% of in-app subscription revenue. On $49/year Pro, that is $14.70 per subscriber per year — unacceptable margin erosion.

**Solution:** Web-only checkout (Paddle hosted page)
- App is a "reader app" — displays subscription content but does not sell subscriptions
- All subscription purchases happen at `pro.hayyamed.com/pricing` in the browser
- This is the same strategy used by Netflix, Spotify, Kindle
- Apple policy allows this (reader app exemption)

### Google Play 15% Fee
Google takes 15% for subscriptions after year 1. Same web checkout strategy applies.

---

## Mobile Security Standards

| Requirement | Implementation |
|---|---|
| Authentication | Bearer token (not cookies) for mobile API calls |
| Token storage | Secure storage (Expo SecureStore / iOS Keychain / Android Keystore) |
| Biometric login | Touch ID / Face ID / fingerprint — optional but offered |
| Certificate transmission | HTTPS only, TLS 1.3 minimum |
| Screenshot prevention | Sensitive screens flagged `secure` on Android |
| Jailbreak detection | Recommended for Phase 3 native app |
| API key storage | Never in mobile app bundle — always server-side |
| Session expiry | Same as web — Supabase token rotation |

---

## Push Notification Strategy

| Notification | Trigger | Urgency |
|---|---|---|
| License expiry — 30 days | System cron | High |
| License expiry — 7 days | System cron | Critical |
| License expiry — 1 day | System cron | Emergency |
| CME cycle deadline — 30 days | System cron | Medium |
| CME cycle deadline — 7 days | System cron | High |
| Activity verified | Admin action | Low |
| Activity rejected | Admin action | Medium |
| Employer link approved | Admin action | Low |

**Implementation:** Supabase Edge Functions + Web Push (PWA) / Firebase Cloud Messaging (React Native)

---

## Offline Support Strategy

| Feature | Offline Behavior |
|---|---|
| Dashboard summary | Cached — shows last fetched data |
| CME activity list | Cached |
| License expiry dates | Cached |
| Certificate upload | Queued — syncs when online |
| PDF report | Downloaded and cached on first view |
| CME submission form | Available offline, submitted on reconnect |

---

## App Store Readiness Requirements

### App Store (Apple)
- Age rating: 17+ (medical professional tool)
- Privacy policy URL: `pro.hayyamed.com/privacy`
- Support URL: `pro.hayyamed.com/contact`
- Category: Medical
- No in-app purchases (reader app exemption)
- Arabic localization required for GCC App Store approval

### Google Play
- Category: Medical
- Content rating: Everyone
- Same privacy policy and support URL
- Arabic localization

---

## Mobile Performance Targets

| Metric | Target |
|---|---|
| App launch (cold start) | < 2 seconds |
| Dashboard load | < 1 second |
| Certificate upload | < 5 seconds on 4G |
| Offline → online sync | < 3 seconds |
| Push notification delivery | < 30 seconds |
| Bundle size (React Native) | < 15MB download |
