import http from 'node:http'
import type { AddressInfo } from 'node:net'
import type { HttpHandler } from '../src/router.js'

export interface RecordedRequest {
  method: string
  url: string
  headers: http.IncomingHttpHeaders
  body: string
}

export interface FakeUpstream {
  url: string
  requests: RecordedRequest[]
  setResponse: (r: { status?: number; contentType?: string; body?: string }) => void
  close: () => Promise<void>
}

export async function startFakeUpstream(initial?: {
  status?: number
  contentType?: string
  body?: string
}): Promise<FakeUpstream> {
  const requests: RecordedRequest[] = []
  let response = {
    status: initial?.status ?? 200,
    contentType: initial?.contentType ?? 'application/json',
    body: initial?.body ?? '{"ok":true}',
  }
  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(c as Buffer))
    req.on('end', () => {
      requests.push({
        method: req.method ?? 'GET',
        url: req.url ?? '/',
        headers: req.headers,
        body: Buffer.concat(chunks).toString('utf8'),
      })
      res.writeHead(response.status, { 'Content-Type': response.contentType })
      res.end(response.body)
    })
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const port = (server.address() as AddressInfo).port
  return {
    url: `http://127.0.0.1:${port}`,
    requests,
    setResponse: (r) => {
      response = { ...response, ...r }
    },
    close: () =>
      new Promise<void>((resolve) => {
        server.closeAllConnections()
        server.close(() => resolve())
      }),
  }
}

export interface ProxyFront {
  url: string
  requests: RecordedRequest[]
  close: () => Promise<void>
}

export async function startProxyFront(handler: HttpHandler): Promise<ProxyFront> {
  const requests: RecordedRequest[] = []
  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = []
    req.on('data', (c) => chunks.push(c as Buffer))
    req.on('end', () => {
      requests.push({
        method: req.method ?? 'GET',
        url: req.url ?? '/',
        headers: req.headers,
        body: Buffer.concat(chunks).toString('utf8'),
      })
      void handler(req, res)
    })
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const port = (server.address() as AddressInfo).port
  return {
    url: `http://127.0.0.1:${port}`,
    requests,
    close: () =>
      new Promise<void>((resolve) => {
        server.closeAllConnections()
        server.close(() => resolve())
      }),
  }
}