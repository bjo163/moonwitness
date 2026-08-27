"use client"

import React, { useEffect, useRef } from "react"

export type LogItem = {
  id: string
  timestamp: string
  sender: "SYSTEM" | "KHIDRA_AI" | "USER" | "SUCCESS" | "WARN" | "CRITICAL"
  message: string
}

function getLogSenderStyle(sender: LogItem["sender"]) {
  switch (sender) {
    case "SYSTEM":
      return "text-cyan-400 font-bold border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 rounded text-[10px]"
    case "KHIDRA_AI":
      return "text-purple-400 font-bold border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 rounded text-[10px]"
    case "SUCCESS":
      return "text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]"
    case "WARN":
      return "text-amber-400 font-bold border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]"
    case "CRITICAL":
      return "text-rose-500 font-bold border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 rounded text-[10px]"
    case "USER":
      return "text-white font-bold px-1.5 py-0.5 rounded text-[10px] bg-black/60 border border-white/20"
  }
}

export function TerminalLogViewer({ logs }: { logs: LogItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs.length])

  return (
    <div
      ref={scrollRef}
      className="scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent max-h-[560px] min-h-[400px] flex-1 space-y-3 overflow-y-auto p-5 font-mono text-xs"
    >
      {logs.map((item) => (
        <div
          key={item.id}
          className="group flex flex-col gap-1.5 rounded-lg border border-transparent p-2 transition-colors hover:border-white/10 hover:bg-black/30 sm:flex-row sm:items-start sm:gap-3"
        >
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-mono text-[10px] text-white/50">
              [{item.timestamp}]
            </span>
            <span className={getLogSenderStyle(item.sender)}>
              {item.sender}
            </span>
          </div>
          <p
            className={`font-mono leading-relaxed break-words ${
              item.sender === "USER"
                ? "font-semibold text-cyan-300"
                : "text-gray-300"
            }`}
          >
            {item.message}
          </p>
        </div>
      ))}
    </div>
  )
}
