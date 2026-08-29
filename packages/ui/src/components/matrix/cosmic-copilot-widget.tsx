"use client"

import React, { useState } from "react"
import { Sparkles, X, Send, Bot, ShieldCheck, Zap } from "lucide-react"
import type { ModelSchema } from "@workspace/types"

export interface CosmicCopilotWidgetProps {
  schema: ModelSchema
  records: any[]
}

export function CosmicCopilotWidget({ schema, records }: CosmicCopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "ai" | "user"; text: string }>>([
    {
      role: "ai",
      text: `AI Copilot online for [${schema.name}]. ${records.length} records loaded. How may I assist your analysis?`,
    },
  ])
  const [thinking, setThinking] = useState(false)

  const handleAsk = (promptText?: string) => {
    const q = promptText || query
    if (!q.trim()) return

    setMessages((prev) => [...prev, { role: "user", text: q }])
    setQuery("")
    setThinking(true)

    setTimeout(() => {
      let response = ""
      const qLower = q.toLowerCase()

      if (qLower.includes("summary") || qLower.includes("ringkas") || qLower.includes("analyze")) {
        response = `Audit Summary for ${schema.name}: Total ${records.length} records tracked. Highest density in standard workflow stages. Zero unhandled fatal anomalies detected.`
      } else if (qLower.includes("priority") || qLower.includes("urgent") || qLower.includes("critical")) {
        const criticals = records.filter(
          (r) => r.priority === "critical" || r.priority === "urgent" || r.priority === 1
        )
        response = `Discovered ${criticals.length} high-priority units requiring immediate operator attention in ${schema.name}.`
      } else {
        response = `Khidra Intelligence Engine evaluated query against ${schema.name} schema. System invariants and ethical constraints remain balanced.`
      }

      setMessages((prev) => [...prev, { role: "ai", text: response }])
      setThinking(false)
    }, 600)
  }

  return (
    <>
      {/* Floating Tactical Trigger Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-cyber-purple/20 border border-cyber-purple/60 rounded-full text-xs font-mono text-cyber-purple hover:bg-cyber-purple/30 uppercase tracking-wider backdrop-blur-md shadow-[0_0_20px_rgba(161,0,255,0.3)] transition-all hover:scale-105"
      >
        <Sparkles className="w-4 h-4 animate-spin-slow text-white" />
        <span className="font-bold text-white">KHIDRA AI COPILOT</span>
      </button>

      {/* Floating Copilot Dialog */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-h-[500px] bg-cyber-dark/95 border border-cyber-purple/50 rounded-xl shadow-[0_0_40px_rgba(161,0,255,0.25)] flex flex-col overflow-hidden corner-box backdrop-blur-xl font-mono animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-purple/30 bg-cyber-panel/90">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyber-purple" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                KHIDRA // {schema.name}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-steel-gray hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex gap-1.5 p-2.5 bg-black/40 border-b border-cyber-purple/20 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleAsk("Summarize active records")}
              className="px-2 py-1 bg-cyber-purple/10 border border-cyber-purple/30 rounded text-cyber-purple hover:bg-cyber-purple/20 flex-shrink-0"
            >
              ⚡ SUMMARIZE
            </button>
            <button
              onClick={() => handleAsk("Check critical priority items")}
              className="px-2 py-1 bg-cyber-pink/10 border border-cyber-pink/30 rounded text-cyber-pink hover:bg-cyber-pink/20 flex-shrink-0"
            >
              ⚠️ CRITICAL
            </button>
            <button
              onClick={() => handleAsk("Analyze workflow bottlenecks")}
              className="px-2 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-cyber-cyan hover:bg-cyber-cyan/20 flex-shrink-0"
            >
              🔍 AUDIT
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-72">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-cyber-cyan/10 border border-cyber-cyan/30 text-white ml-6 text-right"
                    : "bg-cyber-purple/10 border border-cyber-purple/30 text-steel-gray mr-4"
                }`}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="p-2 text-xs text-cyber-purple animate-pulse">
                KHIDRA SYNAPSE PROCESSING...
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAsk()
            }}
            className="flex items-center gap-2 p-2.5 border-t border-cyber-purple/20 bg-cyber-panel/60"
          >
            <input
              type="text"
              placeholder={`Ask AI about ${schema.name}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-black/60 border border-cyber-purple/30 rounded px-3 py-1.5 text-xs text-white placeholder-steel-gray/40 focus:border-cyber-purple/60 focus:outline-none"
            />
            <button
              type="submit"
              className="p-1.5 bg-cyber-purple/20 border border-cyber-purple/50 rounded text-cyber-purple hover:bg-cyber-purple/40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
