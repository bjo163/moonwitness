"use client"

import React from "react"
import { MoonwitnessAuthFlow } from "@workspace/ui"

export function LoginView() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-mono text-foreground">
      {/* Immersive Sci-Fi Background Layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen" />
        <div className="theme-grid-bg absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 opacity-70 blur-[120px]" />
      </div>

      <main className="relative z-10 mt-12 flex w-full flex-col items-center justify-center p-6">
        <MoonwitnessAuthFlow />
      </main>

      {/* Footer Branding */}
      <footer className="absolute right-0 bottom-6 left-0 z-10 text-center font-mono text-[9px] font-bold tracking-[0.3em] text-cyan-500/40 uppercase">
        <a href="/home" className="transition-colors hover:text-cyan-400">
          GLOBAL DIVINE OBSERVATORY SYSTEM
        </a>{" "}
        // AUTHORIZED PERSONNEL ONLY
      </footer>
    </div>
  )
}
