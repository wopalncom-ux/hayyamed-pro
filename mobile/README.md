# Hayya Med Pro — Mobile App

React Native / Expo app for iOS and Android.

## Stack

- **Expo SDK 56** with expo-router (file-based navigation)
- **React Native 0.85** + TypeScript strict
- **Supabase JS** with expo-secure-store (Bearer token, no cookies)
- **NativeWind v4** (Tailwind CSS for React Native)
- **React Query** for data fetching
- **expo-local-authentication** for Face ID / Touch ID
- **expo-notifications** for push (APNs + FCM)

## Project Structure

```
app/
  _layout.tsx          Root layout — auth guard, QueryClient, AuthProvider
  (auth)/
    login.tsx          Email + password sign in
    register.tsx       New account creation
    forgot-password.tsx Email reset link
  (tabs)/
    _layout.tsx        Bottom tab navigator
    index.tsx          Dashboard — compliance ring, quick actions
    cme.tsx            CME Wallet — progress bar, activity log, add modal
    licenses.tsx       License cards with expiry warnings
    profile.tsx        User info, biometric toggle, sign out
  onboarding/
    index.tsx          Redirect to web for profile completion
components/
  dashboard/
    ComplianceRing.tsx SVG compliance progress ring
  ui/
    StatCard.tsx       Numeric stat card
hooks/
  useAuth.tsx          Auth context — session, profile, signOut
lib/
  supabase.ts          Supabase client (SecureStore session persistence)
  types.ts             Shared types (kept in sync with web lib/types.ts)
```

## Auth Model

- Sessions stored in **iOS Keychain / Android Keystore** via expo-secure-store
- **No cookies** on any API call — Bearer tokens only
- Auth guard in `app/_layout.tsx` → redirects to login, onboarding, or tabs
- Onboarding not completed → redirect to web (hayyamed.pro/onboarding/N)

## Running locally

```bash
cd mobile
npm start          # Expo Dev Client (scan QR with Expo Go)
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
```

Requires `.env` or hardcoded Supabase URL/anon key (already in lib/supabase.ts for the production project).

## Building for stores

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Configure EAS project
eas build:configure

# Build for Android (APK / AAB)
eas build --platform android

# Build for iOS (IPA)
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## Subscription Policy (Apple reader app exemption)

All subscription purchases are handled on the **web** at hayyamed.pro — no in-app purchases. This qualifies under Apple's reader app exemption (App Store Review Guideline 3.1.3a), avoiding the 30% Apple commission. Paddle web checkout supports Apple Pay natively on Safari.
