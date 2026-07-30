import 'dotenv/config'
import { NativeServer } from '@moon/server'
import baseAddons from '@moon/base'
import { getModel, createCtx, SUPERUSER_ID } from '@moon/orm'

async function run() {
  const server = new NativeServer({
    database: process.env.DATABASE_URL || 'postgres://localhost/moonwitness',
    jwtSecret: 'secret',
    addons: baseAddons.models,
  })

  await server.start()
  
  await new Promise(r => setTimeout(r, 2000))

  const User = getModel('vx.user')
  const env = createCtx(SUPERUSER_ID, {}, getModel as any)
  
  const records = await User?.query(env).fetch()
  console.log('\n--- USERS IN DB ---')
  console.log(records?.map((r: any) => ({ email: r.email, name: r.name, mode: r.mode })))
  
  process.exit(0)
}

run().catch(console.error)
