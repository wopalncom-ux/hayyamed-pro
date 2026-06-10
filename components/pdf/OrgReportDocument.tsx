// @ts-nocheck — @react-pdf/renderer has known type incompatibilities with React 19 JSX types
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 40, color: "#111827" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: "#1a56a0" },
  logo: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a56a0" },
  logoSub: { fontSize: 9, color: "#64748b", marginTop: 2 },
  headerRight: { fontSize: 9, color: "#64748b", textAlign: "right" },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: "#f8fafc", borderRadius: 6, padding: 10, alignItems: "center" },
  statNum: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a56a0" },
  statLabel: { fontSize: 7, color: "#64748b", marginTop: 2 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1a56a0", marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#e2e8f0", marginTop: 16 },
  table: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f1f5f9", padding: "7 10", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tableRow: { flexDirection: "row", padding: "6 10", borderBottomWidth: 1, borderBottomColor: "#f8fafc" },
  tableRowLast: { flexDirection: "row", padding: "6 10" },
  col1: { width: "28%", fontSize: 8 },
  col2: { width: "18%", fontSize: 8 },
  col3: { width: "18%", fontSize: 8 },
  col4: { width: "18%", fontSize: 8 },
  col5: { width: "18%", fontSize: 8, textAlign: "right" },
  colHeader: { fontFamily: "Helvetica-Bold", fontSize: 7, color: "#64748b" },
  compliant:     { color: "#16a34a", fontFamily: "Helvetica-Bold" },
  at_risk:       { color: "#d97706", fontFamily: "Helvetica-Bold" },
  non_compliant: { color: "#dc2626", fontFamily: "Helvetica-Bold" },
  unknown:       { color: "#94a3b8" },
  footer: { position: "absolute", bottom: 28, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: "#94a3b8", borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 6 },
});

type StaffRow = {
  name: string;
  profession: string;
  completedCredits: number | null;
  requiredCredits: number | null;
  complianceStatus: string;
  daysToExpiry: number | null;
};

type Props = {
  orgName: string;
  staff: StaffRow[];
  generatedAt: string;
};

export function OrgReportDocument({ orgName, staff, generatedAt }: Props) {
  const compliant = staff.filter((s) => s.complianceStatus === "compliant").length;
  const atRisk = staff.filter((s) => s.complianceStatus === "at_risk").length;
  const nonCompliant = staff.filter((s) => s.complianceStatus === "non_compliant").length;
  const expiring = staff.filter((s) => s.daysToExpiry !== null && s.daysToExpiry <= 30 && s.daysToExpiry >= 0).length;

  const statusLabel: Record<string, string> = {
    compliant: "Compliant",
    at_risk: "At Risk",
    non_compliant: "Non-Compliant",
    unknown: "No Data",
  };

  return (
    <Document title={`${orgName} — Compliance Report`} author="Hayya Med Pro">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Hayya Med Pro</Text>
            <Text style={styles.logoSub}>Organization Compliance Report — {orgName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Generated: {new Date(generatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</Text>
            <Text style={{ marginTop: 2 }}>Confidential — Employer Use Only</Text>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{staff.length}</Text>
            <Text style={styles.statLabel}>Total Staff</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: "#16a34a" }]}>{compliant}</Text>
            <Text style={styles.statLabel}>Compliant</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: "#d97706" }]}>{atRisk}</Text>
            <Text style={styles.statLabel}>At Risk</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: "#dc2626" }]}>{nonCompliant}</Text>
            <Text style={styles.statLabel}>Non-Compliant</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: expiring > 0 ? "#dc2626" : "#16a34a" }]}>{expiring}</Text>
            <Text style={styles.statLabel}>License ≤30d</Text>
          </View>
        </View>

        {/* Staff Table */}
        <Text style={styles.sectionTitle}>Staff Compliance Details ({staff.length} members)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.colHeader]}>NAME</Text>
            <Text style={[styles.col2, styles.colHeader]}>PROFESSION</Text>
            <Text style={[styles.col3, styles.colHeader]}>CME CREDITS</Text>
            <Text style={[styles.col4, styles.colHeader]}>STATUS</Text>
            <Text style={[styles.col5, styles.colHeader]}>EXPIRY</Text>
          </View>
          {staff.map((s, i) => (
            <View key={i} style={i === staff.length - 1 ? styles.tableRowLast : styles.tableRow}>
              <Text style={styles.col1}>{s.name}</Text>
              <Text style={styles.col2}>{s.profession}</Text>
              <Text style={styles.col3}>
                {s.completedCredits !== null ? `${s.completedCredits}/${s.requiredCredits}` : "Private"}
              </Text>
              <Text style={[styles.col4, styles[s.complianceStatus as keyof typeof styles] ?? styles.unknown]}>
                {statusLabel[s.complianceStatus] ?? "—"}
              </Text>
              <Text style={[styles.col5, s.daysToExpiry !== null && s.daysToExpiry <= 30 ? { color: "#dc2626" } : {}]}>
                {s.daysToExpiry === null ? "Private" : s.daysToExpiry < 0 ? "EXPIRED" : `${s.daysToExpiry}d`}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Hayya Med Pro · pro.hayyamed.com · {orgName}</Text>
          <Text>Only shows data where staff have given consent. Not a regulatory document.</Text>
        </View>
      </Page>
    </Document>
  );
}
