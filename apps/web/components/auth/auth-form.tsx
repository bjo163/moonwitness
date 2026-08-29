"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react"
import { apiPost, useAuthSession } from "@moon/client"

type AuthMode = "login" | "register"

const inputClass =
  "mt-2 w-full rounded-md border border-cyber-cyan/25 bg-cyber-dark/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/40"

export function AuthForm() {
  const { login } = useAuthSession()
  const [mode, setMode] = useState<AuthMode>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState("")

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setMessage("")
    setSuccess("")
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setSuccess("")
    if (mode === "register" && password !== confirmation) {
      setMessage("Passwords do not match. Please review both fields.")
      return
    }

    setBusy(true)
    try {
      if (mode === "login") {
        await login({ email, password })
        window.location.assign("/home")
      } else {
        await apiPost("/api/auth/session/register", { email, password, name })
        setSuccess("Account created. You can now sign in.")
        setMode("login")
        setPassword("")
        setConfirmation("")
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The request could not be completed.")
    } finally {
      setBusy(false)
    }
  }

  const isLogin = mode === "login"
  return (
    <section aria-labelledby="auth-title" className="panel-glass clip-card w-full max-w-lg p-6 sm:p-8">
      <div className="mb-8 flex items-start gap-4">
        <div aria-hidden="true" className="clip-rune flex h-12 w-12 shrink-0 items-center justify-center bg-cyber-cyan/10 text-cyber-cyan">
          {isLogin ? <LockKeyhole className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
        </div>
        <div>
          <p className="font-mono text-xs tracking-widest text-cyber-cyan/70 uppercase">Secure access</p>
          <h1 id="auth-title" className="mt-1 font-orbitron text-2xl tracking-wide text-foreground uppercase">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {isLogin ? "Sign in to continue your MoonWitness mission." : "Join the global divine observatory network."}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 border-b border-cyber-cyan/20 pb-4" role="tablist" aria-label="Authentication mode">
        {(["login", "register"] as AuthMode[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mode === tab}
            onClick={() => changeMode(tab)}
            className={`clip-btn px-3 py-2 font-mono text-xs tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-cyan ${mode === tab ? "bg-cyber-cyan text-cyber-dark" : "text-cyber-cyan hover:bg-cyber-cyan/10"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form className="space-y-5" onSubmit={submit} noValidate>
        {message ? <div role="alert" className="clip-tag border border-cyber-pink/40 bg-cyber-pink/10 p-3 text-sm text-cyber-pink">{message}</div> : null}
        {success ? <div role="status" className="clip-tag border border-cyber-green/40 bg-cyber-green/10 p-3 text-sm text-cyber-green">{success}</div> : null}
        {!isLogin ? (
          <div>
            <label htmlFor="auth-name" className="text-sm font-medium text-foreground">Full name</label>
            <input id="auth-name" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} placeholder="Your name" />
          </div>
        ) : null}
        <div>
          <label htmlFor="auth-email" className="text-sm font-medium text-foreground">Email address</label>
          <div className="relative"><Mail aria-hidden="true" className="absolute top-5 left-3 h-4 w-4 text-cyber-cyan/60" /><input id="auth-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={`${inputClass} pl-10`} placeholder="you@example.com" /></div>
        </div>
        <div>
          <label htmlFor="auth-password" className="text-sm font-medium text-foreground">Password</label>
          <input id="auth-password" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} aria-describedby="password-hint" />
          {!isLogin ? <p id="password-hint" className="mt-2 text-xs text-muted-foreground">Use at least 8 characters.</p> : null}
        </div>
        {!isLogin ? (
          <div>
            <label htmlFor="auth-confirmation" className="text-sm font-medium text-foreground">Confirm password</label>
            <input id="auth-confirmation" name="confirmation" type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={inputClass} />
          </div>
        ) : null}
        <button type="submit" disabled={busy} className="clip-btn flex w-full items-center justify-center gap-2 bg-cyber-cyan px-4 py-3 font-mono text-sm font-bold tracking-widest text-cyber-dark uppercase transition-colors hover:bg-cyber-cyan/90 focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-2 focus:ring-offset-cyber-dark disabled:cursor-wait disabled:opacity-60">
          {busy ? "Processing..." : isLogin ? "Sign in" : "Create account"}<ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-muted-foreground">Need help? <Link href="/home" className="text-cyber-cyan underline-offset-4 hover:underline">Return to observatory</Link></p>
    </section>
  )
}
