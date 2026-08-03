import type { IncomingMessage, ServerResponse } from 'node:http'
import { getDb, registry } from '@moon/orm'
import { sendJson } from '../utils/http.js'

/**
 * Handle /db/status endpoint
 */
export async function handleDbStatus(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const db = getDb()
    const result = await db.raw('SELECT 1 as ping')
    
    sendJson(res, 200, {
      status: 'connected',
      driver: db.client.driverName,
      ping: result[0]?.ping || 1,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }, req)
  } catch (err: any) {
    sendJson(res, 500, {
      status: 'error',
      message: err.message
    }, req)
  }
}

/**
 * Handle /meta/models endpoint
 */
export function handleMetaModels(
  req: IncomingMessage,
  res: ServerResponse
): void {
  const models = Array.from(registry.entries()).map(([name, model]) => {
    const fields = (model as any)._fields || {}
    return {
      name,
      description: (model as any)._description || '',
      fields: Object.keys(fields).map(fieldName => ({
        name: fieldName,
        type: fields[fieldName]?.type || 'unknown'
      }))
    }
  })

  sendJson(res, 200, {
    count: models.length,
    models
  }, req)
}
