import { describe, expect, it, vi } from 'vitest'
import { createHttpClient } from './http.js'
import { RiotHttpError, RiotTimeoutError } from './errors.js'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

describe('createHttpClient', () => {
  it('sends bearer auth and builds query params, skipping undefined', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ ok: true }))
    const client = createHttpClient({ baseUrl: 'https://example.test', token: 'secret', fetch: fetchMock })

    const result = await client.get<{ ok: boolean }>('/api/items', { query: { page: 2, force: 'true', tag: undefined } })

    expect(result).toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://example.test/api/items?page=2&force=true')
    expect((init.headers as Record<string, string>).authorization).toBe('Bearer secret')
  })

  it('serializes JSON bodies for POST and PATCH', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}))
    const client = createHttpClient({ baseUrl: 'https://example.test', fetch: fetchMock })

    await client.patch('/api/items/1', { body: { key: 'A', value: 'B' } })

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(init.method).toBe('PATCH')
    expect(init.body).toBe(JSON.stringify({ key: 'A', value: 'B' }))
    expect((init.headers as Record<string, string>)['content-type']).toBe('application/json')
  })

  it('throws RiotHttpError with status and parsed body on non-2xx', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ message: 'Not found.' }, 404))
    const client = createHttpClient({ baseUrl: 'https://example.test', fetch: fetchMock })

    const error = await client.get('/api/missing').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(RiotHttpError)
    expect((error as RiotHttpError).status).toBe(404)
    expect((error as RiotHttpError).body).toEqual({ message: 'Not found.' })
  })

  it('maps abort/timeout failures to RiotTimeoutError', async () => {
    const timeout = new Error('The operation was aborted')
    timeout.name = 'TimeoutError'
    const fetchMock = vi.fn(async () => {
      throw timeout
    })
    const client = createHttpClient({ baseUrl: 'https://example.test', timeoutMs: 5, fetch: fetchMock })

    await expect(client.get('/api/slow')).rejects.toBeInstanceOf(RiotTimeoutError)
  })

  it('returns plain text when the response is not JSON', async () => {
    const fetchMock = vi.fn(async () => new Response('hello', { status: 200 }))
    const client = createHttpClient({ baseUrl: 'https://example.test', fetch: fetchMock })

    await expect(client.get<string>('/api/text')).resolves.toBe('hello')
  })
})