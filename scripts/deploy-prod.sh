#!/usr/bin/env bash
set -e

# ◈ MOONWITNESS OS V9.5 — ZERO-DOWNTIME PRODUCTION DEPLOYMENT RUNNER
echo "================================================================="
echo "◈ MOONWITNESS OS — INITIATING ZERO-DOWNTIME PRODUCTION DEPLOYMENT"
echo "================================================================="

# 1. Pull latest production code
echo "▶ Step 1/5: Pulling latest commits from origin/main..."
git fetch origin main
git checkout main
git pull origin main

# 2. Install dependencies
echo "▶ Step 2/5: Installing frozen dependencies with pnpm..."
pnpm install --frozen-lockfile

# 3. Verify integrity & tests
echo "▶ Step 3/5: Running monorepo typecheck and test verification..."
pnpm turbo typecheck
pnpm test

# 4. Build production bundles
echo "▶ Step 4/5: Compiling multi-app Next.js 16 and backend bundles..."
pnpm turbo build

# 5. Reload processes with PM2 or Docker
echo "▶ Step 5/5: Executing zero-downtime cluster reload..."
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.cjs --update-env
    echo "✓ PM2 cluster successfully reloaded."
elif command -v docker-compose &> /dev/null; then
    if [[ ! -f .env.production ]]; then
        echo "✖ Docker Compose deployment requires .env.production. Copy .env.production.example and set every required secret."
        exit 1
    fi
    docker-compose --env-file .env.production config --quiet
    echo "▶ Step 5b/5: Running production readiness check..."
    node cli/mw.mjs prod-check || {
        echo "✖ Production readiness check failed. Resolve the reported issues before deploying."
        exit 1
    }
    docker-compose --env-file .env.production up -d --build
    echo "✓ Docker Compose containers successfully updated."
else
    echo "⚠️  Neither PM2 nor Docker Compose detected. Please restart processes manually."
fi

echo "================================================================="
echo "🎉 DEPLOYMENT COMPLETE — MOONWITNESS OS V9.5 IS NOW LIVE!"
echo "================================================================="
