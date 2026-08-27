# ◈ MOONWITNESS OS V9.5 — WINDOWS SERVER PRODUCTION DEPLOYMENT RUNNER
$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "◈ MOONWITNESS OS — INITIATING PRODUCTION DEPLOYMENT (WINDOWS)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Pull latest production code
Write-Host "▶ Step 1/5: Pulling latest commits from origin/main..." -ForegroundColor Yellow
git fetch origin main
git checkout main
git pull origin main

# 2. Install dependencies
Write-Host "▶ Step 2/5: Installing frozen dependencies with pnpm..." -ForegroundColor Yellow
pnpm install --frozen-lockfile

# 3. Verify integrity & tests
Write-Host "▶ Step 3/5: Running monorepo typecheck and test verification..." -ForegroundColor Yellow
pnpm turbo typecheck
pnpm test

# 4. Build production bundles
Write-Host "▶ Step 4/5: Compiling multi-app Next.js 16 and backend bundles..." -ForegroundColor Yellow
pnpm turbo build

# 5. Reload processes
Write-Host "▶ Step 5/5: Executing cluster process reload..." -ForegroundColor Yellow
if (Get-Command pm2 -ErrorAction SilentlyContinue) {
    pm2 reload ecosystem.config.cjs --update-env
    Write-Host "✓ PM2 cluster successfully reloaded." -ForegroundColor Green
} elseif (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    docker-compose up -d --build
    Write-Host "✓ Docker Compose containers successfully updated." -ForegroundColor Green
} else {
    Write-Host "⚠️  Neither PM2 nor Docker Compose detected. Please restart services manually." -ForegroundColor Yellow
}

Write-Host "=================================================================" -ForegroundColor Green
Write-Host "🎉 DEPLOYMENT COMPLETE — MOONWITNESS OS V9.5 IS NOW LIVE!" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
