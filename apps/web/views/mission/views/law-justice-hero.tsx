"use client"

import { FileText, Gavel, Scale } from "lucide-react"
import { Button } from "@workspace/ui"

export function LawJusticeHero() {
  return (
    <div className="relative mb-8 grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-border bg-card p-8 lg:grid-cols-12">
      <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-success/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />

      <div className="relative z-10 flex flex-col justify-center lg:col-span-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-success/30 bg-success/10 p-3 shadow-sm">
            <Scale className="h-6 w-6 text-success" />
          </div>
          <span className="text-[10px] font-bold tracking-widest text-success uppercase">
            UMBRELLA MODULE
          </span>
        </div>

        <h1 className="mb-4 text-3xl leading-tight font-black tracking-wider text-foreground md:text-5xl">
          LAW, JUSTICE &<br />
          <span className="bg-gradient-to-r from-emerald-400 to-transparent bg-clip-text text-transparent">
            LIBERATION
          </span>
        </h1>

        <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
          "And let not the hatred of others to you make you swerve to wrong
          and depart from justice. Be just: that is next to piety." (Q.S.
          Al-Ma&apos;idah: 8)
        </p>

        <div className="flex gap-4">
          <Button type="button" variant="default" className="flex items-center gap-2 rounded bg-emerald-500 px-6 py-3 text-[10px] font-bold tracking-widest text-foreground uppercase transition-colors hover:bg-emerald-400">
            <Gavel className="h-4 w-4" /> INITIATE ADVOCACY
          </Button>
          <Button type="button" variant="outline" className="flex items-center gap-2 rounded border border-border bg-transparent px-6 py-3 text-[10px] font-bold tracking-widest text-foreground uppercase transition-colors hover:border-emerald-500/50 hover:bg-success/10">
            <FileText className="h-4 w-4" /> LEGAL MANIFESTO
          </Button>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center lg:col-span-5">
        <div className="relative aspect-square w-full max-w-[400px]">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full drop-shadow-sm"
          >
            <defs>
              <linearGradient
                id="scaleGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <rect
              x="98"
              y="40"
              width="4"
              height="120"
              fill="url(#scaleGrad)"
              rx="2"
            />
            <path
              d="M 70 160 L 130 160 L 140 180 L 60 180 Z"
              fill="rgba(16,185,129,0.2)"
              stroke="url(#scaleGrad)"
              strokeWidth="1"
            />
            <rect
              x="40"
              y="60"
              width="120"
              height="4"
              fill="url(#scaleGrad)"
              rx="2"
            />
            <line
              x1="42"
              y1="64"
              x2="20"
              y2="120"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            <line
              x1="42"
              y1="64"
              x2="64"
              y2="120"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            <line
              x1="158"
              y1="64"
              x2="136"
              y2="120"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            <line
              x1="158"
              y1="64"
              x2="180"
              y2="120"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            <path
              d="M 10 120 Q 42 140 74 120 Z"
              fill="rgba(6,182,212,0.3)"
              stroke="url(#scaleGrad)"
              strokeWidth="1"
            />
            <path
              d="M 126 120 Q 158 140 190 120 Z"
              fill="rgba(6,182,212,0.3)"
              stroke="url(#scaleGrad)"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="40"
              r="8"
              fill="#10B981"
              className="animate-pulse drop-shadow-sm"
            />
            <circle cx="42" cy="62" r="4" fill="#06B6D4" />
            <circle cx="158" cy="62" r="4" fill="#06B6D4" />
          </svg>

          <div className="absolute top-[35%] left-[10%] text-center">
            <div className="text-[20px] font-bold text-foreground">42%</div>
            <div className="text-[6px] tracking-widest text-success uppercase">
              JUSTICE INDEX
            </div>
          </div>
          <div className="absolute top-[35%] right-[10%] text-center">
            <div className="text-[20px] font-bold text-foreground">58%</div>
            <div className="text-[6px] tracking-widest text-success uppercase">
              LIBERATION
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
