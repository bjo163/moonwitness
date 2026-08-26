import { getModel, createCtx } from "@moon/orm"
import { VxUser } from "@moon/base"

async function testInference() {
  const env = createCtx(1)

  // Call search, which returns Recordset<typeof VxUser>
  const users = await VxUser.scan(VxUser, env, [])

  for (const u of users) {
    console.log(u.id)
  }
}

testInference().catch(console.error)
