// @ts-nocheck — @react-pdf/renderer has known type incompatibilities with React 19 JSX types
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const BLUE = "#1a56a0";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 40, color: "#111827", backgroundColor: "#ffffff" },
  headerBar: { backgroundColor: BLUE, borderRadius: 4, padding: "14 20", marginBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerLeft: {},
  authorityName: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  reportTitle: { fontSize: 9, color: "#bfdbfe", marginTop: 3 },
  headerRight: { alignItems: "flex-end" },
  powered: { fontSize: 8, color: "#bfdbfe" },
  generatedAt: { fontSize: 8, color: "#93c5fd", marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  statBox: { flex: 1, backgroundColor: "#f8fafc", borderRadius: 6, padding: "10 8", alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  statNum: { fontSize: 20, fontFamily: "Helvetica-Bold", color: BLUE },
  statLabel: { fontSize: 7, color: "#64748b", marginTop: 2, textAlign: "center" },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: BLUE, marginBottom: 6, marginTop: 14, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  table: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 },
  tableHeader: { flexDirection: "row", backgroundColor: "#f1f5f9", padding: "6 10", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tableRow: { flexDirection: "row", padding: "5 10", borderBottomWidth: 1, borderBottomColor: "#f8fafc" },
  tableRowLast: { flexDirection: "row", padding: "5 10" },
  col1: { width: "26%", fontSize: 8 },
  col2: { width: "17%", fontSize: 8 },
  col3: { width: "17%", fontSize: 8 },
  col4: { width: "17%", fontSize: 8 },
  col5: { width: "23%", fontSize: 8, textAlign: "right" },
  colHeader: { fontFamily: "Helvetica-Bold", fontSize: 7, color: "#64748b" },
  compliant:     { color: "#16a34a", fontFamily: "Helvetica-Bold" },
  at_risk:       { color: "#d97706", fontFamily: "Helvetica-Bold" },
  non_compliant: { color: "#dc2626", fontFamily: "Helvetica-Bold" },
  unknown:       { color: "#64748b" },
  disclaimer: { marginTop: 16, backgroundColor: "#f8fafc", borderRadius: 4, padding: "8 10", borderLeftWidth: 3, borderLeftColor: BLUE },
  disclaimerText: { fontSize: 7, color: "#64748b", lineHeight: 1.5 },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 7, color: "#94a3b8", borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 5 },
  professionSection: { marginTop: 8 },
  professionHeader: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#374151", backgroundColor: "#f8fafc", padding: "4 10", marginBottom: 0 },
});

type ProfRow = {
  name: string;
  profession: string;
  specialty: string;
  completedCredits: number | null;
  requiredCredits: number | null;
  complianceStatus: string;
  daysToExpiry: number | null;
};

type Props = {
  authorityName: string;
  authorityCode: string;
  jurisdictionCountry: string;
  generatedAt: string;
  professionals: ProfRow[];
};

const STATUS_LABEL: Record<string, string> = {
  compliant: "Compliant",
  at_risk: "At Risk",
  non_compliant: "Non-Compliant",
  unknown: "No Data",
};

export function GovernmentReportDocument({ authorityName, authorityCode, jurisdictionCountry, generatedAt, professionals }: Props) {
  const compliant = professionals.filter((p) => p.complianceStatus === "compliant").length;
  const atRisk = professionals.filter((p) => p.complianceStatus === "at_risk").length;
  const nonCompliant = professionals.filter((p) => p.complianceStatus === "non_compliant").length;
  const expiring = professionals.filter((p) => p.daysToExpiry !== null && p.daysToExpiry >= 0 && p.daysToExpiry <= 30).length;
  const complianceRate = professionals.length > 0 ? Math.round((compliant / professionals.length) * 100) : 0;

  // Group by profession
  const profMap = new Map<string, ProfRow[]>();
  for (const p of professionals) {
    const key = p.profession || "Other";
    if (!profMap.has(key)) profMap.set(key, []);
    profMap.get(key)!.push(p);
  }
  const groups = [...profMap.entries()].sort((a, b) => b[1].length - a[1].length);

  const dateStr = new Date(generatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <Document title={`${authorityCode} — Authority Compliance Report`} author="Hayya Med Pro">
      <Page size="A4" style={styles.page}>
        {/* Header with authority branding */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Text style={styles.authorityName}>{authorityCode} — Compliance Report</Text>
            <Text style={styles.reportTitle}>{authorityName} · {jurisdictionCountry}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.powered}>Powered by Hayya Med Pro</Text>
            <Text style={styles.generatedAt}>Generated: {dateStr}</Text>
          </View>
        </View>

        {/* Summary stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{professionals.length}</Text>
            <Text style={styles.statLabel}>Registered</Text>
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
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: complianceRate >= 80 ? "#16a34a" : complianceRate >= 60 ? "#d97706" : "#dc2626" }]}>
              {complianceRate}%
            </Text>
            <Text style={styles.statLabel}>Rate</Text>
          </View>
        </View>

        {/* Professional table by profession */}
        {groups.map(([profession, rows]) => (
          <View key={profession} style={styles.professionSection} wrap={false}>
            <Text style={styles.sectionTitle}>{profession} ({rows.length})</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.col1, styles.colHeader]}>NAME</Text>
                <Text style={[styles.col2, styles.colHeader]}>SPECIALTY</Text>
                <Text style={[styles.col3, styles.colHeader]}>CME CREDITS</Text>
                <Text style={[styles.col4, styles.colHeader]}>STATUS</Text>
                <Text style={[styles.col5, styles.colHeader]}>LICENSE EXPIRY</Text>
              </View>
              {rows.map((p, i) => (
                <View key={i} style={i === rows.length - 1 ? styles.tableRowLast : styles.tableRow}>
                  <Text style={styles.col1}>{p.name}</Text>
                  <Text style={styles.col2}>{p.specialty || "—"}</Text>
                  <Text style={styles.col3}>
                    {p.completedCredits !== null ? `${p.completedCredits} / ${p.requiredCredits}` : "Private"}
                  </Text>
                  <Text style={[styles.col4, styles[p.complianceStatus as keyof typeof styles] ?? styles.unknown]}>
                    {STATUS_LABEL[p.complianceStatus] ?? "—"}
                  </Text>
                  <Text style={[styles.col5, p.daysToExpiry !== null && p.daysToExpiry <= 30 ? { color: "#dc2626" } : {}]}>
                    {p.daysToExpiry === null ? "Private" : p.daysToExpiry < 0 ? "EXPIRED" : `${p.daysToExpiry} days`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            DISCLAIMER: This report is generated from professional compliance data shared voluntarily via Hayya Med Pro. Data is only displayed where professionals have explicitly consented to share with your authority. This document is for internal authority use only and does not constitute a formal regulatory determination. Hayya Med Pro supports CME tracking and licensing readiness — it does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with the relevant regulatory body.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Hayya Med Pro · hayyamed.pro · {authorityName}</Text>
          <Text>Confidential — Authority Use Only · {dateStr}</Text>
        </View>
      </Page>
    </Document>
  );
}
