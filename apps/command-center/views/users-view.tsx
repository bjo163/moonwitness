"use client"

import React, { useState, useMemo } from "react"
import { useMoonModel } from "@moon/client"
import { ContextBlock, MoonDataTable, type CrudColumn } from "@workspace/ui"
import { Users, Shield, Clock, MonitorPlay, Download } from "lucide-react"

function MetricWidget({ label, value, sub, color, icon }: { label: string; value: string; sub?: string; color: "cyan" | "emerald" | "purple" | "amber"; icon: React.ReactNode }) {
  const colorMap = {
    cyan: { text: "text-cyan-500", border: "border-cyan-900/30", sub: "text-cyan-400" },
    emerald: { text: "text-emerald-500", border: "border-emerald-900/30", sub: "text-emerald-400" },
    purple: { text: "text-purple-500", border: "border-purple-900/30", sub: "text-purple-400" },
    amber: { text: "text-amber-500", border: "border-amber-900/30", sub: "text-amber-400" },
  }
  const c = colorMap[color]
  return (
    <div className={`relative flex flex-col gap-2 overflow-hidden rounded-xl border ${c.border} bg-black/40 p-4 backdrop-blur-md`}>
      <div className="absolute top-0 right-0 p-4 opacity-10">{icon}</div>
      <div className={`flex items-center gap-2 ${c.text}`}>
        {icon}
        <span className="text-xs font-bold tracking-wider uppercase">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className={`text-[10px] ${c.sub}`}>{sub}</div>}
    </div>
  )
}

export function UsersView() {
  const [activeTab, setActiveTab] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")

  const { data: users, loading: usersLoading } = useMoonModel<any>("vx.user")

  const tableFilters = useMemo(() => {
    const filters: Record<string, any> = {}
    if (activeTab === "admins") filters.role = "admin"
    else if (activeTab === "active") filters.status = "active"
    else if (activeTab === "pending") filters.status = "pending"
    else if (activeTab === "disabled") filters.status = "disabled"
    if (roleFilter !== "all") filters.role = roleFilter
    if (statusFilter !== "all") filters.status = statusFilter
    if (teamFilter !== "all") filters.team = teamFilter
    return filters
  }, [activeTab, roleFilter, statusFilter, teamFilter])

  const totalUsers = users?.length ?? 0
  const activeUsers = users?.filter((u: any) => u.status === "active").length ?? 0
  const adminUsers = users?.filter((u: any) => u.role === "admin" || u.role === "superadmin").length ?? 0
  const pendingUsers = users?.filter((u: any) => u.status === "pending").length ?? 0

  const userColumns: CrudColumn[] = [
    {
      name: "name",
      label: "User",
      type: "text",
      required: true,
      render: (val, row) => {
        const displayName = row.nickname || row.name || row.login || "Unavailable"
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
              <span className="text-[10px] text-slate-500">{row.email || row.login || "Unavailable"}</span>
            </div>
          </div>
        )
      },
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      hideInTable: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      hideInTable: true,
    },
    {
      name: "role",
      label: "Role",
      hideInForm: true,
      render: (_, row) => {
        const role = row.role || "Unavailable"
        const color = role === "superadmin" || role === "admin" ? "text-purple-400" : role === "moderator" ? "text-amber-400" : role === "editor" ? "text-blue-400" : "text-emerald-400"
        return (
          <span className={`text-xs font-medium ${color}`}>
            {role}
          </span>
        )
      },
    },
    {
      name: "team",
      label: "Team",
      hideInForm: true,
      render: (_, row) => (
        <span className="text-xs text-slate-400">
          {row.team || "Unavailable"}
        </span>
      ),
    },
    {
      name: "status",
      label: "Status",
      hideInForm: true,
      render: (_, row) => {
        const status = row.status || "Unavailable"
        const color = status === "active" ? "text-emerald-500" : status === "pending" ? "text-amber-500" : status === "disabled" || status === "banned" ? "text-red-500" : "text-slate-400"
        const dot = status === "active" ? "bg-emerald-500" : status === "pending" ? "bg-amber-500" : status === "disabled" || status === "banned" ? "bg-red-500" : "bg-slate-500"
        return (
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${dot} shadow-[0_0_5px_currentColor]`} />
            <span className={`text-xs ${color}`}>{status}</span>
          </div>
        )
      },
    },
    {
      name: "last_active",
      label: "Last Active",
      hideInForm: true,
      render: (_, row) => {
        const lastActive = row.lastActive || row.last_active
        if (!lastActive) return <span className="text-xs text-slate-600">-</span>
        return (
          <span className="text-xs text-slate-400">
            {new Date(lastActive).toLocaleString()}
          </span>
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
      <MetricWidget label="Admins" value={String(adminUsers)} sub={totalUsers > 0 ? `${Math.round((adminUsers / totalUsers) * 100)}% of total` : "No data"} color="purple" icon={<Shield className="h-4 w-4" />} />
      <MetricWidget label="Pending Approval" value={String(pendingUsers)} sub={pendingUsers > 0 ? "Awaiting review" : "None pending"} color="amber" icon={<Clock className="h-4 w-4" />} />
    </div>
  )

  const sideWidgets = (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-cyan-900/30 bg-black/40 p-4 backdrop-blur-md">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-500 uppercase">
          <MonitorPlay className="h-4 w-4" /> Live User Count
        </h3>
        <div className="flex flex-col gap-2 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span className="text-white">{totalUsers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Active</span>
            <span className="text-emerald-400">{activeUsers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Admins</span>
            <span className="text-purple-400">{adminUsers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Pending</span>
            <span className="text-amber-400">{pendingUsers}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-cyan-900/30 bg-black/40 p-4 backdrop-blur-md">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-500 uppercase">
          <Shield className="h-4 w-4" /> Role Distribution
        </h3>
        <div className="flex flex-col gap-2 text-xs text-slate-400">
          {["superadmin", "admin", "moderator", "editor", "user"].map((role) => {
            const count = users?.filter((u: any) => u.role === role).length ?? 0
            const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
            return (
              <div key={role} className="flex items-center justify-between">
                <span className="capitalize">{role}</span>
                <span className="text-slate-200">{count} ({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )

  const tabs = [
    { id: "all", label: "All Users" },
    { id: "admins", label: "Admins" },
    { id: "active", label: "Active" },
    { id: "pending", label: "Pending" },
    { id: "disabled", label: "Disabled" },
  ]

  const customActions = (
    <button className="flex h-8 items-center gap-1.5 rounded border border-cyan-900/50 bg-black/40 px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase transition-colors hover:bg-cyan-900/30 hover:text-slate-200">
      <Download className="h-3.5 w-3.5" /> Export
    </button>
  )

  const filterWidgets = (
    <>
      <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-8 rounded border border-cyan-900/50 bg-black/50 px-2 text-xs text-slate-400 focus:border-cyan-500/50 focus:outline-none">
        <option value="all">All Roles</option>
        <option value="superadmin">Superadmin</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="editor">Editor</option>
        <option value="user">User</option>
      </select>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-8 rounded border border-cyan-900/50 bg-black/50 px-2 text-xs text-slate-400 focus:border-cyan-500/50 focus:outline-none">
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="disabled">Disabled</option>
        <option value="banned">Banned</option>
      </select>
      <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="h-8 rounded border border-cyan-900/50 bg-black/50 px-2 text-xs text-slate-400 focus:border-cyan-500/50 focus:outline-none">
        <option value="all">All Teams</option>
      </select>
    </>
  )

  return (
    <div className="space-y-6">
      <ContextBlock
        title="USER MANAGEMENT"
        subtitle="Manage system users, roles, and access permissions across the global Command Center."
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
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filters={tableFilters}
        filterWidgets={filterWidgets}
        customActions={customActions}
      />
    </div>
  )
}

export { UsersView as ErpUsersView }
