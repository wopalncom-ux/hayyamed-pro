// @ts-nocheck â€” @react-pdf/renderer has known type incompatibilities with React 19 JSX types
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 40, color: "#111827" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: "#1a56a0" },
  headerLeft: {},
  logo: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a56a0" },
  logoSub: { fontSize: 9, color: "#64748b", marginTop: 2 },
  headerRight: { fontSize: 9, color: "#64748b", textAlign: "right" },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1a56a0", marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: 140, color: "#64748b", fontSize: 9 },
  value: { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold" },
  walletBox: { backgroundColor: "#eff6ff", borderRadius: 6, padding: 16, flexDirection: "row", justifyContent: "space-around", marginBottom: 4 },
  walletStat: { alignItems: "center" },
  walletStatNum: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#1a56a0" },
  walletStatLabel: { fontSize: 8, color: "#64748b", marginTop: 2 },
  table: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f8fafc", padding: "8 10", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tableRow: { flexDirection: "row", padding: "7 10", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  tableRowLast: { flexDirection: "row", padding: "7 10" },
  col1: { width: "40%", fontSize: 9 },
  col2: { width: "20%", fontSize: 9 },
  col3: { width: "20%", fontSize: 9 },
  col4: { width: "20%", fontSize: 9, textAlign: "right" },
  colHeader: { fontFamily: "Helvetica-Bold", fontSize: 8, color: "#64748b" },
  badge: { fontSize: 8, color: "#16a34a", fontFamily: "Helvetica-Bold" },
  badgePending: { fontSize: 8, color: "#d97706", fontFamily: "Helvetica-Bold" },
  pendingNote: { fontSize: 8, color: "#92400e", backgroundColor: "#fff7ed", padding: "6 8", borderRadius: 4, marginBottom: 6 },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: "#94a3b8", borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 8 },
});

type Props = {
  profile: Record<string, unknown>;
  wallet: Record<string, unknown>;
  activities: Record<string, unknown>[];
  pendingActivities?: Record<string, unknown>[];
  generatedAt: string;
};

export function CmeReportDocument({ profile, wallet, activities, pendingActivities = [], generatedAt }: Props) {
  const pct = wallet.required_credits
    ? Math.min(Math.round(((wallet.completed_credits as number) / (wallet.required_credits as number)) * 100), 100)
    : 0;

  return (
    <Document title="CME Compliance Report" author="Hayya Med Pro">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logo}>Hayya Med Pro</Text>
            <Text style={styles.logoSub}>CME Compliance Report</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Generated: {new Date(generatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</Text>
            <Text style={{ marginTop: 2 }}>Confidential â€” For License Renewal Use</Text>
          </View>
        </View>

        {/* Professional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <View style={styles.row}><Text style={styles.label}>Full Name</Text><Text style={styles.value}>{String(profile.full_name ?? "â€”")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Profession</Text><Text style={styles.value}>{String(profile.profession ?? "â€”")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Specialty</Text><Text style={styles.value}>{String(profile.specialty ?? "â€”")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>License Number</Text><Text style={styles.value}>{String(profile.license_number ?? "â€”")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Licensing Authority</Text><Text style={styles.value}>{String(profile.licensing_authority ?? "â€”")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>License Expiry</Text><Text style={styles.value}>{String(profile.license_expiry ?? "â€”")}</Text></View>
        </View>

        {/* Wallet Summary */}
        {wallet.id && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CME Compliance Summary</Text>
            <View style={styles.walletBox}>
              <View style={styles.walletStat}>
                <Text style={styles.walletStatNum}>{String(wallet.completed_credits ?? 0)}</Text>
                <Text style={styles.walletStatLabel}>Completed Credits</Text>
              </View>
              <View style={styles.walletStat}>
                <Text style={styles.walletStatNum}>{String(wallet.required_credits ?? 50)}</Text>
                <Text style={styles.walletStatLabel}>Required Credits</Text>
              </View>
              <View style={styles.walletStat}>
                <Text style={styles.walletStatNum}>{pct}%</Text>
                <Text style={styles.walletStatLabel}>Completion</Text>
              </View>
              <View style={styles.walletStat}>
                <Text style={[styles.walletStatNum, { fontSize: 13, color: wallet.compliance_status === "compliant" ? "#16a34a" : "#d97706" }]}>
                  {String(wallet.compliance_status ?? "â€”").replace("_", " ").toUpperCase()}
                </Text>
                <Text style={styles.walletStatLabel}>Status</Text>
              </View>
            </View>
            <Text style={{ fontSize: 8, color: "#64748b", marginTop: 4 }}>
              Cycle: {String(wallet.cycle_start_date ?? "â€”")} to {String(wallet.cycle_end_date ?? "â€”")}
            </Text>
          </View>
        )}

        {/* Verified Activities Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verified CME Activities ({activities.length})</Text>
          {activities.length === 0 ? (
            <Text style={{ fontSize: 9, color: "#64748b", marginTop: 4 }}>No verified activities recorded. Activities submitted for verification will appear here once reviewed.</Text>
          ) : (
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.col1, styles.colHeader]}>ACTIVITY TITLE</Text>
                <Text style={[styles.col2, styles.colHeader]}>PROVIDER</Text>
                <Text style={[styles.col3, styles.colHeader]}>DATE</Text>
                <Text style={[styles.col4, styles.colHeader]}>CREDITS</Text>
              </View>
              {activities.map((a, i) => (
                <View key={String(a.id)} style={i === activities.length - 1 ? styles.tableRowLast : styles.tableRow}>
                  <Text style={styles.col1}>{String(a.title ?? "â€”")}</Text>
                  <Text style={styles.col2}>{String(a.provider ?? "â€”")}</Text>
                  <Text style={styles.col3}>{String(a.activity_date ?? "â€”")}</Text>
                  <Text style={[styles.col4, styles.badge]}>+{String(a.credits ?? 0)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Pending Activities (not yet counted toward compliance) */}
        {pendingActivities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Activities â€” Awaiting Verification ({pendingActivities.length})</Text>
            <Text style={styles.pendingNote}>
              The following activities have been submitted and are awaiting verification. They are NOT yet included in your verified credit total above and should NOT be counted for license renewal purposes until verified.
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.col1, styles.colHeader]}>ACTIVITY TITLE</Text>
                <Text style={[styles.col2, styles.colHeader]}>PROVIDER</Text>
                <Text style={[styles.col3, styles.colHeader]}>DATE</Text>
                <Text style={[styles.col4, styles.colHeader]}>CREDITS (PENDING)</Text>
              </View>
              {pendingActivities.map((a, i) => (
                <View key={String(a.id)} style={i === pendingActivities.length - 1 ? styles.tableRowLast : styles.tableRow}>
                  <Text style={styles.col1}>{String(a.title ?? "â€”")}</Text>
                  <Text style={styles.col2}>{String(a.provider ?? "â€”")}</Text>
                  <Text style={styles.col3}>{String(a.activity_date ?? "â€”")}</Text>
                  <Text style={[styles.col4, styles.badgePending]}>{String(a.credits ?? 0)} (pending)</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Hayya Med Pro Â· hayyamed.pro</Text>
          <Text>Verified credits counted. Pending activities shown for reference only â€” not for submission.</Text>
        </View>
      </Page>
    </Document>
  );
}
