import { describe, it, expect, afterEach } from 'vitest'
import { createProxyHandler, setUpstreamCredential, clearUpstreamCredentials } from '../src/proxy.js'
import { startFakeUpstream, startProxyFront } from './proxy-test-utils.js'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  clearUpstreamCredentials()
  while (cleanups.length) {
    const fn = cleanups.pop()
    if (fn) await fn()
  }
})

async function setup(opts: Parameters<typeof createProxyHandler>[0]) {
  const upstream = await startFakeUpstream({ contentType: 'application/json', body: '{"data":"ok"}' })
  const handler = createProxyHandler({ ...opts, targetUrl: `${upstream.url}/feed`, cacheSweepIntervalMs: 0 })
  const front = await startProxyFront(handler)
  cleanups.push(() => front.close(), () => upstream.close())
  return { upstream, front }
}

describe('proxy upstream credential handling (T-04 / S-36 / S-37)', () => {
  it('does not forward the client Authorization header to the upstream', async () => {
    const { upstream, front } = await setup({ cache: '5m' })
    const res = await fetch(`${front.url}/api/external/nasa/neo`, {
      headers: { Authorization: 'Bearer CLIENT_MOONWITNESS_JWT' },
    })
    expect(res.status).toBe(200)
    expect(front.requests[0]?.headers['authorization']).toBe('Bearer CLIENT_MOONWITNESS_JWT')
    expect(upstream.requests).toHaveLength(1)
    expect(upstream.requests[0]?.headers['authorization']).toBeUndefined()
  })

  it('does not forward client Cookie or Proxy-Authorization headers to the upstream', async () => {
    const { upstream, front } = await setup({ cache: '5m' })
    await fetch(`${front.url}/api/external/nasa/neo`, {
      headers: {
        Authorization: 'Bearer CLIENT_TOKEN',
        Cookie: 'session=secret-cookie-value',
        'Proxy-Authorization': 'Basic cHJveHk6c2VjcmV0',
      },
    })
    expect(front.requests[0]?.headers['cookie']).toBe('session=secret-cookie-value')
    expect(front.requests[0]?.headers['proxy-authorization']).toBe('Basic cHJveHk6c2VjcmV0')
    const received = upstream.requests[0]?.headers ?? {}
    expect(received['authorization']).toBeUndefined()
    expect(received['cookie']).toBeUndefined()
    expect(received['proxy-authorization']).toBeUndefined()
  })

  it('still delivers a configured server-side header credential to the upstream', async () => {
    const { upstream, front } = await setup({
      cache: '5m',
      credential: { headerName: 'Authorization', scheme: 'Bearer', value: 'SERVER_UPSTREAM_TOKEN' },
    })
    await fetch(`${front.url}/api/external/nasa/neo`, {
      headers: { Authorization: 'Bearer CLIENT_TOKEN' },
    })
    expect(upstream.requests[0]?.headers['authorization']).toBe('Bearer SERVER_UPSTREAM_TOKEN')
  })

  it('still delivers a configured server-side query credential (api_key) to the upstream', async () => {
    const { upstream, front } = await setup({
      cache: '5m',
      credential: { queryParam: 'api_key', value: 'SERVER_NASA_KEY' },
    })
    await fetch(`${front.url}/api/external/nasa/neo`, {
      headers: { Authorization: 'Bearer CLIENT_TOKEN' },
    })
    const receivedUrl = new URL(upstream.requests[0]!.url, upstream.url)
    expect(receivedUrl.searchParams.get('api_key')).toBe('SERVER_NASA_KEY')
    expect(upstream.requests[0]?.headers['authorization']).toBeUndefined()
  })

  it('resolves a per-upstream credential from the server-side registry', async () => {
    setUpstreamCredential('nasa', { queryParam: 'api_key', value: 'REGISTRY_NASA_KEY' })
    const { upstream, front } = await setup({ cache: '5m', upstream: 'nasa' })
    await fetch(`${front.url}/api/external/nasa/neo`)
    const receivedUrl = new URL(upstream.requests[0]!.url, upstream.url)
    expect(receivedUrl.searchParams.get('api_key')).toBe('REGISTRY_NASA_KEY')
  })

  it('never lets a client Authorization override the configured server credential', async () => {
    const { upstream, front } = await setup({
      cache: '5m',
      credential: { headerName: 'Authorization', scheme: 'Bearer', value: 'SERVER_TOKEN' },
    })
    await fetch(`${front.url}/api/external/nasa/neo`, {
      headers: { Authorization: 'Bearer ATTACKER_CLIENT_TOKEN' },
    })
    expect(upstream.requests[0]?.headers['authorization']).toBe('Bearer SERVER_TOKEN')
  })
})