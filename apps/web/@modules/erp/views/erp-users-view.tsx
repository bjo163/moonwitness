"use client"

import React, { useState } from "react"
import { ContextBlock } from "@core/ui"
import { MoonDataTable, CrudColumn } from "@core/widgets/crud"
import { Users, Shield, Clock, MonitorPlay, LogIn, Share2, Download } from "lucide-react"

// Dummy data for rendering nice looking badges
const generateRandomStatus = (id: number) => {
  if (id % 7 === 0) return { label: "Pending", color: "text-amber-500", dot: "bg-amber-500", bg: "bg-amber-500/10 border-amber-500/20" }
  if (id % 12 === 0) return { label: "Disabled", color: "text-red-500", dot: "bg-red-500", bg: "bg-red-500/10 border-red-500/20" }
  return { label: "Active", color: "text-emerald-500", dot: "bg-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" }
}

const generateRandomRole = (id: number) => {
  if (id === 1) return { label: "Administrator", color: "text-purple-400" }
  if (id % 15 === 0) return { label: "Editor", color: "text-blue-400" }
  if (id % 8 === 0) return { label: "Moderator", color: "text-amber-400" }
  return { label: "Member", color: "text-emerald-400" }
}

const generateRandomTeam = (id: number) => {
  if (id === 1) return "Core Team"
  if (id % 5 === 0) return "Content Team"
  if (id % 8 === 0) return "Community"
  return "Jamaah Team"
}

export function ErpUsersView() {
  const [activeTab, setActiveTab] = useState("all")

  const userColumns: CrudColumn[] = [
    { 
      name: "name", 
      label: "User", 
      type: "text", 
      required: true,
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/30 overflow-hidden flex items-center justify-center">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.name}&backgroundColor=0f172a`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-200 text-xs">{row.name}</span>
            <span className="text-[10px] text-slate-500">{row.email}</span>
          </div>
        </div>
      )
    },
    { name: "email", label: "Email Address", type: "email", required: true, hideInTable: true },
    { name: "password", label: "Password", type: "password", required: true, hideInTable: true },
    { 
      name: "role", 
      label: "Role",
      hideInForm: true,
      render: (_, row) => {
        const role = generateRandomRole(row.id)
        return <span className={`text-xs font-medium ${role.color}`}>{role.label}</span>
      }
    },
    { 
      name: "team", 
      label: "Team",
      hideInForm: true,
      render: (_, row) => (
        <span className="text-xs text-slate-400">{generateRandomTeam(row.id)}</span>
      )
    },
    { 
      name: "status", 
      label: "Status",
      hideInForm: true,
      render: (_, row) => {
        const status = generateRandomStatus(row.id)
        return (
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} shadow-[0_0_5px_currentColor]`} />
            <span className={`text-xs ${status.color}`}>{status.label}</span>
          </div>
        )
      }
    },
    { 
      name: "last_active", 
      label: "Last Active",
      hideInForm: true,
      render: (_, row) => {
        const status = generateRandomStatus(row.id)
        if (status.label !== "Active") return <span className="text-xs text-slate-600">-</span>
        return <span className="text-xs text-slate-400">{Math.floor(Math.random() * 59) + 1} mins ago</span>
      }
    }
  ]

  const topWidgets = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-cyan-900/30 bg-black/40 backdrop-blur-md p-4 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Users className="w-16 h-16 text-cyan-500" />
        </div>
        <div className="flex items-center gap-2 text-cyan-500">
          <Users className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
        </div>
        <div className="text-2xl font-bold text-white">1,248</div>
        <div className="text-[10px] text-emerald-400">↑ 12.5% vs last month</div>
      </div>
      
      <div className="rounded-xl border border-emerald-900/30 bg-black/40 backdrop-blur-md p-4 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <MonitorPlay className="w-16 h-16 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2 text-emerald-500">
          <MonitorPlay className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
        </div>
        <div className="text-2xl font-bold text-white">982</div>
        <div className="text-[10px] text-emerald-500">78.7% of total users</div>
      </div>

      <div className="rounded-xl border border-purple-900/30 bg-black/40 backdrop-blur-md p-4 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Shield className="w-16 h-16 text-purple-500" />
        </div>
        <div className="flex items-center gap-2 text-purple-500">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Admins</span>
        </div>
        <div className="text-2xl font-bold text-white">18</div>
        <div className="text-[10px] text-purple-400">1.4% of total users</div>
      </div>

      <div className="rounded-xl border border-amber-900/30 bg-black/40 backdrop-blur-md p-4 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Clock className="w-16 h-16 text-amber-500" />
        </div>
        <div className="flex items-center gap-2 text-amber-500">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Pending Approval</span>
        </div>
        <div className="text-2xl font-bold text-white">27</div>
        <div className="text-[10px] text-amber-400">Awaiting review</div>
      </div>
    </div>
  )

  const sideWidgets = (
    <>
      <div className="rounded-xl border border-cyan-900/30 bg-black/40 backdrop-blur-md p-4 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-2">
          <Share2 className="w-4 h-4" /> User Distribution
        </h3>
        
        <div className="flex flex-col gap-3">
          <div className="w-32 h-32 rounded-full border-8 border-cyan-900/30 mx-auto relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-8 border-emerald-500/50 border-t-transparent border-r-transparent transform -rotate-45" />
            <div className="absolute inset-0 rounded-full border-8 border-purple-500 border-l-transparent border-b-transparent border-r-transparent transform rotate-12" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-white">1,248</span>
              <span className="text-[9px] text-slate-500">Total Users</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> <span className="text-slate-400">Administrators</span></div>
              <span className="text-slate-200">1.4%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-slate-400">Editors</span></div>
              <span className="text-slate-200">8.2%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-slate-400">Members</span></div>
              <span className="text-slate-200">87.3%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-cyan-900/30 bg-black/40 backdrop-blur-md p-4 flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-2">
          <LogIn className="w-4 h-4" /> Recent Login Activity
        </h3>
        
        <div className="flex flex-col gap-4">
          {[
            { name: "Rezza Fahlevi", loc: "Jakarta", os: "Windows 11", time: "2 min ago" },
            { name: "Aisyah Rahma", loc: "Bandung", os: "MacOS", time: "15 min ago" },
            { name: "Fadly Maulana", loc: "Surabaya", os: "Android 14", time: "1 hour ago" },
          ].map((log, i) => (
            <div key={i} className="flex gap-3 items-center">
               <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex-shrink-0 border border-cyan-500/20 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.name}&backgroundColor=0f172a`} alt="Avatar" className="w-full h-full object-cover" />
               </div>
               <div className="flex flex-col flex-1">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-200">{log.name}</span>
                    <span className="text-[10px] text-emerald-400">Success</span>
                 </div>
                 <span className="text-[10px] text-slate-500">{log.loc} • {log.os}</span>
               </div>
            </div>
          ))}
        </div>
        <button className="text-[10px] text-cyan-500 hover:text-cyan-400 uppercase tracking-widest text-center mt-2">View All Logs</button>
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
    <button className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400 hover:text-slate-200 border border-cyan-900/50 rounded h-8 px-3 bg-black/40 hover:bg-cyan-900/30 transition-colors">
      <Download className="w-3.5 h-3.5" /> Export
    </button>
  )

  const filterWidgets = (
    <>
      <select className="h-8 bg-black/50 border border-cyan-900/50 rounded px-2 text-xs text-slate-400 focus:outline-none focus:border-cyan-500/50">
        <option>All Roles</option>
        <option>Administrator</option>
        <option>Editor</option>
      </select>
      <select className="h-8 bg-black/50 border border-cyan-900/50 rounded px-2 text-xs text-slate-400 focus:outline-none focus:border-cyan-500/50">
        <option>All Status</option>
        <option>Active</option>
        <option>Pending</option>
      </select>
      <select className="h-8 bg-black/50 border border-cyan-900/50 rounded px-2 text-xs text-slate-400 focus:outline-none focus:border-cyan-500/50">
        <option>All Teams</option>
        <option>Core Team</option>
        <option>Content Team</option>
      </select>
    </>
  )

  return (
    <div className="space-y-6">
      <ContextBlock
        title="USER MANAGEMENT"
        subtitle="Manage system users, roles, and access permissions across the global ERP system."
        operation="USER-MGMT"
        status="ONLINE"
        accentColor="cyan"
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
        filterWidgets={filterWidgets}
        customActions={customActions}
      />
    </div>
  )
}
