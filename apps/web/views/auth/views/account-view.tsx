"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { KeyRound, ShieldCheck } from "lucide-react"
import { useAuthSession } from "@moon/client"
import { AccountNavigation } from "../../../components/profile/account-navigation"

export function AccountView() {
  const { user, clearance } = useAuthSession()
  return (
    <AccountPage title="Account Security" active="Account">
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard icon={<ShieldCheck aria-hidden="true" className="h-4 w-4" />} title="Access Level" value={clearance ? `${clearance.tier} · Level ${clearance.level}` : "Session pending"} />
        <InfoCard icon={<KeyRound aria-hidden="true" className="h-4 w-4" />} title="Session Status" value={user ? "Verified by server" : "Sign in required"} />
      </div>
      <div className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
        <p>Security actions are managed through the server-owned session.</p>
        <Link href="/auth/profile" className="mt-3 inline-block text-primary underline-offset-4 hover:underline">Review profile →</Link>
      </div>
    </AccountPage>
  )
}

function InfoCard({ icon, title, value }: { icon: ReactNode; title: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs tracking-widest uppercase font-mono font-medium">{title}</span>
      </div>
      <p className="mt-4 text-lg font-semibold text-foreground">{value}</p>
    </div>
  )
}

export function AccountPage({ title, active, children }: { title: string; active: string; children: ReactNode }) {
  return (
    <div className="theme-grid-bg min-h-screen px-4 py-8 font-sans text-foreground sm:px-6">
      <main className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-xs tracking-widest text-primary/70 uppercase font-mono font-semibold">User Account</p>
          <h1 className="mt-2 text-3xl font-bold uppercase">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Manage your identity, preferences, and observatory notifications.</p>
        </header>
        <AccountNavigation active={active} />
        <section className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">{children}</section>
      </main>
    </div>
  )
}
