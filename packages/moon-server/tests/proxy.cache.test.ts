import { describe, it, expect, afterEach } from 'vitest'
import { ExternalCache, createProxyHandler } from '../src/proxy.js'
import { startFakeUpstream, startProxyFront } from './proxy-test-utils.js'

const caches: ExternalCache[] = []
const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  for (const cache of caches.splice(0)) cache.dispose()
  while (cleanups.length) {
    const fn = cleanups.pop()
    if (fn) await fn()
  }
})

function makeCache(options: ConstructorParameters<typeof ExternalCache>[0] = {}) {
  const cache = new ExternalCache({ sweepIntervalMs: 0, ...options })
  caches.push(cache)
  return cache
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('ExternalCache bounding, LRU and sweep (T-11 / S-38)', () => {
  it('caps the number of entries and evicts the least-recently-used', () => {
    const cache = makeCache({ maxEntries: 5 })
    for (let i = 0; i < 10; i++) cache.set(`key-${i}`, { i }, 60000)
    expect(cache.size).toBeLessThanOrEqual(5)
    expect(cache.keys()).toEqual(['key-5', 'key-6', 'key-7', 'key-8', 'key-9'])
    expect(cache.get('key-0')).toBeNull()
    expect(cache.get('key-9')).not.toBeNull()
  })

  it('keeps 10,000 unique URLs within the default entry cap', () => {
    const cache = makeCache()
    for (let i = 0; i < 10000; i++) {
      cache.set(`GET:/api/external/nasa/neo?start_date=2026-01-${i}`, { i }, 60000)
    }
    expect(cache.size).toBeLessThanOrEqual(1000)
  })

  it('promotes an entry on get so LRU eviction skips recently used keys', () => {
    const cache = makeCache({ maxEntries: 3 })
    cache.set('a', 1, 60000)
    cache.set('b', 2, 60000)
    cache.set('c', 3, 60000)
    cache.get('a')
    cache.set('d', 4, 60000)
    expect(cache.keys()).toEqual(['c', 'a', 'd'])
    expect(cache.get('b')).toBeNull()
    expect(cache.get('a')).not.toBeNull()
  })

  it('sweeps expired entries periodically without any get call', async () => {
    const cache = new ExternalCache({ maxEntries: 100, sweepIntervalMs: 20 })
    caches.push(cache)
    cache.set('stale-1', 1, 5)
    cache.set('stale-2', 2, 5)
    cache.set('fresh', 3, 60000)
    expect(cache.size).toBe(3)
    await sleep(90)
    expect(cache.size).toBe(1)
    expect(cache.keys()).toEqual(['fresh'])
  })

  it('manual sweep removes only expired entries', () => {
    const cache = makeCache()
    cache.set('expired', 1, -1)
    cache.set('live', 2, 60000)
    const removed = cache.sweep()
    expect(removed).toBe(1)
    expect(cache.keys()).toEqual(['live'])
  })
})

describe('proxy cache key normalization (T-11 / S-39)', () => {
  async function setup() {
    const upstream = await startFakeUpstream({ contentType: 'application/json', body: '{"data":"ok"}' })
    const handler = createProxyHandler({
      targetUrl: `${upstream.url}/feed`,
      cache: '5m',
      query: ['start_date'],
      cacheSweepIntervalMs: 0,
    })
    const front = await startProxyFront(handler)
    cleanups.push(() => front.close(), () => upstream.close())
    return { upstream, front }
  }

  it('hits the same cache entry when only a non-whitelisted param differs', async () => {
    const { upstream, front } = await setup()
    const first = await fetch(`${front.url}/api/external/nasa/neo?start_date=2026-01-01&junk=aaa`)
    const second = await fetch(`${front.url}/api/external/nasa/neo?start_date=2026-01-01&junk=bbb`)
    expect(first.headers.get('x-cache')).toBe('MISS')
    expect(second.headers.get('x-cache')).toBe('HIT')
    expect(upstream.requests).toHaveLength(1)
  })

  it('creates a distinct entry when a whitelisted param differs', async () => {
    const { upstream, front } = await setup()
    const first = await fetch(`${front.url}/api/external/nasa/neo?start_date=2026-01-01`)
    const second = await fetch(`${front.url}/api/external/nasa/neo?start_date=2026-02-02`)
    expect(first.headers.get('x-cache')).toBe('MISS')
    expect(second.headers.get('x-cache')).toBe('MISS')
    expect(upstream.requests).toHaveLength(2)
  })

  it('does not let cache-busting arbitrary params mint new upstream fetches', async () => {
    const { upstream, front } = await setup()
    for (let i = 0; i < 50; i++) {
      const res = await fetch(
        `${front.url}/api/external/nasa/neo?start_date=2026-01-01&bust=${Math.random()}`
      )
      expect(res.headers.get('x-cache')).toBe(i === 0 ? 'MISS' : 'HIT')
    }
    expect(upstream.requests).toHaveLength(1)
  })

  it('still serves a cache HIT for a legitimate repeated URL', async () => {
    const { upstream, front } = await setup()
    await fetch(`${front.url}/api/external/nasa/neo?start_date=2026-01-01`)
    const again = await fetch(`${front.url}/api/external/nasa/neo?start_date=2026-01-01`)
    expect(again.headers.get('x-cache')).toBe('HIT')
    expect(await again.json()).toEqual({ data: 'ok' })
    expect(upstream.requests).toHaveLength(1)
  })
})