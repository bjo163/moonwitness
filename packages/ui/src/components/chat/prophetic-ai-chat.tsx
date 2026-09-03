"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "ai/react"
import {
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Activity,
  Bot,
  User as UserIcon,
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

  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading, isListening])

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
      recognition.lang = "id-ID"

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
        console.error("[Speech Error]", event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [setInput])

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

  const speakText = (id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel()
      setSpeakingMessageId(null)
      return
    }

    window.speechSynthesis.cancel()

    const cleanText = text
      .replace(/\[.*?\]/g, "")
      .replace(/[#*`~>_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.95
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
          ? "flex h-full w-full flex-col overflow-hidden bg-background font-sans text-foreground"
          : `flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm ${maxHeight}`
      }
    >
      {/* Header Compact */}
      {!fullWorkspace && (
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5 text-xs font-semibold">
          <div className="flex items-center gap-2 text-foreground">
            <Bot className="h-4 w-4 text-primary" />
            <span>AI Knowledge Assistant</span>
          </div>
          {isLoading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </div>
      )}

      {/* Messages Area */}
      <div
        className={`flex-1 space-y-3 overflow-y-auto ${fullWorkspace ? "p-4 sm:p-6" : "p-3 sm:p-4"}`}
      >
        <div
          className={
            fullWorkspace
              ? "mx-auto w-full max-w-4xl space-y-3 sm:space-y-4"
              : "space-y-3"
          }
        >
          {messages.length === 0 ? (
            /* Welcome Box */
            <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4 font-sans text-xs leading-relaxed text-foreground sm:text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                <div className="flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Knowledge Assistant Ready</span>
                </div>
                {speechSupported && (
                  <span className="flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    <Mic className="h-3 w-3 text-primary" />
                    <span>Voice Input Available</span>
                  </span>
                )}
              </div>

              <div className="pt-2">
                <span className="mb-2 block text-xs font-semibold text-muted-foreground">
                  Suggested inquiries:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {QUICK_PROMPTS.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickPrompt(item.prompt)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-left font-sans text-xs text-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:px-3 sm:py-1.5"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
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
                  <div className="flex w-full max-w-[96%] items-center justify-between px-1 text-[11px] font-medium text-muted-foreground sm:max-w-[85%]">
                    {msg.role === "user" ? (
                      <span className="ml-auto flex items-center gap-1 text-foreground">
                        <UserIcon className="h-3.5 w-3.5 text-primary" /> You
                      </span>
                    ) : (
                      <div className="flex w-full items-center justify-between">
                        <span className="flex items-center gap-1 text-foreground font-semibold">
                          <Sparkles className="h-3.5 w-3.5 text-primary" /> Knowledge Assistant
                        </span>

                        <button
                          type="button"
                          onClick={() => speakText(msg.id, msg.content)}
                          className="flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          title={
                            speakingMessageId === msg.id
                              ? "Stop audio playback"
                              : "Listen to answer"
                          }
                        >
                          {speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="h-3 w-3 text-destructive" />
                              <span className="text-destructive font-medium">
                                Stop Audio
                              </span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3 text-primary" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className={`max-w-[96%] rounded-xl p-3.5 text-xs leading-relaxed sm:max-w-[85%] sm:text-sm ${
                      msg.role === "user"
                        ? "border border-border bg-primary text-primary-foreground font-sans shadow-sm"
                        : "border border-border bg-card text-card-foreground font-sans shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              )
            })
          )}

          {isListening && (
            <div className="flex w-fit items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-1.5 font-sans text-xs text-warning">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span className="font-medium">Listening to speech...</span>
            </div>
          )}

          {isLoading && (
            <div className="flex w-fit items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 font-sans text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Analyzing knowledge repository...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-border bg-card p-2.5 sm:p-3">
        <div className={fullWorkspace ? "mx-auto w-full max-w-4xl" : "w-full"}>
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              ref={inputRef}
              value={input || ""}
              onChange={handleInputChange}
              placeholder={
                isListening
                  ? "Listening... speak now..."
                  : "Ask a question or enter a topic..."
              }
              className={`w-full rounded-lg border border-input bg-background py-2 pr-20 pl-3 font-sans text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:py-2.5 sm:pr-24 sm:pl-3.5 sm:text-sm ${
                isListening ? "border-warning ring-2 ring-warning/30" : ""
              }`}
              disabled={isLoading}
              autoFocus
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleListen}
                  className={`cursor-pointer rounded-md p-1.5 transition-colors sm:p-2 ${
                    isListening
                      ? "bg-destructive text-destructive-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading || (!input?.trim() && !isListening)}
                className="cursor-pointer rounded-md bg-primary p-1.5 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 sm:p-2"
                title="Send message"
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
