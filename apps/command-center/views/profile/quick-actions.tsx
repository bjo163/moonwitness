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
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
      <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Quick Actions
      </h3>

      <div className="grid flex-1 grid-cols-1 gap-2.5">
        {actions.map((action, i) => (
          <button
            key={i}
            className="group flex items-center gap-3.5 rounded-lg border border-border bg-muted/30 p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-sm">
              <action.icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-sans text-xs font-semibold text-foreground group-hover:text-accent-foreground">
                {action.label}
              </h4>
              <p className="font-sans text-[11px] text-muted-foreground">
                {action.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
