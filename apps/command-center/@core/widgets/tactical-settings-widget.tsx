"use client"
import { useMounted } from "@core/hooks"

import React, { useState, useEffect } from "react"
import { Settings, Shield, Bell, MapPin, Power, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function TacticalSettingsWidget() {
  const [stealth, setStealth] = useState(true)
  const [notifs, setNotifs] = useState(false)
  const [spoofLoc, setSpoofLoc] = useState(false)
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  return (
    <div className="bg-space/60 rounded-2xl border border-blue-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-blue-400 uppercase">
          System Override
        </h3>
        <Settings className="h-4 w-4 text-primary/50" />
      </div>

      <div className="space-y-3">
        {/* Stealth Mode */}
        <div className="flex items-center justify-between rounded-lg bg-black/20 p-2 transition-colors hover:bg-black/40">
          <div className="flex items-center gap-3">
            <Shield
              className={`h-4 w-4 ${stealth ? "text-blue-400" : "text-primary/50"}`}
            />
            <div>
              <div className="font-sans text-xs font-bold text-white">
                Stealth UI
              </div>
              <div className="font-mono text-[9px] text-primary/60">
                Reduce ambient glow
              </div>
            </div>
          </div>
          <button
            onClick={() => setStealth(!stealth)}
            className={`relative h-4 w-8 rounded-full transition-colors ${stealth ? "bg-blue-500" : "bg-slate-700"}`}
          >
            <div
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${stealth ? "left-4.5" : "left-0.5"}`}
            ></div>
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between rounded-lg bg-black/20 p-2 transition-colors hover:bg-black/40">
          <div className="flex items-center gap-3">
            <Bell
              className={`h-4 w-4 ${notifs ? "text-emerald-400" : "text-primary/50"}`}
            />
            <div>
              <div className="font-sans text-xs font-bold text-white">
                Alert Signals
              </div>
              <div className="font-mono text-[9px] text-primary/60">
                Push Adhan/Events
              </div>
            </div>
          </div>
          <button
            onClick={() => setNotifs(!notifs)}
            className={`relative h-4 w-8 rounded-full transition-colors ${notifs ? "bg-emerald-500" : "bg-slate-700"}`}
          >
            <div
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${notifs ? "left-4.5" : "left-0.5"}`}
            ></div>
          </button>
        </div>

        {/* Location Spoof */}
        <div className="flex items-center justify-between rounded-lg bg-black/20 p-2 transition-colors hover:bg-black/40">
          <div className="flex items-center gap-3">
            <MapPin
              className={`h-4 w-4 ${spoofLoc ? "text-amber-400" : "text-primary/50"}`}
            />
            <div>
              <div className="font-sans text-xs font-bold text-white">
                Spoof Location
              </div>
              <div className="font-mono text-[9px] text-primary/60">
                Override GPS to Mecca
              </div>
            </div>
          </div>
          <button
            onClick={() => setSpoofLoc(!spoofLoc)}
            className={`relative h-4 w-8 rounded-full transition-colors ${spoofLoc ? "bg-amber-500" : "bg-slate-700"}`}
          >
            <div
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${spoofLoc ? "left-4.5" : "left-0.5"}`}
            ></div>
          </button>
        </div>

        {/* Theme Switcher */}
        {mounted && (
          <div className="flex items-center justify-between rounded-lg bg-black/20 p-2 transition-colors hover:bg-black/40">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-4 w-4 text-cyan-400" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400" />
              )}
              <div>
                <div className="font-sans text-xs font-bold text-white">
                  Visual Mode
                </div>
                <div className="font-mono text-[9px] text-primary/60">
                  Toggle Night/Day optics
                </div>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`relative h-4 w-8 rounded-full transition-colors ${theme === "dark" ? "bg-cyan-500" : "bg-amber-500"}`}
            >
              <div
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${theme === "dark" ? "left-4.5" : "left-0.5"}`}
              ></div>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-blue-500/20 pt-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-[10px] font-bold tracking-widest text-red-400 uppercase transition-colors hover:bg-red-500/20">
          <Power className="h-3 w-3" /> Execute Purge
        </button>
      </div>
    </div>
  )
}
