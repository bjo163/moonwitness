import { describe, expect, it } from "vitest"
import {
  resolveSourceStatus,
  summarizeSourceStatus,
  type SourceMeta,
} from "./source-status"

describe("source status", () => {
  it("reports unavailable when no sources have been checked", () => {
    expect(summarizeSourceStatus([]).status).toBe("UNAVAILABLE")
  })

  it("marks an unavailable source unavailable", () => {
    const source: SourceMeta = {
      source: "usgs-earthquakes",
      status: "UNAVAILABLE",
      timestamp: 1_000,
      error: "request failed",
    }

    expect(resolveSourceStatus(source.status, source.timestamp, { now: 2_000 })).toBe(
      "UNAVAILABLE"
    )
  })

  it("marks an old live source stale", () => {
    expect(
      resolveSourceStatus("LIVE", 1_000, {
        now: 1_000 + 16 * 60 * 1000,
        staleAfterMs: 15 * 60 * 1000,
      })
    ).toBe("STALE")
  })

  it("derives unavailable when any source failed", () => {
    const summary = summarizeSourceStatus(
      [
        { source: "live", status: "LIVE", timestamp: 10_000 },
        { source: "failed", status: "UNAVAILABLE", timestamp: 10_000 },
      ],
      { now: 10_000 }
    )

    expect(summary.status).toBe("UNAVAILABLE")
    expect(summary.live).toBe(1)
    expect(summary.unavailable).toBe(1)
  })

  it("derives stale when an old source remains", () => {
    const summary = summarizeSourceStatus(
      [
        { source: "live", status: "LIVE", timestamp: 10_000 },
        { source: "old", status: "LIVE", timestamp: 1_000 },
      ],
      { now: 10_000, staleAfterMs: 5_000 }
    )

    expect(summary.status).toBe("STALE")
    expect(summary.stale).toBe(1)
  })
})
