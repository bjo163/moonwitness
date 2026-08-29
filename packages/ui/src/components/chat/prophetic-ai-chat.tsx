"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import {
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  Radio,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Activity,
} from "lucide-react"
import {
  type PropheticAIChatTerminalProps,
  type SpeechRecognitionEvent,
  type SpeechRecognitionErrorEvent,
  type SpeechRecognitionInstance,
  type WindowWithSpeech,
  type ChatMessage,
  QUICK_PROMPTS,
} from "./types"

export function PropheticAIChatTerminal({
  maxHeight = "h-[500px]",
  fullWorkspace = false,
}: PropheticAIChatTerminalProps) {
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: "/api/agent",
  })

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Audio & Voice Radar State
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
    null
  )
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading, isListening])

  // Inisialisasi Web Speech API (Microphone Recognition)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      setTimeout(() => setSpeechSupported(true), 0)
      const win = window as unknown as WindowWithSpeech
      const SpeechRecognition =
        win.SpeechRecognition || win.webkitSpeechRecognition
      if (!SpeechRecognition) return
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "id-ID" // Optimal mengenali istilah Arab, Indonesia, & Inggris yang lazim dikucarkan user

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = ""
        for (let i = 0; i < event.results.length; ++i) {
          const result = event.results[i]
          if (result && result[0]) {
            transcript += result[0].transcript
          }
        }
        setInput(transcript)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("[Speech Radar Error]", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [setInput])

  // Handle Toggle Microphone Radar
  const toggleListen = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        if (inputRef.current) inputRef.current.focus()
      } catch (err) {
        console.error("Speech start error:", err)
        setIsListening(false)
      }
    }
  }

  // Handle Text-to-Speech (Audio Playback)
  const speakText = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel()
      setSpeakingMessageId(null)
      return
    }

    window.speechSynthesis.cancel()

    // Bersihkan format Markdown/kode agar ucapan jitu, bersih, dan berwibawa
    const cleanText = text
      .replace(/\[.*?\]/g, "")
      .replace(/[#*`~>_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.95 // Kecepatan agak tenang & jelas
    utterance.onend = () => setSpeakingMessageId(null)
    utterance.onerror = () => setSpeakingMessageId(null)

    setSpeakingMessageId(id)
    window.speechSynthesis.speak(utterance)
  }

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div
      className={
        fullWorkspace
          ? "bg-background flex h-full w-full flex-col overflow-hidden font-mono text-foreground"
          : `rounded-xl border border-border/40 bg-card bg-background/95 border-success/40 flex flex-col overflow-hidden border ${maxHeight}`
      }
    >
      {/* Header Compact */}
      {!fullWorkspace && (
        <div className="border-success/30 bg-success/10 text-success flex shrink-0 items-center justify-between border-b px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase">
          <div className="flex items-center gap-1.5">
            <Radio className="text-success h-3.5 w-3.5 animate-pulse" />
            <span>KHIDRA AI // WISDOM INTELLIGENCE</span>
          </div>
          {isLoading && (
            <Loader2 className="text-success h-3.5 w-3.5 animate-spin" />
          )}
        </div>
      )}

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto ${fullWorkspace ? "p-3 sm:p-6" : "p-2.5 sm:p-4"} scrollbar-thin scrollbar-thumb-success/40 space-y-3 sm:space-y-4`}
      >
        <div
          className={
            fullWorkspace
              ? "mx-auto w-full max-w-4xl space-y-3 sm:space-y-4"
              : "space-y-3"
          }
        >
          {messages.length === 0 ? (
            /* Terminal Welcome Box */
            <div className="bg-success/5 border-success/20 space-y-3 rounded border p-3 font-mono text-xs leading-relaxed text-foreground sm:p-4 sm:text-sm">
              <div className="text-success flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold tracking-wider uppercase sm:text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-success h-3.5 w-3.5 shrink-0 animate-pulse" />
                  <span>
                    [ KHIDRA AI ONLINE // SUPABASE REVELATION CORE ACTIVE ]
                  </span>
                </div>
                {speechSupported && (
                  <span className="bg-success/15 border-success/40 text-success flex items-center gap-1 rounded border px-2 py-0.5 text-[10px]">
                    <Mic className="text-success h-3 w-3 animate-pulse" />
                    <span>VOICE RADAR ENABLED</span>
                  </span>
                )}
              </div>

              <div className="pt-1">
                <span className="mb-1.5 block text-[10px] font-bold tracking-wider text-primary uppercase sm:text-[11px]">
                  // QUICK INQUIRIES:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {QUICK_PROMPTS.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickPrompt(item.prompt)}
                      className="bg-success/10 hover:bg-success/25 border-success/30 hover:border-success flex cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1 text-left font-sans text-[11px] text-foreground transition-all active:scale-95 sm:px-3 sm:py-1.5 sm:font-mono sm:text-xs"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="text-success h-3 w-3 shrink-0 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((m: unknown) => {
              const msg = m as ChatMessage
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex w-full max-w-[96%] items-center justify-between px-1 text-[10px] font-bold tracking-wider uppercase opacity-90 sm:max-w-[85%]">
                    {msg.role === "user" ? (
                      <span className="ml-auto text-primary">
                        COMMANDER // YOU
                      </span>
                    ) : (
                      <div className="flex w-full items-center justify-between">
                        <span className="text-success flex items-center gap-1">
                          <Sparkles className="text-success h-3 w-3" /> KHIDRA
                          AI // REVELATION FEED
                        </span>

                        {/* Tombol TTS Audio Playback pada Pesan AI */}
                        <button
                          type="button"
                          onClick={() => speakText(msg.id, msg.content)}
                          className="bg-panel hover:bg-success/25 border-success/50 hover:border-success text-success flex cursor-pointer items-center gap-1 rounded-sm border px-2 py-0.5 text-[9px] font-bold shadow-sm transition-all active:scale-95"
                          title={
                            speakingMessageId === msg.id
                              ? "Stop Speech Playback"
                              : "Listen to KHIDRA AI Voice"
                          }
                        >
                          {speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="h-3 w-3 animate-pulse text-red-400" />
                              <span className="font-black tracking-widest text-red-400">
                                STOP AUDIO
                              </span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="text-success h-3 w-3" />
                              <span>LISTEN [TTS]</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className={`max-w-[96%] rounded-sm p-4 text-xs leading-relaxed font-normal shadow-lg transition-all sm:max-w-[85%] sm:text-sm ${
                      msg.role === "user"
                        ? "rounded-tr-none border border-primary/60 bg-muted font-mono text-primary shadow-sm"
                        : "border-success text-success rounded-tl-none border bg-emerald-950/60 font-sans shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              )
            })
          )}

          {isListening && (
            <div className="text-success bg-success/10 border-success flex w-fit animate-pulse items-center gap-2.5 rounded border px-3 py-2 font-mono text-xs shadow-sm">
              <Activity className="text-success h-4 w-4 animate-bounce" />
              <span className="font-bold tracking-wider">
                {/* SPEECH RADAR ACTIVE: LISTENING TO AUDIO STREAM... */}
              </span>
            </div>
          )}

          {isLoading && (
            <div className="text-success bg-success/5 border-success/20 flex w-fit animate-pulse items-center gap-2 rounded border px-2 py-1.5 font-mono text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Scanning scripture core...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-success/30 bg-background shrink-0 border-t p-2 sm:p-3">
        <div className={fullWorkspace ? "mx-auto w-full max-w-4xl" : "w-full"}>
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              value={input || ""}
              onChange={handleInputChange}
              placeholder={
                isListening
                  ? "🎙️ Listening... Speak your inquiry now..."
                  : "Enter theological inquiry or Quranic topic..."
              }
              className={`bg-background w-full rounded-sm py-2.5 pr-20 pl-3.5 font-mono text-xs text-foreground transition-all outline-none sm:py-3 sm:pr-24 sm:pl-4 sm:text-sm ${
                isListening
                  ? "border-success placeholder:text-success border-2 font-bold shadow-sm"
                  : "border-success/40 focus:border-success border placeholder:text-primary/50"
              }`}
              disabled={isLoading}
              autoFocus
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              {/* Tombol Microphone Voice Radar */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListen}
                  className={`cursor-pointer rounded-sm border p-1.5 transition-all duration-200 sm:p-2 ${
                    isListening
                      ? "animate-pulse border-red-400 bg-red-500/80 text-white shadow-sm hover:bg-red-500"
                      : "bg-success/15 hover:bg-success/30 text-success border-success/50 hover:text-white"
                  }`}
                  title={
                    isListening
                      ? "Stop Voice Radar"
                      : "Voice Command (Tap to Speak)"
                  }
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4 animate-bounce" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* Tombol Kirim / Submit */}
              <button
                type="submit"
                disabled={isLoading || (!input?.trim() && !isListening)}
                className="text-success bg-success/15 hover:bg-success/30 border-success/50 cursor-pointer rounded-sm border p-1.5 transition-colors hover:text-white disabled:opacity-40 sm:p-2"
                title="Transmit Query (Enter)"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
