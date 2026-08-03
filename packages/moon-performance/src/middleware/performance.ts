import type { IncomingMessage, ServerResponse } from 'node:http'
import { trackRequest } from '../trackers/request.js'

/**
 * Express/HTTP middleware to automatically track requests
 */
export function performanceMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => Promise<void>) => {
    const startTime = Date.now()
    
    // Capture original end
    const originalEnd = res.end
    
    // Override end to capture metrics
    res.end = function(this: ServerResponse, ...args: any[]) {
      const latencyMs = Date.now() - startTime
      
      // Track the request
      trackRequest({
        method: req.method || 'GET',
        path: req.url || '/',
        latencyMs,
        statusCode: res.statusCode,
        cacheStatus: (res.getHeader('X-Cache') as any) || 'N/A',
        userAgent: req.headers['user-agent'],
        ipAddress: req.headers['x-forwarded-for'] as string || req.socket?.remoteAddress,
      }).catch(() => {})
      
      // Call original end
      return originalEnd.apply(this, args as any)
    }
    
    await next()
  }
}
