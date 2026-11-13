#!/usr/bin/env bash
set -euo pipefail

echo "================================================================="
echo "◈ MOONWITNESS OS — PRODUCTION DEPLOYMENT"
echo "================================================================="

echo "▶ Step 1/7: Pulling latest commits from origin/main..."
git fetch origin main
git checkout main
git pull --ff-only origin main

echo "▶ Step 2/7: Installing frozen dependencies..."
pnpm install --frozen-lockfile

echo "▶ Step 3/7: Running repository validation..."
pnpm turbo typecheck
pnpm test

echo "▶ Step 4/7: Building production bundles..."
pnpm turbo build

COMPOSE=()
if docker compose version >/dev/null 2>&1; then
    COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE=(docker-compose)
fi

if [[ ${#COMPOSE[@]} -gt 0 ]]; then
    if [[ ! -f .env.production ]]; then
        echo "✖ Docker Compose deployment requires .env.production."
        echo "  Copy .env.production.example and replace every placeholder first."
        exit 1
    fi

    dc() {
        "${COMPOSE[@]}" --env-file .env.production "$@"
    }

    echo "▶ Step 5/7: Validating production configuration..."
    dc config --quiet
    node packages/cli/mw.mjs prod-check

    echo "▶ Step 6/7: Building deployable artifacts and verifying database state..."
    dc build api celestial-engine ai-agent web command-center
    dc up -d postgres redis
    dc run --rm api pnpm --filter=api db:install
    dc run --rm api pnpm --filter=api db:verify

    echo "▶ Step 7/7: Starting verified production services..."
    dc up -d api celestial-engine ai-agent command-center web
    dc ps
    echo "✓ Docker Compose deployment completed with verified migrations."
elif command -v pm2 >/dev/null 2>&1; then
    echo "▶ Step 5/7: Validating PM2 production environment..."
    : "${DATABASE_URL:?DATABASE_URL must be exported before PM2 deployment}"
    : "${JWT_SECRET:?JWT_SECRET must be exported before PM2 deployment}"

    echo "▶ Step 6/7: Installing and verifying database state..."
    pnpm --filter=api db:install
    pnpm --filter=api db:verify

    echo "▶ Step 7/7: Reloading PM2 processes..."
    pm2 reload ecosystem.config.cjs --update-env
    echo "✓ PM2 deployment completed with verified migrations."
else
    echo "✖ Neither Docker Compose nor PM2 is available. Deployment aborted."
    exit 1
fi

echo "================================================================="
echo "✓ DEPLOYMENT COMPLETE — VERIFIED ARTIFACTS ARE LIVE"
echo "================================================================="
