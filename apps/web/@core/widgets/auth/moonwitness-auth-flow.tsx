"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@core/api/client"
import {
  AuthState,
  WelcomeStep,
  WorkspaceStep,
  TwoFactorStep,
  Forgot1Step,
  Forgot2Step,
  Reset3Step,
  VerificationStep,
  SuccessStep,
} from "./moonwitness-auth-substeps"

const WORKSPACE_REDIRECT_DELAY_MS = 2000
const LOGIN_SUCCESS_DELAY_MS = 1000

export function MoonwitnessAuthFlow() {
  const router = useRouter()
  const [currentState, setCurrentState] = useState<AuthState>("WELCOME")
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleWorkspaceSelect = (path: string) => {
    setCurrentState("SUCCESS")
    setTimeout(() => router.push(path), WORKSPACE_REDIRECT_DELAY_MS)
  }

  const renderLogin = () => (
    <div className="w-full max-w-[420px] rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center">
        <h2 className="font-sans text-2xl font-bold text-white">WELCOME BACK</h2>
        <p className="mt-1 font-sans text-xs text-primary/60">Login to continue your mission</p>
      </div>

      <form className="space-y-5" onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")
        try {
          const { data } = await apiClient.post("/api/users/profile", { action: "login", email, password })
          if (data.error) throw new Error(data.error)
          if (data.profile) {
            localStorage.setItem("mw_user_profile", JSON.stringify(data.profile))
            window.dispatchEvent(new Event("storage"))
          }
          setTimeout(() => setCurrentState("WORKSPACE"), LOGIN_SUCCESS_DELAY_MS)
        } catch (err: unknown) {
          setErrorMsg((err as { message?: string }).message || "Authentication failed.")
          setLoading(false)
        }
      }}>
        {errorMsg ? (
          <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-center text-xs font-semibold text-danger">
            {errorMsg}
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">Email or Username</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none"
            placeholder="johnny@moonwitness.org"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none"
            placeholder="••••••••••••••••"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-primary/70 cursor-pointer hover:text-white">
            <input type="checkbox" className="rounded border-cyan-500/30 bg-black/50 text-cyan-500 focus:ring-0 focus:ring-offset-0" />
            Remember me
          </label>
          <button type="button" onClick={() => setCurrentState("FORGOT_1")} className="text-cyan-400 hover:text-cyan-300">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50"
        >
          {loading ? "AUTHENTICATING..." : "LOGIN"}
        </button>
      </form>

      <div className="mt-8 text-center font-sans text-xs text-primary/60">
        Don&apos;t have an account?{" "}
        <button onClick={() => setCurrentState("REGISTER")} className="font-semibold text-cyan-400 hover:text-cyan-300">
          Create one
        </button>
      </div>
    </div>
  )

  const renderRegister = () => (
    <div className="w-full max-w-[480px] rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center">
        <h2 className="font-sans text-2xl font-bold text-white uppercase tracking-wider">CREATE YOUR ACCOUNT</h2>
        <p className="mt-1 font-sans text-xs text-primary/60">Join MoonWitness OS and start your mission</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setCurrentState("VERIFICATION") }}>
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">Full Name</label>
          <input type="text" required className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none" placeholder="Johnny Rocksoul" />
        </div>
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">Email</label>
          <input type="email" required className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none" placeholder="johnny@moonwitness.org" />
        </div>
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">Password</label>
          <input type="password" required className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none" placeholder="••••••••••••••••" />
        </div>
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">Confirm Password</label>
          <input type="password" required className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none" placeholder="••••••••••••••••" />
        </div>

        <div className="flex items-center gap-2 pt-2 text-[10px] text-primary/60">
          <input type="checkbox" required className="rounded border-cyan-500/30 bg-black/50 text-cyan-500 focus:ring-0 focus:ring-offset-0" />
          <span>I agree to the <span className="text-cyan-400 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-cyan-400 cursor-pointer hover:underline">Privacy Policy</span></span>
        </div>

        <button type="submit" className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
          CREATE ACCOUNT
        </button>
      </form>

      <div className="mt-6 text-center font-sans text-xs text-primary/60">
        Already have an account? <button onClick={() => setCurrentState("LOGIN")} className="font-semibold text-cyan-400 hover:text-cyan-300">Login</button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center">
      {currentState === "WELCOME" ? <WelcomeStep onStateChange={setCurrentState} /> : null}
      {currentState === "LOGIN" ? renderLogin() : null}
      {currentState === "REGISTER" ? renderRegister() : null}
      {currentState === "2FA" ? <TwoFactorStep onStateChange={setCurrentState} /> : null}
      {currentState === "WORKSPACE" ? <WorkspaceStep onSelectWorkspace={handleWorkspaceSelect} /> : null}
      {currentState === "FORGOT_1" ? <Forgot1Step onStateChange={setCurrentState} /> : null}
      {currentState === "FORGOT_2" ? <Forgot2Step onStateChange={setCurrentState} /> : null}
      {currentState === "RESET_3" ? <Reset3Step onStateChange={setCurrentState} /> : null}
      {currentState === "VERIFICATION" ? <VerificationStep onStateChange={setCurrentState} /> : null}
      {currentState === "SUCCESS" ? <SuccessStep email={email} /> : null}
    </div>
  )
}
