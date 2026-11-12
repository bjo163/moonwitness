export type SourceStatus =
  | "LIVE"
  | "CACHED"
  | "STALE"
  | "UNAVAILABLE"
  | "SIMULATED"

export type SourceMeta = {
  source: string
  status: SourceStatus
  timestamp: number
  checkedAt?: number
  latencyMs?: number
  error?: string
}

export type SourceSummary = {
  status: SourceStatus
  live: number
  cached: number
  stale: number
  unavailable: number
  simulated: number
  total: number
}

export type SourceFreshnessOptions = {
  now?: number
  staleAfterMs?: number
}

const DEFAULT_STALE_AFTER_MS = 15 * 60 * 1000

export function sourceFailureMeta(
  source: string,
  lastSuccessAt: number | undefined,
  error: string,
  checkedAt = Date.now(),
  latencyMs?: number
): SourceMeta {
  if (lastSuccessAt === undefined) {
    return {
      source,
      status: "UNAVAILABLE",
      timestamp: checkedAt,
      checkedAt,
      latencyMs,
      error,
    }
  }

  return {
    source,
    status: resolveSourceStatus("CACHED", lastSuccessAt, { now: checkedAt }),
    timestamp: lastSuccessAt,
    checkedAt,
    latencyMs,
    error,
  }
}

export function resolveSourceStatus(
  responseStatus: SourceStatus,
  timestamp: number,
  options: SourceFreshnessOptions = {}
): SourceStatus {
  if (responseStatus === "UNAVAILABLE" || responseStatus === "SIMULATED") {
    return responseStatus
  }

  const now = options.now ?? Date.now()
  const staleAfterMs = options.staleAfterMs ?? DEFAULT_STALE_AFTER_MS
  if (now - timestamp > staleAfterMs) {
    return "STALE"
  }

  return responseStatus
}

export function summarizeSourceStatus(
  sources: SourceMeta[],
  options: SourceFreshnessOptions = {}
): SourceSummary {
  const counts: Record<SourceStatus, number> = {
    LIVE: 0,
    CACHED: 0,
    STALE: 0,
    UNAVAILABLE: 0,
    SIMULATED: 0,
  }

  for (const source of sources) {
    const status = resolveSourceStatus(source.status, source.timestamp, options)
    counts[status] += 1
  }

  const total = sources.length
  const unavailable = counts.UNAVAILABLE
  const stale = counts.STALE

  let status: SourceStatus = total === 0 ? "UNAVAILABLE" : "LIVE"
  if (total > 0) {
    if (unavailable > 0) status = "UNAVAILABLE"
    else if (stale > 0) status = "STALE"
    else if (counts.SIMULATED > 0) status = "SIMULATED"
    else if (counts.CACHED === total) status = "CACHED"
  }

  return {
    status,
    live: counts.LIVE,
    cached: counts.CACHED,
    stale: counts.STALE,
    unavailable: counts.UNAVAILABLE,
    simulated: counts.SIMULATED,
    total,
  }
}
