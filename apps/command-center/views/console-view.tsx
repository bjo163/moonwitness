"use client"

import React, { useState, useEffect, useRef } from "react"
/* eslint-disable-next-line no-restricted-imports -- Standard icons for command console */
import {
  Terminal,
  Cpu,
  Database,
  Network,
  Activity,
  ShieldCheck,
  Zap,
  Sparkles,
} from "lucide-react"
import { Button } from "@workspace/ui"

type LogItem = {
  id: string
  timestamp: string
  sender: "SYSTEM" | "KHIDRA_AI" | "USER" | "SUCCESS" | "WARN" | "CRITICAL"
  message: string
}

const INITIAL_LOGS: LogItem[] = [
  {
    id: "1",
    timestamp: "00:00:01",
    sender: "SYSTEM",
    message: "Initiating Moonwitness Developer Console...",
  },
  {
    id: "2",
    timestamp: "00:00:02",
    sender: "SYSTEM",
    message: "Connecting to Core Khidra AI Services & Quantum Nodes...",
  },
  {
    id: "3",
    timestamp: "00:00:03",
    sender: "SUCCESS",
    message: "Cryptographic Handshake established. All protocols secured.",
  },
  {
    id: "4",
    timestamp: "00:00:04",
    sender: "KHIDRA_AI",
    message:
      "Greetings, Explorer. Terminal interactive interface is ready. Type 'help' to list available commands.",
  },
]

const QUICK_COMMANDS = [
  { label: "HELP", cmd: "help", desc: "List terminal commands" },
  { label: "STATUS", cmd: "status", desc: "View diagnostics" },
  { label: "SCAN", cmd: "scan", desc: "Simulate orbital scan" },
  { label: "MATRIX", cmd: "matrix", desc: "Run data stream test" },
  { label: "CLEAR", cmd: "clear", desc: "Reset log viewer" },
]

const TELEMETRY_METRIC_COUNT = 4
const RADIX_BASE = 36
const ID_LENGTH = 9
const COMMAND_DELAY_MS = 250

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

function ConsoleHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-cyan-500/30 pb-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Terminal className="h-6 w-6 animate-pulse text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-[0.25em] text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] md:text-2xl">
              DEV COMMAND SHELL
            </h1>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] tracking-widest text-emerald-400 uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              LIVE DIAGNOSTIC
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] tracking-widest text-cyan-300/70 uppercase">
            MOONWITNESS OS ADVANCED SYSTEM INTERRUPT & AI DIRECTIVES
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 font-mono text-xs text-purple-300 lg:flex">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span>KHIDRA ENGINE v9.4 (ONLINE)</span>
        </div>
        <Button
          variant="secondary"
          className="border border-white/20 font-mono text-xs hover:bg-white/10"
          onClick={() => {
            window.location.href = "/home"
          }}
        >
          &larr; PUBLIC BRIDGE
        </Button>
      </div>
    </header>
  )
}

function ConsoleQuickCommands({
  onSelect,
}: {
  onSelect: (cmd: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-cyan-500/20 bg-black/40 px-4 py-2.5">
      <span className="mr-2 font-mono text-[10px] tracking-widest text-cyan-400/60 uppercase">
        QUICK DIRECTIVES:
      </span>
      {QUICK_COMMANDS.map((item) => (
        <button
          key={item.cmd}
          onClick={() => onSelect(item.cmd)}
          className="group flex items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 font-mono text-[11px] text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.05)] transition-all hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white"
        >
          <Zap className="h-3 w-3 text-cyan-400 transition-transform group-hover:scale-110" />
          <span className="font-bold">{item.label}</span>
          <span className="hidden text-[9px] text-primary/40 sm:inline">
            ({item.desc})
          </span>
        </button>
      ))}
    </div>
  )
}

function TerminalLogViewer({ logs }: { logs: LogItem[] }) {
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
            <span className="font-mono text-[10px] text-primary/50">
              [{item.timestamp}]
            </span>
            <span className={getLogSenderStyle(item.sender)}>
              {item.sender}
            </span>
          </div>
          <p
            className={`font-mono leading-relaxed break-words ${item.sender === "USER" ? "font-semibold text-cyan-300" : "text-gray-300"}`}
          >
            {item.message}
          </p>
        </div>
      ))}
    </div>
  )
}

function TerminalWindowHeader() {
  return (
    <div className="flex items-center justify-between border-b border-cyan-500/30 bg-cyan-950/30 px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
        </div>
        <span className="font-mono text-xs font-bold tracking-widest text-cyan-300 uppercase">
          TERMINAL // ROOT_ACCESS_CONSOLE
        </span>
      </div>
      <span className="animate-pulse font-mono text-[10px] text-cyan-400/60 uppercase">
        &bull; SECURE LINK ACTIVE
      </span>
    </div>
  )
}

function SystemDiagnosticsSidebar() {
  const metrics = [
    {
      label: "CORE CPU LOAD",
      val: "38.2%",
      icon: Cpu,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
    },
    {
      label: "MEMORY BUFFER",
      val: "1.4 / 4.0 GB",
      icon: Database,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
    },
    {
      label: "NET LATENCY",
      val: "14.2 ms",
      icon: Network,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    {
      label: "ENTROPY FLICKER",
      val: "0.0034 eV",
      icon: Activity,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-cyan-500/30 bg-black/60 p-5 shadow-[0_0_25px_rgba(6,182,212,0.08)] backdrop-blur-md">
        <h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-white uppercase">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          Hardware Telemetry ({TELEMETRY_METRIC_COUNT} Nodes)
        </h3>
        <div className="space-y-3">
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div
                key={m.label}
                className={`flex items-center justify-between rounded-lg border ${m.border} ${m.bg} p-3 transition-transform hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${m.color}`} />
                  <span className="font-mono text-xs tracking-wider text-primary/80">
                    {m.label}
                  </span>
                </div>
                <span className={`font-mono text-sm font-bold ${m.color}`}>
                  {m.val}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-purple-500/30 bg-black/60 p-5 shadow-[0_0_25px_rgba(168,85,247,0.08)] backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-widest text-purple-300 uppercase">
            AI SAFETY ENFORCEMENT
          </span>
          <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
        </div>
        <p className="mt-2 font-mono text-xs leading-relaxed text-primary/70">
          Neural network safeguards prevent destructive orbital system
          operations. Root execution requires higher clearance.
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-purple-500/20 pt-3 font-mono text-[10px] text-purple-400/80">
          <span>CLEARED_LEVEL: 7</span>
          <span>KHIDRA_SYNC: ENGAGED</span>
        </div>
      </div>
    </div>
  )
}

export { TerminalView as ConsoleView }


export function TerminalView() {
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS)
  const [input, setInput] = useState("")

  const appendLog = (sender: LogItem["sender"], message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(RADIX_BASE).substring(2, ID_LENGTH),
        timestamp,
        sender,
        message,
      },
    ])
  }

  const executeCommand = (cmdText: string) => {
    const trimmed = cmdText.trim().toLowerCase()
    if (!trimmed) return

    appendLog("USER", `> ${cmdText}`)

    setTimeout(() => {
      switch (trimmed) {
        case "help":
          appendLog(
            "SYSTEM",
            "SUPPORTED COMMANDS: help, status, scan, matrix, clear"
          )
          break
        case "status":
          appendLog(
            "SUCCESS",
            "MOONWITNESS CORE DIAGNOSTIC: Observatory GPS locked. Islamic Lunar calendar engine in optimal sync. Database throughput normal."
          )
          break
        case "scan":
          appendLog(
            "KHIDRA_AI",
            "Commencing orbital sky sweep... Identified 3 astronomical anomaly targets in Waxing Gibbous quadrant. No hazards found."
          )
          break
        case "matrix":
          appendLog(
            "SYSTEM",
            "01001101 01001111 01001111 01001110 01010111 01001001 01010100 01001110 01000101 01010011 01010011 - Quantum Stream Verified."
          )
          break
        case "clear":
          setLogs([])
          break
        default:
          appendLog(
            "WARN",
            `Directive unregistered in current clearance: '${cmdText}'. Consult 'help' for valid protocol syntax.`
          )
          break
      }
    }, COMMAND_DELAY_MS)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(input)
    setInput("")
  }

  const handleQuickSelect = (cmd: string) => {
    if (cmd === "clear") {
      setLogs([])
    } else {
      executeCommand(cmd)
    }
  }

  return (
    <div className="bg-space relative min-h-screen p-6 text-white selection:bg-cyan-500/30 selection:text-cyan-200 md:p-10">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="theme-grid-bg absolute inset-0" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl space-y-8">
        <ConsoleHeader />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col overflow-hidden rounded-xl border border-cyan-500/30 bg-black/70 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:col-span-2">
            <TerminalWindowHeader />
            <ConsoleQuickCommands onSelect={handleQuickSelect} />
            <TerminalLogViewer logs={logs} />

            <form
              onSubmit={handleSubmit}
              className="flex items-center border-t border-cyan-500/30 bg-black px-4 py-3.5 shadow-inner"
            >
              <span className="mr-3 flex items-center font-mono font-black text-cyan-400">
                <Terminal className="mr-2 h-4 w-4 animate-pulse text-cyan-400" />
                {":~#"}
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter AI protocol or operational command..."
                className="flex-1 bg-transparent font-mono text-xs text-white placeholder-cyan-500/30 outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="ml-3 rounded border border-cyan-500/40 bg-cyan-500/20 px-3 py-1 font-mono text-[10px] font-bold text-cyan-300 transition-colors hover:bg-cyan-500 hover:text-black"
              >
                EXEC
              </button>
            </form>
          </div>

          <SystemDiagnosticsSidebar />
        </div>
      </main>
    </div>
  )
}
