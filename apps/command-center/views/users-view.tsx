"use client"

import React, { useState, useMemo } from "react"
import { useMoonModel } from "@moon/client"
import { ContextBlock, MoonDataTable, type CrudColumn } from "@workspace/ui"
import { Users, Shield, Clock, MonitorPlay, Download } from "lucide-react"

function MetricWidget({ label, value, sub, color, icon }: { label: string; value: string; sub?: string; color: "cyan" | "emerald" | "purple" | "amber"; icon: React.ReactNode }) {
  const colorMap = {
    cyan: { text: "text-cyber-cyan", border: "border-cyber-cyan/30", sub: "text-cyber-cyan/80" },
    emerald: { text: "text-cyber-green", border: "border-cyber-green/30", sub: "text-cyber-green/80" },
    purple: { text: "text-cyber-purple", border: "border-cyber-purple/30", sub: "text-cyber-purple/80" },
    amber: { text: "text-cyber-yellow", border: "border-cyber-yellow/30", sub: "text-cyber-yellow/80" },
  }
  const c = colorMap[color]
  return (
    <div className={`relative flex flex-col gap-2 overflow-hidden rounded-xl border ${c.border} bg-card/90 p-4 shadow-sm backdrop-blur-md`}>
      <div className="absolute top-0 right-0 p-4 opacity-10">{icon}</div>
      <div className={`flex items-center gap-2 ${c.text}`}>
        {icon}
        <span className="text-xs font-bold tracking-wider uppercase">{label}</span>
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {sub && <div className={`text-[10px] ${c.sub}`}>{sub}</div>}
    </div>
  )
}

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
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-cyan-500/30 bg-cyan-900/50">
              {row.avatarUrl || row.avatar ? (
                <img src={row.avatarUrl || row.avatar} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <div className="text-xs text-cyan-400">{displayName.charAt(0).toUpperCase()}</div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">{displayName}</span>
              <span className="text-[10px] text-slate-500">{row.login || row.email || "Unavailable"}</span>
            </div>
          </div>
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
          <span className="text-xs text-slate-400">
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
        const color = enabled ? "text-emerald-400" : "text-slate-500"
        const dot = enabled ? "bg-emerald-500" : "bg-slate-500"
        return (
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${dot} shadow-[0_0_5px_currentColor]`} />
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
        if (!lastLogin) return <span className="text-xs text-slate-600">Never</span>
        return (
          <span className="text-xs text-slate-400">
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
          return <span className="text-xs text-slate-500">No roles assigned</span>
        }
        const roleNames = groups.map((g: any) => g.name || g).filter(Boolean)
        return (
          <div className="flex flex-wrap gap-1">
            {roleNames.slice(0, 3).map((role: string, i: number) => (
              <span key={i} className="rounded border border-purple-900/30 bg-purple-900/20 px-1.5 py-0.5 text-[10px] text-purple-400">
                {role}
              </span>
            ))}
            {roleNames.length > 3 && (
              <span className="text-[10px] text-slate-500">+{roleNames.length - 3}</span>
            )}
          </div>
        )
      },
    },
  ]

  const topWidgets = usersLoading ? (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="h-24 animate-pulse rounded-xl border border-cyan-900/30 bg-black/40" />
      <div className="h-24 animate-pulse rounded-xl border border-emerald-900/30 bg-black/40" />
      <div className="h-24 animate-pulse rounded-xl border border-purple-900/30 bg-black/40" />
      <div className="h-24 animate-pulse rounded-xl border border-amber-900/30 bg-black/40" />
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricWidget label="Total Users" value={String(totalUsers)} sub={totalUsers > 0 ? `${activeUsers} active` : "No data"} color="cyan" icon={<Users className="h-4 w-4" />} />
      <MetricWidget label="Active Users" value={String(activeUsers)} sub={totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}% of total` : "No data"} color="emerald" icon={<MonitorPlay className="h-4 w-4" />} />
      <MetricWidget label="2FA Enabled" value={String(twoFactorUsers)} sub={totalUsers > 0 ? `${Math.round((twoFactorUsers / totalUsers) * 100)}% of total` : "No data"} color="purple" icon={<Shield className="h-4 w-4" />} />
      <MetricWidget label="Avg Level" value={String(totalUsers > 0 ? Math.round(users.reduce((sum: number, u: any) => sum + (u.level || 0), 0) / totalUsers) : 0)} sub="Average user level" color="amber" icon={<Clock className="h-4 w-4" />} />
    </div>
  )

  const sideWidgets = (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card/90 p-4 shadow-sm backdrop-blur-md">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-primary uppercase">
          <MonitorPlay className="h-4 w-4" /> User Status
        </h3>
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span className="font-semibold text-foreground">{totalUsers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Active</span>
            <span className="font-semibold text-cyber-green">{activeUsers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>2FA Enabled</span>
            <span className="font-semibold text-cyber-purple">{twoFactorUsers}</span>
          </div>
        </div>
      </div>
    </>
  )

  const tabs = [
    { id: "all", label: "All Users" },
  ]

  const customActions = (
    <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/50 px-3 text-[10px] font-semibold tracking-wider text-foreground uppercase transition-colors hover:bg-secondary">
      <Download className="h-3.5 w-3.5" /> Export
    </button>
  )

  return (
    <div className="space-y-6">
      <ContextBlock
        title="USER MANAGEMENT"
        subtitle="Manage system users, login, level, and 2FA status."
        operation="USER-MGMT"
        status="ONLINE"
        accentColor="system"
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
