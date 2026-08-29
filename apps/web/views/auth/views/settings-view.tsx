"use client"

import { FormEvent, useState } from "react"
import { useLocalStorage } from "@workspace/hooks"
import { AccountPage } from "./account-view"

export function SettingsView() {
  const [name, setName] = useLocalStorage("mw_display_name", "")
  const [saved, setSaved] = useState(false)
  const save = (event: FormEvent) => { event.preventDefault(); setName(name.trim()); setSaved(true) }
  return <AccountPage title="Settings" active="Settings"><form onSubmit={save} className="max-w-xl space-y-5"><div><label htmlFor="display-name" className="text-sm font-medium">Display name</label><input id="display-name" value={name} onChange={(event) => { setName(event.target.value); setSaved(false) }} className="mt-2 w-full rounded-md border border-cyber-cyan/25 bg-cyber-dark/80 px-4 py-3 text-sm focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/40" aria-describedby="display-name-help" /><p id="display-name-help" className="mt-2 text-xs text-muted-foreground">Used for local observatory personalization.</p></div><button type="submit" className="clip-btn bg-cyber-cyan px-4 py-3 text-xs font-bold tracking-widest text-cyber-dark uppercase focus:outline-none focus:ring-2 focus:ring-cyber-cyan">Save settings</button>{saved ? <p role="status" className="text-sm text-cyber-green">Settings saved on this device.</p> : null}</form></AccountPage>
}
