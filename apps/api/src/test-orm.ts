import "dotenv/config"
import { NativeServer } from "@moon/server"
import baseAddons, { seedBaseData } from "@moon/base"
import { getModel, createCtx, SUPERUSER_ID, getDb } from "@moon/orm"

async function run() {
  const server = new NativeServer({
    database: process.env.DATABASE_URL || "postgres://localhost/moonwitness",
    jwtSecret: "secret",
    addons: baseAddons.models,
  })

  // We add a hook to User dynamically just for testing, or we could just use QueryBuilder
  const User = getModel("vx.user")
  if (!User) throw new Error("User not found")

  User.beforeSave = async (model, env, vals) => {
    console.log("[HOOK: beforeSave] Intercepting user save:", vals.name)
    if (typeof vals.name === "string") {
      vals.name = vals.name.toUpperCase()
    }
  }

  const env = createCtx(SUPERUSER_ID, {}, getModel)

  console.log("\n--- Testing Validation ---")
  try {
    await User.spawn(User, env, {
      name: "ab", // too short!
      email: "not-an-email", // invalid email!
      password: "pass",
    })
    console.error("FAIL: Should have thrown validation error!")
  } catch (e: any) {
    console.log("SUCCESS: Validation caught invalid data ->", e.message)
  }

  console.log("\n--- Testing Hooks & Creation ---")
  const newUser = await User.spawn(User, env, {
    name: "test hook user",
    email: "hook@test.com",
    password: "password",
    isActive: true,
  })
  console.log("Saved user ID:", newUser.id)

  console.log("\n--- Testing Soft Delete ---")
  await User.purge(User, env, newUser.id)
  console.log("User purged (Soft Delete)")

  const user = await User.query({ ...env, context: { with_deleted: true } })
    .with("partnerId")
    .where("id", newUser.id)
    .first()
  console.log("Fetched user after purge (with_deleted: true):", user?.id)
  console.log("Eager Loaded $partnerId:", user?.$partnerId)

  const db = getDb()
  const rawRow = await db("vx_user").where({ id: newUser.id }).first()
  console.log("Raw DB row for vx_user:", rawRow)

  console.log("\n--- Testing Pagination ---")
  const pagedUsers = await User.query(env).paginate(1, 2)
  console.log(
    `Pagination result: Page ${pagedUsers.meta.page} of ${pagedUsers.meta.lastPage}`
  )
  console.log(
    `Total users: ${pagedUsers.meta.total}, Page Size: ${pagedUsers.meta.pageSize}`
  )
  console.log(`Returned data length: ${pagedUsers.data.length}`)

  console.log("\n--- Testing Transaction API ---")
  try {
    await User.transaction(env, async (txEnv) => {
      console.log("Inside transaction")
      const txUser = await User.spawn(User, txEnv, {
        name: "tx-user",
        email: "tx@user.com",
        password: "tx-password",
      })
      console.log("Created user in TX:", txUser.id)
      throw new Error("Intentional rollback!")
    })
  } catch (err: any) {
    console.log("Transaction aborted:", err.message)
  }

  console.log("\n--- Testing Aggregation API ---")
  const aggResult = await User.query(env)
    .groupBy("isActive")
    .countAgg("id", "userCount")
    .aggregate()
  console.log("Aggregation result:", aggResult)

  // Test slow query logger
  console.log("\n--- Testing Slow Query Logger ---")
  await getDb().raw("SELECT pg_sleep(0.2)")

  process.exit(0)
}

run().catch(console.error)
