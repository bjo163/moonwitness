"use client"

import React from "react"
import Image from "next/image"
import { BookOpen, Scroll, Clock, ArrowRight } from "lucide-react"

export function TodaySnapshotPanel() {
  return (
    <div className="flex flex-col space-y-3 lg:col-span-3">
      <div className="mb-1 text-[10px] font-black tracking-widest text-primary uppercase">
        TODAY&apos;S SNAPSHOT
      </div>

      <div className="bg-background flex items-start gap-3 rounded-lg border border-primary/30 p-3 shadow-xs">
        <div className="shrink-0 rounded border border-primary/30 bg-primary/20 p-2 text-primary">
          <BookOpen className="h-4 w-4" />
        </div>
        <div>
          <div className="mb-1 text-[10px] font-black tracking-wider text-primary uppercase">
            TODAY&apos;S VERSE
          </div>
          <div className="mb-1 text-xs font-bold text-foreground">
            Qur&apos;an 67:5
          </div>
          <div className="font-sans text-[9px] leading-relaxed text-primary">
            He who created death and life to test you [as to] which of you is best in deed.
          </div>
        </div>
      </div>

      <div className="bg-background flex items-start gap-3 rounded-lg border border-warning/30 p-3 shadow-xs">
        <div className="shrink-0 rounded border border-warning/30 bg-warning/10 p-2 text-warning">
          <Scroll className="h-4 w-4" />
        </div>
        <div>
          <div className="mb-1 text-[10px] font-black tracking-wider text-warning uppercase">
            TODAY&apos;S HADITH
          </div>
          <div className="mb-1 text-xs font-bold text-foreground">
            Sahih Bukhari 1
          </div>
          <div className="font-sans text-[9px] leading-relaxed text-primary">
            Actions are but by intentions, and everyone will have what he intended.
          </div>
        </div>
      </div>

      <div className="bg-background flex items-center gap-3 rounded-lg border border-border p-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image
            unoptimized
            width={120}
            height={120}
            alt="Moon Status"
            src="/assets/cam_moon.png"
            className="h-full w-full object-cover opacity-80 grayscale"
          />
        </div>
        <div className="flex-1">
          <div className="mb-0.5 text-[10px] font-black tracking-wider text-primary uppercase">
            MOON STATUS
          </div>
          <div className="mb-1 text-[11px] font-bold text-foreground uppercase">
            WAXING GIBBOUS
          </div>
          <div className="flex justify-between text-[8px] text-muted-foreground">
            <span>Illumination 72%</span>
            <span>Age 12.6 Days</span>
          </div>
        </div>
      </div>

      <div className="bg-background group flex cursor-pointer items-center justify-between rounded-lg border border-success/30 p-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="shrink-0 rounded border border-success/30 bg-success/10 p-2 text-success">
            <Clock className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="mb-0.5 text-[10px] font-black tracking-wider text-success uppercase">
              PRAYER WINDOW
            </div>
            <div className="text-[9px] text-primary uppercase">
              NEXT WAKTU
            </div>
            <div className="text-[11px] font-bold text-foreground">
              Dhuhr 11:55 WIB
            </div>
          </div>
        </div>
        <div className="text-right">
          <ArrowRight className="mb-2 ml-auto h-3 w-3 text-primary transition-colors group-hover:text-success" />
          <div className="text-xs font-black text-success">
            05:04:43
          </div>
        </div>
      </div>
    </div>
  )
}
