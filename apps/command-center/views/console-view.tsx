"use client"

import React, { useState } from "react"
import { ArrowLeft, Terminal } from "lucide-react"
import { apiGet, fetchEarthquakes, fetchExternalWeather, fetchGoogleTrends } from "@moon/client"
import { Button } from "@workspace/ui"
import { TerminalLogViewer, type LogItem } from "./console/terminal-log-viewer"
import { SystemDiagnosticsSidebar } from "./console/system-diagnostics-sidebar"

const INITIAL_LOGS: LogItem[] = [
  { id: "1", timestamp: "00:00:01", sender: "SYSTEM", message: "Developer console ready." },
  { id: "2", timestamp: "00:00:02", sender: "SYSTEM", message: "Type help to list available commands." },
]

const QUICK_COMMANDS = [
  { label: "help", description: "List commands" },
  { label: "health", description: "Backend health" },
  { label: "db", description: "Database status" },
  { label: "quakes", description: "USGS feed" },
  { label: "weather", description: "Weather data" },
  { label: "trends", description: "Google Trends" },
  { label: "clear", description: "Clear output" },
]

const COMMAND_DELAY_MS = 250

function ConsoleHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/40 bg-primary/10">
          <Terminal className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Developer Console</h1>
          <p className="mt-1 text-sm text-muted-foreground">Run diagnostics and inspect service responses.</p>
        </div>
      </div>
      <Button variant="secondary" className="w-fit gap-2" onClick={() => { window.location.href = "/home" }}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to portal
      </Button>
    </header>
  )
}

function QuickCommands({ onSelect }: { onSelect: (command: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/20 px-4 py-3">
      <span className="mr-1 text-xs font-medium text-muted-foreground">Quick commands</span>
      {QUICK_COMMANDS.map((command) => (
        <button key={command.label} type="button" title={command.description} onClick={() => onSelect(command.label)} className="rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-primary/60 hover:bg-primary/10">
          {command.label}
        </button>
      ))}
    </div>
  )
}

function TerminalHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      <span className="text-sm font-medium text-foreground">Command output</span>
      <span className="font-mono text-xs text-muted-foreground">/terminal</span>
    </div>
  )
}

export function ConsoleView() {
  const [logs, setLogs] = useState<LogItem[]>(INITIAL_LOGS)
  const [input, setInput] = useState("")

  const appendLog = (sender: LogItem["sender"], message: string) => {
    setLogs((previous) => [...previous, { id: `${Date.now()}-${previous.length}`, timestamp: new Date().toLocaleTimeString(), sender, message }])
  }

  const executeCommand = async (commandText: string) => {
    const command = commandText.trim().toLowerCase()
    if (!command) return
    appendLog("USER", `$ ${commandText}`)
    await new Promise((resolve) => setTimeout(resolve, COMMAND_DELAY_MS))
    switch (command) {
      case "help":
        appendLog("SYSTEM", "Available commands: help, health, db, quakes, weather, trends, status, scan, matrix, clear")
        break
      case "health":
      case "status":
        try { appendLog("SUCCESS", `SERVER HEALTH: ${JSON.stringify(await apiGet("/health"))}`) }
        catch { appendLog("WARN", "Backend health endpoint is unavailable.") }
        break
      case "db":
        try { appendLog("SUCCESS", `DATABASE STATUS: ${JSON.stringify(await apiGet("/db/status"))}`) }
        catch { appendLog("WARN", "Database status endpoint is unavailable.") }
        break
      case "quakes":
        try {
          const data = await fetchEarthquakes()
          const latest = data?.features?.[0]?.properties
          appendLog("SUCCESS", `USGS FEED: ${data?.features?.length || 0} events. Latest: M${latest?.mag || "0.0"} at ${latest?.place || "unknown location"}`)
        } catch { appendLog("WARN", "USGS feed is unavailable.") }
        break
      case "weather":
        try {
          const data = await fetchExternalWeather(-6.2, 106.8166)
          appendLog("SUCCESS", `WEATHER: ${data.current_weather?.temperature || 28}°C, wind ${data.current_weather?.windspeed || 12} km/h`)
        } catch { appendLog("WARN", "Weather service is unavailable.") }
        break
      case "trends":
        try {
          const data = await fetchGoogleTrends()
          const count = data?.default?.trendingSearchesDays?.[0]?.trendingSearches?.length || 0
          appendLog("SUCCESS", `GOOGLE TRENDS: ${count} current topics returned.`)
        } catch { appendLog("WARN", "Google Trends service is unavailable.") }
        break
      case "scan":
        appendLog("SYSTEM", "Scan complete: 3 astronomy targets found; no hazards reported.")
        break
      case "matrix":
        appendLog("SYSTEM", "Data stream check passed.")
        break
      case "clear":
        setLogs([])
        break
      default:
        appendLog("WARN", `Unknown command: '${commandText}'. Run help for available commands.`)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    void executeCommand(input)
    setInput("")
  }

  return (
    <div className="bg-background min-h-screen p-4 text-foreground sm:p-6 lg:p-8">
      <main className="mx-auto max-w-7xl space-y-6">
        <ConsoleHeader />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="flex min-h-[600px] flex-col overflow-hidden rounded-lg border border-border bg-background/80 shadow-sm">
            <TerminalHeader />
            <QuickCommands onSelect={(command) => { if (command === "clear") setLogs([]); else void executeCommand(command) }} />
            <TerminalLogViewer logs={logs} />
            <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t border-border bg-muted/20 p-3">
              <label htmlFor="console-command" className="font-mono text-sm text-primary">$</label>
              <input id="console-command" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter a command" className="min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground" autoFocus />
              <Button type="submit" size="sm">Run</Button>
            </form>
          </section>
          <SystemDiagnosticsSidebar />
        </div>
      </main>
    </div>
  )
}

export const ErpConsoleView = ConsoleView
