"use client"

import { useState } from "react"
import { useLocalStorage } from "@workspace/hooks"
import { Checkbox } from "@workspace/ui"
import { AccountPage } from "./account-view"

export function PreferencesView() {
  const [reducedMotion, setReducedMotion] = useLocalStorage("mw_reduced_motion", false)
  const [compactMode, setCompactMode] = useLocalStorage("mw_compact_mode", false)
  const toggle = (value: boolean, setValue: (next: boolean) => void) => setValue(!value)
  return <AccountPage title="Preferences" active="Preferences"><fieldset className="max-w-xl space-y-4"><legend className="mb-4 text-sm text-muted-foreground">Choose how the observatory behaves on this device.</legend><PreferenceToggle id="reduced-motion" label="Reduce motion" checked={reducedMotion} onChange={() => toggle(reducedMotion, setReducedMotion)} /><PreferenceToggle id="compact-mode" label="Compact data density" checked={compactMode} onChange={() => toggle(compactMode, setCompactMode)} /></fieldset></AccountPage>
}

function PreferenceToggle({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-border bg-card p-4 text-sm hover:border-primary/40 transition-colors">
      <span>{label}</span>
      <Checkbox id={id} checked={checked} onCheckedChange={() => onChange()} aria-label={label} />
    </label>
  )
}
