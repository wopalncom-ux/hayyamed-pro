#!/bin/bash
# Run this once to create all Secret Manager secrets for hayyamed-pro.
# Replace every <PASTE_...> placeholder with the real value before running.
# Usage: bash scripts/setup-gcp-secrets.sh

PROJECT="project-38d955b0-84e7-44b6-8b5"
REGION="me-central1"

gcloud config set project "$PROJECT"

create_secret() {
  local NAME="$1"
  local VALUE="$2"
  echo "$VALUE" | gcloud secrets create "$NAME" \
    --data-file=- \
    --replication-policy=user-managed \
    --locations="$REGION" \
    2>/dev/null || \
  echo "$VALUE" | gcloud secrets versions add "$NAME" --data-file=-
  echo "✓ $NAME"
}

# ---------- Fill in real values below before running ----------

create_secret "hayyamed-pro-service-role-key"  "<PASTE_SUPABASE_SERVICE_ROLE_KEY>"
create_secret "hayyamed-pro-postmark-key"       "<PASTE_POSTMARK_API_KEY>"
create_secret "hayyamed-pro-anthropic-key"      "<PASTE_ANTHROPIC_API_KEY>"
create_secret "hayyamed-pro-cron-secret"        "<PASTE_CRON_SECRET>"
create_secret "hayyamed-pro-vapid-private"      "<PASTE_VAPID_PRIVATE_KEY>"
create_secret "hayyamed-pro-paddle-key"         "<PASTE_PADDLE_API_KEY_or_placeholder>"
create_secret "hayyamed-pro-paddle-webhook"     "<PASTE_PADDLE_WEBHOOK_SECRET_or_placeholder>"

# ---------- Grant Cloud Build SA access to secrets ----------

CB_SA="$(gcloud projects describe $PROJECT --format='value(projectNumber)')@cloudbuild.gserviceaccount.com"

for SECRET in \
  hayyamed-pro-service-role-key \
  hayyamed-pro-postmark-key \
  hayyamed-pro-anthropic-key \
  hayyamed-pro-cron-secret \
  hayyamed-pro-vapid-private \
  hayyamed-pro-paddle-key \
  hayyamed-pro-paddle-webhook
do
  gcloud secrets add-iam-policy-binding "$SECRET" \
    --member="serviceAccount:$CB_SA" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet
  echo "  → IAM binding set for $SECRET"
done

echo ""
echo "All secrets created. Run: gcloud builds submit --config=cloudbuild.yaml"
