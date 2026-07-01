// ─────────────────────────────────────────────────────────────────────────────
// Demo data seeder for Hayya Med PRO — populates the Government portal + Master
// admin with realistic data so the reports/analytics can be demonstrated.
//
//   node --env-file=.env.local scripts/demo-data.mjs         # seed
//   node --env-file=.env.local scripts/demo-data.mjs wipe    # remove all demo data
//
// Everything created is TAGGED for clean removal:
//   • auth logins  → email domain  @hayyademo.pro
//   • organizations / training_providers → name prefixed "[DEMO] "
// Deleting the auth users cascades their profile, wallet, employer link and
// enrollments; deleting the tagged orgs/providers cascades members + courses.
//
// Writes to whatever NEXT_PUBLIC_SUPABASE_URL points at (currently PROD).
// ─────────────────────────────────────────────────────────────────────────────
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error("Missing Supabase env vars"); process.exit(1); }
const sb = createClient(URL, KEY, { auth: { persistSession: false } });

const EMAIL_DOMAIN = "hayyademo.pro";
const DEMO_PREFIX = "[DEMO] ";
const DEMO_PASSWORD = "Demo@2025!";
const COUNTRY = "Qatar";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── WIPE ─────────────────────────────────────────────────────────────────────
async function wipe() {
  console.log("Wiping demo data from", URL, "\n");

  // 1. delete tagged auth users (cascades profile, wallet, link, enrollment, member)
  let deleted = 0, page = 1;
  for (;;) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error) { console.error("listUsers:", error.message); break; }
    const users = data?.users ?? [];
    if (users.length === 0) break;
    for (const u of users) {
      if ((u.email ?? "").endsWith("@" + EMAIL_DOMAIN)) {
        const { error: dErr } = await sb.auth.admin.deleteUser(u.id);
        if (dErr) console.error("  delete", u.email, dErr.message);
        else { deleted++; if (deleted % 10 === 0) console.log(`  deleted ${deleted} users…`); }
      }
    }
    if (users.length < 200) break;
    page++;
  }
  console.log(`✓ deleted ${deleted} demo auth users`);

  // 2. tagged training providers (cascades courses + enrollments)
  const { data: provs } = await sb.from("training_providers").select("id").ilike("name", DEMO_PREFIX + "%");
  if (provs?.length) {
    await sb.from("training_providers").delete().in("id", provs.map((p) => p.id));
    console.log(`✓ deleted ${provs.length} demo training providers (+ their courses)`);
  }

  // 3. tagged organizations (cascades members)
  const { data: orgs } = await sb.from("organizations").select("id").ilike("name", DEMO_PREFIX + "%");
  if (orgs?.length) {
    await sb.from("organizations").delete().in("id", orgs.map((o) => o.id));
    console.log(`✓ deleted ${orgs.length} demo organizations`);
  }
  console.log("\nDone.");
}

// ── helpers ──────────────────────────────────────────────────────────────────
async function createLogin(email, fullName) {
  const { data, error } = await sb.auth.admin.createUser({
    email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName, demo: true },
  });
  if (error) throw new Error(`createUser ${email}: ${error.message}`);
  return data.user.id;
}

function licenseExpiryFor(i) {
  const d = new Date(2026, 6, 1); // fixed base (2026-07-01) — no Date.now for determinism
  if (i % 6 === 0) d.setDate(d.getDate() - 40);      // expired
  else if (i % 6 === 1) d.setDate(d.getDate() + 20); // expiring ≤30d
  else if (i % 6 === 2) return null;                 // no license date
  else d.setFullYear(d.getFullYear() + 2);           // comfortably valid
  return d.toISOString().slice(0, 10);
}

// ── SEED ─────────────────────────────────────────────────────────────────────
async function seed() {
  console.log("Seeding demo data into", URL, "\n");

  // Guard against duplicate seeding
  const { data: existing } = await sb.from("organizations").select("id").ilike("name", DEMO_PREFIX + "%").limit(1);
  if (existing?.length) {
    console.error("Demo data already present. Run `... demo-data.mjs wipe` first."); process.exit(1);
  }

  // 1. HOSPITALS / MEDICAL CENTERS (10)
  const hospitalNames = [
    ["Hamad General Hospital", "hospital"], ["Sidra Medicine", "hospital"],
    ["Al Wakra Hospital", "hospital"], ["The Cuban Hospital", "hospital"],
    ["Aspetar Orthopaedic Hospital", "hospital"], ["Doha Clinic Hospital", "hospital"],
    ["Al Ahli Hospital", "hospital"], ["Naufar Wellness Center", "clinic"],
    ["Qatar Rehabilitation Institute", "clinic"], ["Primary Health Care Corporation", "clinic"],
  ];
  const hospitals = [];
  for (const [name, type] of hospitalNames) {
    const { data, error } = await sb.from("organizations")
      .insert({ name: DEMO_PREFIX + name, type, country: COUNTRY, city: "Doha", verified: true })
      .select("id").single();
    if (error) throw new Error(`org ${name}: ${error.message}`);
    hospitals.push(data.id);
    // employer admin login for the medical center
    const slug = name.toLowerCase().replace(/[^a-z]+/g, "").slice(0, 14);
    const adminId = await createLogin(`demo-emp-${slug}@${EMAIL_DOMAIN}`, `${name} Admin`);
    await sb.from("organization_members").insert({ organization_id: data.id, auth_id: adminId, role: "employer_admin" });
    await sb.from("professional_profiles").update({ full_name: `${name} Admin`, onboarding_complete: true, onboarding_step: 7 }).eq("auth_id", adminId);
  }
  console.log(`✓ ${hospitals.length} hospitals/medical centers (+ employer admin logins)`);

  // 2. TRAINING PROVIDERS (6)
  const providerDefs = [
    ["Qatar Medical Education Institute", true, "QCHP"],
    ["Gulf CPD Academy", true, "QCHP"],
    ["MENA Health Learning", false, null],
    ["Doha Clinical Skills Center", true, "QCHP"],
    ["Weill Cornell Medicine-Qatar CME", true, "ACCME"],
    ["HealthEd GCC", false, null],
  ];
  const providers = [];
  for (const [name, accredited, accreditor] of providerDefs) {
    const slug = name.toLowerCase().replace(/[^a-z]+/g, "").slice(0, 14);
    const ownerId = await createLogin(`demo-prov-${slug}@${EMAIL_DOMAIN}`, `${name} Admin`);
    await sb.from("professional_profiles").update({ full_name: `${name} Admin`, onboarding_complete: true, onboarding_step: 7 }).eq("auth_id", ownerId);
    const { data, error } = await sb.from("training_providers")
      .insert({ name: DEMO_PREFIX + name, description: `${name} — accredited CME/CPD provider (demo).`, country_code: "QA", is_accredited: accredited, accreditor, status: "active", contact_email: `info-${slug}@${EMAIL_DOMAIN}`, created_by: ownerId })
      .select("id").single();
    if (error) throw new Error(`provider ${name}: ${error.message}`);
    providers.push(data.id);
  }
  console.log(`✓ ${providers.length} training providers (+ provider admin logins)`);

  // 3. COURSES (15) — spread across providers, all QA + active
  const courseDefs = [
    ["Advanced Cardiac Life Support (ACLS)", "Emergency Medicine", 12, "in_person"],
    ["ECG Interpretation Masterclass", "Cardiology", 8, "online"],
    ["Sepsis Recognition & Management", "Critical Care", 6, "online"],
    ["Diabetes Management Update 2026", "Endocrinology", 10, "hybrid"],
    ["Infection Prevention & Control", "Public Health", 5, "online"],
    ["Pediatric Emergency Essentials", "Pediatrics", 9, "in_person"],
    ["Radiology for Non-Radiologists", "Radiology", 7, "online"],
    ["Wound Care & Management", "Nursing", 6, "hybrid"],
    ["Clinical Pharmacology Refresher", "Pharmacy", 8, "online"],
    ["Mental Health First Aid", "Psychiatry", 5, "in_person"],
    ["Surgical Site Infection Prevention", "Surgery", 6, "online"],
    ["Nutrition in Chronic Disease", "Dietetics", 7, "online"],
    ["Physiotherapy After Stroke", "Rehabilitation", 9, "in_person"],
    ["Laboratory Quality & Biosafety", "Laboratory", 6, "online"],
    ["Medical Ethics & QCHP Compliance", "Professionalism", 4, "hybrid"],
  ];
  let courseCount = 0;
  for (let i = 0; i < courseDefs.length; i++) {
    const [title, category, credits, mode] = courseDefs[i];
    const provider_id = providers[i % providers.length];
    const start = new Date(2026, 6 + (i % 4), 5 + i).toISOString().slice(0, 10);
    const end = new Date(2026, 6 + (i % 4), 6 + i).toISOString().slice(0, 10);
    const { error } = await sb.from("courses").insert({
      provider_id, title, description: `${title} — CME-accredited activity (demo).`,
      category, credits, credit_type: "CME", delivery_mode: mode, duration_hours: credits,
      price_usd: i % 3 === 0 ? 0 : 75 + i * 10, is_free: i % 3 === 0,
      country_codes: ["QA"], professions: ["all"], status: "active",
      start_date: start, end_date: end,
    });
    if (error) throw new Error(`course ${title}: ${error.message}`);
    courseCount++;
  }
  console.log(`✓ ${courseCount} courses (CME) across providers`);

  // 4. PROFESSIONALS with compliance spread ────────────────────────────────────
  // status codes: 'C' compliant, 'A' at_risk, 'N' non_compliant, '_' no wallet (No Data)
  const DOC_SPREAD = "CCCCCAAAANNNNN____".split("");    // 5C 4A 5N 4_ = 18
  const ALLIED_SPREAD = "CCCCCCCAAAAAANNNNNNN_____".split(""); // 7C 6A 7N 5_ = 25

  const docNames = ["Ahmed Al-Sulaiti","Fatima Khan","Omar Haddad","Layla Nasser","Yousef Ali","Mariam Saleh","Khalid Mansour","Noor Abdullah","Hassan Rashid","Aisha Farouk","Tariq Aziz","Huda Kamal","Bilal Younis","Salma Darwish","Zaid Hakim","Reem Jassim","Faisal Otaibi","Dana Qassem"];
  const docSpecialties = ["Cardiology","Internal Medicine","Pediatrics","General Surgery","Emergency Medicine","Radiology","Psychiatry","Family Medicine","Anesthesiology","Orthopedics","Neurology","Oncology","Dermatology","Obstetrics & Gynaecology","Urology","ENT","Ophthalmology","Nephrology"];

  const alliedProfessions = ["Physiotherapist","Dietitian","Radiologist","Lab Technician"];
  const alliedNames = ["Sara Habib","Ali Zayed","Mona Fahad","Jamal Idris","Rania Sami","Nabil Hariri","Lina Sabbagh","Waleed Amir","Hana Yusuf","Sami Khoury","Dalia Nazar","Kareem Fouad","Amani Talib","Ziad Nseir","Yara Barakat","Omar Sultan","Farah Deeb","Hadi Salim","Nour Zahra","Rami Aoun","Maha Sroor","Tamer Ghali","Israa Wael","Basel Rida","Lubna Emad"];

  let created = 0, wallets = 0;
  async function makePro(email, name, profession, specialty, status, idx) {
    const authId = await createLogin(email, name);
    await sb.from("professional_profiles").update({
      full_name: name, profession, specialty,
      country_of_residence: COUNTRY,
      license_number: "QCHP-" + (100000 + idx),
      licensing_authority: "QCHP",
      license_expiry: licenseExpiryFor(idx),
      onboarding_complete: true, onboarding_step: 7, profile_completion_pct: 100,
    }).eq("auth_id", authId);

    // employer link (approved) to a rotating hospital
    await sb.from("employer_link_requests").insert({
      professional_id: authId, organization_id: hospitals[idx % hospitals.length],
      status: "approved", resolved_at: new Date(2026, 5, 1).toISOString(),
    });
    created++;

    // wallet → compliance status (skip for '_' = No Data)
    if (status !== "_") {
      const required = profession.startsWith("Doctor") ? 80 : 60;
      const completed = status === "C" ? required + 5 : status === "A" ? Math.round(required * 0.75) : Math.round(required * 0.3);
      const { error } = await sb.from("cme_wallets").insert({
        professional_id: authId, country: COUNTRY, profession, specialty,
        required_credits: required, completed_credits: completed,
        renewal_cycle_years: 2, cycle_start_date: "2025-01-01", cycle_end_date: "2026-12-31",
        is_primary: true,
      });
      if (error) throw new Error(`wallet ${email}: ${error.message}`);
      wallets++;
    }
    if (created % 10 === 0) console.log(`  …${created} professionals`);
  }

  for (let i = 0; i < 18; i++) {
    await makePro(`demo-doc${String(i + 1).padStart(2, "0")}@${EMAIL_DOMAIN}`, docNames[i], "Doctor (MD/MBBS)", docSpecialties[i], DOC_SPREAD[i], i + 1);
  }
  for (let i = 0; i < 25; i++) {
    const prof = alliedProfessions[i % alliedProfessions.length];
    await makePro(`demo-allied${String(i + 1).padStart(2, "0")}@${EMAIL_DOMAIN}`, alliedNames[i], prof, "—", ALLIED_SPREAD[i], 100 + i);
  }
  console.log(`✓ ${created} professionals (${wallets} with CME wallets, ${created - wallets} No-Data)`);

  console.log("\n─────────────────────────────────────────────");
  console.log("Demo seed complete. Login for any demo account:");
  console.log(`  password: ${DEMO_PASSWORD}`);
  console.log("  e.g. demo-doc01@" + EMAIL_DOMAIN + " (a Doctor)");
  console.log("Government portal reports for jurisdiction QA are now populated.");
}

const mode = process.argv[2];
try {
  if (mode === "wipe") await wipe();
  else await seed();
} catch (e) {
  console.error("\n✗ FAILED:", e.message);
  process.exit(1);
}
