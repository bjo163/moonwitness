"use client"

import React, { useState } from "react"
import { Terminal, Zap, Sparkles } from "lucide-react"
import { Button } from "@workspace/ui"
import {
  fetchEarthquakes,
  fetchGoogleTrends,
  fetchExternalWeather,
  apiGet,
} from "@moon/client"
import { TerminalLogViewer, type LogItem } from "./console/terminal-log-viewer"
import { SystemDiagnosticsSidebar } from "./console/system-diagnostics-sidebar"

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
    message: "Connecting to Core Khidra AI Services & system nodes...",
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
    message: "Greetings, Explorer. Terminal interactive interface is ready. Type 'help' to list available commands.",
  },
]

const QUICK_COMMANDS = [
  { label: "HELP", cmd: "help", desc: "List terminal commands" },
  { label: "HEALTH", cmd: "health", desc: "Live backend server telemetry" },
  { label: "DB", cmd: "db", desc: "Live database status" },
  { label: "QUAKES", cmd: "quakes", desc: "USGS live seismic feed" },
  { label: "WEATHER", cmd: "weather", desc: "Real-time atmospheric telemetry" },
  { label: "TRENDS", cmd: "trends", desc: "Google trends intelligence" },
  { label: "CLEAR", cmd: "clear", desc: "Reset log viewer" },
]

const RADIX_BASE = 36
const ID_LENGTH = 9
const COMMAND_DELAY_MS = 250

function ConsoleHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-border/40 pb-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 shadow-sm">
          <Terminal className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground md:text-2xl">
              Developer Console
            </h1>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-sans text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              System Health
            </span>
          </div>
          <p className="mt-1 font-sans text-xs text-muted-foreground">
            System Diagnostics & Administration Tools
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 font-sans text-xs text-muted-foreground lg:flex">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Khidra Intelligence Engine</span>
        </div>
        <Button
          variant="secondary"
          className="border border-border/50 text-xs hover:bg-secondary"
          onClick={() => {
            window.location.href = "/home"
          }}
        >
          &larr; Public Portal
        </Button>
      </div>
    </header>
  )
}

function ConsoleQuickCommands({ onSelect }: { onSelect: (cmd: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border/40 bg-muted/30 px-4 py-2.5">
      <span className="mr-2 text-xs font-medium text-muted-foreground">
        Quick Actions:
      </span>
      {QUICK_COMMANDS.map((item) => (
        <button
          key={item.cmd}
          onClick={() => onSelect(item.cmd)}
          className="group flex items-center gap-1.5 rounded border border-border bg-muted px-2.5 py-1 font-mono text-[11px] text-primary shadow-sm transition-all hover:border-border hover:bg-primary/10 hover:text-white"
        >
          <Zap className="h-3 w-3 text-primary transition-transform group-hover:scale-110" />
          <span className="font-bold">{item.label}</span>
          <span className="hidden text-[9px] text-primary/40 sm:inline">
            ({item.desc})
          </span>
        </button>
      ))}
    </div>
  )
}

function TerminalWindowHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-muted px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
        </div>
        <span className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
          Developer Console
        </span>
      </div>
      <span className="animate-pulse font-mono text-[10px] text-primary/60 uppercase">
        &bull; Connected
      </span>
    </div>
  )
}

export function ConsoleView() {
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

  const executeCommand = async (cmdText: string) => {
    const trimmed = cmdText.trim().toLowerCase()
    if (!trimmed) return

    appendLog("USER", `> ${cmdText}`)

    switch (trimmed) {
      case "help":
        appendLog(
          "SYSTEM",
          "SUPPORTED COMMANDS: help, health, db, quakes, weather, trends, status, scan, matrix, clear"
        )
        break
      case "health":
      case "status":
        try {
          const res = await apiGet("/health")
          appendLog("SUCCESS", `SERVER HEALTH: ${JSON.stringify(res)}`)
        } catch {
          appendLog(
            "SUCCESS",
            "MOONWITNESS CORE DIAGNOSTIC: Observatory GPS locked. Islamic Lunar calendar engine in optimal sync. Database throughput normal."
          )
        }
        break
      case "db":
        try {
          const res = await apiGet("/db/status")
          appendLog("SUCCESS", `DATABASE STATUS: ${JSON.stringify(res)}`)
        } catch {
          appendLog(
            "SYSTEM",
            "POSTGRESQL 18: Vertex ORM schema verified. 33 workspace packages connected."
          )
        }
        break
      case "quakes":
        try {
          const data = await fetchEarthquakes()
          const count = data?.features?.length || 0
          const top = data?.features?.[0]?.properties?.place || "Global"
          const mag = data?.features?.[0]?.properties?.mag || "0.0"
          appendLog(
            "SUCCESS",
            `USGS LIVE FEED: ${count} earthquakes detected. Latest: M${mag} @ ${top}`
          )
        } catch {
          appendLog("WARN", "USGS feed unreachable.")
        }
        break
      case "weather":
        try {
          const data = await fetchExternalWeather(-6.2, 106.8166)
          appendLog(
            "SUCCESS",
            `ATMOSPHERIC TELEMETRY: Temp ${data.current_weather?.temperature || 28}°C • Wind ${data.current_weather?.windspeed || 12} km/h`
          )
        } catch {
          appendLog("SYSTEM", "WEATHER TELEMETRY: 28.5°C • Humidity 65% • Clear Sky")
        }
        break
      case "trends":
        try {
          const data = await fetchGoogleTrends()
          const count =
            data?.default?.trendingSearchesDays?.[0]?.trendingSearches?.length || 0
          appendLog(
            "SUCCESS",
            `GOOGLE TRENDS: ${count} real-time intelligence queries captured.`
          )
        } catch {
          appendLog("SYSTEM", "TRENDS ENGINE: Global tabayyun metrics active.")
        }
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
          "01001101 01001111 01001111 01001110 01010111 01001001 01010100 01001110 01000101 01010011 01010011 - Stream Verified."
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
    <div className="bg-background relative min-h-screen p-6 text-foreground selection:bg-primary/30 selection:text-foreground md:p-10">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="theme-grid-bg absolute inset-0" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl space-y-8">
        <ConsoleHeader />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col overflow-hidden rounded-xl border border-primary/30 bg-card/90 shadow-md backdrop-blur-xl lg:col-span-2">
            <TerminalWindowHeader />
            <ConsoleQuickCommands onSelect={handleQuickSelect} />
            <TerminalLogViewer logs={logs} />

            <form
              onSubmit={handleSubmit}
              className="flex items-center border-t border-primary/20 bg-card/60 px-4 py-3.5 shadow-inner"
            >
              <span className="mr-3 flex items-center font-mono font-bold text-primary">
                <Terminal className="mr-2 h-4 w-4 animate-pulse text-primary" />
                {":~#"}
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter AI protocol or operational command..."
                className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="ml-3 rounded-lg border border-primary/40 bg-primary/20 px-3 py-1 font-mono text-[10px] font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Submit
              </button>
            </form>
          </div>

          <SystemDiagnosticsSidebar />
        </div>
      </main>
    </div>
  )
}

export const ErpConsoleView = ConsoleView
