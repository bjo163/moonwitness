"use client"

import React from "react"
import { Layers, ArrowRight } from "lucide-react"
import { Button } from "./button"

export function HeroBanner({
  profile,
  name = "User",
}: {
  profile?: {
    title?: string
    level?: number
  } | null
  name?: string
}) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm md:p-8">
      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        {/* Left Side: User Info */}
        <div className="space-y-3">
          <div>
            <p className="font-sans text-xs text-muted-foreground">Welcome back,</p>
            <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {name}
            </h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Role: {profile?.title || "Member"} • Level {profile?.level || 1}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
              <Layers className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-foreground font-medium">
                Workspace Active
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Overview Card */}
        <div className="w-full max-w-sm rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:bg-accent/40">
          <h3 className="mb-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Daily Reflection
          </h3>
          <p className="mb-3 font-sans text-xs text-foreground leading-relaxed">
            Stay curious, keep observing, and let knowledge lead you closer to the Creator.
          </p>
          <Button type="button" variant="ghost" className="group inline-flex items-center gap-1.5 font-sans text-xs font-medium text-primary hover:underline">
            View Knowledge Insights
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
