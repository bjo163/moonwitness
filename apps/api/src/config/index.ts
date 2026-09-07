import "dotenv/config"

export interface ApiConfig {
  port: number
  jwtSecret: string
  databaseUrl: string
  remoteDatabaseUrl?: string
  autoSyncIntervalSeconds: number
  demoSeedEnabled: boolean
  celestialEngineUrl: string
  aiAgentUrl: string
  cors: {
    allowedOrigins: string[] | ((origin: string) => boolean)
    allowCredentials: boolean
  }
  email: {
    service?: string
    user?: string
    pass?: string
    from?: string
  }
  odoo?: { baseUrl: string; database: string; username: string; password: string }
}

function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim()
  if (raw) return raw

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[moon.security] Fatal: DATABASE_URL is required in production. Set it in the environment before starting the API."
    )
  }

  const fallback = "sqlite://./data/moonwitness.dev.db"
  console.log(
    `[moon.orm] Local-First: DATABASE_URL not set in ${process.env.NODE_ENV || "development"} mode. Defaulting to local SQLite (${fallback}).`
  )
  return fallback
}

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim()
  if (secret) return secret

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[moon.security] Fatal: JWT_SECRET is required in production. Set a strong secret (min 16 chars)."
    )
  }

  const devFallback = "dev-secret-key-change-in-production-min16chars"
  console.warn(
    "[moon.security] Notice: JWT_SECRET not set in development mode. Using standard dev fallback secret."
  )
  return devFallback
}

function resolveCorsOrigins(): string[] | ((origin: string) => boolean) {
  const raw = process.env.ALLOWED_ORIGINS?.trim()
  if (raw) {
    return raw.split(",").map((s) => s.trim()).filter(Boolean)
  }
  if (process.env.NODE_ENV !== "production") {
    return (origin: string) => {
      try {
        const url = new URL(origin)
        return (
          url.hostname === "localhost" ||
          url.hostname === "127.0.0.1" ||
          url.hostname === "0.0.0.0"
        )
      } catch {
        return false
      }
    }
  }
  return []
}

export const config: ApiConfig = {
  port: Number(process.env.API_PORT || process.env.PORT) || 4000,
  jwtSecret: resolveJwtSecret(),
  databaseUrl: resolveDatabaseUrl(),
  remoteDatabaseUrl: process.env.REMOTE_DATABASE_URL || process.env.SYNC_REMOTE_URL,
  autoSyncIntervalSeconds: Number(process.env.AUTO_SYNC_INTERVAL_SECONDS) || 300,
  demoSeedEnabled:
    process.env.NODE_ENV !== "production" || process.env.MOON_ENABLE_DEMO_SEED === "true",
  celestialEngineUrl: process.env.CELESTIAL_ENGINE_URL || "http://celestial-engine:8001",
  aiAgentUrl: process.env.AI_AGENT_URL || "http://ai-agent:8002",
  cors: {
    allowedOrigins: resolveCorsOrigins(),
    allowCredentials: true,
  },
  email: {
    service: process.env.SMTP_SERVICE || process.env.EMAIL_SERVICE,
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    from: process.env.SMTP_FROM || process.env.EMAIL_FROM,
  },
  odoo: process.env.ODOO_BASE_URL && process.env.ODOO_DATABASE && process.env.ODOO_USERNAME && process.env.ODOO_PASSWORD
    ? { baseUrl: process.env.ODOO_BASE_URL, database: process.env.ODOO_DATABASE, username: process.env.ODOO_USERNAME, password: process.env.ODOO_PASSWORD }
    : undefined,
}
