// @ts-nocheck — @react-pdf/renderer has known type incompatibilities with React 19 JSX types
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 50, color: "#111827", backgroundColor: "#ffffff" },

  // Outer border frame
  frame: { borderWidth: 3, borderColor: "#1a56a0", borderRadius: 6, padding: 32, flex: 1 },
  innerFrame: { borderWidth: 1, borderColor: "#bfdbfe", borderRadius: 4, padding: 24, flex: 1, alignItems: "center" },

  // Header
  brandRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  brand: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#1a56a0", letterSpacing: 1 },
  docType: { fontSize: 9, color: "#64748b", letterSpacing: 2, textAlign: "center", marginBottom: 16 },

  divider: { width: 80, height: 2, backgroundColor: "#1a56a0", marginBottom: 16 },

  // Title
  certTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#111827", textAlign: "center", marginBottom: 4 },
  certSubtitle: { fontSize: 11, color: "#64748b", textAlign: "center", marginBottom: 24 },

  // Status badge
  statusBadge: { paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20, marginBottom: 24 },
  statusText: { fontSize: 13, fontFamily: "Helvetica-Bold", letterSpacing: 1 },

  // Professional details section
  profBox: { backgroundColor: "#f8fafc", borderRadius: 6, padding: 20, width: "100%", marginBottom: 20 },
  profRow: { flexDirection: "row", marginBottom: 8 },
  profLabel: { width: 140, fontSize: 8, color: "#64748b", fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  profValue: { flex: 1, fontSize: 10, color: "#111827", fontFamily: "Helvetica-Bold" },

  // Credits box
  creditsRow: { flexDirection: "row", justifyContent: "center", gap: 32, marginBottom: 20, width: "100%" },
  creditCard: { alignItems: "center", backgroundColor: "#eff6ff", borderRadius: 8, padding: 16, flex: 1 },
  creditNum: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "#1a56a0" },
  creditLabel: { fontSize: 8, color: "#64748b", marginTop: 4, textAlign: "center" },

  // Cycle
  cycleText: { fontSize: 9, color: "#64748b", textAlign: "center", marginBottom: 20 },

  // Verification
  verifyBox: { backgroundColor: "#f0f7ff", borderRadius: 4, padding: 10, width: "100%", marginBottom: 20 },
  verifyLabel: { fontSize: 8, color: "#64748b", fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 },
  verifyUrl: { fontSize: 9, color: "#1a56a0", fontFamily: "Helvetica-Bold" },

  // Footer
  footer: { position: "absolute", bottom: 50, left: 82, right: 82, borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 10, alignItems: "center" },
  footerLine1: { fontSize: 8, color: "#64748b", textAlign: "center", marginBottom: 3 },
  footerLine2: { fontSize: 7, color: "#64748b", textAlign: "center" },
});

type Props = {
  profile: Record<string, unknown>;
  wallet: Record<string, unknown>;
  generatedAt: string;
  verificationUrl: string;
};

export function ComplianceCertificateDocument({ profile, wallet, generatedAt, verificationUrl }: Props) {
  const completed = Number(wallet.completed_credits ?? 0);
  const required  = Number(wallet.required_credits ?? 50);
  const pct       = required > 0 ? Math.min(Math.round((completed / required) * 100), 100) : 0;
  const status    = String(wallet.compliance_status ?? "at_risk").replace("_", " ").toUpperCase();
  const isCompliant = status === "COMPLIANT";

  const genDate = new Date(generatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const cycleStart = wallet.cycle_start_date ? String(wallet.cycle_start_date) : "—";
  const cycleEnd   = wallet.cycle_end_date   ? String(wallet.cycle_end_date)   : "—";

  return (
    <Document title="Hayya Med Pro — Compliance Certificate" author="Hayya Med Pro">
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.frame}>
          <View style={styles.innerFrame}>

            {/* Brand */}
            <View style={styles.brandRow}>
              <Text style={styles.brand}>HAYYA MED PRO</Text>
            </View>
            <Text style={styles.docType}>OFFICIAL COMPLIANCE CERTIFICATE</Text>
            <View style={styles.divider} />

            {/* Title */}
            <Text style={styles.certTitle}>Certificate of Compliance</Text>
            <Text style={styles.certSubtitle}>This certificate confirms CME/CPD compliance for the cycle period below</Text>

            {/* Status badge */}
            <View style={[styles.statusBadge, { backgroundColor: isCompliant ? "#dcfce7" : "#fff7ed" }]}>
              <Text style={[styles.statusText, { color: isCompliant ? "#16a34a" : "#d97706" }]}>
                {isCompliant ? "✓ COMPLIANT" : `◉ ${status}`}
              </Text>
            </View>

            {/* Professional details */}
            <View style={styles.profBox}>
              <View style={styles.profRow}>
                <Text style={styles.profLabel}>Full Name</Text>
                <Text style={styles.profValue}>{String(profile.full_name ?? "—")}</Text>
              </View>
              <View style={styles.profRow}>
                <Text style={styles.profLabel}>Profession</Text>
                <Text style={styles.profValue}>{String(profile.profession ?? "—")}</Text>
              </View>
              <View style={styles.profRow}>
                <Text style={styles.profLabel}>Specialty</Text>
                <Text style={styles.profValue}>{String(profile.specialty ?? "—")}</Text>
              </View>
              <View style={styles.profRow}>
                <Text style={styles.profLabel}>License Number</Text>
                <Text style={styles.profValue}>{String(profile.license_number ?? "—")}</Text>
              </View>
              <View style={[styles.profRow, { marginBottom: 0 }]}>
                <Text style={styles.profLabel}>Licensing Authority</Text>
                <Text style={styles.profValue}>{String(profile.licensing_authority ?? "—")}</Text>
              </View>
            </View>

            {/* Credits */}
            <View style={styles.creditsRow}>
              <View style={styles.creditCard}>
                <Text style={styles.creditNum}>{completed}</Text>
                <Text style={styles.creditLabel}>Credits Completed</Text>
              </View>
              <View style={styles.creditCard}>
                <Text style={styles.creditNum}>{required}</Text>
                <Text style={styles.creditLabel}>Credits Required</Text>
              </View>
              <View style={styles.creditCard}>
                <Text style={[styles.creditNum, { color: pct >= 100 ? "#16a34a" : "#d97706" }]}>{pct}%</Text>
                <Text style={styles.creditLabel}>Completion Rate</Text>
              </View>
            </View>

            {/* Cycle period */}
            <Text style={styles.cycleText}>
              CME/CPD Cycle: {cycleStart} — {cycleEnd}
            </Text>

            {/* Verification URL */}
            <View style={styles.verifyBox}>
              <Text style={styles.verifyLabel}>Verification URL</Text>
              <Text style={styles.verifyUrl}>{verificationUrl}</Text>
            </View>

            {/* Generated date */}
            <Text style={{ fontSize: 8, color: "#64748b", textAlign: "center" }}>
              Issued: {genDate}
            </Text>

          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerLine1}>Hayya Med Pro · hayyamed.pro · This certificate is digitally issued and verifiable at the URL above.</Text>
          <Text style={styles.footerLine2}>
            Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities.
            Users must verify final requirements with their relevant regulatory body.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
