"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { KeyRound, ShieldCheck } from "lucide-react"
import { useAuthSession } from "@moon/client"
import { AccountNavigation } from "../../../components/profile/account-navigation"

export function AccountView() {
  const { user, clearance } = useAuthSession()
  return <AccountPage title="Account security" active="Account">
    <div className="grid gap-4 sm:grid-cols-2">
      <InfoCard icon={<ShieldCheck aria-hidden="true" />} title="Clearance" value={clearance ? `${clearance.tier} · Level ${clearance.level}` : "Session pending"} />
      <InfoCard icon={<KeyRound aria-hidden="true" />} title="Session" value={user ? "Verified by server" : "Sign in required"} />
    </div>
    <div className="mt-6 border-t border-cyber-cyan/20 pt-5 text-sm text-muted-foreground">
      <p>Security actions are managed through the server-owned session.</p>
      <Link href="/auth/profile" className="mt-3 inline-block text-cyber-cyan underline-offset-4 hover:underline">Review identity →</Link>
    </div>
  </AccountPage>
}

function InfoCard({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  return <div className="clip-card border border-cyber-cyan/20 bg-cyber-dark/60 p-5"><div className="flex items-center gap-2 text-cyber-cyan">{icon}<span className="text-xs tracking-widest uppercase">{title}</span></div><p className="mt-4 text-lg text-foreground">{value}</p></div>
}

export function AccountPage({ title, active, children }: { title: string; active: string; children: ReactNode }) {
  return <div className="theme-grid-bg min-h-screen px-4 py-8 font-mono text-foreground sm:px-6"><main className="mx-auto max-w-5xl space-y-6"><header><p className="text-xs tracking-widest text-cyber-cyan/70 uppercase">Operator account</p><h1 className="mt-2 font-orbitron text-3xl uppercase">{title}</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Manage your identity, preferences, and observatory notifications.</p></header><AccountNavigation active={active} /><section className="panel-glass clip-card p-6 sm:p-8">{children}</section></main></div>
}
