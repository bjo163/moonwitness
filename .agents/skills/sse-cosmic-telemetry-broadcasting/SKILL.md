---
name: sse-cosmic-telemetry-broadcasting
description: >-
  Use this skill when managing Server-Sent Events (SSE) telemetry streams, topic-based pub/sub multiplexing,
  heartbeat ping timers, client disconnection garbage collection, and browser reconnect resilience.
---

# SSE Cosmic Telemetry Broadcasting (Subatomic Skill)

Governs high-throughput, low-latency Server-Sent Events (SSE) streaming from `apps/api` and `@moon/server` to the Command Center and Web portals for real-time celestial events, disaster alerts, and system health.

## SSE Wire Format Protocol

Every event pushed to HTTP clients follows the standard W3C EventSource text wire format:
```text
event: celestial:hilal-update
id: evt_1788749200_42
retry: 5000
data: {"locationId":"JKT-01","azimuth":282.4,"altitude":4.1,"status":"VISIBLE"}

: heartbeat ping 1788749215
```

## SSE Channel Manager & Lifecycle

```typescript
import type { FastifyReply, FastifyRequest } from 'fastify'

interface SSEClient {
  id: string
  reply: FastifyReply
  topics: Set<string>
}

class TelemetryBroadcaster {
  private clients = new Map<string, SSEClient>()

  register(clientId: string, reply: FastifyReply, topics: string[]) {
    // Send SSE headers
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable proxy buffering (Nginx)
    })

    const client: SSEClient = { id: clientId, reply, topics: new Set(topics) }
    this.clients.set(clientId, client)

    // Handle client disconnect GC
    reply.raw.on('close', () => {
      this.clients.delete(clientId)
    })
  }

  broadcast(topic: string, eventName: string, data: any) {
    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`
    for (const client of this.clients.values()) {
      if (client.topics.has(topic) || client.topics.has('*')) {
        client.reply.raw.write(payload)
      }
    }
  }

  startHeartbeat(intervalMs = 15000) {
    setInterval(() => {
      const ping = `: heartbeat ${Date.now()}\n\n`
      for (const client of this.clients.values()) {
        client.reply.raw.write(ping)
      }
    }, intervalMs)
  }
}
```

## Canonical Source Files
- `packages/moon-server/src/handlers/sse.ts`
- `packages/moon-server/src/telemetry.ts`
- `apps/command-center/src/`

## Verification Command
```bash
pnpm --filter=@moon/server exec tsx -e 'import { TelemetryStream } from "./src/telemetry"; console.log("SSE Telemetry Broadcaster Loaded")'
```
