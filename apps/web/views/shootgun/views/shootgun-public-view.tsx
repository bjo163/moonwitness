"use client"

import { useEffect, useState } from "react"
import { ExternalLink, ImageOff, ScrollText, ShieldAlert } from "lucide-react"
import { moonClientInstance } from "@moon/client"

type Operation = {
  id: number
  name: string
  argument?: string
  targetUrl?: string
  targetImage?: string
  wisdom?: string
  verseIds?: number[]
}

export function ShootgunPublicView() {
  const client = moonClientInstance
  const [operations, setOperations] = useState<Operation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client
      .model<Operation>("sg.operation")
      .fetch()
      .then((result: any) => setOperations(Array.isArray(result) ? result : []))
      .catch((error: any) => console.error("Unable to load operations:", error))
      .finally(() => setLoading(false))
  }, [client])

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <header className="border-b border-border pb-6">
        <div className="flex items-center gap-3 text-primary">
          <ShieldAlert className="size-5" />
          <span className="text-xs font-semibold tracking-[0.18em]">
            MOON SHOOTGUN
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-white">
          Operation Archive
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Public record of documented operations, their arguments, and
          cross-scripture wisdom.
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-slate-400">Loading operations...</p>
      ) : operations.length === 0 ? (
        <div className="border border-dashed border-border px-5 py-10 text-center text-sm text-slate-400">
          No public operation records are available.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {operations.map((operation) => (
            <article
              key={operation.id}
              className="overflow-hidden border border-border bg-slate-950/70"
            >
              {operation.targetImage ? (
                <img
                  src={operation.targetImage}
                  alt={operation.targetName || "Operation target image"}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 items-center justify-center bg-muted text-primary/40">
                  <ImageOff className="size-8" />
                </div>
              )}
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-medium tracking-[0.14em] text-primary">
                    OPERATION
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {operation.name}
                  </h2>
                </div>
                {operation.argument && (
                  <p className="text-sm leading-6 text-slate-300">
                    {operation.argument}
                  </p>
                )}
                {operation.wisdom && (
                  <div className="border-l-2 border-amber-300/70 pl-3 text-sm leading-6 text-amber-100/85">
                    {operation.wisdom}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <ScrollText className="size-3.5 text-primary" />
                    {operation.verseIds?.length ?? 0} verse reference(s)
                  </span>
                  {operation.targetUrl && (
                    <a
                      href={operation.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:text-primary"
                    >
                      Target <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
