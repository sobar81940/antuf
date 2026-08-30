#!/bin/bash

# Appwrite Deployment Script for ANTUF
# This script deploys the Next.js application to Appwrite

echo "🚀 Starting Appwrite deployment..."

# Set Appwrite project
echo "📦 Setting Appwrite project..."
appwrite client --project-id="6921a292002d5777524d"

# Create deployment (async to avoid timeout)
echo "🔨 Creating deployment..."
appwrite sites create-deployment \
    --site-id="6935a730002118f12189" \
    --code="." \
    --activate \
    --build-command="npm run build" \
    --install-command="npm install" \
    --output-directory=".next" \
    --async

echo "✅ Deployment initiated successfully!"
echo "📊 Check deployment status at: https://cloud.appwrite.io/console/project-6921a292002d5777524d"
