export type CoolifyResourceType = 'application' | 'service' | 'database'

export type CoolifyPowerAction = 'start' | 'stop' | 'restart'

export interface CoolifyProject {
  uuid: string
  name: string
  description?: string
  [key: string]: unknown
}

export interface CoolifyServer {
  uuid: string
  name: string
  ip?: string
  [key: string]: unknown
}

export interface CoolifyApplication {
  uuid: string
  name?: string
  status?: string
  fqdn?: string | null
  git_repository?: string
  git_branch?: string
  git_commit_sha?: string
  [key: string]: unknown
}

export interface CoolifyDeploymentLogEntry {
  output: string
  hidden?: boolean
  timestamp?: string
  [key: string]: unknown
}

export interface CoolifyDeployment {
  uuid: string
  status: string
  commit?: string | null
  finished_at?: string | null
  application_name?: string
  logs: CoolifyDeploymentLogEntry[]
  [key: string]: unknown
}

export interface CoolifyEnvVar {
  id?: number
  key: string
  value: string
  is_preview: boolean
  [key: string]: unknown
}

export interface DeployResult {
  deploymentUuid: string
}

export interface WaitOptions {
  intervalMs?: number
  timeoutMs?: number
  sleep?: (ms: number) => Promise<void>
}