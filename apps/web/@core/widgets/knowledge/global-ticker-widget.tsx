"use client"

import React, { useEffect, useState } from "react"
import { useMoonStore } from "@core/store/moon-store"
import { Globe2, Quote } from "lucide-react"
import { internalApi } from "@core/api/internal-api"

export function GlobalTickerWidget() {
  const [messages, setMessages] = useState<any[]>([])
  
  useEffect(() => {
    // Initial fetch of recent comments
    internalApi<any>("/api/comments?all=true")
      .then(data => {
        if (data.comments) {
          // Get the last 10 comments
          setMessages(data.comments.slice(0, 10))
        }
      })
      .catch(console.error)

    const unsubscribe = useMoonStore.getState().subscribe('fx.msg', (msgData: any) => {
      try {
        const meta = JSON.parse(msgData.body)
        const newComment = {
          id: msgData.id,
          user_name: meta.user_name || "Anonymous",
          user_avatar: meta.user_avatar || "🌙",
          comment_text: meta.comment_text || msgData.body,
        }
        setMessages(prev => [newComment, ...prev].slice(0, 10))
      } catch (e) {
        // Fallback
        setMessages(prev => [{
          id: msgData.id,
          user_name: "System",
          user_avatar: "⚡",
          comment_text: "New global event registered.",
        }, ...prev].slice(0, 10))
      }
    })

    return () => unsubscribe()
  }, [])

  if (messages.length === 0) return null

  return (
    <div className="w-full bg-space/95 border-b border-cyan-500/30 shadow-[0_4px_20px_rgba(0,240,255,0.1)] overflow-hidden">
      <div className="flex h-10 items-center">
        <div className="z-10 flex h-full shrink-0 items-center gap-2 bg-cyan-950 px-4 border-r border-cyan-500/50 shadow-[4px_0_15px_rgba(0,240,255,0.2)] relative">
          <Globe2 className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="font-sans text-[10px] font-black tracking-widest text-cyan-400 uppercase hidden md:inline-block">
            Global Reflections
          </span>
          {/* Gradient fade edge */}
          <div className="absolute right-[-20px] top-0 bottom-0 w-5 bg-gradient-to-r from-cyan-950 to-transparent pointer-events-none" />
        </div>
        
        <div className="relative flex-1 overflow-hidden h-full group">
          <div className="absolute flex whitespace-nowrap h-full items-center animate-[ticker_30s_linear_infinite] group-hover:[animation-play-state:paused]">
            {/* Duplicate list for seamless loop */}
            {[...messages, ...messages].map((m, idx) => (
              <div key={`${m.id}-${idx}`} className="flex items-center gap-2 mx-8 text-xs font-mono">
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Quote className="h-3 w-3 inline" />
                  {m.user_avatar} {m.user_name}:
                </span>
                <span className="text-white/80 italic">"{m.comment_text}"</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  )
}
