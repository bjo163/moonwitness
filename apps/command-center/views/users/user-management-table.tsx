import { Users } from "lucide-react"
import { MoonDataTable } from "@workspace/ui"
import { createUserColumns } from "./user-columns"
import { UserExportAction, UserStatusWidget, UserSummaryWidgets } from "./user-widgets"

export function UserManagementTable({
  activeUsers,
  averageLevel,
  totalUsers,
  twoFactorUsers,
  usersLoading,
}: {
  activeUsers: number
  averageLevel: number
  totalUsers: number
  twoFactorUsers: number
  usersLoading: boolean
}) {
  return (
    <MoonDataTable
      modelName="vx.user"
      title="User Management"
      description="Comprehensive list of all registered users."
      columns={createUserColumns()}
      icon={<Users className="h-5 w-5" />}
      topWidgets={
        <UserSummaryWidgets
          activeUsers={activeUsers}
          averageLevel={averageLevel}
          totalUsers={totalUsers}
          twoFactorUsers={twoFactorUsers}
          usersLoading={usersLoading}
        />
      }
      sideWidgets={<UserStatusWidget activeUsers={activeUsers} totalUsers={totalUsers} twoFactorUsers={twoFactorUsers} />}
      tabs={[{ id: "all", label: "All Users" }]}
      activeTab="all"
      onTabChange={() => {}}
      customActions={<UserExportAction />}
    />
  )
}
