// Application payloads embed sentinel_token and other credentials; only allowlisted fields leave the connector.
const APPLICATION_FIELDS = [
  'uuid',
  'name',
  'description',
  'status',
  'fqdn',
  'git_repository',
  'git_branch',
  'git_commit_sha',
  'build_pack',
  'docker_compose_location',
  'docker_compose_domains',
  'created_at',
  'updated_at',
] as const

const SENSITIVE_KEY = /password|secret|token/i

export function sanitizeApplication(record: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const field of APPLICATION_FIELDS) {
    if (field in record) result[field] = record[field]
  }
  return result
}

export function stripSensitive(record: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(record)) {
    if (!SENSITIVE_KEY.test(key)) result[key] = value
  }
  return result
}