"use client"

import React from "react"
import { ShieldCheck, User, Terminal, Check, Mail, Globe, ArrowRight, Shield } from "lucide-react"

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.5 12c0-4.14-3.36-7.5-7.5-7.5S4.5 7.86 4.5 12s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5" strokeDasharray="4 4" />
      <path d="M12 4.5c4.14 0 7.5 3.36 7.5 7.5s-3.36 7.5-7.5 7.5-7.5-3.36-7.5-7.5" strokeDasharray="2 6" className="opacity-50" />
    </svg>
  )
}

export function WelcomeStep({ onStateChange }: { onStateChange: (state: AuthState) => void }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-500/50 bg-black/40 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-cyan-500/30" style={{ animationDuration: '20s' }} />
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
        Explore the universe, uncover truth, and connect knowledge for humanity. Your mission begins here.
      </p>

      <button
        onClick={() => onStateChange("LOGIN")}
        className="group relative mt-4 flex items-center justify-center gap-3 overflow-hidden rounded-full border border-cyan-400 bg-cyan-500/10 px-8 py-3 font-sans text-sm font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
      >
        <span className="absolute inset-0 w-full -translate-x-full bg-white/10 transition-all duration-700 ease-in-out group-hover:translate-x-full" />
        BEGIN JOURNEY <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

      <button className="flex items-center gap-2 font-sans text-xs text-primary/50 hover:text-cyan-400 transition-colors">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current">?</span> Learn More
      </button>
    </div>
  )
}

export function WorkspaceStep({ onSelectWorkspace }: { onSelectWorkspace: (path: string) => void }) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl animate-in slide-in-from-right duration-500">
      <div className="mb-8 text-center">
        <h2 className="font-sans text-2xl font-bold text-white uppercase tracking-wider">SELECT WORKSPACE</h2>
        <p className="mt-1 font-sans text-xs text-primary/60">Choose a workspace to continue</p>
      </div>
      
      <div className="space-y-3">
        <button onClick={() => onSelectWorkspace("/home")} className="group relative flex w-full items-center justify-between rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Globe className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <h3 className="font-sans text-sm font-bold text-cyan-100">MoonWitness OS</h3>
              <p className="font-sans text-[10px] text-cyan-400/70">Global Knowledge Observatory</p>
            </div>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2.5 py-1 font-sans text-[9px] font-bold text-cyan-300">Current</span>
        </button>

        <button onClick={() => onSelectWorkspace("/erp/dashboard")} className="group relative flex w-full items-center justify-between rounded-xl border border-fuchsia-500/30 bg-black/40 p-4 transition-all hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/10 group-hover:border-fuchsia-500/50">
              <ShieldCheck className="h-5 w-5 text-fuchsia-400" />
            </div>
            <div className="text-left">
              <h3 className="font-sans text-sm font-bold text-white">ERP Dashboard</h3>
              <p className="font-sans text-[10px] text-primary/50">Administrative Command Center</p>
            </div>
          </div>
        </button>
        
        <button onClick={() => onSelectWorkspace("/console")} className="group relative flex w-full items-center justify-between rounded-xl border border-emerald-500/30 bg-black/40 p-4 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 group-hover:border-emerald-500/50">
              <Terminal className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <h3 className="font-sans text-sm font-bold text-white">Developer Console</h3>
              <p className="font-sans text-[10px] text-primary/50">System Diagnostics & AI</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

export function SuccessStep({ email }: { email: string }) {
  const accountName = email.split('@')[0] || "User"
  return (
    <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-success bg-success/10 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
        <Check className="h-10 w-10 text-success drop-shadow-[0_0_10px_rgba(16,185,129,1)]" />
        <div className="absolute inset-0 animate-ping rounded-full border-2 border-success/40" />
      </div>
      <div className="text-center">
        <h2 className="font-mono text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">ACCESS GRANTED</h2>
        <p className="mt-2 font-sans text-sm text-primary/80">Welcome back, {accountName}!</p>
        <p className="mt-1 font-sans text-xs text-success animate-pulse">Redirecting to your destination...</p>
      </div>
      <div className="w-64 h-1 mt-8 bg-black/50 rounded-full overflow-hidden">
        <div className="h-full bg-success animate-[slide-right_2s_ease-in-out_infinite]" />
      </div>
    </div>
  )
}

export function TwoFactorStep({ onStateChange }: { onStateChange: (state: AuthState) => void }) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl animate-in slide-in-from-right duration-500 text-center">
      <h2 className="font-sans text-2xl font-bold text-white uppercase tracking-wider mb-2">TWO-FACTOR AUTHENTICATION</h2>
      <p className="font-sans text-xs text-primary/60 mb-8">Enter the 6-digit code from your authenticator app</p>
      
      <div className="flex justify-center mb-8">
        <div className="h-16 w-16 rounded-full border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <Shield className="h-8 w-8 text-cyan-400" />
        </div>
      </div>

      <div className="flex justify-between gap-2 mb-6">
        {PIN_PLACEHOLDERS.map((num, i) => (
          <input key={i} type="text" value={num} readOnly className="w-12 h-14 rounded-xl border border-cyan-500/30 bg-black/60 text-center text-xl font-mono text-white shadow-inner focus:outline-none" />
        ))}
      </div>

      <p className="text-[10px] text-primary/50 mb-6">Code expires in 00:45</p>
      
      <div className="flex items-center justify-center gap-2 text-xs text-primary/60 mb-6">
        <input type="checkbox" className="rounded border-cyan-500/30 bg-black/50 text-cyan-500 focus:ring-0 focus:ring-offset-0" />
        Trust this device for 30 days
      </div>

      <button onClick={() => onStateChange("WORKSPACE")} className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] mb-6">
        VERIFY CODE
      </button>

      <p className="text-xs text-primary/60">Having trouble? <span className="text-cyan-400 cursor-pointer hover:underline">Use backup code</span></p>
    </div>
  )
}

export function Forgot1Step({ onStateChange }: { onStateChange: (state: AuthState) => void }) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl animate-in slide-in-from-right duration-500 text-center">
      <h2 className="font-sans text-2xl font-bold text-white uppercase tracking-wider mb-2">RESET PASSWORD</h2>
      <p className="font-sans text-xs text-primary/60 mb-8">Enter your email or username and we&apos;ll send you reset instructions</p>
      
      <div className="space-y-1.5 text-left mb-8">
        <label className="font-sans text-xs font-medium text-primary/80">Email or Username</label>
        <input type="email" className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none" placeholder="johnny@moonwitness.org" />
      </div>

      <button onClick={() => onStateChange("FORGOT_2")} className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] mb-8">
        SEND RESET LINK
      </button>

      <p className="text-xs text-primary/60">Remember your password? <button onClick={() => onStateChange("LOGIN")} className="font-semibold text-cyan-400 hover:text-cyan-300">Login</button></p>
    </div>
  )
}

export function Forgot2Step({ onStateChange }: { onStateChange: (state: AuthState) => void }) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl animate-in slide-in-from-right duration-500 text-center">
      <h2 className="font-sans text-2xl font-bold text-white uppercase tracking-wider mb-2">CHECK YOUR EMAIL</h2>
      <p className="font-sans text-xs text-primary/60 mb-8">We&apos;ve sent a password reset link to<br/><span className="text-white">johnny@moonwitness.org</span></p>
      
      <div className="flex justify-center mb-8">
        <div className="h-20 w-20 rounded-full border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.1)]">
          <Mail className="h-10 w-10 text-cyan-400" />
        </div>
      </div>

      <p className="text-xs text-primary/60 mb-4">Didn&apos;t receive the email?<br/>Check your spam folder or resend the email.</p>

      <button onClick={() => onStateChange("RESET_3")} className="w-full rounded-xl border border-cyan-500/30 bg-black/40 py-3.5 font-sans text-sm font-bold text-cyan-400 transition-all hover:bg-cyan-500/10 hover:border-cyan-400 mb-8">
        RESEND EMAIL
      </button>

      <button onClick={() => onStateChange("LOGIN")} className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">Back to Login</button>
    </div>
  )
}

export function Reset3Step({ onStateChange }: { onStateChange: (state: AuthState) => void }) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl animate-in slide-in-from-right duration-500 text-center">
      <h2 className="font-sans text-2xl font-bold text-white uppercase tracking-wider mb-2">CREATE NEW PASSWORD</h2>
      <p className="font-sans text-xs text-primary/60 mb-8">Enter your new password</p>
      
      <div className="space-y-1.5 text-left mb-2">
        <label className="font-sans text-xs font-medium text-primary/80">New Password</label>
        <input type="password" value="••••••••••••••••" readOnly className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none" />
      </div>
      
      <div className="flex items-center justify-between text-[10px] mb-6 px-1">
        <span className="font-bold text-success">Strong</span>
        <div className="flex gap-1">
          {Array.from({ length: STRONG_PASSWORD_BARS }).map((_, idx) => (
            <div key={idx} className="h-1 w-8 rounded-full bg-success" />
          ))}
        </div>
      </div>

      <div className="space-y-1.5 text-left mb-8">
        <label className="font-sans text-xs font-medium text-primary/80">Confirm New Password</label>
        <input type="password" value="••••••••••••••••" readOnly className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none" />
      </div>

      <button onClick={() => onStateChange("LOGIN")} className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
        RESET PASSWORD
      </button>
    </div>
  )
}

export function VerificationStep({ onStateChange }: { onStateChange: (state: AuthState) => void }) {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(0,150,255,0.1)] backdrop-blur-xl animate-in slide-in-from-right duration-500 text-center">
      <h2 className="font-sans text-2xl font-bold text-white uppercase tracking-wider mb-2">VERIFY YOUR ACCOUNT</h2>
      <p className="font-sans text-xs text-primary/60 mb-8">Complete your profile to secure your account and personalize your experience</p>
      
      <div className="flex justify-center mb-8 relative">
        <div className="h-20 w-20 rounded-full border border-cyan-500/30 bg-black/60 flex items-center justify-center shadow-inner">
          <User className="h-10 w-10 text-primary/40" />
        </div>
        <div className="absolute bottom-0 right-1/2 translate-x-8 bg-slate-950 rounded-full p-1 border border-cyan-500/30">
          <div className="bg-cyan-500/20 rounded-full p-1 text-cyan-400">
             <Globe className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="space-y-4 text-left mb-8">
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">Full Name</label>
          <input type="text" value="Johnny Rocksoul" readOnly className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none" />
        </div>
        <div className="flex gap-4">
          <div className="space-y-1.5 flex-1">
            <label className="font-sans text-xs font-medium text-primary/80">Country</label>
            <select className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none appearance-none">
              <option>Indonesia</option>
            </select>
          </div>
          <div className="space-y-1.5 flex-1">
            <label className="font-sans text-xs font-medium text-primary/80">Timezone</label>
            <select className="w-full rounded-xl border border-cyan-500/20 bg-black/50 px-4 py-3 font-sans text-sm text-white placeholder:text-primary/30 focus:border-cyan-400 focus:bg-cyan-500/10 focus:outline-none appearance-none">
              <option>(UTC+7) Jakarta</option>
            </select>
          </div>
        </div>
      </div>

      <button onClick={() => onStateChange("2FA")} className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-400 py-3.5 font-sans text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
        SAVE & CONTINUE
      </button>
    </div>
  )
}
