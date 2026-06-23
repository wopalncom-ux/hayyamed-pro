#!/bin/bash
# deploy.sh — Hayya Med PRO deployment script
# ALL builds and deployments are locked to me-central1 (Doha, Qatar).
# Never change the region. Healthcare data must not leave Qatar.

set -e

PROJECT="project-38d955b0-84e7-44b6-8b5"
REGION="me-central1"   # Qatar — DO NOT CHANGE

echo ""
echo "  Hayya Med PRO — Deploy to Qatar (me-central1)"
echo "  Project: $PROJECT"
echo "  Region:  $REGION (Doha, Qatar)"
echo ""

gcloud builds submit \
  --config cloudbuild.yaml \
  --project="$PROJECT" \
  --region="$REGION"
