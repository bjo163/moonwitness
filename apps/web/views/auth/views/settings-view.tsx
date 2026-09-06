"use client"

import { FormEvent, useState } from "react"
import { useLocalStorage } from "@workspace/hooks"
import { Button, Input } from "@workspace/ui"
import { AccountPage } from "./account-view"

export function SettingsView() {
  const [name, setName] = useLocalStorage("mw_display_name", "")
  const [saved, setSaved] = useState(false)
  const save = (event: FormEvent) => { event.preventDefault(); setName(name.trim()); setSaved(true) }
  return (
    <AccountPage title="Settings" active="Settings">
      <form onSubmit={save} className="max-w-xl space-y-5">
        <div>
          <label htmlFor="display-name" className="text-sm font-medium">Display name</label>
          <Input
            id="display-name"
            value={name}
            onChange={(event) => { setName(event.target.value); setSaved(false) }}
            className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring"
            aria-describedby="display-name-help"
          />
          <p id="display-name-help" className="mt-2 text-xs text-muted-foreground">Used for local observatory personalization.</p>
        </div>
        <Button
          type="submit"
          className="rounded-md bg-primary px-4 py-3 text-xs font-bold tracking-widest text-primary-foreground uppercase hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Save settings
        </Button>
        {saved ? <p role="status" className="text-sm text-success font-medium">Settings saved on this device.</p> : null}
      </form>
    </AccountPage>
  )
}
