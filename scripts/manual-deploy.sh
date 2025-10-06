#!/bin/bash

# Manual Deploy Script for NeuroViaBot
# This script manually builds and deploys the application

set -e

echo "🚀 Starting manual deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository path
REPO_PATH="/root/neuroviabot/bot"

echo -e "${BLUE}📁 Repository path: $REPO_PATH${NC}"

# Navigate to repository
cd $REPO_PATH

echo -e "${YELLOW}🔄 Pulling latest changes...${NC}"
git pull origin main

echo -e "${YELLOW}📦 Installing bot dependencies...${NC}"
npm install --omit=dev

echo -e "${YELLOW}🌐 Building frontend...${NC}"
cd neuroviabot-frontend
npm install
npm run build
npm prune --production
cd ..

echo -e "${YELLOW}⚙️ Installing backend dependencies...${NC}"
cd neuroviabot-backend
npm install --omit=dev
cd ..

echo -e "${YELLOW}🔄 Restarting PM2 services...${NC}"

# Stop all services
pm2 stop all 2>/dev/null || true

# Start services using ecosystem file
pm2 start PM2-ECOSYSTEM.config.js --env production

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ Manual deployment completed successfully!${NC}"

# Show PM2 status
echo -e "${BLUE}📊 PM2 Status:${NC}"
pm2 status

echo -e "${GREEN}🎉 Deployment finished!${NC}"
