import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * CORS middleware
 */
export function corsMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => Promise<void>
): Promise<void> | void {
  const origin = (req.headers.origin as string) || '*'
  const reqHeaders =
    (req?.headers['access-control-request-headers'] as string) ||
    'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Last-Event-ID'

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE, PATCH')
  res.setHeader('Access-Control-Allow-Headers', reqHeaders)

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  return next()
}
