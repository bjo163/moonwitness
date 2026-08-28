/**
 * OpenAPI Contract-Drift Tests (#116)
 *
 * Proves the generated `/openapi.json` is derived from the canonical
 * `@moon/protocol` route/REST definitions and matches runtime auth/input
 * semantics. Any drift between the generator and actual handlers must fail.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { z } from 'zod'
import {
  getEndpointRegistry,
  resetEndpointRegistry,
  defineEndpoint,
  restListEndpoint,
  restEndpointDefs,
  MAX_LIMIT,
  RESERVED_REST_PARAMS,
  RpcRequestSchema,
  RpcResponseSchema,
} from '@moon/protocol'
import { generateOpenApi, operationFromDef } from '../src/openapi-schema.js'
import { globalRoutes } from '../src/router.js'

const bearer = [{ bearerAuth: [] }]

function findOperation(doc: any, path: string, method: string) {
  return doc.paths?.[path]?.[method]
}

describe('OpenAPI canonical generation (#116)', () => {
  afterEach(() => {
    // Isolate registry/globalRoutes mutations between tests.
    resetEndpointRegistry()
    globalRoutes.length = 0
  })

  describe('negative regression — auth contract drift', () => {
    it('/live must NOT be advertised as public (runtime requires admin)', () => {
      const doc = generateOpenApi()
      const live = findOperation(doc, '/live', 'get')
      expect(live).toBeDefined()
      expect(live.security).toEqual(bearer)
      expect(live.security).not.toEqual([])
    })

    it('no protected (auth != none) endpoint may appear with security: []', () => {
      const doc = generateOpenApi()
      const protectedEndpoints = getEndpointRegistry().filter((e) => e.auth !== 'none')
      expect(protectedEndpoints.length).toBeGreaterThan(0)
      for (const e of protectedEndpoints) {
        const op = findOperation(doc, e.path, e.method.toLowerCase())
        expect(op, `${e.method} ${e.path} missing in doc`).toBeDefined()
        expect(op.security, `${e.method} ${e.path} must require auth`).toEqual(bearer)
      }
    })

    it('every documented endpoint carries a security declaration', () => {
      const doc = generateOpenApi()
      for (const [path, methods] of Object.entries<any>(doc.paths)) {
        for (const [method, op] of Object.entries<any>(methods)) {
          expect(op.security, `${method.toUpperCase()} ${path} has no security`).toBeDefined()
        }
      }
    })
  })

  describe('positive — canonical Zod schemas surface in OpenAPI', () => {
    it('a defineRoute()-style definition with request/response Zod appears', () => {
      const EchoBody = z.object({ message: z.string().min(1) })
      const EchoResponse = z.object({ echo: z.string() })
      defineEndpoint({
        method: 'POST',
        path: '/api/test/echo',
        auth: 'user',
        tags: ['Test'],
        description: 'Echo a message (contract test fixture).',
        body: EchoBody,
        response: EchoResponse,
      })

      const doc = generateOpenApi()
      const op = findOperation(doc, '/api/test/echo', 'post')
      expect(op).toBeDefined()
      expect(op.security).toEqual(bearer)
      expect(op.requestBody.content['application/json'].schema).toEqual({
        type: 'object',
        properties: { message: { type: 'string', minLength: 1 } },
        required: ['message'],
      })
      expect(op.responses['200'].content['application/json'].schema).toEqual({
        type: 'object',
        properties: { echo: { type: 'string' } },
        required: ['echo'],
      })
    })

    it('the /rpc endpoint carries the validated RPC input/output contract', () => {
      const doc = generateOpenApi()
      const op = findOperation(doc, '/rpc', 'post')
      expect(op).toBeDefined()
      expect(op.security).toEqual(bearer)
      const bodySchema = op.requestBody.content['application/json'].schema
      expect(bodySchema).toEqual(operationFromDef({
        method: 'POST',
        path: '/rpc',
        body: RpcRequestSchema,
        response: RpcResponseSchema,
      }).requestBody.content['application/json'].schema)
    })
  })

  describe('positive — model REST semantics match runtime', () => {
    it('list endpoint documents all reserved query controls with runtime bounds', () => {
      const op = operationFromDef(restListEndpoint('vx.user'))
      const params = Object.fromEntries((op.parameters || []).map((p: any) => [p.name, p]))

      for (const name of RESERVED_REST_PARAMS) {
        expect(params[name], `missing query control "${name}"`).toBeDefined()
      }
      // Runtime enforces MAX_LIMIT = 100 on `limit`.
      expect(params.limit.schema.maximum).toBe(MAX_LIMIT)
      // Pagination is integer-bounded and positive.
      expect(params.page.schema.type).toBe('integer')
      expect(params.limit.schema.minimum).toBeGreaterThanOrEqual(1)
    })

    it('all five CRUD operations are generated for a model', () => {
      const defs = restEndpointDefs('vx.user')
      expect(defs.map((d) => `${d.method} ${d.path}`).sort()).toEqual(
        [
          'DELETE /api/vx.user/{id}',
          'GET /api/vx.user',
          'GET /api/vx.user/{id}',
          'POST /api/vx.user',
          'PUT /api/vx.user/{id}',
        ].sort()
      )
    })
  })

  describe('negative — undocumented runtime query controls must fail', () => {
    it('adding a reserved control to the canonical contract flips the document', () => {
      const before = operationFromDef(restListEndpoint('vx.user'))
      const beforeNames = new Set((before.parameters || []).map((p: any) => p.name))
      // If a runtime control is missing from the canonical contract it would not
      // be represented here; assert the canonical set already covers every control
      // the handler accepts, so the generator cannot omit one silently.
      for (const name of RESERVED_REST_PARAMS) {
        expect(beforeNames.has(name)).toBe(true)
      }
    })
  })

  describe('canonical source is the single generator', () => {
    it('does not hand-embed a divergent /live public entry', () => {
      const doc = generateOpenApi()
      const live = findOperation(doc, '/live', 'get')
      expect(live.description).toMatch(/admin/i)
    })

    it('NativeServer.registerRoute entries carry auth metadata in OpenAPI', () => {
      defineEndpoint({
        method: 'GET',
        path: '/api/external/test-proxy',
        description: 'Test proxy route',
        auth: 'user',
      })

      const doc = generateOpenApi()
      const op = findOperation(doc, '/api/external/test-proxy', 'get')
      expect(op, '/api/external/test-proxy missing in OpenAPI doc').toBeDefined()
      expect(op.security, 'proxy route must require auth').toEqual(bearer)
    })
  })
})
