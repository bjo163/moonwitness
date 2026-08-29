"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MessageSquare, Send, Loader2 } from "lucide-react"

type ChatMessage = {
  id: string
  role: "user" | "khidra"
  content: string
}

export function KhidraCommandWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "khidra",
      content:
        "I am Khidra. What intelligence or prophetic insight do you seek?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg = input.trim()
    setInput("")

    const newMessages: ChatMessage[] = [
      ...messages,
      { id: Date.now().toString(), role: "user", content: userMsg },
    ]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) throw new Error("Failed to communicate with Khidra API")

      const rawText = await res.text()
      let replyText = ""
      try {
        if (rawText.startsWith("0:")) {
          replyText = JSON.parse(rawText.substring(2).trim())
        } else {
          replyText = rawText
        }
      } catch (e) {
        replyText = rawText
      }

      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: "khidra", content: replyText },
      ])
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "khidra",
          content:
            "[SYSTEM ERROR] Connection to divine observation terminal lost.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background border-success/30 flex h-[300px] flex-col gap-4 rounded-xl border-2 p-4 shadow-[0_0_20px_rgba(0,255,102,0.1)] md:flex-row lg:col-span-5">
      <div className="flex w-24 shrink-0 flex-col items-center justify-center">
        <div className="bg-background border-success/50 relative h-24 w-24 overflow-hidden rounded-lg border">
          <img
            alt="Khidra AI"
            src="/assets/mod_khidra.png"
            className="h-full w-full object-cover opacity-90 mix-blend-screen"
          />
          <div className="from-space absolute inset-0 bg-gradient-to-t to-transparent opacity-50" />
        </div>
        <div className="mt-2 text-center">
          <div className="text-[10px] font-black tracking-widest text-white uppercase">
            AI ADVISOR <span className="text-success">KHIDRA</span>
          </div>
          <div className="text-success/70 mt-0.5 text-[7px] uppercase">
            Knowledge Intelligence
          </div>
        </div>
      </div>

      <div className="border-success/20 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-black/40">
        <div
          ref={chatRef}
          className="hide-scrollbar flex-1 space-y-3 overflow-y-auto p-3 font-mono text-[9px] leading-relaxed"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-md p-2 ${
                  msg.role === "user"
                    ? "bg-success/20 text-success border-success/30 border"
                    : "border border-white/10 bg-white/5 text-white/90"
                }`}
              >
                {msg.content.split("\n").map((line, i) => (
                  <p key={i} className="mb-1 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="text-success flex items-center gap-2 rounded-md border border-white/10 bg-white/5 p-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Analyzing...
              </div>
            </div>
          )}
        </div>

        <div className="border-success/20 bg-success/5 flex gap-2 border-t p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Khidra..."
            className="border-success/30 text-success placeholder:text-success/30 focus:border-success flex-1 rounded border bg-black/50 px-2 py-1.5 font-mono text-[10px] focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-success/20 text-success border-success/50 hover:bg-success/40 flex items-center justify-center rounded border px-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
