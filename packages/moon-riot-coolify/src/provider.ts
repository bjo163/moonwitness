import { createHttpClient, RiotError, RiotTimeoutError, type ConnectorProvider, type HttpClient } from '@moon/riot'
import { sanitizeApplication, stripSensitive } from './sanitize'
import type {
  CoolifyApplication,
  CoolifyDeployment,
  CoolifyDeploymentLogEntry,
  CoolifyEnvVar,
  CoolifyPowerAction,
  CoolifyProject,
  CoolifyResourceType,
  CoolifyServer,
  DeployResult,
  WaitOptions,
} from './types'

export interface CoolifyProviderConfig {
  baseUrl?: string
  token?: string
  timeoutMs?: number
  fetch?: typeof fetch
}

const COLLECTIONS: Record<CoolifyResourceType, string> = {
  application: 'applications',
  service: 'services',
  database: 'databases',
}

const TERMINAL_STATUSES = new Set(['finished', 'failed', 'cancelled', 'completed'])

export interface CoolifyProvider extends ConnectorProvider {
  listProjects(): Promise<CoolifyProject[]>
  getProject(uuid: string): Promise<CoolifyProject>
  listServers(): Promise<CoolifyServer[]>
  listServerResources(serverUuid: string): Promise<unknown[]>
  listResources(type: CoolifyResourceType): Promise<Record<string, unknown>[]>
  getResource(type: CoolifyResourceType, uuid: string): Promise<Record<string, unknown>>
  getApplication(uuid: string): Promise<CoolifyApplication>
  deploy(uuid: string, options?: { force?: boolean }): Promise<DeployResult>
  getDeployment(deploymentUuid: string): Promise<CoolifyDeployment>
  waitForDeployment(deploymentUuid: string, options?: WaitOptions): Promise<CoolifyDeployment>
  power(type: CoolifyResourceType, uuid: string, action: CoolifyPowerAction): Promise<unknown>
  listEnvs(applicationUuid: string): Promise<CoolifyEnvVar[]>
  updateEnv(applicationUuid: string, env: { key: string; value: string; isPreview?: boolean }): Promise<unknown>
  getApplicationLogs(applicationUuid: string, lines?: number): Promise<string>
}

function parseDeploymentLogs(raw: unknown): CoolifyDeploymentLogEntry[] {
  if (Array.isArray(raw)) return raw as CoolifyDeploymentLogEntry[]
  // Coolify returns deployment logs as a JSON-encoded string, not an array.
  if (typeof raw === 'string' && raw.length > 0) {
    try {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as CoolifyDeploymentLogEntry[]
    } catch {
      return [{ output: raw }]
    }
  }
  return []
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export function createCoolifyProvider(config: CoolifyProviderConfig = {}): CoolifyProvider {
  const baseUrl = config.baseUrl ?? process.env.COOLIFY_BASE_URL
  const token = config.token ?? process.env.COOLIFY_TOKEN
  if (!baseUrl) throw new RiotError('Coolify baseUrl is required (config.baseUrl or COOLIFY_BASE_URL)')
  if (!token) throw new RiotError('Coolify token is required (config.token or COOLIFY_TOKEN)')

  const http: HttpClient = createHttpClient({ baseUrl, token, timeoutMs: config.timeoutMs, fetch: config.fetch })

  return {
    id: 'coolify',
    kind: 'deployment',

    listProjects: () => http.get<CoolifyProject[]>('/api/v1/projects'),
    getProject: (uuid) => http.get<CoolifyProject>(`/api/v1/projects/${uuid}`),
    listServers: () => http.get<CoolifyServer[]>('/api/v1/servers'),
    // The server resources payload is a bare array, not grouped by resource type.
    listServerResources: (serverUuid) => http.get<unknown[]>(`/api/v1/servers/${serverUuid}/resources`),
    listResources: (type) => http.get<Record<string, unknown>[]>(`/api/v1/${COLLECTIONS[type]}`),

    async getResource(type, uuid) {
      const record = await http.get<Record<string, unknown>>(`/api/v1/${COLLECTIONS[type]}/${uuid}`)
      return type === 'application' ? sanitizeApplication(record) : stripSensitive(record)
    },

    async getApplication(uuid) {
      const record = await http.get<Record<string, unknown>>(`/api/v1/applications/${uuid}`)
      return sanitizeApplication(record) as CoolifyApplication
    },

    async deploy(uuid, options = {}) {
      // Path-style deploy endpoints 404 on v4.5; the query-param form is the working one.
      const result = await http.post<{ deployments?: Array<{ deployment_uuid?: string }> }>('/api/v1/deploy', {
        query: { uuid, force: options.force === false ? undefined : 'true' },
      })
      const deploymentUuid = result.deployments?.[0]?.deployment_uuid
      if (!deploymentUuid) throw new RiotError('Coolify deploy response did not include a deployment_uuid')
      return { deploymentUuid }
    },

    async getDeployment(deploymentUuid) {
      const record = await http.get<Record<string, unknown>>(`/api/v1/deployments/${deploymentUuid}`)
      return { ...record, logs: parseDeploymentLogs(record.logs) } as CoolifyDeployment
    },

    async waitForDeployment(deploymentUuid, options = {}) {
      const intervalMs = options.intervalMs ?? 5_000
      const timeoutMs = options.timeoutMs ?? 600_000
      const sleep = options.sleep ?? defaultSleep
      const deadline = Date.now() + timeoutMs
      for (;;) {
        const deployment = await this.getDeployment(deploymentUuid)
        if (TERMINAL_STATUSES.has(deployment.status)) return deployment
        if (Date.now() >= deadline) throw new RiotTimeoutError(`coolify:deployments/${deploymentUuid}`, timeoutMs)
        await sleep(intervalMs)
      }
    },

    power: (type, uuid, action) => http.post(`/api/v1/${COLLECTIONS[type]}/${uuid}/${action}`),

    listEnvs: (applicationUuid) => http.get<CoolifyEnvVar[]>(`/api/v1/applications/${applicationUuid}/envs`),

    // Every env key exists as a production and a preview row; is_preview selects which one is written.
    updateEnv: (applicationUuid, env) =>
      http.patch(`/api/v1/applications/${applicationUuid}/envs`, {
        body: { key: env.key, value: env.value, is_preview: env.isPreview ?? false },
      }),

    async getApplicationLogs(applicationUuid, lines = 100) {
      const result = await http.get<{ logs?: string }>(`/api/v1/applications/${applicationUuid}/logs`, {
        query: { lines },
      })
      return result.logs ?? ''
    },
  }
}