"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Sparkles, KeyRound } from "lucide-react"
import { useAuthSession } from "@moon/client"
import { cosmicAudio } from "@workspace/ui"

export function LoginView() {
  const router = useRouter()
  const { login } = useAuthSession()

  const [email, setEmail] = useState("commander@moonwitness.os")
  const [password, setPassword] = useState("password123")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      cosmicAudio.playTacticalClick()
      await login({
        email,
        password,
      })

      cosmicAudio.playAlignmentChime()
      router.push("/dashboard")
    } catch (err: any) {
      cosmicAudio.playModalPulse()
      setErrorMsg(err?.message || "AUTHENTICATION FAILED. INVALID CLEARANCE.")
      setLoading(false)
    }
  }

  const handleQuickPreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail)
    setPassword(presetPass)
    cosmicAudio.playTacticalClick()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cyber-dark font-sans text-white selection:bg-cyber-cyan/30 selection:text-white">
      {/* Background Holographic Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,240,255,0.08),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(161,0,255,0.08),rgba(255,255,255,0))]" />
        <div className="bg-cosmic-grid absolute inset-0 opacity-40" />
      </div>

      <main className="relative z-10 w-full max-w-md p-6">
        {/* Terminal Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-card/80 text-cyber-cyan shadow-sm backdrop-blur-md">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase sm:text-3xl">
            MOONWITNESS OS
          </h1>
          <p className="mt-1 font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Command Center // Clearance Gateway
          </p>
        </div>

        {/* Tactical Glass Form Card */}
        <div className="relative rounded-2xl border border-white/10 bg-card/85 p-8 shadow-xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-xs font-medium text-red-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Operator Identifier */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-cyber-cyan" />
                Operator Callsign / Email
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@moonwitness.os"
                className="w-full rounded-lg border border-white/10 bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-cyber-cyan focus:bg-background/90 focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
              />
            </div>

            {/* Tactical Access Key */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-cyber-cyan" />
                Security Access Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-white/10 bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-cyber-cyan focus:bg-background/90 focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
              />
            </div>

            {/* Clearance Preset Buttons */}
            <div className="pt-2">
              <span className="mb-2 block font-mono text-[10px] text-muted-foreground uppercase">
                Quick Clearance Presets:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPreset("commander@moonwitness.os", "password123")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-mono text-xs text-foreground transition-colors hover:border-cyber-purple/50 hover:bg-cyber-purple/10"
                >
                  <KeyRound className="h-3.5 w-3.5 text-cyber-purple" />
                  COMMANDER
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("admin@moonwitness.org", "admin123")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-mono text-xs text-foreground transition-colors hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10"
                >
                  <Sparkles className="h-3.5 w-3.5 text-cyber-cyan" />
                  ADMIN ROOT
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-cyber-cyan px-4 py-3 font-sans text-xs font-bold tracking-wide text-cyber-dark uppercase shadow-sm transition-all hover:bg-cyber-cyan/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AUTHENTICATING CLEARANCE...
                </>
              ) : (
                <>
                  INITIALIZE SESSION <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tactical Footer */}
        <div className="mt-6 text-center">
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            RESTRICTED ACCESS // DIVINE COMMAND MATRIX V9.5
          </p>
        </div>
      </main>
    </div>
  )
}
