import { registry, Vertex } from '@moon/orm'
import { globalRoutes } from './router.js'

export function generateOpenApi() {
  const schemas: any = {
    AuthLogin: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'admin@moonwitness.com' },
        password: { type: 'string', example: 'admin' }
      }
    },
    AuthResponse: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        user: { type: 'object' }
      }
    },
    SuccessResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true }
      }
    },
    PaginationMeta: {
      type: 'object',
      properties: {
        total: { type: 'integer' },
        page: { type: 'integer' },
        pageSize: { type: 'integer' },
        lastPage: { type: 'integer' }
      }
    }
  }

  const paths: any = {
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login to get JWT Token',
        security: [], // Public endpoint
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthLogin' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Successful login',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/rpc': {
      post: {
        tags: ['Core Engine'],
        summary: 'XML-RPC like endpoint for remote method execution',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['model', 'method'],
                properties: {
                  model: { type: 'string', example: 'vx.user' },
                  method: { type: 'string', example: 'query' },
                  args: { type: 'array', items: {} },
                  kwargs: { type: 'object' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Execution result' }
        }
      }
    },
    '/db/status': {
      get: {
        tags: ['Core Engine'],
        summary: 'Check database status',
        security: [], // Public endpoint
        responses: {
          '200': { description: 'OK' }
        }
      }
    },
    '/meta/models': {
      get: {
        tags: ['Core Engine'],
        summary: 'Get all registered models metadata',
        security: [], // Public endpoint
        responses: {
          '200': { description: 'OK' }
        }
      }
    },
    '/live': {
      get: {
        tags: ['Core Engine'],
        summary: 'Server-Sent Events (SSE) stream',
        security: [], // Public endpoint
        responses: {
          '200': { description: 'Event Stream' }
        }
      }
    }
  }

  if (globalRoutes && globalRoutes.length > 0) {
    for (const route of globalRoutes) {
      if (!paths[route.path]) paths[route.path] = {}
      paths[route.path][route.method.toLowerCase()] = {
        tags: ['Custom Endpoints'],
        summary: `Custom route ${route.path}`,
        responses: {
          '200': { description: 'OK' }
        }
      }
    }
  }

  for (const [name, ModelClass] of registry) {
    const fields = (ModelClass as any).getFieldDefs(ModelClass as any)
    const properties: any = {}
    
    for (const [key, field] of Object.entries(fields)) {
      const f = field as any
      let type = 'string'
      if (f.type === 'integer' || f.type === 'many2one') type = 'integer'
      if (f.type === 'boolean') type = 'boolean'
      if (f.type === 'float') type = 'number'
      if (f.type === 'one2many' || f.type === 'many2many') type = 'array'
      
      properties[key] = { type }
    }
    
    schemas[name] = {
      type: 'object',
      properties
    }

    paths[`/api/${name}`] = {
      get: {
        tags: [name],
        summary: `List ${name}`,
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'with', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          '200': { 
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: `#/components/schemas/${name}` } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: [name],
        summary: `Create ${name}`,
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${name}` }
            }
          }
        },
        responses: {
          '201': {
            description: 'Created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: `#/components/schemas/${name}` }
                  }
                }
              }
            }
          }
        }
      }
    }
    
    paths[`/api/${name}/{id}`] = {
      get: {
        tags: [name],
        summary: `Get ${name} by ID`,
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: `#/components/schemas/${name}` }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: [name],
        summary: `Update ${name}`,
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${name}` }
            }
          }
        },
        responses: {
          '200': {
            description: 'Updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: `#/components/schemas/${name}` }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: [name],
        summary: `Delete ${name}`,
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          '200': {
            description: 'Deleted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' }
              }
            }
          }
        }
      }
    }
  }

  return {
    openapi: '3.0.0',
    info: {
      title: 'Moonwitness API',
      version: '1.0.0'
    },
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths
  }
}
