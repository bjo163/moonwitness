/**
 * ◈ MOONWITNESS SERVER — CANONICAL OPENAPI GENERATOR
 *
 * Derives the OpenAPI document from the canonical `@moon/protocol`
 * endpoint registry + generic REST contract + the live ORM model
 * registry. No endpoint is hand-described here; the document cannot
 * drift from runtime contracts because both read the same source.
 */
import { z, ZodTypeAny } from 'zod'
import { EndpointDef, MoonErrorSchema, PaginationMetaSchema } from '@moon/protocol'
import {
  getEndpointRegistry,
  restEndpointDefs,
} from '@moon/protocol'
import { registry } from '@moon/orm'
import { globalRoutes } from './router.js'

// ── ZOD → OPENAPI SCHEMA CONVERTER ──────────────────────────────
type JsonSchema = Record<string, any>

function isOptionalSchema(schema: any): boolean {
  const t = schema?._def?.typeName
  return t === 'ZodOptional' || t === 'ZodDefault' || t === 'ZodNullable'
}

export function zodToOpenApi(schema: ZodTypeAny | undefined): JsonSchema | undefined {
  if (!schema) return undefined
  const def: any = (schema as any)._def || {}
  const typeName: string | undefined = def.typeName

  switch (typeName) {
    case 'ZodString': {
      const out: JsonSchema = { type: 'string' }
      applyStringChecks(def, out)
      return out
    }
    case 'ZodNumber': {
      const out: JsonSchema = { type: 'number' }
      applyNumberChecks(def, out)
      return out
    }
    case 'ZodBoolean':
      return { type: 'boolean' }
    case 'ZodDate':
      return { type: 'string', format: 'date-time' }
    case 'ZodLiteral':
      return { type: typeof def.value, enum: [def.value] }
    case 'ZodEnum':
      return { type: 'string', enum: def.values }
    case 'ZodArray':
      return { type: 'array', items: zodToOpenApi(def.type) || {} }
    case 'ZodObject': {
      const shape = (schema as any).shape
      const properties: Record<string, JsonSchema> = {}
      const required: string[] = []
      for (const [key, value] of Object.entries<any>(shape)) {
        const converted = zodToOpenApi(value)
        if (converted) properties[key] = converted
        if (!isOptionalSchema(value)) required.push(key)
      }
      const out: JsonSchema = { type: 'object', properties }
      if (required.length) out.required = required
      if (def.catchall && def.catchall._def?.typeName !== 'ZodNever') {
        out.additionalProperties = zodToOpenApi(def.catchall) || true
      }
      return out
    }
    case 'ZodRecord':
      return { type: 'object', additionalProperties: zodToOpenApi(def.valueType) || true }
    case 'ZodOptional':
    case 'ZodNullable':
    case 'ZodDefault': {
      const inner = zodToOpenApi(def.innerType)
      if (typeName === 'ZodNullable' && inner) inner.nullable = true
      return inner || {}
    }
    case 'ZodAny':
    case 'ZodUnknown':
      return {}
    case 'ZodUnion': {
      const anyOf = (def.options as ZodTypeAny[]).map((o) => zodToOpenApi(o) || {})
      return { anyOf }
    }
    case 'ZodIntersection':
      return {
        allOf: [zodToOpenApi(def.left) || {}, zodToOpenApi(def.right) || {}],
      }
    case 'ZodEffects':
      return zodToOpenApi(def.schema) || {}
    default:
      return {}
  }
}

function applyStringChecks(def: any, out: JsonSchema): void {
  for (const check of def.checks || []) {
    switch (check.kind) {
      case 'min':
        out.minLength = check.value
        break
      case 'max':
        out.maxLength = check.value
        break
      case 'email':
        out.format = 'email'
        break
      case 'datetime':
        out.format = 'date-time'
        break
      case 'regex':
        out.pattern = String(check.regex)
        break
      case 'url':
        out.format = 'uri'
        break
    }
  }
}

function applyNumberChecks(def: any, out: JsonSchema): void {
  for (const check of def.checks || []) {
    switch (check.kind) {
      case 'int':
        out.type = 'integer'
        break
      case 'min':
        out.minimum = check.value
        break
      case 'positive':
        out.minimum = 1
        break
      case 'max':
        out.maximum = check.value
        break
    }
  }
}

// ── OPENAPI COMPONENTS ──────────────────────────────────────────
function buildComponents(): JsonSchema {
  return {
    schemas: {
      Error: zodToOpenApi(MoonErrorSchema) || {},
      PaginationMeta: zodToOpenApi(PaginationMetaSchema) || {},
      Record: { type: 'object', additionalProperties: true },
    },
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  }
}

function commonErrorResponses(): JsonSchema {
  const errorRef = { $ref: '#/components/schemas/Error' }
  return {
    '400': { description: 'Bad Request', content: { 'application/json': { schema: errorRef } } },
    '401': { description: 'Unauthorized', content: { 'application/json': { schema: errorRef } } },
    '403': { description: 'Forbidden', content: { 'application/json': { schema: errorRef } } },
    '404': { description: 'Not Found', content: { 'application/json': { schema: errorRef } } },
    '422': { description: 'Validation Error', content: { 'application/json': { schema: errorRef } } },
    '500': { description: 'Internal Server Error', content: { 'application/json': { schema: errorRef } } },
  }
}

// ── ENDPOINT DEF → OPENAPI OPERATION ────────────────────────────
export function toOpenApiPath(path: string): string {
  return path.replace(/:([^/]+)/g, '{$1}')
}

function deriveTag(def: EndpointDef): string {
  if (def.tags && def.tags.length) return def.tags[0]!
  const seg = def.path.split('/').filter(Boolean)[0] || 'Core'
  return seg.charAt(0).toUpperCase() + seg.slice(1)
}

export function operationFromDef(def: EndpointDef): JsonSchema {
  const operation: JsonSchema = {
    tags: def.tags?.length ? def.tags : [deriveTag(def)],
    summary: def.description || `${def.method} ${def.path}`,
  }
  if (def.description) operation.description = def.description

  // Auth/security — single source of truth.
  operation.security = def.auth === 'none' ? [] : [{ bearerAuth: [] }]

  const parameters: JsonSchema[] = []

  // Path params
  const pathParams = def.path.match(/:([^/]+)|\{([^/]+)\}/g) || []
  for (const raw of pathParams) {
    const name = raw.replace(/[{}:]/g, '')
    parameters.push({
      name,
      in: 'path',
      required: true,
      schema: { type: 'string' },
    })
  }

  // Query params (from Zod object shape)
  if (def.query) {
    const shape = (def.query as any).shape || {}
    for (const [key, value] of Object.entries<any>(shape)) {
      const converted = zodToOpenApi(value)
      parameters.push({
        name: key,
        in: 'query',
        required: !isOptionalSchema(value),
        schema: converted || { type: 'string' },
      })
    }
  }

  // Explicit path params schema (params)
  if (def.params) {
    const shape = (def.params as any).shape || {}
    for (const [key, value] of Object.entries<any>(shape)) {
      parameters.push({
        name: key,
        in: 'path',
        required: true,
        schema: zodToOpenApi(value) || { type: 'string' },
      })
    }
  }

  if (parameters.length) operation.parameters = parameters

  // Request body
  if (def.body) {
    operation.requestBody = {
      required: true,
      content: { 'application/json': { schema: zodToOpenApi(def.body) || {} } },
    }
  }

  // Responses
  const successStatus = def.successStatus ?? (def.method === 'POST' ? 200 : 200)
  const responses: JsonSchema = {
    [successStatus]: {
      description: 'Successful response',
      content: { 'application/json': { schema: zodToOpenApi(def.response) || {} } },
    },
  }
  Object.assign(responses, commonErrorResponses())
  operation.responses = responses

  return operation
}

// ── MODEL RECORD SCHEMA BUILDER (from ORM field defs) ───────────
function fieldToSchema(field: any): JsonSchema {
  const out: JsonSchema = {}
  switch (field.type) {
    case 'integer':
    case 'many2one':
      out.type = 'integer'
      break
    case 'float':
      out.type = 'number'
      break
    case 'boolean':
      out.type = 'boolean'
      break
    case 'one2many':
    case 'many2many':
    case 'vector':
      out.type = 'array'
      out.items = { type: 'object', additionalProperties: true }
      break
    default:
      out.type = 'string'
  }
  if (field.help) out.description = field.help
  else if (field.label) out.description = field.label
  return out
}

function buildModelSchema(name: string, ModelClass: any): JsonSchema {
  const fieldDefs =
    typeof ModelClass.getFieldDefs === 'function'
      ? ModelClass.getFieldDefs(ModelClass) || {}
      : {}
  const properties: Record<string, JsonSchema> = {}
  const required: string[] = []
  for (const [key, field] of Object.entries<any>(fieldDefs)) {
    properties[key] = fieldToSchema(field)
    if (field.required) required.push(key)
  }
  const schema: JsonSchema = { type: 'object', properties }
  if (required.length) schema.required = required
  return schema
}

// ── MODEL OPENAPI SCHEMAS REGISTRATION ─────────────────────────
function collectModelSchemas(components: JsonSchema): void {
  for (const [name, ModelClass] of registry) {
    components.schemas[name] = buildModelSchema(name, ModelClass)
  }
}

// ── MAIN GENERATOR ─────────────────────────────────────────────
export function generateOpenApi(): JsonSchema {
  const components = buildComponents()
  collectModelSchemas(components)

  const paths: Record<string, JsonSchema> = {}

  const register = (def: EndpointDef) => {
    const openApiPath = toOpenApiPath(def.path)
    const method = def.method.toLowerCase()
    if (!paths[openApiPath]) paths[openApiPath] = {}
    paths[openApiPath][method] = operationFromDef(def)
  }

  // 1. Built-in + custom (defineRoute) endpoints from canonical registry.
  for (const def of getEndpointRegistry()) register(def)

  // 2. Auto-generated model REST CRUD (canonical REST contract).
  for (const [name] of registry) {
    for (const def of restEndpointDefs(name)) register(def)
  }

  // 3. Any globalRoutes not yet represented (proxy/custom non-defineRoute).
  //    Registry entries already cover defineRoute calls; this only fills gaps.
  const covered = new Set(
    getEndpointRegistry().map((d: EndpointDef) => `${d.method.toLowerCase()} ${toOpenApiPath(d.path)}`)
  )
  for (const route of globalRoutes) {
    const key = `${route.method.toLowerCase()} ${toOpenApiPath(route.path)}`
    if (covered.has(key)) continue
    const openApiPath = toOpenApiPath(route.path)
    const method = route.method.toLowerCase()
    if (!paths[openApiPath]) paths[openApiPath] = {}
    if (paths[openApiPath][method]) continue
    const params = (route.params || []).map((p: string) => ({
      name: p,
      in: 'path',
      required: true,
      schema: { type: 'string' },
    }))
    paths[openApiPath][method] = {
      tags: ['Custom Endpoints'],
      summary: `Custom route ${route.path}`,
      security: [],
      ...(params.length ? { parameters: params } : {}),
      responses: {
        '200': { description: 'OK' },
        '502': { description: 'Upstream proxy error' },
      },
    }
  }

  return {
    openapi: '3.0.0',
    info: { title: 'Moonwitness API', version: '1.0.0' },
    components,
    security: [{ bearerAuth: [] }],
    paths,
  }
}
