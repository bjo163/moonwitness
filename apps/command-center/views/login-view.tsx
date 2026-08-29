"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Sparkles, KeyRound } from "lucide-react"
import { useAuthSession } from "@moon/client"
import { soundEngine } from "@workspace/ui"

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
      soundEngine.playClick()
      await login({
        email,
        password,
      })

      soundEngine.playSuccessChime()
      router.push("/dashboard")
    } catch (err: any) {
      soundEngine.playAlertTone()
      setErrorMsg(err?.message || "Invalid email or password. Please try again.")
      setLoading(false)
    }
  }

  const handleQuickPreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail)
    setPassword(presetPass)
    soundEngine.playClick()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background font-sans text-foreground selection:bg-primary/30 selection:text-foreground">
      {/* Background Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,240,255,0.08),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_120%,rgba(161,0,255,0.08),rgba(255,255,255,0))]" />
        <div className="bg-muted/20 absolute inset-0 opacity-40" />
      </div>

      <main className="relative z-10 w-full max-w-md p-6">
        {/* Terminal Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/40 bg-card/80 text-primary shadow-sm backdrop-blur-md">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase sm:text-3xl">
            MOONWITNESS OS
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Sign in to access the Command Center
          </p>
        </div>

        {/* Glass Form Card */}
        <div className="relative rounded-2xl border border-border/40 bg-card/85 p-8 shadow-xl backdrop-blur-xl">
          {errorMsg && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-center text-xs font-medium text-destructive">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@moonwitness.os"
                className="w-full rounded-lg border border-border/50 bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background/90 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-border/50 bg-background/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background/90 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Demo Accounts Preset Buttons */}
            <div className="pt-2">
              <span className="mb-2 block text-[11px] font-medium text-muted-foreground">
                Demo Accounts:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPreset("commander@moonwitness.os", "password123")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-border/40 bg-secondary/50 px-2.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-muted"
                >
                  <KeyRound className="h-3.5 w-3.5 text-primary" />
                  Commander
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("admin@moonwitness.org", "admin123")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-border/40 bg-secondary/50 px-2.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Administrator
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-sans text-xs font-bold tracking-wide text-primary-foreground uppercase shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Protected System • MoonWitness OS V9.5
          </p>
        </div>
      </main>
    </div>
  )
}
