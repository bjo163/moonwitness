import { MoonClient } from '@moon/client'
import { EventSource } from 'eventsource'
(globalThis as any).EventSource = EventSource

async function run() {
  const client = new MoonClient({ baseUrl: 'http://localhost:4000' })
  console.log('Connecting to /live to simulate visitor session...')

  const unsub = client.subscribe('system_connections', (data) => {
    console.log('Server broadcasted system_connections:', data)
  })

  // Wait 3 seconds to allow the server to create fx.session and fetch GeoIP
  await new Promise(r => setTimeout(r, 3000))
  
  // Clean up
  console.log('Disconnecting...')
  // The internal EventSource can be closed if we access it, but MoonClient doesn't expose it directly yet.
  // We can just exit the process which drops the connection.
  process.exit(0)
}

run().catch(console.error)
