#!/bin/bash

# 🚀 TMS Deployment Script for Cloudflare + Vercel

echo "🏗️  Starting TMS deployment to Cloudflare + Vercel..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment checks...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Test build
echo -e "${BLUE}🔨 Testing production build...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Vercel deployment successful!${NC}"
else
    echo -e "${RED}❌ Vercel deployment failed.${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. 🌐 Configure Cloudflare DNS (see DEPLOY-STEPS.md)"
echo "2. 🔒 Set up security rules in Cloudflare"
echo "3. 📊 Enable analytics on both platforms"
echo "4. 🧪 Test both domains work correctly"
echo ""
echo -e "${YELLOW}📖 Full instructions: DEPLOY-STEPS.md${NC}"
echo -e "${YELLOW}🔧 Cloudflare setup: cloudflare-setup.md${NC}"