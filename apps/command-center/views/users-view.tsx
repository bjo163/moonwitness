"use client"

import React from "react"
import { useMoonModel } from "@moon/client"
import {
  ContextBlock,
  MoonDataTable,
  type CrudColumn,
  MetricCard,
  PropertyList,
  PropertyRow,
  UserIdentity,
  SkeletonCard,
  Button,
} from "@workspace/ui"
import { Users, Shield, Clock, MonitorPlay, Download } from "lucide-react"

export function UsersView() {
  const { data: users, loading: usersLoading } = useMoonModel<any>("vx.user")

  const totalUsers = users?.length ?? 0
  const activeUsers = users?.filter((u: any) => u.is_active === true || u.isActive === true).length ?? 0
  const twoFactorUsers = users?.filter((u: any) => u.two_factor_enabled === true || u.twoFactorEnabled === true).length ?? 0

  const userColumns: CrudColumn[] = [
    {
      name: "name",
      label: "User",
      type: "text",
      required: true,
      render: (val, row) => {
        const displayName = row.nickname || row.login || "Unavailable"
        return (
          <UserIdentity
            name={displayName}
            subtitle={row.login || row.email || "Unavailable"}
            avatarUrl={row.avatarUrl || row.avatar}
            fallbackText={displayName.charAt(0).toUpperCase()}
            size="default"
          />
        )
      },
    },
    {
      name: "login",
      label: "Login",
      type: "text",
      required: true,
      hideInTable: true,
    },
    {
      name: "level",
      label: "Level",
      type: "number",
      render: (_, row) => {
        const level = row.level ?? "Unavailable"
        return (
          <span className="text-xs text-muted-foreground">
            {level}
          </span>
        )
      },
    },
    {
      name: "twoFactorEnabled",
      label: "2FA",
      hideInForm: true,
      render: (_, row) => {
        const enabled = row.two_factor_enabled || row.twoFactorEnabled
        const color = enabled ? "text-success" : "text-muted-foreground"
        const dot = enabled ? "bg-success" : "bg-muted-foreground"
        return (
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${dot} shadow-sm`} />
            <span className={`text-xs ${color}`}>{enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        )
      },
    },
    {
      name: "lastLogin",
      label: "Last Login",
      hideInForm: true,
      render: (_, row) => {
        const lastLogin = row.last_login || row.lastLogin
        if (!lastLogin) return <span className="text-xs text-muted-foreground">Never</span>
        return (
          <span className="text-xs text-muted-foreground font-mono">
            {new Date(lastLogin).toLocaleString()}
          </span>
        )
      },
    },
    {
      name: "groupsId",
      label: "Roles",
      hideInForm: true,
      render: (_, row) => {
        const groups = row.groupsId || row.groups_id
        if (!groups || !Array.isArray(groups) || groups.length === 0) {
          return <span className="text-xs text-muted-foreground">No roles assigned</span>
        }
        const roleNames = groups
          .map((g: any) => g.name || g)
          .filter(Boolean)
          .map((role: string | number) => String(role))
        return (
          <div className="flex flex-wrap gap-1">
            {roleNames.slice(0, 3).map((role: string, i: number) => (
              <span key={i} className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-foreground">
                {role}
              </span>
            ))}
            {roleNames.length > 3 && (
              <span className="text-[10px] text-muted-foreground font-mono">+{roleNames.length - 3}</span>
            )}
          </div>
        )
      },
    },
  ]

  const topWidgets = usersLoading ? (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Users"
        value={String(totalUsers)}
        detail={totalUsers > 0 ? `${activeUsers} active` : "No data"}
        icon={<Users className="h-4 w-4" />}
      />
      <MetricCard
        title="Active Users"
        value={String(activeUsers)}
        detail={totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}% of total` : "No data"}
        icon={<MonitorPlay className="h-4 w-4" />}
        variant="success"
      />
      <MetricCard
        title="2FA Enabled"
        value={String(twoFactorUsers)}
        detail={totalUsers > 0 ? `${Math.round((twoFactorUsers / totalUsers) * 100)}% of total` : "No data"}
        icon={<Shield className="h-4 w-4" />}
      />
      <MetricCard
        title="Avg Level"
        value={String(totalUsers > 0 ? Math.round(users.reduce((sum: number, u: any) => sum + (u.level || 0), 0) / totalUsers) : 0)}
        detail="Average user level"
        icon={<Clock className="h-4 w-4" />}
        variant="warning"
      />
    </div>
  )

  const sideWidgets = (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-4 shadow-xs">
      <h3 className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold tracking-wider text-primary uppercase">
        <MonitorPlay className="h-4 w-4" /> User Status
      </h3>
      <PropertyList>
        <PropertyRow
          label="Total"
          value={<span className="font-semibold text-foreground">{totalUsers}</span>}
        />
        <PropertyRow
          label="Active"
          value={<span className="font-semibold text-success">{activeUsers}</span>}
        />
        <PropertyRow
          label="2FA Enabled"
          value={<span className="font-semibold text-primary">{twoFactorUsers}</span>}
        />
      </PropertyList>
    </div>
  )

  const tabs = [
    { id: "all", label: "All Users" },
  ]

  const customActions = (
    <Button type="button" variant="secondary" size="sm" className="text-[10px] font-semibold tracking-wider uppercase">
      <Download className="h-3.5 w-3.5" /> Export
    </Button>
  )

  return (
    <div className="space-y-6">
      <ContextBlock
        title="USER MANAGEMENT"
        subtitle="Manage system users, login, level, and 2FA status."
        operation="USER-MGMT"
        status="ONLINE"
        accentColor="primary"
      />

      <MoonDataTable
        modelName="vx.user"
        title="User Management"
        description="Comprehensive list of all registered users."
        columns={userColumns}
        icon={<Users className="h-5 w-5" />}
        topWidgets={topWidgets}
        sideWidgets={sideWidgets}
        tabs={tabs}
        activeTab="all"
        onTabChange={() => {}}
        customActions={customActions}
      />
    </div>
  )
}

export { UsersView as ErpUsersView }
