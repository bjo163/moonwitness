import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Parse JSON body from incoming HTTP request
 */
export async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

/**
 * Send JSON response with CORS headers
 */
export function sendJson(
  res: ServerResponse,
  statusCode: number,
  data: any,
  req?: IncomingMessage
) {
  if (res.headersSent) return

  const origin = (req?.headers.origin as string) || '*'
  const reqHeaders =
    (req?.headers['access-control-request-headers'] as string) ||
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Last-Event-ID'

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE, PATCH',
    'Access-Control-Allow-Headers': reqHeaders
  })
  res.end(JSON.stringify(data))
}

/**
 * Parse URL and query parameters
 */
export function parseUrl(req: IncomingMessage): { pathname: string; searchParams: URLSearchParams } {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
  return {
    pathname: url.pathname,
    searchParams: url.searchParams
  }
}
