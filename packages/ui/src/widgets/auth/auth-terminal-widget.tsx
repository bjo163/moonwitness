"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, User, Terminal, Lock } from "lucide-react"
import { apiClient, useUserProfile } from "@moon/client"
import { Button } from "../../components/button"
import { Input } from "../../components/input"
import { AuthPortalSelection, AuthTerminalHeader } from "./auth-terminal-presentation"

type AuthMode = "login" | "register"
type AuthRole = "public" | "admin" | "console"
type FormState = { mode: AuthMode; email: string; name: string; password: string; role: AuthRole; loading: boolean; errorMsg: string; successMsg: string }

function AuthTerminalForm({ state, onModeChange, onEmailChange, onNameChange, onPasswordChange, onRoleChange, onSubmit }: { state: FormState; onModeChange: (mode: AuthMode) => void; onEmailChange: (value: string) => void; onNameChange: (value: string) => void; onPasswordChange: (value: string) => void; onRoleChange: (role: AuthRole) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <>
    <div className="mb-6 grid grid-cols-2 gap-4 text-sm font-semibold"><Button variant="ghost" type="button" onClick={() => onModeChange("login")} className={state.mode === "login" ? "border border-border text-primary" : "border border-border text-muted-foreground"}><Lock className="h-3.5 w-3.5" /> Sign in</Button><Button variant="ghost" type="button" onClick={() => onModeChange("register")} className={state.mode === "register" ? "border border-border text-primary" : "border border-border text-muted-foreground"}><User className="h-3.5 w-3.5" /> Create account</Button></div>
    <form onSubmit={onSubmit} className="space-y-5">
      {state.errorMsg && <div className="flex items-center gap-3 border border-danger/40 bg-danger/10 p-4 text-sm text-danger">{state.errorMsg}</div>}
      {state.successMsg && <div className="flex items-center gap-3 border border-success/40 bg-success/10 p-4 text-sm text-success">{state.successMsg}</div>}
      <label className="block space-y-1.5 text-sm font-medium text-muted-foreground">Email address<Input type="email" placeholder="you@example.org" value={state.email} onChange={(event) => onEmailChange(event.target.value)} required className="w-full border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-primary/10 focus:outline-none" /></label>
      {state.mode === "register" && <><label className="block space-y-1.5 text-sm font-medium text-muted-foreground">Display name<Input type="text" placeholder="Your name" value={state.name} onChange={(event) => onNameChange(event.target.value)} required className="w-full border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-primary/10 focus:outline-none" /></label><fieldset className="space-y-1.5"><legend className="text-sm font-medium text-muted-foreground">Account role</legend><div className="grid grid-cols-3 gap-2">{([{ value: "public", label: "Public", icon: User }, { value: "admin", label: "Admin / Command Center", icon: ShieldCheck }, { value: "console", label: "Console", icon: Terminal }] as const).map(({ value, label, icon: Icon }) => <Button key={value} variant="ghost" type="button" onClick={() => onRoleChange(value)} className={`flex flex-col items-center justify-center gap-2 border p-3 ${state.role === value ? "border-primary text-primary" : "border-border text-muted-foreground"}`}><Icon className="h-4 w-4" /><span className="text-xs">{label}</span></Button>)}</div></fieldset></>}
      <label className="block space-y-1.5 text-sm font-medium text-muted-foreground">Password<Input type="password" placeholder="••••••••••••••••" value={state.password} onChange={(event) => onPasswordChange(event.target.value)} required className="w-full border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-primary/10 focus:outline-none" /></label>
      <Button type="submit" disabled={state.loading} className="mt-6 flex w-full items-center justify-center py-3.5">{state.loading ? "Signing in…" : state.mode === "login" ? "Sign in" : "Create account"}</Button>
    </form>
  </>
}

const REDIRECT_DELAY_MS = 800

export function AuthTerminalWidget() {
  const router = useRouter(); const { saveProfile } = useUserProfile(); const [mode, setMode] = useState<AuthMode>("login"); const [email, setEmail] = useState(""); const [name, setName] = useState(""); const [password, setPassword] = useState(""); const [role, setRole] = useState<AuthRole>("public"); const [loading, setLoading] = useState(false); const [errorMsg, setErrorMsg] = useState(""); const [successMsg, setSuccessMsg] = useState(""); const [adminPortalSelection, setAdminPortalSelection] = useState(false)
  const handleModeChange = (nextMode: AuthMode) => { setMode(nextMode); setErrorMsg(""); setSuccessMsg("") }
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setLoading(true); setErrorMsg(""); setSuccessMsg(""); try { const { data } = await apiClient.post("/api/users/profile", { action: mode, email, name: mode === "register" ? name : undefined, password, role: mode === "register" ? role : undefined, avatar_url: mode === "register" ? "🌙" : undefined }); if (data.error) throw new Error(data.error); setSuccessMsg(data.message || "Signed in successfully."); if (data.profile) saveProfile(data.profile); setTimeout(() => { const userRole = data.profile?.role || "public"; if (userRole === "admin") { setAdminPortalSelection(true); setLoading(false) } else if (userRole === "console") router.push("/console"); else router.push("/home") }, REDIRECT_DELAY_MS) } catch (error) { setErrorMsg((error as { message?: string }).message || "Unable to complete authentication."); setLoading(false) } }
  const state = { mode, email, name, password, role, loading, errorMsg, successMsg }
  return <div className="w-full max-w-[480px] p-6 text-left"><AuthTerminalHeader mode={mode} /><div className="mb-8 w-full border-b border-border" />{adminPortalSelection ? <AuthPortalSelection onSelect={(path) => router.push(path)} /> : <AuthTerminalForm state={state} onModeChange={handleModeChange} onEmailChange={setEmail} onNameChange={setName} onPasswordChange={setPassword} onRoleChange={setRole} onSubmit={handleSubmit} />}</div>
}
