export const metadata = { title: "Privacy Policy — Hayya Med PRO" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8">
          <a href="/" className="text-[#1a56a0] text-sm hover:underline">← Hayya Med PRO</a>
        </div>
        <h1 className="text-3xl font-bold text-[#111] mb-2">Privacy Policy</h1>
        <p className="text-[#64748b] text-sm mb-10">Last updated: 10 June 2026</p>

        <div className="bg-white rounded-xl border border-[#e2e8f0] p-8 space-y-8 text-sm text-[#374151] leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">1. Introduction</h2>
            <p>Hayya Med PRO (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share information when you use our platform at <a href="https://pro.hayyamed.pro" className="text-[#1a56a0] hover:underline">pro.hayyamed.pro</a>.</p>
            <p className="mt-2">We comply with Qatar&apos;s Personal Data Privacy Protection Law (Law No. 13 of 2016) (&ldquo;Qatar PDPL&rdquo;) and applicable GCC data protection regulations.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">2. Data We Collect</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-[#111]">Account Information</p>
                <p className="mt-1">Email address, full name, date of birth, nationality, and password (hashed — never stored in plain text).</p>
              </div>
              <div>
                <p className="font-medium text-[#111]">Professional Information</p>
                <p className="mt-1">Profession, specialty, license number, licensing authority, license expiry date, and employer/organization affiliation.</p>
              </div>
              <div>
                <p className="font-medium text-[#111]">CME and Compliance Data</p>
                <p className="mt-1">CME activity records, credit totals, activity certificates (stored encrypted), and compliance status history.</p>
              </div>
              <div>
                <p className="font-medium text-[#111]">Usage Data</p>
                <p className="mt-1">Pages visited, features used, and session duration — collected via product analytics to improve the service.</p>
              </div>
              <div>
                <p className="font-medium text-[#111]">Payment Data</p>
                <p className="mt-1">Subscription and billing information is processed by Paddle (our payment provider). We do not store full payment card details.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>Provide and operate the CME tracking and licensing readiness platform</li>
              <li>Calculate compliance status against regulatory authority requirements</li>
              <li>Send license expiry and CME deadline reminders (push and email)</li>
              <li>Enable employers to view your compliance status (only with your consent via privacy settings)</li>
              <li>Process subscription payments and manage your account</li>
              <li>Improve the platform through anonymized usage analytics</li>
              <li>Comply with legal obligations and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">4. Legal Basis for Processing</h2>
            <p>We process your personal data on the following legal bases under the Qatar PDPL:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Contract performance</strong> — to provide the service you have subscribed to</li>
              <li><strong>Legitimate interests</strong> — to improve the platform and prevent fraud</li>
              <li><strong>Consent</strong> — for optional features such as employer visibility and marketing communications</li>
              <li><strong>Legal obligation</strong> — to comply with applicable laws and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">5. Data Sharing</h2>
            <p>We do not sell your personal data. We share data only in the following circumstances:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Employers</strong> — only the compliance data fields you explicitly enable in your privacy settings, under a signed Data Processing Agreement</li>
              <li><strong>Service providers</strong> — Supabase (database hosting), GCP Cloud Run (application hosting), Postmark (email delivery), Paddle (payments), and Anthropic (AI features) — all under data processing agreements</li>
              <li><strong>Legal requirements</strong> — if required by Qatari or applicable law, court order, or government authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">6. Data Storage and Security</h2>
            <p>Your data is stored on servers located in the AWS ap-southeast-2 (Sydney) region via Supabase, and processed on GCP me-central1 (Doha, Qatar). We implement the following security measures:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Encryption in transit (TLS 1.2+) and at rest (AES-256)</li>
              <li>Row-Level Security (RLS) — each user can only access their own data</li>
              <li>Certificate files stored in a private bucket with signed URLs (1-hour expiry)</li>
              <li>All administrative actions logged in an append-only audit log</li>
              <li>Secrets managed via GCP Secret Manager — never stored in application code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">7. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Audit logs are retained for 7 years as required for compliance</li>
              <li>Financial transaction records are retained as required by applicable tax law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">8. Your Rights</h2>
            <p>Under the Qatar PDPL and applicable regulations, you have the right to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong>Access</strong> — request a copy of your personal data</li>
              <li><strong>Correction</strong> — request correction of inaccurate data</li>
              <li><strong>Deletion</strong> — request deletion of your account and personal data</li>
              <li><strong>Portability</strong> — request your data in a machine-readable format</li>
              <li><strong>Withdraw consent</strong> — opt out of optional data processing at any time via Settings</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <a href="mailto:privacy@hayyamed.pro" className="text-[#1a56a0] hover:underline">privacy@hayyamed.pro</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">9. Cookies and Tracking</h2>
            <p>We use session cookies solely to maintain your authenticated session. We use anonymized product analytics (no cross-site tracking). We do not use advertising cookies or share data with advertising networks.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">10. AI Features</h2>
            <p>Some platform features use AI powered by Anthropic Claude. When AI features are used, only anonymized identifiers (never your name or license number) are included in AI processing requests. All AI interactions are logged for audit purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">11. Changes to This Policy</h2>
            <p>We may update this Privacy Policy. We will notify you of material changes by email at least 14 days before they take effect. The current version is always available at <a href="/privacy" className="text-[#1a56a0] hover:underline">pro.hayyamed.pro/privacy</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111] mb-3">12. Contact</h2>
            <p>For privacy questions or to exercise your rights:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Email: <a href="mailto:privacy@hayyamed.pro" className="text-[#1a56a0] hover:underline">privacy@hayyamed.pro</a></li>
              <li>General support: <a href="mailto:support@hayyamed.pro" className="text-[#1a56a0] hover:underline">support@hayyamed.pro</a></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
