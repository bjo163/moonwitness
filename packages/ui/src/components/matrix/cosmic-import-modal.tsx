"use client"

import React, { useState } from "react"
import { X, UploadCloud, ArrowRight, CheckCircle2, AlertCircle, Play, Loader2 } from "lucide-react"
import type { ModelSchema } from "@workspace/types"
import { apiPost } from "@moon/client"
import { APP_PORTS } from "@workspace/types"

const getApiBase = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return `http://127.0.0.1:${APP_PORTS.API_BACKEND}`
}

export interface CosmicImportModalProps {
  isOpen: boolean
  onClose: () => void
  schema: ModelSchema
  onImportSuccess?: () => void
}

export function CosmicImportModal({
  isOpen,
  onClose,
  schema,
  onImportSuccess,
}: CosmicImportModalProps) {
  const [csvText, setCsvText] = useState("")
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<string[][]>([])
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [importStats, setImportStats] = useState<{ success: number; failed: number } | null>(null)

  const schemaFieldOptions = Object.entries(schema.fields)
    .filter(([_, f]) => !f.invisible && f.type !== "one2many" && f.type !== "many2many")
    .map(([k, f]) => ({ key: k, label: f.label || k }))

  // Parse CSV text into headers and rows
  const parseCsv = (text: string) => {
    try {
      const lines = text
        .split(/\r\n|\n/)
        .map((l) => l.trim())
        .filter(Boolean)
      if (lines.length < 2) {
        setError("CSV must contain at least a header line and 1 data line.")
        return
      }

      // Simple CSV split handling quotes
      const splitLine = (l: string) => {
        const result: string[] = []
        let cur = ""
        let insideQuote = false
        for (let i = 0; i < l.length; i++) {
          const char = l[i]
          if (char === '"') {
            insideQuote = !insideQuote
          } else if (char === "," && !insideQuote) {
            result.push(cur.trim().replace(/^"|"$/g, ""))
            cur = ""
          } else {
            cur += char
          }
        }
        result.push(cur.trim().replace(/^"|"$/g, ""))
        return result
      }

      if (!lines[0]) return
      const parsedHeaders = splitLine(lines[0])
      const parsedRows = lines.slice(1).map(splitLine)

      setHeaders(parsedHeaders)
      setRows(parsedRows)

      // Auto-map matching headers to schema keys
      const initialMap: Record<string, string> = {}
      parsedHeaders.forEach((h) => {
        const cleanH = h.toLowerCase().replace(/[^a-z0-9]/g, "")
        const match = schemaFieldOptions.find((f) => {
          const cleanF = f.key.toLowerCase().replace(/[^a-z0-9]/g, "")
          const cleanLabel = f.label.toLowerCase().replace(/[^a-z0-9]/g, "")
          return cleanF === cleanH || cleanLabel === cleanH
        })
        if (match) {
          initialMap[h] = match.key
        } else {
          initialMap[h] = "IGNORE"
        }
      })
      setFieldMappings(initialMap)
      setError(null)
    } catch (e: any) {
      setError(`CSV Parse Error: ${e.message || e}`)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvText(text)
      parseCsv(text)
    }
    reader.readAsText(file)
  }

  const handleExecuteImport = async () => {
    setImporting(true)
    setProgress(0)
    setError(null)
    setImportStats(null)

    let successCount = 0
    let failedCount = 0

    // Construct records from mapped rows
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!row) continue
      const rec: Record<string, any> = {}

      headers.forEach((h, hIdx) => {
        const mappedKey = fieldMappings[h]
        if (mappedKey && mappedKey !== "IGNORE" && row[hIdx] !== undefined) {
          rec[mappedKey] = row[hIdx]
        }
      })

      try {
        await apiPost(`${getApiBase()}/api/${schema.name}`, rec)
        successCount++
      } catch (err) {
        failedCount++
      }

      setProgress(Math.round(((i + 1) / rows.length) * 100))
    }

    setImporting(false)
    setImportStats({ success: successCount, failed: failedCount })
    if (onImportSuccess && failedCount === 0) {
      setTimeout(onImportSuccess, 1200)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30">
          <div>
            <span className="text-[10px] text-primary font-mono tracking-wider uppercase">
              {schema.name} • Batch Import Wizard
            </span>
            <h2 className="text-lg font-bold text-foreground">
              Import CSV Dataset
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-sans">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {importStats && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                Import complete: {importStats.success} records created, {importStats.failed} failed.
              </span>
            </div>
          )}

          {/* Upload or Paste */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 border border-dashed border-border rounded-xl bg-muted/20 flex flex-col items-center justify-center text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-primary" />
              <span className="font-semibold text-foreground">Select .CSV File</span>
              <p className="text-[10px] text-muted-foreground">Upload UTF-8 comma-separated file</p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="text-[10px] text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:bg-primary/10 file:text-primary file:font-semibold file:cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Or paste raw CSV content:</span>
              <textarea
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value)
                  setError(null)
                  setImportStats(null)
                }}
                placeholder="name,priority,stageId&#10;System Optimization,high,1&#10;Security Patch,critical,2"
                rows={4}
                className="w-full bg-background border border-border rounded-lg p-2.5 text-foreground text-[11px] font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Header Mapping Section */}
          {headers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 pb-1">
                <span className="font-semibold text-primary uppercase text-[11px]">Field Mapping Configuration</span>
                <span className="text-[10px] text-muted-foreground">{rows.length} rows detected</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {headers.map((h) => (
                  <div key={h} className="flex items-center justify-between gap-2 p-2 bg-muted/30 border border-border/40 rounded-lg">
                    <span className="font-medium text-foreground truncate max-w-[120px] text-xs">{h}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <select
                      value={fieldMappings[h] || "IGNORE"}
                      onChange={(e) => setFieldMappings((prev) => ({ ...prev, [h]: e.target.value }))}
                      className="bg-card border border-border rounded-md px-2 py-1 text-foreground text-[11px] focus:outline-none"
                    >
                      <option value="IGNORE">-- Do Not Import --</option>
                      {schemaFieldOptions.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {importing && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-primary font-bold">
                <span>Importing dataset...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                <div
                  className="bg-primary h-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/30">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary border border-border rounded-lg text-secondary-foreground hover:bg-accent text-xs font-medium transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleExecuteImport}
            disabled={importing || rows.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-all shadow-sm text-xs"
          >
            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>Import {rows.length} Records</span>
          </button>
        </div>
      </div>
    </div>
  )
}
