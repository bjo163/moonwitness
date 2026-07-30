import type { FastifyInstance } from 'fastify'

const healthRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
}

export { healthRoutes }
