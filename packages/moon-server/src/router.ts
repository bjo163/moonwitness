import http from 'node:http'

export type HttpHandler = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void> | void

export interface Route {
  method: string
  path: string
  handler: HttpHandler
  params?: string[]
  middlewares?: {
    before?: HttpHandler[]
  }
}

export interface ProxyRoute extends Route {
  proxy?: {
    targetUrl: string
    cacheMs: number
    query?: string[]
    headers?: Record<string, string>
    apiKey?: string
  }
}

export const globalRoutes: Route[] = []
