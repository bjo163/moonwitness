import { getDb, getModel, createCtx, SUPERUSER_ID } from "@moon/orm"
import { hashPassword, comparePassword } from "@moon/server"

/**
 * ◈ Synchronize Superuser Credentials from Environment (.env)
 *
 * Ensures that the administrative superuser defined in BOOTSTRAP_ADMIN_EMAIL
 * and BOOTSTRAP_ADMIN_PASSWORD always exists and has the exact password specified in .env.
 * This runs on server startup so changing credentials in .env takes effect immediately.
 */
export async function syncSuperuserFromEnv(): Promise<void> {
  const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim()
  const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim()

  if (!adminEmail || !adminPassword) {
    return
  }

  try {
    const VxUser = getModel("vx.user")
    const VxRole = getModel("vx.role")
    const VxNode = getModel("vx.node")
    const VxOrg = getModel("vx.org")

    if (!VxUser) {
      return
    }

    const env = createCtx(SUPERUSER_ID, {}, getModel as any)
    const db = getDb()
    const conn = env.trx || db

    const normalizedEmail = adminEmail.toLowerCase()

    // 1. Check if user exists by email or login
    let userRows = await VxUser.fetch(VxUser as any, env, [["login", "=", normalizedEmail]])
    if (!userRows.length) {
      userRows = await VxUser.fetch(VxUser as any, env, [["email", "=", normalizedEmail]])
    }

    // Hash the password from .env
    const hashedPassword = await hashPassword(adminPassword)

    if (userRows.length > 0) {
      const existingUser = userRows[0] as any
      const isMatch = existingUser.password
        ? await comparePassword(adminPassword, existingUser.password)
        : false
      const needsPasswordUpdate = !isMatch
      const needsLoginUpdate = existingUser.login !== normalizedEmail || existingUser.email !== normalizedEmail

      if (needsPasswordUpdate || needsLoginUpdate) {
        await conn("vx_user")
          .where({ id: existingUser.id })
          .update({
            login: normalizedEmail,
            password: hashedPassword,
          })
        if (existingUser.partnerId || existingUser.partner_id) {
          const partnerId = existingUser.partnerId || existingUser.partner_id
          await conn("vx_node")
            .where({ id: partnerId })
            .update({
              email: normalizedEmail,
              name: existingUser.name || "Administrator",
            })
        }
        console.log(`[moon.auth] ✓ Synced superuser (${normalizedEmail}) password directly from .env`)
      }
    } else {
      // Create company & partner if not present
      let companyId: number = 1
      if (VxOrg) {
        const orgRows = await VxOrg.fetch(VxOrg as any, env, [])
        if (orgRows.length > 0) {
          companyId = orgRows[0].id
        }
      }

      let partnerId: number = 1
      if (VxNode) {
        const partnerRows = await VxNode.fetch(VxNode as any, env, [["name", "=", "Administrator"]])
        if (partnerRows.length > 0) {
          partnerId = partnerRows[0].id
        } else {
          const newPartner = await VxNode.spawn(VxNode as any, env, {
            name: "Administrator",
            isCompany: false,
            companyId,
          })
          partnerId = newPartner.id
        }
      }

      const newUser = await VxUser.spawn(VxUser as any, env, {
        name: "Administrator",
        email: normalizedEmail,
        login: normalizedEmail,
        password: hashedPassword,
        partnerId,
        companyId,
      })

      console.log(`[moon.auth] ✓ Provisioned new superuser (${normalizedEmail}) directly from .env`)

      // Ensure assigned to Admin role
      if (VxRole) {
        const roleRows = await VxRole.fetch(VxRole as any, env, [["name", "=", "Admin"]])
        const adminRoleId = roleRows.length > 0 ? roleRows[0].id : 1
        const relExists = await conn("vx_user_vx_role_rel")
          .where({ vx_user_id: newUser.id, vx_role_id: adminRoleId })
          .first()
        if (!relExists) {
          await conn("vx_user_vx_role_rel").insert({
            vx_user_id: newUser.id,
            vx_role_id: adminRoleId,
          })
        }
      }
    }
  } catch (err: any) {
    console.error("[moon.auth] Warning: Could not sync superuser from .env:", err?.message || err)
  }
}
