"use client"

import React from "react"
import {
  Users,
  Globe2,
  Swords,
  Telescope,
  AlertCircle,
  Clock,
  Filter,
} from "lucide-react"
import { Button } from "@workspace/ui"

export function PropheticTimelineFilters() {
  return (
    <div className="bg-background flex flex-col justify-between rounded-xl border border-border p-4 lg:col-span-3">
      <div>
        <div className="mb-4 text-[9px] font-black tracking-widest text-primary uppercase">
          TIMELINE FILTERS
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Category Column */}
          <div>
            <div className="mb-2 text-[8px] text-primary uppercase">
              CATEGORY
            </div>
            <div className="space-y-1.5 text-[8px] text-primary">
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-primary bg-muted">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>{" "}
                All Categories
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <Users className="h-3 w-3" /> Prophets
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <Globe2 className="h-3 w-3" /> Civilizations
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <Swords className="h-3 w-3" /> Empires
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <Telescope className="h-3 w-3" /> Astronomy
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <AlertCircle className="h-3 w-3" /> Events
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <Clock className="h-3 w-3" /> Future
              </label>
            </div>
          </div>

          {/* Region Column */}
          <div>
            <div className="mb-2 text-[8px] text-primary uppercase">REGION</div>
            <div className="space-y-1.5 text-[8px] text-primary">
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-primary bg-muted">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>{" "}
                All Regions
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="h-2.5 w-2.5 rounded-full border border-border" />{" "}
                Middle East
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="h-2.5 w-2.5 rounded-full border border-border" />{" "}
                Asia
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="h-2.5 w-2.5 rounded-full border border-border" />{" "}
                Europe
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="h-2.5 w-2.5 rounded-full border border-border" />{" "}
                Africa
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="h-2.5 w-2.5 rounded-full border border-border" />{" "}
                Americas
              </label>
            </div>
          </div>

          {/* Time Period Column */}
          <div>
            <div className="mb-2 text-[8px] text-primary uppercase">
              TIME PERIOD
            </div>
            <div className="space-y-1.5 text-[8px] text-primary">
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="flex h-2.5 w-2.5 items-center justify-center rounded-full border border-primary bg-muted">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>{" "}
                All Time
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="h-2.5 w-2.5 rounded-full border border-border" />{" "}
                Before Common Era
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="h-2.5 w-2.5 rounded-full border border-border" />{" "}
                Common Era
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="h-2.5 w-2.5 rounded-full border border-border" />{" "}
                Modern Era
              </label>
              <label className="flex cursor-pointer items-center gap-2 hover:text-foreground">
                <div className="h-2.5 w-2.5 rounded-full border border-border" />{" "}
                Future
              </label>
            </div>
          </div>
        </div>
      </div>

      <Button type="button" variant="ghost" className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-primary/30 bg-primary/10 py-2 text-[9px] font-bold tracking-widest text-primary uppercase transition-colors hover:bg-primary/20">
        APPLY FILTERS <Filter className="h-3 w-3" />
      </Button>
    </div>
  )
}
