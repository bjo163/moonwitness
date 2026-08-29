"use client"

import { useState } from "react"
import { useLocalStorage } from "@workspace/hooks"
import { AccountPage } from "./account-view"

export function PreferencesView() {
  const [reducedMotion, setReducedMotion] = useLocalStorage("mw_reduced_motion", false)
  const [compactMode, setCompactMode] = useLocalStorage("mw_compact_mode", false)
  const toggle = (value: boolean, setValue: (next: boolean) => void) => setValue(!value)
  return <AccountPage title="Preferences" active="Preferences"><fieldset className="max-w-xl space-y-4"><legend className="mb-4 text-sm text-muted-foreground">Choose how the observatory behaves on this device.</legend><PreferenceToggle id="reduced-motion" label="Reduce motion" checked={reducedMotion} onChange={() => toggle(reducedMotion, setReducedMotion)} /><PreferenceToggle id="compact-mode" label="Compact data density" checked={compactMode} onChange={() => toggle(compactMode, setCompactMode)} /></fieldset></AccountPage>
}

function PreferenceToggle({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) { return <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-cyber-cyan/20 bg-cyber-dark/60 p-4 text-sm"><span>{label}</span><input id={id} type="checkbox" checked={checked} onChange={onChange} className="h-5 w-5 accent-cyan-400 focus:ring-2 focus:ring-cyber-cyan" /></label> }
