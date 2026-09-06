"use client"

import { useMoonModel } from "@moon/client"
import { ContextBlock } from "@workspace/ui"
import { UserManagementTable } from "./users/user-management-table"

export function UsersView() {
  const { data: users, loading: usersLoading } = useMoonModel<any>("vx.user")

  const totalUsers = users?.length ?? 0
  const activeUsers = users?.filter((user: any) => user.is_active === true || user.isActive === true).length ?? 0
  const twoFactorUsers = users?.filter((user: any) => user.two_factor_enabled === true || user.twoFactorEnabled === true).length ?? 0
  const averageLevel = totalUsers > 0 ? Math.round(users.reduce((sum: number, user: any) => sum + (user.level || 0), 0) / totalUsers) : 0

  return (
    <div className="space-y-6">
      <ContextBlock
        title="USER MANAGEMENT"
        subtitle="Manage system users, login, level, and 2FA status."
        operation="USER-MGMT"
        status="ONLINE"
        accentColor="primary"
      />
      <UserManagementTable
        activeUsers={activeUsers}
        averageLevel={averageLevel}
        totalUsers={totalUsers}
        twoFactorUsers={twoFactorUsers}
        usersLoading={usersLoading}
      />
    </div>
  )
}

export { UsersView as ErpUsersView }
