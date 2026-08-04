"use client"

import React, { useEffect, useState } from "react"
import { useGuildStore } from "@core/store/guild-store"
import { Users, Crown, ShieldAlert } from "lucide-react"

export function GuildLeaderboardWidget() {
  const [mounted, setMounted] = useState(false)
  const { guilds, currentGuildId, joinGuild, leaveGuild } = useGuildStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const sortedGuilds = [...guilds].sort((a, b) => b.xp - a.xp)

  return (
    <div className="bg-space/60 rounded-2xl border border-fuchsia-500/20 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-xs font-bold tracking-wider text-fuchsia-400 uppercase">
          Global Guild Rankings
        </h3>
        <Crown className="h-4 w-4 text-fuchsia-400/50" />
      </div>

      <div className="space-y-3">
        {sortedGuilds.map((g, index) => {
          const isMember = g.id === currentGuildId
          return (
            <div 
              key={g.id} 
              className={`relative overflow-hidden rounded-xl border p-3 flex items-center justify-between transition-all ${
                isMember 
                  ? "border-fuchsia-500/50 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.15)]" 
                  : "border-transparent bg-black/40 hover:bg-black/60"
              }`}
            >
              {isMember && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)]" />
              )}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-fuchsia-400/50">
                  #{index + 1}
                </span>
                <span className="text-lg">{g.icon}</span>
                <div>
                  <div className={`font-sans text-xs font-bold uppercase tracking-wider ${isMember ? "text-fuchsia-300" : "text-white"}`}>
                    {g.name}
                  </div>
                  <div className="font-mono text-[9px] text-fuchsia-400/60 flex items-center gap-1">
                    <Users className="h-3 w-3" /> {g.members} OPERATIVES
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-[10px] font-black tabular-nums tracking-widest text-fuchsia-400">
                  {g.xp.toLocaleString()} XP
                </span>
                {isMember ? (
                  <button 
                    onClick={leaveGuild}
                    className="text-[8px] font-bold text-slate-500 hover:text-white uppercase tracking-widest"
                  >
                    [ LEAVE ]
                  </button>
                ) : (
                  <button 
                    onClick={() => joinGuild(g.id)}
                    className="text-[8px] font-bold text-fuchsia-400 hover:text-fuchsia-300 uppercase tracking-widest"
                  >
                    [ JOIN ]
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {!currentGuildId && (
        <div className="mt-4 flex items-center gap-2 rounded bg-destructive/10 p-2 border border-destructive/20 text-[9px] font-mono text-destructive">
          <ShieldAlert className="h-3 w-3" />
          YOU ARE UNAFFILIATED. JOIN A GUILD TO CONTRIBUTE XP.
        </div>
      )}
    </div>
  )
}
