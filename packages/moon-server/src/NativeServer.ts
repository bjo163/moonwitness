import { FastifyAdapter, type FastifyAdapterConfig } from './fastify-adapter.js'

export type MoonConfig = FastifyAdapterConfig

export function publish(topic: string, payload: any) {
  if ((globalThis as any).moonEmitter) {
    ;(globalThis as any).moonEmitter.emit('moon_event', { topic, payload })
  }
}

/**
 * Canonical MoonWitness server abstraction.
 *
 * Fastify 5 owns the production HTTP lifecycle internally. Addons and
 * applications continue to depend on NativeServer/Moon contracts, never on
 * Fastify types, so transport implementation details remain isolated here.
 */
export class NativeServer extends FastifyAdapter {
  constructor(config: MoonConfig) {
    super(config)
  }
}
