import { describe, it, expect, afterEach } from 'vitest'
import { createProxyHandler } from '../src/proxy.js'
import { startFakeUpstream, startProxyFront } from './proxy-test-utils.js'

const cleanups: Array<() => Promise<void>> = []
afterEach(async () => {
  while (cleanups.length) {
    const fn = cleanups.pop()
    if (fn) await fn()
  }
})

async function setup(upstreamResponse: { contentType: string; body: string }) {
  const upstream = await startFakeUpstream(upstreamResponse)
  const handler = createProxyHandler({
    targetUrl: `${upstream.url}/feed`,
    cache: '5m',
    cacheSweepIntervalMs: 0,
  })
  const front = await startProxyFront(handler)
  cleanups.push(() => front.close(), () => upstream.close())
  return { front }
}

describe('proxy response content-type whitelist (T-27 / S-40)', () => {
  it('does not forward a text/html upstream response as HTML', async () => {
    const { front } = await setup({
      contentType: 'text/html',
      body: '<html><body><script>alert(document.cookie)</script></body></html>',
    })
    const res = await fetch(`${front.url}/api/external/trends`)
    const contentType = res.headers.get('content-type') ?? ''
    expect(res.status).toBe(200)
    expect(contentType.toLowerCase()).not.toContain('text/html')
    expect(contentType.toLowerCase()).toContain('text/plain')
    expect(res.headers.get('x-content-type-options')).toBe('nosniff')
  })

  it('sanitizes text/html with a charset parameter to text/plain', async () => {
    const { front } = await setup({
      contentType: 'text/html; charset=utf-8',
      body: '<h1>upstream</h1>',
    })
    const res = await fetch(`${front.url}/api/external/trends`)
    expect((res.headers.get('content-type') ?? '').toLowerCase()).toContain('text/plain')
  })

  it('passes application/json through as JSON', async () => {
    const { front } = await setup({ contentType: 'application/json', body: '{"value":42}' })
    const res = await fetch(`${front.url}/api/external/nasa/neo`)
    expect((res.headers.get('content-type') ?? '').toLowerCase()).toContain('application/json')
    expect(await res.json()).toEqual({ value: 42 })
  })

  it('passes text/xml through as XML', async () => {
    const { front } = await setup({
      contentType: 'text/xml',
      body: '<?xml version="1.0"?><rss><channel/></rss>',
    })
    const res = await fetch(`${front.url}/api/external/trends`)
    expect((res.headers.get('content-type') ?? '').toLowerCase()).toContain('text/xml')
    expect(await res.text()).toContain('<rss>')
  })

  it('passes text/plain through as plain text', async () => {
    const { front } = await setup({ contentType: 'text/plain', body: 'plain upstream text' })
    const res = await fetch(`${front.url}/api/external/trends`)
    expect((res.headers.get('content-type') ?? '').toLowerCase()).toContain('text/plain')
    expect(await res.text()).toBe('plain upstream text')
  })

  it('serves a cached HTML response as text/plain on a cache HIT', async () => {
    const { front } = await setup({ contentType: 'text/html', body: '<script>x</script>' })
    await fetch(`${front.url}/api/external/trends`)
    const second = await fetch(`${front.url}/api/external/trends`)
    expect(second.headers.get('x-cache')).toBe('HIT')
    expect((second.headers.get('content-type') ?? '').toLowerCase()).not.toContain('text/html')
    expect((second.headers.get('content-type') ?? '').toLowerCase()).toContain('text/plain')
  })
})