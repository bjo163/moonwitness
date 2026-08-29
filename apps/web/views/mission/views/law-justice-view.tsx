"use client"

import React from "react"
import {
  Scale,
  Shield,
  Users,
  ArrowRight,
  Gavel,
  FileText,
  CheckCircle2,
} from "lucide-react"

export function LawJusticeView() {
  return (
    <div className="min-h-screen bg-card p-4 font-sans text-white select-none md:p-8">
      {/* ═══ HEADER ROW ═══ */}
      <div className="relative mb-8 grid grid-cols-1 gap-8 overflow-hidden rounded-2xl border border-white/5 bg-card p-8 lg:grid-cols-12">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-500/10 blur-[80px]" />

        <div className="relative z-10 flex flex-col justify-center lg:col-span-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 shadow-sm">
              <Scale className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
              UMBRELLA MODULE
            </span>
          </div>

          <h1 className="mb-4 text-3xl leading-tight font-black tracking-wider text-white md:text-5xl">
            LAW, JUSTICE &<br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              LIBERATION
            </span>
          </h1>

          <p className="mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            "And let not the hatred of others to you make you swerve to wrong
            and depart from justice. Be just: that is next to piety." (Q.S.
            Al-Ma'idah: 8)
          </p>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 rounded bg-emerald-500 px-6 py-3 text-[10px] font-bold tracking-widest text-foreground uppercase transition-colors hover:bg-emerald-400">
              <Gavel className="h-4 w-4" /> INITIATE ADVOCACY
            </button>
            <button className="flex items-center gap-2 rounded border border-white/10 bg-transparent px-6 py-3 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10">
              <FileText className="h-4 w-4" /> LEGAL MANIFESTO
            </button>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center lg:col-span-5">
          {/* Abstract Scales SVG Mockup */}
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
              {/* Central Pillar */}
              <rect
                x="98"
                y="40"
                width="4"
                height="120"
                fill="url(#scaleGrad)"
                rx="2"
              />
              {/* Base */}
              <path
                d="M 70 160 L 130 160 L 140 180 L 60 180 Z"
                fill="rgba(16,185,129,0.2)"
                stroke="url(#scaleGrad)"
                strokeWidth="1"
              />
              {/* Beam */}
              <rect
                x="40"
                y="60"
                width="120"
                height="4"
                fill="url(#scaleGrad)"
                rx="2"
              />
              {/* Left Pan Chains */}
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
              {/* Right Pan Chains */}
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
              {/* Left Pan */}
              <path
                d="M 10 120 Q 42 140 74 120 Z"
                fill="rgba(6,182,212,0.3)"
                stroke="url(#scaleGrad)"
                strokeWidth="1"
              />
              {/* Right Pan */}
              <path
                d="M 126 120 Q 158 140 190 120 Z"
                fill="rgba(6,182,212,0.3)"
                stroke="url(#scaleGrad)"
                strokeWidth="1"
              />

              {/* Glowing Nodes */}
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

            {/* Overlay Text */}
            <div className="absolute top-[35%] left-[10%] text-center">
              <div className="text-[20px] font-bold text-white">42%</div>
              <div className="text-[6px] tracking-widest text-emerald-400 uppercase">
                JUSTICE INDEX
              </div>
            </div>
            <div className="absolute top-[35%] right-[10%] text-center">
              <div className="text-[20px] font-bold text-white">58%</div>
              <div className="text-[6px] tracking-widest text-emerald-400 uppercase">
                LIBERATION
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ THREE PILLARS ROW ═══ */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            t: "UNIVERSAL JUSTICE",
            d: "Ensuring fair treatment, equal rights, and unbiased trials for all humanity regardless of background.",
            i: Scale,
            c: "text-emerald-400",
            bg: "bg-emerald-400/10",
            bc: "border-emerald-500/30",
          },
          {
            t: "LIBERATION OF OPPRESSED",
            d: "Actively breaking the systemic chains of the Mustadhafin (the marginalized and oppressed).",
            i: Shield,
            c: "text-cyan-400",
            bg: "bg-cyan-400/10",
            bc: "border-cyan-500/30",
          },
          {
            t: "HUMAN RIGHTS ADVOCACY",
            d: "Providing immediate legal aid, resources, and protection for those facing tyrannical systems.",
            i: Users,
            c: "text-blue-400",
            bg: "bg-blue-400/10",
            bc: "border-blue-500/30",
          },
        ].map((p, i) => (
          <div
            key={i}
            className="group rounded-xl border border-white/5 bg-card p-6 transition-colors hover:border-white/20"
          >
            <div
              className={`h-12 w-12 rounded-lg ${p.bg} ${p.bc} mb-6 flex items-center justify-center border transition-transform group-hover:scale-110`}
            >
              <p.i className={`h-6 w-6 ${p.c}`} />
            </div>
            <h3 className="mb-3 text-sm font-bold tracking-widest text-white uppercase">
              {p.t}
            </h3>
            <p className="mb-6 text-[11px] leading-relaxed text-muted-foreground">
              {p.d}
            </p>
            <button
              className={`text-[9px] ${p.c} group/btn flex items-center gap-1 font-bold tracking-widest uppercase`}
            >
              EXPLORE INITIATIVE{" "}
              <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        ))}
      </div>

      {/* ═══ DATA INTELLIGENCE ROW ═══ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Active Cases */}
        <div className="rounded-xl border border-white/5 bg-card p-6 lg:col-span-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase">
              ACTIVE LIBERATION FRONTS
            </h3>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/20 px-2 py-1 text-[8px] font-bold tracking-widest text-emerald-400 uppercase">
              3 HIGH PRIORITY
            </span>
          </div>

          <div className="space-y-4">
            {[
              {
                region: "Gaza Legal Defense",
                status: "Active Filing",
                progress: 75,
                cases: "12,450",
                color: "bg-emerald-500",
              },
              {
                region: "Uyghur Human Rights",
                status: "Investigating",
                progress: 45,
                cases: "8,300",
                color: "bg-cyan-500",
              },
              {
                region: "Sudan Refugee Aid",
                status: "Intervention",
                progress: 60,
                cases: "5,120",
                color: "bg-blue-500",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="flex flex-col justify-between gap-4 rounded-lg border border-white/5 bg-card p-4 md:flex-row md:items-center"
              >
                <div>
                  <div className="mb-1 text-[11px] font-bold tracking-widest text-white uppercase">
                    {c.region}
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    {c.cases} Affected Individuals
                  </div>
                </div>
                <div className="w-full max-w-xs flex-1">
                  <div className="mb-1.5 flex justify-between text-[8px] tracking-widest uppercase">
                    <span className="text-white/70">{c.status}</span>
                    <span className="text-white">{c.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full ${c.color} rounded-full`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
                <button className="rounded border border-white/10 px-4 py-2 text-[8px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white/5">
                  View Docket
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Directives */}
        <div className="flex flex-col rounded-xl border border-white/5 bg-card p-6 lg:col-span-4">
          <div className="mb-6">
            <h3 className="text-[10px] font-bold tracking-widest text-white uppercase">
              STRATEGIC DIRECTIVES
            </h3>
            <p className="mt-1 text-[9px] text-muted-foreground">
              Core tenets of prophetic justice
            </p>
          </div>

          <div className="flex-1 space-y-4">
            {[
              "Uphold truth unequivocally",
              "Protect the weak and voiceless",
              "Reject systemic tyranny",
              "Ensure equitable resource distribution",
              "Foster restorative justice",
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-[10px] leading-relaxed text-white/80">
                  {d}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="mb-1 text-[8px] tracking-widest text-muted-foreground uppercase">
              UMBRELLA COMMANDER
            </div>
            <div className="font-mono text-[10px] font-bold text-emerald-400">
              ALLIANCE OF THE JUST
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
