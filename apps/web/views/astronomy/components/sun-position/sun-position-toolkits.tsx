"use client"

import React from "react"
import {
  Target,
  AlertTriangle,
  Activity,
  Bell,
  BookOpen,
  Shield,
  Clock,
  Eye,
  Heart,
  Smile,
  Sun,
  ChevronRight,
  Zap,
} from "lucide-react"

export function SunPositionToolkits() {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Toolkits */}
      <div className="rounded-xl border border-border bg-card p-5 lg:col-span-6">
        <div className="mb-6">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            SUNLIGHT INTELLIGENT TOOLKITS
          </h3>
          <p className="text-[9px] text-muted-foreground">
            Operational tools to optimize your light, health & life
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            {
              l: "SUN TRACKER",
              d: "Track sun position in real-time",
              i: Target,
            },
            {
              l: "UV ALERT SYSTEM",
              d: "Get notified for high UV index",
              i: AlertTriangle,
            },
            {
              l: "VITAMIN D CALCULATOR",
              d: "Estimate your daily Vitamin D needs",
              i: Activity,
            },
            {
              l: "EXPOSURE REMINDER",
              d: "Smart reminder for sunlight",
              i: Bell,
            },
            {
              l: "DAILY LIGHT REPORT",
              d: "View your sunlight report & insights",
              i: BookOpen,
            },
            {
              l: "SKIN TYPE GUIDE",
              d: "Find safe exposure time for your skin",
              i: Shield,
            },
            {
              l: "CIRCADIAN OPTIMIZER",
              d: "Optimize your daily rhythm",
              i: Clock,
            },
            {
              l: "SLEEP CYCLE GUIDE",
              d: "Auto-sync light with your sleep",
              i: Eye,
            },
            {
              l: "HEALTH INSIGHTS",
              d: "AI-powered health recommendations",
              i: Heart,
            },
            {
              l: "WELLNESS SCORE",
              d: "Overall sunlight wellness score",
              i: Smile,
            },
          ].map((t, i) => (
            <div
              key={i}
              className="group flex cursor-pointer gap-3 rounded-xl border border-border p-3 transition-colors hover:border-warning/30 hover:bg-amber-500/5"
            >
              <t.i className="h-5 w-5 shrink-0 text-warning transition-transform group-hover:scale-110" />
              <div>
                <div className="mb-1 text-[8px] font-bold tracking-widest text-foreground uppercase">
                  {t.l}
                </div>
                <div className="text-[7px] leading-relaxed text-muted-foreground">
                  {t.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spiritual Light Connection */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 lg:col-span-3">
        <div className="relative z-10 mb-4">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            SPIRITUAL LIGHT CONNECTION
          </h3>
          <p className="text-[9px] text-muted-foreground">
            Align your heart with the Light
          </p>
        </div>

        <ul className="relative z-10 mt-6 space-y-4">
          <li className="flex items-start gap-3">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-warning/30 bg-warning/10">
              <Sun className="h-2 w-2 text-warning" />
            </div>
            <span className="pt-0.5 text-[9px] leading-relaxed text-foreground">
              Reflect on gratitude daily
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-warning/30 bg-warning/10">
              <Sun className="h-2 w-2 text-warning" />
            </div>
            <span className="pt-0.5 text-[9px] leading-relaxed text-foreground">
              Seek the Light in knowledge
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-warning/30 bg-warning/10">
              <Sun className="h-2 w-2 text-warning" />
            </div>
            <span className="pt-0.5 text-[9px] leading-relaxed text-foreground">
              Spread kindness & mercy
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-warning/30 bg-warning/10">
              <Sun className="h-2 w-2 text-warning" />
            </div>
            <span className="pt-0.5 text-[9px] leading-relaxed text-foreground">
              Live with purpose & truth
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-warning/30 bg-warning/10">
              <Sun className="h-2 w-2 text-warning" />
            </div>
            <span className="pt-0.5 text-[9px] leading-relaxed text-foreground">
              Be a light for others
            </span>
          </li>
        </ul>

        <div className="relative z-10 mt-8 border-t border-border pt-4">
          <p className="font-mono text-[10px] leading-relaxed text-warning italic">
            "The true light shines in the heart that beats the truth."
          </p>
          <p className="mt-2 text-[7px] tracking-widest text-muted-foreground uppercase">
            - INSPIRED BY AR-RUH (17:85)
          </p>
        </div>

        {/* Subtle Silhouette Background */}
        <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[180px] w-[180px] opacity-10 transition-opacity duration-700 group-hover:opacity-30">
          <img
            src="/assets/hero/24-hero.png"
            alt="Silhouette"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="pointer-events-none absolute right-0 bottom-0 h-[100px] w-[180px] bg-gradient-to-t -background to-transparent" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col rounded-xl border border-border bg-card p-5 lg:col-span-3">
        <div className="mb-6">
          <h3 className="mb-1 text-[10px] font-bold tracking-widest text-foreground uppercase">
            QUICK ACTIONS
          </h3>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {[
            { l: "START SUN EXPOSURE TIMER", i: Clock },
            { l: "CHECK VITAMIN D LEVEL", i: Activity },
            { l: "VIEW SUNLIGHT REPORT", i: BookOpen },
            { l: "SYNC WITH WEARABLES", i: Zap },
            { l: "SET DAILY REMINDER", i: Bell },
          ].map((q, i) => (
            <button
              key={i}
              className="group flex w-full items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-warning/30 hover:bg-amber-500/5"
            >
              <div className="flex items-center gap-3">
                <q.i className="h-4 w-4 text-warning" />
                <span className="text-[9px] font-bold tracking-widest text-foreground uppercase">
                  {q.l}
                </span>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-warning" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
