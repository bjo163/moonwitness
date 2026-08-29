"use client"

import { useEffect, useState } from "react"
import { apiGet } from "@moon/client"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui"

type Surah = { number: number; name: string; nameOriginal?: string; versesCount?: number; revelationType?: string }

export function ScripturesView() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    apiGet<{ surahs?: Surah[] }>("/api/witness/quran/surahs")
      .then((response) => setSurahs(response.surahs || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return <div className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-wider text-primary">Content inspection</p><h1 className="mt-1 text-2xl font-semibold">Scripture</h1><p className="mt-2 text-sm text-muted-foreground">Read-only structure from the public Witness API. Canonical source text is not edited in this screen.</p></header>{error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Scripture data is temporarily unavailable.</p>}<Card><CardHeader><CardTitle className="text-base">Available surahs</CardTitle></CardHeader><CardContent>{loading ? <p className="text-sm text-muted-foreground">Loading source data…</p> : surahs.length === 0 ? <p className="text-sm text-muted-foreground">No scripture is available.</p> : <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{surahs.map((surah) => <div key={surah.number} className="rounded-lg border border-border p-3"><div className="flex justify-between gap-3"><span className="font-mono text-xs text-muted-foreground">{surah.number}</span><span className="text-xs text-muted-foreground">{surah.versesCount ?? "—"} ayahs</span></div><p className="mt-2 font-medium">{surah.name}</p>{surah.nameOriginal && <p lang="ar" dir="rtl" className="font-arabic text-lg text-muted-foreground">{surah.nameOriginal}</p>}<p className="mt-1 text-xs text-muted-foreground">{surah.revelationType || "Revelation type unavailable"}</p></div>)}</div>}</CardContent></Card></div>
}

export const ErpScripturesView = ScripturesView
