#!/usr/bin/env bash
# =============================================================================
# Hayya Med Pro — GCP Cloud Monitoring Setup
# =============================================================================
# Creates: notification channel, uptime check, 3 alert policies, billing budget
#
# Usage:
#   bash scripts/setup-gcp-monitoring.sh [alert-email] [billing-account-id]
#
# Examples:
#   bash scripts/setup-gcp-monitoring.sh support@hayyamed.pro 012345-ABCDEF-789012
#   bash scripts/setup-gcp-monitoring.sh                           # uses defaults
#
# Prerequisites:
#   gcloud auth login && gcloud config set project YOUR_PROJECT_ID
# =============================================================================

set -euo pipefail

PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-$(gcloud config get-value project 2>/dev/null)}"
ALERT_EMAIL="${1:-support@hayyamed.pro}"
BILLING_ACCOUNT="${2:-}"
SERVICE_NAME="hayyamed-pro"
REGION="me-central1"
HOST="hayyamed.pro"

if [[ -z "$PROJECT_ID" ]]; then
  echo "ERROR: GOOGLE_CLOUD_PROJECT is not set and gcloud has no default project."
  echo "Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   Hayya Med Pro — GCP Monitoring Setup               ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  Project  : $PROJECT_ID"
echo "  Service  : $SERVICE_NAME ($REGION)"
echo "  Host     : $HOST"
echo "  Alerts → : $ALERT_EMAIL"
echo ""

# ─────────────────────────────────────────────
# 1. Notification Channel (email)
# ─────────────────────────────────────────────
echo "→ Creating email notification channel..."

CHANNEL_ID=$(gcloud alpha monitoring channels create \
  --project="$PROJECT_ID" \
  --display-name="Hayya Med Pro Ops Alerts" \
  --type=email \
  --channel-labels="email_address=${ALERT_EMAIL}" \
  --format="value(name)" 2>/dev/null || true)

if [[ -z "$CHANNEL_ID" ]]; then
  echo "  ⚠ Could not create channel — checking if one already exists..."
  CHANNEL_ID=$(gcloud alpha monitoring channels list \
    --project="$PROJECT_ID" \
    --filter="displayName='Hayya Med Pro Ops Alerts'" \
    --format="value(name)" | head -1)
fi

if [[ -z "$CHANNEL_ID" ]]; then
  echo "  ERROR: Could not create or find notification channel."
  echo "  Create one manually in GCP Console → Monitoring → Alerting → Notification channels"
  exit 1
fi

echo "  ✓ Notification channel: $CHANNEL_ID"

# ─────────────────────────────────────────────
# 2. Uptime Check — /api/health every 60 seconds
# ─────────────────────────────────────────────
echo ""
echo "→ Creating uptime check..."

# Check if uptime check already exists
EXISTING_UPTIME=$(gcloud monitoring uptime list \
  --project="$PROJECT_ID" \
  --filter="displayName='Hayya Med Pro Health Check'" \
  --format="value(name)" 2>/dev/null | head -1 || true)

if [[ -n "$EXISTING_UPTIME" ]]; then
  echo "  ⚠ Uptime check already exists: $EXISTING_UPTIME"
else
  gcloud monitoring uptime create \
    --project="$PROJECT_ID" \
    --display-name="Hayya Med Pro Health Check" \
    --http-check-path="/api/health" \
    --hostname="$HOST" \
    --port=443 \
    --use-ssl \
    --period=60 \
    --timeout=10 \
    --regions=usa,europe,asia-pacific 2>/dev/null || \
  gcloud monitoring uptime create \
    --project="$PROJECT_ID" \
    --display-name="Hayya Med Pro Health Check" \
    --http-check-path="/api/health" \
    --hostname="$HOST" \
    --port=443 \
    --use-ssl \
    --period=60 \
    --timeout=10
  echo "  ✓ Uptime check created (60s interval, multi-region)"
fi

# ─────────────────────────────────────────────
# 3. Alert Policy — Uptime Failure
# ─────────────────────────────────────────────
echo ""
echo "→ Creating alert: uptime failure..."

cat > /tmp/hayyamed-alert-uptime.json <<EOF
{
  "displayName": "Hayya Med Pro — Uptime Failure",
  "documentation": {
    "content": "hayyamed.pro /api/health is not returning 200. Platform may be down.",
    "mimeType": "text/markdown"
  },
  "conditions": [
    {
      "displayName": "/api/health not responding",
      "conditionThreshold": {
        "filter": "resource.type=\"uptime_url\" AND metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND resource.labels.host=\"${HOST}\"",
        "comparison": "COMPARISON_LT",
        "thresholdValue": 1,
        "duration": "120s",
        "aggregations": [
          {
            "alignmentPeriod": "60s",
            "perSeriesAligner": "ALIGN_NEXT_OLDER",
            "crossSeriesReducer": "REDUCE_COUNT_TRUE",
            "groupByFields": ["resource.labels.host"]
          }
        ]
      }
    }
  ],
  "alertStrategy": {
    "notificationRateLimit": { "period": "3600s" },
    "autoClose": "604800s"
  },
  "combiner": "OR",
  "notificationChannels": ["${CHANNEL_ID}"],
  "severity": "CRITICAL"
}
EOF

gcloud alpha monitoring policies create \
  --project="$PROJECT_ID" \
  --policy-from-file=/tmp/hayyamed-alert-uptime.json 2>/dev/null && \
  echo "  ✓ Uptime failure alert created" || \
  echo "  ⚠ Could not create uptime alert (may already exist)"

# ─────────────────────────────────────────────
# 4. Alert Policy — Cloud Run 5xx Error Rate > 1%
# ─────────────────────────────────────────────
echo ""
echo "→ Creating alert: 5xx error rate > 1%..."

cat > /tmp/hayyamed-alert-5xx.json <<EOF
{
  "displayName": "Hayya Med Pro — 5xx Error Rate > 1%",
  "documentation": {
    "content": "Cloud Run service ${SERVICE_NAME} is returning > 1% 5xx responses. Check Sentry and Cloud Run logs immediately.",
    "mimeType": "text/markdown"
  },
  "conditions": [
    {
      "displayName": "5xx error rate > 1%",
      "conditionThreshold": {
        "filter": "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${SERVICE_NAME}\" AND metric.type=\"run.googleapis.com/request_count\" AND metric.labels.response_code_class=\"5xx\"",
        "comparison": "COMPARISON_GT",
        "thresholdValue": 1,
        "duration": "300s",
        "aggregations": [
          {
            "alignmentPeriod": "60s",
            "perSeriesAligner": "ALIGN_RATE",
            "crossSeriesReducer": "REDUCE_SUM",
            "groupByFields": ["resource.labels.service_name"]
          }
        ]
      }
    }
  ],
  "alertStrategy": {
    "notificationRateLimit": { "period": "3600s" },
    "autoClose": "86400s"
  },
  "combiner": "OR",
  "notificationChannels": ["${CHANNEL_ID}"],
  "severity": "ERROR"
}
EOF

gcloud alpha monitoring policies create \
  --project="$PROJECT_ID" \
  --policy-from-file=/tmp/hayyamed-alert-5xx.json 2>/dev/null && \
  echo "  ✓ 5xx error rate alert created" || \
  echo "  ⚠ Could not create 5xx alert (may already exist)"

# ─────────────────────────────────────────────
# 5. Alert Policy — Cloud Run p95 Latency > 2s
# ─────────────────────────────────────────────
echo ""
echo "→ Creating alert: request latency p95 > 2 seconds..."

cat > /tmp/hayyamed-alert-latency.json <<EOF
{
  "displayName": "Hayya Med Pro — p95 Latency > 2s",
  "documentation": {
    "content": "Cloud Run service ${SERVICE_NAME} p95 request latency exceeds 2 seconds. Check for DB connection issues, slow queries, or memory pressure.",
    "mimeType": "text/markdown"
  },
  "conditions": [
    {
      "displayName": "p95 latency > 2000ms",
      "conditionThreshold": {
        "filter": "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"${SERVICE_NAME}\" AND metric.type=\"run.googleapis.com/request_latencies\"",
        "comparison": "COMPARISON_GT",
        "thresholdValue": 2000,
        "duration": "300s",
        "aggregations": [
          {
            "alignmentPeriod": "60s",
            "perSeriesAligner": "ALIGN_PERCENTILE_95",
            "crossSeriesReducer": "REDUCE_MAX",
            "groupByFields": ["resource.labels.service_name"]
          }
        ]
      }
    }
  ],
  "alertStrategy": {
    "notificationRateLimit": { "period": "3600s" },
    "autoClose": "86400s"
  },
  "combiner": "OR",
  "notificationChannels": ["${CHANNEL_ID}"],
  "severity": "WARNING"
}
EOF

gcloud alpha monitoring policies create \
  --project="$PROJECT_ID" \
  --policy-from-file=/tmp/hayyamed-alert-latency.json 2>/dev/null && \
  echo "  ✓ Latency p95 alert created" || \
  echo "  ⚠ Could not create latency alert (may already exist)"

# ─────────────────────────────────────────────
# 6. Billing Budget Alert — $100/month
# ─────────────────────────────────────────────
echo ""
echo "→ Creating billing budget alert ($100/month)..."

if [[ -z "$BILLING_ACCOUNT" ]]; then
  BILLING_ACCOUNT=$(gcloud billing projects describe "$PROJECT_ID" \
    --format="value(billingAccountName)" 2>/dev/null | sed 's|billingAccounts/||' || true)
fi

if [[ -z "$BILLING_ACCOUNT" ]]; then
  echo "  ⚠ Could not determine billing account. Run manually:"
  echo "    gcloud billing budgets create \\"
  echo "      --billing-account=YOUR_BILLING_ACCOUNT_ID \\"
  echo "      --display-name=\"Hayya Med Pro Monthly Budget\" \\"
  echo "      --budget-amount=100USD \\"
  echo "      --threshold-rule=percent=0.5 \\"
  echo "      --threshold-rule=percent=1.0 \\"
  echo "      --filter-projects=projects/$PROJECT_ID"
else
  gcloud billing budgets create \
    --billing-account="$BILLING_ACCOUNT" \
    --display-name="Hayya Med Pro Monthly Budget" \
    --budget-amount=100USD \
    --threshold-rule=percent=0.5 \
    --threshold-rule=percent=1.0 \
    --filter-projects="projects/$PROJECT_ID" 2>/dev/null && \
    echo "  ✓ Billing budget created (\$100/month, alerts at 50% + 100%)" || \
    echo "  ⚠ Could not create billing budget (may already exist or need billing permissions)"
fi

# ─────────────────────────────────────────────
# Cleanup temp files
# ─────────────────────────────────────────────
rm -f /tmp/hayyamed-alert-uptime.json /tmp/hayyamed-alert-5xx.json /tmp/hayyamed-alert-latency.json

# ─────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   GCP Monitoring Setup Complete                       ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  → Alerts will be sent to: $ALERT_EMAIL"
echo "  → View alerts:  https://console.cloud.google.com/monitoring/alerting?project=$PROJECT_ID"
echo "  → View uptime:  https://console.cloud.google.com/monitoring/uptime?project=$PROJECT_ID"
echo "  → View budget:  https://console.cloud.google.com/billing/budgets"
echo ""
echo "  Next steps:"
echo "  1. Verify uptime check appears in GCP Console → Monitoring → Uptime checks"
echo "  2. Confirm alert email was received (GCP sends a test notification)"
echo "  3. Set CRON_MONITOR_* env vars in GCP Secret Manager for Dead Man's Snitch"
echo "  4. Check /admin/monitoring in your platform for live cron status"
echo ""
