#!/bin/bash

# ANTUF Vercel Deployment Environment Variables Checker
# This script helps you verify that all required environment variables are configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables to check
CRITICAL_VARS=(
    "DB_URL"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
    "NEXTAUTH_URL_INTERNAL"
    "API"
    "NEXT_PUBLIC_API"
    "CLIENT_URL"
)

IMPORTANT_VARS=(
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "GOOGLE_API_KEY"
    "GOOGLE_CALLBACK_URL"
    "GITHUB_CLIENT_ID"
    "GITHUB_CLIENT_SECRET"
    "CLOUDINARY_CLOUD_NAME"
    "CLOUDINARY_API_KEY"
    "CLOUDINARY_API_SECRET"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
)

OPTIONAL_VARS=(
    "NEXT_PUBLIC_RECAPTCHA_SITE_KEY"
    "RECAPTCHA_SECRET_KEY"
    "ADMIN_EMAIL"
    "NEXT_PUBLIC_JUDGE0_API_KEY"
)

# Function to check variable
check_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}✗${NC} $var_name: ${RED}NOT SET${NC}"
        return 1
    else
        # Show first 20 and last 5 chars for verification
        local display_value="${var_value:0:20}...${var_value: -5}"
        if [ ${#var_value} -lt 25 ]; then
            display_value="$var_value"
        fi
        echo -e "${GREEN}✓${NC} $var_name: ${BLUE}${display_value}${NC}"
        return 0
    fi
}

# Header
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ANTUF VERCEL DEPLOYMENT - ENVIRONMENT CHECKER       ║${NC}"
echo -e "${BLUE}║   Production Domain: https://antuf.org                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

# Check critical variables
echo -e "${YELLOW}🔴 CRITICAL VARIABLES (MUST HAVE):${NC}\n"
critical_count=0
critical_set=0
for var in "${CRITICAL_VARS[@]}"; do
    ((critical_count++))
    if check_var "$var"; then
        ((critical_set++))
    fi
done
echo ""

# Check important variables
echo -e "${YELLOW}🟡 IMPORTANT VARIABLES (RECOMMENDED):${NC}\n"
important_count=0
important_set=0
for var in "${IMPORTANT_VARS[@]}"; do
    ((important_count++))
    if check_var "$var"; then
        ((important_set++))
    fi
done
echo ""

# Check optional variables
echo -e "${YELLOW}🟢 OPTIONAL VARIABLES:${NC}\n"
optional_count=0
optional_set=0
for var in "${OPTIONAL_VARS[@]}"; do
    ((optional_count++))
    if check_var "$var"; then
        ((optional_set++))
    fi
done
echo ""

# Summary
echo -e "${BLUE}─────────────────────────────────────────────────────────${NC}"
echo -e "${BLUE}SUMMARY:${NC}\n"
echo "Critical:   $critical_set/$critical_count set"
echo "Important:  $important_set/$important_count set"
echo "Optional:   $optional_set/$optional_count set"
echo ""

# Status
if [ $critical_set -eq $critical_count ] && [ $important_set -eq $important_count ]; then
    echo -e "${GREEN}✅ ALL VARIABLES CONFIGURED!${NC}"
    echo -e "Your deployment is ready. Visit: ${BLUE}https://antuf.org${NC}\n"
    exit 0
elif [ $critical_set -eq $critical_count ]; then
    echo -e "${YELLOW}⚠️  CRITICAL OK, BUT SOME IMPORTANT VARIABLES MISSING${NC}"
    echo -e "Recommended to add: $(($important_count - $important_set)) more variables\n"
    exit 1
else
    echo -e "${RED}❌ CRITICAL VARIABLES MISSING!${NC}"
    echo -e "Missing: $(($critical_count - $critical_set)) critical variables"
    echo -e "Please add all critical variables to: ${BLUE}https://vercel.com/dashboard/antuf/settings/environment-variables${NC}\n"
    exit 2
fi
