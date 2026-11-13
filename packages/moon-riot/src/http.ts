import { RiotHttpError, RiotTimeoutError } from './errors.js'
import type { HttpMethod, QueryValue, RequestOptions } from './types.js'

export interface HttpClientConfig {
  baseUrl: string
  token?: string
  timeoutMs?: number
  fetch?: typeof fetch
}

export interface HttpClient {
  request<T>(method: HttpMethod, path: string, options?: RequestOptions): Promise<T>
  get<T>(path: string, options?: RequestOptions): Promise<T>
  post<T>(path: string, options?: RequestOptions): Promise<T>
  patch<T>(path: string, options?: RequestOptions): Promise<T>
}

function buildUrl(baseUrl: string, path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

export function createHttpClient(config: HttpClientConfig): HttpClient {
  const doFetch = config.fetch ?? globalThis.fetch
  const timeoutMs = config.timeoutMs ?? 30_000

  async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    const url = buildUrl(config.baseUrl, path, options.query)
    const headers: Record<string, string> = { accept: 'application/json', ...options.headers }
    if (config.token) headers.authorization = `Bearer ${config.token}`
    if (options.body !== undefined) headers['content-type'] = 'application/json'

    let response: Response
    try {
      response = await doFetch(url, {
        method,
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch (error) {
      if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
        throw new RiotTimeoutError(url, timeoutMs)
      }
      throw error
    }

    const text = await response.text()
    let body: unknown = text
    if (text.length > 0 && (response.headers.get('content-type') ?? '').includes('application/json')) {
      try {
        body = JSON.parse(text)
      } catch {
        body = text
      }
    }

    if (!response.ok) throw new RiotHttpError(response.status, url, body)
    return body as T
  }

  return {
    request,
    get: (path, options) => request('GET', path, options),
    post: (path, options) => request('POST', path, options),
    patch: (path, options) => request('PATCH', path, options),
  }
}