import 'dotenv/config'
import { NativeServer } from '@moon/server'
import baseAddons from '@moon/base'
import { getModel, createCtx, SUPERUSER_ID, setupOrm } from '@moon/orm'

async function run() {
  setupOrm(process.env.DATABASE_URL || 'postgres://localhost/moonwitness')
  for (const addon of baseAddons.models) {
    const { registerModel } = await import('@moon/orm')
    registerModel(addon)
  }

  const { getDb } = await import('@moon/orm')
  const db = getDb()
  const { getModel, createCtx } = await import('@moon/orm')
  
  await db('vx_node').whereNull('is_active').update({ is_active: true })
  console.log('Fixed is_active for all nodes!')
  
  const User = getModel('vx.user')
  if (!User) throw new Error('User model not found');
  const env = createCtx(1, {}, getModel)
  
  const email = 'rocksoultech@gmail.com'
  const rows = await User.fetch(User, env, [['email', '=', email]])
  
  if (rows.length > 0) {
    const user = rows[0] as any
    const bcrypt = await import('bcryptjs')
    const isValid = await bcrypt.compare('Youknowm@3', user.password)
    console.log('Login fetch result:', user.password, 'isValid with Youknowm@3:', isValid)
  } else {
    console.log('Not found')
  }
  
  process.exit(0)
}

run().catch(console.error)
