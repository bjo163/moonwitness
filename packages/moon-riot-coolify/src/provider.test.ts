import { afterEach, describe, expect, it, vi } from 'vitest'
import { RiotError, RiotTimeoutError } from '@moon/riot'
import { createCoolifyProvider } from './provider'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function makeProvider(fetchMock: (...args: never[]) => Promise<Response>) {
  return createCoolifyProvider({ baseUrl: 'https://coolify.test', token: 'test-token', fetch: fetchMock as typeof fetch })
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('createCoolifyProvider config', () => {
  it('reads baseUrl and token from environment when not configured', () => {
    vi.stubEnv('COOLIFY_BASE_URL', 'https://env.coolify.test')
    vi.stubEnv('COOLIFY_TOKEN', 'env-token')
    expect(() => createCoolifyProvider()).not.toThrow()
  })

  it('fails fast when the token is missing', () => {
    vi.stubEnv('COOLIFY_BASE_URL', 'https://env.coolify.test')
    vi.stubEnv('COOLIFY_TOKEN', '')
    expect(() => createCoolifyProvider()).toThrow(RiotError)
  })
})

describe('coolify deploy', () => {
  it('uses the query-param deploy form and returns the deployment handle', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ deployments: [{ deployment_uuid: 'dep-1' }] }))
    const provider = makeProvider(fetchMock)

    const result = await provider.deploy('app-uuid')

    expect(result).toEqual({ deploymentUuid: 'dep-1' })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://coolify.test/api/v1/deploy?uuid=app-uuid&force=true')
    expect(init.method).toBe('POST')
  })

  it('throws when the response has no deployment_uuid', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ deployments: [] }))
    const provider = makeProvider(fetchMock)

    await expect(provider.deploy('app-uuid')).rejects.toBeInstanceOf(RiotError)
  })
})

describe('coolify deployments', () => {
  it('parses the JSON-string logs field into entries', async () => {
    const logs = JSON.stringify([{ output: 'cloning', hidden: true }, { output: 'build ok' }])
    const fetchMock = vi.fn(async () => jsonResponse({ uuid: 'dep-1', status: 'finished', logs }))
    const provider = makeProvider(fetchMock)

    const deployment = await provider.getDeployment('dep-1')

    expect(deployment.status).toBe('finished')
    expect(deployment.logs).toEqual([{ output: 'cloning', hidden: true }, { output: 'build ok' }])
  })

  it('waitForDeployment polls until a terminal status', async () => {
    const statuses = ['in_progress', 'in_progress', 'finished']
    let call = 0
    const fetchMock = vi.fn(async () => jsonResponse({ uuid: 'dep-1', status: statuses[call++], logs: '[]' }))
    const provider = makeProvider(fetchMock)
    const sleep = vi.fn(async () => {})

    const deployment = await provider.waitForDeployment('dep-1', { intervalMs: 1, sleep })

    expect(deployment.status).toBe('finished')
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(sleep).toHaveBeenCalledTimes(2)
  })

  it('waitForDeployment times out while still in progress', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ uuid: 'dep-1', status: 'in_progress', logs: '[]' }))
    const provider = makeProvider(fetchMock)

    await expect(
      provider.waitForDeployment('dep-1', { intervalMs: 1, timeoutMs: 0, sleep: async () => {} }),
    ).rejects.toBeInstanceOf(RiotTimeoutError)
  })
})

describe('coolify resource reads', () => {
  it('strips sentinel_token and other secrets from application payloads', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ uuid: 'app-1', name: 'api', sentinel_token: 'leak', git_branch: 'main', password: 'leak' }),
    )
    const provider = makeProvider(fetchMock)

    const app = await provider.getApplication('app-1')

    expect(app).toEqual({ uuid: 'app-1', name: 'api', git_branch: 'main' })
  })

  it('strips sensitive keys from database payloads', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ uuid: 'db-1', name: 'pg', postgres_password: 'leak' }))
    const provider = makeProvider(fetchMock)

    const record = await provider.getResource('database', 'db-1')

    expect(record).toEqual({ uuid: 'db-1', name: 'pg' })
  })

  it('requests runtime logs with a lines parameter', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ logs: 'line1\nline2' }))
    const provider = makeProvider(fetchMock)

    const logs = await provider.getApplicationLogs('app-1', 50)

    expect(logs).toBe('line1\nline2')
    const [url] = fetchMock.mock.calls[0] as unknown as [string]
    expect(url).toBe('https://coolify.test/api/v1/applications/app-1/logs?lines=50')
  })
})

describe('coolify envs and power', () => {
  it('PATCH envs targets the production row by default', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}))
    const provider = makeProvider(fetchMock)

    await provider.updateEnv('app-1', { key: 'DATABASE_URL', value: 'postgres://x' })

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://coolify.test/api/v1/applications/app-1/envs')
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body as string)).toEqual({ key: 'DATABASE_URL', value: 'postgres://x', is_preview: false })
  })

  it('PATCH envs can target the preview row', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}))
    const provider = makeProvider(fetchMock)

    await provider.updateEnv('app-1', { key: 'K', value: 'V', isPreview: true })

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(JSON.parse(init.body as string)).toEqual({ key: 'K', value: 'V', is_preview: true })
  })

  it('power posts to the resource action path', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}))
    const provider = makeProvider(fetchMock)

    await provider.power('service', 'svc-1', 'restart')

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://coolify.test/api/v1/services/svc-1/restart')
    expect(init.method).toBe('POST')
  })
})