# Hayya Med Pro — UI/UX Standards

## Target Quality

**Benchmark:** Salesforce Health Cloud / Workday / Monday.com / Notion
**Standard:** Every screen must feel like a product a healthcare professional would trust with their license data.

---

## Design System

### Technology Stack
- **Component library:** shadcn/ui (Radix UI primitives)
- **Styling:** TailwindCSS utility-first
- **Icons:** Lucide React
- **Fonts:** System font stack (Inter via Google Fonts for headings)
- **Charts:** Recharts
- **PDF:** @react-pdf/renderer (server-side only)

### Color Palette

| Name | Hex | Usage |
|---|---|---|
| Primary Blue | `#1a56a0` | CTAs, links, key actions, logo |
| Primary Light | `#eff6ff` | Backgrounds, highlight boxes |
| Success Green | `#16a34a` | Compliant status, verified, success |
| Warning Amber | `#d97706` | At risk, approaching deadline |
| Critical Red | `#dc2626` | Non-compliant, expired, error |
| Text Primary | `#111827` | Headings, key values |
| Text Secondary | `#374151` | Body text |
| Text Muted | `#64748b` | Labels, captions, secondary info |
| Border | `#e2e8f0` | Card borders, dividers |
| Background | `#f8fafc` | Page backgrounds |
| White | `#ffffff` | Card surfaces |

### Typography

| Element | Style |
|---|---|
| Page titles (h1) | `text-2xl font-bold text-[#111]` |
| Section titles (h2) | `text-base font-semibold text-[#111]` |
| Card titles | `text-sm font-semibold text-[#111]` |
| Body text | `text-sm text-[#374151]` |
| Labels | `text-xs font-medium text-[#64748b]` |
| Captions | `text-xs text-[#94a3b8]` |
| Values / metrics | `text-2xl font-bold` (color by context) |

---

## Accessibility Requirements

| Requirement | Standard |
|---|---|
| WCAG compliance | WCAG 2.1 AA minimum, AAA target |
| Color contrast | Minimum 4.5:1 for normal text, 3:1 for large text |
| Focus indicators | Visible focus ring on all interactive elements |
| Screen reader | All images have alt text, all icons have aria-label |
| Keyboard navigation | Full keyboard nav — no mouse-only interactions |
| Form labels | Every input has an associated label |
| Error messages | Specific, actionable — not just "error occurred" |
| Language attribute | `lang="en"` or `lang="ar"` on html element |
| RTL support | Full RTL layout for Arabic interface |
| Minimum touch target | 44×44px on mobile |

---

## Mobile-First Rules

1. Design mobile layout first, then adapt to desktop — never the reverse
2. All layouts must work on 375px width (iPhone SE) and up
3. No horizontal scrolling on mobile
4. Touch targets minimum 44×44px
5. Forms: single column on mobile, multi-column on desktop
6. Tables: horizontal scroll with sticky first column on mobile
7. Modals: full-screen on mobile, centered dialog on desktop
8. Navigation: bottom nav bar on mobile, sidebar on desktop

---

## Dashboard Standards

### Layout
```
[Sidebar Nav — 240px] | [Main Content Area]
                       |  [Page Header — Title + Actions]
                       |  [Stats Row — 3–4 metric cards]
                       |  [Main Content — table or detail]
```

### Stat Cards
```
[Icon] [Label]
       [Value — large]
       [Subtitle — context]
```

- Always show trend or context (not just a number)
- Color-code by status (green = good, amber = warning, red = critical)
- Clickable — stat card drills down to detail

### Tables
- Alternating row backgrounds or dividers
- Sortable columns where relevant
- Empty state with helpful illustration + CTA (not just "No data")
- Loading skeleton that matches table shape exactly
- Pagination: 20 rows default, user-selectable

### Status Badges
```css
/* Compliant / Verified / Active */
bg-[#dcfce7] text-[#16a34a]

/* At Risk / Pending / Approaching */
bg-[#fef9c3] text-[#a16207]

/* Non-Compliant / Rejected / Expired */
bg-[#fef2f2] text-[#dc2626]

/* Unknown / Not Started */
bg-[#f1f5f9] text-[#64748b]
```

---

## Form Standards

| Requirement | Rule |
|---|---|
| Label position | Always above the field (never floating placeholder) |
| Required fields | Asterisk (*) and `required` attribute |
| Error display | Below field in red, with icon |
| Success feedback | Toast notification, not inline |
| Disabled state | Visible opacity reduction |
| Loading state | Submit button shows spinner + "Saving..." |
| Field width | Match expected input length (date ≠ full width) |
| Auto-focus | First field in modal/form gets focus on open |
| Keyboard submit | Enter key submits single-field forms |

---

## Navigation Standards

### Sidebar (Desktop)
```
[Logo]
[Professional Name + Specialty]
─────────────────────────────
Dashboard
CME Activities
License Wallet
Documents
─────────────────────────────
Settings
Support
─────────────────────────────
[Upgrade to Pro] (for free users)
```

### Bottom Nav (Mobile — 5 items max)
```
[Home] [Activities] [Wallet] [Documents] [Settings]
```

### Breadcrumbs
- All detail pages show: `Section > Item Name`
- Clickable breadcrumbs, not decorative

---

## Branding Standards

| Element | Standard |
|---|---|
| Product name | "Hayya Med Pro" — not "HayyaMed Pro" or "hayyamed pro" |
| Logo | Full color on white, white on primary blue |
| Favicon | Logo mark only (no wordmark at small sizes) |
| Email from name | "Hayya Med Pro" |
| Email from address | `noreply@hayyamed.com` |
| Support email | `support@hayyamed.com` |
| Primary domain | `pro.hayyamed.com` |
| Marketing site | `hayyamed.com` |

---

## Loading & Error States

**Every page and component must have:**
1. **Loading state** — Skeleton that matches content shape (not spinner)
2. **Empty state** — Illustration + message + CTA (not blank)
3. **Error state** — What went wrong + what to do next
4. **Success state** — Toast notification (3-second auto-dismiss)

**Loading skeleton example:**
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
</div>
```

---

## Localization Standards

| Language | Status | Notes |
|---|---|---|
| English | Primary | Default |
| Arabic | Phase 2 | Full RTL layout, all strings externalized |

**i18n approach:** `next-intl` library. All user-facing strings in `/messages/en.json` and `/messages/ar.json`. No hardcoded strings in components.

**RTL requirements:**
- `dir="rtl"` on html element
- All flex directions reversed
- Icons mirrored where directional
- Padding/margin directional classes (`ps-` not `pl-`)
- Date format: DD/MM/YYYY for Arabic locale

---

## Performance UI Requirements

| Metric | Target |
|---|---|
| Largest Contentful Paint | < 2.5 seconds |
| First Input Delay | < 100ms |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3.5 seconds |
| Images | WebP format, lazy loaded, proper sizes |
| Fonts | Preloaded, font-display: swap |
| JavaScript | Code-split by route, no unused imports |
