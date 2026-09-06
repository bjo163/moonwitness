"use client"

import React from "react"
import { Sun, Bell, Sunrise } from "lucide-react"

export function SunPositionFooter() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
        <Sun className="h-8 w-8 shrink-0 text-warning" />
        <div>
          <div className="mb-1.5 text-[10px] font-bold tracking-widest text-foreground uppercase">
            DAILY LIGHT REMINDER
          </div>
          <p className="mb-3 text-[9px] leading-relaxed text-muted-foreground">
            Don't forget to get 15-30 minutes of sunlight every morning. Your
            body, mind, and soul need it.
          </p>
          <button className="flex items-center gap-1 text-[8px] font-bold tracking-widest text-success uppercase transition-colors hover:text-success">
            <Bell className="h-3 w-3" /> SET REMINDER
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-2 text-[10px] font-bold tracking-widest text-foreground uppercase">
          PROPHETIC WISDOM
        </div>
        <p className="text-[10px] leading-relaxed text-muted-foreground italic">
          "The example of the believers in their mutual love, mercy and
          compassion is like one body; when one part suffers, the whole body
          responds with wakefulness and fever."
        </p>
        <div className="mt-3 text-[8px] tracking-widest text-warning uppercase">
          - Sahih Bukhari (6011)
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-2 text-[10px] font-bold tracking-widest text-foreground uppercase">
          ANCIENT WISDOM
        </div>
        <p className="text-[10px] leading-relaxed text-muted-foreground italic">
          "Sunlight is the best medicine. It heals the body, uplifts the
          spirit, and illuminates the soul."
        </p>
      </div>

      <div className="group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-border bg-card p-6">
        <div className="relative z-10">
          <div className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            COUNTDOWN TO NEXT SUNRISE
          </div>
          <p className="mb-4 text-[9px] leading-relaxed text-muted-foreground">
            Prepare for another day of light
          </p>
          <div className="flex gap-4 font-mono text-3xl font-black text-foreground md:text-4xl">
            <div className="flex flex-col items-center">
              07
              <span className="mt-1 font-sans text-[7px] tracking-widest text-warning">
                HOURS
              </span>
            </div>
            <div className="animate-pulse text-muted-foreground">:</div>
            <div className="flex flex-col items-center">
              27
              <span className="mt-1 font-sans text-[7px] tracking-widest text-warning">
                MINUTES
              </span>
            </div>
            <div className="animate-pulse text-muted-foreground">:</div>
            <div className="flex flex-col items-center text-warning">
              26
              <span className="mt-1 font-sans text-[7px] tracking-widest text-muted-foreground">
                SECONDS
              </span>
            </div>
          </div>
        </div>
        <div className="relative z-10 mr-2 flex flex-col items-center transition-transform group-hover:scale-110 lg:mr-6">
          <Sunrise className="mb-2 h-8 w-8 text-warning drop-shadow-sm" />
          <div className="text-[8px] font-bold tracking-widest text-warning uppercase">
            Next Sunrise
          </div>
        </div>

        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-48 bg-gradient-to-l from-amber-500/10 to-transparent" />
      </div>
    </div>
  )
}
