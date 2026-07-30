"use client"

import React, { useEffect, useState } from "react"
import { Globe, BookOpen, Clock, Activity } from "lucide-react"

export type WikiEdit = {
  id: string
  title: string
  user: string
  server_url: string
  timestamp: number
  comment: string
}

export function DigitalConsciousnessWidget() {
  const [edits, setEdits] = useState<WikiEdit[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let isMounted = true;

    try {
      // Connect to Wikimedia Recent Changes Stream
      eventSource = new EventSource("https://stream.wikimedia.org/v2/stream/recentchange")
      
      eventSource.onopen = () => {
        if (isMounted) setIsConnected(true)
      }

      eventSource.onmessage = (event) => {
        if (!isMounted) return;
        
        try {
          const data = JSON.parse(event.data)
          // Filter for only wikipedia edits (ignore wikidata, wikibooks, etc for noise reduction)
          // and only edits that actually change content (type === 'edit')
          if (data.type === 'edit' && data.server_name.includes('wikipedia.org')) {
            const newEdit: WikiEdit = {
              id: data.meta.id,
              title: data.title,
              user: data.user,
              server_url: data.server_url,
              timestamp: data.meta.dt ? new Date(data.meta.dt).getTime() : Date.now(),
              comment: data.comment || ""
            }

            setEdits(prev => {
              const updated = [newEdit, ...prev]
              return updated.slice(0, 15) // Keep last 15 edits
            })
          }
        } catch (e) {
          // parse error
        }
      }

      eventSource.onerror = () => {
        if (isMounted) setIsConnected(false)
      }
    } catch (e) {
      if (isMounted) setIsConnected(false)
    }

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  return (
    <div className="bg-space flex flex-col rounded-xl border border-white/10 p-4 lg:col-span-8 xl:col-span-6">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="text-[10px] font-black tracking-widest text-primary uppercase flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          DIGITAL CONSCIOUSNESS
          <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-[2px] text-[8px] border border-primary/50">WIKIPEDIA LIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[8px] uppercase tracking-widest font-bold ${isConnected ? "text-success" : "text-warning"}`}>
            {isConnected ? "STREAM CONNECTED" : "CONNECTING..."}
          </span>
          <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-success animate-pulse" : "bg-warning"}`}></div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 text-[8px] font-bold text-white/50 tracking-widest mb-2 border-b border-white/5 pb-2">
          <div className="col-span-2">TIME</div>
          <div className="col-span-5">KNOWLEDGE ARTICLE</div>
          <div className="col-span-3">EDITOR</div>
          <div className="col-span-2 text-right">REGION</div>
        </div>

        <div className="hide-scrollbar flex flex-col space-y-1 h-[250px] overflow-y-auto">
          {edits.length === 0 ? (
            <div className="text-center text-primary/50 text-[10px] py-10 font-mono flex flex-col items-center gap-2">
              <Activity className="h-6 w-6 animate-pulse" />
              Tuning into global knowledge stream...
            </div>
          ) : (
            edits.map((edit) => {
              const langCode = edit.server_url.replace("https://", "").split(".")[0].toUpperCase()
              return (
                <div
                  key={edit.id}
                  className="grid grid-cols-12 gap-4 text-[9px] items-start py-2 px-2 hover:bg-white/5 border border-transparent hover:border-white/10 rounded transition-colors group"
                >
                  <div className="col-span-2 text-primary/50 font-mono mt-0.5">
                    {new Date(edit.timestamp).toLocaleTimeString([], { hour12: false })}
                  </div>
                  <div className="col-span-5 flex flex-col">
                    <span className="font-bold text-white group-hover:text-primary transition-colors leading-tight">
                      {edit.title}
                    </span>
                    <span className="text-[7px] text-white/40 mt-1 line-clamp-1 italic">
                      {edit.comment || "No comment"}
                    </span>
                  </div>
                  <div className="col-span-3 font-mono text-white/70 truncate mt-0.5">
                    {edit.user}
                  </div>
                  <div className="col-span-2 text-right mt-0.5">
                    <span className="px-1.5 py-0.5 bg-white/10 text-white/80 font-black text-[7px] rounded-sm">
                      {langCode}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
