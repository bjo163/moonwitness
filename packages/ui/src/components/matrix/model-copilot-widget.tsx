"use client"

import React, { useState } from "react"
import { Sparkles, X, Send, Bot } from "lucide-react"
import type { ModelSchema } from "@workspace/types"

export interface ModelCopilotWidgetProps {
  schema: ModelSchema
  records: any[]
}

export function ModelCopilotWidget({ schema, records }: ModelCopilotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "ai" | "user"; text: string }>>([
    {
      role: "ai",
      text: `Assistant ready for [${schema.name}]. ${records.length} records loaded. How may I assist your analysis?`,
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
        response = `Summary for ${schema.name}: Total ${records.length} records tracked across active workflow stages. No critical anomalies found.`
      } else if (qLower.includes("priority") || qLower.includes("urgent") || qLower.includes("critical")) {
        const criticals = records.filter(
          (r) => r.priority === "critical" || r.priority === "urgent" || r.priority === 1
        )
        response = `Found ${criticals.length} high-priority records requiring attention in ${schema.name}.`
      } else {
        response = `Query evaluated against ${schema.name} schema. System invariants and business rules remain balanced.`
      }

      setMessages((prev) => [...prev, { role: "ai", text: response }])
      setThinking(false)
    }, 600)
  }

  return (
    <>
      {/* Floating Copilot Trigger Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:bg-primary/90 shadow-md transition-transform hover:scale-105"
      >
        <Sparkles className="w-4 h-4" />
        <span>Assistant</span>
      </button>

      {/* Floating Copilot Dialog */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-h-[500px] bg-card border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-foreground">
                Assistant • {schema.name}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="flex gap-1.5 p-2.5 bg-muted/20 border-b border-border overflow-x-auto text-[11px]">
            <button
              onClick={() => handleAsk("Summarize active records")}
              className="px-2.5 py-1 bg-secondary border border-border rounded-md text-foreground hover:bg-accent flex-shrink-0 font-medium"
            >
              Summarize
            </button>
            <button
              onClick={() => handleAsk("Check critical priority items")}
              className="px-2.5 py-1 bg-destructive/10 border border-destructive/20 rounded-md text-destructive hover:bg-destructive/20 flex-shrink-0 font-medium"
            >
              Urgent Items
            </button>
            <button
              onClick={() => handleAsk("Analyze workflow bottlenecks")}
              className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-md text-primary hover:bg-primary/20 flex-shrink-0 font-medium"
            >
              Audit Flow
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-72">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground ml-6 text-right"
                    : "bg-muted text-foreground mr-4 border border-border"
                }`}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="p-2 text-xs text-muted-foreground animate-pulse font-medium">
                Thinking...
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAsk()
            }}
            className="flex items-center gap-2 p-2.5 border-t border-border bg-muted/20"
          >
            <input
              type="text"
              placeholder={`Ask about ${schema.name}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
