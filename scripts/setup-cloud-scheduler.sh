#!/bin/bash
# Hayya Med Pro â€” GCP Cloud Scheduler Setup
#
# Run once after initial deployment to activate all 7 automated cron jobs.
# Without this, no trial emails, license alerts, or engagement emails will fire.
#
# Prerequisites:
#   gcloud auth login
#   gcloud config set project project-38d955b0-84e7-44b6-8b5
#
# Usage:
#   chmod +x scripts/setup-cloud-scheduler.sh
#   ./scripts/setup-cloud-scheduler.sh
#
# To tear down all jobs:
#   ./scripts/setup-cloud-scheduler.sh --delete

set -euo pipefail

PROJECT_ID="project-38d955b0-84e7-44b6-8b5"
SCHEDULER_REGION="us-central1"
APP_URL="https://hayyamed.pro"
SECRET_NAME="hayyamed-pro-cron-secret"
TIME_ZONE="Asia/Qatar"
DELETE_MODE=false

if [[ "${1:-}" == "--delete" ]]; then
  DELETE_MODE=true
fi

echo "=== Hayya Med Pro â€” Cloud Scheduler Setup ==="
echo "Project:  ${PROJECT_ID}"
echo "Region:   ${SCHEDULER_REGION}"
echo "App URL:  ${APP_URL}"
echo ""

# Verify gcloud is authenticated and project is accessible
if ! gcloud projects describe "${PROJECT_ID}" --quiet &>/dev/null; then
  echo "ERROR: Cannot access project ${PROJECT_ID}. Run: gcloud auth login"
  exit 1
fi

gcloud config set project "${PROJECT_ID}" --quiet

if [ "${DELETE_MODE}" = "true" ]; then
  echo "--- DELETE MODE: removing all Hayya Med jobs ---"
  JOBS=(
    hayyamed-trial-reminders
    hayyamed-license-reminders
    hayyamed-cme-deadline
    hayyamed-license-expiry
    hayyamed-onboarding-reminder
    hayyamed-employer-digest
    hayyamed-professional-digest
  )
  for JOB in "${JOBS[@]}"; do
    if gcloud scheduler jobs describe "${JOB}" \
        --location="${SCHEDULER_REGION}" \
        --project="${PROJECT_ID}" &>/dev/null; then
      gcloud scheduler jobs delete "${JOB}" \
        --location="${SCHEDULER_REGION}" \
        --project="${PROJECT_ID}" \
        --quiet
      echo "  Deleted: ${JOB}"
    else
      echo "  Not found (skip): ${JOB}"
    fi
  done
  echo "Done."
  exit 0
fi

# Fetch CRON_SECRET from Secret Manager
echo "Fetching CRON_SECRET from Secret Manager..."
CRON_SECRET=$(gcloud secrets versions access latest \
  --secret="${SECRET_NAME}" \
  --project="${PROJECT_ID}")

if [[ -z "${CRON_SECRET}" ]]; then
  echo "ERROR: CRON_SECRET is empty. Add secret '${SECRET_NAME}' to Secret Manager first."
  exit 1
fi

echo "CRON_SECRET fetched (${#CRON_SECRET} chars)"
echo ""

# Helper: create or update a Cloud Scheduler HTTP job
create_or_update_job() {
  local JOB_NAME=$1
  local SCHEDULE=$2
  local PATH_SUFFIX=$3
  local DESCRIPTION=$4

  local EXISTING=false
  if gcloud scheduler jobs describe "${JOB_NAME}" \
      --location="${SCHEDULER_REGION}" \
      --project="${PROJECT_ID}" &>/dev/null; then
    EXISTING=true
  fi

  local ACTION="Creating"
  [[ "${EXISTING}" = "true" ]] && ACTION="Updating"
  echo "  ${ACTION}: ${JOB_NAME} (${SCHEDULE} ${TIME_ZONE})"

  if [ "${EXISTING}" = "true" ]; then
    gcloud scheduler jobs update http "${JOB_NAME}" \
      --location="${SCHEDULER_REGION}" \
      --project="${PROJECT_ID}" \
      --schedule="${SCHEDULE}" \
      --uri="${APP_URL}${PATH_SUFFIX}" \
      --http-method=GET \
      --headers="Authorization=Bearer ${CRON_SECRET}" \
      --time-zone="${TIME_ZONE}" \
      --description="${DESCRIPTION}" \
      --attempt-deadline=540s \
      --quiet
  else
    gcloud scheduler jobs create http "${JOB_NAME}" \
      --location="${SCHEDULER_REGION}" \
      --project="${PROJECT_ID}" \
      --schedule="${SCHEDULE}" \
      --uri="${APP_URL}${PATH_SUFFIX}" \
      --http-method=GET \
      --headers="Authorization=Bearer ${CRON_SECRET}" \
      --time-zone="${TIME_ZONE}" \
      --description="${DESCRIPTION}" \
      --attempt-deadline=540s \
      --quiet
  fi
}

echo "--- Configuring daily jobs (staggered to avoid DB contention) ---"

# 08:00 GST (05:00 UTC) â€” trial conversion drip (Days 3/7/11/14)
create_or_update_job \
  "hayyamed-trial-reminders" \
  "0 8 * * *" \
  "/api/cron/trial-reminders" \
  "Trial conversion: Day 3 activation nudge, Day 7 snapshot, Day 11 urgent, Day 14 expired"

# 08:15 GST (05:15 UTC) â€” license expiry push notifications (30d and 7d warnings)
create_or_update_job \
  "hayyamed-license-reminders" \
  "15 8 * * *" \
  "/api/cron/license-reminders" \
  "License expiry push notifications (30-day and 7-day warnings)"

# 08:30 GST (05:30 UTC) â€” CME cycle deadline push notifications
create_or_update_job \
  "hayyamed-cme-deadline" \
  "30 8 * * *" \
  "/api/cron/cme-deadline" \
  "CME cycle deadline push notifications (60-day and 30-day warnings)"

# 08:45 GST (05:45 UTC) â€” license expiry email alerts
create_or_update_job \
  "hayyamed-license-expiry" \
  "45 8 * * *" \
  "/api/cron/license-expiry" \
  "License expiry email alerts (90d/60d/30d/7d/1d)"

# 09:00 GST (06:00 UTC) â€” onboarding nudge for abandoned signups (48hâ€“7d window)
create_or_update_job \
  "hayyamed-onboarding-reminder" \
  "0 9 * * *" \
  "/api/cron/onboarding-reminder" \
  "Re-engage users who started but never completed onboarding (48hâ€“7d window)"

echo ""
echo "--- Configuring weekly jobs (Mondays, staggered by 30 min) ---"

# Monday 07:00 GST (04:00 UTC) â€” employer compliance digest
create_or_update_job \
  "hayyamed-employer-digest" \
  "0 7 * * 1" \
  "/api/cron/employer-digest" \
  "Employer weekly compliance digest: staff status, expiring licenses, action items"

# Monday 07:30 GST (04:30 UTC) â€” professional CME digest
create_or_update_job \
  "hayyamed-professional-digest" \
  "30 7 * * 1" \
  "/api/cron/professional-digest" \
  "Professional weekly CME digest: compliance %, credits logged, renewal countdown"

echo ""
echo "=== All 7 Cloud Scheduler jobs configured ==="
echo ""
echo "Verify:"
echo "  gcloud scheduler jobs list --location=${SCHEDULER_REGION} --project=${PROJECT_ID}"
echo ""
echo "Trigger a job manually to test:"
echo "  gcloud scheduler jobs run hayyamed-trial-reminders --location=${SCHEDULER_REGION} --project=${PROJECT_ID}"
echo ""
echo "View job execution history in GCP Console:"
echo "  https://console.cloud.google.com/cloudscheduler?project=${PROJECT_ID}"
