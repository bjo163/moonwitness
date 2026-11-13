#!/usr/bin/env node
import process from "node:process"

const targets = [
  [
    "api-readiness",
    process.env.MOON_API_URL || "http://127.0.0.1:4000/health/ready",
  ],
  ["web", process.env.PLAYWRIGHT_WEB_URL || "http://127.0.0.1:3000"],
  ["command-center", process.env.PLAYWRIGHT_CC_URL || "http://127.0.0.1:3001"],
  [
    "celestial-engine",
    process.env.CELESTIAL_ENGINE_URL
      ? `${process.env.CELESTIAL_ENGINE_URL}/health`
      : "http://127.0.0.1:8001/health",
  ],
  [
    "ai-agent",
    process.env.AI_AGENT_URL
      ? `${process.env.AI_AGENT_URL}/health`
      : "http://127.0.0.1:8002/health",
  ],
]
const timeoutMs = Number(process.env.RUNTIME_EVIDENCE_TIMEOUT_MS || 5000)
const results = []
for (const [name, url] of targets) {
  const started = Date.now()
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
    })
    results.push({
      name,
      url,
      status: response.status,
      ok: response.ok,
      latency_ms: Date.now() - started,
    })
  } catch (error) {
    results.push({
      name,
      url,
      status: null,
      ok: false,
      latency_ms: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
const evidence = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  source: "scripts/runtime-evidence.mjs",
  results,
  all_required_healthy: results.every((item) => item.ok),
}
process.stdout.write(`${JSON.stringify(evidence, null, 2)}\n`)
if (!evidence.all_required_healthy) process.exitCode = 2
