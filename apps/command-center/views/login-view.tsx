"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, Sparkles, KeyRound } from "lucide-react"
import { useAuthSession } from "@moon/client"
import { Button, Input, soundEngine, StatusNotice } from "@workspace/ui"

export function CommandCenterLoginView() {
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
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-x-hidden overflow-y-auto bg-background px-2 py-8 font-sans text-foreground selection:bg-primary/30 selection:text-foreground sm:px-0">
      <main className="w-full max-w-md p-3 sm:p-6">
        {/* Terminal Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md border border-border bg-card text-primary">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            MoonWitness OS
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Sign in to access the Command Center
          </p>
        </div>

        <div className="rounded-md border border-border bg-card p-5 sm:p-8">
          {errorMsg && (
            <StatusNotice variant="destructive" message={errorMsg} className="mb-5 text-center text-xs" />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="command-center-email" className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Email Address
              </label>
              <Input
                id="command-center-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@moonwitness.os"
                className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="command-center-password" className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" />
                Password
              </label>
              <Input
                id="command-center-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Demo Accounts Preset Buttons */}
            <div className="pt-2">
              <span className="mb-2 block text-[11px] font-medium text-muted-foreground">
                Demo accounts
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => handleQuickPreset("commander@moonwitness.os", "password123")}
                  className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-muted"
                >
                  <KeyRound className="h-3.5 w-3.5 text-primary" />
                  Supervisor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => handleQuickPreset("admin@moonwitness.org", "admin123")}
                  className="flex items-center justify-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Administrator
                </Button>
              </div>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-sans text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
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
            </Button>
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
