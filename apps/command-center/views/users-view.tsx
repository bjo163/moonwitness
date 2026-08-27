"use client"

import React, { useEffect, useState } from "react"
import { ContextBlock, MoonDataTable, type CrudColumn } from "@workspace/ui"
import {
  Building2,
  Clock,
  LogIn,
  MonitorPlay,
  Shield,
  Users,
} from "lucide-react"

type UserMetrics = {
  total: number | null
  active: number | null
  inactive: number | null
}

type OrganizationOption = {
  id: number
  name: string
}

function readApiField(row: Record<string, any>, field: string): any {
  if (field in row) return row[field]
  const snake = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  return row[snake]
}

function relationLabel(value: unknown): string {
  if (Array.isArray(value)) {
    const label = value[1]
    return typeof label === "string" && label.trim() ? label : "Unknown"
  }
  return "Unknown"
}

async function readCollection(model: string, params: URLSearchParams) {
  const response = await fetch(`/api/backend/api/${encodeURIComponent(model)}?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with HTTP ${response.status}`)
  }
  return payload
}

async function countUsers(domain: unknown[][]): Promise<number> {
  const params = new URLSearchParams({ page: "1", limit: "1" })
  params.set("domain", JSON.stringify(domain))
  const payload = await readCollection("vx.user", params)
  return Number(payload?.meta?.total ?? 0)
}

export function UsersView() {
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [organizationFilter, setOrganizationFilter] = useState("")
  const [metrics, setMetrics] = useState<UserMetrics>({ total: null, active: null, inactive: null })
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([])
  const [summaryError, setSummaryError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSummary() {
      try {
        const orgParams = new URLSearchParams({ page: "1", limit: "100", order: "name asc" })
        const [total, active, inactive, orgPayload] = await Promise.all([
          countUsers([["isActive", "in", [true, false]]]),
          countUsers([["isActive", "=", true]]),
          countUsers([["isActive", "=", false]]),
          readCollection("vx.org", orgParams),
        ])

        if (cancelled) return
        setMetrics({ total, active, inactive })
        setOrganizations(
          Array.isArray(orgPayload?.data)
            ? orgPayload.data
                .filter((item: any) => Number.isInteger(Number(item?.id)))
                .map((item: any) => ({ id: Number(item.id), name: String(item.name || `Organization #${item.id}`) }))
            : []
        )
        setSummaryError(null)
      } catch (error: any) {
        if (cancelled) return
        setMetrics({ total: null, active: null, inactive: null })
        setOrganizations([])
        setSummaryError(error?.message || "User summary is unavailable")
      }
    }

    void loadSummary()
    return () => {
      cancelled = true
    }
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    if (tabId === "active") setStatusFilter("active")
    else if (tabId === "inactive") setStatusFilter("inactive")
    else setStatusFilter("all")
  }

  const tableFilters: Record<string, unknown> = {
    isActive:
      statusFilter === "all"
        ? undefined
        : statusFilter === "active",
    companyId: organizationFilter ? Number(organizationFilter) : undefined,
  }

  const userColumns: CrudColumn[] = [
    {
      name: "name",
      label: "User",
      type: "text",
      required: true,
      render: (value, row) => {
        const name = String(value || readApiField(row, "name") || "Unknown")
        const email = String(readApiField(row, "email") || "Unknown")
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/60 text-xs font-bold text-cyan-300">
              {name === "Unknown" ? "?" : name.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">{name}</span>
              <span className="text-[10px] text-slate-500">{email}</span>
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
      name: "login",
      label: "Login",
      type: "text",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      hideInTable: true,
    },
    {
      name: "groupsId",
      label: "Role",
      hideInForm: true,
      render: () => <span className="text-xs text-slate-500">Unavailable</span>,
    },
    {
      name: "companyId",
      label: "Organization",
      hideInForm: true,
      render: (_, row) => (
        <span className="text-xs text-slate-300">
          {relationLabel(readApiField(row, "companyId"))}
        </span>
      ),
    },
    {
      name: "isActive",
      label: "Status",
      hideInForm: true,
      render: (_, row) => {
        const active = readApiField(row, "isActive")
        if (typeof active !== "boolean") {
          return <span className="text-xs text-slate-500">Unknown</span>
        }
        return (
          <span className={active ? "text-xs text-emerald-400" : "text-xs text-rose-400"}>
            {active ? "Active" : "Inactive"}
          </span>
        )
      },
    },
    {
      name: "twoFactorEnabled",
      label: "2FA",
      hideInForm: true,
      render: (_, row) => {
        const enabled = readApiField(row, "twoFactorEnabled")
        if (typeof enabled !== "boolean") {
          return <span className="text-xs text-slate-500">Unknown</span>
        }
        return <span className="text-xs text-slate-300">{enabled ? "Enabled" : "Disabled"}</span>
      },
    },
    {
      name: "updatedAt",
      label: "Last Active",
      hideInForm: true,
      render: () => <span className="text-xs text-slate-500">Unavailable</span>,
    },
  ]

  const metricValue = (value: number | null) => (value === null ? "Unavailable" : value.toLocaleString())

  const topWidgets = (
    <div className="space-y-3">
      {summaryError ? (
        <div role="alert" className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-3 text-xs text-rose-300">
          Summary unavailable: {summaryError}
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-cyan-900/30 bg-black/40 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 text-cyan-500">
            <Users className="h-4 w-4" />
            <span className="text-xs font-bold tracking-wider uppercase">Total Users</span>
          </div>
          <div className="text-2xl font-bold text-white">{metricValue(metrics.total)}</div>
          <div className="mt-1 text-[10px] text-slate-500">Non-deleted records from vx.user</div>
        </div>

        <div className="rounded-xl border border-emerald-900/30 bg-black/40 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <MonitorPlay className="h-4 w-4" />
            <span className="text-xs font-bold tracking-wider uppercase">Active Users</span>
          </div>
          <div className="text-2xl font-bold text-white">{metricValue(metrics.active)}</div>
          <div className="mt-1 text-[10px] text-slate-500">isActive = true</div>
        </div>

        <div className="rounded-xl border border-rose-900/30 bg-black/40 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 text-rose-500">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-bold tracking-wider uppercase">Inactive Users</span>
          </div>
          <div className="text-2xl font-bold text-white">{metricValue(metrics.inactive)}</div>
          <div className="mt-1 text-[10px] text-slate-500">isActive = false</div>
        </div>

        <div className="rounded-xl border border-purple-900/30 bg-black/40 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 text-purple-500">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-bold tracking-wider uppercase">Admin / Pending</span>
          </div>
          <div className="text-lg font-bold text-slate-400">Unavailable</div>
          <div className="mt-1 text-[10px] text-slate-500">No authoritative aggregate contract yet</div>
        </div>
      </div>
    </div>
  )

  const sideWidgets = (
    <>
      <div className="flex flex-col gap-3 rounded-xl border border-cyan-900/30 bg-black/40 p-4 backdrop-blur-md">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-500 uppercase">
          <Building2 className="h-4 w-4" /> Role Distribution
        </h3>
        <p className="text-xs leading-5 text-slate-500">
          Unavailable. The current generic REST contract does not expose the vx.user many-to-many
          role relation as an authoritative readable/filterable field.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-cyan-900/30 bg-black/40 p-4 backdrop-blur-md">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-500 uppercase">
          <LogIn className="h-4 w-4" /> Recent Login Activity
        </h3>
        <p className="text-xs leading-5 text-slate-500">
          Unavailable. The existing session analytics model has no authoritative user relation, so
          Command Center does not infer or fabricate per-user login history.
        </p>
      </div>
    </>
  )

  const tabs = [
    { id: "all", label: "All Users" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
  ]

  const filterWidgets = (
    <>
      <select
        value={statusFilter}
        onChange={(event) => {
          const value = event.target.value as "all" | "active" | "inactive"
          setStatusFilter(value)
          setActiveTab(value)
        }}
        aria-label="Filter users by status"
        className="h-8 rounded border border-cyan-900/50 bg-black/50 px-2 text-xs text-slate-400 focus:border-cyan-500/50 focus:outline-none"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        value={organizationFilter}
        onChange={(event) => setOrganizationFilter(event.target.value)}
        aria-label="Filter users by organization"
        className="h-8 rounded border border-cyan-900/50 bg-black/50 px-2 text-xs text-slate-400 focus:border-cyan-500/50 focus:outline-none"
      >
        <option value="">All Organizations</option>
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </select>

      <select
        value=""
        disabled
        aria-label="Role filter unavailable"
        className="h-8 rounded border border-cyan-900/50 bg-black/50 px-2 text-xs text-slate-600"
      >
        <option value="">Role filter unavailable</option>
      </select>
    </>
  )

  return (
    <div className="space-y-6">
      <ContextBlock
        title="USER MANAGEMENT"
        subtitle="Manage system users using authoritative Moon API records and explicit availability states."
        operation="USER-MGMT"
        status="ONLINE"
        accentColor="system"
      />

      <MoonDataTable
        modelName="vx.user"
        title="User Management"
        description="Persistence-backed users from the canonical Moon API."
        columns={userColumns}
        icon={<Users className="h-5 w-5" />}
        topWidgets={topWidgets}
        sideWidgets={sideWidgets}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        filters={tableFilters}
        filterWidgets={filterWidgets}
      />
    </div>
  )
}

export { UsersView as ErpUsersView }
