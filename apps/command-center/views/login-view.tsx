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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030508] font-mono text-white selection:bg-cyber-purple/30 selection:text-white">
      {/* Background Holographic Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(161,0,255,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(0,240,255,0.12),rgba(255,255,255,0))]" />
        <div className="theme-grid-bg absolute inset-0 opacity-30" />
      </div>

      <main className="relative z-10 w-full max-w-md p-6">
        {/* Terminal Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyber-purple/40 bg-cyber-purple/10 text-cyber-purple shadow-[0_0_25px_rgba(161,0,255,0.3)] backdrop-blur-md">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <h1 className="font-sans text-2xl font-black tracking-widest text-white uppercase sm:text-3xl">
            MOONWITNESS OS
          </h1>
          <p className="mt-1 font-mono text-[10px] tracking-widest text-cyber-purple uppercase">
            ◈ COMMAND CENTER // CLEARANCE GATEWAY ◈
          </p>
        </div>

        {/* Tactical Glass Form Card */}
        <div className="relative rounded-2xl border border-cyber-purple/30 bg-black/80 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          {errorMsg && (
            <div className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-center font-mono text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Operator Identifier */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-wider text-primary/70 uppercase">
                <Mail className="h-3 w-3 text-cyber-purple" />
                Operator Callsign / Email
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@moonwitness.os"
                className="w-full rounded-xl border border-cyan-500/20 bg-black/60 px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-cyber-purple focus:bg-cyber-purple/10 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              />
            </div>

            {/* Tactical Access Key */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-wider text-primary/70 uppercase">
                <Lock className="h-3 w-3 text-cyber-purple" />
                Security Access Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-cyan-500/20 bg-black/60 px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:border-cyber-purple focus:bg-cyber-purple/10 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              />
            </div>

            {/* Clearance Preset Buttons */}
            <div className="pt-1">
              <span className="mb-2 block font-mono text-[9px] text-primary/50 uppercase">
                Quick Clearance Preset:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPreset("commander@moonwitness.os", "password123")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-cyber-purple/30 bg-cyber-purple/10 px-2 py-1.5 font-mono text-[10px] text-cyber-purple hover:bg-cyber-purple/20"
                >
                  <KeyRound className="h-3 w-3" />
                  COMMANDER (LVL 3)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("admin@moonwitness.org", "admin123")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1.5 font-mono text-[10px] text-cyan-400 hover:bg-cyan-500/20"
                >
                  <Sparkles className="h-3 w-3" />
                  ADMIN ROOT (LVL 3)
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyber-purple bg-cyber-purple/20 py-3.5 font-mono text-xs font-bold tracking-widest text-white uppercase shadow-[0_0_20px_rgba(161,0,255,0.3)] transition-all hover:bg-cyber-purple hover:shadow-[0_0_30px_rgba(161,0,255,0.6)] disabled:opacity-50"
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
          <p className="font-mono text-[9px] tracking-widest text-primary/40 uppercase">
            RESTRICTED ACCESS // DIVINE COMMAND MATRIX V9.0
          </p>
        </div>
      </main>
    </div>
  )
}
