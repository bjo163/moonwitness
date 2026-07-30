import '@fastify/jwt'
import type { FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    jwtSign(payload: object, options?: { expiresIn?: string }): Promise<string>
    jwtVerify(): Promise<{ sub: number; email: string }>
  }
  interface FastifyReply {
    jwtSign(payload: object, options?: { expiresIn?: string }): Promise<string>
  }
}