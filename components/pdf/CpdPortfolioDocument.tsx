// @ts-nocheck — @react-pdf/renderer has known type incompatibilities with React 19 JSX types
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const TYPE_LABELS: Record<string, string> = {
  learning:          "Learning",
  practice_change:   "Practice Change",
  significant_event: "Significant Event",
  feedback:          "Feedback",
  research:          "Research",
};

const styles = StyleSheet.create({
  page:         { fontFamily: "Helvetica", fontSize: 10, padding: 40, color: "#111827" },
  header:       { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 14, borderBottomWidth: 2, borderBottomColor: "#1a56a0" },
  logo:         { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a56a0" },
  logoSub:      { fontSize: 9, color: "#64748b", marginTop: 2 },
  headerRight:  { fontSize: 9, color: "#64748b", textAlign: "right" },
  section:      { marginBottom: 18 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1a56a0", marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  row:          { flexDirection: "row", marginBottom: 4 },
  label:        { width: 140, color: "#64748b", fontSize: 9 },
  value:        { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold" },
  walletBox:    { backgroundColor: "#eff6ff", borderRadius: 6, padding: 14, flexDirection: "row", justifyContent: "space-around", marginBottom: 4 },
  walletStat:   { alignItems: "center" },
  walletNum:    { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#1a56a0" },
  walletLabel:  { fontSize: 8, color: "#64748b", marginTop: 2 },
  // Reflection card
  reflCard:     { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4, marginBottom: 10, padding: 10 },
  reflType:     { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#1a56a0", marginBottom: 4 },
  reflDate:     { fontSize: 8, color: "#64748b", marginBottom: 6 },
  reflField:    { marginBottom: 6 },
  reflFieldLbl: { fontSize: 8, color: "#64748b", fontFamily: "Helvetica-Bold", marginBottom: 2 },
  reflFieldVal: { fontSize: 9, color: "#374151", lineHeight: 1.5 },
  actLink:      { fontSize: 8, color: "#16a34a", fontFamily: "Helvetica-Bold", marginBottom: 6 },
  // Activity table
  table:        { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4 },
  tableHeader:  { flexDirection: "row", backgroundColor: "#f8fafc", padding: "7 9", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  tableRow:     { flexDirection: "row", padding: "6 9", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  tableRowLast: { flexDirection: "row", padding: "6 9" },
  col1:         { width: "42%", fontSize: 9 },
  col2:         { width: "20%", fontSize: 9 },
  col3:         { width: "18%", fontSize: 9 },
  col4:         { width: "20%", fontSize: 9, textAlign: "right" },
  colHdr:       { fontFamily: "Helvetica-Bold", fontSize: 8, color: "#64748b" },
  badge:        { fontSize: 8, color: "#16a34a", fontFamily: "Helvetica-Bold" },
  // Declaration box
  declBox:      { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 4, padding: 12, backgroundColor: "#f8fafc" },
  declText:     { fontSize: 8, color: "#374151", lineHeight: 1.6 },
  sigLine:      { borderBottomWidth: 1, borderBottomColor: "#111827", width: 200, marginTop: 20, marginBottom: 4 },
  sigLabel:     { fontSize: 8, color: "#64748b" },
  footer:       { position: "absolute", bottom: 28, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: "#64748b", borderTopWidth: 1, borderTopColor: "#e2e8f0", paddingTop: 6 },
});

type Reflection = {
  id: string;
  reflection_date: string;
  reflection_type: string;
  what_learned: string;
  how_applied?: string | null;
  impact_on_practice?: string | null;
  further_learning?: string | null;
  linked_activity_title?: string | null;
};

type Activity = Record<string, unknown>;
type Profile = Record<string, unknown>;
type Wallet = Record<string, unknown>;

type Props = {
  profile: Profile;
  wallet: Wallet;
  reflections: Reflection[];
  activities: Activity[];
  generatedAt: string;
};

export function CpdPortfolioDocument({ profile, wallet, reflections, activities, generatedAt }: Props) {
  const pct = wallet.required_credits
    ? Math.min(Math.round(((wallet.completed_credits as number) / (wallet.required_credits as number)) * 100), 100)
    : 0;
  const date = new Date(generatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <Document title="CPD Revalidation Portfolio" author="Hayya Med Pro">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Hayya Med Pro</Text>
            <Text style={styles.logoSub}>CPD Revalidation Portfolio</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Generated: {date}</Text>
            <Text style={{ marginTop: 2 }}>Confidential — For Revalidation Use</Text>
          </View>
        </View>

        {/* Professional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <View style={styles.row}><Text style={styles.label}>Full Name</Text><Text style={styles.value}>{String(profile.full_name ?? "—")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Profession</Text><Text style={styles.value}>{String(profile.profession ?? "—")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Specialty</Text><Text style={styles.value}>{String(profile.specialty ?? "—")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>License Number</Text><Text style={styles.value}>{String(profile.license_number ?? "—")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Licensing Authority</Text><Text style={styles.value}>{String(profile.licensing_authority ?? "—")}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Portfolio Period</Text><Text style={styles.value}>{String(wallet.cycle_start_date ?? "—")} to {String(wallet.cycle_end_date ?? "—")}</Text></View>
        </View>

        {/* CME Summary */}
        {wallet.id && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CME Compliance Summary</Text>
            <View style={styles.walletBox}>
              {[
                [String(wallet.completed_credits ?? 0), "Verified Credits"],
                [String(wallet.required_credits ?? 0), "Required Credits"],
                [`${pct}%`, "Completion"],
                [reflections.length.toString(), "Reflections"],
              ].map(([num, lbl]) => (
                <View key={lbl} style={styles.walletStat}>
                  <Text style={styles.walletNum}>{num}</Text>
                  <Text style={styles.walletLabel}>{lbl}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Disclaimer */}
        <Text style={{ fontSize: 7, color: "#64748b", marginBottom: 14, lineHeight: 1.5 }}>
          Hayya Med Pro supports CME tracking and licensing readiness. It does not issue licenses and does not replace official licensing authorities. Users must verify final requirements with their relevant regulatory body.
        </Text>
      </Page>

      {/* Reflective Practice Entries — one page per 3 reflections */}
      {reflections.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>Hayya Med Pro</Text>
            <Text style={styles.headerRight}>Reflective Practice Log — {reflections.length} entr{reflections.length === 1 ? "y" : "ies"}</Text>
          </View>

          <Text style={styles.sectionTitle}>Reflective Practice Entries</Text>
          <Text style={{ fontSize: 8, color: "#64748b", marginBottom: 12 }}>
            Reflective practice is required for GMC revalidation, AHPRA CPD portfolios, and NMC revalidation. Each entry below documents learning and its impact on clinical practice.
          </Text>

          {reflections.map((r) => (
            <View key={r.id} style={styles.reflCard} wrap={false}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={styles.reflType}>{TYPE_LABELS[r.reflection_type] ?? r.reflection_type}</Text>
                <Text style={styles.reflDate}>{r.reflection_date}</Text>
              </View>
              {r.linked_activity_title && (
                <Text style={styles.actLink}>Linked to: {r.linked_activity_title}</Text>
              )}
              <View style={styles.reflField}>
                <Text style={styles.reflFieldLbl}>WHAT I LEARNED</Text>
                <Text style={styles.reflFieldVal}>{r.what_learned}</Text>
              </View>
              {r.how_applied && (
                <View style={styles.reflField}>
                  <Text style={styles.reflFieldLbl}>HOW I APPLIED IT</Text>
                  <Text style={styles.reflFieldVal}>{r.how_applied}</Text>
                </View>
              )}
              {r.impact_on_practice && (
                <View style={styles.reflField}>
                  <Text style={styles.reflFieldLbl}>IMPACT ON PRACTICE</Text>
                  <Text style={styles.reflFieldVal}>{r.impact_on_practice}</Text>
                </View>
              )}
              {r.further_learning && (
                <View style={styles.reflField}>
                  <Text style={styles.reflFieldLbl}>FURTHER LEARNING NEEDED</Text>
                  <Text style={styles.reflFieldVal}>{r.further_learning}</Text>
                </View>
              )}
            </View>
          ))}

          <View style={styles.footer} fixed>
            <Text>Hayya Med Pro · hayyamed.pro</Text>
            <Text>CPD Revalidation Portfolio — {date}</Text>
          </View>
        </Page>
      )}

      {/* CME Activities Page */}
      {activities.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logo}>Hayya Med Pro</Text>
            <Text style={styles.headerRight}>CME Activity Log — {activities.length} verified activit{activities.length === 1 ? "y" : "ies"}</Text>
          </View>

          <Text style={styles.sectionTitle}>Verified CME Activities</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.col1, styles.colHdr]}>ACTIVITY TITLE</Text>
              <Text style={[styles.col2, styles.colHdr]}>PROVIDER</Text>
              <Text style={[styles.col3, styles.colHdr]}>DATE</Text>
              <Text style={[styles.col4, styles.colHdr]}>CREDITS</Text>
            </View>
            {activities.map((a, i) => (
              <View key={String(a.id)} style={i === activities.length - 1 ? styles.tableRowLast : styles.tableRow} wrap={false}>
                <Text style={styles.col1}>{String(a.title ?? "—")}</Text>
                <Text style={styles.col2}>{String(a.provider ?? "—")}</Text>
                <Text style={styles.col3}>{String(a.activity_date ?? "—")}</Text>
                <Text style={[styles.col4, styles.badge]}>+{String(a.credits ?? 0)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer} fixed>
            <Text>Hayya Med Pro · hayyamed.pro</Text>
            <Text>Verified activities only — for submission to licensing authorities</Text>
          </View>
        </Page>
      )}

      {/* Declaration Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>Hayya Med Pro</Text>
          <Text style={styles.headerRight}>Declaration — {date}</Text>
        </View>

        <Text style={styles.sectionTitle}>Professional Declaration</Text>
        <View style={styles.declBox}>
          <Text style={styles.declText}>
            I, {String(profile.full_name ?? "________________________")}, confirm that the CPD activities, reflective practice entries, and supporting evidence contained in this portfolio are a true and accurate record of my continuing professional development activities undertaken during the period stated.{"\n\n"}
            I confirm that this portfolio has been prepared for the purpose of professional revalidation and licence renewal with my licensing authority. I understand that I may be required to provide additional evidence to support any entries in this portfolio.{"\n\n"}
            This portfolio was generated on {date} using Hayya Med Pro (hayyamed.pro). The data recorded represents activities logged by me and verified through the platform's verification process. Pending activities shown elsewhere in this portfolio are not included in the verified credit total.
          </Text>
        </View>

        <View style={{ marginTop: 36 }}>
          <View style={styles.sigLine} />
          <Text style={styles.sigLabel}>Signature</Text>
        </View>
        <View style={{ marginTop: 24 }}>
          <View style={styles.sigLine} />
          <Text style={styles.sigLabel}>Date</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>Hayya Med Pro · hayyamed.pro</Text>
          <Text>CPD Revalidation Portfolio — Confidential</Text>
        </View>
      </Page>
    </Document>
  );
}
