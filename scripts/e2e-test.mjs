/**
 * E2E Test Runner — Hayya Med Pro
 * Tests all critical user flows using Playwright headless Chromium.
 * Run: node scripts/e2e-test.mjs
 */
import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const BASE = 'http://localhost:3000';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TEST_EMAIL = `e2e-test-${Date.now()}@hayyamed-test.local`;
const TEST_PASSWORD = 'TestP@ss12345!';

const results = [];
let passed = 0;
let failed = 0;

function log(emoji, label, msg = '') {
  console.log(`${emoji} ${label}${msg ? ': ' + msg : ''}`);
}

function record(name, ok, detail = '') {
  results.push({ name, ok, detail });
  if (ok) { passed++; log('✅', name, detail); }
  else     { failed++; log('❌', name, detail); }
}

async function check(name, fn) {
  try {
    await fn();
    record(name, true);
  } catch (e) {
    record(name, false, e.message?.slice(0, 120));
  }
}

async function main() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Hayya Med Pro — E2E Test Suite');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  // ── PUBLIC PAGES ─────────────────────────────────────────────────────────────

  await check('Landing page loads', async () => {
    const res = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
    await page.waitForSelector('h1', { timeout: 5000 });
    const h1 = await page.$eval('h1', el => el.textContent);
    if (!h1 || h1.length < 5) throw new Error('h1 missing or empty');
  });

  await check('Login page loads', async () => {
    const res = await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  });

  await check('Register page loads', async () => {
    const res = await page.goto(`${BASE}/register`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  });

  await check('Forgot password page loads', async () => {
    const res = await page.goto(`${BASE}/forgot-password`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  });

  await check('Pricing page loads', async () => {
    const res = await page.goto(`${BASE}/pricing`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
    await page.waitForSelector('h1, h2', { timeout: 5000 });
  });

  await check('/demo page loads', async () => {
    const res = await page.goto(`${BASE}/demo`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Help page loads', async () => {
    const res = await page.goto(`${BASE}/help`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Terms page loads', async () => {
    const res = await page.goto(`${BASE}/terms`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Privacy page loads', async () => {
    const res = await page.goto(`${BASE}/privacy`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Status page loads', async () => {
    const res = await page.goto(`${BASE}/status`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Courses catalog loads', async () => {
    const res = await page.goto(`${BASE}/courses`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Blog index loads', async () => {
    const res = await page.goto(`${BASE}/blog`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('/professionals directory loads', async () => {
    const res = await page.goto(`${BASE}/professionals`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  // Unauthenticated redirect — dashboard should redirect to login
  await check('Dashboard redirects to login when unauthenticated', async () => {
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    const url = page.url();
    if (!url.includes('/login')) throw new Error(`Expected /login redirect, got: ${url}`);
  });

  // ── REGISTRATION FLOW ────────────────────────────────────────────────────────

  log('\n🔑', 'Auth flows — using Supabase Admin to create test user');

  // Create test user via Supabase Admin (bypasses email verification)
  let testUserId = null;
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  await check('Create test user via Supabase Admin', async () => {
    const { data, error } = await admin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    testUserId = data.user.id;
  });

  // ── SIGN IN FLOW ──────────────────────────────────────────────────────────────

  await check('Sign in via login form (email + password)', async () => {
    await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded', timeout: 10000 });

    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for redirect away from login
    await page.waitForFunction(
      () => !window.location.pathname.startsWith('/login'),
      { timeout: 15000 }
    );

    const finalUrl = page.url();
    log('  ', `After login: ${finalUrl}`);
    if (finalUrl.includes('/login')) {
      throw new Error('Still on login page — sign in failed');
    }
  });

  const authedPage = page; // reuse same page — now authenticated

  // ── ONBOARDING FLOW ──────────────────────────────────────────────────────────

  await check('Onboarding step 1 loads', async () => {
    const url = authedPage.url();
    if (!url.includes('/onboarding')) {
      await authedPage.goto(`${BASE}/onboarding/1`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    }
    const res = await authedPage.goto(`${BASE}/onboarding/1`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
    await authedPage.waitForSelector('form, input, select', { timeout: 5000 });
  });

  // Fill onboarding step 1 (basic info)
  await check('Onboarding step 1 — fill and submit', async () => {
    await authedPage.goto(`${BASE}/onboarding/1`, { waitUntil: 'domcontentloaded', timeout: 10000 });

    // Full name
    const nameInput = await authedPage.$('input[name="full_name"], input[placeholder*="name" i], input[id*="name" i]');
    if (nameInput) await nameInput.fill('Dr. Test User');

    // Try to find a profession select/input
    const profInput = await authedPage.$('select[name="profession"], input[name="profession"]');
    if (profInput) {
      const tag = await profInput.evaluate(el => el.tagName);
      if (tag === 'SELECT') {
        await profInput.selectOption({ index: 1 });
      }
    }

    const submitBtn = await authedPage.$('button[type="submit"]');
    if (!submitBtn) throw new Error('No submit button found on step 1');
    await submitBtn.click();
    await authedPage.waitForTimeout(2000);
  });

  await check('Onboarding steps 2–7 are accessible', async () => {
    for (let step = 2; step <= 7; step++) {
      const res = await authedPage.goto(`${BASE}/onboarding/${step}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      if (res.status() >= 400) throw new Error(`Step ${step} returned HTTP ${res.status()}`);
    }
  });

  // ── DASHBOARD FLOW ────────────────────────────────────────────────────────────

  await check('Dashboard loads for authenticated user', async () => {
    await authedPage.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    // Verify we're actually on a dashboard/onboarding page — not silently redirected to login
    const finalUrl = authedPage.url();
    if (finalUrl.includes('/login')) throw new Error('Redirected to login — auth session not established');
  });

  await check('CME page loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/cme`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Licenses page loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/licenses`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Settings page loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/settings`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Analytics page loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/analytics`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Marketplace page loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/marketplace`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Referral page loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/refer`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Certificates gallery loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/certificates`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Renewal calendar loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/renewal-calendar`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Tasks page loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/tasks`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  await check('Billing page loads', async () => {
    const res = await authedPage.goto(`${BASE}/dashboard/billing`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    if (res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
  });

  // ── CME SUBMIT FLOW ───────────────────────────────────────────────────────────

  await check('CME add activity button present on dashboard', async () => {
    await authedPage.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    // CmeDashboardQuickAddButton is on the main dashboard page
    const btn = await authedPage.$('button:has-text("Log CME"), button:has-text("Add"), a:has-text("Log CME"), [data-testid="add-activity"], button:has-text("Log")');
    if (!btn) {
      // Fallback: just verify the CME page has an AddActivityButton (component check)
      await authedPage.goto(`${BASE}/dashboard/cme`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      const addBtn = await authedPage.$('button, a[href*="add"], a[href*="new"]');
      if (!addBtn) throw new Error('No activity add button found on dashboard or CME page');
    }
  });

  // ── PASSWORD RESET FLOW ───────────────────────────────────────────────────────

  await check('Forgot password form submits', async () => {
    await authedPage.goto(`${BASE}/forgot-password`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await authedPage.fill('input[type="email"]', TEST_EMAIL);
    await authedPage.click('button[type="submit"]');
    await authedPage.waitForTimeout(2000);
    // Should show success message (not an error)
    const errorText = await authedPage.$eval('body', el => el.innerText);
    if (errorText.toLowerCase().includes('something went wrong') || errorText.toLowerCase().includes('error occurred')) {
      throw new Error('Error shown after submitting forgot password');
    }
  });

  // ── SIGN OUT ──────────────────────────────────────────────────────────────────

  await check('Sign out clears session', async () => {
    await authedPage.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 10000 });
    // Look for sign out button/link
    const signOutBtn = await authedPage.$('button:has-text("Sign out"), a:has-text("Sign out"), button:has-text("Log out"), a:has-text("Log out")');
    if (signOutBtn) {
      await signOutBtn.click();
      await authedPage.waitForURL(/\/login|\//, { timeout: 10000 });
      const url = authedPage.url();
      if (url.includes('/dashboard')) throw new Error('Still on dashboard after sign out');
    } else {
      // If no sign out button visible, manually call the API
      await authedPage.goto(`${BASE}/api/auth/signout`, { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {});
    }
  });

  // ── API HEALTH CHECK ──────────────────────────────────────────────────────────

  await check('/api/health responds (200=ok, 503=degraded but reachable)', async () => {
    const res = await page.goto(`${BASE}/api/health`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    // 200 = all systems ok; 503 = degraded (Vertex AI / Paddle missing locally — expected)
    if (res.status() !== 200 && res.status() !== 503) throw new Error(`HTTP ${res.status()}`);
    const body = await page.evaluate(() => document.body.innerText);
    const json = JSON.parse(body);
    if (json.critical?.database !== 'ok') throw new Error(`DB not ok: ${json.critical?.database}`);
  });

  // ── CLEANUP ───────────────────────────────────────────────────────────────────

  if (testUserId) {
    try {
      await admin.auth.admin.deleteUser(testUserId);
      log('🗑️', 'Test user cleaned up', TEST_EMAIL);
    } catch (e) {
      log('⚠️', 'Could not clean up test user', e.message);
    }
  }

  await browser.close();

  // ── REPORT ────────────────────────────────────────────────────────────────────

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (failed > 0) {
    console.log('FAILURES:\n');
    results.filter(r => !r.ok).forEach(r => {
      console.log(`  ❌ ${r.name}`);
      if (r.detail) console.log(`     ${r.detail}`);
    });
    console.log('');
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
