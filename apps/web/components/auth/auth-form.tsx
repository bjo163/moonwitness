"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react"
import { apiPost, useAuthSession } from "@moon/client"
import { StatusNotice } from "@workspace/ui"

type AuthMode = "login" | "register"

const inputClass =
  "mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"

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
    <section aria-labelledby="auth-title" className="rounded-md border border-border bg-card w-full max-w-lg p-6 sm:p-8">
      <div className="mb-8 flex items-start gap-4">
        <div aria-hidden="true" className="rounded-md flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10 text-primary border border-primary/20">
          {isLogin ? <LockKeyhole className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
        </div>
        <div>
          <p className="font-mono text-xs text-muted-foreground">Secure access</p>
          <h1 id="auth-title" className="mt-1 text-2xl font-bold font-sans tracking-tight text-foreground">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {isLogin ? "Sign in to continue your MoonWitness session." : "Join the global divine observatory network."}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2 border-b border-border pb-4" role="tablist" aria-label="Authentication mode">
        {(["login", "register"] as AuthMode[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={mode === tab}
            onClick={() => changeMode(tab)}
            className={`rounded-md px-3 py-2 text-xs font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
              mode === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form className="space-y-5" onSubmit={submit} noValidate>
        {message ? <StatusNotice variant="destructive" message={message} /> : null}
        {success ? <StatusNotice variant="success" message={success} /> : null}
        {!isLogin ? (
          <div>
            <label htmlFor="auth-name" className="text-sm font-medium text-foreground">Full name</label>
            <input id="auth-name" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} placeholder="Your name" />
          </div>
        ) : null}
        <div>
          <label htmlFor="auth-email" className="text-sm font-medium text-foreground">Email address</label>
          <div className="relative"><Mail aria-hidden="true" className="absolute top-5 left-3 h-4 w-4 text-muted-foreground" /><input id="auth-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={`${inputClass} pl-10`} placeholder="you@example.com" /></div>
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
        <button type="submit" disabled={busy} className="rounded-md flex w-full items-center justify-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-wait disabled:opacity-60">
          {busy ? "Processing..." : isLogin ? "Sign in" : "Create account"}<ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-muted-foreground">Need help? <Link href="/home" className="text-primary underline-offset-4 hover:underline">Return to observatory</Link></p>
    </section>
  )
}
