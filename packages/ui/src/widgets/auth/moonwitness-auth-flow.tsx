"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthSession, apiPost } from "@moon/client"
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
  const { login } = useAuthSession()
  const [currentState, setCurrentState] = useState<AuthState>("WELCOME")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotCode, setForgotCode] = useState("")

  const handleWorkspaceSelect = (path: string) => {
    setCurrentState("SUCCESS")
    setTimeout(() => router.push(path), WORKSPACE_REDIRECT_DELAY_MS)
  }

  const renderLogin = () => (
    <div className="w-full max-w-[420px] animate-in rounded-2xl border border-border bg-background/80 p-8 shadow-sm backdrop-blur-xl duration-500 slide-in-from-bottom-4">
      <div className="mb-8 text-center">
        <h2 className="font-sans text-2xl font-bold text-foreground">
          WELCOME BACK
        </h2>
        <p className="mt-1 font-sans text-xs text-muted-foreground">
          Sign in to continue to your workspace
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          setErrorMsg("")
          try {
            await login({ email, password })
            setTimeout(
              () => setCurrentState("WORKSPACE"),
              LOGIN_SUCCESS_DELAY_MS
            )
          } catch (err: unknown) {
            setErrorMsg(
              (err as { message?: string }).message || "Authentication failed."
            )
            setLoading(false)
          }
        }}
      >
        {errorMsg ? (
          <div className="border-danger/30 bg-danger/10 text-danger rounded-lg border p-3 text-center text-xs font-semibold">
            {errorMsg}
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">
            Email or Username
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 font-sans text-sm text-foreground placeholder:text-primary/30 focus:border-border focus:bg-primary/10 focus:outline-none"
            placeholder="johnny@moonwitness.org"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 font-sans text-sm text-foreground placeholder:text-primary/30 focus:border-border focus:bg-primary/10 focus:outline-none"
            placeholder="••••••••••••••••"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="flex cursor-pointer items-center gap-2 text-primary/70 hover:text-foreground">
            <input
              type="checkbox"
              className="rounded border-border bg-card text-primary focus:ring-0 focus:ring-offset-0"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => setCurrentState("FORGOT_1")}
            className="text-primary hover:text-primary"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary/10 to-transparent py-3.5 font-sans text-sm font-bold text-foreground transition-all hover:opacity-90 hover:shadow-sm disabled:opacity-50"
        >
          {loading ? "AUTHENTICATING..." : "LOGIN"}
        </button>
      </form>

      <div className="mt-8 text-center font-sans text-xs text-primary/60">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => setCurrentState("REGISTER")}
          className="font-semibold text-primary hover:text-primary"
        >
          Create one
        </button>
      </div>
    </div>
  )

  const renderRegister = () => (
    <div className="w-full max-w-[480px] animate-in rounded-2xl border border-border bg-background/80 p-8 shadow-sm backdrop-blur-xl duration-500 slide-in-from-bottom-4">
      <div className="mb-8 text-center">
        <h2 className="font-sans text-2xl font-bold tracking-wider text-foreground uppercase">
          CREATE YOUR ACCOUNT
        </h2>
        <p className="mt-1 font-sans text-xs text-muted-foreground">
          Join MoonWitness OS and access the unified knowledge platform
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          setErrorMsg("")
          try {
            await apiPost("/api/auth/register", {
              email,
              password,
              name: registerName,
            })
            setCurrentState("VERIFICATION")
          } catch (err: any) {
            setErrorMsg(err.message || "Registration failed")
          } finally {
            setLoading(false)
          }
        }}
      >
        {errorMsg ? (
          <div className="border-danger/30 bg-danger/10 text-danger mb-4 rounded-lg border p-3 text-center text-xs font-semibold">
            {errorMsg}
          </div>
        ) : null}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">
            Full Name
          </label>
          <input
            type="text"
            required
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 font-sans text-sm text-foreground placeholder:text-primary/30 focus:border-border focus:bg-primary/10 focus:outline-none"
            placeholder="Johnny Rocksoul"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 font-sans text-sm text-foreground placeholder:text-primary/30 focus:border-border focus:bg-primary/10 focus:outline-none"
            placeholder="johnny@moonwitness.org"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 font-sans text-sm text-foreground placeholder:text-primary/30 focus:border-border focus:bg-primary/10 focus:outline-none"
            placeholder="••••••••••••••••"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium text-primary/80">
            Confirm Password
          </label>
          <input
            type="password"
            required
            className="w-full rounded-xl border border-border bg-card px-4 py-3 font-sans text-sm text-foreground placeholder:text-primary/30 focus:border-border focus:bg-primary/10 focus:outline-none"
            placeholder="••••••••••••••••"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 text-[10px] text-primary/60">
          <input
            type="checkbox"
            required
            className="rounded border-border bg-card text-primary focus:ring-0 focus:ring-offset-0"
          />
          <span>
            I agree to the{" "}
            <span className="cursor-pointer text-primary hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="cursor-pointer text-primary hover:underline">
              Privacy Policy
            </span>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary/10 to-transparent py-3.5 font-sans text-sm font-bold text-foreground transition-all hover:opacity-90 hover:shadow-sm disabled:opacity-50"
        >
          {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
        </button>
      </form>

      <div className="mt-6 text-center font-sans text-xs text-primary/60">
        Already have an account?{" "}
        <button
          onClick={() => setCurrentState("LOGIN")}
          className="font-semibold text-primary hover:text-primary"
        >
          Login
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center">
      {currentState === "WELCOME" ? (
        <WelcomeStep onStateChange={setCurrentState} />
      ) : null}
      {currentState === "LOGIN" ? renderLogin() : null}
      {currentState === "REGISTER" ? renderRegister() : null}
      {currentState === "2FA" ? (
        <TwoFactorStep onStateChange={setCurrentState} />
      ) : null}
      {currentState === "WORKSPACE" ? (
        <WorkspaceStep onSelectWorkspace={handleWorkspaceSelect} />
      ) : null}
      {currentState === "FORGOT_1" ? (
        <Forgot1Step
          onStateChange={setCurrentState}
          onSuccess={(email) => setForgotEmail(email)}
        />
      ) : null}
      {currentState === "FORGOT_2" ? (
        <Forgot2Step
          email={forgotEmail}
          onStateChange={setCurrentState}
          onSuccess={(code) => setForgotCode(code)}
        />
      ) : null}
      {currentState === "RESET_3" ? (
        <Reset3Step
          email={forgotEmail}
          code={forgotCode}
          onStateChange={setCurrentState}
        />
      ) : null}
      {currentState === "VERIFICATION" ? (
        <VerificationStep onStateChange={setCurrentState} />
      ) : null}
      {currentState === "SUCCESS" ? <SuccessStep email={email} /> : null}
    </div>
  )
}
