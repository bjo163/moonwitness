$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "◈ MOONWITNESS OS — PRODUCTION DEPLOYMENT (WINDOWS)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

Write-Host "▶ Step 1/7: Pulling latest commits from origin/main..." -ForegroundColor Yellow
git fetch origin main
git checkout main
git pull --ff-only origin main

Write-Host "▶ Step 2/7: Installing frozen dependencies..." -ForegroundColor Yellow
pnpm install --frozen-lockfile

Write-Host "▶ Step 3/7: Running repository validation..." -ForegroundColor Yellow
pnpm turbo typecheck
pnpm test

Write-Host "▶ Step 4/7: Building production bundles..." -ForegroundColor Yellow
pnpm turbo build

$UseComposeV2 = $false
$UseComposeV1 = $false
if (Get-Command docker -ErrorAction SilentlyContinue) {
    docker compose version *> $null
    if ($LASTEXITCODE -eq 0) { $UseComposeV2 = $true }
}
if (-not $UseComposeV2 -and (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    $UseComposeV1 = $true
}

function Invoke-Compose {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$ComposeArgs)
    if ($UseComposeV2) {
        & docker compose --env-file .env.production @ComposeArgs
    } else {
        & docker-compose --env-file .env.production @ComposeArgs
    }
    if ($LASTEXITCODE -ne 0) {
        throw "Docker Compose command failed: $($ComposeArgs -join ' ')"
    }
}

if ($UseComposeV2 -or $UseComposeV1) {
    if (-not (Test-Path -LiteralPath ".env.production" -PathType Leaf)) {
        throw "Docker Compose deployment requires .env.production. Copy .env.production.example and replace every placeholder first."
    }

    Write-Host "▶ Step 5/7: Validating production configuration..." -ForegroundColor Yellow
    Invoke-Compose config --quiet
    node cli/mw.mjs prod-check
    if ($LASTEXITCODE -ne 0) { throw "Production readiness check failed." }

    Write-Host "▶ Step 6/7: Building deployable artifacts and verifying database state..." -ForegroundColor Yellow
    Invoke-Compose build api celestial-engine ai-agent web command-center
    Invoke-Compose up -d postgres redis
    Invoke-Compose run --rm api pnpm --filter=api db:install
    Invoke-Compose run --rm api pnpm --filter=api db:verify

    Write-Host "▶ Step 7/7: Starting verified production services..." -ForegroundColor Yellow
    Invoke-Compose up -d api celestial-engine ai-agent command-center web
    Invoke-Compose ps
    Write-Host "✓ Docker Compose deployment completed with verified migrations." -ForegroundColor Green
} elseif (Get-Command pm2 -ErrorAction SilentlyContinue) {
    Write-Host "▶ Step 5/7: Validating PM2 production environment..." -ForegroundColor Yellow
    if ([string]::IsNullOrWhiteSpace($env:DATABASE_URL)) { throw "DATABASE_URL must be exported before PM2 deployment." }
    if ([string]::IsNullOrWhiteSpace($env:JWT_SECRET)) { throw "JWT_SECRET must be exported before PM2 deployment." }

    Write-Host "▶ Step 6/7: Installing and verifying database state..." -ForegroundColor Yellow
    pnpm --filter=api db:install
    if ($LASTEXITCODE -ne 0) { throw "Database install failed." }
    pnpm --filter=api db:verify
    if ($LASTEXITCODE -ne 0) { throw "Database verification failed." }

    Write-Host "▶ Step 7/7: Reloading PM2 processes..." -ForegroundColor Yellow
    pm2 reload ecosystem.config.cjs --update-env
    if ($LASTEXITCODE -ne 0) { throw "PM2 reload failed." }
    Write-Host "✓ PM2 deployment completed with verified migrations." -ForegroundColor Green
} else {
    throw "Neither Docker Compose nor PM2 is available. Deployment aborted."
}

Write-Host "=================================================================" -ForegroundColor Green
Write-Host "✓ DEPLOYMENT COMPLETE — VERIFIED ARTIFACTS ARE LIVE" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
