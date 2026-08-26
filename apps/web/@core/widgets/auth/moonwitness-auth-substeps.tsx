"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  ShieldCheck,
  User,
  Terminal,
  Check,
  Mail,
  Globe,
  ArrowRight,
  Shield,
  Lock,
  ArrowLeft,
} from "lucide-react"
import { useMoonStore } from "@core/store/moon-store"

export type AuthState =
  | "WELCOME"
  | "LOGIN"
  | "2FA"
  | "WORKSPACE"
  | "REGISTER"
  | "FORGOT_1"
  | "FORGOT_2"
  | "RESET_3"
  | "VERIFICATION"
  | "SUCCESS"

const PIN_PLACEHOLDERS = ["2", "7", "4", "6", "8", "1"]
const STRONG_PASSWORD_BARS = 4

export function OrbitIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.5 12c0-4.14-3.36-7.5-7.5-7.5S4.5 7.86 4.5 12s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5"
        strokeDasharray="4 4"
      />
      <path
        d="M12 4.5c4.14 0 7.5 3.36 7.5 7.5s-3.36 7.5-7.5 7.5-7.5-3.36-7.5-7.5"
        strokeDasharray="2 6"
        className="opacity-50"
      />
    </svg>
  )
}

export function WelcomeStep({
  onStateChange,
}: {
  onStateChange: (state: AuthState) => void
}) {
  return (
    <div className="flex animate-in flex-col items-center justify-center space-y-8 duration-500 fade-in zoom-in">
      <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-500/50 bg-black/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
        <div
          className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-cyan-500/30"
          style={{ animationDuration: "20s" }}
        />
        <OrbitIcon className="h-12 w-12 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
      </div>

      <div className="text-center">
        <h1 className="mb-2 font-mono text-4xl font-black tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          MOONWITNESS OS
        </h1>
        <p className="font-sans text-xs font-semibold tracking-[0.3em] text-cyan-400 uppercase">
          GLOBAL DIVINE OBSERVATORY SYSTEM
        </p>
      </div>

      <p className="max-w-md text-center font-sans text-sm text-primary/70">
        Explore the universe, uncover truth, and connect knowledge for humanity.
        Your mission begins here.
      </p>

      <button
        onClick={() => onStateChange("LOGIN")}
        className="group relative mt-4 flex items-center justify-center gap-3 overflow-hidden rounded-full border border-cyan-400 bg-cyan-500/10 px-8 py-3 font-sans text-sm font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
      >
        <span className="absolute inset-0 w-full -translate-x-full bg-white/10 transition-all duration-700 ease-in-out group-hover:translate-x-full" />
        BEGIN JOURNEY{" "}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      <button className="flex items-center gap-2 font-sans text-xs text-primary/50 transition-colors hover:text-cyan-400">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current">
          ?
        </span>{" "}
        Learn More
      </button>
    </div>
  )
}

export function WorkspaceStep({
  onSelectWorkspace,
}: {
  onSelectWorkspace: (path: string) => void
}) {
  return (
    <div className="w-full max-w-[420px] animate-in rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl duration-500 slide-in-from-right">
      <div className="mb-8 text-center">
        <h2 className="font-sans text-2xl font-bold tracking-wider text-white uppercase">
          SELECT WORKSPACE
        </h2>
        <p className="mt-1 font-sans text-xs text-primary/60">
          Choose a workspace to continue
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onSelectWorkspace("/home")}
          className="group relative flex w-full items-center justify-between rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Globe className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <h3 className="font-sans text-sm font-bold text-cyan-100">
                MoonWitness OS
              </h3>
              <p className="font-sans text-[10px] text-cyan-400/70">
                Global Knowledge Observatory
              </p>
            </div>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2.5 py-1 font-sans text-[9px] font-bold text-cyan-300">
            Current
          </span>
        </button>

        <button
          onClick={() => onSelectWorkspace("/erp/dashboard")}
          className="group relative flex w-full items-center justify-between rounded-xl border border-fuchsia-500/30 bg-black/40 p-4 transition-all hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/10 group-hover:border-fuchsia-500/50">
              <ShieldCheck className="h-5 w-5 text-fuchsia-400" />
            </div>
            <div className="text-left">
              <h3 className="font-sans text-sm font-bold text-white">
                ERP Dashboard
              </h3>
              <p className="font-sans text-[10px] text-primary/50">
                Administrative Command Center
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelectWorkspace("/console")}
          className="group relative flex w-full items-center justify-between rounded-xl border border-emerald-500/30 bg-black/40 p-4 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 group-hover:border-emerald-500/50">
              <Terminal className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <h3 className="font-sans text-sm font-bold text-white">
                Developer Console
              </h3>
              <p className="font-sans text-[10px] text-primary/50">
                System Diagnostics & AI
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export function SuccessStep({ email }: { email: string }) {
  const accountName = email.split("@")[0] || "User"
  return (
    <div className="flex animate-in flex-col items-center justify-center space-y-6 duration-500 fade-in zoom-in">
      <div className="border-success bg-success/10 relative flex h-24 w-24 items-center justify-center rounded-full border-2 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
        <Check className="text-success h-10 w-10 drop-shadow-[0_0_10px_rgba(16,185,129,1)]" />
        <div className="border-success/40 absolute inset-0 animate-ping rounded-full border-2" />
      </div>
      <div className="text-center">
        <h2 className="font-mono text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
          ACCESS GRANTED
        </h2>
        <p className="mt-2 font-sans text-sm text-primary/80">
          Welcome back, {accountName}!
        </p>
        <p className="text-success mt-1 animate-pulse font-sans text-xs">
          Redirecting to your destination...
        </p>
      </div>
      <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-black/50">
        <div className="bg-success h-full animate-[slide-right_2s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}

export function TwoFactorStep({
  onStateChange,
}: {
  onStateChange: (state: AuthState) => void
}) {
  return (
    <div className="w-full max-w-[420px] animate-in rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 text-center shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl duration-500 slide-in-from-right">
      <h2 className="mb-2 font-sans text-2xl font-bold tracking-wider text-white uppercase">
        TWO-FACTOR AUTHENTICATION
      </h2>
      <p className="mb-8 font-sans text-xs text-primary/60">
        Enter the 6-digit code from your authenticator app
      </p>

      <div className="mb-8 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <Shield className="h-8 w-8 text-cyan-400" />
        </div>
      </div>

      <div className="mb-6 flex justify-between gap-2">
        {PIN_PLACEHOLDERS.map((num, i) => (
          <input
            key={i}
            type="text"
            value={num}
            readOnly
            className="h-14 w-12 rounded-xl border border-cyan-500/30 bg-black/60 text-center font-mono text-xl text-white shadow-inner focus:outline-none"
          />
        ))}
      </div>

      <p className="mb-6 text-[10px] text-primary/50">Code expires in 00:45</p>

      <div className="mb-6 flex items-center justify-center gap-2 text-xs text-primary/60">
        <input
          type="checkbox"
          className="rounded border-cyan-500/30 bg-black/50 text-cyan-500 focus:ring-0 focus:ring-offset-0"
        />
        Trust this device for 30 days
      </div>

      <button
        onClick={() => onStateChange("WORKSPACE")}
        className="mb-6 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
      >
        VERIFY CODE
      </button>

      <p className="text-xs text-primary/60">
        Having trouble?{" "}
        <span className="cursor-pointer text-cyan-400 hover:underline">
          Use backup code
        </span>
      </p>
    </div>
  )
}

export function Forgot1Step({
  onStateChange,
  onSuccess,
}: {
  onStateChange: (state: AuthState) => void
  onSuccess?: (email: string) => void
}) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { forgotPassword } = useMoonStore()

  return (
    <div className="w-full max-w-[420px] animate-in rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 text-center shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl duration-500 slide-in-from-right">
      <h2 className="mb-2 font-sans text-2xl font-bold tracking-wider text-white uppercase">
        RESET PASSWORD
      </h2>
      <p className="mb-8 font-sans text-xs text-primary/60">
        Enter your email or username and we&apos;ll send you reset instructions
      </p>

      {message ? (
        <div className="border-success/30 bg-success/10 text-success mb-6 rounded-lg border p-3 text-center text-xs font-semibold">
          {message}
        </div>
      ) : null}

      <div className="mb-8 space-y-1.5 text-left">
        <label className="font-sans text-xs font-medium text-primary/80">
          Email or Username
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none"
          placeholder="johnny@moonwitness.org"
        />
      </div>

      <button
        disabled={loading || !email}
        onClick={async () => {
          setLoading(true)
          try {
            const res = await forgotPassword(email)
            setMessage(res?.message || "Password reset instruction sent.")
            if (onSuccess) onSuccess(email)
            setTimeout(() => onStateChange("FORGOT_2"), 1500)
          } catch (e: any) {
            setMessage(e.message || "Failed to reset password")
          } finally {
            setLoading(false)
          }
        }}
        className="mb-8 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50"
      >
        {loading ? "SENDING..." : "SEND RESET LINK"}
      </button>

      <p className="text-xs text-primary/60">
        Remember your password?{" "}
        <button
          onClick={() => onStateChange("LOGIN")}
          className="font-semibold text-cyan-400 hover:text-cyan-300"
        >
          Login
        </button>
      </p>
    </div>
  )
}

export function Forgot2Step({
  email,
  onStateChange,
  onSuccess,
}: {
  email?: string
  onStateChange: (state: AuthState) => void
  onSuccess?: (code: string) => void
}) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const { verifyOtp } = useMoonStore()

  return (
    <div className="w-full max-w-[420px] animate-in rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 text-center shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl duration-500 slide-in-from-right">
      <h2 className="mb-2 font-sans text-2xl font-bold tracking-wider text-white uppercase">
        CHECK YOUR EMAIL
      </h2>
      <p className="mb-8 font-sans text-xs text-primary/60">
        We&apos;ve sent a password reset code to
        <br />
        <span className="text-white">{email || "your email"}</span>
      </p>

      {errorMsg ? (
        <div className="border-danger/30 bg-danger/10 text-danger mb-4 rounded-lg border p-3 text-center text-xs font-semibold">
          {errorMsg}
        </div>
      ) : null}

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="w-full rounded-xl border border-cyan-500/30 bg-black/60 px-4 py-4 text-center text-2xl font-bold tracking-[1em] text-white shadow-inner focus:border-cyan-400 focus:outline-none"
          placeholder="000000"
        />
      </div>

      <p className="mb-4 text-xs text-primary/60">
        Didn&apos;t receive the email?
        <br />
        Check your spam folder or resend the email.
      </p>

      <button
        disabled={loading || code.length < 6}
        onClick={async () => {
          setLoading(true)
          setErrorMsg("")
          try {
            await verifyOtp(email || "", code)
            if (onSuccess) onSuccess(code)
            onStateChange("RESET_3")
          } catch (e: any) {
            setErrorMsg(e.message || "Invalid code")
          } finally {
            setLoading(false)
          }
        }}
        className="mb-8 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50"
      >
        {loading ? "VERIFYING..." : "VERIFY CODE"}
      </button>

      <button
        onClick={() => onStateChange("LOGIN")}
        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
      >
        Back to Login
      </button>
    </div>
  )
}

export function Reset3Step({
  email,
  code,
  onStateChange,
}: {
  email?: string
  code?: string
  onStateChange: (state: AuthState) => void
}) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const { resetPassword } = useMoonStore()

  return (
    <div className="w-full max-w-[420px] animate-in rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 text-center shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl duration-500 slide-in-from-right">
      <h2 className="mb-2 font-sans text-2xl font-bold tracking-wider text-white uppercase">
        CREATE NEW PASSWORD
      </h2>
      <p className="mb-8 font-sans text-xs text-primary/60">
        Enter your new password
      </p>

      {errorMsg ? (
        <div className="border-danger/30 bg-danger/10 text-danger mb-4 rounded-lg border p-3 text-center text-xs font-semibold">
          {errorMsg}
        </div>
      ) : null}

      <div className="mb-2 space-y-1.5 text-left">
        <label className="font-sans text-xs font-medium text-primary/80">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none"
        />
      </div>

      <div className="mb-6 flex items-center justify-between px-1 text-[10px]">
        <span className="text-success font-bold">Strong</span>
        <div className="flex gap-1">
          {Array.from({ length: STRONG_PASSWORD_BARS }).map((_, idx) => (
            <div key={idx} className="bg-success h-1 w-8 rounded-full" />
          ))}
        </div>
      </div>

      <div className="mb-8 space-y-1.5 text-left">
        <label className="font-sans text-xs font-medium text-primary/80">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none"
        />
      </div>

      <button
        disabled={loading || !password || password !== confirmPassword}
        onClick={async () => {
          setLoading(true)
          setErrorMsg("")
          try {
            await resetPassword(email || "", code || "", password)
            onStateChange("LOGIN")
          } catch (e: any) {
            setErrorMsg(e.message || "Failed to reset password")
          } finally {
            setLoading(false)
          }
        }}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50"
      >
        {loading ? "SAVING..." : "RESET PASSWORD"}
      </button>
    </div>
  )
}

export function VerificationStep({
  onStateChange,
}: {
  onStateChange: (state: AuthState) => void
}) {
  return (
    <div className="w-full max-w-[420px] animate-in rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 text-center shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl duration-500 slide-in-from-right">
      <h2 className="mb-2 font-sans text-2xl font-bold tracking-wider text-white uppercase">
        VERIFY YOUR ACCOUNT
      </h2>
      <p className="mb-8 font-sans text-xs text-primary/60">
        Complete your profile to secure your account and personalize your
        experience
      </p>

      <div className="relative mb-8 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/30 bg-black/60 shadow-inner">
          <User className="h-10 w-10 text-primary/40" />
        </div>
        <div className="absolute right-1/2 bottom-0 translate-x-8 rounded-full border border-cyan-500/30 bg-slate-950 p-1">
          <div className="rounded-full bg-cyan-500/20 p-1 text-cyan-400">
            <Globe className="h-3 w-3" />
          </div>
        </div>
      </div>

      <div className="mb-8 space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">
            Full Name
          </label>
          <input
            type="text"
            value="Johnny Rocksoul"
            readOnly
            className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="font-sans text-xs font-medium text-primary/80">
              Country
            </label>
            <select className="w-full appearance-none rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none">
              <option>Indonesia</option>
            </select>
          </div>
          <div className="flex-1 space-y-1.5">
            <label className="font-sans text-xs font-medium text-primary/80">
              Timezone
            </label>
            <select className="w-full appearance-none rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none">
              <option>(UTC+7) Jakarta</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={() => onStateChange("2FA")}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
      >
        SAVE & CONTINUE
      </button>
    </div>
  )
}
