"use client"

import React, { useEffect, useState } from "react"
import { Globe, BookOpen, Clock, Activity } from "lucide-react"
import {
  resolveSourceStatus,
  sourceFailureMeta,
  type SourceMeta,
  type SourceStatus,
} from "@moon/client"

export type WikiEdit = {
  id: string
  title: string
  user: string
  server_url: string
  timestamp: number
  comment: string
}

export function DigitalConsciousnessWidget({
  onSourceMeta,
}: {
  onSourceMeta?: (source: SourceMeta) => void
}) {
  const [edits, setEdits] = useState<WikiEdit[]>([])
  const [status, setStatus] = useState<SourceStatus>("UNAVAILABLE")

  useEffect(() => {
    let eventSource: EventSource | null = null
    let isMounted = true
    let lastSuccessAt: number | undefined
    const reportSource = (metadata: SourceMeta) => {
      if (!isMounted) return
      setStatus(metadata.status)
      onSourceMeta?.(metadata)
    }
    const reportLive = () => {
      const timestamp = Date.now()
      lastSuccessAt = timestamp
      reportSource({
        source: "wikipedia-recent-changes",
        status: "LIVE",
        timestamp,
        checkedAt: timestamp,
      })
    }
    const reportFailure = () => {
      reportSource(
        sourceFailureMeta(
          "wikipedia-recent-changes",
          lastSuccessAt,
          "Wikimedia recent-changes stream disconnected"
        )
      )
    }

    try {
      eventSource = new EventSource(
        "https://stream.wikimedia.org/v2/stream/recentchange"
      )

      eventSource.onopen = () => {
        reportLive()
      }

      eventSource.onmessage = (event) => {
        if (!isMounted) return

        try {
          const data = JSON.parse(event.data)
          if (
            data.type === "edit" &&
            data.server_name.includes("wikipedia.org")
          ) {
            const newEdit: WikiEdit = {
              id: data.meta.id,
              title: data.title,
              user: data.user,
              server_url: data.server_url,
              timestamp: data.meta.dt
                ? new Date(data.meta.dt).getTime()
                : Date.now(),
              comment: data.comment || "",
            }

            setEdits((prev) => {
              const updated = [newEdit, ...prev]
              return updated.slice(0, 15)
            })
            reportLive()
          }
        } catch {
          reportFailure()
        }
      }

      eventSource.onerror = () => {
        reportFailure()
      }
    } catch {
      reportFailure()
    }

    reportFailure()
    const freshnessInterval = window.setInterval(() => {
      if (lastSuccessAt === undefined) return
      reportSource({
        source: "wikipedia-recent-changes",
        status: resolveSourceStatus("CACHED", lastSuccessAt),
        timestamp: lastSuccessAt,
        checkedAt: Date.now(),
      })
    }, 60 * 1000)

    return () => {
      isMounted = false
      window.clearInterval(freshnessInterval)
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [onSourceMeta])

  return (
    <div className="bg-background flex flex-col rounded-xl border border-border p-4 lg:col-span-8 xl:col-span-6">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
          <BookOpen className="h-4 w-4" />
          DIGITAL CONSCIOUSNESS
          <span className="rounded-md border border-border bg-muted px-2 py-1 text-[8px] text-muted-foreground">
            {status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[8px] font-bold tracking-widest uppercase ${status === "LIVE" ? "text-success" : "text-warning"}`}
          >
            {status === "LIVE" ? "STREAM CONNECTED" : "STREAM UNAVAILABLE"}
          </span>
          <div
            className={`h-2 w-2 rounded-full ${status === "LIVE" ? "bg-success animate-pulse" : "bg-warning"}`}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="mb-2 grid grid-cols-12 gap-4 border-b border-border pb-2 text-[8px] font-bold tracking-widest text-foreground/50">
          <div className="col-span-2">TIME</div>
          <div className="col-span-5">KNOWLEDGE ARTICLE</div>
          <div className="col-span-3">EDITOR</div>
          <div className="col-span-2 text-right">REGION</div>
        </div>

        <div className="hide-scrollbar flex h-[250px] flex-col space-y-1 overflow-y-auto">
          {edits.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center font-mono text-[10px] text-primary/50">
              <Activity className="h-6 w-6 animate-pulse" />
              {status === "UNAVAILABLE"
                ? "The Wikimedia recent-changes stream is unavailable."
                : "No Wikipedia edit records have been received."}
            </div>
          ) : (
            edits.map((edit) => {
              const langCode =
                (edit.server_url || "")
                  .replace("https://", "")
                  .split(".")[0]
                  ?.toUpperCase() || "??"
              return (
                <div
                  key={edit.id}
                  className="group grid grid-cols-12 items-start gap-4 rounded border border-transparent px-2 py-2 text-[9px] transition-colors hover:border-border hover:bg-muted/30"
                >
                  <div className="col-span-2 mt-0.5 font-mono text-primary/50">
                    {new Date(edit.timestamp).toLocaleTimeString([], {
                      hour12: false,
                    })}
                  </div>
                  <div className="col-span-5 flex flex-col">
                    <span className="leading-tight font-bold text-foreground transition-colors group-hover:text-primary">
                      {edit.title}
                    </span>
                    <span className="mt-1 line-clamp-1 text-[7px] text-foreground/40 italic">
                      {edit.comment || "No comment"}
                    </span>
                  </div>
                  <div className="col-span-3 mt-0.5 truncate font-mono text-foreground">
                    {edit.user}
                  </div>
                  <div className="col-span-2 mt-0.5 text-right">
                    <span className="rounded-sm bg-muted/30 px-1.5 py-0.5 text-[7px] font-black text-foreground">
                      {langCode}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
