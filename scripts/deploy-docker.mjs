#!/usr/bin/env node
/**
 * ◈ MoonWitness — Docker Production Deployment Script
 *
 * Orchestrates a full Docker Compose deployment:
 *   1. Pre-flight checks (Docker, env file, git)
 *   2. Build all service images
 *   3. Start infrastructure (postgres, redis)
 *   4. Run database migrations
 *   5. Start application services
 *   6. Health-check verification
 *
 * Usage:
 *   pnpm deploy:docker                    # Full deployment
 *   pnpm deploy:docker -- --build-only    # Build images only
 *   pnpm deploy:docker -- --no-migrate    # Skip database migration
 *   pnpm deploy:docker -- --restart       # Restart without rebuilding
 *   pnpm deploy:docker -- --down          # Tear down all services
 *   pnpm deploy:docker -- --status        # Show service status
 *   pnpm deploy:docker -- --logs [svc]    # Tail logs
 */

import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

// ── Configuration ─────────────────────────────────────────────────────────────

const ENV_FILE = '.env.production';
const COMPOSE_FILE = 'docker-compose.yml';

const INFRA_SERVICES = ['postgres', 'redis'];
const APP_SERVICES = ['api', 'celestial-engine', 'ai-agent', 'web', 'command-center'];
const ALL_SERVICES = [...INFRA_SERVICES, ...APP_SERVICES];

const REQUIRED_ENV_VARS = [
  'JWT_SECRET',
  'PUBLIC_API_URL',
];

const HEALTH_CHECK = {
  maxRetries: 30,
  intervalMs: 3000,
  services: {
    api: { port: 4000, path: '/health/ready' },
    'celestial-engine': { port: 8001, path: '/health' },
    'ai-agent': { port: 8002, path: '/health' },
    web: { port: 3000, path: '/' },
    'command-center': { port: 3001, path: '/' },
  },
};

// ── Formatting Helpers ────────────────────────────────────────────────────────

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function banner(text) {
  const line = '═'.repeat(64);
  console.log(`\n${c.cyan}${c.bold}╔${line}╗${c.reset}`);
  console.log(`${c.cyan}${c.bold}║${c.reset}  ◈ ${text.padEnd(61)}${c.cyan}${c.bold}║${c.reset}`);
  console.log(`${c.cyan}${c.bold}╚${line}╝${c.reset}\n`);
}

function step(num, total, text) {
  console.log(`\n${c.yellow}${c.bold}▶ Step ${num}/${total}:${c.reset} ${text}`);
}

function success(text) {
  console.log(`${c.green}${c.bold}  ✓${c.reset} ${text}`);
}

function warn(text) {
  console.log(`${c.yellow}  ⚠ ${text}${c.reset}`);
}

function fail(text) {
  console.error(`${c.red}${c.bold}  ✖ ${text}${c.reset}`);
}

function info(text) {
  console.log(`${c.dim}    ${text}${c.reset}`);
}

// ── Docker Compose Wrapper ────────────────────────────────────────────────────

let composeCmd = null;

function detectCompose() {
  try {
    execSync('docker compose version', { cwd: ROOT, stdio: 'pipe' });
    composeCmd = 'docker compose';
    return true;
  } catch {
    /* ignore */
  }
  try {
    execSync('docker-compose version', { cwd: ROOT, stdio: 'pipe' });
    composeCmd = 'docker-compose';
    return true;
  } catch {
    /* ignore */
  }
  return false;
}

function dc(args, options = {}) {
  const cmd = `${composeCmd} --env-file ${ENV_FILE} -f ${COMPOSE_FILE} ${args}`;
  const opts = { cwd: ROOT, stdio: options.silent ? 'pipe' : 'inherit', ...options };

  if (options.silent) {
    return execSync(cmd, opts).toString().trim();
  }
  execSync(cmd, opts);
}

function dcSpawn(args) {
  const parts = `${composeCmd} --env-file ${ENV_FILE} -f ${COMPOSE_FILE} ${args}`.split(' ');
  const cmd = parts[0];
  const cmdArgs = parts.slice(1);
  return spawnSync(cmd, cmdArgs, { cwd: ROOT, stdio: 'inherit', shell: true });
}

// ── Pre-flight Checks ─────────────────────────────────────────────────────────

function checkDocker() {
  try {
    const version = execSync('docker --version', { cwd: ROOT, stdio: 'pipe' }).toString().trim();
    success(`Docker available: ${version}`);
  } catch {
    fail('Docker is not installed or not in PATH.');
    process.exit(1);
  }

  if (!detectCompose()) {
    fail('Docker Compose (v2 plugin or standalone) is not available.');
    process.exit(1);
  }
  success(`Compose command: ${composeCmd}`);

  try {
    execSync('docker info', { cwd: ROOT, stdio: 'pipe' });
    success('Docker daemon is running.');
  } catch {
    fail('Docker daemon is not running. Start Docker Desktop or the Docker service first.');
    process.exit(1);
  }
}

function checkEnvFile() {
  const envPath = resolve(ROOT, ENV_FILE);
  if (!existsSync(envPath)) {
    fail(`${ENV_FILE} not found.`);
    info(`Copy .env.production.example to ${ENV_FILE} and fill in all values.`);
    info(`Run: cp .env.production.example ${ENV_FILE}`);
    process.exit(1);
  }

  const content = readFileSync(envPath, 'utf-8');
  const missing = [];
  const placeholders = [];

  for (const key of REQUIRED_ENV_VARS) {
    const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
    if (!match || !match[1].trim()) {
      missing.push(key);
    } else if (match[1].includes('REPLACE_WITH')) {
      placeholders.push(key);
    }
  }

  if (missing.length > 0) {
    fail(`Missing environment variables in ${ENV_FILE}:`);
    missing.forEach((v) => info(`  - ${v}`));
    process.exit(1);
  }

  if (placeholders.length > 0) {
    fail(`Placeholder values detected in ${ENV_FILE} (still contain "REPLACE_WITH"):`);
    placeholders.forEach((v) => info(`  - ${v}`));
    process.exit(1);
  }

  success(`${ENV_FILE} validated — all required variables present.`);
}

function checkComposeConfig() {
  try {
    dc('config --quiet', { silent: true });
    success('Compose configuration is valid.');
  } catch (e) {
    fail('docker-compose.yml has configuration errors:');
    console.error(e.message);
    process.exit(1);
  }
}

// ── Build ─────────────────────────────────────────────────────────────────────

function buildImages() {
  info('Building all service images (this may take several minutes)...');
  dc('build --parallel');
  success('All images built successfully.');
}

// ── Infrastructure ────────────────────────────────────────────────────────────

function startInfra() {
  info('Starting PostgreSQL and Redis...');
  dc(`up -d ${INFRA_SERVICES.join(' ')}`);

  // Wait for health
  info('Waiting for infrastructure health checks...');
  let healthy = false;
  for (let i = 0; i < 30; i++) {
    try {
      const psOutput = dc('ps --format json', { silent: true });
      // Parse JSON lines output
      const lines = psOutput.split('\n').filter(Boolean);
      const infraHealthy = INFRA_SERVICES.every((svc) => {
        return lines.some((line) => {
          try {
            const parsed = JSON.parse(line);
            return parsed.Service === svc && parsed.Health === 'healthy';
          } catch {
            return false;
          }
        });
      });
      if (infraHealthy) {
        healthy = true;
        break;
      }
    } catch {
      /* retry */
    }
    execSync(`${process.platform === 'win32' ? 'timeout /t 3 /nobreak >nul' : 'sleep 3'}`, {
      cwd: ROOT,
      stdio: 'pipe',
      shell: true,
    });
  }

  if (!healthy) {
    warn('Infrastructure health check timed out. Checking status...');
    dc('ps');
  } else {
    success('PostgreSQL and Redis are healthy.');
  }
}

// ── Database Migration ────────────────────────────────────────────────────────

function runMigrations() {
  info('Running database migrations...');
  try {
    dc('run --rm api pnpm --filter=api db:install');
    success('Database migrations completed.');
  } catch (e) {
    fail('Database migration failed.');
    info('Check the API logs: pnpm deploy:docker -- --logs api');
    throw e;
  }
}

// ── Application Services ──────────────────────────────────────────────────────

function startApps() {
  info('Starting all application services...');
  dc(`up -d ${APP_SERVICES.join(' ')}`);
  success('All application services started.');
}

// ── Health Verification ───────────────────────────────────────────────────────

async function verifyHealth() {
  info('Verifying service health...');
  const results = {};

  for (const [svc, config] of Object.entries(HEALTH_CHECK.services)) {
    let healthy = false;
    for (let attempt = 1; attempt <= HEALTH_CHECK.maxRetries; attempt++) {
      try {
        const url = `http://127.0.0.1:${config.port}${config.path}`;
        const response = await fetch(url, {
          signal: AbortSignal.timeout(3000),
        });
        if (response.ok || response.status < 500) {
          healthy = true;
          break;
        }
      } catch {
        /* retry */
      }
      if (attempt % 5 === 0) {
        info(`  ${svc}: waiting... (attempt ${attempt}/${HEALTH_CHECK.maxRetries})`);
      }
      await new Promise((r) => setTimeout(r, HEALTH_CHECK.intervalMs));
    }
    results[svc] = healthy;
  }

  console.log('');
  const table = Object.entries(results).map(([svc, ok]) => ({
    Service: svc,
    Port: HEALTH_CHECK.services[svc].port,
    Status: ok ? '✓ Healthy' : '✖ Unhealthy',
  }));
  console.table(table);

  const unhealthy = Object.entries(results)
    .filter(([, ok]) => !ok)
    .map(([svc]) => svc);

  if (unhealthy.length > 0) {
    warn(`Unhealthy services: ${unhealthy.join(', ')}`);
    info('Check logs with: pnpm deploy:docker -- --logs <service>');
  } else {
    success('All services are healthy and responding.');
  }
}

// ── Commands ──────────────────────────────────────────────────────────────────

async function fullDeploy(flags) {
  const totalSteps = flags.noMigrate ? 5 : 6;
  let s = 0;

  banner('MOONWITNESS — DOCKER PRODUCTION DEPLOYMENT');

  step(++s, totalSteps, 'Pre-flight checks');
  checkDocker();
  checkEnvFile();
  checkComposeConfig();

  step(++s, totalSteps, 'Building service images');
  buildImages();

  step(++s, totalSteps, 'Starting infrastructure');
  startInfra();

  if (!flags.noMigrate) {
    step(++s, totalSteps, 'Running database migrations');
    runMigrations();
  }

  step(++s, totalSteps, 'Starting application services');
  startApps();

  step(++s, totalSteps, 'Verifying deployment health');
  await verifyHealth();

  banner('DEPLOYMENT COMPLETE');
  console.log(`${c.dim}  Endpoints:${c.reset}`);
  console.log(`    Web:            http://localhost:\${WEB_PORT:-3000}`);
  console.log(`    Command Center: http://localhost:\${COMMAND_CENTER_PORT:-3001}`);
  console.log(`    API:            http://localhost:\${API_PORT:-4000}`);
  console.log(`    Celestial:      http://localhost:\${CELESTIAL_ENGINE_PORT:-8001}`);
  console.log(`    AI Agent:       http://localhost:\${AI_AGENT_PORT:-8002}`);
  console.log('');
}

function buildOnly() {
  banner('MOONWITNESS — BUILD IMAGES');
  checkDocker();
  checkEnvFile();
  checkComposeConfig();
  buildImages();
  success('Build completed. Run `pnpm deploy:docker` for full deployment.');
}

function restart() {
  banner('MOONWITNESS — RESTART SERVICES');
  checkDocker();
  info('Restarting all services...');
  dc(`restart ${APP_SERVICES.join(' ')}`);
  success('All services restarted.');
  dc('ps');
}

function tearDown() {
  banner('MOONWITNESS — TEAR DOWN');
  checkDocker();
  detectCompose();

  console.log(`${c.yellow}  This will stop and remove all containers.${c.reset}`);
  console.log(`${c.dim}  Persistent volumes (database, redis) will be preserved.${c.reset}`);
  console.log('');

  dc('down');
  success('All containers stopped and removed.');
}

function showStatus() {
  banner('MOONWITNESS — SERVICE STATUS');
  checkDocker();
  dc('ps -a');
}

function showLogs(service) {
  checkDocker();
  detectCompose();
  const svc = service || '';
  dc(`logs -f --tail=100 ${svc}`);
}

// ── Entrypoint ────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const flags = {
    buildOnly: args.includes('--build-only'),
    noMigrate: args.includes('--no-migrate'),
    restart: args.includes('--restart'),
    down: args.includes('--down'),
    status: args.includes('--status'),
    logs: args.includes('--logs'),
  };

  try {
    if (flags.down) return tearDown();
    if (flags.status) return showStatus();
    if (flags.logs) {
      const logIdx = args.indexOf('--logs');
      const svc = args[logIdx + 1];
      return showLogs(svc);
    }
    if (flags.restart) return restart();
    if (flags.buildOnly) return buildOnly();

    await fullDeploy(flags);
  } catch (e) {
    fail(e.message || 'Deployment failed.');
    process.exit(1);
  }
}

main();
