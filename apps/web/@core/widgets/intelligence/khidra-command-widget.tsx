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
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: "init",
    role: "khidra",
    content: "I am Khidra. What intelligence or prophetic insight do you seek?"
  }])
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
      { id: Date.now().toString(), role: "user", content: userMsg }
    ]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!res.ok) throw new Error("Failed to communicate with Khidra API")
      
      const rawText = await res.text()
      let replyText = ""
      try {
        if (rawText.startsWith('0:')) {
          replyText = JSON.parse(rawText.substring(2).trim())
        } else {
          replyText = rawText
        }
      } catch (e) {
        replyText = rawText
      }
      
      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: "khidra", content: replyText }
      ])
    } catch (e) {
      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: "khidra", content: "[SYSTEM ERROR] Connection to divine observation terminal lost." }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-space border-success/30 flex flex-col md:flex-row gap-4 rounded-xl border-2 p-4 shadow-[0_0_20px_rgba(0,255,102,0.1)] lg:col-span-5 h-[300px]">
      <div className="flex flex-col items-center justify-center shrink-0 w-24">
        <div className="bg-space border-success/50 relative h-24 w-24 overflow-hidden rounded-lg border">
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
          <div className="text-success/70 text-[7px] uppercase mt-0.5">
            Knowledge Intelligence
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 border border-success/20 bg-black/40 rounded-lg overflow-hidden">
        <div 
          ref={chatRef}
          className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar text-[9px] font-mono leading-relaxed"
        >
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-2 rounded-md ${
                msg.role === 'user' 
                  ? 'bg-success/20 text-success border border-success/30' 
                  : 'bg-white/5 text-white/90 border border-white/10'
              }`}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 text-success border border-white/10 p-2 rounded-md flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Analyzing...
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-success/20 p-2 flex gap-2 bg-success/5">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Khidra..."
            className="flex-1 bg-black/50 border border-success/30 rounded px-2 py-1.5 text-[10px] font-mono text-success placeholder:text-success/30 focus:outline-none focus:border-success"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-success/20 text-success border border-success/50 rounded px-3 flex items-center justify-center hover:bg-success/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
