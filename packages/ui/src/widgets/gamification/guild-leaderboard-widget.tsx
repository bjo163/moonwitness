"use client"
import { useMounted } from "@workspace/hooks"

import React from "react"
import { useGuildStore } from "@workspace/state"
import { Users, Crown, ShieldAlert } from "lucide-react"

export function GuildLeaderboardWidget() {
  const mounted = useMounted()
  const { guilds, currentGuildId, joinGuild, leaveGuild } = useGuildStore()

  if (!mounted) return null

  const sortedGuilds = [...guilds].sort((a, b) => b.xp - a.xp)

  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-sm font-semibold text-foreground">
          Global guild rankings
        </h3>
        <Crown className="h-4 w-4 text-fuchsia-400/50" />
      </div>

      <div className="space-y-3">
        {sortedGuilds.map((g, index) => {
          const isMember = g.id === currentGuildId
          return (
            <div
              key={g.id}
              className={`relative flex items-center justify-between overflow-hidden rounded-xl border p-3 transition-all ${
                isMember
                ? "border-primary/40 bg-primary/10"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {isMember && (
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-fuchsia-500 shadow-sm" />
              )}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-fuchsia-400/50">
                  #{index + 1}
                </span>
                <span className="text-lg">{g.icon}</span>
                <div>
                  <div className={`font-sans text-sm font-medium ${isMember ? "text-primary" : "text-foreground"}`}>
                    {g.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" /> {g.members} OPERATIVES
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-xs font-semibold text-primary tabular-nums">
                  {g.xp.toLocaleString()} XP
                </span>
                {isMember ? (
                  <button
                    onClick={leaveGuild}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    [ LEAVE ]
                  </button>
                ) : (
                  <button
                    onClick={() => joinGuild(g.id)}
                    className="text-xs font-medium text-primary hover:text-primary/80"
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
        <div className="mt-4 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          <ShieldAlert className="h-3 w-3" />
          You are not affiliated with a guild. Join one to contribute XP.
        </div>
      )}
    </div>
  )
}
