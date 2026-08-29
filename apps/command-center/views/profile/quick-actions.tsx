"use client"

import React from "react"
import {
  Edit3,
  Image as ImageIcon,
  ShieldCheck,
  Settings,
  Activity,
  Download,
} from "lucide-react"

export function QuickActions() {
  const actions = [
    { label: "Edit Profile", desc: "Update your information", icon: Edit3 },
    { label: "Change Avatar", desc: "Update profile picture", icon: ImageIcon },
    {
      label: "Security Center",
      desc: "Manage your security",
      icon: ShieldCheck,
    },
    { label: "Preferences", desc: "Language, theme, etc.", icon: Settings },
    { label: "View My Activity", desc: "See your timeline", icon: Activity },
    { label: "Export My Data", desc: "Download all data", icon: Download },
  ]

  return (
    <div className="flex h-full flex-col rounded-xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-md">
      <h3 className="mb-6 font-sans text-[10px] font-bold tracking-widest text-cyan-500/70 uppercase">
        Quick Actions
      </h3>

      <div className="grid flex-1 grid-cols-1 gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            className="group flex items-center gap-4 rounded-lg border border-cyan-500/10 bg-white/5 p-3 text-left transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-cyan-500/20 bg-black text-cyan-500 transition-all group-hover:text-cyan-400 group-hover:shadow-sm">
              <action.icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-semibold text-slate-200 transition-colors group-hover:text-white">
                {action.label}
              </h4>
              <p className="font-sans text-[9px] text-slate-400">
                {action.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
