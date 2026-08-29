"use client"

import React, { useEffect, useState } from "react"
import { Globe2, Quote } from "lucide-react"
import { apiGet, moonClientInstance } from "@moon/client"

export function GlobalTickerWidget() {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    // Initial fetch of recent comments
    apiGet<any>("/api/comments?all=true")
      .then((data) => {
        if (data?.comments) {
          setMessages(data.comments.slice(0, 10))
        }
      })
      .catch(() => {})

    const unsubscribe = moonClientInstance.subscribe("fx.msg", (msgData: any) => {
        try {
          const meta = JSON.parse(msgData.body)
          const newComment = {
            id: msgData.id,
            user_name: meta.user_name || "Anonymous",
            user_avatar: meta.user_avatar || "🌙",
            comment_text: meta.comment_text || msgData.body,
          }
          setMessages((prev) => [newComment, ...prev].slice(0, 10))
        } catch (e) {
          // Fallback
          setMessages((prev) =>
            [
              {
                id: msgData.id,
                user_name: "System",
                user_avatar: "⚡",
                comment_text: "New global event registered.",
              },
              ...prev,
            ].slice(0, 10)
          )
        }
      })

    return () => unsubscribe()
  }, [])

  if (messages.length === 0) return null

  return (
    <div className="bg-background/95 w-full overflow-hidden border-b border-border shadow-sm">
      <div className="flex h-10 items-center">
        <div className="relative z-10 flex h-full shrink-0 items-center gap-2 border-r border-border bg-muted px-4 shadow-sm">
          <Globe2 className="h-4 w-4 animate-pulse text-primary" />
          <span className="hidden font-sans text-[10px] font-black tracking-widest text-primary uppercase md:inline-block">
            Global Reflections
          </span>
          {/* Gradient fade edge */}
          <div className="pointer-events-none absolute top-0 right-[-20px] bottom-0 w-5 bg-gradient-to-r from-primary/10 to-transparent" />
        </div>

        <div className="group relative h-full flex-1 overflow-hidden">
          <div className="absolute flex h-full animate-[ticker_30s_linear_infinite] items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
            {/* Duplicate list for seamless loop */}
            {[...messages, ...messages].map((m, idx) => (
              <div
                key={`${m.id}-${idx}`}
                className="mx-8 flex items-center gap-2 font-mono text-xs"
              >
                <span className="flex items-center gap-1 font-bold text-primary">
                  <Quote className="inline h-3 w-3" />
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
