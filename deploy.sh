#!/bin/bash
set -e

echo "🚀 Starting deployment..."

echo "📦 Building Docker image..."
gcloud builds submit --tag gcr.io/gungong-ai/gungong-fullstack:latest --timeout=30m .

echo "🌐 Deploying to Cloud Run..."
gcloud run deploy gungong-fullstack \
  --image gcr.io/gungong-ai/gungong-fullstack:latest \
  --region asia-southeast1 \
  --platform managed

echo "✅ Deployment successful!"
gcloud run services describe gungong-fullstack --region asia-southeast1 --format 'value(status.url)'
