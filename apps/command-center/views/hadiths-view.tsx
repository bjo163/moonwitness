"use client"

import { useEffect, useState } from "react"
import { apiGet } from "@moon/client"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui"

type Collection = { id?: number; slug: string; name: string; totalItems?: number; gradeLevel?: string }

export function HadithsView() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    apiGet<{ books?: Collection[] }>("/api/witness/hadith/books")
      .then((response) => setCollections(response.books || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return <div className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-wider text-primary">Content inspection</p><h1 className="mt-1 text-2xl font-semibold">Tradition collections</h1><p className="mt-2 text-sm text-muted-foreground">Read-only collection metadata from the Witness API. Upstream canonical records remain immutable here.</p></header>{error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Hadith collection data is temporarily unavailable.</p>}<Card><CardHeader><CardTitle className="text-base">Available collections</CardTitle></CardHeader><CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading source data…</p> : collections.length === 0 ? <p className="text-sm text-muted-foreground">No tradition collections are available.</p> : <div className="grid gap-3 sm:grid-cols-2">{collections.map((collection) => <div key={collection.slug || collection.id} className="rounded-lg border border-border p-4"><p className="font-medium">{collection.name}</p><p className="mt-2 text-sm text-muted-foreground">{collection.totalItems ?? "—"} records{collection.gradeLevel ? ` · ${collection.gradeLevel}` : ""}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{collection.slug}</p></div>)}</div>}</CardContent></Card></div>
}

export const ErpHadithsView = HadithsView
