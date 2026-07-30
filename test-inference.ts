import { getModel } from './apps/api/src/models/registry.js'
import { createEnv } from './apps/api/src/models/env.js'
import type { BaseModel, Recordset } from './apps/api/src/models/base.js'

// We need to simulate loading models to TS. 
// Since TS checks the file statically, let's import the User model directly.
import User from './apps/api/src/models/addons/base/user.js'

async function testInference() {
  const env = createEnv(1)
  
  // Call search, which returns Recordset<typeof User>
  const users = await User.search(User, env, [])
  
  for (const u of users) {
    // If TS inference works, u.email should be typed as string
    console.log(u.email.toLowerCase())
    console.log(u.id.toFixed(2))
  }

  // mapped should infer string[]
  const emails = users.mapped('email')
  console.log(emails.join(', '))
}
