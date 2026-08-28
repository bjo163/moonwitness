import type { IncomingMessage, ServerResponse } from 'node:http'
import { getDb, registry, Vertex } from '@moon/orm'
import type { FieldDef } from '@moon/orm'
import { sendJson } from '../utils/http.ts'

export type MatrixViewMode = 'table' | 'kanban' | 'metrics'
export type MatrixAccentColor = 'cyan' | 'green' | 'yellow' | 'purple' | 'pink'

export interface MatrixTableConfig {
  columns: string[]
  defaultSort?: { field: string; direction: 'asc' | 'desc' }
  searchKeys?: string[]
}

export interface MatrixKanbanConfig {
  groupBy: string
  titleField: string
  subtitleField?: string
  priorityField?: string
  dateField?: string
  userField?: string
  badgeField?: string
}

export interface MatrixFormSection {
  title: string
  columns?: 1 | 2 | 3
  fields: string[]
}

export interface MatrixFormConfig {
  title?: string
  statusBar?: { field: string }
  headerActions?: Array<{ label: string; action: string; variant?: 'primary' | 'warning' | 'danger'; confirm?: string }>
  sections: MatrixFormSection[]
  chatter?: boolean
}

export interface ViewManifest {
  defaultView: MatrixViewMode
  accentColor?: MatrixAccentColor
  icon?: string
  table?: MatrixTableConfig
  kanban?: MatrixKanbanConfig
  form?: MatrixFormConfig
  metrics?: { groupBy: string; aggregateField?: string }
}

export interface FieldMeta {
  name: string
  type: string
  label: string
  required: boolean
  widget: string
  selection?: [string, string][]
  comodel?: string
  help?: string
  default?: unknown
  readonly: boolean
  invisible: boolean
  tracking: boolean
  unique: boolean
  size?: number
  groupOperator?: string
}

// ── VIEW MANIFEST REGISTRY ──────────────────────────────────────────────────
// Addon packages register their view manifests here during server boot.
const viewManifestRegistry = new Map<string, ViewManifest>()

/**
 * Register view manifests from an addon package.
 * Called during server initialization for each addon that exports `views`.
 */
export function registerViewManifests(
  manifests: Record<string, ViewManifest>
): void {
  for (const [modelName, manifest] of Object.entries(manifests)) {
    viewManifestRegistry.set(modelName, manifest)
  }
}

/**
 * Get the view manifest for a specific model.
 * Returns undefined if no manifest was registered.
 */
export function getViewManifest(
  modelName: string
): ViewManifest | undefined {
  return viewManifestRegistry.get(modelName)
}

// ── SCHEMA INTROSPECTION UTILITIES ──────────────────────────────────────────

/**
 * Convert a camelCase field name to a human-readable label.
 * Examples: "projectId" → "Project", "estimatedHours" → "Estimated Hours",
 *           "slaStatus" → "SLA Status", "dueDate" → "Due Date"
 */
function humanizeFieldName(name: string): string {
  // Remove trailing "Id" for foreign keys
  let clean = name.replace(/Id$/, '')
  // Remove trailing "Ids" for x2many
  clean = clean.replace(/Ids$/, '')
  // Insert space before uppercase letters
  clean = clean.replace(/([A-Z])/g, ' $1')
  // Capitalize first letter
  clean = clean.charAt(0).toUpperCase() + clean.slice(1)
  // Handle known acronyms
  clean = clean.replace(/\bSla\b/g, 'SLA')
  clean = clean.replace(/\bRfc\b/g, 'RFC')
  clean = clean.replace(/\bUrl\b/g, 'URL')
  clean = clean.replace(/\bApi\b/g, 'API')
  clean = clean.replace(/\bSso\b/g, 'SSO')
  clean = clean.replace(/\bAi\b/g, 'AI')
  return clean.trim()
}

/**
 * Infer the best widget type from a FieldDef when no explicit widget is set.
 */
function inferWidget(def: FieldDef): string {
  if (def.widget) return def.widget
  switch (def.type) {
    case 'char': return 'input'
    case 'text': return 'textarea'
    case 'integer': return 'number'
    case 'float': return 'number'
    case 'boolean': return 'toggle'
    case 'date': return 'datepicker'
    case 'datetime': return 'datepicker'
    case 'selection': return 'select'
    case 'many2one': return 'autocomplete'
    case 'one2many': return 'tags'
    case 'many2many': return 'tags'
    case 'vector': return 'input'
    default: return 'input'
  }
}

/**
 * Auto-generate a default view manifest from field definitions
 * when the addon package doesn't provide one explicitly.
 */
function generateDefaultViews(
  fieldDefs: Record<string, FieldDef>,
  recName: string
): ViewManifest {
  const fieldNames = Object.keys(fieldDefs)

  // Auto-detect table columns: exclude internal/computed/invisible fields
  const tableColumns = fieldNames.filter(f => {
    const def = fieldDefs[f]!
    if (def.invisible) return false
    if (def.type === 'one2many' || def.type === 'many2many') return false
    if (def.type === 'text') return false // text is too long for table columns
    if (def.type === 'vector') return false
    if (f === 'parentPath' || f === 'isActive') return false
    if (f === 'createdAt' || f === 'updatedAt') return false
    if (def.compute && !def.store) return false
    return true
  })

  // Auto-detect kanban potential: look for a many2one "stageId" or "status" selection field
  const stageField = fieldNames.find(f =>
    (f === 'stageId' || f === 'statusId') && fieldDefs[f]!.type === 'many2one'
  )
  const statusSelection = fieldNames.find(f =>
    f === 'status' && fieldDefs[f]!.type === 'selection'
  )
  const kanbanGroupBy = stageField || statusSelection

  // Auto-detect form sections
  const formFields = fieldNames.filter(f => {
    const def = fieldDefs[f]!
    if (def.invisible) return false
    if (f === 'parentPath') return false
    if (f === 'createdAt' || f === 'updatedAt') return false
    if (def.compute && !def.store) return false
    return true
  })

  // Split text fields into their own section
  const normalFields = formFields.filter(f => fieldDefs[f]!.type !== 'text')
  const textFields = formFields.filter(f => fieldDefs[f]!.type === 'text')

  const sections: MatrixFormSection[] = [
    { title: 'General', columns: 2, fields: normalFields },
  ]
  if (textFields.length > 0) {
    sections.push({ title: 'Details', columns: 1, fields: textFields })
  }

  const manifest: ViewManifest = {
    defaultView: 'table' as MatrixViewMode,
    table: {
      columns: tableColumns.slice(0, 8), // cap at 8 columns for readability
      searchKeys: [recName],
    },
    form: {
      sections,
    },
  }

  // Add kanban config if a stage/status grouping field exists
  if (kanbanGroupBy) {
    manifest.defaultView = 'kanban'
    manifest.kanban = {
      groupBy: kanbanGroupBy,
      titleField: recName,
    }
  }

  return manifest
}

/**
 * Build rich field metadata for a single model.
 */
function buildFieldMeta(
  fieldDefs: Record<string, FieldDef>
): Record<string, FieldMeta> {
  const fields: Record<string, FieldMeta> = {}
  for (const [key, def] of Object.entries(fieldDefs)) {
    fields[key] = {
      name: key,
      type: def.type,
      label: def.label || humanizeFieldName(key),
      required: def.required || false,
      widget: inferWidget(def),
      selection: def.selection || undefined,
      comodel: def.comodel || undefined,
      help: def.help || undefined,
      default: typeof def.default === 'function' ? undefined : def.default,
      readonly: def.readonly || false,
      invisible: def.invisible || false,
      tracking: def.tracking || false,
      unique: def.unique || false,
      size: def.size || undefined,
      groupOperator: def.groupOperator || undefined,
    }
  }
  return fields
}

// ── HEALTH & STATUS HANDLERS ────────────────────────────────────────────────

/**
 * Handle /health/live liveness probe (checks process responsiveness without depending on DB)
 */
export function handleLiveness(
  req: IncomingMessage,
  res: ServerResponse
): void {
  const memory = process.memoryUsage()
  sendJson(res, 200, {
    status: 'live',
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`
    },
    timestamp: new Date().toISOString()
  }, req)
}

/**
 * Handle /health/ready readiness probe (checks downstream database connection & readiness)
 */
export async function handleReadiness(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const db = getDb()
    await db.raw('SELECT 1 as ping')

    sendJson(res, 200, {
      status: 'ready',
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }, req)
  } catch (err: any) {
    sendJson(res, 503, {
      status: 'unready',
      database: 'disconnected',
      error: 'Database service unavailable',
      timestamp: new Date().toISOString()
    }, req)
  }
}

/**
 * Handle general /health, /healthz, /api/health probe endpoints
 */
export async function handleHealth(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const db = getDb()
    await db.raw('SELECT 1 as ping')
    const memory = process.memoryUsage()

    sendJson(res, 200, {
      status: 'healthy',
      database: 'connected',
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`
      },
      timestamp: new Date().toISOString()
    }, req)
  } catch (err: any) {
    sendJson(res, 503, {
      status: 'unhealthy',
      database: 'disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    }, req)
  }
}

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
      driver: db.client?.driverName || 'pg',
      ping: result[0]?.ping || 1,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }, req)
  } catch (err: any) {
    sendJson(res, 503, {
      status: 'error',
      message: 'Database connection error'
    }, req)
  }
}

// ── MODEL SCHEMA INTROSPECTION HANDLERS ─────────────────────────────────────

/**
 * Handle /meta/models endpoint — returns summary of all registered models
 */
export function handleMetaModels(
  req: IncomingMessage,
  res: ServerResponse
): void {
  const models = Array.from(registry.entries()).map(([name, model]) => {
    const ModelClass = model as typeof Vertex
    const fieldDefs = Vertex.getFieldDefs(ModelClass)
    const manifest = getViewManifest(name)
    return {
      name,
      description: ModelClass._description || '',
      recName: ModelClass._rec_name || 'name',
      fieldCount: Object.keys(fieldDefs).length,
      icon: manifest?.icon,
      accentColor: manifest?.accentColor,
      defaultView: manifest?.defaultView || 'table',
    }
  })

  sendJson(res, 200, {
    count: models.length,
    models
  }, req)
}

/**
 * Handle /api/meta/model/:name endpoint — returns rich schema for a single model.
 * This is the core schema introspection API for the Cosmic Matrix Engine.
 */
export function handleMetaModel(
  req: IncomingMessage,
  res: ServerResponse,
  modelName: string
): void {
  const ModelClass = registry.get(modelName)
  if (!ModelClass) {
    return sendJson(res, 404, {
      error: `Model '${modelName}' not found`,
      code: 'MODEL_NOT_FOUND'
    }, req)
  }

  const fieldDefs = Vertex.getFieldDefs(ModelClass as typeof Vertex)
  const fields = buildFieldMeta(fieldDefs)

  // Resolve view manifest: explicit from package, or auto-generated fallback
  const recName = (ModelClass as typeof Vertex)._rec_name || 'name'
  const manifest = getViewManifest(modelName) || generateDefaultViews(fieldDefs, recName)

  sendJson(res, 200, {
    name: modelName,
    description: (ModelClass as typeof Vertex)._description || '',
    recName,
    fields,
    views: manifest,
  }, req)
}
