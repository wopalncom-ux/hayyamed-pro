# Store Listing Content — Hayya Med Pro

Drafted from PRODUCT_VISION.md positioning. Fill in bracketed items once accounts exist.

---

## App identity (same both stores)

- **App name**: Hayya Med Pro
- **Bundle ID / Package**: `pro.hayyamed.app`
- **Category**: Medical (primary) — Business (secondary, if a second category is allowed)
- **Support URL**: https://hayyamed.pro/help
- **Privacy Policy URL**: https://hayyamed.pro/privacy
- **Terms of Service URL**: https://hayyamed.pro/terms
- **Marketing URL**: https://hayyamed.pro

---

## Google Play Console

### Short description (max 80 characters)
```
CME/CPD tracking, license alerts & compliance for GCC healthcare professionals
```
(79 chars)

### Full description (max 4000 characters)
```
Hayya Med Pro is the CME/CPD compliance platform built specifically for healthcare professionals in Qatar, Saudi Arabia, UAE, and the wider GCC — not a generic global learning app retrofitted with a checklist.

WHY HAYYA MED PRO

Generic platforms track course completions. We track your actual license compliance — against the real rules your licensing authority enforces, updated the moment those rules change.

KEY FEATURES

• CME/CPD Wallet — Log activities, upload certificates, and watch your compliance ring fill in real time against your country's exact credit requirements.

• License Expiry Intelligence — Get proactive alerts at 90/60/30/7 days before your license expires. No more reactive panic renewals.

• Verified Certificate Storage — Every certificate is stored securely and privately, timestamped, and audit-ready if your employer or licensing authority ever asks.

• Employer Linking — Link your profile to your hospital or clinic so HR can see your compliance status without you emailing PDFs back and forth.

• Country Rules Engine — Pre-configured for QCHP (Qatar), SCFHS (Saudi Arabia), DHA/DOH (UAE), MOH (Kuwait), NHRA (Bahrain), and OMSB (Oman) — with more countries added regularly.

• Face ID / Fingerprint Login — Sign in securely in a tap, with your session protected in your device's secure hardware storage.

• Camera Certificate Upload — Snap a photo of a paper certificate at a conference and it's logged instantly.

• Offline-Ready — Log CME activities even without signal; they sync the moment you're back online.

WHO IT'S FOR

Physicians, surgeons, nurses, pharmacists, dentists, and allied health professionals licensed anywhere in the GCC — plus HR and compliance teams at hospitals and clinics who need real-time visibility into staff compliance.

Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Always verify final requirements with your relevant regulatory body.

Free to start. Upgrade to Pro for full compliance reports, unlimited license tracking, and priority support.
```

### What's new (release notes — v1.0.0)
```
Hayya Med Pro is here. Track your CME/CPD credits, get proactive license expiry alerts, and store verified certificates — all built specifically for GCC healthcare compliance requirements. Sign in with Face ID or fingerprint, log activities on the go, and stay audit-ready.
```

### Data Safety form — quick reference (what Play Console will ask)
- Data collected: Email, Name, Health/medical info (CME activities, license numbers), Photos (certificate uploads)
- Purpose: Account management, App functionality
- Encrypted in transit: Yes (HTTPS/TLS via Supabase)
- Users can request data deletion: Yes (link to https://hayyamed.pro/privacy or a dedicated deletion request flow — confirm this exists before submitting)
- Data shared with third parties: Only infrastructure processors (Supabase, GCP, Postmark) under DPA — not sold or shared for advertising

### Content rating questionnaire
- No user-generated public content, no violence/gambling/mature themes → should qualify for the lowest rating tier (e.g. "Everyone"/PEGI 3) in every regional rating system.

---

## Apple App Store Connect

### Subtitle (max 30 characters)
```
CME Tracking & License Alerts
```
(29 chars)

### Promotional text (max 170 characters, editable without review)
```
Built for GCC healthcare compliance — QCHP, SCFHS, DHA, DOH, MOH, NHRA, OMSB. Track CME credits, get license expiry alerts, and store verified certificates.
```

### Description (max 4000 characters)
Same as Google Play full description above — Apple doesn't require a shorter version, just reformat without the bullet "•" if it renders oddly (App Store supports bullets fine in practice).

### Keywords (max 100 characters, comma-separated, no spaces after commas needed)
```
CME,CPD,QCHP,SCFHS,DHA,license,compliance,healthcare,physician,nurse,pharmacist,Qatar,GCC,medical
```
(count carefully — trim if over 100)

### What's New (v1.0.0)
Same as Google Play release notes above.

### App Store category
- Primary: Medical
- Secondary: Business

### Age rating questionnaire
- No objectionable content anywhere in the app → should qualify for 4+.

### Privacy Nutrition Label — quick reference (what App Store Connect will ask)
- Data linked to you: Contact Info (email, name), Health & Fitness (CME/license data), User Content (certificate photos)
- Data NOT linked to you: none collected for tracking/advertising
- Used for tracking (cross-app/cross-site): No
- Third-party data sharing: infrastructure processors only (Supabase/GCP/Postmark), not for advertising

---

## Screenshots needed (both stores — same source screens, different device frame sizes)

Capture from a real device or simulator, ideally with the demo account (`demo-doc@hayyademo.pro`) so data looks realistic and populated, not empty-state:

1. **Dashboard / compliance ring** — the hero shot, shows the core value prop instantly
2. **CME Wallet** — activity log with credits breakdown by category
3. **License tracking** — expiry countdown / alert state
4. **Certificate upload** — camera/photo picker in action
5. **Profile / biometric login toggle** — shows security feature

Required sizes:
- **Android**: at minimum 1 screenshot at 16:9 or 9:16 phone size (1080×1920 or similar); tablet screenshots optional but recommended since `supportsTablet: true` is set for iOS (add Android tablet too if targeting tablets)
- **iOS**: 6.7" (iPhone 15/16 Pro Max) and 6.5" display sizes are the two mandatory sets App Store Connect requires per app; can reuse the 6.7" set scaled if you don't have every device physically

---

## Pre-submission checklist (code/config side — separate from this content)

- [ ] `google-services.json` added to `mobile/` and wired in `app.json` (`android.googleServicesFile`)
- [ ] `eas.json` `submit.android.serviceAccountKeyPath` fixed to point to a real Play **service account** JSON (not `google-services.json` — different file, see mobile app health-check notes)
- [ ] `public/.well-known/assetlinks.json` updated with real SHA256 (from `eas credentials` after first Android build, or Play Console)
- [ ] `eas.json` `submit.production.ios.ascAppId` and `appleTeamId` filled in after App Store Connect app record is created
- [ ] APNs key generated in Apple Developer portal, uploaded to EAS credentials
- [x] Account-deletion path confirmed real — `DeleteAccountButton` on `/dashboard/settings`, backed by `deleteAccount()` in `app/(dashboard)/dashboard/settings/actions.ts`. Link this URL in the Play Data Safety form's "request data deletion" field: `https://hayyamed.pro/dashboard/settings`
