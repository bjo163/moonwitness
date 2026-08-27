export interface DemoSeedEnvironment {
  NODE_ENV?: string
  MOON_ENABLE_DEMO_SEED?: string
}

/**
 * Demo/sample data is never a production dependency. Production deployments
 * must opt in explicitly when an operator intentionally needs the demo loader.
 */
export function isDemoSeedEnabled(env: DemoSeedEnvironment = process.env): boolean {
  if (env.NODE_ENV !== 'production') return true
  return env.MOON_ENABLE_DEMO_SEED === 'true'
}

export function assertDemoSeedEnabled(env: DemoSeedEnvironment = process.env): void {
  if (isDemoSeedEnabled(env)) return

  const error = new Error('Demo seeding is disabled in production') as Error & {
    statusCode?: number
    code?: string
  }
  error.statusCode = 403
  error.code = 'DEMO_SEED_DISABLED'
  throw error
}
