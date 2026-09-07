"use client"

import { Fingerprint, ShieldCheck, Terminal, User } from "lucide-react"
import { Button } from "../../components/button"

export function AuthTerminalHeader({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-md border border-border">
        <Fingerprint className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">MoonWitness OS</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {mode === "login" ? "Sign in to your account" : "Create your account"}
      </p>
    </div>
  )
}

const portals = [
  { path: "/command-center/dashboard", title: "Command Center", subtitle: "Administrative workspace", icon: ShieldCheck, tone: "fuchsia" },
  { path: "/console", title: "Developer Console", subtitle: "System diagnostics and AI", icon: Terminal, tone: "success" },
  { path: "/home", title: "Public Observatory", subtitle: "Research and discovery", icon: User, tone: "primary" },
] as const

export function AuthPortalSelection({ onSelect }: { onSelect: (path: string) => void }) {
  return (
    <>
      <div className="flex items-center justify-center gap-2 rounded-md border border-success/40 bg-success/10 p-3 text-sm font-medium text-success"><span>✓</span> Sign-in successful. Choose where to continue.</div>
      <div className="grid grid-cols-1 gap-4">
        {portals.map(({ path, title, subtitle, icon: Icon, tone }) => {
          const isFuchsia = tone === "fuchsia"
          const isSuccess = tone === "success"
          return <Button key={path} variant="ghost" type="button" onClick={() => onSelect(path)} className={`group relative flex items-center justify-between rounded-md border p-4 transition-colors ${isFuchsia ? "border-fuchsia-500/40 bg-fuchsia-500/10 hover:bg-fuchsia-500/20" : isSuccess ? "border-emerald-500/40 bg-success/10 hover:bg-success/20" : "border-border bg-primary/10 hover:bg-primary/20"}`}><div className="flex items-center gap-4"><Icon className={`h-6 w-6 ${isFuchsia ? "text-fuchsia-400" : isSuccess ? "text-success" : "text-primary"}`} /><div className="text-left"><h3 className={`text-sm font-semibold ${isFuchsia ? "text-fuchsia-400" : isSuccess ? "text-success" : "text-primary"}`}>{title}</h3><p className="text-xs text-muted-foreground">{subtitle}</p></div></div><span className="text-xs text-muted-foreground group-hover:text-foreground">Open →</span></Button>
        })}
      </div>
    </>
  )
}
