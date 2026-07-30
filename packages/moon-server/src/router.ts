import http from 'node:http'

export type HttpHandler = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void> | void

export interface Route {
  method: string
  path: string
  handler: HttpHandler
}

export const globalRoutes: Route[] = []

export function Controller(prefix: string) {
  return function (target: any) {
    target.prototype.$prefix = prefix
  }
}

function createMethodDecorator(method: string) {
  return function (path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value
      // We will register this when the class is instantiated, or we can just push it globally now.
      // But we need the prefix which is on the class. So we store it in a metadata array on the prototype.
      if (!target.$routes) {
        target.$routes = []
      }
      target.$routes.push({
        method,
        path,
        handlerName: propertyKey,
        originalMethod
      })
    }
  }
}

export const Get = createMethodDecorator('GET')
export const Post = createMethodDecorator('POST')
export const Put = createMethodDecorator('PUT')
export const Delete = createMethodDecorator('DELETE')

export function registerController(instance: any) {
  const prefix = instance.$prefix || ''
  const routes = instance.$routes || []
  
  for (const r of routes) {
    const fullPath = (prefix + r.path).replace(/\/+/g, '/')
    globalRoutes.push({
      method: r.method,
      path: fullPath,
      handler: async (req, res) => {
        try {
          await r.originalMethod.apply(instance, [req, res])
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: err.message }))
        }
      }
    })
  }
}
